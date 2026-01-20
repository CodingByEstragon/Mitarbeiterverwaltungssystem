import React from "react";
import "./App.css";
import MainBoard from "./components/MainBoard/MainBoard";
import Login from "./components/Authentification/login";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import info from "./reduxData/index";


function App() {
   const handleLogin = async (history) => {
      console.log("logging in now , please wait ...");
      // fetch to backend
      history.push("/main-board");
   };

   const NotFound = () => <h1>404 - Page Not Found</h1>;

   return (
      <Provider store={info}>
         <div className="App">
            <Router>
               <div>
                  <Switch>
                     <Route
                        exact
                        path="/"
                        render={() => <Redirect to="/login" />}
                     />
                     <Route
                        path="/login"
                        render={(props) => (
                           <Login
                              handleLogin={() => handleLogin(props.history)}
                           />
                        )}
                     />
                     <Route
                        path="/main-board"
                        component={MainBoard}
                     />
                     <Route component={NotFound} />
                  </Switch>
               </div>
            </Router>
         </div>
      </Provider>
   );
}

export default App;