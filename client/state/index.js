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

export function receiveJWT(token) {
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
                identifier: action.data.identifier,
                password: action.data.password
            });
        default:
            return state
    }
}

const ADD_MESSAGE = "ADD_MESSAGE";
const DELETE_MESSAGE = "DELETE_MESSAGE";

export function addMessage(type, message, suggestion) {
    return {
        type: ADD_MESSAGE,
        data: {
            type,
            message,
            suggestion
        }
    }
}

export function deleteMessage(messageID) {
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
            return Object.assign({}, state, {messages: state.messages.filter(o => o.id !== action.data.id)});
        default:
            return state
    }
}

const REQUEST_CLUB_DATA = "REQUEST_CLUB_DATA";
const RECEIVE_CLUB_DATA = "GET_CLUBS";
const RECEIVE_CREATE_CLUB = "RECEIVE_CREATE_CLUB";
const RECEIVE_JOIN_CLUB = "RECEIVE_JOIN_CLUB";
const SELECT_CLUB = "SELECT_CLUB";

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
        axios.get(`${backendURL}/api/club/get_all`, {headers: {"Authorization": `Bearer ${getState().auth.jwt}`}})
            .then(response => response.data)
            .then(json => {
                if (json["type"] === "data") {
                    dispatch(receiveClubData(json["data"]))
                } else {
                    dispatch(addMessage(json["type"], json["message"], json["suggestion"]))
                }
            })
            .catch(error => {
                dispatch(addMessage("error", "An unexpected error occurred (yes, we have contingency plans for some errors).", `${error}`))
            })
    }
}


function receiveCreateClub(club) {
    return {
        type: RECEIVE_CREATE_CLUB,
        data: club
    }
}

function receiveJoinClub(club) {
    return {
        type: RECEIVE_JOIN_CLUB,
        data: club
    }
}

export function sendJoinClub(joinCode) {
    return (dispatch, getState) => {
        dispatch(fetchJWTIfNeeded());
        axios.post(`${backendURL}/club/join`, {join_code: joinCode}, {headers: {Authorization: `Bearer ${getState().auth.jwt}`}})
            .then(result => result.data)
            .then(json => {
                if (json["type"] === "success") {
                    dispatch(receiveJoinClub(json["data"]))
                } else {
                    dispatch(addMessage(json["type"], json["message"], json["suggestion"]))
                }
            })
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
                    dispatch(receiveCreateClub(json["data"]))
                }
            })

    }
}

export function selectClub(clubID) {
    return {
        type: SELECT_CLUB,
        data: {
            clubID
        }
    }
}

function clubs(state = {fetching: false, clubs: [], selectedClub: false}, action) {
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
            return state
    }
}

const ADD_TRAINING_SESSION = "ADD_TRAINING_SESSION";
const DELETE_TRAINING_SESSION = "DELETE_TRAINING_SESSION";
const UPDATE_TRAINING_SESSION = "MODIFY_TRAINING_SESSION";
const RECEIVE_CLUB_SESSIONS = "RECEIVE_CLUB_SESSIONS";
const RECEIVE_ALL_SESSIONS = "RECEIVE_ALL_SESSIONS";
const SELECT_CLUB_TRAINING_SESSIONS = "SELECT_CLUB_TRAINING_SESSIONS";

function receiveAddTrainingSession(data) {
    return {
        type: ADD_TRAINING_SESSION,
        data: data
    }
}

function receiveClubSessions(clubID, data) {
    return {
        type: RECEIVE_CLUB_SESSIONS,
        data: {
            clubID,
            trainingSessions: data
        }
    }
}

function receiveAllSessions(data) {
    return {
        type: RECEIVE_ALL_SESSIONS,
        data: data
    }
}

export function addTrainingSession(start, end, livestream, clubID) {
    return (dispatch, getState) => {
        axios.put(`${backendURL}/api/club/training/add`, {
            start_time: start,
            end_time: end,
            livestream: livestream,
            club_id: clubID
        })
            .then(response => response.data)
            .then(json => {
                if (json["type"] === "success+data") {
                    dispatch(receiveAddTrainingSession(json["data"]))
                } else {
                    dispatch(addMessage(json["type"], json["message"], json["suggestion"]))
                }
            })
    }
}

export function fetchClubSessions(clubID) {
    return (dispatch, getState) => {
        axios.post(`${backendURL}/api/club/training/single_club`, {club_id: clubID}, {
            headers: {
                "Authorization": `Bearer ${getState().auth.jwt}`
            }
        })
            .then(response => response.data)
            .then(json => {
                if (json["type"] === "data") {
                    dispatch(receiveClubSessions(clubID, json["data"]))
                } else {
                    dispatch(addMessage(json["type"], json["message"], json["suggestion"]))
                }
            })
            .catch(error => {
                dispatch(addMessage("error", "An unexpected error occurred.", `Message: ${error}`))
            })
    }
}

export function fetchAllSessions() {
    return (dispatch, getState) => {
        axios.get(`${backendURL}/api/club/training/all`, {headers: {Authorization: `Bearer ${getState().auth.jwt}`}})
            .then(result => result.data)
            .then(json => {
                if (json["type"] === "data") {
                    dispatch(receiveAllSessions(json["data"]))
                } else {
                    dispatch(addMessage(json["type"], json["message"], json["suggestion"]))
                }
            })
    }
}

export function selectClubTrainingSessions(clubID) {
    return {
        type: SELECT_CLUB_TRAINING_SESSIONS,
        data: clubID
    }
}


function trainingSessions(state = {
    trainingSessions: [],
    selectedSessions: null
}, action) {
    switch (action.type) {
        case ADD_TRAINING_SESSION:
            return Object.assign({}, state, {trainingSessions: [action.data, ...state.trainingSessions]});
        case DELETE_TRAINING_SESSION:
            return Object.assign({}, state, {trainingSessions: state.trainingSessions.filter(o.id !== action.data.id)});
        case UPDATE_TRAINING_SESSION:
            let dup = [...state.trainingSessions];
            let updateIndex = dup.find(o => o.id === action.data.id);
            dup[updateIndex] = {...dup[updateIndex], ...action.data.update};
            return Object.assign({}, state, {trainingSessions: dup});
        case SELECT_CLUB_TRAINING_SESSIONS:
            return Object.assign({}, state, {selectedSessions: state.trainingSessions.filter(o => o.id !== action.data.clubID)});
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
            return state
    }
}


const SELECT_LIVESTREAM = "SELECTED_LIVESTREAM";
const STOP_LIVESTREAM = "STOP_LIVESTREAM";
const RECEIVE_FRAME = "RECEIVE_FRAME";
const RECEIVE_SAMPLE = "RECEIVE_SAMPLE";
const SEND_FRAME = "SEND_FRAME";
const SEND_SAMPLE = "SEND_SAMPLE";

function selectLivestream(id) {
    return {
        type: SELECT_LIVESTREAM,
        data: {
            id
        }
    }
}

function stopLivestream(id) {
    return {
        type: STOP_LIVESTREAM,
        data: {
            id
        }
    }
}

function receiveFrame(frame) {
    return {
        type: RECEIVE_FRAME,
        data: {
            ...frame
        }
    }
}

function receiveSample(sample) {
    return {
        type: RECEIVE_SAMPLE,
        data: {
            ...sample
        }
    }
}


function livestream(state = {
    selectedLivestream: null,
    frames: [],
    samples: [],
    ownFrame: null,
    selectedUsers: []
}, action) {
    switch (action.type) {
        case SELECT_LIVESTREAM:
            return Object.assign({}, state, {selectedLivestream: action.data.id});
        case STOP_LIVESTREAM:
            return Object.assign({}, state, {selectedLivestream: null});
        case RECEIVE_FRAME:
            return Object.assign({}, state, {frames: [action.data, ...state.frames.filter(o => o.user_id !== action.data.userID)]});
        case RECEIVE_SAMPLE:
            return Object.assign({}, state, {frames: [action.data, ...state.samples.filter(o => o.user_id !== action.data.userID)]});
        case SEND_FRAME:
            return Object.assign({}, state, {ownFrame: action.data.frame});
        case SEND_SAMPLE:
            return state;
        default:
            return state


    }
}

let rootReducer = combineReducers({auth, messages, trainingSessions, clubs, livestream});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configStore(preloadedState) {
    return createStore(rootReducer, preloadedState, composeEnhancer(applyMiddleware(thunkMiddleware)))
}
