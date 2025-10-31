import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Landing from './components/Landing';
import Pricing from './components/Pricing';

export default function App() {
    const generateClassName = createGenerateClassName({
        productionPrefix: 'ma',
    });
    
    return (
        <StylesProvider generateClassName={generateClassName}>
            <BrowserRouter>
                <Switch>
                    <Route path="/pricing" component={Pricing} />
                    <Route path="/" component={Landing} />
                </Switch>
            </BrowserRouter>
        </StylesProvider>
    );
}