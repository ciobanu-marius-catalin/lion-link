import React from 'react';
import DepAndComContainer from "../../containers/shared/DepAndComContainer";

class UniversalCommunicationsList extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            title : 'UNIVERSAL COMMUNICATIONS'
        }
    }
    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }
    render()
    {
        return (
            <DepAndComContainer title={this.state.title}
                                apiPath="/UniversalCommunications"
                                method='put'
                                labelListTitle = 'SET DEFAULT COMMUNICATIONS'
            />
        );
    }

}

export default UniversalCommunicationsList;
