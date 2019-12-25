import {action, decorate, observable} from "mobx";
import {persist} from "mobx-persist";

class DebatingClub {
    club = null;

    setClub(club) {
        this.club = club;
    }
}

decorate(DebatingClub, {
    club: [persist("object"), observable],
    setClub: action
});

export const debatingClub = new DebatingClub();
