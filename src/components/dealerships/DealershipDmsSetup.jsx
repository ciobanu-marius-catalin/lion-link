import React from 'react';
import { FormControl, FormGroup, ControlLabel, } from 'react-bootstrap';
import CheckBox from 'react-bootstrap/lib/Checkbox';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import TimeInputs from "../shared/TimeInputs";
import deepcopy from 'deepcopy';
import { connect } from "react-redux";

class DealershipDmsSetup extends React.Component
{
    render()
    {
        return (
            <div className="dms-setup-container">
                <h2 className="section-header">DEALER NUMBERS</h2>
                <div className="orange-design-form">
                    <FormGroup>
                        <ControlLabel>DEALER CODE</ControlLabel>
                        <FormControl type="text"
                                     name="dealerCode"
                                     placeholder="Dealer Code"
                                     onChange={this.props.onChangeForm}
                                     value={this.props.form.dealerCode}

                        />
                    </FormGroup>
                </div>
                <FormGroup className="orange-list-points">
                    <ul>
                        <li>
                            <div>
                                <ControlLabel>Intervals&nbsp;</ControlLabel>
                                <CheckBox inline
                                          bsClass="checkbox_red"
                                          onClick={() => this.props.onChangeCheckBox('intervals')}
                                          checked={this.props.form.intervals}
                                >&nbsp;</CheckBox>
                                <div className="checkbox-label"></div>

                                <ul>
                                    <li>
                                        <div>
                                            <TimeInputs label="scheduleStartHour"
                                                        name="intervalsScheduleStartHour"
                                                        element={this.props.form.intervalsScheduleStartHour}
                                                        disabled={!this.props.form.intervals}
                                                        onChange={this.props.onChangeTimeInput}

                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <TimeInputs label="scheduleEndHour"
                                                        name="intervalsScheduleEndHour"
                                                        element={this.props.form.intervalsScheduleEndHour}
                                                        disabled={!this.props.form.intervals}
                                                        onChange={this.props.onChangeTimeInput}
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <ControlLabel>closedDeals&nbsp;</ControlLabel>
                                            <CheckBox inline
                                                      disabled={!this.props.form.intervals}
                                                      onClick={() => this.props.onChangeCheckBox('intervalsClosedDeals')}
                                                      checked={this.props.form.intervalsClosedDeals}
                                            >&nbsp;</CheckBox>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div>
                                <ControlLabel>deltas&nbsp;</ControlLabel>
                                <CheckBox inline
                                          onClick={() => this.props.onChangeCheckBox('deltas')}
                                          checked={this.props.form.deltas}

                                >&nbsp;</CheckBox>
                                <ul>
                                    <li>
                                        <div>
                                            <TimeInputs label="scheduleStartHour"
                                                        name='deltasScheduleStartHour'
                                                        onChange={this.props.onChangeTimeInput}
                                                        disabled={!this.props.form.deltas}
                                                        element={this.props.form.deltasScheduleStartHour}

                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <TimeInputs label="scheduleEndHour"
                                                        name='deltasScheduleEndHour'
                                                        onChange={this.props.onChangeTimeInput}
                                                        disabled={!this.props.form.deltas}
                                                        element={this.props.form.deltasScheduleEndHour}

                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <TimeInputs label="onceDailyStartHour"
                                                        name='deltasOnceDailyStartHour'
                                                        onChange={this.props.onChangeTimeInput}
                                                        disabled={!this.props.form.deltas}
                                                        element={this.props.form.deltasOnceDailyStartHour}
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <TimeInputs label="scheduleEndHour"
                                                        name='deltasOnceDailyEndHour'
                                                        onChange={this.props.onChangeTimeInput}
                                                        disabled={!this.props.form.deltas}
                                                        element={this.props.form.deltasOnceDailyEndHour}
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <ControlLabel>closedDeals&nbsp;</ControlLabel>
                                            <CheckBox inline
                                                      onClick={() => this.props.onChangeCheckBox('deltasClosedDeals')}
                                                      checked={this.props.form.deltasClosedDeals}
                                                      disabled={!this.props.form.deltas}
                                            >&nbsp;</CheckBox>
                                        </div>
                                    </li>
                                    <ul>
                                        <li>
                                            <div>
                                                <ControlLabel>closed&nbsp;</ControlLabel>
                                                <CheckBox inline
                                                          onClick={() => this.props.onChangeCheckBox('closed')}
                                                          checked={this.props.form.closed}
                                                          disabled={!this.props.form.deltas || !this.props.form.deltasClosedDeals}
                                                >&nbsp;</CheckBox>
                                                <ul>
                                                    <li>
                                                        <div>
                                                            <ControlLabel>startDate&nbsp;</ControlLabel>
                                                            <div className="date-picker-container">
                                                                <DatePicker selected={this.props.form.startDate}
                                                                            onChange={( date ) => this.props.onChangeDate('startDate', date)}
                                                                            disabled={!this.props.form.deltas || !this.props.form.deltasClosedDeals ||
                                                                            !this.props.form.closed}
                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div>
                                                            <ControlLabel>deltaDate&nbsp;</ControlLabel>
                                                            <div className="date-picker-container">
                                                                <DatePicker selected={this.props.form.deltaDate}
                                                                            onChange={( date ) => this.props.onChangeDate('deltaDate', date)}
                                                                            disabled={!this.props.form.deltas || !this.props.form.deltasClosedDeals ||
                                                                            !this.props.form.closed}
                                                                />
                                                            </div>
                                                            <TimeInputs label=""
                                                                        name='deltasDateHour'
                                                                        onChange={this.props.onChangeTimeInput}
                                                                        disabled={!this.props.form.deltas || !this.props.form.deltasClosedDeals ||
                                                                        !this.props.form.closed}
                                                                        element={this.props.form.deltasDateHour}
                                                            />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div>
                                                            &nbsp;
                                                            <input onChange={this.props.onChangeForm}
                                                                   value={this.props.form.deltaRepeatInterval}
                                                                   name={'deltaRepeatInterval'}
                                                                   disabled={!this.props.form.deltas || !this.props.form.deltasClosedDeals ||
                                                                   !this.props.form.closed}
                                                            />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div>
                                                            <ControlLabel>onceDailyOnly&nbsp;</ControlLabel>
                                                            <CheckBox inline
                                                                      onClick={() => this.props.onChangeCheckBox('onceDailyOnly')}
                                                                      checked={this.props.form.onceDailyOnly}
                                                                      disabled={!this.props.form.deltas || !this.props.form.deltasClosedDeals ||
                                                                      !this.props.form.closed}
                                                            >&nbsp;</CheckBox>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </FormGroup>
            </div>
        );
    }
}

const mapStateToProps = ( state, ownProps ) => {
    let reduxProps = {
        validationErrors: state.error.validationErrors
    };
    let props = Object.assign({}, ownProps, reduxProps);
    return props;
}

export default connect(mapStateToProps, null)(DealershipDmsSetup)

