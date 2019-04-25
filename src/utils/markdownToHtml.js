const mk = require('markdown-it-katex');
const md = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  linkify: true,
  typographer: true
}).use(mk);

export default function (mdText) {
  try {
    return md.render(mdText);
  } catch (err) {
    console.error(err);
    return '';
  }
}
