import { Body, Injectable, ParseBoolPipe } from '@nestjs/common';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './Helper';
import { User } from './user.model';
import * as admin from "firebase-admin";
import { stringify } from 'querystring';


const DEBUG: boolean = true;
@Injectable()
export class UserService {
  private users: Map<string, User> = new Map<string, User>();
  private DB=admin.firestore();

  constructor() {
    this.users = Helper.populate();
  }

  async register(body: any): Promise <CRUDReturn> {
    try {
      var validBody: { valid: boolean; data: string } =
        Helper.validBodyPut(body);
      if (validBody.valid) {
        var exist= this.emailExists(body.email);
        if (!exist) {
          var newUser: User = new User(
            body.name,
            body.age,
            body.email,
            body.password,
          );
          if (await this.saveToDB(newUser)) {
            if (DEBUG) this.logAllUsers();
            return {
              success: true,
              data: newUser.toJson(),
            };
          } else {
            throw new Error('generic database error');
          }
        } else
          throw new Error(`${body.email} is already in use by another user!`);
      } else {
        throw new Error(validBody.data);
      }
    } catch (error) {
      console.log(error.message);
      return { success: false, data: `Error adding account, ${error.message}` };
    }
  }

  async getOne(id: string): Promise <CRUDReturn> {
    try{
      var result= await this.DB.collection("users").doc(id).get();
      if(result.exists){
        return{
          success: true,
          data: result.data(),
        };
      }
      else{
        return{
          success: false,
          data: `User ${id}does not exist in the database`,
        };

      }
    } catch (error){
      console.log(error);
      return{
        success: false,
        data: error
      }
    }
  }

  async getAll(): Promise <CRUDReturn> {
    var results: Array<any> = [];
    try {
     var allUsers= await this.getAllUserObjects();
      allUsers.forEach((user) => {
         results.push(user.toJsonID());
      });
      return { success: true, data: results};
    } catch (e){
      return{
        success: false,
        data: e
      };
    }
  }

  async getAllUserObjects(): Promise<Array<User>>{
    var results: Array<User> = [];
    try {
      var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>= await this.DB.collection("users").get();
      dbData.forEach((doc) => {
        if(doc.exists){
          results.push(new User( 
             doc.data()["name"],
             doc.data()["age"],
             doc.data()["email"],
             doc.data()["password"],
             doc.data()["id"],
          ));
        }
      });
      return results;
    } catch (e){
      return null; 
    }
  }




  async searchUser(term: string): Promise <CRUDReturn> {
    var results: Array<any> = [];
    for (const user of this.users.values()) {
      if (user.matches(term)) results.push(user.toJson());
    }
    return { success: results.length > 0, data: results };
  }

 async replaceValuePut(id: string, body: any): Promise <CRUDReturn> {
    try {
      if (this.users.has(id)) {
        var validBodyPut: { valid: boolean; data: string } =
          Helper.validBodyPut(body);
        if (validBodyPut.valid) {
          var exist= this.emailExists(body.email, { exceptionId: id });
          if (!exist) {
       
            var user: User = this.users.get(id);
            var success = user.replaceValues(body);
            if (success)
              return {
                success: success,
                data: user.toJson(),
              };
            else {
              throw new Error('Failed to update user in db');
            }
          } else {
            throw new Error(`${body.email} is already in use by another user!`);
          }
        } else {
          throw new Error(validBodyPut.data);
        }
      } else {
        throw new Error(`User ${id} is not in database`);
      }
    } catch (error) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async replaceValuePatch(id: string, body: any): Promise <CRUDReturn> {
    try {
      if (this.users.has(id)) {
        var validBodyPatch: { valid: boolean; data: string } =
          Helper.validBody(body);
        if (validBodyPatch.valid) {
          var exist= this.emailExists(body.email, { exceptionId: id });
          if (!exist) {
            var user: User = this.users.get(id);
            var success = user.replaceValues(body);
            if (success)
              return {
                success: success,
                data: user.toJson(),
              };
            else {
              throw new Error('Failed to update user in db');
            }
          } else {
            throw new Error(`${body.email} is already in use by another user!`);
          }
        } else {
          throw new Error(validBodyPatch.data);
        }
      } else {
        throw new Error(`User ${id} is not in database`);
      }
    } catch (error) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  async deleteUser(id: string): Promise <CRUDReturn> {
    if (this.users.has(id)) {
      return {
        success: this.users.delete(id),
        data: `User ${id} has been successfully removed`,
      };
    } else
      return {
        success: false,
        data: `User ${id} is not in database`,
      };
  }

  login(email: string, password: string) {
    for (const user of this.users.values()) {
      if (user.matches(email)) {
        console.log(email,password);
        return user.login(password);
      }
    }
    return { success: false, data: `${email} not found in database` };
  }

 
  async emailExists(email: string, options?: { exceptionId: string }): Promise<boolean> {
   try{
     var userResults= await this.DB.collection("users").where("email", "==", email).get();
     console.log("Are the users results empty?");
     console.log(userResults.empty);
     if(userResults.empty) return false;
     for(const doc of userResults.docs){
       console.log(doc.data());
       console.log("Are the options defined?");
       console.log(options!=undefined);
      if(options!=undefined){
        if(doc.id==options?.exceptionId)
        continue;
      }
      if(doc.data()["email"]=== email){
        return true;
      }
      else{
        return false;
      } 
     }
     return false;
   }catch (error){
     console.log("Email exist subfunction error");
     console.log(error.message);
     return false;
   }
   
  }

 async saveToDB(user: User): Promise <boolean> {
    try {
      var result= await user.commit()
      return result.success;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  logAllUsers() {
    console.log(this.getAll());
  }
}