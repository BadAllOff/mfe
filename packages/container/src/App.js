import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Header from './components/Header';
import Progress from './components/Progress';
import { createBrowserHistory } from 'history';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/Auth'));
const DashboardLazy = lazy(() => import('./components/Dashboard'));

const history = createBrowserHistory();

const generateClassName = createGenerateClassName({
    productionPrefix: 'co',
});

export default function App() {
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        if (signedIn) {
            history.push('/dashboard');
        }
    }, [signedIn]);

    const onSignIn = () => {
        setSignedIn(true);
        history.push('/');
    };

    const onSignOut = () => {
        setSignedIn(false);
        history.push('/auth/signin');
    };

    return (
        <Router history={history}>
            <StylesProvider generateClassName={generateClassName}>
                <Header isSignedIn={signedIn} onSignOut={onSignOut} />
                <Suspense fallback={<Progress />}>
                    <Switch>
                        <Route path="/auth" component={() => <AuthLazy onSignIn={onSignIn} />} />
                        <Route path="/dashboard">
                            {!signedIn && <Redirect to="/" />}
                            <DashboardLazy />
                        </Route>
                        <Route path="/" component={MarketingLazy} />
                    </Switch>
                </Suspense>
            </StylesProvider>
        </Router>
    );
}