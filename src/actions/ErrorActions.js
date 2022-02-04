import * as ActionTypes from "./ActionTypes";

export const onAddCriticalError = ( error ) => {
    console.log('onAddError');
    return {
        type: ActionTypes.ADD_CRITICAL_ERROR,
        payload: error
    };
};

export const onAddValidationError = (error ) => {
    return {
        type: ActionTypes.ADD_VALIDATION_ERROR,
        payload: error
    };
}

export const onResetCriticalErrors = () => {
    return {
        type: ActionTypes.RESET_CRITICAL_ERRORS
    }
};
export const onResetValidationErrors = () => {
    return {
        type: ActionTypes.RESET_VALIDATION_ERRORS
    }
};
