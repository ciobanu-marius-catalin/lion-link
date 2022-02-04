import React from 'react';
import AdminTableContainer from '../shared/AdminTableContainer';
import { Link } from 'react-router-dom'
import { getQueryString } from "../../utils/URLHelpers";
import UserHelpers from '../../utils/UserHelpers';
import UsersList from "../../components/users/UsersList";
import departamentIcon from '../../images/icons/deptyellow.png';
import userTypeIcon from '../../images/icons/user type.png';
import emailIcon from '../../images/icons/Gmail_100px.png';


class UsersListContainer extends React.Component
{

    constructor( props )
    {
        super(props);
        this.getTableStructure = this.getTableStructure.bind(this);
        this.renderEdit = this.renderEdit.bind(this);

        let queryString = getQueryString(props.location.search);
        const dealershipName = queryString.get('dealershipName');

        this.state = {
            title : ()=> {
                return (
                    <span><span className='bold-orange-color'>{dealershipName}</span> {' - USERS'}</span>
                )
            },
            titleString: dealershipName + ' - USER'
        }
    }

    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }

    renderEdit( cell, row )
    {
        let queryString = getQueryString(this.props.location.search);
        const dealershipId = queryString.get('dealershipId');
        const dealershipName = queryString.get('dealershipName');
        let pathEdit = '/user/edit?userId=' + row.id + '&dealershipId=' + dealershipId + '&dealershipName=' + dealershipName;
        return (
            <Link className="btn round-button user-list-edit-button pull-right" to={pathEdit}>EDIT</Link>
        )
    }

    renderIsManager( cell, row )
    {
        if ( row._dealershipUser && row._dealershipUser.isManager === true ) {
            return <span className="manager-color"><b>MANAGER</b></span>;
        } else {
            return '';
        }
    }

    renderIsUserType( cell, row )
    {
        return (
            <div>
                <img src={userTypeIcon} alt="user type"/>&nbsp;&nbsp;{UserHelpers.getUserType(row)}
            </div>);
    }

    renderName( cell, row )
    {
        let name = row.firstName + ' ' + row.lastName;
        return <b>{name}</b>
    }

    renderDepartament( cell, row )
    {
        return (
            <div>
                <img src={departamentIcon} alt="department"/> {row.departmentName}
            </div>
        )
    }
    renderEmail( cell, row )
    {
       return (<div>
            <img src={emailIcon} alt="email"/>&nbsp;&nbsp;{row.email}
        </div>);
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
                label: 'NAME',
                renderFunction: this.renderName,
                align: 'left',
                width: '150'
            },
            {
                columnName: 'id',
                type: 'text',
                label: 'ID',
                isHidden: true,
                isKey: true,
                align: 'left',
                width: '150'
            },
            {
                columnName: 'departmentName',
                label: 'DEPARTMENT',
                type: 'text',
                renderFunction: this.renderDepartament,
                align: 'left',
                width: '150'
            },
            {
                columnName: 'accountType',
                type: 'text',
                label: 'USER TYPE',
                renderFunction: this.renderIsUserType,
                align: 'left',
                width: '150'
            },
            {
                columnName: 'email',
                type: 'text',
                label: 'EMAIL ADDRESS',
                renderFunction: this.renderEmail,
                align: 'left',
                width: '150'
            },
            {
                type: 'text',
                label: 'IS MANAGER',
                renderFunction: this.renderIsManager,
                align: 'center',
                width: '120'
            },
            {
                type: 'button',
                renderFunction: this.renderEdit,
                align: 'left',
                width: '120'
            }

        ];
    }

    render()
    {
        let queryString = getQueryString(this.props.location.search);
        const dealershipId = queryString.get('dealershipId');
        const dealershipName = queryString.get('dealershipName');
        let apiPath = '/Dealerships/' + dealershipId + '/accounts';
        let addButtonPath = '/user/add?dealershipId=' + dealershipId + '&dealershipName=' + dealershipName;
        let customFilter = {
            include: {
                dealershipDepartment: 'department'
            }
        };
        return (
            <UsersList title={this.state.titleString}
                       getTableStructure={this.getTableStructure}
                       apiPath={apiPath}
                       pageName="users"
                       dealershipId={dealershipId}
                       addButtonText="ADD USER"
                       addButtonPath={addButtonPath}
                       customFilter={customFilter}
                       needsDepartmentName={true}
                       useTable={true}
            />
        );
    }
}

export default UsersListContainer;
