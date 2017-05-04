import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { Token } from '../models/Token';
import { HttpService } from '../Services/HttpRequest/http.service'; 
import { TokenService } from '../Services/TokenSharing/token.service';


@Component({
	template: require('./app.component.html'),
	styles: [require('./app.component.css')],
	providers: [HttpService]
})

export class LoginComponent {
	private token: Token = new Token();
	private UserNotFoundLogIn: boolean = false;
	private UserFoundSignUp: boolean = false;

	constructor(private httpService: HttpService, 
				private router: Router,
				private tokenService: TokenService) {}

	private Login  : User = new User();
	private SignUp : User = new User();

	@ViewChild('signUpForm') private signUpForm;
	@ViewChild('loginForm') private loginForm;

	sendSignUp() {
		this.httpService.post('/signup', this.SignUp)
						.subscribe(res => {
							if(res.success) {
								this.token.token = res.token;
								console.log('SignUp');
								this.tokenService.setToken(this.token);
								console.log(this.token);
								this.router.navigate(['/chat']);

							}
							else {
								this.UserFoundSignUp = true;
								this.signUpForm.reset();
							}
						},
						err => {
							console.log(err);
							this.UserFoundSignUp = true;
						  	this.signUpForm.reset();
						},
						() => console.log('Done Dude'));	
	}
	sendLogin() {
		this.httpService.post('/login', this.Login)
						.subscribe(res => {
							if(res.success) {
								this.token.token = res.token;
								console.log('Login');
								this.tokenService.setToken(this.token);
								console.log(this.token);
								this.router.navigate(['/chat']);
							}
							else {
								this.UserNotFoundLogIn = true;
								this.loginForm.reset();
							}
						},
						err=> {
							this.UserNotFoundLogIn = true;
							this.loginForm.reset();
						},
						() => console.log('Done Dude'));
	}

}