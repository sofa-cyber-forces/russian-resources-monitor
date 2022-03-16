import { getLocaleDateFormat } from '@angular/common';
import { Component } from '@angular/core';
import { StatusReceiverService } from 'src/app/status-receiver.service'
import { Category } from 'src/models/category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'site-monitor';

  constructor(private dataService:StatusReceiverService){
  }

}
