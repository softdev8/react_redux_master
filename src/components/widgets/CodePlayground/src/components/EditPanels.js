import styles from './EditPanels.module.scss';

import React from 'react';
import {findDOMNode} from 'react-dom';
import 'jotted/jotted.css';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';

import {FormControl, Checkbox, Tooltip, OverlayTrigger} from 'react-bootstrap';

import CodeMirrorEditor from '../../../../helpers/codeeditor';
import { CodeMirrorThemes } from '../../../../helpers/codeoptions';

/*
 * Utility method to get the keys of the given object.
 */
const keys = function (obj) {
  const keys = [];
  for (let key in obj) {
    keys.push(key);
  }
  return keys;
};


class EditPane extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(){
    if(this.props.onChange) {
      this.props.onChange(this.textareaRef.value);
    }
  }

  render() {
    return <div className="jotted-editor">
            <textarea data-jotted-type={this.props.jottedType}
              onChange={this.handleChange}
              ref={node => this.textareaRef = node}
              value={this.props.value}
            />
            <div className="jotted-status"></div>
          </div>;
  }
}

// TODO refactor map panel types
export default class EditPanels extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.addPlugin = this.addPlugin.bind(this);
    this.removePlugin = this.removePlugin.bind(this);

    this.saveComponent = this.saveComponent.bind(this);
    this.state = {
      filename: '',
      active: 'html',
      pane: 'result',
      height: null,
      hideResult: false,
      hideHtml: false,
      hideCss: false,
      hideJs: false,
      hideNav: false,
      showBabelTransformPane: false,
      codePlaygroundTemplate: 'jottedTabs',
      theme: 'default',

      panels: {
        js: '',
        html: '',
        css: '',
        hiddenjs: '',
      },

      plugins: ['codemirror'],
    }
  }

  componentDidMount(){
    const panels = this.state.panels;

    this.props.jotted.files.forEach((file)=>{
      panels[file.type] = file.content;
    });

    let theme = 'default';
    let plugins = [];
    this.props.jotted.plugins.forEach((plugin)=>{
      if(plugin.name === 'babel'){
        if(plugin.options.presets.indexOf('react') > -1){
          plugins.push('babel-react');
          return;
        }
      } else if (plugin.name === 'codemirror') {
        if (plugin.options.theme !== undefined) {
          theme = plugin.options.theme;
        }
      }

      plugins.push(plugin.name);
    });

    this.setState({
      active: this.props.active,
      pane: this.props.jotted.pane,
      height: this.props.jotted.height ? this.props.jotted.height : null,
      hideResult: !!this.props.jotted.hideResult,
      hideHtml: !!this.props.jotted.hideHtml,
      hideCss: !!this.props.jotted.hideCss,
      hideJs: !!this.props.jotted.hideJs,
      hideNav: !!this.props.jotted.hideNav,
      showBabelTransformPane: !!this.props.jotted.showBabelTransformPane,
      codePlaygroundTemplate: this.props.jotted.codePlaygroundTemplate,
      panels,
      theme,
      filename: this.props.filename,
      plugins,
    });

    findDOMNode(this.heightRef).value = this.props.jotted.height;
  }

  componentDidUpdate() {
    findDOMNode(this.heightRef).value = this.state.height;
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

  saveComponent() {

    const plugins = [];
    this.state.plugins.forEach((plugin) => {
      if (plugin == 'codemirror') {
        plugins.push({
          name: 'codemirror',

          options: {
            lineNumbers: true,
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

        files: ['js', 'html', 'css','hiddenjs']
          .sort()
          .map(type => ({
          type,
          content: this.state.panels[type],
        })),

        hideResult: this.state.hideResult,
        hideHtml: this.state.hideHtml,
        hideCss: this.state.hideCss,
        hideJs: this.state.hideJs,
        hideNav: this.state.hideNav,
        showBabelTransformPane: this.state.showBabelTransformPane,
        codePlaygroundTemplate: this.state.codePlaygroundTemplate,
        height: this.state.height,
        showBlank: false,
        plugins,
      },
    });
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

    const consoleShown = this.state.plugins.indexOf('console') > -1;
    const babelActive = this.state.plugins.indexOf('babel') > -1;
    const babelReactActive = this.state.plugins.indexOf('babel-react') > -1;
    const autoRun = this.state.plugins.indexOf('play') === -1;

    return (<div style={{ minHeight:'250px', paddingBottom:'30px' }}>
      <div className="edcomp-toolbar">
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
                <option value="babel-react">Babel-React</option>
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
            this.setState({ theme:e.target.value });
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
            <Checkbox checked={autoRun} onChange={(e) => {
              if (e.target.checked) {
                this.removePlugin('play');
              } else {
                this.addPlugin('play');
              }
            }}
            />
          </label>
        </OverlayTrigger>
        {babelActive ? <OverlayTrigger placement="top" overlay={this.createTooltipObject('When checked babel transformed output is shown')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>Show Babel Transform Pane</span>
            <Checkbox checked={this.state.showBabelTransformPane} onChange={(e) => {
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
        </OverlayTrigger> : null }
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Select the look of Panels and tabs, how they will be organized and presented')}>
          <label className={`${styles.label} form-label`}>Panels and Tabs
          <FormControl componentClass="select" style={{ marginLeft:5 }} value={this.state.codePlaygroundTemplate}
            onChange={(e) => {this.setState({ codePlaygroundTemplate:e.target.value });}}>
            <option value="jottedTabs">Default (tabs)</option>
            <option value="onelinePanels">Side-by-side</option>
            <option value="resultBelow">Show result below</option>
            </FormControl>
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Allow Download of RunJS Sample. Specify Filename when checked')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>Allow Download</span>
            <Checkbox checked={this.state.filename != ''} onChange={(e) => {
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
            {this.state.filename != '' ? <FormControl onChange={({ target:{ value } }) => {this.setState({ filename:value })}}
              value={this.state.filename} style={{ marginLeft: 5 }}
            /> : null}
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('Optional Height for this component in pixels. Min 150')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>Height
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
        <div style={{ display:'inline-block' }}>
          <span style={{ marginRight:'10px' }}>Hide Panels: </span>
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Hide Result Pane when RunJs is viewed')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>RESULT</span>
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
      </div>
      <div className={className} style={{ height:'100%' }}>
        <ul className="jotted-nav" style={{ position:'relative' }}>
          {
            ['html', 'css', 'js', 'hiddenjs']
              .map((type, idx) => {
                return (<li key={idx} className={`jotted-nav-item jotted-nav-item-${type}`}  style={{ cursor:'pointer', display:'block' }}>
                  <a data-jotted-type={type} onClick={() => this.setState({ active: type })}>
                    {type}
                  </a>
                </li>);
              }
            )
          }
        </ul>
        <CodeMirrorEditor
          codeContent={activeContent}
          readOnly={false}
          onEditorChange={(value) => {
            this.state.panels[this.state.active] = value;
          }}
        />
      </div>
    </div>);
  }
}
