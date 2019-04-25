import React from 'react'
import { Button } from 'react-bootstrap'
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import { findDOMNode } from 'react-dom';

class SpoilerViewer extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            hidden: true,
            mdHtml: props.mdHtml
        }

        this.hiddenToggle = this.hiddenToggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mdHtml: nextProps.mdHtml
        })
    }

    componentDidMount() {
        this.updateView()
    }

    componentDidUpdate() {
        this.updateView();
    }

    hiddenToggle() {
        this.setState({
            hidden: !this.state.hidden
        })
    }

    updateView() {
        if (this.state.mdHtml && !this.state.hidden)
        findDOMNode(this.refs.spoilerViewer).innerHTML = this.state.mdHtml;
    }

    render() {
        const hidden = this.state.hidden

        let viewerStyle = {};
        let button = null;
        if (!hidden) {
            button = <Button bsSize="large" onClick={this.hiddenToggle} style={{textTransform: 'none'}}>Hide Hint</Button>;
            viewerStyle = {
                boxShadow: '0 0 1em grey', padding: '20px', borderRadius:10
            };
        }
        else {
            button = <Button bsSize="large" onClick={this.hiddenToggle} style={{textTransform: 'none'}}>Need Hint?</Button>;
        }

        return (
            <div style={viewerStyle}>
                <div style={{textAlign: 'center'}}>
                {button}
                </div>
                <ReactCSSTransitionGroup
                    transitionName="runnable"
                    transitionEnter={true}
                    transitionEnterTimeout={500}
                    transitionLeave={true}
                    transitionLeaveTimeout={500}>
                    {!hidden &&
                        <div ref="spoilerViewer" className='mediumTextViewer'></div>
                    }
                </ReactCSSTransitionGroup>

            </div>
        )
    }

}

export default SpoilerViewer