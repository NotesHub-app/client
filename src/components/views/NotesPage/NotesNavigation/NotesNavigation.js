import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import PropTypes from 'prop-types';
import Tree from 'react-vt-tree';
import { Icon } from '@blueprintjs/core';
import { push } from 'connected-react-router';
import { setUiSettingsValues } from '../../../../redux/modules/uiSettings';
import { navigationNodesSelector } from '../../../../redux/selectors';
import styles from './styles.module.scss';
import classNames from 'classnames';

const NodeContentComponent = props => {
    const {
        node,
        additionalData: { activeNoteId },
    } = props;

    switch (node.type) {
        case 'note': {
            const activeItem = node.data.get('id') === activeNoteId;
            return (
                <div className="VTTree__NodeContent">
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
            );
        }
        case 'group':
            return <div className="VTTree__NodeContent">{node.data.get('title')}</div>;
        case 'personal':
            return <div className={'VTTree__NodeContent'}>Персональные заметки</div>;
        default:
            return <span />;
    }
};

export class NotesNavigation extends React.Component {
    static propTypes = {
        activeNoteId: PropTypes.string,
    };

    handleNodeExpand = (e, { node }) => {
        const { setUiSettingsValues, expendedNavigationTreeNodes } = this.props;
        setUiSettingsValues({ expendedNavigationTreeNodes: expendedNavigationTreeNodes.add(node.treeId) });
    };

    handleNodeCollapse = (e, { node }) => {
        const { setUiSettingsValues, expendedNavigationTreeNodes } = this.props;
        setUiSettingsValues({ expendedNavigationTreeNodes: expendedNavigationTreeNodes.delete(node.treeId) });
    };

    getChildNodes = node => {
        const { nodes } = this.props;

        return nodes.filter(i => i.parentTreeId === node.treeId);
    };

    getNodeClassName = ({ node }) => {
        const { activeNoteId } = this.props;
        switch (node.type) {
            case 'group':
            case 'personal':
                return styles.rootNode;

            case 'note':
                return classNames(styles.noteNode, { [styles.activeNode]: activeNoteId === node.data.get('id') });

            default:
                return null;
        }
    };

    // getNodeStyle = ({ node }) => {
    //     const { activeNoteId } = this.props;
    //     if (node.type === 'note') {
    //         const activeItem = node.data.get('id') === activeNoteId;
    //         if (activeItem) {
    //             return {
    //                 boxShadow: activeItem && `inset 10px 0 0px 0px ${node.data.get('iconColor')}`,
    //             };
    //         }
    //     }
    // };

    handleNodeClick = (e, { node }) => {
        const { push } = this.props;
        if (node.type === 'note') {
            push(`/notes/${node.data.get('id')}`);
        }
    };

    render() {
        const { nodes, expendedNavigationTreeNodes, activeNoteId } = this.props;

        return (
            <SizeMe>
                {({ width, height }) => (
                    <Tree
                        width={width}
                        height={height}
                        nodes={nodes}
                        onNodeExpand={this.handleNodeExpand}
                        onNodeCollapse={this.handleNodeCollapse}
                        nodeChildrenSelector={node => this.getChildNodes(node)}
                        firstLevelNodesSelector={nodes => nodes.filter(i => !i.parentTreeId)}
                        hasChildrenSelector={node => node.hasChildren}
                        isNodeExpandedSelector={node => expendedNavigationTreeNodes.has(node.treeId)}
                        nodeContentSelector={() => null}
                        nodeContentComponent={NodeContentComponent}
                        // levelPadding={41}
                        nodeClassName={this.getNodeClassName}
                        // nodeStyle={this.getNodeStyle}
                        additionalData={{ activeNoteId }}
                        onNodeClick={this.handleNodeClick}
                        // onNodeDoubleClick={this.handleDoubleClickNode}
                        // onNodeContextMenu={this.handleContextMenu}
                    />
                )}
            </SizeMe>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        expendedNavigationTreeNodes: state.uiSettings.get('expendedNavigationTreeNodes'),
        nodes: navigationNodesSelector(state),
    };
}

export default connect(
    mapStateToProps,
    {
        setUiSettingsValues,
        push,
    }
)(NotesNavigation);
