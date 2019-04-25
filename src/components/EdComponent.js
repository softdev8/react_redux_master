import React from 'react';
import * as componentMap from './widgets';
import PureComponent from 'react-pure-render/component';


export default class EdComponent extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.saveVersion !== this.props.saveVersion) {
      if (this.refs.component.saveComponent) {
        this.refs.component.saveComponent();
      }
      nextProps.runPendingAction();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.mode !== nextProps.mode || this.props.iteration !== nextProps.iteration) {
      return true;
    }

    return false;
  }

  saveComponent() {
    if (this.refs.component.saveComponent) {
      this.refs.component.saveComponent();
    }
  }

  render() {
    const { comp, ...rest } = this.props;

    const { default_themes} = this.props;
    const { type, content } = comp.toJS();

    const MyComponent = componentMap[type];

    if (MyComponent) {
      return <MyComponent {...rest} className="widget" default_themes={default_themes} contentStateFinalized={this.props.contentStateFinalized} ref="component" content={content} />;
    }

    console.error(`invalid component - ${comp}`);
    return <p>Invalid Object with type - {type}</p>;
  }
}
