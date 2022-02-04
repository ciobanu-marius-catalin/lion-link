import React from 'react';
import LabelListContainer from "../../containers/shared/LabelListContainer";

class Documents extends React.Component
{
    render()
    {
        return (
            <LabelListContainer onSync={this.props.onSync}
                                hasToSyncData={this.props.labelListElementsFromParent}
                                syncData={this.props.syncData}
                                method={this.props.method}
                                labelListElementsFromParent={this.props.labelListElementsFromParent}
                                labelListElements={this.props.labelListElements}
                                labelListTitle= {this.props.labelListTitle}

            />
        )
    }
}

export default Documents;
