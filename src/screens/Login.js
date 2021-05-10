import React from "react"
import { Button, Checkbox, Form, Container, Input } from 'semantic-ui-react'
//Requests
import AuthServiceRequest from "../requests/AuthServiceRequest"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            login: "",
            password: ""
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
        const req = new AuthServiceRequest("user/authenticate", "POST", {
            "email": this.state.login,
            "password": this.state.password
        })
        
        const res = await req.execute()
        this.props.onLogin(res)
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
                            />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                placeholder='Mot de passe'
                                onChange={(e,value) => this.onChangePassword(value.value)}
                                type="password"
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox className="checkbox" label='Rester connecté' />
                        </Form.Field>
                        <Button inverted color='orange' centered="true" type='submit'>Connexion</Button>
                    </Form>
                </Container>
            </div>
        )
    }
}

export default Login