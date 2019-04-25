import {NEW_CROP_INFO, IMAGE_CROP_REQUEST, IMAGE_CROP_MOUNTED, IMAGE_CROP_UNMOUNTED} from '../constants/crop';
import { createAction } from 'redux-actions';
import { imageModification } from '../ImagesActions';

function rotateBase64Image(base64data, degree, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const image = new Image();
    const type = 'image/png';
    const quality = 1;

    image.onload = function() {
        ctx.imageSmoothingEnabled = false;
        ctx.canvas.width  = image.width;
        ctx.canvas.height = image.height;
        ctx.translate(Math.floor(image.width / 2), Math.floor(image.height / 2));
        ctx.rotate(Math.PI / 180 * degree); 
        ctx.translate(Math.floor(-image.width / 2), Math.floor(-image.height / 2));
        ctx.drawImage(image, 0, 0, image.width,image.height);
        callback(canvas.toDataURL(type, quality))
    };

    image.src = base64data;
}

const makeModificationAction = (actionName)=> {
  createAction(actionName)
};

const modifyImage = ()=> {
  return (dispatch, getState) => {
    const imageCrop = getState().cropProcess.get('imageCrop');
    if (!imageCrop) return;

    const canvasData = imageCrop.cropper('getCanvasData');
    const cropBoxData = imageCrop.cropper('getCropBoxData');

    const relativeToImageLeft = cropBoxData.left - canvasData.left;
    const relativeToImageTop = cropBoxData.top - canvasData.top;
    const relativeToImageRight = relativeToImageLeft + cropBoxData.width;
    const relativeToImageBottom = relativeToImageTop + cropBoxData.height;

    const ratioToImageLeft = relativeToImageLeft / canvasData.width;
    const ratioToImageTop = relativeToImageTop / canvasData.height;
    const ratioToImageRight = relativeToImageRight / canvasData.width;
    const ratioToImageBottom = relativeToImageBottom / canvasData.height;
    const newUrl = imageCrop.cropper('getCroppedCanvas').toDataURL();
    dispatch(createAction('CROPPER_REPLACE')(newUrl));
    dispatch(imageModification(
      newUrl,
      {
        top: ratioToImageTop,
        left: ratioToImageLeft,
        right: ratioToImageRight,
        bottom: ratioToImageBottom,
      },
    ));
  }
};

export const imageRotateRequest = (degree)=> {
  return (dispatch, getState) => {
    let imageCrop = getState().cropProcess.get('imageCrop');
    let src = getState().images.get('currentImage').get('editableImage').get('image').get('src');

    const index = getState().images.get('index');
    
    rotateBase64Image(src, degree, (newSrc)=>{
      dispatch(createAction('RAW_IMAGE_MODIFICATION')({dataUrl:newSrc}));
      dispatch(createAction('CURRENT_IMAGE_ROTATE')(degree));
      dispatch(createAction('SAVE_CURRENT_IMAGE')());
    })
  }
};

let timer;
export const newCropInfo = ()=> {
  return (dispatch, getState) => {
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(()=>{
      timer = null;
      dispatch(createAction('NEW_CROP_INFO')())
    }, 1)
  }
};

export const imageCropRequest = ()=> {
  return (dispatch, getState) => {
    //dispatch(createAction('IMAGE_CROP_REQUEST')());
    modifyImage()(dispatch, getState)
  }
};

export const cropperReplace = (obj)=>createAction('CROPPER_REPLACE')(obj);
