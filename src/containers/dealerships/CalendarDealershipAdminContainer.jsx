import React from 'react';
import DocumentTitle from 'react-document-title';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import BigCalendarLionLinkContainer from "../shared/BigCalendarLionLinkContainer";

class CalendarDealershipAdminContainer extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            title : 'CALENDAR'
        };
    }

    componentDidMount()
    {
        this.props.setTitle(this.state.title);
    }


    render()
    {
        let title = 'CALENDAR';
        return (
            <DocumentTitle title={title}>
                    <BigCalendarLionLinkContainer title={title}
                                                  dealershipId={this.props.dealershipId}
                    />
            </DocumentTitle>
        )
    }
}

//in privateroute i check if the user has dealership. If the there is no dealership this component won't mount.
const mapStateToProps = state => {
    return {
        dealershipId: state.login.user.userData.dealership.id
    };
};

export default withRouter(connect(mapStateToProps)(CalendarDealershipAdminContainer));
