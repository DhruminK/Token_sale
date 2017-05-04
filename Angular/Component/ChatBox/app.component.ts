
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../Services/ChatService/chat.service';
import { Token } from '../Models/Token';
import { Messages } from '../Models/Messages';
import { User } from '../Models/User';
import { TokenService } from '../Services/TokenSharing/token.service';
@Component({
	selector: 'chatbox',
	template: require('./app.component.html'),
	styles: [require('./app.component.css')],
	providers: [ChatService]
})

export class ChatComponent {
	messages = [];

	messageConn;
	unauthorizeConn;
	activeUserConn;
	currentUserConn;
	usrDisconnect;
	
	currentUser : User = new User;
	
	message;
	
	token: Token;
	constructor(private chatService: ChatService, 
				private tokenService: TokenService){
		this.token = this.tokenService.getToken();
		this.chatService.sendToken(this.token);
	}
	
	sendMessage() {
		this.chatService.sendMessage(this.message);
		this.message = '';
	}
	
	ngOnInit() {
		this.messageConn = this.chatService.getMessage().subscribe( msg=> {
			let m = new Messages();
			m.user = msg.user;
			m.message = msg.msg;
			console.log(m);
			this.messages.push(m);
		});
		this.unauthorizeConn = this.chatService.Unauthorized().subscribe( ()=> {
			console.log('We are done');
		});
		this.activeUserConn = this.chatService.ActiveUser().subscribe( data => {
			console.log(data);
		});
		this.currentUserConn = this.chatService.CurrentUser().subscribe( data => {
			this.currentUser.email = data.local.email;
			this.currentUser.f_name = data.local.first_name;
			this.currentUser.l_name = data.local.last_name;
			this.currentUser.username = data.local.username;
		});
		this.usrDisconnect = this.chatService.UserDisconnect().subscribe( data => {
			console.log(data);
			console.log('Disconnect is sick');
		})

	}

	ngOnDestroy() {
		this.messageConn.unsubscribe();
		this.unauthorizeConn.unsubscribe();
		this.activeUserConn.unsubscribe();
		this.usrDisconnect.unsubscribe();
		this.currentUserConn.unsubscribe();
	}

}