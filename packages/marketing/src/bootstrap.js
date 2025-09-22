// This file is used to start up the marketing microfrontend
// It is the entry point for the marketing microfrontend
// It is used to mount the marketing microfrontend to the DOM

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// MOunt function to start up the marketing microfrontend
const mount = (el) => {
    ReactDOM.render(<App />, el);
};

// If we are in development and in isolation, call mount immediately
if (process.env.NODE_ENV === 'development') {
    const devRoot = document.querySelector('#_marketing-dev-root');
    if (devRoot) {
        mount(devRoot);
    }
};

// Export mount function for use by container
export { mount };