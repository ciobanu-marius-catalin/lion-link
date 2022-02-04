import React from 'react';
import DealershipAdminGetReadyForm from "../../components/get-ready-form/DealershipAdminGetReadyForm";
import DocumentTitle from 'react-document-title';
import deepcopy from 'deepcopy';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import config from 'config';
import axios from 'axios';
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import ErrorParser from "../../utils/ErrorParser";
import MixedHelpers from "../../utils/MixedHelpers";

class DealershipAdminGetReadyFormContainer extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            title: 'GET READY FORM',
            PickUpLocationContainer: {},
            DocumentsContainer: {},
            getReadyFormInitialState: {},
            dataIsLoaded: false
        };

        this.handleSync = this.handleSync.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getDocumentsForSubmit = this.getDocumentsForSubmit.bind(this);
        this.getDetailsForSubmit = this.getDetailsForSubmit.bind(this);
        this.getGetReadyFormInitialState = this.getGetReadyFormInitialState.bind(this);
    }

    componentDidMount()
    {
        this.props.setTitle(this.state.title);
        this.getGetReadyFormInitialState();
    }

    handleSync( child, childState )
    {
        let newState = deepcopy(this.state);
        let childStateCopy = deepcopy(childState);
        newState[child] = childStateCopy;
        this.setState(newState);
    }

    //the application needs the current state so in case of a update when the user hasn't visited all the tabs
    //it has all the data it needs.
    getGetReadyFormInitialState()
    {
        axios({
            method: 'get',
            url: config.api + '/Dealerships/' + this.props.dealershipId + '/getReadyConfig'
        })
            .then(response => {
                if ( response.status === 200 ) {

                    //in case of status code 200 set the method of put and save the initialState
                    let newState = deepcopy(this.state);
                    newState.method = 'put';
                    newState.dataIsLoaded = true;
                    newState.getReadyFormInitialState = response.data;
                    this.setState(newState);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    console.log('123131');
                    //in case of 404 it means that the getReadyForm has not been configured yet so the method used
                    //will be post, we don't need the error handling
                    if ( error.response.data.error.statusCode == 404 ) {
                        let newState = deepcopy(this.state);
                        newState.method = 'post';
                        newState.dataIsLoaded = true;
                        this.setState(newState);
                        return;
                    }
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            })
    }


    //return the initial state for the DocumentsContainer component
    getDocumentsContainerInitialState()
    {
        //if there is no getReadyForm yet or there are no documents return an empty array
        if ( !this.state.getReadyFormInitialState.documents ) {
            return [];
        }
        let documents = [];

        //create an id for the documents because labelList uses ids
        let id = 1;

        //create the objects with id and name for the DocumentsContainer
        documents = this.state.getReadyFormInitialState.documents.map(document => (
            {
                id: id++,
                name: document
            }
        ));

        return documents;
    }

    //return the initial state for the PickUpLocationContainer component
    getPickUpLocationContainerInitialState()
    {
        //if there
        if ( MixedHelpers.objectIsEmpty(this.state.getReadyFormInitialState) ) {
            return {};
        }
        let initialState = deepcopy(this.state.getReadyFormInitialState);
        if ( initialState.documents ) {
            delete initialState.documents;
        }
        if ( initialState.additionalInformation ) {
            delete initialState.additionalInformation;
        }
        if ( initialState.id ) {
            delete initialState.id;
        }
        return initialState;
    }

    submitDataInApi( data )
    {
        axios({
            method: 'post',
            url: config.api + '/Dealerships/' + this.props.dealershipId + '/getReadyConfig',
            data: data
        })
            .then(response => {
                if ( response.status === 200 ) {
                    this.props.history.push('/');
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    //get the documents used for submit
    getDocumentsForSubmit()
    {
        let documents = [];

        //if the DocumentsContainer property which is used for synchronization with the DocumentsContainer component is
        //empty return the initial state got from the api
        if ( MixedHelpers.objectIsEmpty(this.state.DocumentsContainer) ) {
            return this.getDocumentsContainerInitialState().map( document => (
                document.name
            ));
        }

        //if the data in the DocumentsContainer property exist use it to get the documents
        this.state.DocumentsContainer.syncedDataDocuments.newElements.forEach(element => {
            documents.push(element.name);
        });
        this.state.DocumentsContainer.syncedDataDocuments.oldElements.forEach(element => {
            if ( !element.pendingDelete ) {
                documents.push(element.name);
            }
        });
        return documents;
    }

    getDetailsForSubmit()
    {
        //if the PickUpLocationContainer property which is used for synchronization with the PickUpLocationContainer component is
        //empty return the initial state got from the api
        if ( MixedHelpers.objectIsEmpty(this.state.PickUpLocationContainer) ) {
            return this.getPickUpLocationContainerInitialState();
        }
        let result = {};
        let object = this.state.PickUpLocationContainer.tableData;
        for ( let prop in object ) {

            if ( object[prop] === true ) {
                result[prop] = true;
            }
        }

        return result;
    }


    handleSubmit( event )
    {
        event.preventDefault();
        //PUT /Dealerships/{id}/getReadyConfig
        // this.props.onResetValidationErrors();
        let documents = this.getDocumentsForSubmit();
        let details = this.getDetailsForSubmit();
        let data = {
            documents: documents
        };
        data = Object.assign({}, data, details);
        this.submitDataInApi(data);
    }


    render()
    {
        if ( !this.state.dataIsLoaded ) {
            return null;
        }
        return (
            <DocumentTitle title={this.state.title}>
                <DealershipAdminGetReadyForm method="put"
                                             syncData={this.state}
                                             onSubmit={this.handleSubmit}
                                             onSync={this.handleSync}
                                             dealershipId={this.props.dealershipId}
                                             documentContainerInitialState={this.getDocumentsContainerInitialState()}
                                             pickUpLocationContainerInitialState={this.getPickUpLocationContainerInitialState()}

                />
            </DocumentTitle>
        )
    }
}

//in privateroute i check if the user has dealership. If the there is no dealership this component won't mount.
const mapStateToProps = state => {
    return {
        dealershipId: state.login.user.userData.dealership.id
    };
};
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DealershipAdminGetReadyFormContainer));

