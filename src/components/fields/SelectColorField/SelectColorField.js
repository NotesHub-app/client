import React from 'react';
import { Select } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';
import colors from '../../../constants/colors';
import styles from './styles.module.scss';

const options = colors.map(color => ({
    value: color,
}));

export default class SelectColorField extends React.Component {
    state = {
        isOpen: false,
    };

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

        this.handleOpen();
    };

    handleOpen = e => {
        const {
            input: { onFocus },
        } = this.props;

        this.setState(
            prevState => ({ isOpen: !prevState.isOpen }),
            () => {
                onFocus(e);
            },
        );
    };

    handleClose = e => {
        const {
            input: { onBlur },
        } = this.props;

        this.setState({ isOpen: false }, () => {
            onBlur(e);
        });
    };

    render() {
        const {
            input: { value },
        } = this.props;
        const { isOpen } = this.state;

        return (
            <Select
                popoverProps={{
                    isOpen,
                    onClose: this.handleClose,
                }}
                items={options}
                itemRenderer={this.itemRenderer}
                itemPredicate={this.itemPredicate}
                onItemSelect={this.handleSelect}
                filterable={false}
                noResults={<MenuItem disabled={true} text="Нет вариантов." />}
            >
                <Button className={styles.selectButton} onClick={this.handleOpen}>
                    <div className={styles.buttonBrick} style={{ backgroundColor: value }} />
                </Button>
            </Select>
        );
    }
}
