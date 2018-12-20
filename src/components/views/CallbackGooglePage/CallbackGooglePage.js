import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { login } from '../../../redux/modules/user/actions';
import LoadingPage from '../LoadingPage';

export class CallbackGooglePage extends React.Component {
    async componentDidMount() {
        const { login, push } = this.props;

        try {
            await login({
                googleCallbackQuery: window.location.search,
            });

            push('/');
        } catch (e) {
            console.error(e);

            push('/login');
        }
    }

    render() {
        return <LoadingPage />;
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {
        login,
        push,
    }
)(CallbackGooglePage);
