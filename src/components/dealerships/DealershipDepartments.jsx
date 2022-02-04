import React from 'react';
import DealershipDepartmentsElementContainer from "../../containers/dealerships/DealershipDepartmentsElementContainer";
import deepcopy from 'deepcopy';

class DealershipDepartments extends React.Component
{
    constructor()
    {
        super();

        this.createElements = this.createElements.bind(this);
        this.getDealershipDepartment = this.getDealershipDepartment.bind(this);

    }

    createFilter( departmentId, dealershipId )
    {
        return {
            filter: {
                departmentId: departmentId,
                dealershipId: dealershipId
            }
        }
    }

    createApiPath( basePath, id )
    {
        return basePath + '/' + id;
    }
    getDealershipDepartment(id)
    {
        return this.props.getDealershipDepartmentUsingDepartmentId(id);
    }

    createElements()
    {
        console.log('1');
        let elements = this.props.departments.map(( department, position ) => (
            <DealershipDepartmentsElementContainer key={department.id}
                                                   department={department}
                                                   dealershipDepartment = {this.getDealershipDepartment(department.id)}
                                                   positionInArray={position}
                // apiPath= {this.createApiPath('/DealershipDepartments', department.id)}
                                                   apiPath={this.props.apiPath}
                                                   filter={{}}
                                                   method={this.props.method}
                                                   hasToSyncData={true}
                                                   onSync={this.props.onSync}
                                                   syncData={(this.props.syncData.length > 0) ? this.props.syncData[position] : {}}
                                                   unblockButtons={this.props.unblockButtons}

            />
        ));
        return elements;
    }

    render()
    {
        console.log('1');
        return (
            <div>
                {this.createElements()}
            </div>
        )
    }
}

export default DealershipDepartments;
