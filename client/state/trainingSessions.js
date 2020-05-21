import { ADD_TRAINING_SESSION, DELETE_TRAINING_SESSION, UPDATE_TRAINING_SESSION, SELECT_CLUB_TRAINING_SESSIONS, RECEIVE_CLUB_SESSIONS, RECEIVE_ALL_SESSIONS } from "./index";
export function trainingSessions(state = {
    trainingSessions: [],
    selectedSessions: null
}, action) {
    switch (action.type) {
        case ADD_TRAINING_SESSION:
            return Object.assign({}, state, { trainingSessions: [action.data, ...state.trainingSessions] });
        case DELETE_TRAINING_SESSION:
            return Object.assign({}, state, { trainingSessions: state.trainingSessions.filter(o.id !== action.data.id) });
        case UPDATE_TRAINING_SESSION:
            let dup = [...state.trainingSessions];
            let updateIndex = dup.find(o => o.id === action.data.id);
            dup[updateIndex] = { ...dup[updateIndex], ...action.data.update };
            return Object.assign({}, state, { trainingSessions: dup });
        case SELECT_CLUB_TRAINING_SESSIONS:
            return Object.assign({}, state, { selectedSessions: state.trainingSessions.filter(o => o.id === parseInt(action.data.clubID)) });
        case RECEIVE_CLUB_SESSIONS:
            return Object.assign({}, state, {
                trainingSessions: [...action.data.trainingSessions,
                ...state.trainingSessions.filter(o => o.clubID !== action.data.clubID)]
            });
        case RECEIVE_ALL_SESSIONS:
            return Object.assign({}, state, {
                trainingSessions: action.data
            });
        default:
            return state;
    }
}
