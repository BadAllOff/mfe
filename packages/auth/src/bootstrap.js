// This file is used to start up the auth microfrontend
// It is the entry point for the auth microfrontend
// It is used to mount the auth microfrontend to the DOM

import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory, createBrowserHistory } from 'history';
import App from './App';

// MOunt function to start up the auth microfrontendddd
const mount = (el, { onNavigate, defaultHistory, initialPath, onSignIn }) => {
  const history = defaultHistory || createMemoryHistory({
    initialEntries: [initialPath],
  });

  if (onNavigate) {
    history.listen(onNavigate);
  }

  ReactDOM.render(<App history={history} onSignIn={onSignIn} />, el);

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;

      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// If we are in development and in isolation, call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#_auth-dev-root');
  if (devRoot) {
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
};

// Export mount function for use by container
export { mount };