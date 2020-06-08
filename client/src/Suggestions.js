import React, {Component} from 'react';
import {Link} from "@reach/router";

class Suggestions extends Component {

    render() {
        const suggestions = this.props.suggestions.map(suggestion =>
            <li key={suggestion._id} style={{ listStyleType: "none", margin: '16px auto', padding: '16px', width: '400px', background: 'white', borderRadius: '8px'  }}>
                <div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{ padding: '16px', borderRight: '1px solid #EEEFF2', flexGrow: 2, textAlign: 'left', width: '180px', height: '80px', display: 'flex', alignItems: 'center' }}>
                            <Link to={`/suggestions/${suggestion._id}`} style={{ textDecoration: 'none', color: '#000000', fontWeight: 300}}>{suggestion.text}</Link>
                        </div>
                        <div style={{ padding: '8px', flexGrow: 1, fontSize: '32px'}}>
                            <p>{suggestion.signatures.length}</p>
                        </div>
                    </div>
                   

                </div>

                
            </li>
        );
        return (
            <>
                <h1>Current Suggestions</h1>
                <ol style={{ padding: 0, margin: 0}}>
                    {suggestions}
                </ol>
            </>
        );
    }

}

export default Suggestions;
