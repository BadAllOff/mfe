// This file is used to start up the dashboard microfrontend
// It is the entry point for the dashboard microfrontend
// It is used to mount the dashboard microfrontend to the DOM

import { createApp } from 'vue';
import Dashboard from './components/Dashboard.vue';

// MOunt function to start up the dashboard microfrontend
const mount = (el) => {
  const app = createApp(Dashboard);
  app.mount(el);

  return {
    unmount() {
      app.unmount();
    },
  };
};

// If we are in development and in isolation, call mount immediatelyl
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#_dashboard-dev-root');

  if (devRoot) {
    mount(devRoot);
  }
};

// Export mount function for use by container
export { mount };