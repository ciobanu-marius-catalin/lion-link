import React from 'react';
import { Col, ControlLabel, Row } from "react-bootstrap";
import CheckBox from 'react-bootstrap/lib/Checkbox';
import '../../styles/get-ready-form/pickUpLocations.scss';

class PickUpLocation extends React.Component
{
    constructor()
    {
        super();
        this.renderCheckBoxes = this.renderCheckBoxes.bind(this);
    }

    renderCheckBoxes()
    {

        let keys = this.props.cdkColumns;
        return keys.map(key => (
            <div key={key}>
                <ControlLabel onClick={( event ) => this.props.onClick(key)}>{key}&nbsp;</ControlLabel>
                <CheckBox className="pull-right"
                          inline
                          name={key}
                          onChange={( event ) => this.props.onClick(key)}
                          checked={this.props.tableData[key]}
                >&nbsp;</CheckBox>
            </div>
        ));
    }

    render()
    {
        return (
            <Row>
                <Col lg={6} xs={12}>
                    <div className="pick-up-location-container">
                        <h2>CHOOSE DETAILS TO BE SHOWN FOR YOUR DEALERSHIP</h2>
                        <div className="panel panel-pick-up-locations">
                            <div className="panel-body">
                                {this.renderCheckBoxes()}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

        )
    }

}

export default PickUpLocation;
