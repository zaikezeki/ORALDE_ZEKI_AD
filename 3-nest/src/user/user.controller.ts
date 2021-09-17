import { Controller,Get,Body,Post, Param, Delete } from '@nestjs/common';
import { resourceUsage } from 'process';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get("/all")
    getAll(){
        return this.userService.getAll();
    }


    @Post("/register")
    addUser(@Body() body:any){
        return this.userService.addUser(body);
    }


    @Get('/search/:id')
    getId(@Body("id") id:number ){
        return this.userService.search(id);
    }

    
    @Delete('/removeId/:id')
        deleteId(@Body("id") id: number){
            return this.userService.delete(id);
    }


    @Post("/login")
    loginUser(@Body("email") email:string , @Body("password") password:string){
        return this.userService.loginUser(email,password);
    }

}
