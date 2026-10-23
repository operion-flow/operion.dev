const markdownType = 'text/markdown; charset=utf-8';

function weights(accept) {
  const found = { markdown: 0, html: 0 };

  for (const range of (accept ?? '').split(',')) {
    const [type, ...params] = range.split(';').map((part) => part.trim().toLowerCase());
    const q = params.find((param) => param.startsWith('q='));
    const weight = q ? Number(q.slice(2)) : 1;

    if (type === 'text/markdown') found.markdown = Math.max(found.markdown, weight);
    if (type === 'text/html') found.html = Math.max(found.html, weight);
  }

  return found;
}

export function prefersMarkdown(accept) {
  const { markdown, html } = weights(accept);

  return markdown > 0 && markdown >= html;
}

export function markdownPath(pathname) {
  const path = pathname.replace(/\.html$/, '').replace(/\/+$/, '');

  return path === '' ? '/index.md' : `${path}.md`;
}

function withHeaders(response, headers) {
  const copy = new Response(response.body, response);
  for (const [name, value] of Object.entries(headers)) copy.headers.set(name, value);

  return copy;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.endsWith('.md')) {
      const asset = await env.ASSETS.fetch(request);

      return asset.ok ? withHeaders(asset, { 'Content-Type': markdownType }) : asset;
    }

    if (prefersMarkdown(request.headers.get('Accept'))) {
      const markdown = await env.ASSETS.fetch(new Request(new URL(markdownPath(url.pathname), url), request));

      if (markdown.ok) return withHeaders(markdown, { 'Content-Type': markdownType, Vary: 'Accept' });
    }

    const asset = await env.ASSETS.fetch(request);
    const type = asset.headers.get('Content-Type') ?? '';

    return type.startsWith('text/html') ? withHeaders(asset, { Vary: 'Accept' }) : asset;
  },
};
