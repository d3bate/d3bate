import React from 'react';
import {Checkbox as EvergreenCheckbox} from "evergreen-ui";

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: this.props.checked
        }
    }

    render() {
        return <EvergreenCheckbox checked={this.props.checked} onChange={(event) => {
            this.props.updateHandler(event);
            this.setState({
                checkbox: event.target.value
            })
        }}/>
    }
}

export {Checkbox}
