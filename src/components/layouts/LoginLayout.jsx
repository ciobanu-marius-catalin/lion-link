import React from 'react';
import '../../styles/layouts/login.scss';

class LoginLayout extends React.Component
{
    render()
    {
        return (
            <div id="loginWrapper">
                {this.props.children}
            </div>
        );
    }
}

export default LoginLayout;
