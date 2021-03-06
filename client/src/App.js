import React, { Component } from 'react';
import axios from 'axios';
import { Router, Link, Redirect } from "@reach/router";
import Suggestions from './Suggestions';
import Suggestion from './Suggestion';
import './App.css'
import AuthService from './AuthService';
import Login from './Login';
import CreateNewUser from './CreateNewUser';

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);

        this.Auth = new AuthService(`${this.API_URL}`);
        this.state = {
            suggestions: []
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        axios.get(`${this.API_URL}/suggestions`)
        .then(res => {
          const suggestions = res.data;
          this.setState({ suggestions });
        })
    }

    getSuggestion(id) {
        return this.state.suggestions.find(suggestion => suggestion._id === id);
    }

    async addSignature(id, text) {
        const username = this.Auth.getUsername();
        const headers = {
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        if (!username) {
            alert('You need to be logged in to sign')
        }

        if (username === text) {
            axios.post(`${this.API_URL}/suggestions/${id}/signatures`, 
            {
                text: text
            },
            {
                headers: headers
            })
            .then(res => {
                return console.log(res);
            });

            alert('You have signed the suggestion');
            this.getData();
        } else {
            alert('Your signature does not match your username');
        }

        // change the state to realoaddddd
        this.getData();
    }

    async addSuggestion(text) {
        const headers = {
            'Authorization': 'Bearer' + this.Auth.getToken()
        }

        axios.post(`${this.API_URL}/suggestions`, 
        {
            suggestionText: text
        },
        {
            headers: headers
        })
        .then(res => {
            return console.log(res);
        })

        this.getData();
    }

    async login(username, password) {
        try {
            const resp = await this.Auth.login(username, password);
            console.log("Authentication:", resp.msg);
            this.getData();
            alert('You are now logged in.')
        } catch (e) {
            console.log("Login", e);
            alert('Login failed. Please try again!')
        }
    }

    async register(username, password) {
        try {
            await this.Auth.createNewUser(username, password);
            this.getData();
            alert('You are now registered. Please proceed to login page.')
        } catch (e) {
            console.log("Register", e);
            alert('Register failed. Please try again!')
        }
        
    }

    async logout() {
        window.location.reload(false);
        this.Auth.logout();
        alert('Logout succesfull.')
    }

    render() {
        return (
            <div>
                {this.Auth.loggedIn() ? <p>Hello, {this.Auth.getUsername()}<button 
                    onClick={() => this.logout()}
                    style={{ color: 'rgb(85, 26, 139)', fontWeight: 500, border: 'none', fontFamily: 'Roboto', textDecoration: 'underline', fontSize: '16px', cursor: 'pointer'}}
                    >Logout</button></p> : <div><Link to={'/login'}>Login</Link><span style={{ margin: '0 8px' }}>or</span><Link to={'/register'}>Register</Link></div>}
                <Router>
                    <Suggestion 
                        path="suggestions/:id" 
                        getSuggestion={id => this.getSuggestion(id)}
                        addSignature={(id, text) => this.addSignature(id, text)}/>
                    <Suggestions 
                        path="/" 
                        suggestions={this.state.suggestions}
                        addSuggestion={(text) => this.addSuggestion(text)}/>
                    <Login path='login' login={(username, password) => this.login(username, password)}></Login>
                <CreateNewUser path='register' register={(username, password) => this.register(username, password)}></CreateNewUser>
            </Router>
            </div>
        )
      }
}

export default App;
