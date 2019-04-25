import React, { Component, PropTypes } from 'react';
import { DropdownButton } from 'react-bootstrap';
import styles from './editorLoaderOptions.module.scss';

export class LoaderOptions extends Component {
  constructor(props) {
    super(props);
    this.onLoaderToggle = this.onLoaderToggle.bind(this);
  }

  onLoaderToggle(e, loaderName) {
    const { loaders, onLoadersChange } = this.props;
    loaders[loaderName].enabled = e.target.checked;
    onLoadersChange(loaders);
  }

  render() {
    const { loaders } = this.props;
    let loaderList = null;

    loaderList = Object.keys(loaders).map((loaderName, i) => {
      const loader = loaders[loaderName];
      return (
        <div className={styles.loaderOption} key={i}>
          {loader.title}
          <input
            type="checkbox"
            className={styles.loaderOptionCheckbox}
            onChange={e => this.onLoaderToggle(e, loaderName)}
            checked={loader.enabled}
          />
        </div>
      );
    });

    return (
      <div className={styles.loadersWrapper}>
        <DropdownButton id={"Loaders dropdown"} className={styles.dropdownButton} title={'Loaders'}>
          { loaderList }
        </DropdownButton>
      </div>
    );
  }
}

LoaderOptions.propTypes = {
  loaders: PropTypes.object.isRequired,
  onLoadersChange: PropTypes.func.isRequired,
};
