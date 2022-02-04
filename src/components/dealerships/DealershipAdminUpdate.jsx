import React from 'react';
import DealershipAdminFormContainer from "../../containers/dealerships/DealershipAdminFormContainer";
import { getQueryString } from '../../utils/URLHelpers'

class DealershipAdminUpdate extends React.Component
{

    constructor()
    {
        super();
        this.handleSubmitRedirect = this.handleSubmitRedirect.bind(this);
        this.state = {
            title : 'EDIT DEALERSHIP'
        }
    }

    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }
    handleSubmitRedirect()
    {
        this.props.history.push('/');
    }


    render()
    {
        const queryString = getQueryString(this.props.location.search);
        const dealershipId = queryString.get('dealershipId');
        let apiPath = '/Dealerships/' + dealershipId;

        return (
            <DealershipAdminFormContainer title={this.state.title}
                                          apiPath={apiPath}
                                          method='put'
                                          dealershipId={dealershipId}
                                          onSubmitRedirect={this.handleSubmitRedirect}
            />
        );
    }
}

export default DealershipAdminUpdate;
