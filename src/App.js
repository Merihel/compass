import React from "react";
import 'react-toastify/dist/ReactToastify.min.css';
import './css/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
//utils
import Session from "./utils/Session"
//screens
import Login from "./screens/Login"
import Account from "./screens/Account"
//Requests
import AuthServiceRequest from "./requests/AuthServiceRequest"

class App extends React.Component {
  constructor(props) {
    super(props)
    toast.configure();
    this.state = {
      auth: null
    }
  }

  onLogin(auth) {
    if (auth) {
      if(auth.error) {
        console.log("error", auth.message)
        toast.error(auth.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Bienvenue !", {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        Session.setToken(auth.data.token)
      }
    }
  }

  render() {
    return (
      <Router>
        <ToastContainer
          containerId="App"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Switch>
          <Route render={({ location }) =>
            this.checkLogin(location, <Games auth={this.state.auth} />)
          } path="/games">
          </Route>
          <Route render={({ location }) =>
            this.checkLogin(location, <Account auth={this.state.auth} />)
          } path="/profile">
          </Route>
          <Route path="/">
            <Login auth={this.state.auth} onLogin={auth => this.onLogin(auth)} />
          </Route>
        </Switch>
      </Router>
    );
  }

  async checkLogin(location, children) {
    if(this.state.auth) {
      return children
    } else {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { from: location }
          }}
        />
      )
    }
  }
}

export default App

/*
function Home(props) {
  return (
    <div>
      <h2>Home</h2>
      <button onClick={() => props.onLogin({name:"Meryyyy", id: 33})}>LOGIN !</button>
    </div>
  );
}
*/

function Games(props) {
  return <h2>Games ! Hello, {props.auth ? props.auth.name : null}. You can edit your profile here !</h2>;
}
function Auth(props) {
  return <h2>Games ! Hello, {props.auth ? props.auth.name : null}. Like games ?</h2>;
}