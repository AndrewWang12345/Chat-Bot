const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const chatRoute = require("./routes/chatRoute");
const app = express();
const socket = require("socket.io");

app.use(cors());

require("dotenv").config();


app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/chat", chatRoute);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("DB Connection Successful");
}).catch((err) => {
    console.log(err.message);
});

app.use(cors());
app.use(express.json());

// app.use(express.static("./build"));
// app.get("*", (req, res)=>{
//     res.sendFile(path.resolve(__dirname, "build", "index.html"))
// });

const server = app.listen(process.env.PORT, () => {
    console.log("Server started on PORT "+process.env.PORT);
});

const io = socket(server, {
    cors: {
        origin: process.env.ORIGIN,
        credentials: true,
    },
});
global.onlineUsers = new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
})





