import { Component } from '@angular/core';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  imports: [ChatComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
