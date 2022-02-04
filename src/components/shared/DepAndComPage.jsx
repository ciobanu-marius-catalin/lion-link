import React from 'react';
import LabelList from '../shared/LabelList';

import LabelListContainer from "../../containers/shared/LabelListContainer";
import { Col } from "react-bootstrap";

class DepAndComPage extends React.Component
{
    render()
    {
        return (
            <div className="panel panel-orange">
                <div className="panel-body">
                <div className="bottom-right-elements">
                    <button className="btn orange-button round-button pull-right" onClick={this.props.onTriggerSubmit}>SAVE</button>
                </div>
                <div>
                    <LabelListContainer triggeredSubmit={this.props.triggeredSubmit}
                                        onSubmit={this.props.onSubmit}
                                        apiPath={this.props.apiPath}
                                        method="put"
                                        labelListTitle = {this.props.labelListTitle}
                    />

                </div>
                </div>
            </div>
        );
    }
}

export default DepAndComPage;
