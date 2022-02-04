import React from 'react';
import LabelList from "../../components/shared/LabelList";
import axios from "axios";
import config from 'config';
import deepcopy from 'deepcopy';
import { bindActionCreators } from "redux";
import { onAddCriticalError } from "../../actions/ErrorActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ErrorParser from "../../utils/ErrorParser";

class LabelListContainer extends React.Component
{
    constructor()
    {
        super();
        this.handleAddLabel = this.handleAddLabel.bind(this);
        this.getElementsFromApi = this.getElementsFromApi.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.deleteNewLabel = this.deleteNewLabel.bind(this);
        this.deleteOldLabel = this.deleteOldLabel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getOldElementsFromParent = this.getOldElementsFromParent.bind(this);
        this.checkLabelForDuplicates = this.checkLabelForDuplicates.bind(this);
        /*
            State structure:
            oldElements: array of {
                id: string,
                name: string,
                isOld: boolean,
                pendingDelete: boolean
            },
            newElements: array of {
                id: string,
                name: string,
                isOld: boolean
            },
            newElementsId: string,
            newElementsSeed: string
         */
        this.state = {
            oldElements: [],
            newElements: [],

            //new elements id will increase by adding the same character to the current id. This way it's a low chance
            //have conflicts with the id in the database, at this moment it's mongo but i could change.
            //If two elements have the same key value the one will be removed, and this is not wanted.
            newElementsId: 'n',
            newElementSeed: 'n'
        };
    }

    shouldComponentUpdate( nextProps, nextState )
    {
        if ( this.props.hasToSyncData ) {
            if ( (JSON.stringify(nextState) !== JSON.stringify(this.state)) ||
                (JSON.stringify(nextProps) !== JSON.stringify(this.props)) ) {

                //synchronization only goes up
                this.props.onSync(nextState);
                return true;
            }
            return false;
        }
        return true;
    }

    componentWillMount()
    {

        if ( this.props.hasToSyncData ) {

            //check if the component has been created before when used in the tabs page. If the oldElements property
            //it is undefined then the state should be copied from the ancestor that syncs this state.
            if ( this.props.syncData.oldElements ) {

                let newState = deepcopy(this.props.syncData);
                this.setState(newState);
            } else {
                // this.props.onSync(this.state);
                if ( this.props.method === 'put' ) {

                    //get Elements from parent
                    if ( this.props.labelListElementsFromParent ) {
                        this.getOldElementsFromParent();
                    } else {
                        this.getElementsFromApi();
                    }
                }
            }
        } else {
            if ( this.props.method === 'put' ) {
                if ( this.props.labelListElementsFromParent ) {
                    this.getOldElementsFromParent();
                } else {
                    this.getElementsFromApi();
                }
            }
        }

    }

    componentDidMount()
    {
        //temporary solution to get initial state fot labelists with no content, because there are not updates on them.
        if ( this.props.hasToSyncData ) {

            setTimeout(() => {
                this.props.onSync(this.state);
                this.props.unblockButtons ? this.props.unblockButtons(): null;
            }, 1000)
        }

    }

    getOldElementsFromParent()
    {
        let newState = deepcopy(this.state);
        let oldElements = [];
        if ( this.props.labelListElements ) {
            oldElements = this.props.labelListElements.map(element => (
                {
                    id: element.id,
                    name: element.name,
                    isOld: true,
                    pendingDelete: false
                }
            ));
        }
        newState.oldElements = oldElements;
        this.setState(newState);
    }

    componentDidUpdate( prevProps, prevState )
    {
        if ( this.props.triggeredSubmit ) {
            this.onSubmit();
        }
    }

    getElementsFromApi()
    {
        axios({
            method: 'get',

            //use the api path provided in the props
            url: config.api + this.props.apiPath
        })
            .then(response => {
                    if ( response.status === 200 ) {
                        let departmentNames = response.data;

                        for ( let i = 0; i < departmentNames.length; i++ ) {
                            departmentNames[i].isOld = true;
                            departmentNames[i].pendingDelete = false;
                        }

                        let newState = deepcopy(this.state);
                        newState.oldElements = departmentNames;
                        this.setState(newState);
                    }
                }
            )
            .catch(error => {
                if ( error.response ) {
                    ErrorParser.parseError(error.response.data, this.props.history, this.props.onAddCriticalError);
                }
            });
    }

    //check if the labels names are unique
    checkLabelForDuplicates( label )
    {
        let isUnique = true;
        this.state.oldElements.forEach( element => {
            if( element.name === label) {
                isUnique = false;
            }
        });
        this.state.newElements.forEach( element => {
            if( element.name === label) {
                isUnique = false;
            }
        });

        return isUnique;
    }


    handleAddLabel( label )
    {
        let newState = deepcopy(this.state);

        //only insert n
        let isUnique = this.checkLabelForDuplicates( label );
        if( !isUnique ) {
            return;
        }
        let newElement = {
            name: label,
            id: newState.newElementsId,
            isOld: false
        };
        newState.newElementsId += newState.newElementSeed;
        newState.newElements.push(newElement);
        this.setState(newState);
    }


    handleDelete( isOld, elementId )
    {
        if ( isOld ) {
            this.deleteOldLabel(elementId);
        } else {
            this.deleteNewLabel(elementId);
        }
    }

    deleteNewLabel( elementId )
    {
        let newState = deepcopy(this.state);
        let newElements = newState.newElements;
        this.deleteElementFromArray(newElements, elementId, false);
        newState.newElements = newElements;
        this.setState(newState);
    }

    deleteOldLabel( elementId )
    {
        let newState = deepcopy(this.state);
        let oldElements = newState.oldElements;
        this.deleteElementFromArray(oldElements, elementId, true);
        newState.oldElements = oldElements;
        this.setState(newState);
    }

    deleteElementFromArray( array, elementId, isOld )
    {
        for ( let i = 0; i < array.length; i++ ) {
            if ( array[i].id === elementId ) {

                //if old element marked it to be deleted at save, if new delete it from array
                if ( isOld ) {
                    array[i].pendingDelete = true;
                } else {
                    array.splice(i, 1);
                }
                break;
            }
        }

    }

    onSubmit()
    {
        this.props.onSubmit(this.state);
    }

    render()
    {
        var mergedArray = this.state.oldElements.concat(this.state.newElements);
        return (
            <LabelList
                labelList={mergedArray}
                onAddLabel={this.handleAddLabel}
                onDelete={this.handleDelete}
                disabledComponent={this.props.disabledComponent}
                labelListTitle = {this.props.labelListTitle}

            />

        );
    }
}

LabelListContainer.defaultProps = {
    hasToSyncData: false
};
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onAddCriticalError: onAddCriticalError
    }, dispatch);
};
export default withRouter(connect(null, mapDispatchToProps)(LabelListContainer));
