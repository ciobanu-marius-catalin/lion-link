import React from 'react';
import deepcopy from 'deepcopy';
import DepartmentsDealershipAdmin from "../../components/departments/DepartmentsDealershipAdmin";
import DocumentTitle from 'react-document-title';
import { connect } from "react-redux";
import DealershipDepartmentsHelpers from "../../utils/DealershipDepartmentHelpers";
import { bindActionCreators } from "redux";
import { onAddCriticalError, onAddValidationError, onResetValidationErrors } from "../../actions/ErrorActions";
import { withRouter } from "react-router-dom";

class DepartmentsDealershipAdminContainer extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            DealershipDepartmentsContainer: {},
            currentApiCalls: -1,
            title : 'DEPARTMENTS'
        };
        this.countNumberOfAsyncCalls = this.countNumberOfAsyncCalls.bind(this);
        this.handleSync = this.handleSync.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reduceNumberOfApiCallsCallBack = this.reduceNumberOfApiCallsCallBack.bind(this);
        this.getValidationParameters = this.getValidationParameters.bind(this);

    }

    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }


    componentDidUpdate( oldProps, oldState )
    {
        if ( this.state.currentApiCalls === 0 ) {
            this.onSubmitRedirect();
        }
    }


    onSubmitRedirect()
    {
        this.props.history.push('/');
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


    handleSubmit()
    {
        this.props.onResetValidationErrors();

        let dealershipId = this.props.dealershipId;
        this.countNumberOfAsyncCalls();
        DealershipDepartmentsHelpers.departmentsAsync(dealershipId, 'put', this.state.DealershipDepartmentsContainer,
            this.reduceNumberOfApiCallsCallBack, this.getValidationParameters);
    }

    /////////////COUNT API CALLS
    countNumberOfAsyncCalls()
    {
       let countAsyncCalls = DealershipDepartmentsHelpers.countNumberOfAsyncCalls('put', this.state.DealershipDepartmentsContainer);
       let newState = deepcopy(this.state);
       newState.currentApiCalls = countAsyncCalls;
       this.setState(newState);
    }

    reduceNumberOfApiCallsCallBack()
    {
        let newState = deepcopy(this.state);
        newState.currentApiCalls--;
        this.setState(newState);
    }


    render()
    {
        console.log('1');
        let title = this.state.title
        return (
            <DocumentTitle title={title}>
                <DepartmentsDealershipAdmin
                    title={title}
                    onSync={this.handleSync}
                    syncData={this.state.DealershipDepartmentsContainer}
                    // dealershipId={this.props.dealershipId}
                    dealershipId={this.props.dealershipId}
                    method={'put'}
                    onSubmit={this.handleSubmit}
                />
            </DocumentTitle>
        )
    }
}

//in privateroute i check if the user has dealership. If the there is no dealership this component won't mount.
const mapStateToProps = state => {
    return {
        dealershipId: state.login.user.userData.dealership.id,
    };
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError,
        onAddValidationError: onAddValidationError,
        onResetValidationErrors: onResetValidationErrors
    }, dispatch);
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(DepartmentsDealershipAdminContainer));
