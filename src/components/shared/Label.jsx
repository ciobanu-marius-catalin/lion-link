import React from 'react';

class Label extends React.Component
{
    constructor()
    {
        super();
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleDelete()
    {
        this.props.onDelete(this.props.label.isOld, this.props.label.id);
    }

    handleSelect()
    {

        //check if you can select
        if ( !this.props.canSelect ) {
            return;
        }

        this.props.onSelect(this.props.label.id);

    }

    render()
    {
        let canSelectClass = (this.props.canSelect) ? ' selectLabel ' : '';
        let isSelected = (this.props.label.selected) ? ' labelIsSelected ' : '';
        let labelForm = (this.props.bigLabel) ? 'lion-link-big-label': 'lion-link-label';
        labelForm = (this.props.bigLabelDepartment) ? 'lion-link-big-label-departments': labelForm;

        let className = labelForm + canSelectClass + isSelected;

        return (
            <div className={className} onClick={this.handleSelect}>{this.props.label.name}
                {
                    (this.props.canDelete) ? (
                        <span className="label-x" onClick={this.handleDelete}>&#10006;</span>) : null

                }
            </div>
        )
    }
}

Label.defaultProps = {
    canDelete: false,
    canSelect: false
};

export default Label;
