import { Injectable } from '@nestjs/common';

@Injectable()
export class Excercise3Service {
   loopsTriangle(height:number){
       for(var i =1; i<=height; i++){
           var string='';
           var j=i;
           while(j){
               string+='*';
               j--;
           }
           console.log(string);
       }
       return;
   }

 Hello(name:string){
     return "Hello "+ name;
 }
 
 primeNumber(number:number){

    if(number%2==0){
        return "Not Prime";
    }
    else if(number%3==0){
        return "Not Prime"
    }
    else{
        return "This Number is a prime number";
    }


 }


}
