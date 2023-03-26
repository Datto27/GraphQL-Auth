import socketio from "socket.io"
import {createServer} from "http"
import { users } from "./db"

const server = createServer()
const io = new socketio.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials:true
  }
})

let registrationsCount = 0;

io.on("connect", (socket) => {
  console.log("connected: ", socket.id);
  
  socket.on("registration", (data, cb) => {
    console.log("new registration");
    registrationsCount += 1;
    io.emit("new-registration", {registrationsCount});
  })

  socket.on("join", (data, cb) => {
    console.log(data);
    if(data.user.id) socket.join(data.user?.id);
  })

  socket.on("disconnect", () => {
    console.log("User disconected: ", socket.id);
  })
})

server.listen(4001, () => {
  console.log('listening on 4001');
})