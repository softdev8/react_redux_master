/* @flow weak */
/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import {Record} from 'immutable';
import {sizeFct} from '../size';

export const _ImageRecord = Record({
  _size: undefined,
  src: undefined,
  server_src: undefined,
});

class ImageRecord extends _ImageRecord {
  getSize() {
    return this.get('_size');
  }

  updateImageServerSrc(server_src) {
    return imImageFct(this.update('server_src', ()=> server_src));
  }

  updateSrc(src) {
    return imImageFct(this.update('src', ()=> src));
  }

  updateSize(size) {
    return imImageFct(this.update('_size', ()=> {
      return sizeFct(size);
    }));
  }

  rotate(degree, src) {
    if (degree == 180 || degree == 360 || degree == 0) {
      return this;
    }
    return imImageFct(this.update('_size', (size)=> sizeFct({
      width: size.get('height'),
      height: size.get('width'),
    })).updateSrc(src)
    );
  }

  crop(src, size) {
    return imImageFct(this.update('_size', ()=>sizeFct(size))
      .update('src', ()=>src));
  }
}

export function imImageFct(obj) {
  return new ImageRecord({
    _size: obj.get('_size'),
    src: obj.get('src'),
    server_src: obj.get('server_src'),
    originalSize: obj.get('originalSize'),
  });
}

export const imageFct = ({size, src})=>
  new ImageRecord({
    _size: sizeFct(size),
    rotate: 0,
    originalSize: sizeFct(size),
    src,
  });
