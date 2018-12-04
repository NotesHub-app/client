import React from 'react';
import { InputGroup, Intent, Button } from '@blueprintjs/core';
import styles from './styles.module.scss';

export default class Filter extends React.Component {
    handleClearFilter = () => {
        const { onChange } = this.props;
        onChange('');
    };

    handleChangeValue = e => {
        const { onChange } = this.props;
        onChange(e.target.value);
    };

    render() {
        const { value } = this.props;
        return (
            <div>
                <InputGroup
                    placeholder="Фильтр иконок"
                    leftIcon="filter-list"
                    fill
                    className={styles.root}
                    rightElement={
                        value && (
                            <Button
                                icon="cross"
                                intent={Intent.WARNING}
                                minimal={true}
                                onClick={this.handleClearFilter}
                            />
                        )
                    }
                    type="text"
                    value={value}
                    onChange={this.handleChangeValue}
                />
            </div>
        );
    }
}
