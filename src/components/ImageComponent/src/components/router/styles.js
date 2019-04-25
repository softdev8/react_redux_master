import Color from "color"
import {getNextColor} from "../utils"

const debugColor = true;
const indigo = Color('indigo').lighten(0.1).clearer(0.2);

export const SelectImageStyle = {
  flexBasis: 0,
  backgroundColor: debugColor && getNextColor(),
};

export const ModeToggleOptionsStyle = {
  flexBasis: 0,
  backgroundColor: debugColor && getNextColor(),
};

export const AnnotateOptionsStyle = {
  flexBasis: 0,
  backgroundColor: debugColor && getNextColor(),
};

export const EditOptionsStyle = {
  flexBasis: 0,
  backgroundColor: debugColor && getNextColor(),
  alignItems: 'center',
};

export const dropZoneStyle = {
  backgroundColor: debugColor && getNextColor(),
  alignItems: 'center',
  justifyContent: 'center',
  flexBasis: 0,
  flexGrow: 2,
  minWidth: 150,
};

export const CaruselStyle = {
  backgroundColor: debugColor && getNextColor(),
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 5,
  flexBasis: 0,
};

export const ToggleModeStyle = {
  backgroundColor: debugColor && getNextColor(),
  flexGrow: 0.5,
  minHeight: 24,
  flexBasis: 0,
  alignItems: 'center',
  justifyContent: 'center',
};

export const OptionsStyle = {
  flexGrow: 3,
  flexBasis: 0,
  backgroundColor: debugColor && getNextColor(),
};

export const PaneStyle = {
  backgroundColor: debugColor && getNextColor(),
  flexGrow: 3,
  flexBasis: 0,
};

export const TopStyle = {
  //backgroundColor: debugColor && getNextColor(),
  flexGrow: 5,

  flexBasis: 0,
};

export const BottomStyle = {
  flexGrow: 2,

  //backgroundColor: debugColor && getNextColor()
  flexBasis: 0,
};

//color.lighten(0.5)     // hsl(100, 50%, 50%) -> hsl(100, 50%, 75%)
//color.darken(0.5)      // hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)
//
//color.saturate(0.5)    // hsl(100, 50%, 50%) -> hsl(100, 75%, 50%)
//color.desaturate(0.5)  // hsl(100, 50%, 50%) -> hsl(100, 25%, 50%)
//color.greyscale()      // #5CBF54 -> #969696
//
//color.whiten(0.5)      // hwb(100, 50%, 50%) -> hwb(100, 75%, 50%)
//color.blacken(0.5)     // hwb(100, 50%, 50%) -> hwb(100, 50%, 75%)
//
//color.clearer(0.5)     // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
//color.opaquer(0.5)     // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 1.0)
//
//color.rotate(180)      // hsl(60, 20%, 20%) -> hsl(240, 20%, 20%)
//color.rotate(-90)      // hsl(60, 20%, 20%) -> hsl(330, 20%, 20%)
//
//color.mix(Color("yellow"))        // cyan -> rgb(128, 255, 128)
//color.mix(Color("yellow"), 0.3)   // cyan -> rgb(77, 255, 179)
