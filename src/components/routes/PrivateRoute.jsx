import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import UsersHelper from '../../utils/UserHelpers';
import axios from 'axios';
import config from 'config';
import { bindActionCreators } from 'redux';
import { onGetDealershipOfUser } from "../../actions/LoginActions";
import deepcopy from 'deepcopy';
import { Grid } from "react-bootstrap";
import { onAddCriticalError, onResetValidationErrors } from "../../actions/ErrorActions";
import ErrorParser from "../../utils/ErrorParser";

class PrivateRoute extends React.Component
{

    constructor()
    {
        super();
        this.getUserDealership = this.getUserDealership.bind(this);
    }

    componentDidMount()
    {
        console.log('not');
        let userType = UsersHelper.getUserType(this.props.user.userData);
        if ( this.props.user && userType !== UsersHelper.systemAdministrator && !this.props.user.userData.dealership ) {
            this.getUserDealership();
        }
    }

    getUserDealership()
    {

        let filter = {
            filter: {
                include: 'dealership'
            }
        };
        axios({
            method: 'get',
            url: config.api + '/Accounts/' + this.props.user.userData.id,
            params: filter
        })
            .then(response => {
                if ( response.status === 200 ) {
                    let user = response.data;
                    this.props.onGetDealershipOfUser(this.props.user, user)
                }
            })
            .catch(error => {
                if ( error.response ) {
                    error.log(JSON.stringify(error.response));
                    // ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    render()
    {
        console.log('PrivateRoute');
        let Layout = this.props.layout;
        let userHasPermission = true;
        let userType = '';
        let page = this.props.page;
        let title = this.props.title;
        if ( this.props.user ) {
            userType = UsersHelper.getUserType(this.props.user.userData);
        }
        if ( this.props.user && this.props.role ) {
            userHasPermission = userType === this.props.role;
        }
         if ( this.props.user && userType !== UsersHelper.systemAdministrator && !this.props.user.userData.dealership ) {
            return null
         }

        let Component = this.props.component;
        return (
            <Route path={this.props.path} render={props => (

                //check if user is logged in
                (this.props.user !== null && userHasPermission) ? (
                   <Layout title={title} page={page}>
                       <Component {...props}/>
                   </Layout>
                ) : (
                    <Redirect to={{
                        pathname: '/logout',
                        state: {from: props.location}
                    }}/>
                )
            )}/>
        );
    }
}
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onGetDealershipOfUser: onGetDealershipOfUser,
    }, dispatch);
};
const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PrivateRoute));

