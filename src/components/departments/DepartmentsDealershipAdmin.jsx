import React from 'react';
import TabContainer from '../shared/TabsWrapper';
import TabsWrapperInput from "../../utils/TabsWrapperInput";
import DealershipDepartmentsContainer from '../../containers/dealerships/DealershipDepartmentsContainer';
import deepcopy from 'deepcopy';

class DepartmentsDealershipAdmin extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            blockButtons : true
        }
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
            'SELECT DEPARTMENTS FOR YOUR DEALERSHIP',
            (<DealershipDepartmentsContainer onSync={this.props.onSync}
                                             syncData={this.props.syncData}
                                             hasToSyncData={true}
                                             method={this.props.method}
                    // dealershipId={this.props.dealershipId}
                                             dealershipId={this.props.dealershipId}
                                             isDealershipAdmin={true}
                                             unblockButtons={this.unblockButtons}

                />
            )
        );
        return [tab1];
    }

    handleDefaultSubmit( event )
    {
        event.preventDefault();
    }

    render()
    {
        console.log('1');
        let tabs = this.getTabs();
        return (
            <div>
                <form onSubmit={this.handleDefaultSubmit}>
                    <TabContainer components={tabs}
                                  onSubmit={this.props.onSubmit}
                                  blockButtons={this.state.blockButtons}
                    />
                </form>
            </div>
        );
    }
}

export default DepartmentsDealershipAdmin;
