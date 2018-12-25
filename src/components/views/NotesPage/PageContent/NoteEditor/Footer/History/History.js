import React from 'react';
import { connect } from 'react-redux';
import Table from 'react-vt-table/dist/Table';
import Column from 'react-vt-table/dist/Column';
import classNames from 'classnames';
import { Button, Position, Tooltip } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import UserLabel from '../../../../../../common/UserLabel';
import footerStyles from '../styles.module.scss';
import { getNoteHistory } from '../../../../../../../redux/modules/data/actions';
import { noteHistoryListSelector } from '../../../../../../../redux/selectors';
import DateTimeLabel from '../../../../../../common/DateTimeLabel';
import ShowHistoryItemDialog from '../../../../../../dialogs/ShowHistoryItemDialog';

export class History extends React.Component {
    state = {
        historyLoading: false,
        isOpenShowHistoryItemDialog: false,
        activeHistoryItemIdx: null,
    };

    handleOpenShowHistoryItemDialog = idx => {
        this.setState({
            isOpenShowHistoryItemDialog: true,
            activeHistoryItemIdx: idx,
        });
    };

    handleCloseShowHistoryItemDialog = () => {
        this.setState({
            isOpenShowHistoryItemDialog: false,
            activeHistoryItemIdx: null,
        });
    };

    handleDoubleClickRow = (e, { rowIndex }) => {
        this.handleOpenShowHistoryItemDialog(rowIndex);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.noteId !== this.props.noteId) {
            this.handleReloadHistory();
        }
    }

    handleReloadHistory = () => {
        const { noteId, getNoteHistory } = this.props;
        getNoteHistory(noteId);
    };

    componentDidMount() {
        this.handleReloadHistory();
    }

    render() {
        const { historyList, noteId } = this.props;
        const { isOpenShowHistoryItemDialog, activeHistoryItemIdx } = this.state;

        if (!historyList) {
            return <div>Загрузка истории...</div>;
        }

        return (
            <div className={footerStyles.footerInner}>
                <div className={footerStyles.controls}>
                    <Tooltip content="Перезагрузить историю" position={Position.RIGHT} hoverOpenDelay={500}>
                        <Button
                            className={footerStyles.controlItem}
                            icon="refresh"
                            minimal
                            small
                            onClick={this.handleReloadHistory}
                        />
                    </Tooltip>
                </div>
                <div className={footerStyles.main}>
                    <SizeMe>
                        {({ width, height }) => (
                            <Table
                                className={footerStyles.table}
                                width={width}
                                height={height}
                                data={historyList}
                                rowHeight={35}
                                noItemsLabel="Нет записей в истории"
                                dynamicColumnWidth={true}
                                onRowDoubleClick={this.handleDoubleClickRow}
                                overflowWidth={8}
                            >
                                <Column
                                    label="Время"
                                    width={180}
                                    dataKey="dateTime"
                                    cellRenderer={({ dataKey, rowData }) => (
                                        <div className={classNames('VTCellContent')}>
                                            <DateTimeLabel value={rowData.get(dataKey)} />
                                        </div>
                                    )}
                                />
                                <Column
                                    label="Автор правки"
                                    dataKey="author"
                                    cellRenderer={({ dataKey, rowData }) => (
                                        <div className={classNames('VTCellContent')}>
                                            <UserLabel {...rowData.get(dataKey).toJS()} />
                                        </div>
                                    )}
                                />
                            </Table>
                        )}
                    </SizeMe>
                </div>

                <ShowHistoryItemDialog
                    isOpen={isOpenShowHistoryItemDialog}
                    onClose={this.handleCloseShowHistoryItemDialog}
                    noteId={noteId}
                    historyItemIdx={activeHistoryItemIdx}
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { noteId } = ownProps;
    return {
        historyList: noteHistoryListSelector(state, noteId),
    };
}

export default connect(
    mapStateToProps,
    {
        getNoteHistory,
    },
)(History);
