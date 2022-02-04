import React from 'react';
import Routes from './routes/Routes';
import Header from './shared/Header';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import { connect } from 'react-redux';
import { loadToken } from '../actions/LoginActions';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";


class App extends React.Component
{
    componentWillMount()
    {
        this.props.loadToken();
    }
    render()
    {
        console.log('123');
        return (
            <div>
                <Routes/>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    let reduxProps = {
        user: state.login.user
    };
    return reduxProps;
};

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        loadToken: loadToken
    }, dispatch);
};

//with route is needed to pass the location as a prop so when the location is changed the app will rerender.
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));


