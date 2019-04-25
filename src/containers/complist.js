import React from 'react'
import PanelContainer from '../components/common/PanelContainer';
import Panel from '../components/common/Panel.js';
import EditorComponentView from "../components/EditorComponentView";
import ViewerComponentView from "../components/ViewerComponentView.js";
import pure from 'react-pure-component'
import R from 'ramda'

const getComponentRefId = (id) => `component${id}`;

export default pure(({
      renderMode, 
      editToggleComponent, 
      addComponent, 
      selectActive,
      unSelectAll, 
      moveComponent, 
      removeComponent,
      appendTextComponentAtEnd,
      pageId,
      pageProperties,
      config,
      userId,
      comps,
      previewMode,
      updateContentState,
      selectedHash,
      aggressiveComponentSave,
      runPendingAction
    })=>{
      const componentViewProps = {
        editToggleComponent,
        removeComponent,
        addComponent,
        pageId,
        pageProperties,
        config,
        userId,
        updateContentState,
        runPendingAction,
      }

      return (
        <PanelContainer noControls={true} gutterBottom={false} collapseBottom={false}>
          <Panel style={{padding: 10}}>
            { comps.size == 0 ? (<p className='text-center fg-darkgray50'>
                                    <br/>
                                    <br/>Click the elements below to add to the Page<br/>
                                    <br/>
                                  </p>) : null }

            { R.map((comp, index) =>{
                const compProps = {
                  comp,
                  key:comp.get('hash'),
                  selectedHash,
                  ref:getComponentRefId(comp.get('hash')),
                  index,
                }

                const saveVersion = aggressiveComponentSave.get(comp.get('hash'))

                return (<div>
                    {renderMode == 'editor' ? <EditorComponentView {...componentViewProps}
                                                  {...compProps}
                                                  saveVersion={saveVersion}
                                                  selectActive={selectActive}
                                                  unSelectAll={unSelectAll}
                                                  moveComponent={moveComponent}
                                                  appendTextComponentAtEnd={appendTextComponentAtEnd} 
                                                  />
                                              : <ViewerComponentView {...componentViewProps}
                                                  {...compProps}
                                                  saveVersion={saveVersion}
                                                  previewMode={previewMode}
                                                  />
                    }
                </div>)
              })(comps)
            }
          </Panel>
        </PanelContainer>
      );
})