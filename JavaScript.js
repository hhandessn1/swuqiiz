async function uploadAvatar(){

const file=document.getElementById("avatarInput").files[0]

const form=new FormData()

const search=document.getElementById("search")

search.addEventListener("input",async()=>{

const res=await fetch("/users")
const users=await res.json()

const filtered=users.filter(u=>
u.username.toLowerCase().includes(search.value.toLowerCase())
)

renderUsers(filtered)

})

form.append("avatar",file)
form.append("username",currentUser)

const res=await fetch("/upload-avatar",{
method:"POST",
body:form
})

const data=await res.json()

document.getElementById("avatar").src="/avatars/"+data.avatar

}

async function openChat(user){

currentChat=user

const res=await fetch(`/messages/${currentUser}/${user}`)

const msgs=await res.json()

messages.innerHTML=""

msgs.forEach(m=>{

const div=document.createElement("div")
div.className="message"
div.textContent=m.from+": "+m.text

messages.appendChild(div)

})

}

socket.on("onlineUsers",(list)=>{
// показываем зеленую точку
})


socket.on("joinRoom",(room)=>{
socket.join(room)
})

socket.on("roomMessage",(data)=>{
io.to(data.room).emit("roomMessage",data)
})

function openChat(user){

currentChat=user

document.querySelector(".sidebar").classList.add("hide")

}

function backToChats(){

document.querySelector(".sidebar").classList.remove("hide")

}