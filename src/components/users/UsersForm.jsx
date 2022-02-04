import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import '../../styles/shared/react-select.scss';
import deepcopy from 'deepcopy';
import { HelpBlock, Modal } from "react-bootstrap";
import '../../styles/users/userForm.scss';
import { connect } from "react-redux";

class UsersForm extends React.Component
{
    constructor()
    {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            showModal: false
        }
    }

    handleChange( event )
    {
        const name = event.target.name;
        const value = event.target.value;
        this.props.onChangeForm(name, value);
    }

    onSave( event )
    {
        event.preventDefault();
        this.props.onSaveUser();
    }

    onDelete( event )
    {
        event.preventDefault();
        this.props.onDeleteUser();
    }

    closeModal()
    {
        let newState = deepcopy(this.state);
        newState.showModal = false;
        this.setState(newState);
    }

    showModal()
    {
        let newState = deepcopy(this.state);
        newState.showModal = true;
        this.setState(newState);
    }

    handleDefaultSubmit( event )
    {
        event.preventDefault();
    }

    render()
    {
        return (
            <div>
                <form className="orange-design-form user-form" onSubmit={this.handleDefaultSubmit}>
                    <div className="panel panel-orange">
                        <div className="panel-body">
                            <div className="bottom-right-elements">
                                <button className="btn orange-button round-button" onClick={this.onSave}>SAVE</button>
                                {
                                    (this.props.method === 'patch') ?
                                        (<button className="btn red-button round-button" onClick={this.showModal}>
                                            DELETE</button>)
                                        : null
                                }

                            </div>

                            <Row>
                                <Col lg={6} md={6} sm={12}>
                                    <h2 className="section-header">CREDENTIALS</h2>
                                    <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.email ? 'error': ''}>
                                        <ControlLabel>EMAIL ADDRESS</ControlLabel>
                                        <FormControl ref="email" type="text" name="email"
                                                     value={this.props.form.email}
                                                     onChange={this.handleChange}

                                        />
                                        <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.email : ''}</HelpBlock>
                                    </FormGroup>
                                    <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.password ? 'error': ''}>
                                        <ControlLabel>PASSWORD</ControlLabel>
                                        <FormControl ref="password" type="password" name="password"
                                                     value={this.props.form.password} onChange={this.handleChange}/>
                                        <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.password : ''}</HelpBlock>
                                    </FormGroup>
                                    <h2 className="section-header">OTHER INFO</h2>
                                    <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.firstName ? 'error': ''}>
                                        <ControlLabel>FIRST NAME</ControlLabel>
                                        <FormControl ref="firstName" type="text" name="firstName"
                                                     value={this.props.form.firstName}
                                                     onChange={this.handleChange}/>
                                        <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.firstName : ''}</HelpBlock>
                                    </FormGroup>
                                    <FormGroup validationState={this.props.validationErrors && this.props.validationErrors.lastName ? 'error': ''}>
                                        <ControlLabel>LAST NAME</ControlLabel>
                                        <FormControl ref="lastName" type="text" name="lastName"
                                                     value={this.props.form.lastName} onChange={this.handleChange}/>
                                        <HelpBlock>{this.props.validationErrors ? this.props.validationErrors.lastName : ''}</HelpBlock>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>DEPARTMENT</ControlLabel>
                                        <Select
                                            name="departmentId"
                                            options={this.props.departments}
                                            value={this.props.form.dealershipDepartmentId}
                                            onChange={this.props.onSelectDepartment}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>MANAGER</ControlLabel>
                                        <Select disabled={this.props.adminIsSelected}
                                                name="isManager"
                                                options={this.props.isManagerOptions}
                                                value={this.props.form._dealershipUser.isManager}
                                                onChange={this.props.onSelectIsManager}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </form>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>WARNING!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this user?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn white-button  round-button" onClick={this.closeModal}>CANCEL</button>
                        <button className="btn red-button  round-button" onClick={this.onDelete}>PROCEED</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ( state, ownProps ) => {
    let reduxProps = {
        validationErrors: state.error.validationErrors
    };
    return reduxProps;
}

export default connect(mapStateToProps, null)(UsersForm);
