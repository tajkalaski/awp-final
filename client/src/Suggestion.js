import React, {Component} from 'react';
import {Link} from "@reach/router";
import AddSignature from './AddSignature';

class Suggestion extends Component {
    render() {
        const id = this.props.id;
        const suggestion = this.props.getSuggestion(this.props.id);
        let content = <p>Loading</p>;
        if (suggestion) {
            content =
                <>
                    <h1>{suggestion.text}</h1>

                    <h3>Signatures</h3>
                    <ul style={{ listStyleType: 'none', padding: 0}}>
                        {suggestion.signatures.map(signature => 
                            <li key={signature._id} style={{ margin: '16px auto', padding: '16px', width: '400px', borderLeft: '4px solid pink', background: 'white'}}>
                                <div>Signed on: {signature.date}</div>
                                <div>By: <strong>{signature.text}</strong></div>
                            </li>)}
                    </ul>

                    <AddSignature id={id} addSignature={(id, text) => this.props.addSignature(id, text)}></AddSignature>
                    
                    <div style={{ margin: '16px'}}>
                        <Link to="/"> Back </Link>
                    </div>

                </>
        }
        return content;
    }
}

export default Suggestion;
