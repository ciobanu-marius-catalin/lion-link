import React from 'react';
import UsersFormContainer from "../../containers/users/UsersFormContainer";
import {getQueryString} from '../../utils/URLHelpers'

class UsersUpdate extends React.Component
{
    constructor(props) {
        super(props);
        this.handleSubmitRedirect = this.handleSubmitRedirect.bind(this);
        let queryString = getQueryString(props.location.search);
        const dealershipName = queryString.get('dealershipName');

        this.state = {
            title : ()=> {
                return (
                    <span><span className='bold-orange-color'>{dealershipName}</span> {' - UPDATE USERS'}</span>
                )
            },
            titleString: dealershipName + ' - UPDATE USER'
        }
    }

    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }
    handleSubmitRedirect() {
        let queryString = getQueryString(this.props.location.search);
        let dealershipId = queryString.get('dealershipId');
        let dealershipName = queryString.get('dealershipName');
        this.props.history.push('/users?dealershipId=' + dealershipId + '&dealershipName=' + dealershipName);
    }

    render() {
        let queryString = getQueryString(this.props.location.search);
        const dealershipId = queryString.get('dealershipId');
        let userId = queryString.get('userId');

        let apiPath = '/Accounts/' + userId;
        return(
            <UsersFormContainer title={this.state.titleString}
                                method="patch"
                                apiPath={apiPath}
                                onSubmitRedirect={this.handleSubmitRedirect}
                                dealershipId = {dealershipId}
            />
        )
    }
}

export default UsersUpdate;
