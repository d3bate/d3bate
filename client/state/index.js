import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import axios from "axios";
import {backendURL} from "../constants";

const REQUEST_JWT = "REQUEST_JWT";
const RECEIVE_JWT = "RECEIVE_JWT";
const ADD_CREDENTIALS = "ADD_CREDENTIALS";

function jwtNeeded(state) {
    if (!state.auth.jwtLastFetched) {
        return true
    } else return state.auth.jwtLastFetched + 900 < new Date().getSeconds();
}


function requestJWT() {
    return {
        type: REQUEST_JWT
    }
}

function receiveJWT(token) {
    return {
        type: RECEIVE_JWT,
        data: {token}
    }
}

export function fetchJWTIfNeeded() {
    return (dispatch, getState) => {
        if (jwtNeeded(getState())) {
            axios.post(`${backendURL}/auth/login`)
                .then(result => result.json)
                .then(json => {
                    if (json["type"] === "success") {
                        dispatch(receiveJWT(json["data"]["token"]))
                    }
                })
        }
    }
}

export function addCredentials(identifier, password) {
    return {
        type: ADD_CREDENTIALS,
        data: {identifier, password}
    }
}

function auth(state = {
    fetchingCredentials: false,
    jwt: null,
    jwtLastFetched: null,
    identifier: null,
    password: null
}, action) {
    switch (action.type) {
        case REQUEST_JWT:
            return Object.assign({}, state, {
                fetchingCredentials: true
            });
        case RECEIVE_JWT:
            return Object.assign({}, state, {
                jwt: action.data.token,
                jwtLastFetched: new Date().getSeconds()
            });
        case ADD_CREDENTIALS:
            return Object.assign({}, state, {
                identifier: action.data.username,
                password: action.data.password
            });
        default:
            return state
    }
}

const ADD_MESSAGE = "ADD_MESSAGE";
const DELETE_MESSAGE = "DELETE_MESSAGE";

function addMessage(type, message, suggestion) {
    return {
        type: ADD_MESSAGE,
        message: {
            type,
            message,
            suggestion
        }
    }
}

function deleteMessage(messageID) {
    return {
        type: DELETE_MESSAGE,
        data: {
            id: messageID
        }
    }
}

function messages(state = {messages: []}, action) {
    switch (action.type) {
        case ADD_MESSAGE:
            return Object.assign({}, state, {messages: [{id: state.messages.length, ...action.data}, ...state.messages]});
        case DELETE_MESSAGE:
            return Object.assign({}, state, {messages: state.messages.filter(o => o.id !== action.data.id)})
    }
}

const REQUEST_CLUB_DATA = "REQUEST_CLUB_DATA";
const RECEIVE_CLUB_DATA = "GET_CLUBS";
const RECEIVE_CREATE_CLUB = "RECEIVE_CREATE_CLUB";

function requestClubData() {
    return {
        type: REQUEST_CLUB_DATA
    }
}

function receiveClubData(data) {
    return {
        type: RECEIVE_CLUB_DATA,
        data
    }
}

export function fetchClubData() {
    return (dispatch, getState) => {
        dispatch(requestClubData());
        axios.post(`${backendURL}/api/club/get_all`, {headers: {"Authorization": `Bearer ${getState().auth.jwt}`}})
            .then(response => response.data)
            .then(json => {
                if (json["type"] === "data") {
                    dispatch(receiveClubData(json["data"]))
                }
            })
    }
}


function receiveCreateClub(club) {
    return {
        type: RECEIVE_CREATE_CLUB,
        data: club
    }
}

export function createClub(clubName, schoolWebsite) {
    return (dispatch, getState) => {
        axios.post(`${backendURL}/api/club/create`,
            {club_name: clubName, school_website: schoolWebsite},
            {
                headers: {
                    "Authorization": `Bearer ${getState().auth.jwt}`
                }
            })
            .then(response => response.data)
            .then(json => {
                if (json["type"] === "data") {
                    dispatch(receiveClubData(json["data"]))
                }
            })

    }
}

function clubsReducer(state = {fetching: false, clubs: []}, action) {
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
        default:
            return state
    }
}

const RECEIVE_TRAINING_SESSIONS = "RECEIVE_TRAINING_SESSIONS";
const ADD_TRAINING_SESSION = "ADD_TRAINING_SESSION";
const UPDATE_TRAINING_SESSION = "UPDATE_TRAINING_SESSION";
const DELETE_TRAINING_SESSION = "DELETE_TRAINING_SESSION";
const SELECT_TRAINING_SESSIONS = "SELECT_TRAINING_SESSIONS";

function receiveTrainingSessions(sessions, selectedClub) {
    return {
        type: RECEIVE_TRAINING_SESSIONS,
        data: {sessions, selectedClub}
    }
}

function addTrainingSession(sess) {
    return {
        type: ADD_TRAINING_SESSION,
        data: sess
    }
}

function updateTrainingSession(id, update) {
    return {
        type: UPDATE_TRAINING_SESSION,
        data: {
            id, update
        }
    }
}

function deleteTrainingSession(id) {
    return {
        type: DELETE_TRAINING_SESSION,
        data: {
            id
        }
    }
}

export function selectTrainingSessions(clubID) {
    return {
        type: SELECT_TRAINING_SESSIONS,
        data: {
            id: clubID
        }
    }
}

function trainingSessions(selectedClub: null, fetching: false, adding: true, updating: false, state = {
    trainingSessions: [],
    selectedSession: null
}, action) {
    switch (action.type) {
        case ADD_TRAINING_SESSION:
            return Object.assign({}, state, {
                adding: false,
                trainingSessions: [action.data, ...state.trainingSessions]
            });
        case UPDATE_TRAINING_SESSION:
            let sessionItem = state.trainingSessions.findIndex(o => o.id === action.data.id);
            let clonedList = [...state.trainingSessions];
            clonedList[sessionItem] = {...action.data.update, ...clonedList[sessionItem]};
            return Object.assign({}, state, {
                updating: false,
                trainingSessions: clonedList
            });
        case DELETE_TRAINING_SESSION:
            return Object.assign({}, state, {
                trainingSessions: state.trainingSessions.filter(o => o.id !== action.data.id)
            });
        case SELECT_TRAINING_SESSIONS:
            return Object.assign({}, state, {
                selectedClub: state.trainingSessions.filter(o => o["club_id"] === action.data.id)
            });
        default:
            return state
    }
}

let rootReducer = combineReducers({auth, messages, trainingSessions});

export function configStore(preloadedState) {
    return createStore(rootReducer, preloadedState, applyMiddleware(thunkMiddleware))
}
