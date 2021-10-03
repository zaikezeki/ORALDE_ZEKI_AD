import { CRUDReturn } from "./crud_return.interface";
import { Helper } from "./Helper";

export class User{
    public id: string;
    public name: string;
    public age:number;
    public email:string;
    public password: string;


    constructor(name:string,age:number,email:string,password:string){
        this.id = Helper.generateUID();
        this.name=name;
        this.age=age;
        this.email=email;
        this.password=password;
    }

    login(password: string): CRUDReturn {
      try {
        if (this.password === password) {
          return { success: true, data: this.toJason() };
        } else {
          throw new Error(`${this.email} login fail, password does not match`);
        }
      } catch (error) {
        return { success: false, data: error.message };
      }
    }



    toJason(){
        return{
            id:this.id,
            name:this.name,
            age:this.age,
            email:this.email

        }
    }


    log(){
        console.log(this.toJason);
    }

    registerLog(){
        console.log("This account has been registered");

    }

    
    replaceLog(){
      console.log("Data Overwritten");
      
    }

    matches(term: string): boolean{
      var keys: Array<string>=Helper.describeClass(User);
      keys=Helper.removeItemOnce(keys, 'passord');
      for(const key of keys){
        if (`${this[key]}`=== term)
        return true;
      }
      return false;
    }


    replaceValues(body: any): boolean{
      var keys: Array<String>= Helper.describeClass(User);
      keys= Helper.removeItemOnce(keys,'id');
      for(const key of Object.keys(body)){
        this[key]=body[key];
        
        return false;
      }

    }


}