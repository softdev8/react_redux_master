import React from 'react'
import {publish} from '../../actions';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import PanelBody from '../../components/common/PanelBody.js';
import Panel from '../../components/common/Panel.js';
import PanelHeader from '../../components/common/PanelHeader.js';
import {Grid, Col, Row} from 'react-bootstrap';

import PageItemFooter from './PageItemFooter';

export default class PageItem extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleUnpublish = this.handleUnpublish.bind(this);
    this.onTabPublished = this.onTabPublished.bind(this);
    this.onTabDraft = this.onTabDraft.bind(this);

    this.state = {
      activeState: this.props.page.pub ? "pub" : "draft",
    };
  }

  componentDidMount() {
  }

  handleDelete() {
    if (DEBUG) {
      // TODO
    } else {
      //Integrate with server
      console.log('Delete method called');
    }
  }

  handleEdit() {
    if (DEBUG) {
      this.props.page.draft.modifiedDate = new Date();
      DEBUG_PAGES.sort(function (a, b) {
        return b.getModifiedDate() - a.getModifiedDate();
      });
      forceUpdate();
    } else {
      const doc_edit_url = "/pageeditor/{0}".format(this.props.page.id);
      this.props.history.pushState(null, doc_edit_url);
    }
  }

  handlePublish() {
    if (DEBUG) {
      // TODO
    } else {
      authorPagePublish(this.props.page.id)
      .then((data)=>{
        console.log("Successfully published.")
        // Pass 0 as user ID.
        const strUrl = '/page/{0}/{1}'.format(this.props.userInfo.user_id, this.props.page.id);
        this.context.router.transitionTo(strUrl);
      })
      .catch((err)=>{
        console.error("Failed to publish");
      })
    }
  }

  handleUnPublish() {
    if (DEBUG) {
      // TODO
    } else {
      //Integrate with server
      console.log('Unpublish method called');
    }
  }

  onTabDraft() {
    this.setState({activeState: "draft"});
  }

  onTabPublished() {
    this.setState({activeState: "pub"});
  }

  render() {
    // TODO: enable below only after implementing hide/unpublish feature
    //var publish_button = <Button sm outlined onlyOnHover style={{marginBottom: 5}} bsStyle='warning' onClick={this.handleUnpublish} onTouchEnd={this.handleUnpublish}>Hide</Button>;
    //var preview = "";
    //if(this.props.page.draft){
    //  badgeStyle = 'warning';
    //  preview = "?preview=true";
    //  publish_button = <Button sm outlined onlyOnHover style={{marginBottom: 5}} bsStyle='success' onClick={this.handlePublish} onTouchEnd={this.handlePublish}>Publish</Button>;
    //}
    // TODO: Enable Panel Footer properties
    //    <small className='panel-bottom-item'><Icon glyph='icon-ikons-time'/><span>{this.props.page.view_count} views</span></small>
    //    <small className='panel-bottom-item'><Icon glyph='fa fa-share' title='Share' data-toggle='tooltip' data-placement='top' /></small>
    //    <small className='panel-bottom-item'><Icon glyph='fa fa-pencil' title={modified_tooltip} data-toggle='tooltip' data-placement='top' /></small>
    //    <small className='panel-bottom-item'><Icon glyph='fa fa-calendar-o' title={create_tooltip} data-toggle='tooltip' data-placement='top' /></small>
    const stateButtons = [];
    if (this.props.page.pub) {
      stateButtons.push(<Col xs={6} collapseLeft collapseRight>
        <Button className='btn-tab-pub' onClick={this.onTabPublished}>Published</Button>
      </Col>);
    }
    if (this.props.page.draft) {
      stateButtons.push(<Col xs={6} collapseLeft collapseRight>
        <Button className='btn-tab-draft' onClick={this.onTabDraft}>Draft</Button>
      </Col>);
    }
    let subPage = this.props.page[this.state.activeState];
    // bug here: check why activeState page is not found
    if (!subPage) subPage = this.props.page.pub ? this.props.page.pub : this.props.page.draft;

    let summary = subPage.summary;
    if (summary.length > 140) {
      summary = `${summary.substring(0, 137)}...`;
    }
    let title = subPage.title;
    if (!title) {
      title = "Untitled";
    }

    const actions = [];
    if (subPage === this.props.page.draft) {
      actions.push(<Button onClick={this.handleEdit}>Edit Draft</Button>);
      actions.push(<Button onClick={this.handlePublish}>Publish</Button>);
    } else { // published
      if (!this.props.page.draft) {
        actions.push(<Button onClick={this.handleEdit}>Edit Draft</Button>);
      }
      actions.push(<Button onClick={this.hanldeUnpublish}>Take Offline</Button>);
    }
    return (
      <Panel className='page-item'>
        <PanelHeader className='page-item-header'>
          <Grid fluid>
            <Row>
              {stateButtons}
            </Row>
          </Grid>
        </PanelHeader>
        <PanelBody className='page-item-body'>
          <div className='text-center'>
            <h4 className='hidden-xs'>{title}</h4>
            <h6 className='fg-darkgrayishblue75 visible-xs'>{title}</h6>
            <h5 className='fg-darkgray50 hidden-xs'>{summary}</h5>
            <h6 className='visible-xs'>
              <small className='fg-darkgray50'>{summary}</small>
            </h6>
            { actions }
          </div>
        </PanelBody>
        <PageItemFooter page={subPage}/>
      </Panel>
    );
    //var userId = 0;
    //var userInfo = getUserInfoGlobal();
    //if (userInfo) {
    //  userId = userInfo.user_id;
    //}
    // user ID 0 indicates that use author API
    //var doc_view_url = "/page/viewer/{0}/{1}{2}".format(userId, this.props.page.id, preview);
    //              <div className='component-item-panel-controls text-right'>
    //                <Button onClick={this.handleEdit} onTouchEnd={this.handleEdit}>
    //                  <Icon glyph='fa fa-edit'/>
    //                </Button>
    //                <Button onClick={this.handleDelete} onTouchEnd={this.handleDelete}>
    //                  <Icon glyph='fa fa-close'/>
    //                </Button>
    //              </div>
    //              <div className='text-center'>
    //                <Link to={doc_view_url}><h4 className='hidden-xs'>{documentTitle}</h4></Link>
    //                <h6 className='fg-darkgrayishblue75 visible-xs'>{this.props.page.title}</h6>
    //                <h5 className='fg-darkgray50 hidden-xs'>{summary_trimmed}</h5>
    //                <h6 className='visible-xs'><small className='fg-darkgray50'>{summary_trimmed}</small></h6>
    //                {publish_button}{' '}
    //              </div>
    //      <PanelFooter className='fg-black75 component-item-panel-footer' style={{padding: '12.5px 25px', margin: 0}}>
    //        <div className='text-right'>
    //          <BLabel className='panel-bottom-item' bsStyle={badgeStyle} style={{textTransform: 'uppercase'}}>{this.props.page.pub ? "Published" : "Draft"}</BLabel>
    //        </div>
    //      </PanelFooter>
  }
}

PageItem.contextTypes = {
  router: React.PropTypes.object.isRequired,
};