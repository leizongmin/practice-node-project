import marked from 'marked';

export function redirectURL(url) {
  location = url;
}

export function renderMarkdown(text) {
  return marked(text);
}
