import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import ErrorReducer from './ErrorReducer';

export default combineReducers({
    login: LoginReducer,
    error: ErrorReducer
})
