
import { Routes } from '@angular/router';

import { ChatComponent } from './Component/ChatBox/app.component';
import { LoginComponent } from './Component/Login/app.component';

export const routes: Routes = [
	{ path: '', component: LoginComponent},
	{ path: 'chat', component: ChatComponent}
];
