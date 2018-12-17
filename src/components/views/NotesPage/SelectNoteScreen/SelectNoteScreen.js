import React from 'react';
import { Callout, Button } from '@blueprintjs/core';
import styles from './styles.module.scss';

export default class SelectNoteScreen extends React.Component {
    render() {
        return (
            <div className={styles.root}>
                <Callout title="Выберите заметку!" icon="hand-left">
                    Для продолжения вам необходимо создать или выбрать уже существующую заметку в левом меню. Для
                    создания используйте кнопку с изображением <Button icon="plus" minimal small />.
                </Callout>
            </div>
        );
    }
}
