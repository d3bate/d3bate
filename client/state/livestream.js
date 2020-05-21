import { SELECT_LIVESTREAM, STOP_LIVESTREAM, RECEIVE_FRAME, RECEIVE_SAMPLE, SEND_FRAME, SEND_SAMPLE } from "./index";
function livestream(state = {
    selectedLivestream: null,
    frames: [],
    samples: [],
    ownFrame: null,
    selectedUsers: []
}, action) {
    switch (action.type) {
        case SELECT_LIVESTREAM:
            return Object.assign({}, state, { selectedLivestream: action.data.id });
        case STOP_LIVESTREAM:
            return Object.assign({}, state, { selectedLivestream: null });
        case RECEIVE_FRAME:
            return Object.assign({}, state, { frames: [action.data, ...state.frames.filter(o => o.user_id !== action.data.userID)] });
        case RECEIVE_SAMPLE:
            return Object.assign({}, state, { frames: [action.data, ...state.samples.filter(o => o.user_id !== action.data.userID)] });
        case SEND_FRAME:
            return Object.assign({}, state, { ownFrame: action.data.frame });
        case SEND_SAMPLE:
            return state;
        default:
            return state;
    }
}
