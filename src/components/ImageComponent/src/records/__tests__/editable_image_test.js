import chai from 'chai';
import {editableImageFct} from '../editableImage';
const expect = chai.expect;

describe.only('editableImage', ()=> {
  it('should create', ()=> {
    const editableImage = editableImageFct({
      annotations: [],
      image: {src: 'someurl', size: {width: 100, height: 100}},
    });

    expect(editableImage).to.eql(editableImage);
  });

  it('should crop', ()=> {
    const editableImage = editableImageFct({
      annotations: [],
      image: {src: 'someurl', size: {width: 100, height: 100}},
    });

    expect(editableImage.crop('someurl', {width: 50, height: 50}).getSize().toJS()).to.eql({width: 50, height: 50});
  });
});
