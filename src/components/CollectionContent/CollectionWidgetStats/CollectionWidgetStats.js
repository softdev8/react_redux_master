import styles from './CollectionWidgetStats.module.scss';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Icon from '../../../components/common/Icon';

export default class CollectionWidgetStats extends Component {

  static propTypes = {
    widgetStats: PropTypes.object,
    lessonCount: PropTypes.number.isRequired,
  };

  render() {
    const { widgetStats, lessonCount } = this.props;

    if (!widgetStats) {
      return (<div />);
    }

    return (
      <div className={styles.widgetStatsContainer} style={{padding: '0 10px'}}>
        <Table className={styles.statTable} >
          <tbody>
            {
              (lessonCount && lessonCount > 0) ?
                <tr>
                  <td><Icon glyph='fa fa-file-text' className={styles.statWidgetIconLessons}/></td>
                  <td>{lessonCount}</td><td>lessons</td>
                </tr> :
                null
            }

            {
              (widgetStats.Quiz && widgetStats.Quiz > 0) ?
                <tr>
                  <td><Icon glyph='fa fa-puzzle-piece' className={styles.statWidgetIcon}/></td>
                  <td>{widgetStats.Quiz}</td><td>quizzes</td>
                </tr> :
                null
            }

            {
              (widgetStats.codeExerciseCount && widgetStats.codeExerciseCount > 0) ?
                <tr>
                  <td>
                    <Icon glyph='fa fa-code fa-image' className={styles.statWidgetIconCodeExec}/>
                  </td>
                  <td>{widgetStats.codeExerciseCount}</td>
                  <td>code challenges
                    <div className={styles.subtext}>→ Online judge</div>
                  </td>
                </tr> :
                null
            }

            {
              (widgetStats.codeRunnableCount && widgetStats.codeRunnableCount > 0) ?
                <tr>
                  <td><Icon glyph='fa fa-code' className={styles.statWidgetIconCodeExec}/></td>
                  <td className={styles.statWidgetCount}>{widgetStats.codeRunnableCount}</td>
                  <td>code playgrounds
                    <div className={styles.subtext}>→ Run in browser</div>
                  </td>
                </tr> :
                null
            }

            {
              (widgetStats.codeSnippetCount && widgetStats.codeSnippetCount > 0) ?
                <tr>
                  <td><Icon glyph='fa fa-code' className={styles.statWidgetIconCodeSnippet}/></td>
                  <td>{widgetStats.codeSnippetCount}</td><td>code snippets</td>
                </tr> :
                null
            }

            {
              (widgetStats.illustrations && widgetStats.illustrations > 0) ?
                <tr>
                  <td><Icon glyph='fa fa-image' className={styles.statWidgetIconVisual}/></td>
                  <td>{widgetStats.illustrations}</td><td>illustrations</td>
                </tr> :
                null
            }

          </tbody>
        </Table>
      </div>
    );
  }
};
