import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, MenuItem, ContextMenu, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import styles from './styles.module.scss';
import { expendNavigationTreeNode } from '../../../../../redux/modules/uiSettings/actions';
import { createNote } from '../../../../../redux/modules/data/actions';
import { getNoteNodeTreeId, getRootGroupNodeTreeId, getRootPersonalNodeTreeId } from '../../../../../utils/navigation';

export class NodeContent extends React.Component {
    state = {
        isHover: false,
    };

    handleMouserEnter = () => {
        this.setState({ isHover: true });
    };

    handleMouserLeave = () => {
        this.setState({ isHover: false });
    };

    handleContextMenu = e => {
        e.preventDefault();

        const {
            node,
            additionalData: { onRemoveNote },
        } = this.props;

        switch (node.type) {
            case 'note': {
                // render a Menu without JSX...
                const menu = React.createElement(
                    Menu,
                    {},
                    React.createElement(MenuItem, {
                        onClick: () => {
                            onRemoveNote(node);
                        },
                        icon: 'trash',
                        intent: Intent.DANGER,
                        text: 'Удалить',
                    })
                );

                ContextMenu.show(menu, { left: e.clientX, top: e.clientY });

                break;
            }
            default:
        }
    };

    handleClickAddSubNote = async nodeId => {
        const { push, createNote, expendNavigationTreeNode } = this.props;

        const note = await createNote({ parentId: nodeId });

        // Раскрываем текущую заметку
        expendNavigationTreeNode(getNoteNodeTreeId(nodeId));

        // Перейти в созданную заметку
        push(`/notes/${note.get('id')}`);
    };

    handleClickAddGroupNote = async nodeId => {
        const { push, createNote, expendNavigationTreeNode } = this.props;

        const note = await createNote({ groupId: nodeId });

        // Раскрываем раздел
        expendNavigationTreeNode(getRootGroupNodeTreeId(nodeId));

        // Перейти в созданную заметку
        push(`/notes/${note.get('id')}`);
    };

    handleAddPersonalNote = async () => {
        const { push, createNote, expendNavigationTreeNode } = this.props;

        const note = await createNote({});

        // Раскрываем раздел
        expendNavigationTreeNode(getRootPersonalNodeTreeId());

        // Перейти в созданную заметку
        push(`/notes/${note.get('id')}`);
    };

    handleOpenGroupConfiguration = groupId => {
        alert(groupId);
    };

    renderNoteNode() {
        const {
            node,
            additionalData: { activeNoteId },
        } = this.props;
        const { isHover } = this.state;

        const activeItem = node.data.get('id') === activeNoteId;

        return (
            <React.Fragment>
                <div className={styles.main}>
                    <Icon
                        icon={node.data.get('icon')}
                        color={!activeItem ? node.data.get('iconColor') : undefined}
                        className={styles.nodeIcon}
                    />
                    {node.data.get('title')}
                    {activeItem && (
                        <div
                            className={styles.activeNodeMark}
                            style={{ backgroundColor: node.data.get('iconColor') }}
                        />
                    )}
                </div>

                {isHover && (
                    <div className={styles.control}>
                        <button
                            className={styles.controlButton}
                            onClick={() => this.handleClickAddSubNote(node.data.get('id'))}
                        >
                            <Icon icon="plus" />
                        </button>
                    </div>
                )}
            </React.Fragment>
        );
    }

    renderGroupRootNode() {
        const { node } = this.props;
        const { isHover } = this.state;

        return (
            <React.Fragment>
                <div className={styles.main}>{node.data.get('title')}</div>

                {isHover && (
                    <div className={styles.control}>
                        <button
                            className={styles.controlButton}
                            onClick={() => this.handleOpenGroupConfiguration(node.data.get('id'))}
                        >
                            <Icon icon="cog" />
                        </button>
                        <button
                            className={styles.controlButton}
                            onClick={() => this.handleClickAddGroupNote(node.data.get('id'))}
                        >
                            <Icon icon="plus" />
                        </button>
                    </div>
                )}
            </React.Fragment>
        );
    }

    renderPersonalRootNode() {
        const { isHover } = this.state;
        return (
            <React.Fragment>
                <div className={styles.main}>Персональные заметки</div>

                {isHover && (
                    <div className={styles.control}>
                        <button className={styles.controlButton} onClick={() => this.handleAddPersonalNote()}>
                            <Icon icon="plus" />
                        </button>
                    </div>
                )}
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

        return (
            <div
                className={classNames('VTTree__NodeContent', styles.nodeContent)}
                onMouseEnter={this.handleMouserEnter}
                onMouseLeave={this.handleMouserLeave}
                onContextMenu={this.handleContextMenu}
            >
                {content}
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
        createNote,
        expendNavigationTreeNode,
        push,
    }
)(NodeContent);
