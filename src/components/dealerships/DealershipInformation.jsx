import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import '../../styles/dealerships/dealerships.scss';
import Label from "../shared/Label";
import { connect } from "react-redux";
import { HelpBlock } from "react-bootstrap";


class DealershipInformation extends React.Component
{
    constructor()
    {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange( event )
    {
        const name = event.target.name;
        const value = event.target.value;
        this.props.onChangeDealershipInformation(name, value);

    }

    renderLabels()
    {
        return this.props.communications.map(labelContainer => (
            <Label key={labelContainer.id}
                   label={labelContainer}
                   canDelete={false}
                   canSelect={true}
                   onSelect={this.props.onSelect}
                   bigLabel={true}
            />
        ));
    }

    render()
    {
        return (
            <div className="orange-design-form">
                <Row>
                    <Col lg={6} md={6} sm={12}>
                        <h2 className="section-header">INFORMATION</h2>
                        <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.name ? 'error': null}>
                            <ControlLabel>DEALERSHIP NAME</ControlLabel>
                            <FormControl ref="name"
                                         type="text"
                                         name="name"
                                         value={this.props.form.name}
                                         onChange={this.handleChange}/>
                            <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.name : ''}</HelpBlock>
                        </FormGroup>
                        <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.address ? 'error': null}>
                            <ControlLabel>DEALERSHIP ADDRESS</ControlLabel>
                            <FormControl ref="address"
                                         type="text"
                                         name="address"
                                         value={this.props.form.address}
                                         onChange={this.handleChange}/>
                            <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.address : ''}</HelpBlock>
                        </FormGroup>
                        <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.phoneNumber ? 'error': null}>
                            <ControlLabel>PHONE NUMBER</ControlLabel>
                            <FormControl ref="phoneNumber"
                                         type="text"
                                         name="phoneNumber"
                                         value={this.props.form.phoneNumber}
                                         onChange={this.handleChange}/>
                            <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.phoneNumber : ''}</HelpBlock>
                        </FormGroup>
                        <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.website ? 'error': null}>
                            <ControlLabel>WEBSITE ADDRESS</ControlLabel>
                            <FormControl ref="website"
                                         type="text"
                                         name="website"
                                         value={this.props.form.website}
                                         onChange={this.handleChange}/>
                            <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.website : ''}</HelpBlock>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className='dealership-communication-container'>
                        <h2 className="section-header ">COMMUNICATION TYPES</h2>
                        <div className="dealership-information-labels">
                            {this.renderLabels()}
                        </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = ( state, ownProps ) => {
    let reduxProps = {
        validationErrors: state.error.validationErrors
    };
    let props = Object.assign({}, ownProps, reduxProps);
    return props;
}

export default connect(mapStateToProps, null)(DealershipInformation);

