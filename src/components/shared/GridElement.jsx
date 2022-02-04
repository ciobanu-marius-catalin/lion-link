import React from 'react'
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../styles/shared/gridElement.scss';
import cursorIcon from '../../images/icons/Cursor_100px.png';
import phoneIcon from '../../images/icons/Phone_100px.png';
import markerIcon from '../../images/icons/Marker_100px.png';

class GridElement extends React.Component
{
    constructor()
    {
        super();
        this.renderBodyElements = this.renderBodyElements.bind(this);
        this.renderFooterElements = this.renderFooterElements.bind(this);
    }

    renderBodyElements()
    {
        const data = this.props.data;
        return (
            <div>
                <div className="list-item">
                    <div className="img-wrapper">
                        <img src={cursorIcon}/>
                    </div>
                    {data.website}
                </div>
                <div className="list-item">
                    <div className="img-wrapper">
                        <img src={phoneIcon}/>
                    </div>
                    {data.phoneNumber}
                </div>
                <div className="list-item">
                    <div className="img-wrapper">
                        <img src={markerIcon}/>
                    </div>
                    {data.address}
                </div>
            </div>
        );
    }

    renderDMS( row )
    {
        let pathEdit = '/dealership/edit?dealershipId=' + row.id + '&tab=';
        let link = (<Link className="btn adminButton" to={pathEdit}>INSTALL DMS</Link>)
        return (
            (row._dmsConfig !== undefined ) ?
                (<span className="btn dms-installed">DMS INSTALLED</span>) :
                (link)
        )
    }

    renderEdit( row )
    {
        let pathEdit = '/dealership/edit?dealershipId=' + row.id;
        return (
            <Link className="btn adminButton" to={pathEdit}>EDIT</Link>
        )
    }

    renderUsers( row )
    {
        let pathUsers = '/users?dealershipId=' + row.id + '&dealershipName=' + row.name;
        return (
            <Link className="btn adminButton" to={pathUsers}>USERS</Link>
        )
    }

    renderFooterElements()
    {
        let data = this.props.data;
        return (
            <Row>

                    {this.renderEdit(data)}


                    {this.renderUsers(data)}


                    {this.renderDMS(data)}


            </Row>
        )
    }

    render()
    {
        return (
            <div id="grid-element-wrapper">
                <div className="grid-container">
                    <div className="gird-header">
                        <h2>{this.props.data.name}</h2>
                    </div>
                    <div className="grid-body">
                        {this.renderBodyElements()}
                    </div>
                    <div className="grid-footer">
                        {this.renderFooterElements()}
                    </div>
                </div>
            </div>
        );
    }
}

export default GridElement;
