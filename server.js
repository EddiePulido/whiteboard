const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const server = app.listen(8000, function() {
  console.log("listening on port 8000");
})

const io = require('socket.io')(server);
const Chat = require('./server/models/Chat.js')
var isDone = false;

// socket io
io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
      console.log('User disconnected');
    });
    // socket.on('save-message', function (data) {
    //   console.log(data);
    //   io.emit('new-message', { message: data });
    // });
    socket.on('send-message', function (msg) {
        console.log("Connected");
        console.log("SENT MESSAGE:\n"+JSON.stringify(msg));
        Chat.create(msg, function(err, data){
            console.log(data);
            if(err){
                console.log("err creating message:\n"+err);
                // res.json({errorMsg: "Error", error: err});
            } else {
                // res.json({message: "Success", data: data});

                Chat.find({room: msg.room}, function(err, data){
                    if(err){
                        console.log("err retrieving all messages:\n" + err)
                        // res.json({errorMsg: "Error", error: err});
                    } else {
                        // res.json({data});
                        console.log("DATAAAAAA:\n"+JSON.stringify(data));
    
                        io.emit('update-messages', data)
                    }
                });
                console.log("YEEEEEEEEEEE BOOOIIIIIII")
            }
        });



    })

    socket.on("draw-coordinates",function(data){

        console.log("Reached server after drawing");
        io.emit("draw-this",data);
    })
    socket.on('grab-messages',function(msg){
        Chat.find({room: msg.room}, function(err, data){
            if(err){
                console.log("err retrieving all messages:\n" + err)
                // res.json({errorMsg: "Error", error: err});
            } else {
                // res.json({data});
                console.log("DATAAAAAA:\n"+JSON.stringify(data));

                io.emit('update-messages', data)
            }
        });
    })
});


app.use(bodyParser.json());

app.use(express.static( __dirname + "/public/dist/public" ));

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

module.exports = server;

