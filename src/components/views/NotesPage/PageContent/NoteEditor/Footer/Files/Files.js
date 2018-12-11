import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button, Intent, ProgressBar, Position, Tooltip } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import { Table, Column } from 'react-vt-table';
import { noteFilesListSelector } from '../../../../../../../redux/selectors';
import styles from './styles.module.scss';
import { humanFileSize } from '../../../../../../../utils/human';
import RemoveItemAlert from '../../../../../../dialogs/RemoveItemAlert';
import { removeManyFiles, uploadNoteFile } from '../../../../../../../redux/modules/data/actions';
import { maxArr, minArr, rangeArr } from '../../../../../../../utils/helpers';
import config from '../../../../../../../config';
import { downloadURI } from '../../../../../../../utils/browser';
import CopyTextButton from '../../../../../../common/CopyTextButton';

export class Files extends React.Component {
    state = {
        isOpenRemoveAlert: false,
        removingFileIds: null,
        selection: [],
    };

    clearSelection = () => {
        this.setState({
            selection: [],
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.noteId !== this.props.noteId) {
            this.clearSelection();
        }
    }

    handleRowMouseDown = (event, { rowIndex }) => {
        const { selection } = this.state;

        if (event.ctrlKey) {
            if (!selection.includes(rowIndex)) {
                this.setState({ selection: [...selection, rowIndex] });
            } else {
                const newSelection = selection.filter(i => i !== rowIndex);
                this.setState({ selection: [...newSelection] });
            }
        } else if (event.shiftKey && selection.length) {
            selection.push(rowIndex);
            this.setState({ selection: rangeArr(minArr(selection), maxArr(selection)) });
        } else {
            this.setState({ selection: [rowIndex] });
        }
    };

    handleDoubleClickRow = (event, { rowData }) => {
        const { fileToken } = this.props;
        const fileId = rowData.get('id');
        downloadURI(`${config.apiUrl}/directDownload/${fileId}?token=${fileToken}`);
    };

    handleDownloadFiles = async fileIds => {
        const { fileToken } = this.props;
        for (const fileId of fileIds) {
            downloadURI(`${config.apiUrl}/directDownload/${fileId}?token=${fileToken}`);
            await Promise.delay(200);
        }
    };

    getRowClassName = rowIndex => {
        const { selection } = this.state;
        if (selection.includes(rowIndex)) {
            return styles.rowSelected;
        }
        return '';
    };

    handleOpenRemoveAlert = fileIds => {
        this.setState({
            isOpenRemoveAlert: true,
            removingFileIds: fileIds,
        });
    };

    handleCloseRemoveAlert = () => {
        this.setState({
            isOpenRemoveAlert: false,
            removingFileIds: null,
        });
    };

    handleConfirmRemoveAlert = async () => {
        const { removeManyFiles } = this.props;
        const { removingFileIds } = this.state;

        await removeManyFiles(removingFileIds);

        window.showToast({ message: 'Удаление завершено!', intent: Intent.SUCCESS, icon: 'tick' });

        this.handleCloseRemoveAlert();

        this.clearSelection();
    };

    getSelectedFilesIds = () => {
        const { selection } = this.state;
        const { files } = this.props;
        const result = [];
        selection.forEach(index => {
            result.push(files.getIn([index, 'id']));
        });
        return result;
    };

    handleDownloadSelectedFiles = async () => {
        await this.handleDownloadFiles(this.getSelectedFilesIds());
    };

    handleRemoveSelectedFiles = () => {
        this.handleOpenRemoveAlert(this.getSelectedFilesIds());
    };

    handleClickUploadFile = () => {
        const { uploadNoteFile, noteId } = this.props;
        const fileInput = document.createElement('input');
        fileInput.multiple = true;
        const changeHandler = async () => {
            for (const fileObj of fileInput.files) {
                await uploadNoteFile({ noteId, fileObj });
            }
            fileInput.removeEventListener('change', changeHandler);
        };
        fileInput.addEventListener('change', changeHandler);
        fileInput.type = 'file';
        fileInput.click();
    };

    render() {
        const { files } = this.props;
        const { isOpenRemoveAlert, selection } = this.state;

        // TODO {file.get('_uploadProgress')}

        return (
            <div className={styles.root}>
                <div className={styles.controls}>
                    <Tooltip content="Загрузить файлы" position={Position.RIGHT} hoverOpenDelay={500}>
                        <Button
                            className={styles.controlItem}
                            icon="cloud-upload"
                            minimal
                            small
                            onClick={this.handleClickUploadFile}
                        />
                    </Tooltip>

                    <Tooltip
                        content="Скачать файлы"
                        position={Position.RIGHT}
                        hoverOpenDelay={500}
                        disabled={!selection.length}
                    >
                        <Button
                            className={styles.controlItem}
                            icon="cloud-download"
                            minimal
                            small
                            disabled={!selection.length}
                            onClick={this.handleDownloadSelectedFiles}
                        />
                    </Tooltip>

                    <Tooltip
                        content="Удалить файлы"
                        position={Position.RIGHT}
                        hoverOpenDelay={500}
                        disabled={!selection.length}
                    >
                        <Button
                            className={styles.controlItem}
                            icon="cross"
                            minimal
                            intent={Intent.DANGER}
                            small
                            disabled={!selection.length}
                            onClick={this.handleRemoveSelectedFiles}
                        />
                    </Tooltip>
                </div>
                <div className={styles.main}>
                    <React.Fragment>
                        <SizeMe>
                            {({ width, height }) => (
                                <Table
                                    className={styles.filesTable}
                                    width={width}
                                    height={height}
                                    data={files}
                                    rowHeight={30}
                                    dynamicColumnWidth={true}
                                    overflowWidth={8}
                                    noItemsLabel="Файлов нет"
                                    disableHeader={false}
                                    onRowMouseDown={this.handleRowMouseDown}
                                    onRowDoubleClick={this.handleDoubleClickRow}
                                    rowClassName={this.getRowClassName}
                                >
                                    <Column
                                        label=""
                                        dataKey="ext"
                                        width={50}
                                        cellRenderer={({ dataKey, rowData }) => (
                                            <div className="VTCellContent text-center">
                                                <span
                                                    className={classNames(
                                                        'fiv-sqo',
                                                        `fiv-icon-${rowData.get(dataKey)}`,
                                                        styles.fileIcon
                                                    )}
                                                />
                                            </div>
                                        )}
                                    />
                                    <Column
                                        label="Имя файла"
                                        dataKey="fileName"
                                        cellRenderer={({ dataKey, rowData }) => (
                                            <div className="VTCellContent">
                                                {rowData.get('fileName')}
                                                {rowData.get('_uploadProgress') !== undefined && (
                                                    <ProgressBar
                                                        intent={Intent.PRIMARY}
                                                        animate
                                                        value={rowData.get('_uploadProgress') / 100}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                    <Column
                                        label="Размер"
                                        dataKey="size"
                                        width={120}
                                        cellRenderer={({ dataKey, rowData }) => (
                                            <div className="VTCellContent">{humanFileSize(rowData.get(dataKey))}</div>
                                        )}
                                    />
                                    <Column
                                        label=""
                                        dataKey="id"
                                        width={40}
                                        cellRenderer={({ dataKey, rowData }) => (
                                            <div className="VTCellContent">
                                                <Tooltip
                                                    content="Копировать ссылку для заметки"
                                                    hoverOpenDelay={700}
                                                >
                                                    <CopyTextButton
                                                        textToCopy={`file://${rowData.get('id')}`}
                                                        minimal
                                                        small
                                                        icon="link"
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    />
                                    <Column
                                        label=""
                                        dataKey="id"
                                        width={40}
                                        cellRenderer={({ dataKey, rowData }) => (
                                            <div className="VTCellContent">
                                                <Tooltip
                                                    content="Удалить файл"
                                                    intent={Intent.DANGER}
                                                    hoverOpenDelay={700}
                                                >
                                                    <Button
                                                        icon="trash"
                                                        intent={Intent.DANGER}
                                                        minimal
                                                        small
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.handleOpenRemoveAlert([rowData.get('id')]);
                                                        }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    />
                                </Table>
                            )}
                        </SizeMe>
                        <RemoveItemAlert
                            isOpen={isOpenRemoveAlert}
                            onConfirm={this.handleConfirmRemoveAlert}
                            onCancel={this.handleCloseRemoveAlert}
                            text="Действительно хотите удалить выбранные файлы?"
                        />
                    </React.Fragment>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { noteId } = ownProps;
    return {
        files: noteFilesListSelector(state, noteId),
        fileToken: state.user.get('fileToken'),
    };
}

export default connect(
    mapStateToProps,
    {
        removeManyFiles,
        uploadNoteFile,
    }
)(Files);
