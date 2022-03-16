import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Category } from 'src/models/category';

@Injectable({
  providedIn: 'root'
})
export class StatusReceiverService {

  constructor(private http:HttpClient){}


  private data: Category[]=[
    {
      categoryName:'Media',
      sites: [
        {
          url:'url1.com',
          success:true,
          statusCode:200,
          error:'',
          duration:0,
          size:0,
          updateTime:Date.now()
        },
        {
          url:'url2.com',
          success:false,
          statusCode:501,
          error:'error',
          duration:0,
          size:0,
          updateTime:Date.now()
        },
        {
          url:'url3.com',
          success:true,
          statusCode:200,
          error:'',
          duration:0,
          size:0,
          updateTime:Date.now()
        }
      ]
    },
    {
      categoryName:'Financial',
      sites: [
        {
          url:'url1.com',
          success:true,
          statusCode:200,
          error:'',
          duration:0,
          size:0,
          updateTime:Date.now()
        },
        {
          url:'url2.com',
          success:false,
          statusCode:501,
          error:'error',
          duration:0,
          size:0,
          updateTime:Date.now()
        },
        {
          url:'url3.com',
          success:true,
          statusCode:200,
          error:'',
          duration:0,
          size:0,
          updateTime:Date.now()
        }
      ]
    }
  ]

  getData(){
    return this.data;
  }

  getRuData(){
    //return this.data;
    return this.http.get(environment.ruEndpoint);
  }

  getUSData(){
    //return this.data;
    return this.http.get(environment.usEndpoint);

  }
}
