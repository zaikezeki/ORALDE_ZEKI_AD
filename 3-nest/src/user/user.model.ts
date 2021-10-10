import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';
import * as admin from "firebase-admin";


export class User {
  public id: string;
  private name: string;
  private age: number;
  private email: string;
  private password: string;

  constructor(name: string, age: number, email: string, password: string , id?: string) {
    this.name = name;
    this.age = age;
    this.email = email;
    this.password = password;
    if(id!=undefined){
    this.id=id;
    }
    else {
      this.id= Helper.generateUID();
    }
  }

  static async retrieve(id: string){
   try {
      var DB=admin.firestore();
      var result= await DB.collection("users").doc(id).get();
      if(result.exists){
       var data= result.data();
       return new User(
         data['name'], 
         data['age'], 
         data['email'], 
         data['password'],
         result.id,
        );
      }
      } catch (error) {
      console.log(error);
      return null;
    }
  }


  async commit(): Promise <CRUDReturn>{
    try {
      var DB=admin.firestore();
      var result= await DB.collection("users").doc(this.id).set(this.toJson);
      return {
        success: true,
        data: this.toJsonID()
      }
        
      } catch (error) {
      console.log(error);
      return {
        success: false,
        data : error
      };
    }
  }



  login(password: string): CRUDReturn {
    console.log(`current password ${this.password}, attempt: ${password}`);
    try {
      if (this.password === password) {
        return { success: true, data: this.toJson() };
      } else {
        throw new Error(`${this.email} login fail, password does not match`);
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  }

   matches(term: string): boolean {
    var keys: Array<string> = Helper.describeClass(User);
    keys = Helper.removeItemOnce(keys, 'password');
    for (const key of keys) {
      if (`${this[key]}` === term) return true;
    }
    return false;
  }

  replaceValues(body: any): boolean {
    try {
      var keys: Array<string> = Helper.describeClass(User);
      keys = Helper.removeItemOnce(keys, 'id');
      for (const key of Object.keys(body)) {
        this[key] = body[key];
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  log() {
    console.log(this.toJson());
  }

  toJson() {
    return {
      name: this.name,
      age: this.age,
      email: this.email,
    };
  }

  toJsonID() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email,
    };
  }
}