import React from 'react';
import Header from "../shared/Header";
import { Alert, Col, Grid } from "react-bootstrap";
import '../../styles/layouts/user.scss';
import deepcopy from 'deepcopy';
import { connect } from "react-redux";
import ErrorPage from "../shared/ErrorPage";
import { bindActionCreators } from "redux";
import { onResetValidationErrors } from "../../actions/ErrorActions";
import MixedHelpers from "../../utils/MixedHelpers";


class UserLayout extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            title: null,
            DealershipsListContainer: {
                searchValue: '',
                shouldSearch: false,
            }
        };
        this.setTitle = this.setTitle.bind(this);
        this.getChildren = this.getChildren.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchFinished = this.handleSearchFinished.bind(this);
        this.showValidationErrorHasOccured = this.showValidationErrorHasOccured.bind(this);
    }

    handleChange( event, page )
    {
        console.log('searchChange');
        const name = event.target.name;
        const value = event.target.value;
        let newState = deepcopy(this.state);
        newState[page][name] = value;
        this.setState(newState);
    }

    setTitle( title )
    {
        let newState = deepcopy(this.state);
        newState.title = title;
        this.setState(newState);
    }

    handleSearch( event )
    {
        event.preventDefault();
        console.log('shouldSearch');
        let newState = deepcopy(this.state);
        newState.DealershipsListContainer.shouldSearch = true;
        this.setState(newState);
    }

    handleSearchFinished()
    {
        let newState = deepcopy(this.state);
        newState.DealershipsListContainer.shouldSearch = false;
        this.setState(newState);
    }

    //add the setTitle prop to all the children of this component. The application was designed with only child in the
    //layout, but this method supports multiple children.
    getChildren()
    {
        let page = this.props.page;
        const childrenWIthProps = React.Children.map(this.props.children,
            ( child ) => {

                //props for all pages
                let props = {
                    setTitle: this.setTitle
                };

                //extra props for DealershipsListContainer page
                if ( page === 'DealershipsListContainer' ) {
                    let searchProps = {
                        searchValue: this.state.DealershipsListContainer.searchValue,
                        shouldSearch: this.state.DealershipsListContainer.shouldSearch,
                        onSearchFinished: this.handleSearchFinished
                    };
                    props = Object.assign({}, props, searchProps);
                }
                return React.cloneElement(child, props)
            });
        return childrenWIthProps;
    }

    arrayNotEmpty( array )
    {
        if ( array.length > 0 ) return true;
        return false;
    }

    showValidationErrorHasOccured()
    {
        return (this.props.validationErrors && !MixedHelpers.objectIsEmpty(this.props.validationErrors))
            ? <Alert bsStyle="danger">Operation ended with failure</Alert> : null
    }

    showChildrenWithErrors()
    {
        return (<div>
            {this.showValidationErrorHasOccured()}
            {this.getChildren()}
        </div>);
    }

    render()
    {
        let page = this.props.page;
        return (
            <div id='user-layout-wrapper'>
                <Grid fluid>
                    <Header page={page}
                            searchValue={this.state.DealershipsListContainer.searchValue}
                            onChange={this.handleChange}
                            onSearch={this.handleSearch}
                    />
                    <row>
                        <Col xs={1}>
                            <div className="page-title-container">
                                <h1 className="page-title">{(typeof this.state.title === 'function') ? this.state.title() : this.state.title}</h1>
                            </div>
                        </Col>
                        <Col xs={10}>
                            {(this.arrayNotEmpty(this.props.criticalErrors)) ? <ErrorPage/>
                                : this.showChildrenWithErrors()
                            }
                            {/*{this.getChildren()}*/}
                        </Col>
                    </row>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = ( state, ownProps ) => {
    let reduxProps = {
        criticalErrors: state.error.criticalErrors,
        validationErrors: state.error.validationErrors
    };
    let props = Object.assign({}, ownProps, reduxProps);
    return props;
};
export default connect(mapStateToProps)(UserLayout);
