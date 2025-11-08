import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Signin from './components/Signin';
import Signup from './components/Signup';

const generateClassName = createGenerateClassName({
    productionPrefix: 'au',
});

export default function App({ history, onSignIn }) {
    return (
        <StylesProvider generateClassName={generateClassName}>
            <Router history={history}>
                <Switch>
                    <Route path="/auth/signin" component={() => <Signin onSignIn={onSignIn} />} />
                    <Route path="/auth/signup" component={() => <Signup onSignIn={onSignIn} />} />
                </Switch>
            </Router>
        </StylesProvider>
    );
}