import React, { useState, useEffect } from 'react'
import AppRouter from './router/router';
import { Provider } from 'react-redux';
import store from './config/store';
import { useHistory } from 'react-router-dom';



function App() {

  // const providerValue = useMemo(() => ({ token, setToken }), [token, setToken]);

  return (
    <>
      <Provider store={store}>
        <AppRouter />
      </Provider>

    </>
  );
}

export default App;
