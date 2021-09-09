import { Controller, Get, Param } from '@nestjs/common';
import { Excercise3Service } from './excercise3.service';
import {get} from 'http';

@Controller('excercise3')
export class Excercise3Controller {
    constructor(private readonly e3: Excercise3Service) {}

    @Get('/loopsTriangle/:height')
    loopsTriangle(@Param('height')height:string){
        var parsedHeight:number=parseInt(height);
        return this.e3.loopsTriangle(parsedHeight);
    }

    @Get('/Hello/:name')
    Hello(@Param('name')name:string){
        return this.e3.Hello(name);
    }

    @Get('/primeNumber/:number')
    primeNumber(@Param('number')number:string){
        var parsednumber:number=parseInt(number);
        return this.e3.primeNumber(parsednumber);
    }


}
