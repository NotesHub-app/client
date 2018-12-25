import React from 'react';
import { connect } from 'react-redux';
import { Dialog, Icon, Spinner } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { noteHistoryItemSelector } from '../../../redux/selectors';
import { getNoteHistoryItemDetails } from '../../../redux/modules/data/actions';
import DateTimeLabel from '../../common/DateTimeLabel';
import UserLabel from '../../common/UserLabel';

export class ShowHistoryItemDialog extends React.Component {
    static defaultProps = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        historyItemIdx: PropTypes.number,
        noteId: PropTypes.string,
    };

    state = {
        isLoading: false,
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    async loadHistoryItemDetails() {
        const { noteId, historyItemIdx, getNoteHistoryItemDetails } = this.props;

        await this.setState({ isLoading: true });
        await getNoteHistoryItemDetails(noteId, historyItemIdx);
        await this.setState({ isLoading: false });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.loadHistoryItemDetails();
        }
    }

    renderLoading() {
        return (
            <div className="loadingContainer">
                <Spinner size={80} />
            </div>
        );
    }

    renderIconDiff() {
        const { noteHistoryItem } = this.props;

        if (
            noteHistoryItem.getIn(['before', 'icon']) !== noteHistoryItem.getIn(['after', 'icon']) ||
            noteHistoryItem.getIn(['before', 'iconColor']) !== noteHistoryItem.getIn(['after', 'iconColor'])
        ) {
            return (
                <div className="no-wrap">
                    <div className={styles.iconContainer}>
                        <Icon
                            icon={noteHistoryItem.getIn(['before', 'icon'])}
                            color={noteHistoryItem.getIn(['before', 'iconColor'])}
                        />
                    </div>
                    <div className={styles.arrow} />
                    <div className={styles.iconContainer}>
                        <Icon
                            icon={noteHistoryItem.getIn(['after', 'icon'])}
                            color={noteHistoryItem.getIn(['after', 'iconColor'])}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="no-wrap">
                <div className={styles.iconContainer}>
                    <Icon
                        icon={noteHistoryItem.getIn(['after', 'icon'])}
                        color={noteHistoryItem.getIn(['after', 'iconColor'])}
                    />
                </div>
            </div>
        );
    }

    renderContent() {
        const { noteHistoryItem } = this.props;

        return (
            <div className={styles.content}>
                <div className={styles.metaSection}>
                    <div style={{ float: 'left' }}>
                        <b>Автор:</b> <UserLabel {...noteHistoryItem.get('author').toJS()} />
                    </div>
                    <div style={{ float: 'right' }}>
                        <b>Дата:</b> <DateTimeLabel value={noteHistoryItem.get('dateTime')} />
                    </div>
                </div>
                <div className={styles.titleSection}>
                    {this.renderIconDiff()}
                    <div className={styles.titleSeparator} />
                    <div dangerouslySetInnerHTML={{ __html: noteHistoryItem.getIn(['diffHtmls', 'title']) }} />
                </div>
                <div className={styles.contentSection}>
                    <div dangerouslySetInnerHTML={{ __html: noteHistoryItem.getIn(['diffHtmls', 'content']) }} />
                </div>
            </div>
        );
    }

    render() {
        const { isOpen, noteHistoryItem } = this.props;
        const { isLoading } = this.state;

        const isLoaded = !!noteHistoryItem;

        return (
            <Dialog
                className={styles.root}
                title="Изменения"
                icon="new-link"
                isOpen={isOpen}
                onClose={this.handleClose}
            >
                <div className={styles.content}>
                    {!isLoading && isLoaded ? this.renderContent() : this.renderLoading()}
                </div>
            </Dialog>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { noteId, historyItemIdx } = ownProps;

    return {
        noteHistoryItem: noteHistoryItemSelector(state, noteId, historyItemIdx),
    };
}

export default connect(
    mapStateToProps,
    {
        getNoteHistoryItemDetails,
    },
)(ShowHistoryItemDialog);
