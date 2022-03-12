import {EventEmitter, Injectable} from '@angular/core';
import {ethers} from 'ethers';
import {default as sub_cons} from '../constants/token-lists/sub_cons.json';
import {default as pop_cons} from '../constants/token-lists/pop_cons.json';
import {web3, contract_address, provider, signer} from '../constants/constants';
import {pair_abi, factory_abi, routerV2_abi, contract_abi} from '../constants/abis/triangular.ABI';
import {pancake_address} from '../constants/addresses/addresses';
import {pancakeRouter, apeRouter} from '../constants/router/routers';
import { _tokenAddress, bscscan } from './bsscan';
import { JsonEncoderService } from '../workers/json-encoder.service';

import { from, Observable } from 'rxjs';

// import { bsscan, } from '../interfaces/tri_interface';

export let apePairPrice = 0;
export let whichPair = 0;
export let apeSwapTokenName: string;

type MapType = { 
    [id: string]: string; 
}
export let apeTokenMap: MapType = {};  
 


@Injectable({providedIn: 'root'})
export class ApeService {
    gas_price !: ethers.BigNumber;

    factory !: ethers.Contract;
    reserve : any;
    invokePair !: ethers.Contract;
    reserve0 : number = 0;
    reserve1 : number = 0;

    Mouter !: ethers.Contract;
    cumulative : number = 0;
    pair : number = 0;

    shouldStart : boolean = false;

    max_from_pairs : number = 0;

    tokenAddress0 : string = '';
    tokenAddress1 : string = '';


    constructor(public _bscan : bscscan,public jsonEncoderServer:JsonEncoderService) {}

    public conventionSwitch(ops: string) {
        apeSwapTokenName = ops;
        switch (ops) {
            case 'wbnb':
                this.tokenAddress0 = pop_cons.wbnb;
                this.tokenAddress1 = pop_cons.busd;
                this.exchangeFactories();
                break;
            case 'shiba':
                this.tokenAddress0 = sub_cons.shiba;
                this.tokenAddress1 = pop_cons.busd;
                this.exchangeFactories();
                break;
            case 'eth':
                this.tokenAddress0 = pop_cons.eth;
                this.tokenAddress1 = pop_cons.busd;
                this.exchangeFactories();

                break;
            default:
              
                 

        }

        
      
    }

    public async exchangeFactories() {
        this.factory = new ethers.Contract(pancake_address, factory_abi, signer);
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
        apePairPrice = withBalanceOf - (0.3 * withBalanceOf) / 100;
        apeTokenMap[apeSwapTokenName]  = (apePairPrice.toString());  
       // this.jsonEncoderServer.jsonObject();
        // 0.30% fee


        // *

        // console.log(`\x1b[33m[ApeSwap]  ${cumulative}  _ tokenname            = ${
        //     apePairPrice.toFixed(8)
        // } BUSD\x1b[0m`);
    }

    public priceCheck() :boolean{
        if (apePairPrice = 0) {return false;}
       return true;    
    }

    // public appGetTotalFighters(): Observable<any> {
    // const source = from(this.contract.totalFighters());
    // return source;
    // }

    // apply routers
    async router() {
        this.Mouter = new ethers.Contract(apeRouter, routerV2_abi, signer);
    }

}
