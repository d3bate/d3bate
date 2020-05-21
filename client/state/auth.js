import { REQUEST_JWT, RECEIVE_JWT, ADD_CREDENTIALS } from "./index";
export function auth(state = {
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
            return state;
    }
}
