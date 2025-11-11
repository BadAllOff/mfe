import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Header from './components/Header';
import Progress from './components/Progress';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/Auth'));

const generateClassName = createGenerateClassName({
    productionPrefix: 'co',
});

export default function App() {
    const [signedIn, setSignedIn] = useState(false);
    const history = useHistory();
    const onSignIn = () => {
        setSignedIn(true);
        history.push('/');
    };

    const onSignOut = () => {
        setSignedIn(false);
        history.push('/auth/signin');
    };

    return (
        <BrowserRouter>
            <StylesProvider generateClassName={generateClassName}>
                <Header isSignedIn={signedIn} onSignOut={onSignOut} />
                <Suspense fallback={<Progress />}>
                    <Switch>
                        <Route path="/auth" component={() => <AuthLazy onSignIn={onSignIn} />} />
                        <Route path="/" component={MarketingLazy} />
                    </Switch>
                </Suspense>
            </StylesProvider>
        </BrowserRouter>
    );
}