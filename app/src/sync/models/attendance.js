import {action, decorate, observable} from "mobx";
import {persist} from "mobx-persist";

class AttendanceEvents {
    events = [];
    populated = false;

    updateEvent(event) {
        let foundEvent = findItem(event, this.events);
        if (foundEvent !== -1) {
            this.events[foundEvent] = event
        } else {
            this.events.push(event)
        }
    }
}

decorate(AttendanceEvents, {
        events: [persist("object"), observable],
        populated: observable,
        updateEvent: action
    }
);

export const attendanceEvents = new AttendanceEvents();
