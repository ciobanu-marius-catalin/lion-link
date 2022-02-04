import * as ActionTypes from '../actions/ActionTypes';
import axios from 'axios';
import deepcopy from 'deepcopy';

const LoginReducer = ( state = {}, action ) => {
    switch ( action.type ) {
        case ActionTypes.LOGIN_FAIL:
            let errorMessage = null;
            if ( action.payload.statusCode !== undefined && action.payload.statusCode === 401 ) {
                errorMessage = 'Invalid username or password';
            } else {
                if ( action.payload.error !== undefined && action.payload.error.message ) {
                    errorMessage = action.payload.error.message;
                } else {
                    errorMessage = 'An error has occurred';
                }
            }

            var newState = Object.assign({}, state);
            newState.error = errorMessage;
            return newState;

        case ActionTypes.LOGIN_SUCCESS:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            if ( action.payload ) {
                setTokenInAxios(action.payload.access_token)
            }
            return newState;

        case ActionTypes.ON_LOGOUT:
            return {
                user: null,
                error: null
            };
        case ActionTypes.UPDATE_USER:
            newState = deepcopy(state);
            newState.user = action.payload;
            return newState;

        default:
            return state
    }
};

//add the access_token to every request
function setTokenInAxios( access_token )
{
    let access_tok = access_token;
    axios.interceptors.request.use(function ( config ) {
        let access_token = {
            access_token: access_tok
        };
        let newParams;
        newParams = Object.assign({}, access_token, config.params);
        config.params = newParams;
        return config;
    });
}

export default LoginReducer;
