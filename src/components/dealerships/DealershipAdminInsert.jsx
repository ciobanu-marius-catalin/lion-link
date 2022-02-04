import React from 'react';
import DealershipAdminFormContainer from "../../containers/dealerships/DealershipAdminFormContainer";

class DealershipAdminInsert extends React.Component
{
    constructor()
    {
        super();
        this.handleSubmitRedirect = this.handleSubmitRedirect.bind(this);
        this.state = {
            title : 'ADD DEALERSHIP'
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
        return (
            <DealershipAdminFormContainer title={this.state.title}
                                          apiPath="/Dealerships"
                                          method="post"
                                          onSubmitRedirect={this.handleSubmitRedirect}
            />
        );
    }
}

export default DealershipAdminInsert;
