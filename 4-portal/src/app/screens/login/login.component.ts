import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router, private api:HttpClient) { }

  ngOnInit(): void {
  }


  fCEmail= new FormControl();
  fCPassword=new FormControl();
  requestResult= '';

  async login(){
    var result:any=await this.api.post(
      environment.API_URL+"/user/login",
      {
        "email:": 
        this.fCEmail.value, 
        "password": this.fCPassword.value
      }).toPromise();
    if(result.success){
      this.nav('home');


    }
    else{
      alert("Incorrect Credentials");
    }

    console.log(result.success);
    this.requestResult=result.data;








    //if(this.fCEmail.value=="zekioralde@gmail.com" && this.fCPassword.value== "hakdog123"){
      //this.nav('home');
    //}
    //else{
      //alert("Incorrect Username and Password");
      //console.log("Wrong Key");
    //}
  }

  nav(destination:string){
    this.router.navigate([destination]);
  }

}
