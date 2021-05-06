import React from "react"
import { Button, Checkbox, Form, Container, Input } from 'semantic-ui-react'
//Requests
import AuthServiceRequest from "../requests/AuthServiceRequest"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false
        }
    }

    componentDidMount() {

    }

    async login(email, password) {
        /*const req = new AuthServiceRequest("user/authenticate", "POST", {
            "email": "",
            "password": ""
        })
        */
        const res = await req.execute()
        this.props.onLogin(res)
    }



    render() {
        return (
            <div id="screen-login">
                <Container fluid textAlign='center'>
                    <img src="/logo.png" />
                    <Form>
                        <Form.Field>
                            <Input
                                icon='at'
                                iconPosition='left'
                                placeholder='Adresse Email'
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                icon='lock'
                                iconPosition='left'
                                placeholder='Mot de passe'
                                type="password"
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox className="checkbox" label='Rester connecté' />
                        </Form.Field>
                        <Button inverted color='orange' centered type='submit'>Connexion</Button>
                    </Form>
                </Container>
            </div>
        )
    }
}

export default Login