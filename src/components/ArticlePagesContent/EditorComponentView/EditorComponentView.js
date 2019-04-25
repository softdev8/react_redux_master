import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import pure from 'react-pure-component';

import ComponentPanelContainer from '../ComponentPanel/ComponentPanel';
import EdComponent from '../../EdComponent';

import {getWidgetTitleByType} from '../../../component_meta';

const _Component = pure(({
  comp,
  moveComponent,
  editToggleComponent,
  addComponent,
  removeComponent,
  selectActive,
  updateContentState,
  default_themes,
  unSelectAll,
  index,
  selectedHash,
  popoverContent,
  ...rest
})=>{
    const hash = comp.get('hash');
    const isSelected = selectedHash === comp.get('hash');
    const title = getWidgetTitleByType(comp.get('type'));
    return (
     <ComponentPanelContainer isSelected={isSelected}
                             selectActive={selectActive}
                             key={`CPC${hash}`}
                             hash={hash}
                             id={hash}
                             default_themes={default_themes}
                             unSelectAll={unSelectAll}
                             mode={comp.get('mode')}
                             editToggleComponent={()=>editToggleComponent({hash})}
                             addComponent={addComponent}
                             duplicateComponent={(payload)=>{
                              payload.data = comp.toJS();
                              payload.data.mode = 'view';

                              //remove iteration from the duplicated payload
                              if(payload.data.iteration || payload.data.iteration >= 0){
                                delete payload.data.iteration;
                              }

                              //remove hash from the duplicated payload
                              if(payload.data.hash || payload.data.hash >= 0){
                                delete payload.data.hash;
                              }

                              return addComponent(payload);}
                             }
                             removeComponent={()=>removeComponent({hash})}
                             index={index}
                             title={title}
                             moveComponent={moveComponent}
                             popoverContent={popoverContent}>
        <EdComponent {...rest}
                     comp={comp}
                     index={index}
                     editToggleComponent={()=>editToggleComponent({hash})}
                     addComponent={()=>addComponent({parentHash:hash})}
                     removeComponent={()=>removeComponent({hash})}
                     updateContentState={(data)=>updateContentState({hash, data})}
                     mode={comp.get('mode')}
                     iteration={comp.get('iteration')}
                     default_themes={default_themes}
                     key={`EDC${hash}`}
                     ref="componentRef"/>
      </ComponentPanelContainer>)
  }
)


 export default DragDropContext(HTML5Backend)(_Component);
