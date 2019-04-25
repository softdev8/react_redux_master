function getExtension(filename) {
  return filename.split('.').pop();
}

export default function (filename) {
  const extension = getExtension(filename).toLowerCase();

  switch (extension) {
    case 'js':
    case 'jsx':
      return 'jsx';

    case 'html':
      return 'html';

    case 'css':
    case 'scss':
    case 'sass':
      return 'css';

    case 'svg':
    case 'xml':
      return 'xml';

    default:
      return 'javascript';
  }
}

// TODO: Typescript
// TODO: Markdown - in view mode, show the preview.
