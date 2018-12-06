import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@blueprintjs/core';
import classNames from 'classnames';
import { push } from 'connected-react-router';
import styles from './styles.module.scss';
import { expendNavigationTreeNode } from '../../../../../redux/modules/uiSettings/actions';
import { createNote } from '../../../../../redux/modules/data/actions';
import { getNoteNodeTreeId } from '../../../../../utils/navigation';

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

    handleClickAddSubNote = async node => {
        const { push, createNote, expendNavigationTreeNode } = this.props;

        const note = await createNote({ parentId: node.data.get('id') });

        // Раскрываем текущую заметку
        expendNavigationTreeNode(getNoteNodeTreeId(node.data.get('id')));

        // Перейти в созданную заметку
        push(`/notes/${note.get('id')}`);
    };

    renderNoteNode() {
        const {
            node,
            additionalData: { activeNoteId },
        } = this.props;
        const { isHover } = this.state;

        const activeItem = node.data.get('id') === activeNoteId;
        return (
            <div
                className={classNames('VTTree__NodeContent', styles.nodeContent)}
                onMouseEnter={this.handleMouserEnter}
                onMouseLeave={this.handleMouserLeave}
            >
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
                        <button className={styles.controlButton} onClick={() => this.handleClickAddSubNote(node)}>
                            <Icon icon="small-plus" />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    renderGroupRootNode() {
        const { node } = this.props;

        return (
            <div className={classNames('VTTree__NodeContent', styles.nodeContent)}>
                <div className={styles.main}>{node.data.get('title')}</div>
            </div>
        );
    }

    renderPersonalRootNode() {
        return (
            <div className={classNames('VTTree__NodeContent', styles.nodeContent)}>
                <div className={styles.main}>Персональные заметки</div>
            </div>
        );
    }

    render() {
        const { node } = this.props;

        switch (node.type) {
            case 'note':
                return this.renderNoteNode();
            case 'group':
                return this.renderGroupRootNode();
            case 'personal':
                return this.renderPersonalRootNode();
            default:
                return <span />;
        }
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
    },
)(NodeContent);
