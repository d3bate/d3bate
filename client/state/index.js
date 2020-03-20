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

const GET_CLUBS = "GET_CLUBS";
const ADD_TRAINING_SESSION = "ADD_TRAINING_SESSION";
const UPDATE_TRAINING_SESSION = "UPDATE_TRAINING_SESSION";
const DELETE_TRAINING_SESSION = "DELETE_TRAINING_SESSION";
