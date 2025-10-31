import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import MarketingApp from './components/MarketingApp';
import Header from './components/Header';

export default function App() {
    const generateClassName = createGenerateClassName({
        productionPrefix: 'co',
    });
    
    return (
        <StylesProvider generateClassName={generateClassName}>
            <BrowserRouter>
                <Header />
                <MarketingApp />
            </BrowserRouter>
        </StylesProvider>
    );
}