import * as ActionTypes from '../actions/ActionTypes';
import axios from 'axios';
import deepcopy from 'deepcopy';

const ErrorReducer = ( state = {}, action ) => {
    console.log('errorReducer');
    switch ( action.type ) {
        case ActionTypes.ADD_CRITICAL_ERROR: {
            console.log('errorReducer');
            let newState = deepcopy(state);
            newState.criticalErrors.push(action.payload);
            return newState;
        }
        case ActionTypes.RESET_CRITICAL_ERRORS: {
            let newState = deepcopy(state);
            newState.criticalErrors = [];
            return newState;
        }
        case ActionTypes.ADD_VALIDATION_ERROR: {

            let newState = deepcopy(state);

            //append the validation errors in case of multiple request per form.
            newState.validationErrors = Object.assign({}, newState.validationErrors, action.payload);
            return newState;
        }
        case ActionTypes.RESET_VALIDATION_ERRORS: {
            let newState = deepcopy(state);
            newState.validationErrors = {};
            return newState;
        }
        default:
            return state;
    }
}

export default ErrorReducer;
