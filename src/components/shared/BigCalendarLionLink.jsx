import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/shared/calendar.scss';

class BigCalendarLionLink extends React.Component
{

    render()
    {

        BigCalendar.momentLocalizer(moment);
        return (
            <div className="panel panel-orange">
                <div className="panel-body">
                    <div className="calendar-container">
                        <BigCalendar
                            events={this.props.events}
                            startAccessor='startDate'
                            endAccessor='endDate'
                            components={{
                                event: this.props.calendarCustomEvent
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default BigCalendarLionLink;
