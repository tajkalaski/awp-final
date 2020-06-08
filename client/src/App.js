import React, { Component } from 'react';
import axios from 'axios';
import { Router } from "@reach/router";
import Suggestions from './Suggestions';
import Suggestion from './Suggestion';
import './App.css'

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);

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
        console.log("addSignature", id, text);
        axios.post(`${this.API_URL}/suggestions/${id}/signatures`, {
            text: text
        })
        .then(res => {
            return console.log(res);
        })

        // await fetch(`${this.API_URL}/suggestions/${id}/signatures`, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     method: 'POST',
        //     body: JSON.stringify({
        //         text: text,
        //     })
        // })
        // .then(response => {
        //     console.log(response);
        //     return response.json();
        // })
        // .then(data => console.log('Response:', data))
        // .catch(error => console.log(error));


    }

    render() {
        return (
            <Router>
                <Suggestion 
                    path="/suggestions/:id" 
                    getSuggestion={id => this.getSuggestion(id)}
                    addSignature={(id, text) => this.addSignature(id, text)}/>
                <Suggestions path="/" suggestions={this.state.suggestions}/>
            </Router>
        )
      }
}

export default App;
