import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import axios from "axios";
import { backendURL } from "../constants";
import { auth } from "./auth";
import { clubs } from "./clubs";
import { trainingSessions } from "./trainingSessions";
import { livestream } from "./livestream";

export const REQUEST_JWT = "REQUEST_JWT";
export const RECEIVE_JWT = "RECEIVE_JWT";
export const ADD_CREDENTIALS = "ADD_CREDENTIALS";

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
        data: { token }
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
        data: { identifier, password }
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

function messages(state = { messages: [] }, action) {
    switch (action.type) {
        case ADD_MESSAGE:
            return Object.assign({}, state, { messages: [{ id: state.messages.length, ...action.data }, ...state.messages] });
        case DELETE_MESSAGE:
            return Object.assign({}, state, { messages: state.messages.filter(o => o.id !== action.data.id) });
        default:
            return state
    }
}

export const REQUEST_CLUB_DATA = "REQUEST_CLUB_DATA";
export const RECEIVE_CLUB_DATA = "GET_CLUBS";
export const RECEIVE_CREATE_CLUB = "RECEIVE_CREATE_CLUB";
const RECEIVE_JOIN_CLUB = "RECEIVE_JOIN_CLUB";
export const SELECT_CLUB = "SELECT_CLUB";

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

const makeRequest = (requestType, location, data, dispatch, getState) => {
    if (requestType == "post") {
        axios.get(`${backendURL}${location}`, data, { headers: { "Authorization": `Bearer ${getState().auth.jwt}` } })
            .then(response => response.data)
            .then(json => {
                if (json["type"] == "data" || json["type"] == "success+data") {
                    return json["data"];
                }
                else {
                    dispatch(addMessage(json["type"], json["message"], json["suggestion"]))
                }
            })
            .catch(error => {
                dispatch(addMessage("error", "An unexpected error occurred (yes, we have contingency plans for some errors).", `${error}`))
            })
    } else if (requestType == "get") {

    }
}

export function fetchClubData() {
    return (dispatch, getState) => {
        dispatch(requestClubData());
        makeRequest("get", "/api/club/get_all", {}, dispatch, getState).then(data => dispatch(receiveClubData(data)))
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
        makeRequest("post", "/club/join", { join_code: joinCode }, dispatch, getState).then(data => dispatch(receiveJoinClub(data)));
    }
}

export function createClub(clubName, schoolWebsite) {
    return (dispatch, getState) => {
        makeRequest("post", "/api/club/create", { club_name: clubName, school_website: schoolWebsite }, dispatch, getState).then(data => dispatch(receiveCreateClub(data)))
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

export const ADD_TRAINING_SESSION = "ADD_TRAINING_SESSION";
export const DELETE_TRAINING_SESSION = "DELETE_TRAINING_SESSION";
export const UPDATE_TRAINING_SESSION = "MODIFY_TRAINING_SESSION";
export const RECEIVE_CLUB_SESSIONS = "RECEIVE_CLUB_SESSIONS";
export const RECEIVE_ALL_SESSIONS = "RECEIVE_ALL_SESSIONS";
export const SELECT_CLUB_TRAINING_SESSIONS = "SELECT_CLUB_TRAINING_SESSIONS";

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
        makeRequest("post", "/api/club/training/add", { start_time: start, end_time: end, livestream, club_id: clubID }).then(data => dispatch(receiveAddTrainingSession(data)))
    }
}

export function fetchClubSessions(clubID) {
    return (dispatch, getState) => {
        makeRequest("post", " /api/club/training/single_club", { club_id: clubID }, dispatch, getState)
            .then(data => dispatch(receiveClubSessions(clubID, data)))
    }
}

export function fetchAllSessions() {
    return (dispatch, getState) => {
        makeRequest("post", " /api/club/training/all", {}, dispatch, getState)
            .then(data => dispatch(receiveAllSessions(data)))
    }
}

export function selectClubTrainingSessions(clubID) {
    return {
        type: SELECT_CLUB_TRAINING_SESSIONS,
        data: clubID
    }
}


export const SELECT_LIVESTREAM = "SELECTED_LIVESTREAM";
export const STOP_LIVESTREAM = "STOP_LIVESTREAM";
export const RECEIVE_FRAME = "RECEIVE_FRAME";
export const RECEIVE_SAMPLE = "RECEIVE_SAMPLE";
export const SEND_FRAME = "SEND_FRAME";
export const SEND_SAMPLE = "SEND_SAMPLE";

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


let rootReducer = combineReducers({ auth, messages, trainingSessions, clubs, livestream });

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configStore(preloadedState) {
    return createStore(rootReducer, preloadedState, composeEnhancer(applyMiddleware(thunkMiddleware)))
}
