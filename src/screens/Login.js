import React from "react"
import { Button, Checkbox, Form, Container, Input } from 'semantic-ui-react'
//Requests
import AuthServiceRequest from "../requests/AuthServiceRequest"
//utils
import String from "../utils/String"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            login: "",
            password: "",
            errorLogin: null,
            errorPassword: null,
            keepSession: false
        }
    }

    componentDidMount() {

    }

    onChangeLogin(value) {
        this.setState({login: value})
    }

    onChangePassword(value) {
        this.setState({password: value})
    }

    async login() {
        if(!String.validateEmail(this.state.login)) {
            this.setState({errorLogin: {content: 'Veuillez entrer une adresse email valide', pointing: 'above'}})
            return
        } else {
            this.setState({errorLogin:null})
        }
        const req = new AuthServiceRequest("user/authenticate", "POST", {
            "email": this.state.login,
            "password": this.state.password
        })
        const res = await req.execute()
        this.props.onLogin(res, this.state.keepSession)
    }

    render() {
        return (
            <div id="screen-login" style={{backgroundImage: `url("/variables/background.gif")`}}>
                <div id="login-gradient"></div>
                <Container id="login-container" fluid textAlign='center'>
                    <img src="/logo.png" />
                    <Form onSubmit={() => this.login()}>
                        <Form.Field>
                            <Form.Input
                                icon='at'
                                iconPosition='left'
                                onChange={(e,value) => this.onChangeLogin(value.value)}
                                placeholder='Adresse Email'
                                autoComplete="email"
                                error={this.state.errorLogin}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                placeholder='Mot de passe'
                                onChange={(e,value) => this.onChangePassword(value.value)}
                                type="password"
                                autoComplete="current-password"
                                error={this.state.errorPassword}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox className="checkbox" onChange={(it, value) => this.setState({ keepSession: value.checked })} label='Rester connecté' />
                        </Form.Field>
                        <Button 
                            inverted 
                            disabled={
                                !this.state.login || !this.state.password
                            } 
                            color='orange' 
                            centered="true" 
                            type='submit'
                        >Connexion</Button>
                    </Form>
                </Container>
            </div>
        )
    }
}

export default Login