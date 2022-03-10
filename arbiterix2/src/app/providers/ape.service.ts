import { EventEmitter, Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { default as sub_cons } from '../constants/token-lists/sub_cons.json';
import { default as pop_cons } from '../constants/token-lists/pop_cons.json';
import {
  pair_abi,
  factory_abi,
  routerV2_abi,
  contract_abi,
} from '../constants/abis/triangular.ABI';
import {
  pancake_address,
  bakery_address,
  ape_address,
} from '../constants/addresses/addresses';
import {
  pancakeRouter,
  bakeryRouter,
  apeRouter,
} from '../constants/router/routers';
import {LastBlock,SafeGasPrice, ProposeGasPrice,FastGasPrice,BnbUsdPrice, _tokenAddress, token0price,bscscan } from './bsscan'
import { from, Observable } from 'rxjs';
// import { bsscan, } from '../interfaces/tri_interface';

export let apePairPrice = 0;
export let whichPair = 0


@Injectable({
  providedIn: 'root',
})
export class ApeService  {

// LastBlock: any;
// SafeGasPrice: any;
// ProposeGasPrice: any;
// FastGasPrice: any;
// BnbUsdPrice: any;
// _tokenAddress: any;
// token0price: any;


  gas_price!: ethers.BigNumber;

  factory!: ethers.Contract;
  reserve: any;
  invokePair!: ethers.Contract;

  reserve0: number = 0;
  reserve1: number = 0;

  Mouter!: ethers.Contract;
  cumulative: number = 0;
  pair: number = 0;

  shouldStart: boolean = false;

    max_from_pairs: number = 0;
    
  tokenAddress0: string = "";
  tokenAddress1: string = "";

constructor(public _bscan: bscscan) { }

  web3 = new ethers.providers.WebSocketProvider(
    'wss://rpc-mainnet.matic.quiknode.pro'
  );

  contract_address = '0xEB537CaBb5bb8bcaE71108e2DdA1Ba9B8e576CAa';

  apeEmitter = new EventEmitter<number>();

  provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org/'
  );

  signer = new ethers.Wallet(
    `0x${'44410aa438c163222cafe93153dd582bdf7c3da30d688b7013086121'}`,
    this.provider
  );

    
  //  operation: number = 0; 
  public conventionSwitch(ops:number) {
    
    switch (ops) {
      case 0: 
        this.tokenAddress0 = pop_cons.wbnb;
        this.tokenAddress1 = pop_cons.busd;        
        break;
      case 1:
        this.tokenAddress0 = sub_cons.shiba;
        this.tokenAddress1 = pop_cons.busd;  
        break;
        case 2:
        this.tokenAddress0 = pop_cons.eth;
        this.tokenAddress1 = pop_cons.busd;
        
        break;
      default:
        console.log("Invalid operator");
    }

    console.log("------------------------- ? " + ops);

    this.exchangeFactories();


  }

  public runBot = async () => {
    // this.conventionSwitch();
    this._bscan.bscDataInit();
    console.log(FastGasPrice);

    try {
      // this.exchangeFactories();
      this.establishPair();
        this.pairReserve;
      this.pairPricing();
      this.router();
    //  this.activateArbitrage();
    } catch (err) {
      console.log(`========${err}========`);
    } 
  };


  public exchangeFactories() {

    this.factory = new ethers.Contract(
      ape_address,
      factory_abi,
      this.signer
    );
  }


  public establishPair() {
     
    const getPair =   this.factory['getPair'](
      this.tokenAddress0,
      this.tokenAddress1
    ); //no fren 
    this.invokePair = new ethers.Contract(
      getPair,
     pair_abi,
     this.signer
   );
  }

  async pairReserve()
  { 
     this.reserve = await this.invokePair['getReserves']();
     this.reserve0 = Number(ethers.utils.formatUnits(this.reserve[0], 18));
    this.reserve1 = Number(ethers.utils.formatUnits(this.reserve[1], 18));
  }

 

  public async pairPricing() {

    const balanceOf = 1;
    const ape_cumulative = this.reserve1 / this.reserve0;
    const ape_withBalanceOf = ape_cumulative * balanceOf;
    this.pair =
    ape_withBalanceOf - (0.3 * ape_withBalanceOf) / 100; //0.30% fee
    apePairPrice = this.pair; //*
    console.log(
      `\x1b[33m[ApeSwap]  ${ape_cumulative}  _ tokenname            = ${this.pair.toFixed(
        8
      )} BUSD\x1b[0m`
    );
  
  }








  // public appGetTotalFighters(): Observable<any> {
  //   const source = from(this.contract.totalFighters());
  //   return source;
  // }

 
  
  //apply routers
  async router() {
 
    this.Mouter = new ethers.Contract(apeRouter, routerV2_abi, this.signer);
  }





//   //begin aritrage contract
//   public async activateArbitrage() {

//     this.max_from_pairs = this.bakery_pair < this.ape_pair ? this.ape_pair : this.bakery_pair;
//     this.shouldStart = this.pancake_pair < this.max_from_pairs;

//     let loan = ethers.utils.parseEther('2.0');
//     let zero = ethers.utils.parseEther('0.0');

//     const contract = new ethers.Contract(
//       this.contract_address,
//       contract_abi,
//       this.signer
//     );

//     while (this.shouldStart) {
//       if (this.max_from_pairs == this.bakery_pair) {
//         console.log(
//           `\x1b[33mWe are going [pancake] -> [bakery] -> [pancake]\x1b[0m`
//         );
//       }
//       let tx = await contract['startArbitage'](
//         pop_cons.wbnb,
//         pop_cons.busd,
//         zero,
//         loan,
//         pancakeRouter,
//         bakeryRouter,
//         {
//           gasLimit: 300000,
//           gasPrice: this.gas_price,
//         }
//       );
//       await tx.wait();
//       console.log(`🔥 ${tx}`);
//     }

//     if (this.max_from_pairs == this.ape_pair) {
//       console.log(
//         `\x1b[33mWe are going [pancake] -> [ape] -> [pancake]\x1b[0m`
//       );
//       let tx = await contract['startArbitage'](
//         pop_cons.wbnb,
//         pop_cons.busd,
//         zero,
//         loan,
//         pancakeRouter,
//         apeRouter,
//         {
//           gasLimit: 300000,
//           gasPrice: this.gas_price,
//         }
//       );
//       await tx.wait();
//       console.log(`🔥 ${tx}`);
//     }
//   }

 
    
  
}

