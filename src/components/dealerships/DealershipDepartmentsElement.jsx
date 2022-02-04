import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import CheckBox from 'react-bootstrap/lib/Checkbox';
import LabelListContainer from "../../containers/shared/LabelListContainer";
import Col from 'react-bootstrap/lib/Col';
import Label from "../shared/Label";
import { Row } from "react-bootstrap";

class DealershipDepartmentsElement extends React.Component
{
    generateLabel()
    {
        return {
            id: this.props.department.id,
            name: this.props.department.name,
            selected: this.props.checked
        }
    }

    render()
    {
        return (
            <div className="department-element">
                <Row >
                    <Col xs={12} sm={3} md={2}>
                        {/*<CheckBox inline onChange={this.props.onClickCheckBox} checked={this.props.checkedValue} >*/}
                        {/*{this.props.departmentName}*/}
                        {/*</CheckBox>*/}
                        <Label label={this.generateLabel()}
                               canDelete={false}
                               canSelect={true}
                               onSelect={this.props.onClickCheckBox}
                               bigLabelDepartment={true}

                        />
                    </Col>
                    <Col xs={12} sm={9} md={10}>
                        <LabelListContainer apiPath={this.props.apiPath}
                                            onSync={this.props.onSync}
                                            hasToSyncData={true}
                                            method={this.props.method}
                                            syncData={this.props.syncData}
                                            disabledComponent={!this.props.checkedValue}
                                            labelListElementsFromParent={true}
                                            labelListElements={this.props.labelListElements}
                                            labelListTitle='SET DEFAULT TASKS'
                                            unblockButtons={this.props.unblockButtons}
                        />
                    </Col>
                </Row>
            </div>

        );
    }
}

export default DealershipDepartmentsElement;
