import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import PropTypes from 'prop-types';
import Tree from 'react-vt-tree';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import {
    expendNavigationTreeNode,
    collapseNavigationTreeNode,
    toggleNavigationTreeNode,
} from '../../../../redux/modules/uiSettings/actions';
import { navigationNodesSelector } from '../../../../redux/selectors';
import styles from './styles.module.scss';
import NodeContent from './NodeContent';
import GroupConfigurationDialog from '../../../dialogs/GroupConfigurationDialog';

export class NotesNavigation extends React.Component {
    static propTypes = {
        activeNoteId: PropTypes.string,
    };

    state = {
        isOpenGroupConfigurationDialog: false,
        configuratingGroupId: null,
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
        const { push, toggleNavigationTreeNode } = this.props;
        if (node.type === 'note') {
            push(`/notes/${node.data.get('id')}`);
        }
        if (node.type === 'group' || node.type === 'personal') {
            toggleNavigationTreeNode(node.treeId);
        }
    };

    handleOpenGroupConfigurationDialog = groupId => {
        this.setState({
            isOpenGroupConfigurationDialog: true,
            configuratingGroupId: groupId,
        });
    };

    handleCloseGroupConfigurationDialog = () => {
        this.setState({
            isOpenGroupConfigurationDialog: false,
            configuratingGroupId: null,
        });
    };

    render() {
        const { nodes, expendedNavigationTreeNodes, activeNoteId, navigationFilter } = this.props;
        const { configuratingGroupId, isOpenGroupConfigurationDialog } = this.state;

        return (
            <React.Fragment>
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
                            noExpanderSpaceWidth={23}
                            nodeClassName={this.getNodeClassName}
                            additionalData={{
                                activeNoteId,
                                navigationFilter,
                                openGroupConfigurationDialog: this.handleOpenGroupConfigurationDialog,
                            }}
                            onNodeClick={this.handleNodeClick}
                        />
                    )}
                </SizeMe>
                <GroupConfigurationDialog
                    groupId={configuratingGroupId}
                    isOpen={isOpenGroupConfigurationDialog}
                    onClose={this.handleCloseGroupConfigurationDialog}
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        expendedNavigationTreeNodes: state.uiSettings.get('expendedNavigationTreeNodes'),
        navigationFilter: state.uiSettings.get('navigationFilter'),
        nodes: navigationNodesSelector(state),
    };
}

export default connect(
    mapStateToProps,
    {
        expendNavigationTreeNode,
        collapseNavigationTreeNode,
        toggleNavigationTreeNode,
        push,
    },
)(NotesNavigation);
