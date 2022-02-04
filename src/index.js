import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { Provider } from 'react-redux';
import reducer from './reducers/index'
import { createStore, applyMiddleware, compose } from 'redux';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import './styles/shared/shared.scss';
import thunk from 'redux-thunk';
import config from 'config';




const initialState = {
    login: {
        user: null,
        error: null
    },
    error: {
        criticalErrors: [],
        validationErrors: null
    }
};
const getStore = () => {
    let store = {};
    if(config.appEnv === 'dist') {
        store = createStore(
            reducer,
            initialState
        );
    }
    if(config.appEnv === 'dev') {

        //tool for redux debugging
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        store = createStore(
            reducer,
            initialState,
            composeEnhancers(applyMiddleware(thunk))
        );
    }
    return store;
};
const store = getStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("app")
);
