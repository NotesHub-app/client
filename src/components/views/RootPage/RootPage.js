import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

export class RootPage extends React.Component {
    componentDidMount() {
        const { lastUsedNote, push } = this.props;

        if (lastUsedNote) {
            push(`/notes/${lastUsedNote}`);
        } else {
            push(`/notes`);
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
    {
        push,
    }
)(RootPage);
