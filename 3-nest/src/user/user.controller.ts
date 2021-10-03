import { Controller,Get,Body,Post, Param, Delete, Put,Patch } from '@nestjs/common';
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


    @Get("search/:term")
    searchUser(@Param('term') term)
    {
        return this.userService.searchUser(term);
    }

    
    @Delete('/removeId/:id')
        deleteId(@Body("id") id:string){
           return this.userService.delete(id);
    }


    @Post('/login')
    loginUser(@Body() body : any ) {
      
      return this.userService.loginUser(body);
    }


   // @Put('/changeData/:id')
    //replaceUser(@Param("id") id:number, @Body() body: any){
    //    return this.userService.replaceUser(id, body);
   // }



   @Patch("/:id")
   patchUser(@Param('id') id, @Body() body:any)
   {
       if(id!=null && body!=null)
           return this.userService.patchUser(id,body);
       else
           return "No parameters added";
   }

}


