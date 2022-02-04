import React from 'react';
import Documents from "../../components/get-ready-form/Documents";
import axios from 'axios';
import config from 'config';
import deepcopy from 'deepcopy';
import ErrorParser from "../../utils/ErrorParser";
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MixedHelpers from "../../utils/MixedHelpers";

class DocumentsContainer extends React.Component
{
    constructor( )
    {
        super();
        this.state = {
            documents: [],
            syncedDataDocuments: {},
            successfullyLoaded: false
        };
        this.getInitialState = this.getInitialState.bind(this);
        this.handleSync = this.handleSync.bind(this);
    }

    componentWillMount()
    {

        if ( this.props.syncData.successfullyLoaded ) {
            let newState = deepcopy(this.props.syncData);
            this.setState(newState);
        } else {
            this.getInitialState();
        }
    }

    shouldComponentUpdate( nextProps, nextState )
    {
        if ( this.props.hasToSyncData ) {
            if ( (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
                (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ) {

                //synchronization only goes up
                this.props.onSync('DocumentsContainer', nextState);
                return true;
            }
            return false;
        }
        return true;
    }

    handleSync( childState )
    {

        let newState = deepcopy(this.state);
        let childStateCopy = childState;
        newState.syncedDataDocuments = childStateCopy;
        this.setState(newState);
    }

    getInitialState()
    {
        let newState = deepcopy(this.state);
        newState.documents = deepcopy(this.props.documentContainerInitialState);
        this.setState(newState);

    }

    render()
    {
        return (
            <Documents onSync={this.handleSync}
                       method={this.props.method}
                       hasToSyncData={this.props.labelListElementsFromParent}
                       syncData={this.state.syncedDataDocuments}
                       labelListElementsFromParent={true}
                       labelListElements={this.state.documents}
                       labelListTitle='SET DEFAULT DOCUMENTS'/>
        )
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(DocumentsContainer));

