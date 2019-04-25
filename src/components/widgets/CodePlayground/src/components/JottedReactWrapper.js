import styles from './JottedReactWrapper.module.scss';

import React from 'react';
import {findDOMNode} from 'react-dom';
import Jotted from 'jotted';
import $ from 'jquery';
import R from 'ramda';

import ReactScriptHelper from '../../../../common/reactscripthelper.js';
import InlineStatusControl from '../../../../commonUI/InlineStatusControl/InlineStatusControl';
import EducativeUtil from '../../../../common/ed_util';
import { Btn, SomethingWithIcon, Icons } from '../../../../index';

import 'jotted/jotted.css';
import CodeMirror from 'codemirror/lib/codemirror.js';
window.CodeMirror = CodeMirror;
import 'codemirror/lib/codemirror.css';

import hiddenjs from './plugins/hiddenjs';
import finaljs from './plugins/finaljs';
Jotted.plugin('hiddenjs', hiddenjs);
Jotted.plugin('finaljs', finaljs);


const getPanelTypeNode = (paneType, component) => $(findDOMNode(component)).find(`.jotted-editor-${paneType}`);
const getContent = (node) => node.find('textarea')[0].value;

const getPanelContent = (type, obj) => {
  return R.compose(getContent, getPanelTypeNode)(type, obj);
};

export default class JottedReactWrapper extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.getState = this.getState.bind(this);
    this.finalJsCallback = this.finalJsCallback.bind(this);
    this.countTotalPanes = this.countTotalPanes.bind(this);

    this.state = {
      scriptsLoaded : false,
      babelTransformedJs: null,
      playedCodes: [
        { HTML:       !props.hideHtml },
        { CSS:        !props.hideCss },
        { JavaScript: !props.hideJs },
        { Result:     !props.hideResult }
      ],
      oneLineActivePanes: [
        { HTML:       !props.hideHtml },
        { CSS:        !props.hideCss },
        { JavaScript: !props.hideJs },
        { Result:     !props.hideResult }
      ],
      twoLineActivePanes: [
        { HTML:       !props.hideHtml },
        { CSS:        !props.hideCss },
        { JavaScript: !props.hideJs },
        { Result:     !props.hideResult }
      ],
      mobilePanesBar: 'hide'
    };
  }

  componentWillReceiveProps({files, ...nextProps}){
    let playedCodes = [
          { HTML:       !nextProps.hideHtml },
          { CSS:        !nextProps.hideCss },
          { JavaScript: !nextProps.hideJs },
          { Result:     !nextProps.hideResult }
        ]
      , oneLineActivePanes = [
          { HTML:       !nextProps.hideHtml },
          { CSS:        !nextProps.hideCss },
          { JavaScript: !nextProps.hideJs },
          { Result:     !nextProps.hideResult }
        ]
      , twoLineActivePanes = [
          { HTML:       !nextProps.hideHtml },
          { CSS:        !nextProps.hideCss },
          { JavaScript: !nextProps.hideJs },
          { Result:     !nextProps.hideResult }
        ]
      ;

    if (playedCodes !== this.state.playedCodes) {
      this.setState({playedCodes, oneLineActivePanes, twoLineActivePanes});
    }

    this.setState({
      pendingFiles: files,
    }, ()=>{
      this.triggerJotted();
    });
  }

  componentWillUnmount() {
    if(this.state.jotted && this.state.jotted.off){
      this.state.jotted.off('change', this.onChange);
    }
    this.setState({
      node: null,
    });
  }

  countTotalPanes() {
    //This is count of panes that share the main column space. Console wont be counted
    //here as it shows in a separate row
    let totalPanesShown = 1;
    if (this.props.hideResult){
      totalPanesShown--;
    }

    this.props.files.forEach((file)=>{
      if (file.content) {
        if (file.type === 'html' && this.props.hideHtml) {
          return;
        } else if (file.type === 'css' && this.props.hideCss) {
          return;
        } else if (file.type === 'js' && this.props.hideJs) {
          return;
        }

        totalPanesShown++;
      }
    });

    return totalPanesShown;
  }

  finalJsCallback(content) {
    this.setState({
      babelTransformedJs : content,
    });
  }

  getState() {
    return {
      files: ['js', 'html', 'css']
        .sort(({ type }) => type)
        .map(type => ({
        type,
        content: getPanelContent(type, this),
      })),

      plugins: this.props.plugins,
    };
  }

  onChange(params, callback) {
    callback(null, params);

    const { files } = this.getState();

    if(this.props.onFilesUpdate &&
      JSON.stringify(this.props.files.sort(({ type }) => type)) !== JSON.stringify(files)){
      this.props.onFilesUpdate(files);
    }
  }

  triggerJotted () {
    if (!this.state.jotted || !this.state.jotted._set || !this.state.pendingFiles) {
      return;
    }

    const oldOptions = this.state.jotted._get('options');

    oldOptions.files = this.state.pendingFiles
    this.state.jotted._set('options', oldOptions);

    this.state.pendingFiles.forEach((file)=>{
      const oldContent = getPanelContent(file.type, this);
      if(!file.content && !oldContent || JSON.stringify(oldContent) === JSON.stringify(file.content)) {
        return;
      }

      this.state.jotted.load(file.type);
    })

    this.setState({
      pendingFiles: null,
    });
  }

  toggleOneLinePanelCode = (type) => {
    let oneLineActivePanes = Object.assign([],this.state.oneLineActivePanes);

    this.state.oneLineActivePanes.map( (pane,idx) => {
      if (Object.keys(pane)[0] === type) {
        let pane = oneLineActivePanes[idx]
        pane[type] = !pane[type];
        oneLineActivePanes[idx] = pane;
        this.setState({oneLineActivePanes});
      }
    })
  }

  toggleTwoLinePanelCode = (type) => {
    let twoLineActivePanes = Object.assign([],this.state.twoLineActivePanes);

    this.state.twoLineActivePanes.map( (pane,idx) => {
      if (Object.keys(pane)[0] === type) {
        let pane = twoLineActivePanes[idx]
        pane[type] = !pane[type];
        twoLineActivePanes[idx] = pane;
        this.setState({twoLineActivePanes});
      }
    })
  }

  toggleMobilePanesBar = ()=> {
    this.setState({
      mobilePanesBar : this.state.mobilePanesBar === 'hide' ? 'show' : 'hide'
    });
  }

  activePanesClasses (_array) {
    let result = '';
    _array.map( (pane) => {
      let k = Object.keys(pane)
        , v = pane[k[0]];
      if (v) result += ` active-pane-${k[0]}`;
    })
    return result;
  }

  autoFirstRun = ()=> {
    let flag = true;
    this.props.plugins.map( (plugin) => {
      if (plugin.name === 'play' && !plugin.options.firstRun)
        flag = false;
    })
    return flag;
  }

  getConsolePlugin = ()=> { return $.grep(this.props.plugins, (e)=> e.name === 'console'); }

  getComputedValues = (CPT)=> {
    switch (CPT) {
      case 'onelinePanels':
        return this.computeSideBySideValues();
      case 'resultBelow':
        return this.computeResultBelowValues();
      default :
        return this.computeJottedTabsValues();
    }
  }

  getHeightJottedContainer = (CPT)=> {
    switch (CPT) {
      case 'onelinePanels':
        return this.computeSideBySideValues().heightJotted;
      case 'resultBelow':
        return this.computeResultBelowValues().heightJotted;
      default :
        return this.computeJottedTabsValues().heightJotted;
    }
  }

  computeJottedTabsValues = ()=> {
    let consoleJS  = this.getConsolePlugin();
    let v = {
      heightJotted: 0,
      heightBabel: 0,
      heightPane: 0,
      heightConsole: 0,
      panePosition: 0,
      consolePosition: 0
    };

    if (!this.props.hideNav) {
      v.panePosition = 34;
    }

    if (!this.props.hideHtml || !this.props.hideCss || !this.props.hideJs || !this.props.hideResult) {
      if (!this.props.hideNav) {
        if (this.props.hideResult) {
          v.heightPane += 216;
        }
        else {
          v.heightPane += Number(this.props.height) || 216;
        }
      }
      else {
        if (this.props.hideResult) {
          v.heightPane += 225;
        }
        else {
          v.heightPane += Number(this.props.height) || 225;
        }
      }
    }

    v.heightJotted = v.heightPane + v.panePosition;
    v.heightBabel = v.heightJotted;

    if (consoleJS.length > 0) {
      v.heightPane = (v.heightJotted * .7) - v.panePosition;
      v.heightConsole = v.heightJotted * .3;
      v.consolePosition = v.heightPane + v.panePosition;
    }

    return v;
  }

  computeSideBySideValues = ()=> {
    let consoleJS  = this.getConsolePlugin();
    let v = {
      heightJotted: 0,
      heightBabel: 0,
      heightPane: 0,
      heightConsole: 0,
      nav: 0,
      consolePosition: 3
    }

    if (!this.props.hideNav) {
      v.nav = 34;
    }

    if (!this.props.hideHtml || !this.props.hideCss || !this.props.hideJs || !this.props.hideResult) {
      if (!this.props.hideNav) {
        if (this.props.hideResult) {
          v.heightPane += 216;
        }
        else {
          v.heightPane = Number(this.props.height) || 216;
        }
      }
      else {
        if (this.props.hideResult) {
          v.heightPane += 250;
        }
        else {
          v.heightPane += Number(this.props.height) || 250;
        }
      }
      if (!this.props.height) {
        v.consolePosition += 4;
      }
      else {
        v.consolePosition += 1;
      }
    }

    v.heightJotted = v.heightPane;
    v.heightBabel = v.heightJotted + v.nav;

    if (consoleJS.length > 0) {
      let h = v.heightPane + v.nav;
      v.heightPane = (h * .7) - v.nav;
      v.heightConsole = h * .3;
      v.consolePosition += v.heightPane + v.nav;
    }

    return v;
  }

  computeResultBelowValues = ()=> {
    let consoleJS = this.getConsolePlugin();
    let v = {
      heightJotted: 0,
      heightBabel: 0,
      heightResult: 0,
      heightConsole: 0,
      nav: 0,
      secondNavPosition: 0,
      resultPosition: 0,
      consolePosition: 0
    }

    if (!this.props.hideNav) {
      v.nav = this.props.hideResult ? 34 : 64;
      v.secondNavPosition = 34;
      v.heightJotted += 4;
    }
    else {
      v.heightJotted += 1;
    }

    if (!this.props.hideHtml || !this.props.hideCss || !this.props.hideJs) {
      v.heightJotted += 216 + v.nav;
      v.secondNavPosition += 216;
    }

    v.heightBabel = v.heightJotted;

    if (!this.props.hideResult) {
      v.heightResult = Number(this.props.height) || 216;
      v.resultPosition = v.secondNavPosition;
      v.heightJotted += Number(this.props.height) || 216;
    }

    if (consoleJS.length > 0) {
      v.heightConsole = v.heightResult * .3;
      v.consolePosition = v.heightJotted + 4;
      v.heightJotted += v.heightConsole + 8;
    }

    return v;
  }

  render() {

    let baseClassName         = ''
      , baseClassNameToolbar  = ''
      , showedTabs            = []
      , togglePanel           = ()=> { return undefined }
      , jottedBabelShield     = 'jotted-no-shield'
      , oneLineActivePanes    = this.activePanesClasses(this.state.oneLineActivePanes)
      , twoLineActivePanes    = this.activePanesClasses(this.state.twoLineActivePanes)
      , CPT                   = this.props.codePlaygroundTemplate || 'jottedTabs';
      ;

    this.state.playedCodes.map( (pane) => {
      let k = Object.keys(pane)
        , v = pane[k[0]];
      if (v) showedTabs.push(k[0]);
    })

    const runjsConsole = this.getConsolePlugin();
    const totalPanes   = this.countTotalPanes();
    const className    = `custom-jotted-panecount-${totalPanes}`;
    const className0   = 'onelinePanels-jotted-panecount-' + (oneLineActivePanes.match(/ /g) || []).length;
    const className1   = 'splitResult-jotted-panecount-' + (twoLineActivePanes.match(/ /g) || []).length;


    if (runjsConsole.length > 0) {
      oneLineActivePanes += ' active-pane-Console';
      baseClassName = styles['runJs-show-console'];
    }
    else {
      baseClassName = styles['runJs-hide-console'];
    }

    if (this.props.hideResult) {
      baseClassName = `${baseClassName} ${styles['runJs-hide-result']}`;
    }
    else {
      baseClassName = `${baseClassName} ${styles['runJs-show-result']}`;
    }

    if (this.props.hideHtml) {
      baseClassName = `${baseClassName} ${styles['runJs-hide-html']}`;
    }

    if (this.props.hideCss) {
      baseClassName = `${baseClassName} ${styles['runJs-hide-css']}`;
    }

    if (this.props.hideJs) {
      baseClassName = `${baseClassName} ${styles['runJs-hide-js']}`;
    }

    if (this.props.hideNav) {
      baseClassName = `${baseClassName} ${styles['runJs-hide-nav']}`;
    }

    if (!this.props.hideHtml || !this.props.hideCss || !this.props.hideJs) {
      baseClassName = `${baseClassName} ${styles['runJs-show-pane']}`;
    }
    else {
      baseClassName = `${baseClassName} ${styles['runJs-hide-pane']}`;
    }

    if (this.props.showBabelTransformPane) {
      if (this.props.codePlaygroundTemplate === 'onelinePanels' || this.props.codePlaygroundTemplate === 'resultBelow') {
        jottedBabelShield = 'jotted-babel-shield';
      }
      if (this.props.codePlaygroundTemplate !== 'onelinePanels' && this.props.codePlaygroundTemplate !== 'resultBelow') {
        baseClassName = `${baseClassName} ${styles['babel-show-pane']}`;
      }
    }

    switch (this.props.codePlaygroundTemplate) {
      case 'onelinePanels' :
        baseClassName = `${baseClassName} ${styles['sideBside-panels']} ${styles['sideBside-onelinePanels']} ${styles[className0]} ${oneLineActivePanes} sideBside-panels jotted jotted-plugin-codemirror`;
        if (this.props.hideNav && !this.props.hideResult && totalPanes===1)
          baseClassName = `${baseClassName} ${styles['hiddenNav-n-onlyResult']}`; // to hide tag |result|
        if (!this.props.hideResult && totalPanes===1)
          baseClassName = `${baseClassName} ${styles['runJs-hide-resultNav']}`;
        baseClassNameToolbar = `${baseClassName} ${styles['first-sideBside']} ${styles['common-first-toolbar']}`;
        baseClassName = `${baseClassName} hide-list ${styles['second-sideBside']}`;
        togglePanel = this.toggleOneLinePanelCode;
        break;

      case 'resultBelow' :
        baseClassName = `${baseClassName} ${styles['jotted-theme-bin']} ${styles['sideBside-panels']} ${styles[className1]} ${twoLineActivePanes} sideBside-panels jotted-theme-bin jotted jotted-plugin-codemirror`;
        baseClassNameToolbar = `${baseClassName} ${styles['first-themeBin']} ${styles['common-first-toolbar']}`;
        baseClassName = `${baseClassName} ${styles['second-themeBin']} second-themeBin`;
        if (!this.props.hideResult && totalPanes > 1) {
          baseClassName = `${baseClassName} ${styles['themeBin-has-twoRows']}`;
        }
        if (this.props.hideResult && (!this.props.hideHtml || !this.props.hideCss || !this.props.hideJs)) {
          baseClassName = `${baseClassName} ${styles['panes-without-result']}`;
        }
        togglePanel = this.toggleTwoLinePanelCode;
        break;

      default :
        baseClassName = `${baseClassName} ${styles['jotted-tabs']} jotted-tabs`;
        break;
    }


    if (this.state.scriptsLoaded == false) {
      return <div style={{textAlign: 'center'}}>
                <ReactScriptHelper scripts={['https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.4.4/babel.min.js']}
                                onScriptsLoaded={()=>{
                                  this.setState({scriptsLoaded: true}, ()=>{
                                    const node = findDOMNode(this.refs.jotted);

                                    let jottedParams = EducativeUtil.cloneObject(this.props);

                                    if(this.props.hiddenJsFileContent) {
                                      jottedParams.plugins.push({
                                        name: 'hiddenjs',

                                        options: {
                                          hiddenJsContent: this.props.hiddenJsFileContent,
                                        },
                                      });
                                    }

                                    if(this.props.showBabelTransformPane) {
                                      jottedParams.plugins.push({
                                        name: 'finaljs',

                                        options: {
                                          finalJsCallback: this.finalJsCallback,
                                        },
                                      });
                                    }

                                    CPT = this.props.codePlaygroundTemplate || 'jottedTabs';
                                    let v = this.getComputedValues(CPT);

                                    $(node).height(v.heightJotted);

                                    if(this.props.showBabelTransformPane) {
                                      const babelPane = findDOMNode(this.refs.babel_pane);
                                      $(babelPane).height(v.heightBabel);
                                      $(babelPane).find('#babel-pane-content').height(v.heightBabel - 34);
                                    }

                                    const jotted = new Jotted(node, jottedParams);

                                    jotted.on('change', this.onChange);

                                    this.setState({
                                      node,
                                      jotted,
                                    }, ()=>{
                                      this.triggerJotted();
                                    });

                                    switch (CPT) {
                                      case 'onelinePanels':
                                        $(findDOMNode(this)).find('.jotted-pane').height(v.heightPane);
                                        $(findDOMNode(this)).find('.jotted-pane-console').height(v.heightConsole);
                                        $(findDOMNode(this)).find('.jotted-pane-console').css('top',v.consolePosition);
                                        break;
                                      case 'resultBelow':
                                        $(findDOMNode(this)).find('.jotted-pane-result').css('top', v.resultPosition);
                                        $(findDOMNode(this)).find('.second-themeBin .jotted-nav').css('top', v.secondNavPosition);
                                        $(findDOMNode(this)).find('.jotted-pane-result iframe').height(v.heightResult);
                                        $(findDOMNode(this)).find('.jotted-pane-console').height(v.heightConsole);
                                        $(findDOMNode(this)).find('.jotted-pane-console').css('top',v.consolePosition);
                                        break;
                                      default :
                                        $(findDOMNode(this)).find('.jotted-pane').height(v.heightPane);
                                        $(findDOMNode(this)).find('.jotted-pane').css('top',v.panePosition);
                                        $(findDOMNode(this)).find('.jotted-pane-console').height(v.heightConsole);
                                        $(findDOMNode(this)).find('.jotted-pane-console').css('top',v.consolePosition);
                                        break;
                                    }

                                    $(findDOMNode(this))
                                      .find('.jotted-pane')
                                        .on('focusin', function(e){ $(this).addClass('focus-pane'); })
                                        .on('focusout', function(e){ $(this).removeClass('focus-pane'); })

                                  })
                                }}
                                onScriptsLoadError={()=>{
                                  console.error('failed to load playground scripts');
                                }}/>
                <InlineStatusControl statusData={{ status: 'WAIT', text:'Loading Code Playground' }}/>
              </div>
    }


    const customStyle = {
      height: this.getHeightJottedContainer(CPT) || 150
    }

    return <div className={styles.jottedContainer}>
            {
              this.props.codePlaygroundTemplate === 'onelinePanels' || this.props.codePlaygroundTemplate === 'resultBelow'
              ? <div className={styles[jottedBabelShield]}>
                  <div className={baseClassNameToolbar}>
                    <ul className="jotted-nav" style={{position:'relative',zIndex:'9',background:'#EFEFEF'}}>
                      <span className={styles['jotted-nav-wide']}>
                        {
                          showedTabs.map((type, idx) => {
                            return <li key={idx} className={`jotted-nav-item jotted-nav-item-${type}`}>
                              <a onClick={togglePanel.bind(null,type)}>{type}</a>
                            </li>;
                          })
                        }
                      </span>
                      <span className={styles['jotted-nav-small']}>
                        <Btn default className="menu-button" onClick={this.toggleMobilePanesBar}>
                          <SomethingWithIcon icon={Icons.menuIcon}/>
                        </Btn>
                        <div className={this.state.mobilePanesBar + " nav-small-list"}>
                          {
                            showedTabs.map((type, idx) => {
                              return <li key={idx} className={`jotted-nav-item jotted-nav-item-${type}`}>
                                <a onClick={togglePanel.bind(null,type)}>{type}</a>
                              </li>;
                            })
                          }
                        </div>
                      </span>
                    </ul>
                  </div>
                  <div ref="jotted" className={baseClassName} style={customStyle}/>
                </div>
              : <div ref="jotted" className={baseClassName} style={customStyle}/>
            }
            {this.props.showBabelTransformPane ? <div className={styles['babel-pane']} ref="babel_pane">
              <div className={styles['babel-pane-header']}>Babel Transformation</div>
              <div className={styles['babel-pane-content']} id="babel-pane-content" dangerouslySetInnerHTML={{__html: this.state.babelTransformedJs}}></div>
            </div> : null}
          </div>;
  }
}