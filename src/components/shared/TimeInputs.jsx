import React from 'react';
import { ControlLabel, FormControl } from "react-bootstrap";

class TimeInputs extends React.Component
{
    render()
    {
        let className = 'time-input-container ' + (this.props.class ? this.props.class: '');
        return (
            <div className={className}>
                <ControlLabel className="time-input-label">{this.props.label}</ControlLabel>
                &nbsp;&nbsp;
                <FormControl className="time-input square-input-border "
                             type="text"
                             name={'hour'}
                             value={this.props.element.hour}
                             onChange={(event) => this.props.onChange(event, this.props.name)}
                             disabled={this.props.disabled}
                />
                :
                <FormControl className="time-input square-input-border"
                             type="text"
                             name={'minute'}
                             value={this.props.element.minute}
                             onChange={(event) => this.props.onChange(event, this.props.name)}
                             disabled={this.props.disabled}
                />
            </div>
        )
    }
}

export default TimeInputs
