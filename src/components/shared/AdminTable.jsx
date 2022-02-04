import React from 'react';
import Table from '../shared/Table';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import '../../styles/shared/adminTable.scss';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import { Link } from 'react-router-dom';

class AdminTable extends React.Component
{
    constructor()
    {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit( event )
    {
        event.preventDefault();
        this.props.onSearchSubmit();
    }

    handleChange( event )
    {
        this.props.onSearchChange(event.target.value);
    }

    render()
    {
        return (

            <div id="admin-table">
                <div>
                    {/*{this.props.shouldRenderSearch ?*/}
                        {/*(<form onSubmit={this.handleSubmit}>*/}
                            {/*<Button type="submit" className="grey-button pull-right">SEARCH</Button>*/}
                            {/*/!*<FormGroup id="dealershipSearch" className="pull-right" validationState ="error">*!/*/}
                            {/*<FormGroup id="dealershipSearch" className="pull-right">*/}
                                {/*<FormControl ref="search" type="text" name="search" onChange={this.handleChange}/>*/}
                                {/*/!*<HelpBlock>Help text with validation state.</HelpBlock>*!/*/}
                            {/*</FormGroup>*/}
                        {/*</form>)*/}
                        {/*: null}*/}

                </div>
                    <div className="admin-table-container">
                        <Table tableData={this.props.tableData}
                               tableStructure={this.props.tableStructure}
                               onPageChange={this.props.onPageChange}
                               pagination={this.props.pagination}
                               useGrid={this.props.useGrid}
                               useTable={this.props.useTable}
                        />
                </div>
            </div>
        );
    }
}

export default AdminTable;
