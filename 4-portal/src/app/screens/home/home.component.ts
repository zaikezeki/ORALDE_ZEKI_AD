import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  showID:boolean=true;
  showAll:boolean=true;
  edit:boolean=false;
  content:boolean=true;



  fcID=new FormControl();
  error:string='';
  


  newForm: FormGroup= new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0, Validators.min(1)),
    fcEmail: new FormControl('', Validators.required),
    fcPassword: new FormControl('', Validators.required),
    fcPassword2: new FormControl('', Validators.required),
  });


  ngOnInit(): void {
    this.getAll();
  }

  async getAll(){
    var result:any =await this.api.get(environment.API_URL + "/user/all").toPromise();
    var temp: Array<User>=[];
    this.showAll=true;
    this.edit=false;
    if(result.success){
      this.displayResult = result.data;
      result.data.forEach((json: any) => {
      var tempU = User.fromJson(json.id, json);
      if (tempU != null) temp.push(tempU);
    });
    
  }
  this.users=temp;

}


 
async delete(i : number){
  var decision = confirm('Delete ' + this.users[i].name + '?');
  if (decision){
      var result:any = await this.api.delete(environment.API_URL + `/user/${this.users[i].id}`).toPromise();
      if(result.success){
        this.getAll();
        alert("Successfully Deleted");
      }
  }
  console.log(i);
}

async search() {
  if (this.fcID.value.length >=28){
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
       alert("Not Found");
        console.log(this.fcID.value.length);
      }
    } catch (e) {
      console.log(e);
      }
    }
  }  


  Submit() {
    if (
      this.newForm.value['fcPassword'] !==
      this.newForm.value['fcPassword2']
    ) {
      this.error = 'Password doesnt match!';
      return;
    }
    if (!this.newForm.valid) {
      {
        this.error = 'No fields must be empty';
        return;
      }
    }
    if (this.newForm.valid) {
      var payload: {
        name: string;
        email: string;
        age: number;
        password: string;
      };

      payload = {
        name: this.newForm.value.fcName,
        email: this.newForm.value.fcEmail,
        age: this.newForm.value.fcAge,
        password: this.newForm.value.fcPassword,
      };

      console.log(payload);
    }
  }

  async changeUser(i: number){
    var result:any = await this.api.get(environment.API_URL + `/user/${this.users[i].id}`).toPromise();
    if (result.success){
    this.displayResult.id = this.users[i].id
    this.displayResult.name = this.users[i].name
    this.displayResult.age = this.users[i].age
    this.displayResult.email = this.users[i].email
    this.showID=false;
    this.showAll=false;
    this.edit=true;
    this.content=false;
    }
    else {
      alert("User not found");
      this.getAll();
    }
    this.clearForm();
  }


  clearForm(){
    this.newForm.setValue({
    fcName: '',
    fcAge: '',
    fcEmail: '',
    fcPassword: '',
    fcPassword2: '',
    })
  }

  async confirm(){
    var result: any = await this.api
      .patch(environment.API_URL + "/user/"+this.displayResult.id, {
        name: this.newForm.value.fcName,
        age: this.newForm.value.fcAge,
        email: this.newForm.value.fcEmail,
      })
      .toPromise();
      console.log(result.success);
      if (result.success){
        this.getAll();
      }
      else {
        alert("Email is already in Use");
      }
  }


  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
