import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';
import Delimiter from './Delimiter';
import Preview from './Preview';
import styles from './styles.module.scss';
import { uploadNoteFile } from '../../../../../../redux/modules/data/actions';

export class ContentEditor extends React.Component {
    renderContent() {
        const { viewMode, noteEditorWidth } = this.props;

        const commonProps = {
            ...this.props,
        };

        switch (viewMode) {
            case 'editor': {
                return (
                    <div className={styles.area} style={{ width: '100%' }}>
                        <Editor {...commonProps} />
                    </div>
                );
            }
            case 'combo': {
                return (
                    <React.Fragment>
                        <div className={styles.area} style={{ width: `${noteEditorWidth}%` }}>
                            <Editor {...commonProps} />
                        </div>
                        <Delimiter />
                        <div className={styles.area} style={{ width: `${100 - noteEditorWidth}%` }}>
                            <Preview {...commonProps} />
                        </div>
                    </React.Fragment>
                );
            }
            case 'preview': {
                return (
                    <div className={styles.area}>
                        <Preview {...commonProps} />
                    </div>
                );
            }
            default:
                return null;
        }
    }

    render() {
        return <div className={styles.root}>{this.renderContent()}</div>;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        viewMode: state.uiSettings.get('noteContentViewMode'),
        noteEditorWidth: state.uiSettings.get('noteEditorWidth'),
    };
}

export default connect(
    mapStateToProps,
    {
        uploadNoteFile,
    },
)(ContentEditor);
