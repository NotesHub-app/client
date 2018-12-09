import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button, Intent, ProgressBar } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import { Table, Column } from 'react-vt-table';
import { noteFilesListSelector } from '../../../../../../../redux/selectors';
import styles from './styles.module.scss';
import { humanFileSize } from '../../../../../../../utils/human';
import RemoveItemAlert from '../../../../../../dialogs/RemoveItemAlert';
import { removeFile } from '../../../../../../../redux/modules/data/actions';

export class Files extends React.Component {
    state = {
        isOpenRemoveAlert: false,
        removingFileId: null,
    };

    handleOpenRemoveAlert = fileId => {
        this.setState({
            isOpenRemoveAlert: true,
            removingFileId: fileId,
        });
    };

    handleCloseRemoveAlert = () => {
        this.setState({
            isOpenRemoveAlert: false,
            removingFileId: null,
        });
    };

    handleConfirmRemoveAlert = () => {
        const { removeFile } = this.props;
        const { removingFileId } = this.state;

        removeFile(removingFileId);

        this.handleCloseRemoveAlert();
    };

    handleDownloadFile = file => {};

    render() {
        const { files } = this.props;
        const { isOpenRemoveAlert } = this.state;

        // TODO {file.get('_uploadProgress')}

        return (
            <React.Fragment>
                <SizeMe>
                    {({ width, height }) => (
                        <Table
                            className="MyTable"
                            width={width}
                            height={height}
                            data={files}
                            rowHeight={30}
                            dynamicColumnWidth={true}
                            overflowWidth={8}
                            noItemsLabel="Файлов нет"
                            disableHeader={false}
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
                                                styles.fileIcon,
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
                                        <Button
                                            icon="cross"
                                            intent={Intent.DANGER}
                                            minimal
                                            small
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.handleOpenRemoveAlert(rowData.get('id'));
                                            }}
                                        />
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
                    text="Точно хотите удалить выбранный файл???"
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { noteId } = ownProps;
    return {
        files: noteFilesListSelector(state, noteId),
    };
}

export default connect(mapStateToProps, {
    removeFile,
})(Files);
