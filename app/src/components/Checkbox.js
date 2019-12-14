import React from 'react';

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: this.props.checked
        }
    }

    render() {
        return <input type="checkbox" checked={this.props.checked} onChange={(event) => {
            this.props.updateHandler(event);
            this.setState({
                checkbox: event.target.value
            })
        }}/>
    }
}

export {Checkbox}
