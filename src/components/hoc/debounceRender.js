import React, { Component } from 'react';
import debounce from 'lodash/debounce';

export default function debounceRender(ComponentToDebounce, debounceTime, debounceOptions, shouldForceUpdate) {
    return class DebouncedContainer extends Component {
        updateDebounced = debounce(this.forceUpdate, debounceTime, debounceOptions);

        shouldComponentUpdate(nextProps, nextState) {
            this.updateDebounced();
            if (shouldForceUpdate) {
                return shouldForceUpdate(nextProps, nextState, this.props, this.state);
            }
            return false;
        }

        componentWillUnmount() {
            this.updateDebounced.cancel();
        }

        render() {
            return <ComponentToDebounce {...this.props} />;
        }
    };
}
