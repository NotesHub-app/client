import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import MainToaster from './MainToaster';
import MainLayout from '../layouts/MainLayout';
import NotesPage from '../views/NotesPage';
import LoginPage from '../views/LoginPage';
import RegistrationPage from '../views/RegistrationPage';
import RestorePasswordPage from '../views/RestorePasswordPage';
import RootPage from '../views/RootPage/RootPage';
import JoinGroupPage from '../views/JoinGroupPage/JoinGroupPage';
import CallbackPage from '../views/CallbackPage';

const LayoutRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            <Layout {...props}>
                <Component {...props} />
            </Layout>
        )}
    />
);

export default class Root extends React.Component {
    render() {
        const { history, store } = this.props;

        return (
            <Provider store={store}>
                <React.Fragment>
                    <MainToaster />
                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={RootPage} />

                            <LayoutRoute exact path="/notes" component={NotesPage} layout={MainLayout} />
                            <LayoutRoute exact path="/notes/:id" component={NotesPage} layout={MainLayout} />
                            <LayoutRoute
                                exact
                                path="/joinGroup/:groupId/:code"
                                component={JoinGroupPage}
                                layout={MainLayout}
                            />
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/registration" component={RegistrationPage} />
                            <Route exact path="/restore-password" component={RestorePasswordPage} />
                            <Route
                                exact
                                path="/callback/github"
                                render={props => <CallbackPage {...props} provider="github" />}
                            />
                            <Route
                                exact
                                path="/callback/google"
                                render={props => <CallbackPage {...props} provider="google" />}
                            />
                        </Switch>
                    </Router>
                </React.Fragment>
            </Provider>
        );
    }
}
