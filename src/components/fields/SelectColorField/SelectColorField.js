import React from 'react';
import { Select } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';
import colors from '../../../constants/colors';
import styles from './styles.module.scss';

const options = colors.map(color => ({
    value: color,
}));

export default class SelectColorField extends React.Component {
    itemRenderer = (item, { handleClick }) => (
        <div className={styles.colorBrick} onClick={handleClick} key={item.value}>
            <div className={styles.colorContent} style={{ backgroundColor: item.value }} />
        </div>
    );

    handleSelect = item => {
        const {
            input: { onChange },
        } = this.props;
        onChange(item.value);
    };

    render() {
        const {
            input: { value },
        } = this.props;

        return (
            <Select
                items={options}
                itemRenderer={this.itemRenderer}
                itemPredicate={this.itemPredicate}
                onItemSelect={this.handleSelect}
                filterable={false}
                noResults={<MenuItem disabled={true} text="Нет вариантов." />}
            >
                <Button className={styles.selectButton}>
                    <div className={styles.buttonBrick} style={{ backgroundColor: value }} />
                </Button>
            </Select>
        );
    }
}
