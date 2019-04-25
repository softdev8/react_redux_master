import React, {Component, PropTypes} from 'react'
import pure from 'react-pure-component';

import Icon from '../../common/Icon';
import Button from '../../common/Button';
import ReactScriptHelper from '../../common/reactscripthelper';
import ArticlePageSummary from '../ArticlePageSummary/ArticlePageSummary';
import CompList from '../CompList/CompList';
import PageEditorToolbar from '../PageEditorToolbar/PageEditorToolbar';
import Helmet from 'react-helmet';

const getScripts = ()=> {
  if (window.DEBUG) {
    const scripts = [
      'http://localhost:4444/static/dist/js/vendor/viz/viz.js',
      'http://localhost:4444/static/dist/js/vendor/fabricjs/fabric.min.js',
      'http://localhost:4444/static/dist/js/vendor/fabricjs/lib/aligning_guidelines.js',
      'http://localhost:4444/static/dist/js/method-draw/embedapi.js',
      'http://localhost:4444/static/dist/js/vendor/vanilla-color-picker/vanilla-color-picker.js',
    ];

    return scripts;
  }

  return [
    '/js/vendor/viz/viz.js',
    '/js/vendor/vanilla-color-picker/vanilla-color-picker.js',
    '/js/vendor/fabricjs/fabric.min.js',
    '/js/vendor/fabricjs/lib/aligning_guidelines.js',
    '/js/method-draw/embedapi.js',
  ];
}

export default pure(({
    scriptsLoadedFailed,
    scriptsLoaded,
    onScriptsLoaded,
    onScriptsLoadError,
    handlePageSummaryChange,
    pageProperties,
    onPagePropertyChange,
    pageSummary,
    pageId,
    authorId,
    collectionId,
    comps,
    default_themes,
    aggressiveComponentSave,
    editToggleComponent,
    removeComponent,
    moveComponent,
    appendTextComponentAtEnd,
    updateContentState,
    addComponent,
    children,
    selectActive,
    unSelectAll,
    selectedHash,
    runPendingAction,
    isCollectionArticle,
    isDraft,
    popoverContent
  })=>{
    if (scriptsLoadedFailed) {
      // assert
    }

    if (scriptsLoaded == false) {
      return <ReactScriptHelper scripts={getScripts()}
                                onScriptsLoaded={onScriptsLoaded}
                                onScriptsLoadError={onScriptsLoadError}/>;
    }

    const isDemo = false;

    const config = {
      inEditor: true,
    };

    const compListParams = {
      renderMode : 'editor',
      ref : 'componentsList',
      addComponent,
      pageId,
      authorId,
      collectionId,
      pageProperties,
      config,
      comps,
      default_themes,
      editToggleComponent,
      removeComponent,
      moveComponent,
      appendTextComponentAtEnd,
      updateContentState,
      selectActive,
      unSelectAll,
      selectedHash,
      aggressiveComponentSave,
      runPendingAction,
      isDraft,
      popoverContent
    }

    let pageTitle = pageSummary.get('title') ?
                    pageSummary.get('title') :
                    'Educative.io | Untitled';
    pageTitle += ' - Draft';

    return (
      <div className='b-page__content no-padding'>
        <div className='container'>
          <Helmet
            title={pageTitle}
            meta={[{property: 'og:title', content: pageTitle}]}
          />
          <PageEditorToolbar pageProperties={pageProperties} onPagePropertyChange={onPagePropertyChange} />
          <ArticlePageSummary mode='edit' pageSummary={pageSummary} pageProperties={pageProperties} handlePageSummaryChange={handlePageSummaryChange} isCollectionArticle={isCollectionArticle}/>
          <CompList {...compListParams}/>
          <div style={{marginBottom:80}}/>
          {children}
        </div>
      </div>
    );
})
