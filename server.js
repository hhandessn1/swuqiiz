const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const mongoose = require("mongoose")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1:27017/messenger")

const User = mongoose.model("User",{
username:String,
avatar:String,
bio:String
})

const Message = mongoose.model("Message",{
from:String,
to:String,
text:String,
date:Date
})

let onlineUsers = {}

io.on("connection",(socket)=>{

socket.on("login",(username)=>{
onlineUsers[username]=socket.id
})

socket.on("privateMessage",async(data)=>{

await Message.create({
from:data.from,
to:data.to,
text:data.text,
date:new Date()
})

const target = onlineUsers[data.to]

if(target){
io.to(target).emit("privateMessage",data)
}

})

})

app.get("/users",async(req,res)=>{
const users = await User.find()
res.json(users)
})

app.get("/messages/:a/:b",async(req,res)=>{

const msgs = await Message.find({
$or:[
{from:req.params.a,to:req.params.b},
{from:req.params.b,to:req.params.a}
]
})

res.json(msgs)

})

server.listen(3000,()=>{
console.log("Server running")
})