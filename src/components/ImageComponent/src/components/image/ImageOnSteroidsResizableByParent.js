import React from 'react'

import pure from 'react-pure-component';
import ImageOnSteroids from '../ImageOnSteroids';
import {ResizeByParent} from 'react-size-decorator';

export default pure((props) => {
    const {editableImage} = props;

    return <ResizeByParent>
      {({width, height})=> {
        const scaledEditableImage = editableImage ?
          editableImage.adjustSize(editableImage.getSize().toJS(), {width, height}) : null;

        let newProps = props;
        newProps.editableImage = scaledEditableImage;
        delete newProps.domInfo;

        return <ImageOnSteroids {...newProps}/>
      }}
    </ResizeByParent>
});
