import styles from './CompList.module.scss';

import React from 'react';
import pure from 'react-pure-component';

import PanelContainer from '../../common/PanelContainer';
import Panel from '../../common/Panel';
import EditorComponentView from '../EditorComponentView/EditorComponentView';
import ViewerComponentView from '../ViewerComponentView/ViewerComponentView';
import AddWidget from '../AddWidgetButton/AddWidgetButton';

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
      pageProperties,
      config,
      pageId,
      authorId,
      collectionId,
      comps,
      default_themes,
      isDraft,
      updateContentState,
      selectedHash,
      aggressiveComponentSave,
      runPendingAction,
      popoverContent
    })=>{
      const componentViewProps = {
        editToggleComponent,
        removeComponent,
        addComponent,
        pageProperties,
        config,
        pageId,
        authorId,
        collectionId,
        default_themes,
        updateContentState,
        runPendingAction,
      }

      const view = comps.map((comp, index) =>{
        const compProps = {
          comp,
          key:comp.get('hash'),
          selectedHash,
          ref:getComponentRefId(comp.get('hash')),
          index,
        }

        const saveVersion = aggressiveComponentSave.get(comp.get('hash'))
        
        return renderMode == 'editor' ? <EditorComponentView {...componentViewProps}
                                                  {...compProps}
                                                  key={`ECV${comp.get('hash')}`}
                                                  saveVersion={saveVersion}
                                                  selectActive={selectActive}
                                                  unSelectAll={unSelectAll}
                                                  moveComponent={moveComponent}
                                                  appendTextComponentAtEnd={appendTextComponentAtEnd} 
                                                  isDraft={isDraft}
                                                  popoverContent={popoverContent}
                                                  />
                                              : <ViewerComponentView {...componentViewProps}
                                                  {...compProps}
                                                  saveVersion={saveVersion}
                                                  isDraft={isDraft}
                                                  />
      });

      return (
        <div className={styles.complist}>
          { comps.size == 0 && renderMode =='editor'? (
              <div className={styles['add-widget-wrapper']}>
                <AddWidget showButton={true} index={-1} text='click to add widget'
                           addComponent={addComponent} default_themes={default_themes} panelPosition='bottom'/>
              </div> ) : null }
          { comps.size == 0 && renderMode == 'viewer'? <div>
              <div className={styles.emptyline}></div>
              <div className={styles.emptyline}></div>
              <div className={styles.emptyline} style={{width: '70%'}}></div>
            </div> : null }
          { view.size > 0 ? view.toArray() : null }
        </div>
      );
})