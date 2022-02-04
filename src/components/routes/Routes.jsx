import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import LoginContainer from '../../containers/authentication/LoginContainer';
import LogoutContainer from '../../containers/authentication/LogoutContainer';
import UsersListContainer from '../../containers/users/UsersListContainer';
import DealershipsListContainer from '../../containers/dealerships/DealershipsListContainer';
import DepartmentsList from '../departments/DepartmentsList';
import UniversalCommunicationsList from '../unniversal-communications/UniversalCommunicationsList'
import PrivateRoute from './PrivateRoute';
import GuestRoute from './GuestRoute';
import PageNotFound from '../shared/PageNotFound';
import DealershipAdminInsert from '../dealerships/DealershipAdminInsert';
import DealershipAdminUpdate from "../dealerships/DealershipAdminUpdate";
import UsersAdd from "../users/UsersAdd";
import UsersUpdate from "../users/UsersUpdate";
import UserHelpers from '../../utils/UserHelpers';
import DepartmentsDealershipAdminContainer from "../../containers/departments/DepartmentsDealershipAdminContainer";
import CalendarDealershipAdminContainer from "../../containers/dealerships/CalendarDealershipAdminContainer";
import LoginLayout from '../layouts/LoginLayout';
import UserLayout from '../layouts/UserLayout';
import HomePage from "../shared/HomePage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { onResetValidationErrors } from "../../actions/ErrorActions";
import DealershipAdminGetReadyFormContainer from "../../containers/get-ready-form/DealershipAdminGetReadyFormContainer";

class Routes extends React.Component
{
    componentDidUpdate()
    {
        //when the route has changed reset the validation errors.
        console.log('123');
        //this.props.onResetValidationErrors();

    }
    render()
    {
        return (
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <GuestRoute path="/login" component={LoginContainer} layout={LoginLayout}/>
                <PrivateRoute path="/logout" component={LogoutContainer} layout={LoginLayout}/>

                {/*sys admin routes*/}
                <PrivateRoute path="/users"
                              role={UserHelpers.systemAdministrator}
                              component={UsersListContainer}
                              layout={UserLayout}/>
                <PrivateRoute path="/user/add"
                              role={UserHelpers.systemAdministrator}
                              component={UsersAdd}
                              layout={UserLayout}/>
                <PrivateRoute path="/user/edit"
                              role={UserHelpers.systemAdministrator}
                              component={UsersUpdate}
                              layout={UserLayout}/>
                <PrivateRoute path="/dealership/add"
                              role={UserHelpers.systemAdministrator}
                              component={DealershipAdminInsert}
                              layout={UserLayout}/>
                <PrivateRoute path="/dealership/edit"
                              role={UserHelpers.systemAdministrator}
                              component={DealershipAdminUpdate}
                              layout={UserLayout}/>
                <PrivateRoute path="/dealerships"
                              role={UserHelpers.systemAdministrator}
                              page={'DealershipsListContainer'}
                              component={DealershipsListContainer}
                              layout={UserLayout}/>
                <PrivateRoute path="/departments"
                              role={UserHelpers.systemAdministrator}
                              component={DepartmentsList}
                              layout={UserLayout}/>
                <PrivateRoute path="/communications"
                              role={UserHelpers.systemAdministrator}
                              component={UniversalCommunicationsList}
                              layout={UserLayout}/>

                {/*admin dealership routes*/}
                <PrivateRoute path="/departmentsDealershipAdmin"
                              role={UserHelpers.dealershipAdmin}
                              component={DepartmentsDealershipAdminContainer}
                              layout={UserLayout}/>
                <PrivateRoute path="/calendarDealershipAdmin"
                              role={UserHelpers.dealershipAdmin}
                              component={CalendarDealershipAdminContainer}
                              layout={UserLayout}/>
                <PrivateRoute path="/getReadyFormDealershipAdmin"
                              role={UserHelpers.dealershipAdmin}
                              component={DealershipAdminGetReadyFormContainer}
                              layout={UserLayout}/>


                <Route path="*" component={PageNotFound}/>
            </Switch>
        );
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onResetValidationErrors: onResetValidationErrors
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(Routes));


