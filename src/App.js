import React from "react";
import 'react-toastify/dist/ReactToastify.min.css';
import './css/App.css';
import { Loader } from "semantic-ui-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
//utils
import Session from "./utils/Session"
import Toast from "./utils/Toast"
//screens
import Login from "./screens/Login"
import ResetPass from "./screens/ResetPass"
import Account from "./screens/Account"
import Dashboard from "./screens/Dashboard"
//Requests
import UserServiceRequest from "./requests/UserServiceRequest"
//contexts
import {UserProvider} from "./contexts/UserContext";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: null,
      loggedIn: false
    }
    this.history = null
  }

  async onLogin(auth, keepSession) {
    if (auth) {
      let flagError = false
      if(auth.error) {
        flagError = true
      } else {
        if(auth.data && auth.data.token) {
          Toast.show("success", "Bienvenue !");
          if(keepSession) Session.setToken(auth.data.token)
          await this.getUser(auth.data.token)
        } else {
          flagError = true
        }
      }
      if(flagError) {
        Toast.show("error", auth.message)
      }
    }
  }

  async getUser(authKey) {
    const req = new UserServiceRequest("user/getByToken", "GET", {token: authKey}, authKey)
    const res = await req.execute()
    if(res.error) {
      Toast.show("error", res.message)
      if(res.message == "Unauthorized") return
    } else {
      if(res.data.id) {
        this.setState({auth: res.data, loggedIn: true})
      }
    }
  }

  async componentDidMount() {
    const token = Session.getToken()
    this.setState({loggedIn: true})
    if(token) {
      await this.getUser(token)
    } else {
      this.setState({loggedIn: false})
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
          draggable
          pauseOnFocusLoss
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
          <Route render={() =>{
            console.log(this.state.auth)
            return(
              this.state.loggedIn ?
                !this.state.auth ? 
                  <Loader /> :  
                  <UserProvider value={this.state.auth}>
                    <Dashboard user={this.state.auth} />
                  </UserProvider>
              : <Login auth={this.state.auth} onLogin={(auth,keepSession) => this.onLogin(auth,keepSession)} />
            )}} exact path="/" >
          </Route>
          <Route render={(props) => <ResetPass {...props} />} path="/reset-password/:token"></Route>
          <Redirect from="/reset-password/" to="/" />
        </Switch>
      </Router>
    );
  }

  checkLogin(location, children) {
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
  return <h2>Games ! Hello, {props.auth ? props.auth.login : null}. You can edit your profile here !</h2>;
}
function Auth(props) {
  return <h2>Games ! Hello, {props.auth ? props.auth.login : null}. Like games ?</h2>;
}