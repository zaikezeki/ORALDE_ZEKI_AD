import { Injectable, ParseBoolPipe } from '@nestjs/common';
import { Console } from 'console';
import { User } from './user.model';

@Injectable()
export class UserService {

    private users: Map<number,User> = new Map<number,User>();

    

    getAll(){
        var populatedData=[];
        for(const [number,users] of this.users.entries()){
           users.log();
        }
        return populatedData;
    }



   logId(){
       for(const [number,users] of this.users.entries()){
           users.registerLog();
       }
   }



   addUser(id:any){
       var newUser: User;
       newUser= new User(id?.id, id?.name, id?.age, id?.email, id?.password);
       this.users.set(id.id,newUser);
       this.logId();

    }


    search(id:number){
      if(this.users.has(id)){
          return this.users.get(id).toJason();
      }
      else{
          return "This is not exist in the database";
      }
      
    }


    delete(id:number){
        if(this.users.has(id)){
            this.users.delete(id);
            return " This Id has been deleted";

        }
        else
        return " This id does not exist";
    }           


    loginUser(email:string, password:string){
        for(const [string,users] of this.users.entries()){
            return users.login(email,password);
        }
    }



    




}
