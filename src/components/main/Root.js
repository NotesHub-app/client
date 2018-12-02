import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainToaster from './MainToaster';
import MainLayout from '../layouts/MainLayout';
import NotesPage from '../views/NotesPage';
import LoginPage from '../views/LoginPage';

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
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Redirect exact path="/" to="/notes" />

                            <LayoutRoute exact path="/notes" component={NotesPage} layout={MainLayout} />
                            <LayoutRoute exact path="/notes/:id" component={NotesPage} layout={MainLayout} />
                            <Route exact path="/login" component={LoginPage} />
                        </Switch>
                    </ConnectedRouter>
                </React.Fragment>
            </Provider>
        );
    }
}
