import chai from 'chai';
import {rectangleBySizeFct, rectangleByPointsFct, rectangleFct} from '../rectangle';
import {sizeFct} from '../size';
import {pointFct} from '../point';
const expect = chai.expect;

describe('rectangle', ()=> {
  it('should give correct size', ()=> {
    const size = sizeFct({width: 10, height: 20});
    expect(rectangleBySizeFct(size.toJS()).getSize()).to.eql(size);
  });

  it('should containPoint', ()=> {
    expect(rectangleByPointsFct({top: 10, left: 5, right: 30, bottom: 40})
      .containPoint(pointFct({x: 6, y: 11}))).to.eql(true);
  });

  it('should containPoint 1', ()=> {
    let t = rectangleByPointsFct({top: 10, left: 5, right: 30, bottom: 40});
    expect(rectangleFct(t.toJS()).containPoint(pointFct({x: 6, y: 11}))).to.eql(true);
  });

  it('should be same', ()=> {
    const t = rectangleByPointsFct({top: 10, left: 5, right: 30, bottom: 40});
    expect(t.toJS()).to.eql(rectangleFct(t.toJS()).toJS());
  });

  it('should containRect', ()=> {
    expect(rectangleByPointsFct({top: 10, left: 5, right: 30, bottom: 40})
      .containRect(rectangleByPointsFct({top: 10, left: 5, right: 30, bottom: 40}))).to.eql(true);
  });
});
