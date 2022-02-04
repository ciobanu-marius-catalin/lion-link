import React from 'react';
import DepAndComPage from '../../components/shared/DepAndComPage';
import DocumentTitle from 'react-document-title';
import axios from 'axios';
import config from 'config';
import deepcopy from 'deepcopy';
import ErrorParser from "../../utils/ErrorParser";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";

class DepAndComContainer extends React.Component
{

    constructor()
    {
        super();
        this.state = this.getComponentInitialState();
        this.handleTriggerSubmit = this.handleTriggerSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getComponentInitialState()
    {
        return {
            triggeredSubmit: false,
            submitted: false,
            asyncTaskPending: 0,
            reloadPage: Math.random().toString(36).slice(2)
        };
    }

    componentDidUpdate( prevProps, prevState )
    {
        if ( this.state.submitted && this.state.asyncTaskPending === 0 ) {

            //when the reloadPage token is changed because it is used as the key for the top component in render
            //all the children will be destroyed and rendered again which will simulate a page reload
            let newState = this.getComponentInitialState();
            this.setState(newState);
        }
    }

    insertData( state )
    {
        let newElements = state.newElements;

        //if there are no elements to be inserted cancel the insert
        if ( newElements.length === 0 ) {
            return;
        }
        let data = [];
        for ( let i = 0; i < newElements.length; i++ ) {
            data[i] = {
                name: newElements[i].name
            };
        }
        axios({
            method: 'post',

            //use the api path provided in the props
            url: config.api + this.props.apiPath,
            data: data
        })
            .then(response => {
                    if ( response.status === 200 ) {
                        let newState = deepcopy(this.state);
                        newState.asyncTaskPending--;
                        this.setState(newState);
                    }
                }
            )
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    handleSubmit( state )
    {
        let nrAsyncTasks = this.computeNumberOfAsyncTasks(state);
        let newState = deepcopy(this.state);
        newState.asyncTaskPending = nrAsyncTasks;
        newState.triggeredSubmit = false;
        newState.submitted = true;
        this.setState(newState);

        this.insertData(state);
        this.deleteData(state);
    }

    //see how many async tasks should return successfully
    computeNumberOfAsyncTasks( state )
    {
        let insertAsyncTasks = ( state.newElements.length > 0 ) ? 1 : 0;
        let deleteAsyncTasks = this.getNrElementsToBeDeleted(state.oldElements);
        let nrAsyncTasks = insertAsyncTasks + deleteAsyncTasks;
        return nrAsyncTasks;
    }

    getNrElementsToBeDeleted( oldElements )
    {
        let nrElements = 0;
        for ( let i = 0; i < oldElements.length; i++ ) {
            if ( oldElements[i].pendingDelete === true ) {
                nrElements++;
            }
        }
        return nrElements;
    }


    deleteData( state )
    {
        let oldElements = state.oldElements;
        for ( let i = 0; i < oldElements.length; i++ ) {
            if ( oldElements[i].pendingDelete === true ) {
                this.deleteDataAPI(oldElements[i].id);
            }
        }
    }

    deleteDataAPI( elementId )
    {
        axios({
            method: 'delete',
            //use the api path provided in the props
            url: config.api + this.props.apiPath + elementId
        })
            .then(response => {
                    if ( response.status === 200 ) {
                        let newState = deepcopy(this.state);
                        newState.asyncTaskPending--;
                        this.setState(newState);
                    }
                }
            )
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    handleTriggerSubmit()
    {
        let newState = deepcopy(this.state);
        newState.triggeredSubmit = true;
        this.setState(newState);
    }


    render()
    {
        return (
            <DocumentTitle key={this.state.reloadPage} title={this.props.title}>
                <DepAndComPage
                    title={this.props.title}
                    onSubmit={this.handleSubmit}
                    triggeredSubmit={this.state.triggeredSubmit}
                    onTriggerSubmit={this.handleTriggerSubmit}
                    apiPath={this.props.apiPath}
                    labelListTitle = {this.props.labelListTitle}
                />
            </DocumentTitle>
        );
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(DepAndComContainer));
