import React from 'react'
import { SVG } from '../components/widgets';
import EducativeUtil from '../components/common/ed_util';
import {allComponents, defaultComponents} from './componentList';
import svgComponents from './svgComponents';

export function getAllComponentsSupportingAssessment() {
  const result = $.grep(allComponents, (e)=> e.allows_assessment === true);  
  const types = [];
  for(let i=0; i < result.length; i++) {
    types.push(result[i].type);
  }
  return types;
}

export function getComponentMeta (type) {
  if (type.indexOf("svg-") != -1) {
    const result = $.grep(svgComponents, (e)=> e.type === type);  
    if (result.length == 0) {
      throw "Error";
    } else if (result.length == 1) {
      const contentVal = SVG.getComponentCustom(result[0].svg_string);
      const svgComponent = EducativeUtil.cloneObject(getComponentMeta('SVG'));
      svgComponent.defaultVal.content = contentVal;
      return svgComponent;
    } else {
      throw "Error";
    }
  }

  const result = $.grep(allComponents, (e)=> e.type === type);
  if (result.length == 0) {
    throw "Error";
  } else if (result.length == 1) {
    return result[0];
  } else {
    throw "Error";
  }
}

export const getAllComponentsMeta = () => {
  const result = $.grep(allComponents, (e) => e.pageSupport === true);
  if (result.length == 0) {
    throw "Error";
  }

  return result;
}

export const getDefaultComponentsMeta = () => {
  const result = $.grep(defaultComponents, (e) => e.pageSupport === true);
  if (result.length == 0) {
    throw "Error";
  }

  return result;
}

export const getCanvasSupportedComponentsMeta = () =>{
  const result = $.grep(allComponents, (e) => e.canvasSupport === true);

  //All svgs are supported on canvas
  for (let i = 0; i < svgComponents.length; i++) {
    result.push(svgComponents[i]);
  }

  if (result.length == 0) {
    throw "Error";
  }
  return result;
}

export const getWidgetTitleByType = type => {
  const widget = allComponents.filter( (widget, i) => {
    return widget.type == type;
  });

  return widget.length && widget[0].title;
}