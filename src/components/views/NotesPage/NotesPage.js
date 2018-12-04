import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './styles.module.scss';
import NotesNavigation from './NotesNavigation';
import NavigationSidebarResizer from './NavigationSidebarResizer';
import PageContent from './PageContent';
import NavigationFilter from './NavigationFilter';

export class NotesPage extends React.Component {
    render() {
        const { navigationSidebarWidth, ...contentProps } = this.props;
        const { noteId } = this.props;

        return (
            <div className={styles.root}>
                <div
                    className={classNames('bp3-card bp3-elevation-1', styles.navigationSidebar)}
                    style={{
                        width: navigationSidebarWidth,
                    }}
                >
                    <div className={styles.sidebarInner}>
                        <NavigationFilter />
                        <div style={{flexGrow: 1}}>
                            <NotesNavigation activeNoteId={noteId} />
                        </div>

                    </div>

                    <NavigationSidebarResizer />
                </div>
                <div className={styles.content} style={{ marginLeft: navigationSidebarWidth + 1 }}>
                    {noteId ? <PageContent {...contentProps} /> : <div>Выбери заметку!</div>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { id } = ownProps.match.params;
    return {
        noteId: id,
        navigationSidebarWidth: state.uiSettings.get('navigationSidebarWidth'),
    };
}

export default connect(
    mapStateToProps,
    {}
)(NotesPage);
