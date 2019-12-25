import {action, decorate, observable} from "mobx";
import {persist} from "mobx-persist";

class Calendar {
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


decorate(Calendar, {
    events: [persist("object"), observable],
    populated: observable,
    updateEvents: action
});

export const calendar = new Calendar();