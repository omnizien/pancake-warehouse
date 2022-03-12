import {EventEmitter, Injectable} from '@angular/core';
import {ethers} from 'ethers';
import {default as sub_cons} from '../constants/token-lists/sub_cons.json';
import {default as pop_cons} from '../constants/token-lists/pop_cons.json';
import {web3, contract_address, provider, signer} from '../constants/constants';
import {pair_abi, factory_abi, routerV2_abi, contract_abi} from '../constants/abis/triangular.ABI';
import {pancake_address} from '../constants/addresses/addresses';
import {pancakeRouter} from '../constants/router/routers';
import {  _tokenAddress} from './bsscan';
import { from, Observable } from 'rxjs';
import { JsonEncoderService } from '../workers/json-encoder.service';
import { AppComponent  } from '../app.component';
// import { bsscan, } from '../interfaces/tri_interface';

 
 
export let pancakePairPrice: number = 0;
export let pancakeSwapTokenName: string;
 

type MapType = { 
    [id: string]: string; 
}
export let pancakeTokenMap: MapType = {};  
 
  

@Injectable({providedIn: 'root'})
export class PancakeService {
    gas_price !: ethers.BigNumber;

    factory !: ethers.Contract;
    reserve : any;
    invokePair !: ethers.Contract;
    reserve0 : number = 0;
    reserve1 : number = 0;

    Mouter !: ethers.Contract;
    cumulative : number = 0;


    shouldStart : boolean = false;

    max_from_pairs : number = 0;

    tokenAddress0 : string = '';
    tokenAddress1 : string = '';

    token0Name : string = "";
    token1Name : string = "";
    token2Name : string = "";

    
    coin : string = "";
    constructor( ) {}

//https://www.javatpoint.com/typescript-map#:~:text=TypeScript%20map%20is%20a%20new%20data%20structure%20added,value.%20We%20can%20create%20a%20map%20as%20below.
    public conventionSwitch(ops : string) {
      
   
        switch (  ops ) {
             
            case 'wbnb':
                this.tokenAddress0 = pop_cons.wbnb;
                this.tokenAddress1 = pop_cons.busd;
                pancakeSwapTokenName = ops;
                this.exchangeFactories();
                
                break;
            case 'shiba':
                this.tokenAddress0 = sub_cons.shiba;
                this.tokenAddress1 = pop_cons.busd;
                pancakeSwapTokenName = ops;
                this.exchangeFactories();
                break;
            case 'eth':
                this.tokenAddress0 = pop_cons.eth;
                this.tokenAddress1 = pop_cons.busd;
                pancakeSwapTokenName = ops;
                this.exchangeFactories();

                break;
            default:
                console.log('Invalid operator');
        }
         
        
    }

    public async exchangeFactories() {
        this.factory =  await new ethers.Contract(pancake_address, factory_abi, signer);
        this.establishPair();
    }


    public async establishPair() {
        const getPair = await this.factory['getPair'](this.tokenAddress0, this.tokenAddress1); // no fren
        this.invokePair = new ethers.Contract(getPair, pair_abi, signer);
         
        this.pairReserve();
    }

    public async pairReserve() {
        this.reserve = await this.invokePair['getReserves']();
        this.reserve0 = Number(ethers.utils.formatUnits(this.reserve[0], 18));
        this.reserve1 = Number(ethers.utils.formatUnits(this.reserve[1], 18));
        this.pairPricing();
    }
    public async pairPricing() {
        const balanceOf = 1;
        const cumulative = this.reserve1 / this.reserve0;
        const withBalanceOf = cumulative * balanceOf;
        pancakePairPrice = withBalanceOf - (0.3 * withBalanceOf) / 100; // 0.30% fee

        pancakeTokenMap[pancakeSwapTokenName]  = (pancakePairPrice.toString());  
         
        console.log(pancakeTokenMap);
        
 
        // console.log(`\x1b[33m[PancakeSwap]  ${cumulative}  _ tokenname            = ${
        //     pancakePairPrice.toFixed(8)
        // } BUSD\x1b[0m`);;


    }

    public priceCheck() :boolean{
        if (pancakePairPrice = 0) {return false;}
       return true;    
    }

    // public appGetTotalFighters(): Observable<any> {
    // const source = from(this.contract.totalFighters());
    // return source;
    // }

    // apply routers
    async router() {
        this.Mouter = new ethers.Contract(pancakeRouter, routerV2_abi, signer);
    }

}
