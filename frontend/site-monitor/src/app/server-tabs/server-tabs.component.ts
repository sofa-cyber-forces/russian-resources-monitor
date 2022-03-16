import { Component, OnInit } from '@angular/core';
import { Category } from 'src/models/category';
import { StatusReceiverService } from '../status-receiver.service'

@Component({
  selector: 'app-server-tabs',
  templateUrl: './server-tabs.component.html',
  styleUrls: ['./server-tabs.component.css'],
  providers: [StatusReceiverService]
})
export class ServerTabsComponent implements OnInit {

  ruCats: Category[] = [];
  usCats: Category[] = [];
  constructor(private statusService:StatusReceiverService) { }

  ngOnInit(): void {
    //this.ruCats=this.statusService.getData();
    //this.usCats=this.statusService.getData();
    this.statusService.getRuData().subscribe((data: any) => this.ruCats = data["categories"]);
    this.statusService.getUSData().subscribe((data: any) => this.usCats = data["categories"]);
  }

}
