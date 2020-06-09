import React, {Component} from 'react';

class CreateNewUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    handleRegister() {
        console.log("register", this.state.username, this.state.password);
        this.props.register(this.state.username, this.state.password);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <>
                <h3>Register</h3>
                <input onChange={event => this.handleChange(event)}
                       name="username" type="text" placeholder="username"></input><br/>
                <input onChange={event => this.handleChange(event)}
                       name="password" type="password" placeholder="password"></input><br/>
                <button onClick={_ => this.handleRegister()}>Register</button>
            </>
        );
    }
}

export default CreateNewUser;