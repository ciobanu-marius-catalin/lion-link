import React from 'react';
import { connect } from 'react-redux';
import Login from '../../components/authentication/Login';
import { onLogin } from '../../actions/LoginActions';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import config from 'config';
import { Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title'
import UserHelpers from "../../utils/UserHelpers";
import deepcopy from 'deepcopy';

class LoginContainer extends React.Component
{
    constructor()
    {
        super();
        this.handleSubmitData = this.handleSubmitData.bind(this);
        this.state = {
            formErrors: {
                email: null,
                password: null
            }
        }
    }

    getInitialState()
    {
        return {
            formErrors: {
                email: null,
                password: null
            }
        }
    }

    handleSubmitData( data )
    {
        let newState = deepcopy(this.state);
        let hasFormErrors = false;
        if(data.email === '') {
            newState.formErrors.email = 'required';
            hasFormErrors = true;
        } else {
            newState.formErrors.email = null;
        }
        if(data.password === '') {
            newState.formErrors.password = 'required';
            hasFormErrors = true;
        } else {
            newState.formErrors.password = null;
        }
        this.setState(newState);
        if( hasFormErrors ) {
            return;
        }
        newState = this.getInitialState();
        this.setState(newState);
        axios({
            method: 'post',
            url: config.api + '/Accounts/login',
            data: data
        })
            .then(response => {


                    return this.props.onLogin(null, response.data)
                }
            )
            .catch(error => {
                if ( error.response ) {

                    return this.props.onLogin(error.response.data, null)
                }
            });
    }

    render()
    {
        //here i will redirect the user to a page based on his role
        let userType = null;
        if ( this.props.user ) {
            userType = UserHelpers.getUserType(this.props.user.userData);
        }
        let homePage = '';
        switch ( userType ) {
            case UserHelpers.systemAdministrator:
                homePage = '/dealerships';
                break;
            case UserHelpers.dealershipAdmin:
                homePage = '/departmentsDealershipAdmin';
                break;
            default:
                break;
        }
        return (
            //when user has been logged in redirect him to home page
            this.props.user !== null ? (
                <Redirect to={{
                    pathname: homePage
                }}/>) : (
                <DocumentTitle title='Login'>
                    <Login loginError={this.props.loginError}
                           onSubmitData={this.handleSubmitData}
                           formErrors={this.state.formErrors}
                    />
                </DocumentTitle>)
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user,
        loginError: state.login.error
    };
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onLogin: onLogin
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
