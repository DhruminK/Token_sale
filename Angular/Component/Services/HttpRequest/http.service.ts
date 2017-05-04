
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { User } from '../../Models/User';

import 'rxjs/add/operator/map';

@Injectable()

export class HttpService {
	constructor(private http: Http) {}

	get(url: string) {
		return this.http.get(url)
						.map(res => res.json());
	}
	post(url: string, usr: User) {
		return this.http.post(url, usr)
						.map(res => res.json());
	}
} 