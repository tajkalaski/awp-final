import React, {Component} from 'react';


class AddSuggestion extends Component {
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
        this.props.addSuggestion(this.state.input);
    }

    render() {
        return (
            <>
                <form>
                    <input  
                        style={{ padding: '8px 16px', border: 'none', borderBottom: '1px solid lightgrey', background: 'none', textAlign: 'left', width: '200px'}}
                        placeholder='Banana and chocolate waffles' 
                        name="input" 
                        onChange={event => this.onChange(event)} type="text"/>
                    <button 
                        style={{ padding: '8px 32px', background: 'pink', color: 'white',  border: '1px solid pink', borderRadius: '0px 8px 8px 0px', textTransform: 'uppercase', fontWeight: 700, fontSize: '12px', letterSpacing: '1px'}}
                        onClick={_ => this.onSubmit()}>Add
                    </button>
                </form>
            </>
        )
    }
}

export default AddSuggestion;

