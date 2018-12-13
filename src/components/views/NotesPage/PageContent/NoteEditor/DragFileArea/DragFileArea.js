import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { uploadNoteFile } from '../../../../../../redux/modules/data/actions';

export class DragFileArea extends React.Component {
    static propTypes = {
        noteId: PropTypes.string.isRequired,
    };

    state = {
        active: false,
    };

    enterCounter = 0;

    handleDragover = event => {
        // Важно! Инчае не сможем дропнуть документ
        event.preventDefault();
    };

    handleDragenter = event => {
        // Обращаем внимание только на файлы
        if (event.dataTransfer.types[0] !== 'Files') {
            return;
        }
        if (this.enterCounter === 0) {
            this.setState({ active: true });
        }
        this.enterCounter += 1;
    };

    handleDragleave = event => {
        this.enterCounter -= 1;

        if (this.enterCounter === 0) {
            this.setState({ active: false });
        }
    };

    handleDrop = event => {
        const { uploadNoteFile, noteId } = this.props;
        event.preventDefault();

        this.setState({ active: false }, () => {
            this.enterCounter = 0;
        });

        function traverseFileTree(item, path) {
            path = path || '';
            if (item.isFile) {
                item.file(fileObj => {
                    uploadNoteFile({ noteId, fileObj, path });
                });
            } else if (item.isDirectory) {
                // Get folder contents
                const dirReader = item.createReader();
                dirReader.readEntries(entries => {
                    for (let i = 0; i < entries.length; i += 1) {
                        traverseFileTree(entries[i], `${path + item.name}/`);
                    }
                });
            }
        }

        const { items } = event.dataTransfer;
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i].webkitGetAsEntry();
            if (item) {
                traverseFileTree(item);
            }
        }
    };

    componentDidMount() {
        document.addEventListener('dragover', this.handleDragover, false);
        document.addEventListener('dragenter', this.handleDragenter, false);
        document.addEventListener('dragleave', this.handleDragleave, false);
        document.addEventListener('drop', this.handleDrop, false);
    }

    componentWillUnmount() {
        document.removeEventListener('dragover', this.handleDragover);
        document.removeEventListener('dragenter', this.handleDragenter);
        document.removeEventListener('dragleave', this.handleDragleave);
        document.removeEventListener('drop', this.handleDrop);
    }

    render() {
        const { active } = this.state;

        return (
            <div className={styles.root} style={{ display: !active ? 'none' : undefined }}>
                <div className={styles.inner}>
                    <div className="content">
                        <Icon icon="import" iconSize={60} />
                        <div className="text">Переместите сюда файлы для загрузки!</div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {
        uploadNoteFile,
    }
)(DragFileArea);
