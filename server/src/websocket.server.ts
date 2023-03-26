import socketio from "socket.io"
import {createServer} from "http"

const server = createServer()
const io = new socketio.Server(server)

io.on("connect", (socket) => {
  console.log("connected")
  socket.on("registration", ({username}, cb) => {
    console.log(username)
  })
})

server.listen(4001, () => {
  console.log('listening on 4001')
})