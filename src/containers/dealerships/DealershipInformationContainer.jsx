import React from 'react';
import DealershipInformation from "../../components/dealerships/DealershipInformation";
import axios from 'axios';
import config from 'config';
import deepcopy from 'deepcopy';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import ErrorParser from "../../utils/ErrorParser";

class DealershipInformationContainer extends React.Component
{
    constructor()
    {
        super();
        this.state = {

            /*
            array of
            {
                selected boolean,
                id string,
                name, string
            }
             */
            communications: [],

            /*
            array of
            {
                isDefault boolean,
                id string,
                universalCommunicationId string
                dealershipId string
            }
             */
            dealershipCommunications: [],
            form: {
                name: '',
                address: '',
                phoneNumber: '',
                website: ''
            },
            validationErros: {

            }
        };
        this.handleChangeDealershipInformation = this.handleChangeDealershipInformation.bind(this);
        this.handleSelectDealershipInformation = this.handleSelectDealershipInformation.bind(this);
        this.getFormDataFromApi = this.getFormDataFromApi.bind(this);
        this.getUniversalCommunicationsFromApi = this.getUniversalCommunicationsFromApi.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getDealershipCommunicationsFromApi = this.getDealershipCommunicationsFromApi.bind(this);
        this.selectCommunications = this.selectCommunications.bind(this);
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
        if ( this.props.syncData.communications ) {
            let newState = deepcopy(this.props.syncData);
            this.setState(newState);

            //if the state has not been synced yet
        } else {
            this.getUniversalCommunicationsFromApi();
            //if the component is used for update get the dealership data from the API.
            if ( this.props.method === 'put' ) {
                this.getFormDataFromApi();
            }
        }
    }

    shouldComponentUpdate( nextProps, nextState )
    {
        if ( this.props.submited ) {
            this.onSubmit();
        }
        if ( this.props.hasToSyncData ) {
            if ( (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
                (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ) {

                //synchronization only goes up
                this.props.onSync('DealershipInformationContainer', nextState);
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
            url: config.api + '/Dealerships/' + this.props.dealershipId
        })
            .then(response => {
                if ( response.status === 200 ) {
                    let newState = deepcopy(this.state);
                    newState.form = response.data;
                    delete newState.form._dmsConfig;
                    this.setState(newState);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    getDealershipCommunicationsFromApi()
    {
        let data = {
            filter: {
                where: {
                    dealershipId: this.props.dealershipId
                }
            }
        };
        axios({
            method: 'get',
            url: config.api + '/DealershipCommunications',
            params: data
        })
            .then(response => {
                if ( response.status === 200 ) {
                    let dealershipCommunications = response.data;
                    this.selectCommunications(dealershipCommunications);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);

                }
            })
    }

    selectCommunications( dealershipComm )
    {
        let newState = deepcopy(this.state);
        newState.dealershipCommunications = dealershipComm;
        let universalComm = newState.communications;
        for ( let i = 0; i < dealershipComm.length; i++ ) {
            for ( let j = 0; j < universalComm.length; j++ ) {
                if ( dealershipComm[i].universalCommunicationId === universalComm[j].id ) {
                    universalComm[j].selected = true
                }
            }
        }
        this.setState(newState);
    }

    getUniversalCommunicationsFromApi()
    {
        axios({
            method: 'get',

            //use the api path provided in the props
            url: config.api + '/UniversalCommunications'
        })
            .then(response => {
                    if ( response.status === 200 ) {
                        let communicationNames = response.data;
                        communicationNames = communicationNames.map(function ( element ) {
                            return {
                                selected: false,
                                ...element
                            };
                        });
                        let newState = deepcopy(this.state);
                        newState.communications = communicationNames;
                        this.setState(newState);

                        //after the universal communications are loaded get the dealership communications
                        if ( this.props.method === 'put' ) {
                            this.getDealershipCommunicationsFromApi();
                        }
                    }
                }
            )
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    onSubmit()
    {
        this.props.onSubmit(this.state);
    }

    handleChangeDealershipInformation( name, value )
    {
        var newState = deepcopy(this.state);
        newState.form[name] = value;
        this.setState(newState);
    }

    handleSelectDealershipInformation( id )
    {
        var newState = deepcopy(this.state);
        this.selectFromArray(newState.communications, id);
        this.setState(newState);
    }

    selectFromArray( array, id )
    {
        for ( let i = 0; i < array.length; i++ ) {
            if ( array[i].id === id )
                array[i].selected = !array[i].selected;
        }
    }


    render()
    {
        return (
            <DealershipInformation form={this.state.form}
                                   communications={this.state.communications}
                                   onChangeDealershipInformation={this.handleChangeDealershipInformation}
                                   onSelect={this.handleSelectDealershipInformation}
            />
        )
    }
}
DealershipInformationContainer.defaultProps = {
    hasToSyncData: false
};
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default connect(null, mapDispatchToProps)(DealershipInformationContainer);

