import React from 'react';
import { MultiSelect } from '@blueprintjs/select';
import { MenuItem } from '@blueprintjs/core';
import * as _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FieldErrorLabel from '../../common/FieldErrorLabel/FieldErrorLabel';

export default class MultiSelectField extends React.Component {
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
    };

    isItemSelected(item) {
        const { input: { value } } = this.props;
        return value && value.includes(item.value);
    }

    itemRenderer = (item, { handleClick }) => {
        const { input: { value } } = this.props;

        return (
            <MenuItem
                key={_.toString(item.value)}
                text={item.label || item.value}
                onClick={handleClick}
                icon={this.isItemSelected(item) ? 'tick' : 'blank'}
                className={classNames({ 'text-strong': item.value === value })}
            />
        );
    };

    handleSelect = item => {
        let { input: { value } } = this.props;
        const { input: { onChange } } = this.props;
        value = value || [];
        if (value.includes(item.value)) {
            onChange([...value].filter(i => i !== item.value));
        } else {
            onChange([...value, item.value]);
        }
    };

    handleTagRemove = (tag, index) => {
        const { input: { onChange, value } } = this.props;

        const newValue = [...value];
        delete newValue[index];
        onChange(newValue);
    };

    render() {
        let { options, input: { value } } = this.props;

        if (options[0] !== undefined && !_.isObject(options[0])) {
            options = options.map(option => ({ value: option, label: option }));
        }

        value = value || [];

        return (
            <div>
                <MultiSelect
                    items={options}
                    itemRenderer={this.itemRenderer}
                    onItemSelect={this.handleSelect}
                    filterable={false}
                    noResults={<MenuItem disabled={true} text="Нет вариантов." />}
                    popoverProps={{ minimal: true, usePortal: false }}
                    selectedItems={value}
                    tagRenderer={f => f}
                    tagInputProps={{ onRemove: this.handleTagRemove, inputProps: { placeholder: 'Выбрать...' } }}
                />

                <FieldErrorLabel {...this.props} />
            </div>
        );
    }
}
