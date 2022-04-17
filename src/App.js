import React, { useState, useMemo, useEffect } from 'react'

import Dashboard from './components/dashboard';
import Login from './components/login';
import AppRouter from './router/router';
import { UserContext } from './userContext';

import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
// import CKEditor from "@ckeditor/ckeditor5-react"
import { Provider } from 'react-redux';
import store from './config/store';
import { useHistory } from 'react-router-dom';
// import parse from "html-react-parser"
// import { jwt } from 'jso./components/renewtoken
// import Renewtoken from '../renewtoken';/


function App() {
  const [token, setToken] = useState("");
  const history = useHistory()

  useEffect(() => {
    setToken(localStorage.getItem("admin"))
  }, []);

  // jwt.verify(token, 'secret', function (err, decode) {
  //   if (err) {
  //     console.log(err)
  //   }
  // })

  const providerValue = useMemo(() => ({ token, setToken }), [token, setToken]);
  // const url = process.env.REACT_APP_URL;
  // console.log(process.env.REACT_APP_URL)
  return (
    <>
      <Provider store={store}>
        <AppRouter />
      </Provider>
      {/* <UserContext.Provider value={{ setToken }}>
        {token ? <Dashboard /> : <Login />}
      </UserContext.Provider> */}
    </>
  );
}

export default App;
