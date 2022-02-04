import React from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import UserHelpers from "../../utils/UserHelpers";

class HomePage extends React.Component
{
    render()
    {
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
                homePage = '/login'
                break;
        }
        return (
            <Redirect to={{
                pathname: homePage
            }}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user
    };
};


export default connect(mapStateToProps)(HomePage);

