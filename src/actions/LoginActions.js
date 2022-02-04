import * as ActionTypes from "./ActionTypes";
import deepcopy from 'deepcopy';

export const onLogin = ( error, data ) => {
    if ( error ) {
        return {
            type: ActionTypes.LOGIN_FAIL,
            payload: error
        };
    } else {
        var user = {
            'access_token': data.id,
            'userData': data.user
        };
        localStorage.setItem('user', JSON.stringify(user));
        return {
            type: ActionTypes.LOGIN_SUCCESS,
            payload: user
        };
    }
};

export const onGetDealershipOfUser = (( oldUser, newUserData ) => {
    let user = deepcopy(oldUser);
    user.userData = deepcopy(newUserData);
    localStorage.setItem('user', JSON.stringify(user));
    return {
        type: ActionTypes.UPDATE_USER,
        payload: user
    };
});

export const onLogout = () => {
    localStorage.removeItem('user');
    return {
        type: ActionTypes.ON_LOGOUT,
        payload: null
    };
};

export const loadToken = () => {
    var user = JSON.parse(localStorage.getItem('user'));

    return {
        type: ActionTypes.LOGIN_SUCCESS,
        payload: user

    };
};

