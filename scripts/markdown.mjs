import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

const contentDir = 'content/docs';
const outDir = 'out';

async function mdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return mdxFiles(path);
      return entry.name.endsWith('.mdx') ? [path] : [];
    }),
  );

  return nested.flat();
}

function frontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: source };

  const data = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator > 0) data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }

  return { data, body: source.slice(match[0].length) };
}

function attribute(tag, name) {
  return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? '';
}

function outsideCode(markdown, transform) {
  return markdown
    .split(/(^```[\s\S]*?^```)/m)
    .map((part, index) => (index % 2 === 1 ? part : transform(part)))
    .join('');
}

function components(markdown, file) {
  return outsideCode(markdown, (text) => {
    const converted = text
      .replace(/<Callout(?:\s+type="(\w+)")?\s*>\n?([\s\S]*?)\n?<\/Callout>/g, (_, type, inner) => {
        const label = type === 'warn' ? 'Warning' : 'Note';
        return inner
          .trim()
          .split('\n')
          .map((line, index) => `> ${index === 0 ? `**${label}:** ` : ''}${line}`.trimEnd())
          .join('\n');
      })
      .replace(/<Cards>\n?([\s\S]*?)<\/Cards>/g, (_, cards) =>
        [...cards.matchAll(/<Card\b[^>]*\/>/g)]
          .map(([card]) => `- [${attribute(card, 'title')}](${attribute(card, 'href')}): ${attribute(card, 'description')}`)
          .join('\n'),
      );

    const leftover = converted.replace(/`[^`\n]*`/g, '').match(/<[A-Z][A-Za-z]*\b/);
    if (leftover) throw new Error(`${file}: no markdown version for the ${leftover[0]}> component`);

    return converted;
  });
}

function page({ title, description }, body) {
  return [`# ${title}`, description, body.trim()].filter(Boolean).join('\n\n') + '\n';
}

async function write(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

for (const file of await mdxFiles(contentDir)) {
  const { data, body } = frontmatter(await readFile(file, 'utf8'));
  const slug = relative(contentDir, file).replace(/\.mdx$/, '').replace(/(^|\/)index$/, '');
  const target = slug ? join(outDir, 'docs', `${slug}.md`) : join(outDir, 'docs.md');

  await write(target, page(data, components(body, file)));
}

const home = JSON.parse(await readFile('app/(home)/home.json', 'utf8'));

await write(
  join(outDir, 'index.md'),
  page({ title: home.title, description: home.tagline }, [
    home.links.map((link) => `- [${link.label}](${link.href})`).join('\n'),
    ...home.features.map((feature) => `## ${feature.title}\n\n${feature.text}`),
  ].join('\n\n')),
);
