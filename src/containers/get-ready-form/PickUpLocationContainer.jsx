import React from 'react';
import PickUpLocation from "../../components/get-ready-form/PickUpLocation";
import deepcopy from 'deepcopy';
import { cdkColumns } from './CDK-columns';

class PickUpLocationContainer extends React.Component
{
    constructor( )
    {
        super();
        this.state = {
            tableData: {},
            cdkColumns: [],
            successfullyLoaded: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
    }
    componentWillMount()
    {

        if ( this.props.syncData.successfullyLoaded ) {
            let newState = deepcopy(this.props.syncData);
            this.setState(newState);
        } else {
            this.createCheckBoxConfiguration();
        }
    }
    shouldComponentUpdate( nextProps, nextState )
    {
        if ( this.props.hasToSyncData ) {
            if ( (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
                (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ) {

                //synchronization only goes up
                this.props.onSync('PickUpLocationContainer', nextState);
                return true;
            }
            return false;
        }
        return true;
    }

    getTableStructure()
    {
        return cdkColumns;
    }

    getInitialState()
    {
        return this.props.pickUpLocationContainerInitialState
    }

    handleClick( key )
    {
        console.log('click');
        let name = key;
        let newState = deepcopy(this.state);
        newState.tableData[name] = !newState.tableData[name]
        this.setState( newState );
    }

    createCheckBoxConfiguration( )
    {
        let propertyNames = this.getTableStructure();
        let result = {};
        propertyNames.forEach( propertyName => {
            result[propertyName] = false;
        });

        //after the first configuration we have to get the properties set as true, this information is found in the
        //initial state. At first we get all the properties and mark them as false in the code block above, then
        //we go through the properties that we got from the api and set the the ones in result variable that match
        //their name as true
        let initialState = this.getInitialState();
        for ( let property in initialState ) {
            result[property] = true;
        }
        let newState = deepcopy(this.state);
        newState.tableData = result;
        newState.cdkColumns = propertyNames;
        newState.successfullyLoaded = true;
        this.setState(newState);
    }

    render()
    {
        return(
           <PickUpLocation tableData={this.state.tableData}
                           cdkColumns={this.state.cdkColumns}
                           onClick={this.handleClick}
           />
        )
    }
}

export default PickUpLocationContainer;

