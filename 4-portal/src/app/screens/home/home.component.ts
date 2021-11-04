import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { User } from './user.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users:Array<User>=[];

  constructor(private router: Router, private api: HttpClient) { }

  displayResult:any;
  show:boolean=true;


  fcID=new FormControl();

  ngOnInit(): void {
    this.getAll();
  }

  async getAll(){
    var result:any =await this.api.get(environment.API_URL + "/user/all").toPromise();
    var temp: Array<User>=[];
    this.users=temp;
    if(result.success){
      this.displayResult = result.data;
      result.data.forEach((json: any) => {
      var tempU = User.fromJson(json.id, json);
      if (tempU != null) temp.push(tempU);
    });
  }
}


 
async delete(i : number){
  var decision = confirm('Delete ' + this.users[i].name + '?');
  if (decision){
      var result:any = await this.api.delete(environment.API_URL + `/user/${this.users[i].id}`).toPromise();
      if(result.success){
        this.getAll();
        this.getAll();
      
        alert("Successfully Deleted");
      }
  }
  console.log(i);
}

async search() {
  if (this.fcID.value.length > 30){
    try {
      var result:any = await this.api.get(environment.API_URL + "/user/"+ this.fcID.value).toPromise();
      if (result.success){
       
        this.displayResult.id = result.data.id
        this.displayResult.name = result.data.name
        this.displayResult.age = result.data.age
        this.displayResult.email = result.data.email
        console.log(this.fcID.value.length);
       
      }
      else{
        this.getAll();
       
        alert("ID not found in database");
        console.log(this.fcID.value.length);
      }
    } catch (e) {
      console.log(e);
    }
  }

  else {
    try {
      var result:any = await this.api.get(environment.API_URL + "/user/search/"+this.fcID.value).toPromise();
      if (result.success){
        this.users = result.data
        console.log(result.success);
      }
      else{
        this.getAll();
       
        alert("Seems like it is not in our database");
        console.log(this.fcID.value.length);
      }
    } catch (e) {
      console.log(e);
      }
    }
  }  



  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
