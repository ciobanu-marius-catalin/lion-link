import React from 'react';
import DocumentTitle from 'react-document-title';
import Table from '../shared/Table';
import '../../styles/users/usersList.scss';

import AdminTableContainer from "../../containers/shared/AdminTableContainer";
import { Link } from "react-router-dom";

class UsersList extends React.Component
{

    render()
    {
        return (
            <div>
                <div>
                    <Link className="add-button-container"
                          to={this.props.addButtonPath}>
                        <div className="addUserButton"></div>
                        <p className="addUserButtonText">ADD USER</p>
                    </Link>
                </div>
                <div className="panel panel-orange">
                    <div className="panel-body">
                    <AdminTableContainer title={this.props.title}
                                         getTableStructure={this.props.getTableStructure}
                                         apiPath={this.props.apiPath}
                                         pageName={this.props.pageName}
                                         dealershipId={this.props.dealershipId}
                                         customFilter={this.props.customFilter}
                                         needsDepartmentName={this.props.needsDepartmentName}
                                         useTable={this.props.useTable}
                    />
                    </div>
                </div>
            </div>
        );
    }
}

export default UsersList;
