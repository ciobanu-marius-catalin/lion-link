import React from 'react';
import DealershipDepartments from "../../components/dealerships/DealershipDepartments";
import axios from "axios";
import config from 'config';
import deepcopy from 'deepcopy';
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import { connect } from "react-redux";
import ErrorParser from "../../utils/ErrorParser";

class DealershipDepartmentsContainer extends React.Component
{
    constructor()
    {
        super();
        this.getDepartmentsFromApi = this.getDepartmentsFromApi.bind(this);
        this.handleSync = this.handleSync.bind(this);
        this.getDealershipDepartmentsFromApi = this.getDealershipDepartmentsFromApi.bind(this);
        this.getDealershipDepartmentUsingDepartmentId = this.getDealershipDepartmentUsingDepartmentId.bind(this);
        this.getDataFromApi = this.getDataFromApi.bind(this);
        this.state = {
            departments: [],
            departmentsLoaded: false,
            dealershipDepartments: [],
            listElements: [],
        }
    }

    shouldComponentUpdate( nextProps, nextState )
    {
        if ( this.props.hasToSyncData ) {
            if ( (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
                (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ) {

                //synchronization only goes up

                this.props.onSync('DealershipDepartmentsContainer', nextState);
                return true;
            }
            {
                return false;
            }
        } else {

        }
        return true;
    }

    componentWillMount()
    {
        if ( this.props.hasToSyncData ) {
            //check if the component has been created before when used in the tabs page. If the listElements property
            //it is undefined then the state should be copied from the ancestor that syncs this state.
            if ( this.props.syncData.listElements ) {

                let newState = deepcopy(this.props.syncData);
                this.setState(newState);
            } else {
                this.getDataFromApi();
            }
        } else {
            this.getDataFromApi();
        }

    }

    //For the dealership admin only show the departments selected by the sysadmin
    getDataFromApi()
    {
        if ( !this.props.isDealershipAdmin ) {
            this.getDepartmentsFromApi();
        } else {
            this.getDealershipDepartmentsFromApi();
        }
    }


    getDepartmentsFromApi()
    {
        axios({
            method: 'get',
            url: config.api + '/Departments'
        })
            .then(response => {
                    if ( response.status === 200 ) {
                        let departments = response.data;
                        let newState = deepcopy(this.state);
                        newState.departments = departments;
                        // newState.departmentsLoaded = true;

                        let listElements = this.generateListElements(departments);
                        newState.listElements = listElements;

                        //on update get the dealershipDepartments
                        if ( this.props.method === 'put' ) {
                            this.getDealershipDepartmentsFromApi();
                        }
                        if ( this.props.method === 'post' ) {
                            newState.departmentsLoaded = true;
                        }

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

    getDealershipDepartmentUsingDepartmentId( departmentId )
    {
        let dealershipDepartment = null;
        this.state.dealershipDepartments.forEach(element => {
            if ( element.departmentId === departmentId )
                dealershipDepartment = deepcopy(element);
        });
        return dealershipDepartment;
    }


    getDealershipDepartmentsFromApi()
    {
        let where = {
            where: {
                dealershipId: this.props.dealershipId
            },

        };

        let include = {
            include: [
                'departmentTasks',
                'department'
            ]
        };


        let conditions = Object.assign({}, where, include);

        let data = {
            filter: conditions
        };

        axios({
            method: 'get',
            url: config.api + '/DealershipDepartments',
            params: data
        })
            .then(response => {
                    if ( response.status === 200 ) {

                        let dealershipDepartments = response.data;
                        let newState = deepcopy(this.state);
                        newState.dealershipDepartments = dealershipDepartments;

                        //in case of dealershipAdmin departments first load the dealershipDepartments then generate the
                        //departments list from there. In case of sys admin page first load departments then dealership
                        //departments
                        if ( this.props.isDealershipAdmin ) {
                            let departments = this.generateDepartmentsArray(dealershipDepartments);
                            newState.departments = departments;
                            let listElements = this.generateListElements(departments);
                            newState.listElements = listElements;
                        }
                        newState.departmentsLoaded = true;
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

    generateListElements( departments )
    {
        let listElements = [];
        departments.forEach(( element, index ) => {
            listElements[index] = {
                checked: false
            };
        });
        return listElements;
    }

    generateDepartmentsArray( dealershipDepartments )
    {
        let departments = dealershipDepartments.map(element => (
            element.department
        ));
        return departments;
    }

    handleSync( positionInArray, childState )
    {

        let newState = deepcopy(this.state);
        let childStateCopy = childState;
        newState.listElements[positionInArray] = childStateCopy;
        this.setState(newState);
    }

    render()
    {
        return (
            //show component when the departments loaded
            (this.state.departmentsLoaded) ?
                (<DealershipDepartments departments={this.state.departments}
                                        dealershipId={this.props.dealershipId}
                                        method={this.props.method}
                                        onSync={this.handleSync}
                                        apiPath="/Departments"
                                        syncData={this.state.listElements}
                                        getDealershipDepartmentUsingDepartmentId={this.getDealershipDepartmentUsingDepartmentId}
                                        unblockButtons={this.props.unblockButtons}
                />) : null

        );
    }
}

DealershipDepartmentsContainer.defaultProps = {
    hasToSyncData: false
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default connect(null, mapDispatchToProps)(DealershipDepartmentsContainer);

