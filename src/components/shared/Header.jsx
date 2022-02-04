import React from 'react'
import Routes from '../routes/Routes';
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../../images/icons/logo-header.png';
import logoutIcon from '../../images/misc-icons/Logout Rounded_100px.png';
import loginIcon from '../../images/misc-icons/Login_100px.png';
import { connect } from 'react-redux';
import { loadToken } from '../../actions/LoginActions';
import { bindActionCreators } from 'redux';
import Navbar from 'react-bootstrap/lib/Navbar';
import Col from 'react-bootstrap/lib/Col';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import axios from 'axios';
import UserHelpers from '../../utils/UserHelpers';
import { Button, Dropdown, FormControl, FormGroup, Glyphicon, MenuItem, Row } from "react-bootstrap";
import searchIcon from '../../images/icons/Search_100pxwhite.png';
import dealershipsIncon from '../../images/icons/dealerships.png';
import dealershipsInconWhite from '../../images/icons/dealershipswhite.png';
import departmentIcon from '../../images/icons/dept.png';
import departmentIconWhite from '../../images/icons/deptwhite.png';
import univCommIcon from '../../images/icons/univ comm.png';
import univCommIconWhite from '../../images/icons/univ commwhite.png';
import menuPlaceholder from '../../images/icons/filter.png';
import { withRouter } from "react-router-dom";

class Header extends React.Component
{
    getDealershipSearch()
    {
        return (
            <Col md={5} sm={6} xs={12}>
            <Nav pullRight={true} className="flex-vertical-center fullSpan">
                <NavItem className="fullSpan">
                    <form onSubmit={this.props.onSearch} className="underline-inputs">
                        <div type="submit" className="pull-right" onClick={this.props.onSearch}><img
                            src={searchIcon}
                            alt="search-icon"/>
                        </div>
                        <FormGroup id="dealershipSearch" className="pull-right">
                            <FormControl ref="search"
                                         type="text"
                                         placeholder="Search dealerships here"
                                         name="searchValue"
                                         className="search-input"
                                         value={this.props.searchValue}
                                         onChange={event => (this.props.onChange(event, this.props.page))}
                            />
                        </FormGroup>
                    </form>
                </NavItem>
                <NavItem>
                    <LinkContainer to={'/dealership/add'}>
                        <NavItem>
                            <div className="addDealershipButton"></div>
                        </NavItem>
                    </LinkContainer>
                </NavItem>
              </Nav></Col>

        )
    }


    render()
    {
        //const isLoggedIn = sessionStorage.getItem('username');
        const isLoggedIn = this.props.user !== null;
        let userType = null;
        if ( this.props.user ) {
            userType = UserHelpers.getUserType(this.props.user.userData);
        }
        const logoutButton = (
            <LinkContainer to="/logout">
                <NavItem>
                    LOGOUT
                </NavItem>
            </LinkContainer>
        );

        let DealershipIconType = dealershipsIncon;
        let DepartmentsIconType = departmentIcon;
        let UnivCommIconType = univCommIcon;
        let dealershipText = '';
        let departmentText = '';
        let univCommText = '';

        if (this.props.location.pathname.includes('dealerships') || this.props.location.pathname.includes('user')) {
            DealershipIconType = dealershipsInconWhite;
            dealershipText = 'makeWhite';
        }

        if (this.props.location.pathname.includes('departments')) {
            DepartmentsIconType = departmentIconWhite;
            departmentText = 'makeWhite';
        }

        if (this.props.location.pathname.includes('communications')) {
            UnivCommIconType = univCommIconWhite;
            univCommText = 'makeWhite';
        }

        const userMenuSysAdmin = (
            <Nav className="pageName">
                <LinkContainer to="/dealerships">
                    <NavItem>
                        <img src={DealershipIconType} alt="dealership-icon" id="dealershipIcon"/>
                        <span className={dealershipText}>Dealerships</span>
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/departments">
                    <NavItem>
                        <img src={DepartmentsIconType} alt="department-icon" id="departmentsIcon"/>
                        <span className={departmentText}>Departments</span>
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/communications">
                    <NavItem>
                        <img src={UnivCommIconType} alt="univComm-icon" id="univCommIcon"/>
                        <span className={univCommText}>Universal Communications</span>
                    </NavItem>
                </LinkContainer>
            </Nav>
        );
        const userMenuDealershipAdmin = (
            <Nav className="pageName">
                <LinkContainer to="/dealershipProfile"><NavItem>Dealership Profile</NavItem></LinkContainer>
                <LinkContainer to="/calendarDealershipAdmin"><NavItem>Calendar</NavItem></LinkContainer>
                <LinkContainer to="/usersDealershipAdmin"><NavItem>Users</NavItem></LinkContainer>
                <LinkContainer to="/departmentsDealershipAdmin"><NavItem>Departments</NavItem></LinkContainer>
                <LinkContainer to="/getReadyFormDealershipAdmin"><NavItem>Get Ready Form</NavItem></LinkContainer>
            </Nav>
        );
        let userInformation = (this.props.user !== null ? (
            <Nav pullRight={true}>
                <NavItem>
                    <div className="menu-user-container">
                        <Row>
                            <Dropdown className="pull-right" id="dropdown-menu">
                                <Dropdown.Toggle>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <LinkContainer to="/logout">
                                        <MenuItem eventKey="1">LOGOUT</MenuItem>
                                    </LinkContainer>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div
                                className="username pull-right">{this.props.user.userData.firstName + ' ' + this.props.user.userData.firstName}</div>
                        </Row>
                        <Row>

                            <div className="user-type">{userType}
                            </div>

                        </Row>
                    </div>
                </NavItem>
            </Nav>
        ) : null)

        let menuToShow = null;
        let homePage = '';
        switch ( userType ) {
            case UserHelpers.systemAdministrator:
                menuToShow = userMenuSysAdmin;
                homePage = '/dealerships';
                break;
            case UserHelpers.dealershipAdmin:
                menuToShow = userMenuDealershipAdmin;
                homePage = '/departmentsDealershipAdmin';
                break;
            default:
                break;
        }


        if ( !isLoggedIn ) {
            return null;
        }
        return (
            <Navbar fluid={true} className="menu">
                <Col xs={10} xsOffset={1}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <LinkContainer to={homePage}>
                                <a href="#">
                                    <img className="logo" src={logo} alt="" width="176" height="201"/>
                                </a>
                            </LinkContainer>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Row className="white-underline">
                        {userInformation}
                    </Row>
                    <Row>
                        <div>
                        <Col md={7} sm={6} xs={12}>
                        {menuToShow}</Col>
                        {(this.props.page === 'DealershipsListContainer') ? this.getDealershipSearch() : null}

                    </div>
                    </Row>

                </Col>
            </Navbar>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        loadToken: loadToken
    }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

