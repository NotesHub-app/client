import React from 'react';
import {connect} from 'react-redux';

export class Preview extends React.Component {
    render() {
        return (
            <div>
                ContentPreview
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
)(Preview)
