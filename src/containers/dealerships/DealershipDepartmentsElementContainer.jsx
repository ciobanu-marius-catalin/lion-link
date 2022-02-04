import React from 'react'
import DealershipDepartmentsElement from "../../components/dealerships/DealershipDepartmentsElement";
import deepcopy from 'deepcopy';

class DealershipDepartmentsElementContainer extends React.Component
{
    constructor( props )
    {
        super(props);
        this.state = {
            department: props.department,
            checked: (props.dealershipDepartment ? true : false),
            defaultTasks: {},
        };
        this.handleSync = this.handleSync.bind(this);
        this.handleClickCheckBox = this.handleClickCheckBox.bind(this);
    }

    shouldComponentUpdate( nextProps, nextState )
    {

        if ( this.props.hasToSyncData ) {
            if ( (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
                (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ) {

                //synchronization only goes up
                this.props.onSync(this.props.positionInArray, nextState);
                return true;
            }
            return false;
        }
        return true;
    }

    componentWillMount()
    {

        if ( this.props.hasToSyncData ) {

            //check if the component has been created before when used in the tabs page. If the defaultTasks property
            //it is undefined then the state should be copied from the ancestor that syncs this state.
            if ( this.props.syncData.defaultTasks ) {

                let newState = deepcopy(this.props.syncData);
                this.setState(newState);
            }
        }

    }


    handleSync( childState )
    {

        let newState = deepcopy(this.state);
        let childStateCopy = deepcopy(childState);
        newState.defaultTasks = childStateCopy;
        this.setState(newState);
    }

    handleClickCheckBox()
    {

        let newState = deepcopy(this.state);
        newState.checked = !newState.checked;
        this.setState(newState);
    }


    render()
    {
        return (
            <DealershipDepartmentsElement department={this.props.department}
                                          checked={this.state.checked}
                                          apiPath={this.props.apiPath}
                                          filter={this.props.filter}
                                          method={this.props.method}
                                          onSync={this.handleSync}
                                          syncData={this.state.defaultTasks}
                                          checkedValue={this.state.checked}
                                          onClickCheckBox={this.handleClickCheckBox}
                                          labelListElements={this.props.dealershipDepartment ?
                                              this.props.dealershipDepartment.departmentTasks: []}
                                          unblockButtons={this.props.unblockButtons}
            />
        )
    }
}

DealershipDepartmentsElementContainer.defaultProps = {
    hasToSyncData: false
};
export default DealershipDepartmentsElementContainer;
