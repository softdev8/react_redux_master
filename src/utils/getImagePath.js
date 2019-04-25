import assert from './assert'

export default function(isCollectionArticle, isDraft, user_id, page_id, image_id, collection_id){
	assert(isCollectionArticle? collection_id : true, "if its a collection article then collection_id should be passed");
  assert(!isDraft ? user_id : true, "if its not a draft article then user_id should be passed in");

	if(isCollectionArticle) {
        return isDraft? `/api/author/collection/${collection_id}/page/${page_id}/image/${image_id}`
                        :`/api/collection/${user_id}/${collection_id}/page/${page_id}/image/${image_id}`;
	} else {
      	return isDraft? `/api/author/page/${page_id}/image/${image_id}`
                      :`/api/page/${user_id}/${page_id}/image/${image_id}`;
    }

    return null;
}