import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import TabHeader from '../shared/TabHeader';
import deepcopy from 'deepcopy';
import { Button, Modal } from "react-bootstrap";


class TabsWrapper extends React.Component
{
    constructor( props )
    {
        super(props);
        let initialTab = this.props.initialTab ? this.props.initialTab : 0;
        this.state = {
            tab: initialTab,
            showModal: false
        }
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    handleChangeTab( tabNumber )
    {
        this.setState({tab: tabNumber});
    }

    renderTabHeader( text, i, nrTabs )
    {
        let isActive = this.state.tab == i;
        return (
            <TabHeader key={text} isActive={isActive} nrTabs={nrTabs} text={text}
                       onClick={() => this.handleChangeTab(i)}/>
        );
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

    render()
    {
        let componenetToDisplay = this.props.components[this.state.tab].component;
        let nrTabs = this.props.components.length;
        let headers = [];
        {
            this.props.components.forEach(( element, index ) => {
                headers.push(this.renderTabHeader(element.tabHeader, index, nrTabs));
            })
        }

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        {headers}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="panel panel-orange-withTabs">
                            <div className="panel-body">
                                <div className="bottom-right-elements">
                                    <button className="btn orange-button round-button"
                                            type="button"
                                            onClick={this.props.onSubmit}
                                            disabled={(this.props.page === 'DealershipAdminForm') ?
                                                (this.state.tab === 1 ? this.props.blockButtons : false) : this.props.blockButtons}
                                    >
                                        SAVE
                                    </button>
                                    {
                                        (this.props.method === 'put') && !this.props.noDelete ?
                                            (<button className="btn red-button round-button"
                                                     type="button"
                                                     onClick={this.showModal}
                                                     disabled={(this.props.page === 'DealershipAdminForm') ?
                                                         (this.state.tab === 1 ? this.props.blockButtons : false) : this.props.blockButtons}
                                            >DELETE DEALERSHIP</button>)
                                            : null
                                    }

                                </div>
                                {componenetToDisplay}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>WARNING!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Deleting the dealership will remove all its information, functionality and DMS integration. Are
                        you sure you want to proceed?
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

export default TabsWrapper;
