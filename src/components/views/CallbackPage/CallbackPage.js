import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../../redux/modules/user/actions';
import LoadingPage from '../LoadingPage';
import history from '../../../history';

export class CallbackPage extends React.Component {
    static propTypes = {
        provider: PropTypes.string.isRequired,
    };

    async componentDidMount() {
        const { login, provider } = this.props;

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

            history.push('/');
        } catch (e) {
            console.error(e);
            history.push('/login');
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
    },
)(CallbackPage);
