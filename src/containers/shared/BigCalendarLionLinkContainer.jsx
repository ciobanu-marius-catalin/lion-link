import React from 'react';
import BigCalendarLionLink from "../../components/shared/BigCalendarLionLink";
import config from "config";
import axios from 'axios';
import deepcopy from 'deepcopy';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import ErrorParser from "../../utils/ErrorParser";

class BigCalendarLionLinkContainer extends React.Component
{


    constructor()
    {
        super();
        this.state = {
            events: [],
            title: 'CALENDAR'
        };
        this.getAllTasks = this.getAllTasks.bind(this);
    }

    componentDidMount()
    {
        this.getAllTasks();
    }

    getAllTasks()
    {
        console.log('BigCalendarLionLinkContainer');
        let include = {
            include: {
                dealershipDepartments: {
                    departmentTasks: {
                        tasks: 'getReadyForm'
                    }
                }
            }
        };
        let filter = {
            filter: include
        };
        axios({
            method: 'get',
            url: config.api + '/Dealerships/' + this.props.dealershipId,
            params: filter
        })
            .then(response => {
                if ( response.status === 200 ) {
                    let newState = deepcopy(this.state);
                    let taskList = this.getListOfTasksFromDealership(response.data);
                    newState.events = this.createEvents(taskList);
                    this.setState(newState);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });

    }

    getListOfTasksFromDealership( dealership )
    {
        let listOfTasks = [];
        dealership.dealershipDepartments.forEach(dealershipDepartment => {
            dealershipDepartment.departmentTasks.forEach(departmentTask => {
                let taskName = departmentTask.name;
                departmentTask.tasks.forEach(task => {
                    listOfTasks.push({
                        taskName: taskName,
                        ...task
                    });
                })
            })
        });

        return listOfTasks;
    }

    createEvents( tasks )
    {
        let events = []
        tasks.forEach(task => {
            let pickUpDate = '';
            if ( task.getReadyForm ) {
                pickUpDate = ' Due on:' + moment(task.getReadyForm.pickupDate).format('DD/MM/YYYY HH:MM');
            }
            events.push({
                    title: task.taskName,
                    pickUpDate: pickUpDate,
                    startDate: new Date(task.dueDate),
                    endDate: new Date(task.dueDate)
                }
            )
        });
        return events;
    }
    calendarCustomEvent({ event }) {
    return (
        <span>
            {event.title}
            {event.pickUpDate ? <br/> : null }
            {event.pickUpDate ? event.pickUpDate: null }
    </span>
    )
}
    render()
    {
        let title = this.props.title;
        return (
            <DocumentTitle title={title}>
                <BigCalendarLionLink events={this.state.events}
                                     title={title}
                                     calendarCustomEvent = {this.calendarCustomEvent}
                />
            </DocumentTitle>
        )
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(BigCalendarLionLinkContainer));
