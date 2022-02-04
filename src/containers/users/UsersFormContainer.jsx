import React from 'react';
import UsersForm from '../../components/users/UsersForm';
import deepcopy from 'deepcopy';
import DocumentTitle from 'react-document-title';
import axios from 'axios';
import config from 'config';
import {
    onAddCriticalError, onAddError, onAddValidationError,
    onResetValidationErrors
} from "../../actions/ErrorActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ErrorParser from "../../utils/ErrorParser";
import { withRouter } from "react-router-dom";


class UsersFormContainer extends React.Component
{
    constructor( props )
    {
        super(props);
        this.state = {

            /*
			array of
			{
				id string,
				name, string
			}
			 */
            adminIsSelected: false,
            departments: [],
            isManagerOptions: [
                {value: false, label: 'No'},
                {value: true, label: 'Yes'}
            ],
            form: {
                accountType: 'dealershipUser',
                dealershipId: props.dealershipId,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                dealershipDepartmentId: '',
                _dealershipUser: {
                    isManager: false,
                    isAdmin: false
                }
            },
            validationErrors: {}
        };
        this.handleSaveUser = this.handleSaveUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.saveDataInApi = this.saveDataInApi.bind(this);
        this.handleSelectDepartment = this.handleSelectDepartment.bind(this);
        this.handleSelectIsManager = this.handleSelectIsManager.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.deleteUserFromApi = this.deleteUserFromApi.bind(this);
        this.addDealershipUser = this.addDealershipUser.bind(this);

    }


    componentDidMount()
    {
        if ( this.props.method === 'patch' ) {
            this.getFormDataFromApi();
        }
        this.getDepartmentsFromApi();
    }


    getDepartmentsFromApi()
    {
        let filter = {
            filter: {
                where: {
                    dealershipId: this.props.dealershipId
                },
                include: 'department'

            }
        }
        axios({
            method: 'get',
            url: config.api + '/DealershipDepartments',
            params: filter
        })
            .then(response => {
                if ( response.status === 200 ) {
                    let newState = deepcopy(this.state);
                    let options = response.data.map(dealershipDepartment => (
                        {
                            value: dealershipDepartment.id,
                            label: dealershipDepartment.department.name
                        }
                    ));

                    //hardcode the admin department to be be able to create admin users
                    let adminOption = {
                        value: 'Admin',
                        label: 'Admin'
                    };
                    options.push(adminOption);
                    newState.departments = options;
                    this.setState(newState);
                } else {
                    console.error(JSON.stringify(response.data));
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                    console.error(JSON.stringify(error.response.data));
                }
            });
    }

    getFormDataFromApi()
    {
        axios({
            method: 'get',
            url: config.api + this.props.apiPath
        })
            .then(response => {
                if ( response.status === 200 ) {
                    let newState = deepcopy(this.state);
                    newState.form = response.data;
                    if ( newState.form._dealershipUser.isAdmin ) {
                        newState.adminIsSelected = true;
                        newState.form.dealershipDepartmentId = 'Admin';
                    }
                    this.setState(newState);
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                    console.error(JSON.stringify(error.response.data));
                }
            });
    }

    saveDataInApi()
    {
        console.log('temp');

        //in case of update delete the password property
        let data = deepcopy(this.state.form);
        if ( data.password === '' ) {
            delete data.password;
        }
        delete data._dealershipUser;
        // if( this.props.method === 'post' )
        // {
        //     delete data.dealershipId;
        // }
        if ( this.state.form.adminIsSelected ) {
            delete data.dealershipDepartmentId
        }
        axios({
            method: this.props.method,
            url: config.api + this.props.apiPath,
            data: data
        })
            .then(response => {
                if ( response.status === 200 ) {
                    let userId = response.data.id;
                    this.addDealershipUser(userId)
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError, this.props.onAddValidationError);
                    console.error(JSON.stringify(error.response.data));
                }
            });
    }

    addDealershipUser( userId )
    {
        let data = this.state.form._dealershipUser;

        if ( this.state.adminIsSelected ) {
            this.configDataForAdminUser(data);
        } else {
            this.configDataForNonAdminUser(data);
        }

        axios({
            method: 'put',
            url: config.api + '/Accounts/' + userId + '/dealershipUser',
            data: data
        })
            .then(response => {
                if ( response.status === 200 ) {
                    this.props.onSubmitRedirect();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                    console.error(JSON.stringify(error.response.data));
                }
            });
    }

    configDataForAdminUser( data )
    {
        data.isAdmin = true;
        data.isManager = false;
    }

    configDataForNonAdminUser( data )
    {
        data.isAdmin = false;
    }

    deleteUserFromApi()
    {
        axios({
            method: 'delete',
            url: config.api + this.props.apiPath
        })
            .then(response => {
                if ( response.status === 200 || response.status === 204 ) {
                    this.props.onSubmitRedirect();
                }
            })
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                    console.error(JSON.stringify(error.response.data));
                }
            });
    }

    handleChangeForm( name, value )
    {
        var newState = deepcopy(this.state);
        newState.form[name] = value;
        this.setState(newState);
    }

    handleSaveUser()
    {
        this.props.onResetValidationErrors();
        this.saveDataInApi();
    }

    handleDeleteUser()
    {
        this.deleteUserFromApi();
    }

    handleSelectDepartment( val )
    {
        let newState = deepcopy(this.state);
        //if the department selected is admin then modify the state so it knows the user is a admin.
        if ( val.value === 'Admin' ) {
            newState.adminIsSelected = true;
        } else {
            newState.adminIsSelected = false;
        }

        newState.form.dealershipDepartmentId = val.value;
        this.setState(newState);
    }

    handleSelectIsManager( val )
    {
        let newState = deepcopy(this.state);
        newState.form._dealershipUser.isManager = val.value;
        this.setState(newState);
    }

    render()
    {
        return (
            <DocumentTitle title={this.props.title}>
                <div>
                    <UsersForm form={this.state.form}
                               departments={this.state.departments}
                               onChangeForm={this.handleChangeForm}
                               method={this.props.method}
                               title={this.props.title}
                               onSaveUser={this.handleSaveUser}
                               onDeleteUser={this.handleDeleteUser}
                               onSelectDepartment={this.handleSelectDepartment}
                               onSelectIsManager={this.handleSelectIsManager}
                               isManagerOptions={this.state.isManagerOptions}
                               adminIsSelected={this.state.adminIsSelected}
                    />
                </div>
            </DocumentTitle>
        )
    }
}


const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError,
        onAddValidationError: onAddValidationError,
        onResetValidationErrors: onResetValidationErrors
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(UsersFormContainer));
