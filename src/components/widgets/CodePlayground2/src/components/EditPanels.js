import styles from './EditPanels.module.scss';

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { FormControl, Checkbox, Tooltip, OverlayTrigger } from 'react-bootstrap';

import { CodeMirrorThemes } from '../../../../helpers/codeoptions';
import HighlightLines from '../../../../helpers/highlightLines';

const CodeEditor = require('./EditPanels.codeEditor');
const EditPanelOptions = require('./EditPanelOptions');
/*
 * Utility method to get the keys of the given object.
 */
const keys = function (obj) {
  const keys = [];
  for (const key in obj) {
    keys.push(key);
  }
  return keys;
};

// TODO refactor map panel types
export default class EditPanels extends Component {
  constructor(props, context) {
    super(props, context);

    this.addPlugin = this.addPlugin.bind(this);
    this.removePlugin = this.removePlugin.bind(this);
    this.onChangePanelCode = this.onChangePanelCode.bind(this);
    this.onUpdateToggleState = this.onUpdateToggleState.bind(this);

    this.saveComponent = this.saveComponent.bind(this);
    this.state = {
      filename: '',
      active: 'html',
      pane: 'result',
      height: null,
      heightCodepanel: null,
      hideResult: false,
      hideHtml: false,
      hideCss: false,
      hideJs: false,
      hideNav: false,
      showBabelTransformPane: false,
      codePlaygroundTemplate: 'jottedTabs',
      theme: 'default',
      exercise: false,
      showLineNumbers: true,
      autoRun: true,
      onlyCodeChanged: false,
      toggleState: {
        result: true,
        html: true,
        css: true,
        js: true,
      },
      panels: {
        js: '',
        html: '',
        css: '',
        hiddenjs: '',
        exercise: '',
      },
      panelsHighlightedLines: {
        js: '',
        html: '',
        css: '',
        hiddenjs: '',
      },
      selectedPanel: 'html',
      plugins: ['codemirror'],
    }
  }

  componentDidMount() {
    const panels = this.state.panels;
    const { jotted } = this.props;

    jotted.files.forEach((file)=>{
      panels[file.type] = file.content;
    });

    const panelsHighlightedLines = this.state.panelsHighlightedLines;
    if (jotted.panelsHighlightedLines) {
      for (const type in jotted.panelsHighlightedLines) {
        panelsHighlightedLines[type] =  jotted.panelsHighlightedLines[type];
      }
    }

    let theme = jotted.theme || 'default';
    let plugins = [];
    jotted.plugins.forEach((plugin)=>{
      if(plugin.name === 'babel'){
        if(plugin.options.presets.indexOf('react') > -1){
          plugins.push('babel-react');
          return;
        }
      } else if (plugin.name === 'codemirror') {
        if (plugin.options.theme !== undefined &&
            !jotted.hasOwnProperty('theme')) {
          theme = plugin.options.theme;
        }
      }

      plugins.push(plugin.name);
    });

    let autoRun = false;
    if (jotted.hasOwnProperty('autoRun')) {
      autoRun = jotted.autoRun;
    }
    else {
      autoRun = plugins.indexOf('play') === -1;
    }

    this.setState({
      active: this.props.active,
      pane: jotted.pane,
      height: jotted.height ? jotted.height : null,
      heightCodepanel: jotted.heightCodepanel ? jotted.heightCodepanel : null,
      hideResult: !!jotted.hideResult,
      hideHtml: !!jotted.hideHtml,
      hideCss: !!jotted.hideCss,
      hideJs: !!jotted.hideJs,
      hideNav: !!jotted.hideNav,
      showBabelTransformPane: !!jotted.showBabelTransformPane,
      showLineNumbers: !!jotted.showLineNumbers,
      codePlaygroundTemplate: jotted.codePlaygroundTemplate,
      toggleState: jotted.toggleState || {
        result: true, html: true, css: true, js: true,
      },
      panels,
      panelsHighlightedLines,
      theme,
      exercise: !!jotted.exercise,
      autoRun,
      filename: this.props.filename,
      plugins,
      onlyCodeChanged: false,
    });

    findDOMNode(this.heightRef).value = jotted.height;
    if (this.heightCodepanelRef) {
      findDOMNode(this.heightCodepanelRef).value = jotted.heightCodepanel;
    }
  }

  componentDidUpdate() {
    findDOMNode(this.heightRef).value = this.state.height;
    if (this.heightCodepanelRef) {
      findDOMNode(this.heightCodepanelRef).value = this.state.heightCodepanel;
    }
  }

  addPlugin(plugin, pluginToRemove) {
    if (this.state.plugins.indexOf(plugin) === -1) {
      const plugins = this.state.plugins.slice();
      plugins.push(plugin);

      if (pluginToRemove) {
        const index = plugins.indexOf(pluginToRemove);
        if (index > -1) {
          plugins.splice(index, 1);
        }
      }

      this.setState({ plugins });
    }
  }

  createTooltipObject(tooltip_string) {
    return <Tooltip id={tooltip_string}>{ tooltip_string }</Tooltip>;
  }

  removePlugin(plugin) {
    const index = this.state.plugins.indexOf(plugin);
    if (index > -1) {
      this.state.plugins.splice(index, 1);
      this.setState({ plugins:this.state.plugins });
    }
  }

  onUpdateToggleState(type, state) {
    const { toggleState } = this.state;
    if ({}.hasOwnProperty.call(toggleState, type)) {
      toggleState[type] = state;

      this.setState({
        toggleState,
      }, this.saveComponent());
    }
  }

  onPanelSelect = (selectedPanel) => {
    this.setState({
      selectedPanel
    });
  }

  saveComponent() {

    const plugins = [];
    this.state.plugins.forEach((plugin) => {
      if (plugin == 'codemirror') {
        plugins.push({
          name: 'codemirror',

          options: {
            lineNumbers: this.state.showLineNumbers,
            theme: this.state.theme,
          },
        });
      } else if (plugin == 'babel'){
        plugins.push({
          name: 'babel',

          options: {
            presets: ['es2015', 'stage-2'],
          },
        });
      }  else if (plugin == 'babel-react'){
        plugins.push({
          name: 'babel',

          options: {
            presets: ['react', 'stage-2'],
          },
        });
      } else if (plugin == 'console'){
        plugins.push({
          name: 'console',

          options: {
            autoClear: true,
          },
        });
      }
      else if (plugin == 'play'){
        plugins.push({
          name: 'play',

          options: {
            firstRun: false,
          },
        });
      }
    });

    this.props.updateContentState({
      filename: this.state.filename,
      active: this.state.active,

      jotted: {
        pane: this.state.pane,

        files: ['js', 'html', 'css', 'hiddenjs', 'exercise']
          .sort()
          .map(type => ({
          type,
          content: this.state.panels[type],
        })),

        panelsHighlightedLines: this.state.panelsHighlightedLines,

        hideResult: this.state.hideResult,
        hideHtml: this.state.hideHtml,
        hideCss: this.state.hideCss,
        hideJs: this.state.hideJs,
        hideNav: this.state.hideNav,
        showBabelTransformPane: this.state.showBabelTransformPane,
        showLineNumbers: this.state.showLineNumbers,
        toggleState: this.state.toggleState,
        autoRun: this.state.autoRun,
        theme: this.state.theme,
        exercise: this.state.exercise,
        codePlaygroundTemplate: this.state.codePlaygroundTemplate,
        height: this.state.height,
        heightCodepanel: this.state.heightCodepanel,
        showBlank: false,
        plugins,
      },
    });
  }

  onChangePanelCode(type, value) {
    const panels = this.state.panels;
    panels[type] = value;

    this.setState({
      panels,
      onlyCodeChanged: true
    });
  }

  onHighlightedLinesChange = (event) => {
    if (this.state.selectedPanel === 'hiddenjs') return;

    const panelsHighlightedLines = this.state.panelsHighlightedLines;
    panelsHighlightedLines[this.state.selectedPanel] = event.target.value;

    this.setState({
      panelsHighlightedLines,
      onlyCodeChanged: false
    });
  }

  getCodeTheme() {
    if (this.state.theme === 'default' &&
        this.props.default_themes) {
      return this.props.default_themes.RunJS;
    }

    return this.state.theme;
  }

  render() {
    const className = `jotted-has-html jotted-has-js jotted-has-css jotted-pane-active-${this.state.active}`;
    let language = this.state.active;

    if (language === 'js' || language === 'hiddenjs') {
      language = 'javascript';
    }

    const activeContent = {
      content: this.state.panels[this.state.active],
      language,
      theme: this.state.theme,
    };

    const { panelsHighlightedLines, selectedPanel } = this.state;
    const highlightedLines = panelsHighlightedLines[selectedPanel];

    const consoleShown = this.state.plugins.indexOf('console') > -1;
    const babelActive = this.state.plugins.indexOf('babel') > -1;
    const babelReactActive = this.state.plugins.indexOf('babel-react') > -1;

    return (<div style={{ paddingBottom:'3px' }}>
      <div className="edcomp-toolbar" style={{ backgroundColor:'#eee', border:'1px solid #ddd', borderRadius:5, marginBottom:15, paddingLeft:10, paddingRight:10 }}>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Javascript Language to use')}>
          <label className={`${styles.label} form-label`}>Plugin
            <FormControl componentClass="select" style={{ marginLeft:5 }} value={babelActive ? 'babel' : babelReactActive ? 'babel-react' : 'javascript'} onChange={(e) => {
              if (e.target.value === 'babel') {
                this.addPlugin('babel', 'babel-react');
              } else if (e.target.value === 'babel-react') {
                this.addPlugin('babel-react', 'babel');
              } else {
                this.removePlugin('babel');
                this.removePlugin('babel-react');
              }
            }}
            >
                <option value="javascript">Javascript</option>
                <option value="babel">Babel</option>
                <option value="babel-react">React</option>
            </FormControl>
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Default Active Pane when RunJS is shown to reader')}>
          <label className={`${styles.label} form-label`}>Default Active Pane
          <FormControl componentClass="select" style={{ marginLeft:5 }} value={this.state.pane} onChange={(e) => {
            this.setState({ pane:e.target.value });
          }}
          >
                <option value="result">Result</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">Javascript</option>
            </FormControl>
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Theme to use for panes')}>
          <label className={`${styles.label} form-label`}>Theme
          <FormControl componentClass="select" style={{ marginLeft:5 }} value={this.state.theme} onChange={(e) => {
            this.setState({ theme: e.target.value, onlyCodeChanged: false });
          }}
          >
              {
                keys(CodeMirrorThemes).map(function(key, idx) {
                  return (
                    <option key={idx} value={key}>{CodeMirrorThemes[key]}</option>
                  );
                })
              }
            </FormControl>
          </label>
        </OverlayTrigger>
        <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
          <span>Line Numbers</span>
          <Checkbox checked={this.state.showLineNumbers} onChange={(e) => {
            if (e.target.checked) {
              this.setState({
                showLineNumbers: true,
                onlyCodeChanged: false
              });
            } else {
              this.setState({
                showLineNumbers: false,
                onlyCodeChanged: false
              });
            }
          }}
          />
        </label>
        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Show console panel when RunJs is viewed")}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>Show Console</span>
            <Checkbox checked={consoleShown} onChange={(e)=>{
              if(e.target.checked){
                this.addPlugin('console');
              } else {
                this.removePlugin('console');
              }
            }}/>
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('When unchecked Run button is shown and auto-run is turned off')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>AutoRun</span>
            <Checkbox checked={this.state.autoRun} onChange={(e) => {
              if (e.target.checked) {
                this.setState({
                  autoRun: true
                });
              } else {
                this.setState({
                  autoRun: false
                });
              }
            }}
            />
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Evaluate the contents as Exercise')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>Exercise</span>
            <Checkbox checked={this.state.exercise} onChange={(e) => {
              if (e.target.checked) {
                this.setState({
                  exercise: true
                });
              } else {
                this.setState({
                  exercise: false
                });
              }
            }}
            />
          </label>
        </OverlayTrigger>
        {/*
          babelActive ? <OverlayTrigger placement="top" overlay={this.createTooltipObject('When checked babel transformed output is shown')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>Show Babel Transform Pane</span>
              <Input type="checkbox" checked={this.state.showBabelTransformPane} onChange={(e) => {
                if (e.target.checked) {
                  this.setState({
                    showBabelTransformPane: true,
                  });
                } else {
                  this.setState({
                    showBabelTransformPane: false,
                  });
                }
              }}
              />
            </label>
          </OverlayTrigger> : null
        */}
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Select the look of Panels and tabs, how they will be organized and presented')}>
          <label className={`${styles.label} form-label`}>Layout
          <FormControl componentClass="select" style={{ marginLeft:5 }} value={this.state.codePlaygroundTemplate}
            onChange={(e) => {this.setState({ codePlaygroundTemplate:e.target.value });}}>
            <option value="jottedTabs">Default (tabs)</option>
            <option value="onelinePanels">Side-by-side</option>
            <option value="resultBelow">Show result below</option>
            </FormControl>
          </label>
        </OverlayTrigger>
        {/* <OverlayTrigger placement="top" overlay={this.createTooltipObject('Allow Download of RunJS Sample. Specify Filename when checked')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>Allow Download</span>
            <Input type="checkbox" checked={this.state.filename != ''} onChange={(e) => {
              if (e.target.checked) {
                this.setState({
                  filename:'index.html',
                });
              } else {
                this.setState({
                  filename:'',
                });
              }
            }}
            />
            {this.state.filename != '' ? <Input type="text" onChange={({ target:{ value } }) => {this.setState({ filename:value })}}
              value={this.state.filename} style={{ marginLeft: 5 }}
            /> : null}
          </label>
        </OverlayTrigger> */}
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Optional Height for the output in pixels. Min 150')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>Height(px)
            <FormControl ref={node => this.heightRef = node} onBlur={({ target:{ value } }) => {
              if (!value || value < 150) {
                this.setState({ height:null });
              } else if (value >= 150) {
                this.setState({ height:value });
              }
            }} style={{ marginLeft: 5 }}
            />
          </label>
        </OverlayTrigger>
        {
          this.state.codePlaygroundTemplate === 'resultBelow' &&
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Optional Height for code panels in pixels. Min 225')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>Code Height(px)
              <FormControl ref={node => this.heightCodepanelRef = node} onBlur={({ target:{ value } }) => {
                if (!value || value < 225) {
                  this.setState({ heightCodepanel:null });
                } else if (value >= 225) {
                  this.setState({ heightCodepanel:value });
                }
              }} style={{ marginLeft: 5 }}
              />
            </label>
          </OverlayTrigger>
        }
        <HighlightLines
          value={highlightedLines}
          onChangeLines={this.onHighlightedLinesChange}
        />
        <div style={{ display:'inline-block' }}>
          <span style={{ marginRight:'10px' }}>Hide Panels: </span>
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Hide Result Pane when RunJs is viewed')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Output</span>
              <Checkbox checked={this.state.hideResult} onChange={(e) => {
                if (e.target.checked) {
                  this.setState({
                    hideResult: true,
                  });
                } else {
                  this.setState({
                    hideResult: false,
                  });
                }
              }}
              />
            </label>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Hide Html Pane if html has some content when RunJs is viewed')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>HTML</span>
              <Checkbox checked={this.state.hideHtml} onChange={(e) => {
                if (e.target.checked) {
                  this.setState({
                    hideHtml: true,
                  });
                } else {
                  this.setState({
                    hideHtml: false,
                  });
                }
              }}
              />
            </label>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Hide Css Pane if html has some content when RunJs is viewed')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>CSS</span>
              <Checkbox checked={this.state.hideCss} onChange={(e) => {
                if (e.target.checked) {
                  this.setState({
                    hideCss: true,
                  });
                } else {
                  this.setState({
                    hideCss: false,
                  });
                }
              }}
              />
            </label>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Hide Js Pane if Js has some content when RunJs is viewed')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>JS</span>
              <Checkbox checked={this.state.hideJs} onChange={(e) => {
                if (e.target.checked) {
                  this.setState({
                    hideJs: true,
                  });
                } else {
                  this.setState({
                    hideJs: false,
                  });
                }
              }}
              />
            </label>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Hide Navbar to switch between different tabs when RunJs is viewed')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Navbar</span>
              <Checkbox checked={this.state.hideNav} onChange={(e) => {
                if (e.target.checked) {
                  this.setState({
                    hideNav: true,
                  });
                } else {
                  this.setState({
                    hideNav: false,
                  });
                }
              }}
              />
            </label>
          </OverlayTrigger>
        </div>
        <EditPanelOptions
          updateToggleState={this.onUpdateToggleState}
          toggleState={this.state.toggleState}
          playgroundTemplate={this.state.codePlaygroundTemplate}
        />
      </div>

      <CodeEditor
        panels={this.state.panels}
        panelsHighlightedLines={this.state.panelsHighlightedLines}
        onCodeChange={this.onChangePanelCode}
        theme={this.getCodeTheme()}
        exercise={this.state.exercise}
        showLineNumbers={this.state.showLineNumbers}
        onlyCodeChanged={this.state.onlyCodeChanged}
        onPanelSelect={this.onPanelSelect}
      />
    </div>);
  }
}
