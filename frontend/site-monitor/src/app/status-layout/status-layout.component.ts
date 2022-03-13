import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/models/category';
import { SiteStatus } from 'src/models/siteStatus';

@Component({
  selector: 'status-layout',
  templateUrl: './status-layout.component.html',
  styleUrls: ['./status-layout.component.css']
})
export class StatusLayoutComponent implements OnInit {

  @Input() categoryName: String = 'Category';
  @Input() siteStatuses: SiteStatus[] = [];

  displayedColumns = ['url', 'success', 'statusCode'];
  dataSource: SiteStatus[] = [];
  constructor() { }

  ngOnInit(): void {
    this.dataSource = this.siteStatuses
  }

}
