import React from 'react';
import TabContainer from "../shared/TabsWrapper";
import DealershipDepartmentsContainer from '../../containers/dealerships/DealershipDepartmentsContainer';
import DealershipDmsSetup from './DealershipDmsSetup';
import TabsWrapperInput from '../../utils/TabsWrapperInput';
import DealershipInformationContainer from "../../containers/dealerships/DealershipInformationContainer";
import DealershipDmsSetupContainer from "../../containers/dealerships/DealershipDmsSetupContainer";
import { Modal } from "react-bootstrap";
import deepcopy from 'deepcopy';

class DealershipAdminForm extends React.Component
{
    constructor()
    {
        super();

        this.state = {
            showModal: false,

            //blocking buttons on department task tab as a quick fix of a bug, will be removed.
            blockButtons : true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.unblockButtons = this.unblockButtons.bind(this);
    }
    unblockButtons()
    {
        let newState = deepcopy(this.state);
        newState.blockButtons = false;
        this.setState(newState);
    }

    getTabs()
    {
        let tab1 = new TabsWrapperInput(
            'DEALERSHIP INFORMATION',
            (<DealershipInformationContainer onSync={this.props.onSync}
                                             syncData={this.props.syncData.DealershipInformationContainer}
                                             hasToSyncData={true}
                                             method={this.props.method}
                                             dealershipId={this.props.dealershipId}

            />)
        );
        let tab2 = new TabsWrapperInput(
            'DEPARTMENT TASKS',
            (<DealershipDepartmentsContainer onSync={this.props.onSync}
                                             syncData={this.props.syncData.DealershipDepartmentsContainer}
                                             hasToSyncData={true}
                                             method={this.props.method}
                                             dealershipId={this.props.dealershipId}
                                             unblockButtons={this.unblockButtons}
            />)
        );
        let tab3 = new TabsWrapperInput(
            'DMS SETUP',
            (<DealershipDmsSetupContainer onSync={this.props.onSync}
                                          syncData={this.props.syncData.DealershipDmsSetupContainer}
                                          hasToSyncData={true}
                                          method={this.props.method}
                                          dealershipId={this.props.dealershipId}

            />)
        );
        return [tab1, tab2, tab3];
    }

    handleSubmit( event )
    {
        event.preventDefault();
        this.props.onSubmit();
    }

    handleDelete( event )
    {

        event.preventDefault();
        this.props.onDelete();
    }


    render()
    {
        let tabs = this.getTabs();
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <TabContainer components={tabs}
                                  method={this.props.method}
                                  onSubmit={this.handleSubmit}
                                  onDelete={this.handleDelete}
                                  blockButtons={this.state.blockButtons}
                                  page="DealershipAdminForm"
                                  initialTab={this.props.initialTab}
                    />
                </form>

            </div>
        )
    }
}

export default DealershipAdminForm;
