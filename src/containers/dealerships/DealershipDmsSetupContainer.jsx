import React from 'react';
import DealershipDmsSetup from "../../components/dealerships/DealershipDmsSetup";
import deepcopy from 'deepcopy';
import config from 'config';
import axios from 'axios';
import moment from "moment";
import { connect } from "react-redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import { bindActionCreators } from "redux";
import ErrorParser from "../../utils/ErrorParser";

class DealershipDmsSetupContainer extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            dealerCode: '',
            id: null,
            intervals: false,
            intervalsScheduleStartHour: {
                hour: '',
                minute: ''
            },
            intervalsScheduleEndHour: {
                hour: '',
                minute: ''
            },
            intervalsClosedDeals: false,
            deltas: false,

            deltasScheduleStartHour: {
                hour: '',
                minute: ''
            },
            deltasScheduleEndHour: {
                hour: '',
                minute: ''
            },
            deltasOnceDailyStartHour: {
                hour: '',
                minute: ''
            },
            deltasOnceDailyEndHour: {
                hour: '',
                minute: ''
            },
            deltasClosedDeals: false,
            closed: false,
            startDate: null,
            deltaDate: null,
            deltasDateHour: {
                hour: '',
                minute: ''
            },
            deltaRepeatInterval : '',
            onceDailyOnly: false
        };
        this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTimeInput = this.handleChangeTimeInput.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.getFormDataFromApi = this.getFormDataFromApi.bind(this);
    }

    componentDidMount()
    {


        //check if the components needs to sync its state with a ancestor
        if ( !this.props.hasToSyncData ) {

            //if the component is used for update get the form data.
            if ( this.props.method === 'put' ) {
                this.getFormDataFromApi();
            }
            return;
        }

        //check if the component has been created before when used in the tabs page. If the communication property
        //it is undefined then the state should be copied from the ancestor that syncs this state.
        if ( this.props.syncData.startDate ) {
            let newState = deepcopy(this.props.syncData);
            this.setState(newState);

            //if the state has not been synced yet
        } else {
            //if the component is used for update get the dealership data from the API.
            if ( this.props.method === 'put' ) {
                this.getFormDataFromApi();
            }
        }
    }

    shouldComponentUpdate( nextProps, nextState )
    {
        if ( this.props.hasToSyncData ) {
            if ( (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
                (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ) {

                //synchronization only goes up

                this.props.onSync('DealershipDmsSetupContainer', nextState);
                return true;
            }
            return false;
        }
        return true;

    }
    getFormDataFromApi()
    {
        axios({
            method: 'get',
            url: config.api + '/Dealerships/' + this.props.dealershipId + '/dmsConfig'
        })
            .then(response => {
                if ( response.status === 200 || response.status === 204) {
                    if(response.data.configuration) {

                        let newState = this.parseApiData(response.data.configuration);
                        newState.id = response.data.id;
                        this.setState(newState);
                    }
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    parseApiData( data )
    {
       let newState = deepcopy(this.state);
       newState.id = data.id;
       newState.dealerCode = data.dealerCode;
       newState.intervals = data.intervals ? true : false;
       if( data.intervals ) {
           if(data.intervals.scheduleStartHour) {
               newState.intervalsScheduleStartHour = this.parseHourMinute(data.intervals.scheduleStartHour);
           }
           if(data.intervals.scheduleEndHour) {
               newState.intervalsScheduleEndHour = this.parseHourMinute(data.intervals.scheduleEndHour);
           }
           if(data.intervals.closedDeals) {
               newState.intervalsClosedDeals = data.intervals.closedDeals;
           }
       }
        newState.deltas = data.deltas ? true : false;
       if(data.deltas)
       {

           if(data.deltas.scheduleStartHour) {
               newState.deltasScheduleStartHour = this.parseHourMinute(data.deltas.scheduleStartHour);
           }
           if(data.deltas.scheduleEndHour) {
               newState.deltasScheduleEndHour = this.parseHourMinute(data.deltas.scheduleEndHour);
           }
           if(data.deltas.onceDailyStartHour) {
               newState.deltasOnceDailyStartHour = this.parseHourMinute(data.deltas.onceDailyStartHour);
           }
           if(data.deltas.onceDailyEndHour) {
               newState.deltasOnceDailyEndHour = this.parseHourMinute(data.deltas.onceDailyEndHour);
           }
           if(data.deltas.closedDeals) {
               newState.deltasClosedDeals = true;
               if(data.deltas.closedDeals.closed) {
                   newState.closed = true;
                   let closed = data.deltas.closedDeals.closed;
                    if(closed.startDate) {
                        newState.startDate = moment(closed.startDate, 'DD/MM/YYYY');
                        newState.deltaDate = moment(closed.deltaDate, 'DD/MM/YYYY')
                        newState.deltasDateHour = this.parseHourMinute(moment(closed.deltaDate, 'DD/MM/YYY hh:mm').format('hh:mm'));
                        newState.deltaRepeatInterval = closed.repeatInterval;
                        newState.onceDailyOnly = closed.onceDailyOnly;
                    }
               }
           }
       }
       return newState;
    }

    parseHourMinute( text ) {
        let result = text.split(':');
        return {
            hour: result[0],
            minute: result[1]
        }
    }
    handleChangeForm( event )
    {
        const name = event.target.name;
        const value = event.target.value;
        let newState = deepcopy(this.state);
        newState[name] = value;
        this.setState(newState);
    }

    handleChangeDate(name, date )
    {
        let newState = deepcopy(this.state);
        newState[name] = date;
        this.setState(newState);
    }

    handleChangeCheckBox( name )
    {
        let newState = deepcopy(this.state);
        newState[name] = !newState[name];
        this.setState(newState);
    }
    handleChangeTimeInput(event, name)
    {
        let newState = deepcopy(this.state);
        newState[name][event.target.name] = event.target.value;
        this.setState(newState);
    }
    render()
    {
        return (
          <DealershipDmsSetup onChangeDate={this.handleChangeDate}
                              onChangeCheckBox={this.handleChangeCheckBox}
                              onChangeTimeInput={this.handleChangeTimeInput}
                              onChangeForm={this.handleChangeForm}
                              form={this.state}
          />
        );
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default connect(null, mapDispatchToProps)(DealershipDmsSetupContainer);

