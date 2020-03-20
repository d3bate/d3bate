const ADD_MESSAGE = "ADD_MESSAGE";
const DELETE_MESSAGE = "DELETE_MESSAGE";

function messagesReducer(state = {messages: []}, action) {
    switch (action.type) {
        case ADD_MESSAGE:
            return Object.assign(state, {}, {messages: [{id: state.messages.length, ...action.data}, ...state.messages]});
        case DELETE_MESSAGE:
            return Object.assign(state, {}, {messages: state.messages.filter(o => o.id !== action.data.id)})
    }
}

const REQUEST_CLUB_DATA = "REQUEST_CLUB_DATA";
const RECEIVE_CLUB_DATA = "GET_CLUBS";

function clubsReducer(state = {fetching: false, clubs: []}, action) {
    switch (action.type) {
        case REQUEST_CLUB_DATA:
            return Object.assign(state, {}, {
                fetching: true
            });
        case RECEIVE_CLUB_DATA:
            return Object.assign(state, {}, {
                fetching: false,
                clubs: action.data
            })
    }
}

const ADD_TRAINING_SESSION = "ADD_TRAINING_SESSION";
const UPDATE_TRAINING_SESSION = "UPDATE_TRAINING_SESSION";
const DELETE_TRAINING_SESSION = "DELETE_TRAINING_SESSION";

function trainingSessionReducer(fetching: false, adding: true, updating: false, state = {trainingSessions: []}, action) {
    switch (action.type) {
        case ADD_TRAINING_SESSION:
            return Object.assign(state, {}, {
                adding: false,
                trainingSessions: [action.data, ...state.trainingSessions]
            });
        case UPDATE_TRAINING_SESSION:
            let sessionItem = state.trainingSessions.findIndex(o => o.id === action.data.id);
            let clonedList = [...state.trainingSessions];
            clonedList[sessionItem] = {...action.data.update, ...clonedList[sessionItem]};
            return Object.assign(state, {}, {
                updating: false,
                trainingSessions: clonedList
            });
        case DELETE_TRAINING_SESSION:
            return Object.assign(state, {}, {
                trainingSessions: state.trainingSessions.filter(o => o.id !== action.data.id)
            })
    }
}
