import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import styles from './styles.module.scss';
import ContentEditor from './ContentEditor';
import InputTextField from '../../../../fields/InputTextField/InputTextField';

export class NoteEditor extends React.Component {
    static propTypes = {
        note: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.header}>
                    <div />
                    <div style={{ flexGrow: 1 }}>
                        <Field name="title" component={InputTextField} />
                    </div>
                    <div />
                </div>
                <ContentEditor />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { note } = ownProps;
    return {
        initialValues: {
            title: note.get('title'),
            icon: note.get('icon'),
            iconColor: note.get('iconColor'),
            content: note.get('content'),
        },
    };
}

export default connect(
    mapStateToProps,
    {}
)(
    reduxForm({
        form: 'NoteEditor',
        enableReinitialize: true,
    })(NoteEditor)
);
