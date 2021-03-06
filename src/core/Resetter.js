import PropTypes from 'prop-types';
import { cloneElement, Component, Fragment } from 'react';

export default class Resetter extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  state = {
    key: 0,
  };

  render() {
    return (
      <Fragment>
        <div className="reset-wrapper">
          <button onClick={this.reset}>Reset</button>
        </div>
        {cloneElement(this.props.children, { key: this.state.key })}

        <style jsx>{`
          .reset-wrapper { margin-bottom: 1rem }
        `}</style>
      </Fragment>
    );
  }

  reset = () => {
    this.setState(({ key }) => ({ key: key + 1 }));
  };
}
