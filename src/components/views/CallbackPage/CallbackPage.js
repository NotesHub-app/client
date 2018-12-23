import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { login } from '../../../redux/modules/user/actions';
import LoadingPage from '../LoadingPage';

export class CallbackPage extends React.Component {
    static propTypes = {
        provider: PropTypes.string.isRequired,
    };

    async componentDidMount() {
        const { login, push, provider } = this.props;

        try {
            const params = {};
            switch (provider) {
                case 'google': {
                    params.googleCallbackQuery = window.location.search;
                    break;
                }
                case 'github': {
                    params.githubCallbackQuery = window.location.search;
                    break;
                }
                default:
            }
            await login(params);

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
    },
)(CallbackPage);
