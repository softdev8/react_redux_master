import R from 'ramda'
import React from 'react';
import Radium from 'radium';
import pure from 'react-pure-component';
import Color from "color"
const indigo = Color('indigo').lighten(0.1).clearer(0.2);

let colorIndex = 30;
export const getNextColor = ()=> {
  const res = indigo.clone().rotate(colorIndex).hslString()
  colorIndex += 25;
  return res;
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export const getRandomColor = ()=> {
  return indigo.clone().rotate(getRandomArbitrary(0, 360)).hslString();
};

export const CreateNamedComponent = (name)=>pure(({children}) => (
  <div>
    {name}
  </div>
));

export const clone = (elem)=>React.cloneElement(elem);

export const mapFunc = R.curry((map, mode)=> {
  return map[mode]()
});

export const mapDispatchFunc = R.curry((dispatch, map)=>
    mapFunc(
      R.compose(R.fromPairs,
        R.map(([key, val])=>[key, ()=>dispatch(val)]),
        R.toPairs)
      (map)
    )
);

export const invertObject = (obj)=> {
  let newObj = {};
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[obj[prop]] = prop;
    }
  }
  return newObj;
};

export const radPure = R.compose(Radium, pure);
