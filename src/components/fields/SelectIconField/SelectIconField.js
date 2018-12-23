import React from 'react';
import { Button, Popover, Position } from '@blueprintjs/core';
import Filter from './Filter';
import IconsList from './IconsList';
import styles from './styles.module.scss';

export default class SelectIconField extends React.Component {
    state = {
        filter: '',
        isOpen: false,
    };

    handleChangeFilter = value => {
        this.setState({
            filter: value,
        });
    };

    handleSelectIcon = icon => {
        const {
            input: { onChange },
        } = this.props;

        onChange(icon);

        this.handleClose();
    };

    handleClickOpenBtn = e => {
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
        const { filter, isOpen } = this.state;
        const {
            input: { value },
        } = this.props;

        return (
            <Popover
                popoverClassName={styles.popover}
                position={Position.BOTTOM}
                isOpen={isOpen}
                onClose={this.handleClose}
                content={
                    <div>
                        <Filter value={filter} onChange={this.handleChangeFilter} />
                        <IconsList filter={filter} onSelect={this.handleSelectIcon} />
                    </div>
                }
            >
                <Button icon={value} onClick={this.handleClickOpenBtn} />
            </Popover>
        );
    }
}
