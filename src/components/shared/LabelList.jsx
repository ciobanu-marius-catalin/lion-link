import React from 'react'
import Label from './Label';
import '../../styles/shared/shared.scss';

class LabelList extends React.Component
{
    constructor()
    {
        super();
        this.handleAddLabel = this.handleAddLabel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClickOnContainer = this.handleClickOnContainer.bind(this);
        this.state = {
            addLabel: ''
        }
    }

    handleAddLabel( event )
    {

        if ( event.key === 'Enter' ) {
            event.preventDefault();
            if ( this.state.addLabel.length === 0 ) {
                return;
            }
            this.props.onAddLabel(this.state.addLabel);
            let newState = Object.assign({}, this.state.addLabel);
            newState.addLabel = '';
            this.setState(newState);

        }
    }

    handleChange( event )
    {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    //when clicking the container set focus on the input
    handleClickOnContainer()
    {
        let input = this.refs.addLabelInput;
        input.focus();
    }

    renderLabels()
    {
        return this.props.labelList.map(labelContainer => (
            (labelContainer.pendingDelete === undefined ||
                (labelContainer.pendingDelete !== undefined && labelContainer.pendingDelete === false)) ?
                <Label key={labelContainer.id} label={labelContainer} onDelete={this.props.onDelete} canDelete={true}/>
                : null
        ));
    }

    render()
    {
        let cssClasses = " lion-link-label-container ";
        if ( this.props.disabledComponent ) {
            let disabledDivCss = ' disabled-div ';
            cssClasses += disabledDivCss;
        }
        return (
            <div>
                <p className="label-list-title">{this.props.labelListTitle}</p>
                <div className={cssClasses} onClick={this.handleClickOnContainer}>
                    {this.renderLabels()}
                    <input ref="addLabelInput" id="addLabelsInput" type="text" name="addLabel"
                           value={this.state.addLabel}
                           onKeyPress={this.handleAddLabel} onChange={this.handleChange}/>
                </div>
            </div>
        )
    }
}

export default LabelList;
