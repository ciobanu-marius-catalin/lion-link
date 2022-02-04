import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import logo from './../../images/icons/logo-login.png'
import '../../styles/layouts/login.scss';
import loginArrow from '../../images/icons/login button arrow.png'

class Login extends React.Component
{
    constructor( props )
    {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange( event )
    {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }


    handleSubmit( event )
    {
        event.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        const data = {
            email: email,
            password: password
        };
        this.props.onSubmitData(data);

        let newState = Object.assign({}, this.state);
        newState.password = '';
        this.setState(newState);
    }


    render()
    {

        return (
                <Row>

                    <div id="loginContainer">
                        <Col>
                            <img className="logo-login" src={logo} alt={'logo'}/>
                            {(this.props.loginError !== null) ? (
                                <Alert className="login-alert" bsStyle="danger">
                                    <p>
                                        {this.props.loginError}
                                    </p>
                                </Alert>
                            ) : (
                                null
                            )}
                        </Col>
                        <form onSubmit={this.handleSubmit}
                              className='underline-inputs login-form'
                        >
                            <Col>
                                <FormGroup>
                                    <input ref="email"
                                           className={this.props.formErrors.email ? 'underline-input-error' : ''}
                                           type="text"
                                           name="email"
                                           value={this.state.email}
                                           onChange={this.handleChange}
                                           placeholder='Username'
                                          />

                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <input ref="password"
                                           className={this.props.formErrors.password ? 'underline-input-error' : ''}
                                           type="password"
                                           name="password"
                                           value={this.state.password}
                                           onChange={this.handleChange}
                                           placeholder='Password'
                                          />
                                </FormGroup>
                            </Col>
                            <Col className="text-center">
                                <FormGroup>
                                    <Button type="submit" className="white-button round-button">LOGIN &nbsp;
                                        <img src={loginArrow} className="login-button-arrow"/></Button>
                                </FormGroup>
                            </Col>
                        </form>
                    </div>

            </Row>
        );
    }
}

export default Login
