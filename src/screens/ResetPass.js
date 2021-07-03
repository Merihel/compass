import React from "react"
import { Button, Loader, Form, Container, Dimmer } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify';
//Requests
import UserServiceRequest from "../requests/UserServiceRequest"
//utils
import Session from "../utils/Session";

class ResetPass extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            password: "",
            passwordConfirm: ""
        }
    }

    componentDidMount() {
        this.setState({loading: true})
        if (this.props.match.params.token) {
            this.getUserByResetToken(this.props.match.params.token)
        } else {
            window.location = "/"
        }
    }

    onChangePassword(value) {
        this.setState({ password: value })
    }
    onChangeConfirmPassword(value) {
        this.setState({ passwordConfirm: value })
    }

    async getUserByResetToken(token) {
        const req = new UserServiceRequest("user/getByResetPasswordToken", "GET", { token: token })
        const res = await req.execute()
        console.log("res", res)
        if (res.error) {
            toast.error(res.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            window.location = "/"
        } else {
            if (res.data.id) {
                this.setState({ user: res.data, loading: false })
            }
        }
    }

    async onSubmit() {
        if (this.state.password && this.state.passwordConfirm) {
            if(this.state.password === this.state.passwordConfirm) {
                this.setState({loading: true})
                const req = new UserServiceRequest("user/updatePassword", "POST", {
                    password: this.state.passwordConfirm,
                    reset_token: this.props.match.params.token
                })
                const res = await req.execute()
                if(!res.error) {
                    this.setState({loading: false, password: null, passwordConfirm: null})
                    toast.success("Ton mot de passe a bien été mis à jour !", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });
                    Session.removeToken()
                    setTimeout(() => {
                        window.location = "/"
                    }, 3000)
                } else {
                    this.showError("Oups ! Une erreur est survenue...")
                }
            } else {
                this.showError("Les mots de passe ne correspondent pas")
            }
        }
    }

    showError(message) {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    render() {
        return (
            <div id="screen-resetpass" style={{ backgroundImage: `url("/variables/background.gif")` }}>
                <div id="login-gradient"></div>
                <Container id="login-container" fluid textAlign='center' className="h-full flex flex-col justify-center p-4">
                    <Form onSubmit={() => this.onSubmit()}>
                        <Dimmer active={this.state.loading}><Loader /></Dimmer>
                        {this.state.user != null ? <div><span className="text-red-50 text-xl">Changement du mot de passe pour <strong>{this.state.user.login}</strong></span><br /><br /></div> : null}
                        <Form.Field>
                            <Form.Input
                                disabled={this.state.password === null}
                                icon='lock'
                                iconPosition='left'
                                placeholder='Nouveau mot de passe'
                                onChange={(e, value) => this.onChangePassword(value.value)}
                                type="password"
                            />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input
                                disabled={this.state.password === null}
                                icon='lock'
                                iconPosition='left'
                                placeholder='Confirmation du mot de passe'
                                onChange={(e, value) => this.onChangeConfirmPassword(value.value)}
                                type="password"
                            />
                        </Form.Field>
                        <Button
                            inverted
                            disabled={this.state.password === "" || this.state.passwordConfirm === "" || this.state.password === null}
                            color='orange'
                            centered="true"
                            type='submit'
                        >Changer mon mot de passe</Button>
                    </Form>

                </Container>
            </div>
        )
    }
}

export default ResetPass