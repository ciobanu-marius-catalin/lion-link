import React from 'react';
import AdminTableContainer from '../shared/AdminTableContainer';
import { Link } from 'react-router-dom'

class DealershipsListContainer extends React.Component
{

    constructor()
    {
        super();
        this.getTableStructure = this.getTableStructure.bind(this);
        this.state = {
            title : 'DEALERSHIPS'
        }
    }
    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }
    renderDMS( cell, row )
    {
        let pathEdit = '/dealership/edit?dealershipId=' + row.id;
        let link = (<Link className="btn adminButton" to={pathEdit}>INSTALL</Link>)
        return (
            <div>
                {
                    (row._dmsConfig !== undefined ) ?
                        (<p><em>Installed</em></p>) :
                        (link)
                }
            </div>
        )
    }

    renderEdit( cell, row )
    {
        let pathEdit = '/dealership/edit?dealershipId=' + row.id;
        return (
            <Link className="btn adminButton" to={pathEdit}>EDIT</Link>
        )
    }

    renderUsers( cell, row )
    {
        let pathUsers = '/users?dealershipId=' + row.id + '&dealershipName=' + row.name;
        return (
            <Link className="btn adminButton" to={pathUsers}>USERS</Link>
        )
    }

    /*
    The function gives the structure of the table. Gives information to the table and other parts of the page, like
    the search field

    Table structure object looks like this:
    {
        columnName string the name of the column
        type string text or button
        label string the text to be shown in table headers
        isHidden boolean used to hide a column
        isKey boolean specify if the column should be used as key. Must be unique
        usedForSearch boolean specify if the column should be used to filter data on search
    }
    */
    getTableStructure()
    {
        return [
            {
                columnName: 'name',
                type: 'text',
                label: 'DEALERSHIP NAME',
                usedForSearch: true
            },
            {
                columnName: 'id',
                type: 'text',
                label: 'ID',
                isHidden: true,
                isKey: true
            },
            {
                columnName: 'website',
                type: 'text',
                label: 'WEBSITE',
                usedForSearch: true
            },
            {
                columnName: 'phoneNumber',
                type: 'text',
                label: 'PHONE NO',
                usedForSearch: true
            },
            {
                columnName: 'address',
                type: 'text',
                label: 'ADDRESS',
                usedForSearch: true
            },
            {
                columnName: '_dmsConfig',
                type: 'button',
                label: 'DMS',
                renderFunction: this.renderDMS
            },
            {
                type: 'button',
                renderFunction: this.renderUsers
            },
            {
                type: 'button',
                renderFunction: this.renderEdit
            }

        ];
    }

    render()
    {
        let apiPath = '/Dealerships';
        return (
            <div>
                {/*<Link className="add-button-container"*/}
                      {/*to={'/dealership/add'}>*/}
                    {/*<div className="addUserButton"></div>*/}
                {/*</Link>*/}
            <AdminTableContainer title="CAR DEALERSHIPS"
                                 getTableStructure={this.getTableStructure}
                                 apiPath={apiPath} pageName="dealerships"
                                 useGrid={true}
                                 searchValue={this.props.searchValue}
                                 shouldSearch={this.props.shouldSearch}
                                 onSearchFinished={this.props.onSearchFinished}
            />
            </div>
        );
    }
}

export default DealershipsListContainer;
