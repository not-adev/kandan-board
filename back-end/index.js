import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import http from "http"
import { Server } from 'socket.io'
import { signup } from "./helper/Signup.js";
import cors from 'cors';
import { Login } from './helper/Login.js';
import deleteTodo from './helper/Deletetodo.js';
import AddTdod from './helper/AddTodo.js';
import GetUsers from './helper/GetUsers.js';
import getSmartUsers from './helper/getSmartUsers.js';
import ChangeStatus from './helper/ChangeStatus.js';
import get_all_todos from './helper/GetTodos.js';


const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: 'https://zingy-bombolone-29fd58.netlify.app/',
  credentials: true
}));
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: "https://zingy-bombolone-29fd58.netlify.app/",
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(express.static('public'));

app.get('/', async (req, res) => {
  res.send("hello from backend ")

});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const response = await signup({ name, email, password })
  res.send(response)

});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { token, status, code } = await Login({ email, password })
  res.setHeader('Set-Cookie', [
    `token=${token}; Max-Age=900000; HttpOnly; Secure; `,

  ]);
  res.send({ status: status, code: code })

});





io.on('connection', (socket) => {
  console.log('A user connected');


  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 A user disconnected');
  });
  socket.on('delete_todo', async (item) => {
    const response = await deleteTodo(item)
    
    socket.broadcast.emit("delet_your_todo", item)

  })
  socket.on("save_todo", async (item, callback) => {
    const { _id } = await AddTdod(item)
   
    item._id = _id
   
    callback(_id)
    socket.broadcast.emit("save_new_todo", item)
   

  },)

  socket.on("get_all_users", async (data, callback) => {

    const { users } = await GetUsers()
    
    callback(users)

  })
  socket.on("smartSelect", async (data, callback) => {
    const { users } = await getSmartUsers()
 
    callback(users)
  })

  socket.on("change_status", async ({ item, index, source, dest }) => {
    const res = await ChangeStatus(item)
    socket.broadcast.emit("change_your_status", { item, index, source, dest })
   

  },)

  socket.on("get_all_todos", async (data, callback) => {
    const todos = await get_all_todos()
    let todo = []
    let in_porgresss = []
    let complet = []
    for (let index = 0; index < todos.length; index++) {
     
      if (todos[index].status == "Todo") {
        todo.push(todos[index])
      }
      else if (todos[index].status == "In-progress") {
        in_porgresss.push(todos[index])
      }


      else if (todos[index].status == "Completed") {
        complet.push(todos[index])
      }

    }
  
    
    callback({todo,in_porgresss,complet})
  })


});

// Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));