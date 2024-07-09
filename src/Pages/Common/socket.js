import io from "socket.io-client";
import { baseUrl } from "../../utils/api";

const socket = io(baseUrl);

export default socket;
