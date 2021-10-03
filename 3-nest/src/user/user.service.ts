import { Body, Injectable, ParseBoolPipe } from '@nestjs/common';
import { Console, debug } from 'console';
import e from 'express';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './Helper';
import { User } from './user.model';


@Injectable()
export class UserService {

    private users: Map<string,User> = new Map<string,User>();
    email: string;
    password: string;
    private populatedData : Map<string,User> = Helper.populate();

    constructor(){
        this.users= Helper.populate();
        if(debug) this.logAllUsers();
    }

    

    getAll(){

        var userList = [];
        this.populatedData.forEach((u)=>
        {
            var user = u;
            var bodyx = 
            {
                id : user.id,
                name : user.name,
                age : user.age,
                email : user.email
            }

            userList.push(bodyx);
        })

       return {
           success: true,
           data: userList
       }
    }



   logId(){
       for(const [number,users] of this.users.entries()){
           users.registerLog();
       }
   }



   addUser(body: any): CRUDReturn{
       try{
           var validBody: {valid: boolean; data: string }=Helper.validBody(body);
           if(validBody.valid){
               if(!this.emailExists(body.email)){
                   var newUser: User= new User(
                       body.name,
                       body.age,
                       body.email,
                       body.passord,
                   );
                   if(this.saveToDB(newUser)){
                       if (debug)this.logAllUsers();
                       return{
                           success: true,
                           data: newUser.toJason(),
                       };
                   } else {
                       throw new Error('generic database eror');
                   }
               } else {
                throw new Error(`${body.email}is already in use by other User!` );
               }
           }else{
               throw new Error(validBody.data);
           }
        } catch (error){
         console.log(error.message);
         return{ success : false ,data: `Eror adding document, ${error.message}`};
        }
   }



   
           
    saveToDB(user: User): boolean{
        try{
            this.users.set(user.id, user);
            return this.users.has(user.id);
        } catch (eror){
            console.log(eror);
            return false;
        }
    }

    logAllUsers(){
        for(const [key,user] of this.users.entries()){
            console.log(key);
            user.log();
        }
    }





    emailExists(email:string,options?:{exceptionId:string}){
        for(const user of this.users.values()){
            if(user.matches(email)){
                if(
                    options?.exceptionId!=undefined && user.matches(options.exceptionId)
                 )
                 continue;
                 else return true;
            }
        }
        return false;
    }


    searchUser(term : any)
    {
        var array = [];
        if(this.populatedData == null)
            return null;

        this.populatedData.forEach((u) =>
        {
            var user = u;
               
            if (user.id == term || user.name.toUpperCase() == term.toUpperCase() || user.email.toUpperCase() == term.toUpperCase() || user.age == term )
            {
                
                array.push( {
                    id : user.id,
                    name : user.name,
                    age : user.age,
                    email : user.email
                
                });

            }
    
        } )
        if ( array.length > 0 )
               return{
                    success : true,
                    data: array
               } ;

        return {
            success:false,
            data: "Term does not match any users in database"
        }
    }


    delete(body:any){
        if(this.saveToDB(body)){
            this.users.delete(body);
            return " This Id has been deleted";

        }
        else
        return " This id does not exist";
    }           


    loginUser( body:any )
    {
        try{
            var authenticatedUser = null;
            if(!body)
            return {
                success: false,
                data: "No parameters"
            };
            this.populatedData.forEach((u) =>
            {
                var user =  u;


                
                if ((user.password == body.password ) && (user.email == body.email) )
                {
                    authenticatedUser = u;
                }
                
            });



        }catch(e)
        {
            return {
                success: false,
                data: "Sad nay error"
            } 
        }
        if(authenticatedUser !=null) 
        {
            return{
                success: true,
                data : authenticatedUser
            } 
        }
        else{
            return{
                success: false,
                data: "Email or Password is incorrect"
            } 
        }

    }

    //replaceUser(id:any, user:any){
       // var newId: User;
       // newId = new User(id?.id, id?.name, id?.age, id?.email, id?.password);
      //  this.users.set(id, newId);
       // this.replacelog();
    //}

    replacelog(){
        for(const [number,users] of this.users.entries()){
            users.replaceLog();
        }
    }


    patchUser(id:any, body:any)
    {

        var hasChanged = false;
        
        try{
            var existingUserEmail = null
            var user = null;
            if ( body.email != null )
            {
                 existingUserEmail = this.searchUser(body.email).success;
            }

            this.populatedData.forEach((u) =>
            {
                if (u.id == id )
                {
                    user = u;
                }
            });
                
        if(body.name != user.name && body.name != null  && !(body.name === "")) 
        {
        
            user.name = body.name;
            hasChanged = true;
            if ( typeof body.name != typeof "ok"  )
            {
                return {
                    success: false,
                    data: "Attribute has a wrong type!" 
                }
            }

        }
            
        if(body.age != user.age && body.age != null  && !(body.age === ""))
        {
            user.age =body.age;
            hasChanged = true;
            if ( typeof body.age != typeof 23  )
            {
                return { 
                    success: false,
                    data: "Attribute has a wrong type!" }
            }

        }

        if(existingUserEmail != null)
        {

            if(body.email!=user.email && body.email != null  && !(body.email === "") )
            {
                user.email = body.email;
                hasChanged = true;
                if ( typeof body.email != typeof "ok"  )
                {
                    return {
                        success: false,
                        data: "Attribute has a wrong type!" 
                    }
                }
                
                
            }


            if ( existingUserEmail && !(body.email != user.email) )
            {
                return {
                    success: false,
                    data: "Email already exist in database!"
                }
            }
        }



        if(body.password != user.password && body.password != null  && !(body.password === "") )
        {

            user.password = body.password;
            hasChanged = true;
            if ( typeof body.password != typeof "ok"  )
            {
                return {
                    success: false,
                    data: "Attribute has a wrong type!"
                }
            }
            
        }

        

        if(hasChanged)
        {
            var updatedUser = new User(user.id, user.name, user.age, user.email);
            this.populatedData.set(user.id, updatedUser); 
            return {
                success: true,
                data: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                }
            };
        }
        else return {
            success: false,
            data: "Nothing changed"
        };
        
                  
             
                

        }catch(e)
        {
            return {
            success : false,
            data: "nothing sad"
        };
        }

       
    }

    


     
    



    




}
