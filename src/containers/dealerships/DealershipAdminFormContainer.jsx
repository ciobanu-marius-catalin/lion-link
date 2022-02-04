import React from 'react';
import DealershipAdminForm from "../../components/dealerships/DealershipAdminForm";
import config from 'config';
import axios from 'axios';
import DocumentTitle from 'react-document-title';
import deepcopy from 'deepcopy';
import DealershipDepartmentsHelpers from "../../utils/DealershipDepartmentHelpers";
import { getQueryString } from "../../utils/URLHelpers";
import { withRouter } from "react-router-dom";
import MixedHelpers from "../../utils/MixedHelpers";
import { connect } from "react-redux";
import { onAddCriticalError, onAddValidationError, onResetValidationErrors } from "../../actions/ErrorActions";
import { bindActionCreators } from "redux";
import ErrorParser from "../../utils/ErrorParser";



class DealershipAdminFormContainer extends React.Component
{
    constructor(props)
    {
        super(props);
        let queryString = getQueryString(this.props.location.search);
        let initialTab = queryString.get('tab') ? queryString.get('tab') : 0;
        this.state = {
            DealershipInformationContainer: {},
            DealershipDepartmentsContainer: {},
            DealershipDmsSetupContainer: {},
            currentApiCalls: -1,
            initialTab: initialTab
        }
        this.handleSync = this.handleSync.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.createInsertDataDealershipCommunication = this.createInsertDataDealershipCommunication.bind(this);
        this.addNewCommunications = this.addNewCommunications.bind(this);
        this.insertDealershipInformationCommunications = this.insertDealershipInformationCommunications.bind(this);
        this.existDealershipCommunicationWithId = this.existDealershipCommunicationWithId.bind(this);
        this.updateDealershipInformationCommunications = this.updateDealershipInformationCommunications.bind(this);
        this.deleteDealershipInformationCommunications = this.deleteDealershipInformationCommunications.bind(this);
        this.createDMSConfiguration = this.createDMSConfiguration.bind(this);
        this.insertDmsConfiguration = this.insertDmsConfiguration.bind(this);
        this.getProcessedDealershipInformationCommunications = this.getProcessedDealershipInformationCommunications.bind(this);
        this.countNumberOfAsyncCalls = this.countNumberOfAsyncCalls.bind(this);
        this.getDeleteDealershipInformationCommunicationsData = this.getDeleteDealershipInformationCommunicationsData.bind(this);
        this.reduceNumberOfApiCallsCallBack = this.reduceNumberOfApiCallsCallBack.bind(this);
        this.submitModifiedTabs = this.submitModifiedTabs.bind(this);
        this.getValidationParameters = this.getValidationParameters.bind(this);
    }


    componentDidUpdate( oldProps, oldState )
    {
        if ( this.state.currentApiCalls === 0 ) {
            this.props.onSubmitRedirect();
        }
    }
    handleSync( child, childState )
    {
        let newState = deepcopy(this.state);
        let childStateCopy = deepcopy(childState);
        newState[child] = childStateCopy;
        this.setState(newState);
    }


    getValidationParameters()
    {
        return {
            history: this.props.history,
            onAddCriticalError: this.props.onAddCriticalError,
            onAddValidationError: this.props.onAddValidationError
        }
    }

    submitModifiedTabs()
    {
        this.countNumberOfAsyncCalls();

        //if the dealership is inserted first you have to create the dealership then you can inert departments and
        //configure the dms
        if(this.props.method === 'post' ) {
            this.dealershipInformationForm();
        }

        //if you edit the dealership you can edit what tab you like.
        if( this.props.method === 'put') {
            let dealershipId = this.props.dealershipId;

            //if the dealershipId doesn't exist the submit ends here with no modifications.
            if( !dealershipId ) {
                return
            }
            if( !MixedHelpers.objectIsEmpty(this.state.DealershipInformationContainer) ) {
                this.dealershipInformationForm();
            }
            if ( !MixedHelpers.objectIsEmpty(this.state.DealershipDepartmentsContainer) ) {
                DealershipDepartmentsHelpers.departmentsAsync(dealershipId, this.props.method,
                    this.state.DealershipDepartmentsContainer, this.reduceNumberOfApiCallsCallBack, this.getValidationParameters);
            }
            if( !MixedHelpers.objectIsEmpty(this.state.DealershipDmsSetupContainer) ) {
                this.insertDmsConfiguration(dealershipId);
            }
        }
    }
    //information tab async methods


    dealershipInformationAsync()
    {
        //count total number of api calls when then number reaches 0 redirect to home page
        this.countNumberOfAsyncCalls();
        this.dealershipInformationForm();
    }

    dealershipInformationForm()
    {

        let data = this.state.DealershipInformationContainer.form;


        //when updating the dealership collection use patch instead of post so dmsConfig won't be deleted
        axios({
            // method: this.props.method === 'put' ? 'patch' : this.props.method,
            method: this.props.method,
            url: config.api + this.props.apiPath,
            data: data
        })
            .then(response => {
                if ( response.status === 200 ) {

                    let dealershipId = response.data.id;
                    this.reduceNumberOfApiCallsCallBack();

                    if ( this.props.method === 'post' ) {
                        this.insertDealershipInformationCommunications(dealershipId);
                        this.insertDmsConfiguration(dealershipId);
                        //modify the departments and tasks.
                        DealershipDepartmentsHelpers.departmentsAsync(dealershipId, this.props.method,
                            this.state.DealershipDepartmentsContainer, this.reduceNumberOfApiCallsCallBack, this.getValidationParameters);
                    }
                    if ( this.props.method === 'put' ) {
                        this.updateDealershipInformationCommunications(dealershipId);
                    }

                    //this.props.onSubmitRedirect();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError, this.props.onAddValidationError);
                }
            });
    }


    countNumberOfAsyncCalls()
    {

        //dealership information
        let dealershipFormCalls = MixedHelpers.objectIsEmpty(this.state.DealershipInformationContainer) ? 0 : 1;

        let dealershipAddCommunicationsCalls = 0;
        let dealershipDeleteCommunicationCalls = 0;
        if( dealershipFormCalls === 1 ) {
            dealershipAddCommunicationsCalls = this.getProcessedDealershipInformationCommunications().length;
            dealershipDeleteCommunicationCalls = this.getDeleteDealershipInformationCommunicationsData().length;
        }
        //dms config
        let dmsConfigurationCalls = this.createDMSConfiguration() ? 1 : 0;

        //departments
        let departmentsApiCalls = DealershipDepartmentsHelpers.countNumberOfAsyncCalls(this.props.method, this.state.DealershipDepartmentsContainer);
        let totalApiCalls = dealershipFormCalls + dmsConfigurationCalls + dealershipAddCommunicationsCalls +
            dealershipDeleteCommunicationCalls + departmentsApiCalls;
        let newState = deepcopy(this.state);
        newState.currentApiCalls = totalApiCalls;
        this.setState(newState);

    }


    reduceNumberOfApiCallsCallBack()
    {
        let newState = deepcopy(this.state);
        newState.currentApiCalls--;
        this.setState(newState);
    }

    createInsertDataDealershipCommunication( dealershipId, data )
    {
        let result = [];
        data.forEach(element => {
                if ( element.selected ) {
                    result.push({
                        dealershipId: dealershipId,
                        universalCommunicationId: element.id
                    });
                }
            }
        );
        return result;
    }

    addNewCommunications( dealershipId, universalCommunications, dealershipCommunications )
    {
        let result = [];

        universalCommunications.forEach(element => {
            if ( (!this.existDealershipCommunicationWithId(element.id, dealershipCommunications)) && element.selected ) {

                result.push({
                    dealershipId: dealershipId,
                    universalCommunicationId: element.id
                });
            }
        });

        return result;
    }

    getOldCommunicationsId( universalCommunications, dealershipCommunications )
    {
        let result = [];
        dealershipCommunications.forEach(element => {
            if ( this.shouldDeleteThisDealershipCommunication(element.universalCommunicationId, universalCommunications) ) {
                result.push(element.id);
            }
        });

        return result;
    }

    //if the dealershipCommunication object exists means it was selected when the component loaded, if it isn't selected
    //anymore it means it should be deleted
    shouldDeleteThisDealershipCommunication( id, universalCommunications )
    {
        var result = false;
        universalCommunications.forEach(function ( element ) {
            if ( element.id === id && !element.selected ) {

                result = true;
            }
        });
        return result;
    }

    existDealershipCommunicationWithId( id, dealershipCommunication )
    {
        var result = false;
        dealershipCommunication.forEach(function ( element ) {
            if ( element.universalCommunicationId === id ) {

                result = true;
            }
        });
        return result;

    }

    getDeleteDealershipInformationCommunicationsData()
    {
        let universalCommunications = this.state.DealershipInformationContainer.communications;
        let dealershipCommunications = this.state.DealershipInformationContainer.dealershipCommunications;

        var ids = this.getOldCommunicationsId(universalCommunications, dealershipCommunications);

        return ids;
    }

    deleteDealershipInformationCommunications( dealershipId )
    {
        var ids = this.getDeleteDealershipInformationCommunicationsData();
        ids.forEach(id => {

            this.deleteDealershipCommunicationsFromApi(id);
        })
    }

    deleteDealershipCommunicationsFromApi( id )
    {

        axios({
            method: 'delete',
            url: config.api + '/DealershipCommunications/' + id
        })
            .then(response => {
                if ( response.status === 200 ) {
                    this.reduceNumberOfApiCallsCallBack();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }


    updateDealershipInformationCommunications( dealershipId )
    {
        this.insertDealershipInformationCommunications(dealershipId);
        this.deleteDealershipInformationCommunications(dealershipId);
    }


    getProcessedDealershipInformationCommunications( dealershipId )
    {
        let data;
        let universalCommunications = this.state.DealershipInformationContainer.communications;
        let dealershipCommunications = this.state.DealershipInformationContainer.dealershipCommunications;
        if ( this.props.method === 'post' ) {
            data = this.createInsertDataDealershipCommunication(dealershipId, universalCommunications);
        } else {
            data = this.addNewCommunications(dealershipId, universalCommunications, dealershipCommunications);
        }
        return data;
    }

    insertDealershipInformationCommunications( dealershipId )
    {

        let data = this.getProcessedDealershipInformationCommunications(dealershipId);
        data.forEach(element => {
            this.insertIntoApiDealershipCommunications(dealershipId, element.universalCommunicationId, {});
        })
    }

    insertIntoApiDealershipCommunications( dealershipId, communicationId, data )
    {
        axios({
            method: 'put',
            url: config.api + '/Dealerships/' + dealershipId + '/communications/rel/' + communicationId,
            data: data
        })
            .then(response => {
                if ( response.status === 200 ) {
                    this.reduceNumberOfApiCallsCallBack();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError, this.props.onAddValidationError);
                }
            });
    }


    //DMS setup
    insertDmsConfiguration( dealershipId )
    {
        let data = this.createDMSConfiguration();

        //if the config is empty do nothing
        if ( !data ) {
            return;
        }
        axios({
            method: this.props.method,
            url: config.api + '/Dealerships/' + dealershipId + '/dmsConfig',
            data: data
        })
            .then(response => {
                if ( response.status === 200 ) {
                    this.reduceNumberOfApiCallsCallBack();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError, this.props.onAddValidationError);
                }
            });
    }



    createDMSConfiguration()
    {
        let configuration = null;
        let dmsSetup = this.state.DealershipDmsSetupContainer;
        //if there are no modifications to the configuration return empty object
        if ( MixedHelpers.objectIsEmpty(dmsSetup) ) {
            return configuration
        }

        let dealerNumbers = {
            dealerCode: dmsSetup.dealerCode
        };
        let intervals = {};
        if ( dmsSetup.intervals ) {
            intervals = {
                intervals:
                    {
                        scheduleStartHour: this.hourMinuteToString(dmsSetup.intervalsScheduleStartHour),
                        scheduleEndHour: this.hourMinuteToString(dmsSetup.intervalsScheduleEndHour),
                        closedDeals: dmsSetup.intervalsClosedDeals
                    }
            }
        }
        let deltas = {};
        if ( dmsSetup.deltas ) {
            let closedDeals = {};
            if ( dmsSetup.deltasClosedDeals && dmsSetup.closed ) {
                closedDeals = {
                    closed: {
                        startDate: dmsSetup.startDate.format('DD-MM-YYYY'),
                        deltaDate: dmsSetup.deltaDate.format('DD-MM-YYYY') +
                        ' ' +
                        this.hourMinuteToString(dmsSetup.deltasDateHour),
                        repeatInterval: dmsSetup.deltaRepeatInterval,
                        onceDailyOnly: dmsSetup.onceDailyOnly
                    }
                }
            }

            deltas = {
                deltas: {
                    scheduleStartHour: this.hourMinuteToString(dmsSetup.deltasScheduleStartHour),
                    scheduleEndHour: this.hourMinuteToString(dmsSetup.deltasScheduleEndHour),
                    onceDailyStartHour: this.hourMinuteToString(dmsSetup.deltasOnceDailyStartHour),
                    onceDailyEndHour: this.hourMinuteToString(dmsSetup.deltasOnceDailyEndHour),
                    closedDeals: closedDeals
                }
            };

        }
        configuration = Object.assign({}, dealerNumbers, intervals, deltas);
        configuration = {
            configuration: configuration
        };
        if ( dmsSetup.id ) {
            configuration.id = dmsSetup.id;
        }
        return configuration;
    }

    hourMinuteToString( time )
    {
        return time.hour + ':' + time.minute;
    }


    handleSubmit()
    {
        this.props.onResetValidationErrors();
        //this.dealershipInformationAsync();
        this.submitModifiedTabs();
    }


    handleDelete()
    {
        console.log('deleted');
        axios({
            method: 'delete',
            url: config.api + this.props.apiPath,
        })
            .then(response => {
                if ( response.status === 200 ) {
                    console.log('deleted');
                    this.props.onSubmitRedirect();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    render()
    {
        return (
            <DocumentTitle title={this.props.title}>
                <DealershipAdminForm onSync={this.handleSync}
                                     syncData={this.state}
                                     onSubmit={this.handleSubmit}
                                     method={this.props.method}
                                     dealershipId={this.props.dealershipId}
                                     title={this.props.title}
                                     onDelete={this.handleDelete}
                                     initialTab={this.props.method === 'post' ? 0 : this.state.initialTab}
                />
            </DocumentTitle>
        );
    }
}
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError,
        onAddValidationError: onAddValidationError,
        onResetValidationErrors: onResetValidationErrors
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(DealershipAdminFormContainer));

