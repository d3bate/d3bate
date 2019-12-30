import React from "react";

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: this.props.year,
            month: this.props.month,
        }
    }

    render() {

        return <div className="DatePicker">
            <form className="DatePickerForm" onSubmit={(event) => {
                event.preventDefault();
                this.props.match.history.push('/calendar/' + this.state.year + '/' + this.state.month);
            }}>
                YEAR: <input type="" className="DatePickerInput" value={this.state.year} onChange={(event) => {
                this.setState({
                    year: event.target.value
                })
            }
            }/>
                &nbsp; MONTH: <input type="" className="DatePickerInput" value={this.state.month}
                                     onChange={(event) => {
                                         this.setState({month: event.target.value})
                                     }
                                     }/>
                <input type="submit" value="GO => " className="DatePickerSubmit"/>
            </form>
        </div>
    }
}

export {DatePicker}
