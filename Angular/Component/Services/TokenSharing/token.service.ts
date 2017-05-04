
import { Injectable } from '@angular/core';

import { Token } from '../../Models/Token';

@Injectable()

export class TokenService {

	token: Token = new Token();

	constructor() {}

	getToken() : Token {
		return this.token;
	}

	setToken(t: Token) : Token {
		this.token = t;
		return this.token;
	}
}