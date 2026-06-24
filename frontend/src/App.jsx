// import React, { useEffect } from 'react'
// import {useDispatch} from "react-redux";
// import { asyncgetusers } from './store/useraction';
// import LoginPage from './pages/LoginPage';
// const App = () => {
//   // const dispatch=useDispatch();

//   // useEffect(()=>dispatch(asyncgetusers()),[]);
//   return (
//      <LoginPage/>
//   )
// }

// export default App

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoute from "./routes/Route";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return <AppRoute />;
}

export default App;