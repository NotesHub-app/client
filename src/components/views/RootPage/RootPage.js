import React from 'react';
import { connect } from 'react-redux';
import history from '../../../history';

export class RootPage extends React.Component {
    componentDidMount() {
        const { lastUsedNote } = this.props;

        if (lastUsedNote) {
            history.push(`/notes/${lastUsedNote}`);
        } else {
            history.push(`/notes`);
        }
    }

    render() {
        return <div />;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        lastUsedNote: state.uiSettings.get('lastUsedNote'),
    };
}

export default connect(
    mapStateToProps,
    {},
)(RootPage);
