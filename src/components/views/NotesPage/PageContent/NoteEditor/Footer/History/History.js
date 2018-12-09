import React from 'react';
import {connect} from 'react-redux';

export class History extends React.Component {
    render() {
        return (
            <div>
                History
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
)(History)
