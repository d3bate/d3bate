import io from "socket.io-client";
import {backendURL} from "../constants";

const socket = io(backendURL);
