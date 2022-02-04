import React from 'react';
import AdminTable from '../../components/shared/AdminTable';
import DocumentTitle from 'react-document-title'
import config from 'config';
import axios from 'axios';
import deepcopy from 'deepcopy';
import { Col } from "react-bootstrap";
import AdminGrids from '../../components/shared/AdminGrids';
import ErrorParser from "../../utils/ErrorParser";
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class AdminTableContainer extends React.Component
{
    constructor( props )
    {
        super(props);
        this.getElementsFromApi = this.getElementsFromApi.bind(this);
        this.getElementsCountFromApi = this.getElementsCountFromApi.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.updateTableContent = this.updateTableContent.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        let shouldRenderSearch = (props.pageName === 'dealerships') ? true : false;
        this.state = {
            data: [],
            pagination: {
                count: 0,
                activePage: 1,
                offset: 0,
                elementsPerPage: 12
            },
            searchValue: '',
            searchStarted: false,
            shouldRenderSearch: shouldRenderSearch
        }
    }
    componentDidUpdate()
    {

        //the search mechanism works like this: in the header component a event will be triggered that will call a callback
        //in the layout that will set the shouldSearch to true, when this components updates sees the new props as true,
        //checks if for this search a search has alredy been started by looking at the searchStarted in the prop,
        //if the ccnditions for the search are true mark mark in this component state searchedStarted as false, so on future
        //updates more searches won't be fired, after that call the callback suplied by the layout to change the shouldSearch
        //to false, in the updateTableContent function change the searchStarted to false
        if(this.props.shouldSearch && !this.state.searchStarted) {

            let newState = deepcopy(this.state);
            newState.searchStarted = true;
            this.setState(newState);

            this.props.onSearchFinished();

            this.handleSearchSubmit();
        }
    }

    componentDidMount()
    {

        this.getElementsCountFromApi();
    }

    updateTableContent()
    {

        this.getElementsCountFromApi();
    }

    createWhereFilter( searchValue )
    {
        let tableStructure = this.props.getTableStructure()
        let columnsToFilter = [];
        tableStructure.forEach(function ( element ) {
            if ( element.usedForSearch ) {
                columnsToFilter.push(element.columnName);
            }
        });
        let columnFilters = columnsToFilter.map(function ( element ) {
            return {
                [element]: {
                    like: searchValue,

                    //this option is used for case insensitive search
                    options: 'i'
                }
            }
        });

        let filter = {
            where: {
                or: columnFilters
            }
        };
        return filter;
    }

    getElementsFromApi()
    {
        let searchValue = this.props.searchValue;
        let dataSearch = {};
        let dataPagination;
        let dealershipId;

        //check if the search functionality is needed
        if ( this.state.shouldRenderSearch ) {
            dataSearch = this.createWhereFilter(searchValue);
        }
        let pagination = {
            offset: this.state.pagination.offset,
            limit: this.state.pagination.elementsPerPage
        };
        dataPagination = pagination;
        let mergedData = Object.assign({}, dataPagination, dataSearch);
        mergedData = deepcopy(mergedData);

        if ( this.props.customFilter ) {
            mergedData = Object.assign({}, mergedData, this.props.customFilter);
        }

        let data = {
            filter: mergedData
        };

        //check if the dealershipId is given for the user table, and merge the objects if it is.
        if ( this.props.dealershipId ) {
            dealershipId = {
                id: this.props.dealershipId
            };
            data = Object.assign({}, data, dealershipId);
            data = deepcopy(data);
        }

        axios({
            method: 'get',

            //use the api path provided in the props
            url: config.api + this.props.apiPath,
            params: data
        })
            .then(response => {
                    if ( response.status === 200 ) {
                        let data = response.data;
                        let newState = deepcopy(this.state);
                        newState.data = data;

                        //there is a problem with bootstrap-table, it can't select nested objects so i have to
                        //move the department name in the main object
                        if ( this.props.needsDepartmentName ) {
                            newState.data.forEach(element => {

                                //admins don't have a department so the field is empty
                                if ( element.dealershipDepartment ) {
                                    element.departmentName = element.dealershipDepartment.department.name
                                }
                            })
                        }
                        this.setState(newState);
                    }
                }
            )
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    //After the number of elements is received get the elements
    getElementsCountFromApi()
    {
        let searchValue;
        let dataSearch;
        let data;

        //if this is the user page we will have a dealershipId in props
        if ( this.state.shouldRenderSearch ) {
            searchValue = this.props.searchValue;
            dataSearch = this.createWhereFilter(searchValue);
            data = dataSearch;
        } else {
            if ( this.props.dealershipId ) {
                data = {
                    id: this.props.dealershipId
                }
            } else {
                data = null;
            }
        }
        axios({
            method: 'get',

            //use the api path provided in the props
            url: config.api + this.props.apiPath + '/count',
            params: data
        })
            .then(response => {
                    if ( response.status === 200 ) {
                        let count = response.data.count;
                        let newState = deepcopy(this.state);
                        newState.pagination.count = count;
                        this.setState(newState);
                        this.getElementsFromApi();
                    }
                }
            )
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }


    handlePageChange( pageNumber )
    {
        let newState = deepcopy(this.state);
        newState.pagination.activePage = pageNumber;
        newState.pagination.offset = (newState.pagination.activePage - 1) * newState.pagination.elementsPerPage;
        this.setState(newState);
        this.updateTableContent();
    }

    handleSearchSubmit()
    {
        let newState = deepcopy(this.state);
        newState.searchStarted = false;
        this.setState(newState);
        //go to page 1
        this.handlePageChange(1);
        this.updateTableContent();
    }

    handleSearchChange( newValue )
    {
        let newState = deepcopy(this.state);
        newState.searchValue = newValue;
        this.setState(newState);
    }


    render()
    {
        return (
            <DocumentTitle title={this.props.title}>
                <div>
                        <AdminTable tableData={this.state.data}
                                    tableStructure={this.props.getTableStructure()}
                                    pagination={this.state.pagination}
                                    onPageChange={this.handlePageChange}
                                    onSearchChange={this.handleSearchChange}
                                    onSearchSubmit={this.handleSearchSubmit}
                                    pageTitle={this.props.pageTitle}
                                    shouldRenderSearch={this.state.shouldRenderSearch}
                                    useGrid = {this.props.useGrid}
                                    useTable = {this.props.useTable}
                        />

                </div>
            </DocumentTitle>
        );
    }
}
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(AdminTableContainer));

