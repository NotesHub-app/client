import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { setActiveNoteFooterTab } from '../../../../../../redux/modules/uiSettings/actions';
import FooterResizer from './FooterResizer';
import Files from './Files';
import History from './History';

export class Footer extends React.Component {
    static propTypes = {
        noteId: PropTypes.string.isRequired,
    };

    handleClickTabButton = e => {
        const { setActiveNoteFooterTab } = this.props;
        setActiveNoteFooterTab(e.currentTarget.dataset.type);
    };

    renderContent() {
        const { activeTab, noteId } = this.props;
        switch (activeTab) {
            case 'files':
                return <Files noteId={noteId} />;
            case 'history':
                return <History noteId={noteId} />;
            default:
        }
        return <span />;
    }

    render() {
        const { activeTab, footerContentHeight } = this.props;

        return (
            <div
                className={styles.root}
                style={{ minHeight: activeTab ? footerContentHeight : 40, maxHeight: footerContentHeight }}
            >
                {activeTab && <FooterResizer />}
                <div className={styles.tabs}>
                    {[
                        { icon: 'import', type: 'files', label: 'Файлы' },
                        { icon: 'history', type: 'history', label: 'История' },
                    ].map(({ icon, type, label }) => (
                        <Button
                            key={type}
                            minimal
                            icon={icon}
                            data-type={type}
                            active={activeTab === type}
                            onClick={this.handleClickTabButton}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
                {activeTab && <div className={styles.content}>{this.renderContent()}</div>}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        activeTab: state.uiSettings.get('activeNoteFooterTab'),
        footerContentHeight: state.uiSettings.get('footerContentHeight'),
    };
}

export default connect(mapStateToProps, {
    setActiveNoteFooterTab,
})(Footer);
