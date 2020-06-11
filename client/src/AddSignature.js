import React, {Component} from 'react';


class AddSignature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ""
        }
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit() {
        this.props.addSignature(this.props.id, this.state.input);
    }

    render() {
        return (
            <>
                <input  
                    style={{ padding: '8px 16px', border: 'none', borderBottom: '1px solid lightgrey', background: 'none', textAlign: 'left', width: '200px'}}
                    placeholder='Sign with your username' 
                    name="input" 
                    onChange={event => this.onChange(event)} type="text"/>
                <button 
                    style={{ padding: '8px 32px', background: 'pink', color: 'white',  border: '1px solid pink', borderRadius: '0px 8px 8px 0px', textTransform: 'uppercase', fontWeight: 700, fontSize: '12px', letterSpacing: '1px'}}
                    onClick={_ => this.onSubmit()}>Sign
                </button>
            </>
        )
    }
}

export default AddSignature;

