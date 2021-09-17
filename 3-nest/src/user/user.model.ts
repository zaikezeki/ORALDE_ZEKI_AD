export class User{
    private id: number;
    private name: string;
    private age:number;
    private email:string;
    private password: string;


    constructor(id:number,name:string,age:number,email:string,password:string){
        this.id=id;
        this.name=name;
        this.age=age;
        this.email=email;
        this.password=password;
    }

    login(email:string, password:string){
       if(email===this.email && password===this.password){
           return "Login Sucess";
        }
        else{
            return "Invalid Password and Email";
       
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
        console.log(`${this.id}:${this.name}, ${this.age}, ${this.email}` );
    }

    registerLog(){
        console.log("This account has been registered");

    }



}