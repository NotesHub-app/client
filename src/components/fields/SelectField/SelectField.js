import React from 'react';
import { Select } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';
import * as _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';
import styles from './styles.module.scss';

export default class SelectField extends React.Component {
    static propTypes = {
        options: PropTypes.oneOfType([
            PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.any,
                    value: PropTypes.any.isRequired,
                }),
            ),
            PropTypes.arrayOf(PropTypes.node),
        ]),
        wide: PropTypes.bool,
        buttonClassName: PropTypes.string,
    };

    itemRenderer = (item, { handleClick }) => {
        const { input: { value } } = this.props;

        return (
            <MenuItem
                key={_.toString(item.value)}
                text={item.label || item.value}
                onClick={handleClick}
                className={classNames({ 'text-strong': item.value === value })}
            />
        );
    };

    handleSelect = item => {
        const { input: { onChange } } = this.props;
        onChange(item.value);
    };

    render() {
        let { options } = this.props;
        const { wide, buttonClassName, input: { value } } = this.props;

        if (options[0] !== undefined && !_.isObject(options[0])) {
            options = options.map(option => ({ value: option, label: option }));
        }

        const valueItem = _.find(options, option => option.value === value);

        const valueLabel = _.isObject(valueItem) ? valueItem.label : valueItem;

        return (
            <React.Fragment>
                <Select
                    items={options}
                    itemRenderer={this.itemRenderer}
                    onItemSelect={this.handleSelect}
                    filterable={false}
                    className={wide && styles.wide}
                    noResults={<MenuItem disabled={true} text="Нет вариантов." />}
                    popoverProps={{ minimal: true, usePortal: false }}
                >
                    <Button
                        className={classNames('selectButton', buttonClassName)}
                        text={valueItem !== undefined ? _.toString(valueLabel) : 'Выбрать...'}
                        rightIcon="double-caret-vertical"
                    />
                </Select>

                <FieldErrorLabel {...this.props} />
            </React.Fragment>
        );
    }
}
