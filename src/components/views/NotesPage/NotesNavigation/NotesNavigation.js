import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import PropTypes from 'prop-types';
import Tree from 'react-vt-tree';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import { expendNavigationTreeNode, collapseNavigationTreeNode } from '../../../../redux/modules/uiSettings/actions';
import { navigationNodesSelector } from '../../../../redux/selectors';
import styles from './styles.module.scss';
import NodeContent from './NodeContent';

export class NotesNavigation extends React.Component {
    static propTypes = {
        activeNoteId: PropTypes.string,
    };

    handleNodeExpand = (e, { node }) => {
        const { expendNavigationTreeNode } = this.props;
        expendNavigationTreeNode(node.treeId);
    };

    handleNodeCollapse = (e, { node }) => {
        const { collapseNavigationTreeNode } = this.props;
        collapseNavigationTreeNode(node.treeId);
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
                        nodeContentComponent={NodeContent}
                        // levelPadding={41}
                        nodeClassName={this.getNodeClassName}
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
        expendNavigationTreeNode,
        collapseNavigationTreeNode,
        push,
    }
)(NotesNavigation);
