import withPaneDecorator from '../../decorators/withPaneDecorator'
import ImageOnSteroids from '../../image/ImageOnSteroids'
import ImageOnSteroidsResizableByParent from '../../image/ImageOnSteroidsResizableByParent.js'

export default withPaneDecorator(ImageOnSteroids);

// <ImageOnSteroidsWithPane
//  editableImage={this.props.image}
//  style={{width: this.state.width, height: this.state.height}}
//  canAnnotate={true}
//  onSave={this.props.annotationSave}
//  onDelete={this.props.annotationDelete}
//  />
