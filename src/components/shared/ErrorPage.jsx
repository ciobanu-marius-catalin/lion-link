import React from 'react';
import { connect } from "react-redux";
import { onResetCriticalErrors } from "../../actions/ErrorActions";
import { bindActionCreators } from "redux";

class ErrorPage extends React.Component
{
    constructor()
    {
        super();
        this.renderErrors = this.renderErrors.bind(this);
    }

    renderErrors()
    {
        return this.props.criticalErrors.map(error => (
            <p>{error.statusCode + ' ' + error.message}</p>
        ));
    }

    render()
    {
        return (
            <div className="error-page">
                <h1> Errors</h1>
                {this.renderErrors()}
                <button className="btn orange-button round-button"
                    onClick={this.props.onResetCriticalErrors}>OK</button>
            </div>
        )
    }
}

const mapStateToProps = ( state, ownProps ) => {
    let reduxProps = {
        criticalErrors: state.error.criticalErrors
    };
    return reduxProps;
};
const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({
        onResetCriticalErrors: onResetCriticalErrors
    }, dispatch);
};
// const mapDispatchToProps = ( dispatch ) => {
//     return ({
//         onResetErrors: () => (dispatch(onResetErrors))
//     })
// };

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);

