import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from "socket.io-client";
// import { Socket } from 'net';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe', {static: true}) private myScrollContainer: ElementRef;

  chats: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:8000');

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("user"));
    if(user!==null) {
      this.joinRoom();
      this.msgData = { room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    } 
  
    this.socket.on('update-messages', function (data) {
        console.log("ANGULAR UPDATING MESSAGES", data);
      if(true) {
            console.log("in update messages");
        this.chats = data;

        console.log("\n---------------------------------------------\n"+user.nickname + " sent message: "+ this.msgData.message + " to ROOM: " + user.room +"\n---------------------------------------------\n");
        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        // this.getChatByRoom(user.room);
        this.scrollToBottom();
      }
    }.bind(this));
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {
      console.log("getChatByRoom RES:\n"+JSON.stringify(res));
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    // this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    // this.socket.emit('send-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
    this.socket.emit('grab-messages',this.msgData);
    console.log("\n---------------------------------------------\n"+this.newUser.nickname + " JOINED ROOM: " + this.newUser.room +"\n---------------------------------------------\n");



    var user = JSON.parse(localStorage.getItem("user"));

    // this.socket.on('update-messages', function (data) {
    //   if(data.room === JSON.parse(localStorage.getItem("user")).room) {
    //     this.chats = data;
    //     this.msgData = { room: user.room, nickname: user.nickname, message: '' }
    //     // this.getChatByRoom(user.room);
    //     this.scrollToBottom();
    //   }
    // }.bind(this));
  }

  sendMessage() {
    // this.chatService.saveChat(this.msgData).then((result) => {
    //   this.socket.emit('save-message', result);
    //   this.getChatByRoom(this.msgData.room);
    //   console.log("this.msgDATA.room: \n" + this.msgData.room);
    //   var user = JSON.parse(localStorage.getItem("user"));
    //   this.msgData = { room: user.room, nickname: user.nickname, message: '' };
    // }, (err) => {
    //   console.log(err);
    // });
    console.log("\nattempting to send message:\n" + JSON.stringify(this.msgData));

    this.socket.emit('send-message', this.msgData);

    
    var user = JSON.parse(localStorage.getItem("user"));
    
    
    
    this.socket.on('update-messages', function (data) {
      if(data.room === JSON.parse(localStorage.getItem("user")).room) {
        this.chats = data;

        console.log("\n---------------------------------------------\n"+user.nickname + " sent message: "+ this.msgData.message + " to ROOM: " + user.room +"\n---------------------------------------------\n");

        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        // this.getChatByRoom(user.room);
        this.scrollToBottom();
      }
    }.bind(this));

  }

  logout() {
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    // this.socket.emit('send-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
    console.log("a user left the room")
  }

}