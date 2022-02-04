import React from 'react';

/*
 *This verion of tabheader only supports a number of tabs that divides with 12(1,2,3,4,6,12)
 */
class TabHeader extends React.Component
{
    render()
    {
        //in case of only one tab use the orange background, if the number of tabs is bigger than 1 only the active one
        //is white
        let color = (this.props.isActive && this.props.nrTabs > 1) ? ' white-background' : 'orange-background';
        let tabsSize = 12 / this.props.nrTabs;
        let cssClassTabSize = ' col-xs-' + tabsSize + ' ';
        let className = ' tab ' + cssClassTabSize + color + ' matchHeight ';
        return (
            <div className={className} onClick={() => this.props.onClick()} >
                {this.props.text}
            </div>
        );
    }
}

export default TabHeader;
