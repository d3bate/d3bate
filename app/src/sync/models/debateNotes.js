import {decorate, observable, action} from "mobx";
import {findItem} from "./finditem";

class DebateNotes {
    debates = [];

    updateDebate(debate) {
        let foundDebate = findItem(debate, this.debates);

        if (foundDebate !== -1) {
            this.debates[foundDebate] = debate
        } else {
            this.debates.push(debate)
        }
    }
}

decorate(DebateNotes, {
    debates: observable,
    updateDebate: action
});

export const debateNotes = new DebateNotes();