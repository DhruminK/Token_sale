import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Token } from '../../Models/Token';
import * as io from 'socket.io-client';

export class ChatService {

	// Localhost address that we set in our server code
	private url = 'http://192.168.0.103:8080';
	private socket;
	constructor() {
		this.socket = io(this.url);
	}

	sendMessage(message) {
		this.socket.emit('message', message);
	}

	sendToken(token: Token) {
		this.socket.emit('authenticate', token);
	}

	getMessage() {
		let observable = new Observable( observer => {
			this.socket.on('message', (data) => {
				observer.next(data);
			});
			return () => {};
		})
		return observable;
	}

	Unauthorized() {
		let observable = new Observable( observer => {
			this.socket.on('unauthorized', () => {
				console.log('Token is not here dude');
				observer.next(null);
			});

			return () => {
				this.socket.disconnect();
			}
		})
		return observable;
	}

	ActiveUser() {
		let observable = new Observable( observer => {
			this.socket.on('active:User', (usr) => {
				observer.next(usr);
			});

			return () => {};
		})
		return observable;
	}

	UserDisconnect() {
		let observable = new Observable( observer => {
			this.socket.on('user:disconnect', (usr) => {
				observer.next(usr);
			});
		})

		return observable;
	}

	CurrentUser() {
		let observable = new Observable( observer => {
			this.socket.on('current:User', (usr) => {
				observer.next(usr);
			})
		})
		return observable;
	}

}
