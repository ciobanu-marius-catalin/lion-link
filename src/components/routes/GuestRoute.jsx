import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


class GuestRoute extends React.Component
{
    render()
    {
        let Component = this.props.component;
        let Layout = this.props.layout;
        return (
            <Route path={this.props.path} render={props => (

                //check if user is logged in
                (this.props.user === null) ? (
                    <Layout>
                        <Component {...props}/>
                    </Layout>
                ) : (
                    <Redirect to={{
                        pathname: '/',
                        state: {from: props.location}
                    }}/>
                )
            )}/>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};

export default connect(mapStateToProps)(GuestRoute);

