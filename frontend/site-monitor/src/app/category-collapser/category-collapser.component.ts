import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Category } from 'src/models/category';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'category-collapser',
  templateUrl: './category-collapser.component.html',
  styleUrls: ['./category-collapser.component.css']
})
export class CategoryCollapserComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion = new MatAccordion();

  @Input() categories: Category[] = [];

  constructor() { }

  ngOnInit(): void {

  }

}
