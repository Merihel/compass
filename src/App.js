import React from "react";
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import Home from "./screens/Home"
import Account from "./screens/Account"
import AuthServiceRequest from "./requests/AuthServiceRequest"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      auth: null
    }
  }

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/games">Games</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
            </ul>
          </nav>
  
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route render={({ location }) =>
              this.checkLogin(location, <Games auth={this.state.auth} />)
            } path="/games">
            </Route>
            <Route path="/profile">
              <Account />
            </Route>
            <Route path="/">
              <Home auth={this.state.auth} onLogin={auth => this.setState({auth: auth})} />
            </Route>
          </Switch>
        </div>
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
  return <h2>Games ! Hello, {props.auth ? props.auth.name : null}</h2>;
}