import React from 'react';
import { connect } from 'react-redux';
import { Icon, ContextMenuTarget, Position, Popover } from '@blueprintjs/core';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import Substring from 'react-substring';
import styles from './styles.module.scss';
import { expendNavigationTreeNode, setRemoveNoteAlertStatus } from '../../../../../redux/modules/uiSettings/actions';
import { createNote } from '../../../../../redux/modules/data/actions';
import { getRootGroupNodeTreeId, getRootPersonalNodeTreeId } from '../../../../../utils/navigation';
import NoteMenu from '../../../../menus/NoteMenu';

export class NodeContent extends React.Component {
    state = {
        isOpenControlPopover: false,
    };

    handleOpenControlPopover = () => {
        this.setState({
            isOpenControlPopover: true,
        });
    };

    handleCloseControlPopover = () => {
        this.setState({
            isOpenControlPopover: false,
        });
    };

    renderContextMenu() {
        const { node, setRemoveNoteAlertStatus, expendNavigationTreeNode, createNote, push } = this.props;

        switch (node.type) {
            case 'note': {
                return (
                    <NoteMenu
                        {...{
                            setRemoveNoteAlertStatus,
                            expendNavigationTreeNode,
                            createNote,
                            push,
                        }}
                        note={node.data}
                    />
                );
            }
            default:
        }
        return <span />;
    }

    handleClickAddGroupNote = async (e, nodeId) => {
        e.stopPropagation();
        const { push, createNote, expendNavigationTreeNode } = this.props;

        const note = await createNote({ groupId: nodeId });

        // Раскрываем раздел
        expendNavigationTreeNode(getRootGroupNodeTreeId(nodeId));

        // Перейти в созданную заметку
        push(`/notes/${note.get('id')}`);
    };

    handleAddPersonalNote = async e => {
        e.stopPropagation();
        const { push, createNote, expendNavigationTreeNode } = this.props;

        const note = await createNote({});

        // Раскрываем раздел
        expendNavigationTreeNode(getRootPersonalNodeTreeId());

        // Перейти в созданную заметку
        push(`/notes/${note.get('id')}`);
    };

    handleOpenGroupConfiguration = (e, groupId) => {
        e.stopPropagation();

        const {
            additionalData: { openGroupConfigurationDialog },
        } = this.props;

        openGroupConfigurationDialog(groupId);
    };

    renderNoteNode() {
        const {
            node,
            additionalData: { activeNoteId, navigationFilter },

            setRemoveNoteAlertStatus,
            expendNavigationTreeNode,
            createNote,
            push,
        } = this.props;
        const { isOpenControlPopover } = this.state;

        const activeItem = node.data.get('id') === activeNoteId;

        return (
            <React.Fragment>
                <div className={styles.main}>
                    <Icon
                        icon={node.data.get('icon')}
                        color={!activeItem ? node.data.get('iconColor') : undefined}
                        className={styles.nodeIcon}
                    />
                    <Substring
                        substrings={[
                            {
                                match: navigationFilter,
                                className: 'text-highlight',
                            },
                        ]}
                    >
                        {node.data.get('title')}
                    </Substring>

                    {activeItem && (
                        <div
                            className={styles.activeNodeMark}
                            style={{ backgroundColor: node.data.get('iconColor') }}
                        />
                    )}
                </div>

                {(isOpenControlPopover || activeItem) && (
                    <div className={styles.control}>
                        <Popover
                            position={Position.BOTTOM}
                            isOpen={isOpenControlPopover}
                            onClose={this.handleCloseControlPopover}
                            content={
                                <NoteMenu
                                    {...{
                                        setRemoveNoteAlertStatus,
                                        expendNavigationTreeNode,
                                        createNote,
                                        push,
                                    }}
                                    note={node.data}
                                />
                            }
                        >
                            <button
                                className={classNames(styles.controlButton, { [styles.active]: isOpenControlPopover })}
                                onClick={this.handleOpenControlPopover}
                            >
                                <Icon icon="more" />
                            </button>
                        </Popover>
                    </div>
                )}
            </React.Fragment>
        );
    }

    renderGroupRootNode() {
        const { node } = this.props;

        return (
            <React.Fragment>
                <div className={styles.main}>{node.data.get('title')}</div>

                <div className={styles.control}>
                    <button
                        className={classNames(styles.controlButton, styles.controlButtonRoot)}
                        onClick={e => this.handleOpenGroupConfiguration(e, node.data.get('id'))}
                    >
                        <Icon icon="cog" />
                    </button>
                    <button
                        className={classNames(styles.controlButton, styles.controlButtonRoot)}
                        onClick={e => this.handleClickAddGroupNote(e, node.data.get('id'))}
                    >
                        <Icon icon="plus" />
                    </button>
                </div>
            </React.Fragment>
        );
    }

    renderPersonalRootNode() {
        return (
            <React.Fragment>
                <div className={styles.main}>Персональные заметки</div>

                <div className={styles.control}>
                    <button
                        className={classNames(styles.controlButton, styles.controlButtonRoot)}
                        onClick={this.handleAddPersonalNote}
                    >
                        <Icon icon="plus" />
                    </button>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { node } = this.props;

        let content = <span />;

        switch (node.type) {
            case 'note': {
                content = this.renderNoteNode();
                break;
            }
            case 'group': {
                content = this.renderGroupRootNode();
                break;
            }
            case 'personal': {
                content = this.renderPersonalRootNode();
                break;
            }
            default:
        }

        return <div className={classNames('VTTree__NodeContent', styles.nodeContent)}>{content}</div>;
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {
        createNote,
        expendNavigationTreeNode,
        push,
        setRemoveNoteAlertStatus,
    },
)(ContextMenuTarget(NodeContent));
