import React, {Component} from 'react';
import { Link } from '@reach/router'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    handleLogin() {
        console.log("login", this.state.username, this.state.password);
        this.props.login(this.state.username, this.state.password);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <>
                <h3>Login</h3>
                <input 
                    style={{ padding: '8px 16px', border: 'none', borderBottom: '1px solid lightgrey', background: 'none', textAlign: 'center', width: '100px' }}
                    onChange={event => this.handleChange(event)}
                    name="username" type="text" placeholder="username"></input><br/>
                <input 
                    style={{ padding: '8px 16px', border: 'none', borderBottom: '1px solid lightgrey', background: 'none', textAlign: 'center', width: '100px' }}
                    onChange={event => this.handleChange(event)}
                    name="password" type="password" placeholder="password"></input><br/>
                <button 
                    style={{ padding: '8px 16px', border: '1px solid pink', background: 'pink', color: 'white', margin: '8px' }}
                    onClick={_ => this.handleLogin()}>Login</button>
            </>
        );
    }
}

export default Login;