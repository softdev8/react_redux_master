export default function (author_id, collection_id, id, is_draft) {
  const previewMode = is_draft ? '/draft' : '';

  return {
    viewUrl : `/collection/page/${author_id}/${collection_id}/${id}${previewMode}`,
    editUrl : `/pageeditor/${collection_id}/${id}`,
  };
}
