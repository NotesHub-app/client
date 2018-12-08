import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import styles from './styles.module.scss';
import { setActiveNoteFooterTab } from '../../../../../../redux/modules/uiSettings/actions';
import FooterResizer from './FooterResizer';

export class Footer extends React.Component {
    handleClickTabButton = e => {
        const { setActiveNoteFooterTab } = this.props;
        setActiveNoteFooterTab(e.currentTarget.dataset.type);
    };

    render() {
        const { activeTab, footerContentHeight } = this.props;

        return (
            <div className={styles.root} style={{ minHeight: activeTab ? footerContentHeight : 40 }}>
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
                {activeTab && <div className={styles.content}>{footerContentHeight}</div>}
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
