import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Pagination from 'react-js-pagination';
import AdminGrids from "./AdminGrids";


class Table extends React.Component
{

    render()
    {
        return (
            <div>
                {(this.props.useTable) ? (
                <BootstrapTable data={this.props.tableData}
                                //col-hidden is a class used to hide the table headers
                                tableHeaderClass={"col-hidden"}
                >
                    {this.props.tableStructure.map(( columnStructure, index ) =>

                        <TableHeaderColumn
                            isKey={columnStructure.isKey}
                            width= {columnStructure.width}
                            key={index}
                            dataAlign={columnStructure.align}
                            dataField={columnStructure.columnName}
                            dataSort={columnStructure.sort}
                            dataFormat={columnStructure.renderFunction}
                            hidden={columnStructure.isHidden}>{columnStructure.label}</TableHeaderColumn>
                    )}
                </BootstrapTable>
                ) : null }
                {(this.props.useGrid) ? (
                    <AdminGrids data={this.props.tableData}/>
                ) : null}
                <Pagination
                    hideNavigation = {this.props.pagination.elementsPerPage >= this.props.pagination.count}
                    activePage={this.props.pagination.activePage}
                    itemsCountPerPage={this.props.pagination.elementsPerPage}
                    totalItemsCount={this.props.pagination.count}
                    onChange={this.props.onPageChange}
                />
                <div className="after-pagination-clear"></div>
            </div>
        );
    }
}

export default Table;
