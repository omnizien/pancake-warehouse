import {Injectable} from '@angular/core';
import {PancakeService, pancakePairPrice1, pancakeSwapTokenName} from '../providers/pancake.service';
import {ApeService, apePairPrice,apeSwapTokenName} from '../providers/ape.service';
import {BakeryService, bakeryPairPrice,bakerySwapTokenName} from '../providers/bakery.service';
import { AppComponent, arbentina } from '../app.component';
  export let jsonStr: string;

@Injectable({providedIn: 'root'})
export class JsonEncoderService {

    constructor() {
         
    }

    //arbentina
// pancakePairPrice
    public jsonObject() {
         jsonStr = '[]';
        var obj = JSON.parse(jsonStr);
        obj.push({
            exchange: "pancakeswap",
            token: pancakeSwapTokenName,
            amount: 1,
            value: pancakePairPrice1
        }, {
            exchange: "apeswap",
            token: apeSwapTokenName,
            amount: 1,
            value: apePairPrice
        }, {
            exchange: "bakeryeswap",
            token: bakerySwapTokenName,
            amount: 1,
            value: bakeryPairPrice
        })

        jsonStr = JSON.stringify(obj);
        console.log("json encoder server :  ");
        console.log(jsonStr)
    }
 

}
