import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { routes } from './routes.module';

import {AppComponent} from './Component/Toolbar/app.component';
import {ChatComponent} from './Component/ChatBox/app.component';
import { LoginComponent } from './Component/Login/app.component';
import { TokenService } from './Component/Services/TokenSharing/token.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	imports: [BrowserModule,
	FormsModule,
	BrowserAnimationsModule,
	HttpModule,
	NgbModule.forRoot(),
	RouterModule.forRoot(routes) ],
	
	declarations: [
		AppComponent,
		ChatComponent,
		LoginComponent
	],

	providers: [
		TokenService
	],

	bootstrap: [AppComponent]
})

export class AppModule {}