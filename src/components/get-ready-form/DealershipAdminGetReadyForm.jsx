import React from 'react';
import TabContainer from "../shared/TabsWrapper";
import TabsWrapperInput from "../../utils/TabsWrapperInput";
import DocumentsContainer from "../../containers/get-ready-form/DocumentsContainer";
import PickUpLocationContainer from "../../containers/get-ready-form/PickUpLocationContainer";

class DealershipAdminGetReadyForm extends React.Component
{
    getTabs()
    {
        let tab1 = new TabsWrapperInput(
            'PICK UP LOCATION',
            (<PickUpLocationContainer onSync={this.props.onSync}
                                      syncData={this.props.syncData.PickUpLocationContainer}
                                      hasToSyncData={true}
                                      method={this.props.method}
                                      dealershipId={this.props.dealershipId}
                                      pickUpLocationContainerInitialState = {this.props.pickUpLocationContainerInitialState}
            />)
        );
        let tab2 = new TabsWrapperInput(
            'DOCUMENTS',
            (<DocumentsContainer onSync={this.props.onSync}
                                 syncData={this.props.syncData.DocumentsContainer}
                                 hasToSyncData={true}
                                 method={this.props.method}
                                 dealershipId={this.props.dealershipId}
                                 documentContainerInitialState = {this.props.documentContainerInitialState}
            />)
        );
        return [tab1, tab2];
    }

    render()
    {
        let tabs = this.getTabs();
        return (
            <div>
                <form onSubmit={this.props.onSubmit}
                      className="orange-design-form"
                >
                    <TabContainer components={tabs}
                                  method={this.props.method}
                                  onSubmit={this.props.onSubmit}
                                  noDelete={true}
                    />
                </form>

            </div>
        )
    }
}

export default DealershipAdminGetReadyForm;
