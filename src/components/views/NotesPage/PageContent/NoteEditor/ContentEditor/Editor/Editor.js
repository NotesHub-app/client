import React from 'react';
import {connect} from 'react-redux';

export class Editor extends React.Component {
    render() {
        return (
            <div>
                ContentEditor
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {

    }
}

export default connect(
    mapStateToProps,
    {

    }
)(Editor)
