import PropTypes from 'prop-types';
import { Component } from 'react';

import Interval from 'core/Interval';

export default class Iterator extends Component {
  static propTypes = {
    children: PropTypes.any,
    iterable: PropTypes.any.isRequired,
    timeout: PropTypes.any,
  };

  generator = this.iterate();

  componentWillUnmount() {
    this.generator.return();
  }

  render() {
    return (
      <Interval getData={this.nextValue} timeout={this.props.timeout}>
        {this.props.children}
      </Interval>
    );
  }

  getIterable() {
    if (typeof this.props.iterable === 'function') {
      return this.props.iterable();
    }
    return this.props.iterable;
  }

  *iterate() {
    let yielded;

    do {
      yielded = false;

      for (const value of this.getIterable()) {
        yielded = true;
        yield value;
      }
    } while (yielded);
  }

  nextValue = () => this.generator.next().value;
}
