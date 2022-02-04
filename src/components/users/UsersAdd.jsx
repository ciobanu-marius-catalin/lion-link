import React from 'react';
import UsersFormContainer from "../../containers/users/UsersFormContainer";
import {getQueryString} from '../../utils/URLHelpers'

class UsersAdd extends React.Component
{
    constructor(props) {
        super(props);
        this.handleSubmitRedirect = this.handleSubmitRedirect.bind(this);
        let queryString = getQueryString(props.location.search);
        const dealershipName = queryString.get('dealershipName');

        this.state = {
            title : ()=> {
                return (
                    <span><span className='bold-orange-color'>{dealershipName}</span> {' - ADD USERS'}</span>
                )
            },
            titleString: dealershipName + ' - ADD USER'
        }
    }


    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }

    getQueryString(){
        let queryString = getQueryString(this.props.location.search);
        return queryString;

    }
    handleSubmitRedirect() {
        let queryString = this.getQueryString();
        const dealershipId = queryString.get('dealershipId');
        const dealershipName = queryString.get('dealershipName');
        this.props.history.push('/users?dealershipId=' + dealershipId + '&dealershipName=' + dealershipName);
    }

    render() {
        let queryString = this.getQueryString();
        const dealershipId = queryString.get('dealershipId');
        return(
            <UsersFormContainer title={this.state.titleString}
                                method="post"
                                apiPath= {"/Accounts/"}
                                onSubmitRedirect={this.handleSubmitRedirect}
                                dealershipId = {dealershipId}
            />
        )
    }
}

export default UsersAdd;

