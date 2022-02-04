class ErrorParser
{
    static parseError( error, history, onAddCriticalError, onAddValidationError, validationContainer )
    {
        //if validation error;
        switch ( error.error.statusCode ) {

            //in case of validation error
            case 422:

                //if the onAddValidationError function is not supplied and a validation error appears show it as critical
                // or show an alert, haven't decided yet.
                // if(! onAddValidationError ) {
                //     onAddCriticalError(error.error);
                //     return;
                // }
                let messages = {};

                //in case of
                if( validationContainer ) {
                    messages[validationContainer] = error.error.details.messages;
                } else {
                    messages = error.error.details.messages;
                }

                onAddValidationError(messages);
                break;
            //in case of authorization required redirect the user to the login page.
            case 401:
                history.push('/logout');
                break;

            //the other errors are handled here, they will be shown in an Error component.
            default:
                onAddCriticalError(error.error)
                break;
        }
    }

}

export default ErrorParser
