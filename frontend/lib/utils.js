import marked from 'marked';
import Highlight from 'highlight.js';

export function redirectURL(url) {
  location = url;
}

marked.setOptions({
  highlight: function (code) {
    return Highlight.highlightAuto(code).value;
  }
});

export function renderMarkdown(text) {
  return marked(text);
}
