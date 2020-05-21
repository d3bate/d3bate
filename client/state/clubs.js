import { REQUEST_CLUB_DATA, RECEIVE_CLUB_DATA, RECEIVE_CREATE_CLUB, SELECT_CLUB } from "./index";
function clubs(state = { fetching: false, clubs: [], selectedClub: false }, action) {
    switch (action.type) {
        case REQUEST_CLUB_DATA:
            return Object.assign({}, state, {
                fetching: true
            });
        case RECEIVE_CLUB_DATA:
            return Object.assign({}, state, {
                fetching: false,
                clubs: action.data
            });
        case RECEIVE_CREATE_CLUB:
            return Object.assign({}, state, {
                clubs: [action.data, ...state.clubs]
            });
        case SELECT_CLUB:
            return Object.assign({}, state, {
                selectedClub: state.clubs.find(o => o.id === parseInt(action.data.clubID))
            });
        default:
            return state;
    }
}
