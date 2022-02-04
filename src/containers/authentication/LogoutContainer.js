import React from 'react';
import { onLogout } from '../../actions/LoginActions';
import Logout from '../../components/authentication/Logout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class LogoutContainer extends React.Component
{
    componentWillMount()
    {
        this.props.onLogout();
    }

    render()
    {
        return (
            <Logout/>
        )
    }
}


const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onLogout: onLogout
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(LogoutContainer);
