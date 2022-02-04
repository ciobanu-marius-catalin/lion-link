import React from 'react';
import DepAndComContainer from "../../containers/shared/DepAndComContainer";

class DepartmentsList extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            title : 'DEPARTMENTS'
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
                                apiPath="/Departments"
                                method="put"
                                labelListTitle = 'SET DEFAULT DEPARTMENTS'
            />
        );
    }
}

export default DepartmentsList;
