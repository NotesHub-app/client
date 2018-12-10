import React from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { setNavigationFilter } from '../../../../redux/modules/uiSettings/actions';

export class NavigationFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editingValue: props.value,
        };
    }

    onChangeValue = debounce(value => {
        const { setNavigationFilter } = this.props;
        setNavigationFilter(value);
    }, 300);

    handleChangeInput = e => {
        const { value } = e.target;

        this.setState({
            editingValue: value,
        });

        this.onChangeValue(value);
    };

    handleClearValue = () => {
        const { setNavigationFilter } = this.props;

        const value = '';
        this.setState({
            editingValue: value,
        });

        setNavigationFilter(value);
    };

    render() {
        const { editingValue } = this.state;
        const style = this.props.style || {};
        const { width, inputClassName } = this.props;

        const placeholder = this.props.placeholder || 'Фильтр...';

        return (
            <div className={styles.root}>
                <div className="bp3-input-group" style={{ display: 'inline', ...style }}>
                    <span className={`bp3-icon bp3-icon-filter-list`} style={{ margin: '2px 5px' }} />
                    <input
                        type="text"
                        className={classNames('bp3-input', { 'bp3-intent-warning': !!editingValue }, inputClassName)}
                        placeholder={placeholder}
                        style={{ width }}
                        onChange={this.handleChangeInput}
                        value={editingValue}
                    />
                    {editingValue && (
                        <button
                            onClick={this.handleClearValue}
                            className="bp3-button bp3-minimal bp3-intent-warning bp3-icon-cross"
                            style={{ margin: '0px 3px', minHeight: 18 }}
                        />
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        value: state.uiSettings.get('navigationFilter'),
    };
}

export default connect(
    mapStateToProps,
    {
        setNavigationFilter,
    }
)(NavigationFilter);
