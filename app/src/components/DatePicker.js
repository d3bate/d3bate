import React from "react";
import {TextInput, Button, minorScale, Card} from "evergreen-ui";

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: this.props.year,
            month: this.props.month,
        }
    }

    render() {

        return <Card background="#E4E7EB" padding={minorScale(4)} marginRight={minorScale(2)}>
            <form className="DatePickerForm" onSubmit={(event) => {
                event.preventDefault();
                this.props.match.history.push('/calendar/' + this.state.year + '/' + this.state.month);
            }}>
                YEAR: &nbsp; <TextInput margin={minorScale(2)} type="" className="DatePickerInput"
                                        value={this.state.year}
                                        onChange={(event) => {
                                            this.setState({
                                                year: event.target.value
                                            })
                                        }
                                        }/>
                <br/>
                MONTH: <TextInput type="" className="DatePickerInput" value={this.state.month}
                                  onChange={(event) => {
                                      this.setState({month: event.target.value})
                                  }
                                  }/>
                <br/>
                <Button type="submit" className="DatePickerSubmit" iconAfter="arrow-right"
                        appearance="primary">Go</Button>
            </form>
        </Card>
    }
}

export {DatePicker}
