import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './styles.scss';
import App from './components/App';
import configureApplication, { ClientEnvVars } from './configureApplication';
import configureStore from './configureStore';

configureApplication({
  env: (process.env as any) as ClientEnvVars,
});

const store = configureStore();

const rootElement = document.getElementById('root') as HTMLElement;
const authToken = (rootElement && rootElement.dataset.authToken) || null;

if (authToken === process.env.REACT_APP_AUTH_TOKEN_PLACEHOLDER) {
  throw new Error(
    `Runtime error: authentication token placeholder should not be present`,
  );
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App authToken={authToken} />
    </BrowserRouter>
  </Provider>,
  rootElement,
);
