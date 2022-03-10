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

export let gasPrice = 0;
export let pancakePairPrice = 0;
export let bakeryPairPrice = 0;
export let apePairPrice = 0;
export let whichPair = 0


@Injectable({
  providedIn: 'root',
})
export class ArbitrageService  {

// LastBlock: any;
// SafeGasPrice: any;
// ProposeGasPrice: any;
// FastGasPrice: any;
// BnbUsdPrice: any;
// _tokenAddress: any;
// token0price: any;


  gas_price!: ethers.BigNumber;

  pancakeFactory!: ethers.Contract;
  bakeryFactory!: ethers.Contract;
  apeFactory!: ethers.Contract;
  pancakeReserve: any;
  bakeryReserve: any;
  apeReserve: any;

  pancake_invokePair!: ethers.Contract;
  ape_invokePair!: ethers.Contract;
  bakery_invokePair!: ethers.Contract;

  pancake_reserve0: number = 0;
  pancake_reserve1: number = 0;
  bakery_reserve0: number = 0;
  bakery_reserve1: number = 0;
  ape_reserve0: number = 0;
  ape_reserve1: number = 0;

  Pouter!: ethers.Contract;
  Bouter!: ethers.Contract;
  Mouter!: ethers.Contract;

  pancake_cumulative: number = 0;
  bakery_cumulative: number = 0;
  ape_cumulative: number = 0;

  pancake_pair: number = 0;
  bakery_pair: number = 0;
  ape_pair: number = 0;

  shouldStart: boolean = false;

  max_from_pairs: number = 0;


  tokenAddress0: string = "";
  tokenAddress1: string = "";

constructor(public _bscan: bscscan) { }

  web3 = new ethers.providers.WebSocketProvider(
    'wss://rpc-mainnet.matic.quiknode.pro'
  );

  contract_address = '0xEB537CaBb5bb8bcaE71108e2DdA1Ba9B8e576CAa';
  pancakeEmitter = new EventEmitter<number>();
  bakeryEmitter = new EventEmitter<number>();
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
      this.pancake_establishPair();
      this.bakery_establishPair();
      this.ape_establishPair();
       
      this.pancake_pairReserve();
      this.pairPricingPancake();
      this.pairPricingBakery()
      this.pairPricingApe();
      this.routers();
    //  this.activateArbitrage();
    } catch (err) {
      console.log(`========${err}========`);
    }

    
  };


  public exchangeFactories() {
    this.pancakeFactory = new ethers.Contract(
      pancake_address,
      factory_abi,
      this.signer
    );
    this.bakeryFactory = new ethers.Contract(
      bakery_address,
      factory_abi,
      this.signer
    );
    this.apeFactory = new ethers.Contract(
      ape_address,
      factory_abi,
      this.signer
    );
  }



  public  pancake_establishPair() {
    const pancake_getPair =  this.pancakeFactory['getPair'](
      this.tokenAddress0,
      this.tokenAddress1
    );
 
  }
  public bakery_establishPair() { 

    const bakery_getPair =  this.bakeryFactory['getPair'](
      this.tokenAddress0,
      this.tokenAddress1
    ); //no fren

    this.bakery_invokePair = new ethers.Contract(
      bakery_getPair,
     pair_abi,
     this.signer
   );

    
  }

  public ape_establishPair() {
     
    const ape_getPair =   this.apeFactory['getPair'](
      this.tokenAddress0,
      this.tokenAddress1
    ); //no fren

     
    this.ape_invokePair = new ethers.Contract(
      ape_getPair,
     pair_abi,
     this.signer
   );

  }

 
 
  async pancake_pairReserve() { 
    this.pancakeReserve = await this.pancake_invokePair['getReserves']();
    this.pancake_reserve0 = Number(ethers.utils.formatUnits(this.pancakeReserve[0], 18));
    this.pancake_reserve1 = Number(ethers.utils.formatUnits(this.pancakeReserve[1], 18));

  }
  async bakery_pairReserve() {
    this.bakeryReserve = await this.bakery_invokePair['getReserves']();
    this.bakery_reserve0 = Number(ethers.utils.formatUnits(this.bakeryReserve[0], 18));
    this.bakery_reserve1 = Number(ethers.utils.formatUnits(this.bakeryReserve[1], 18));
   }
 
  async ape_pairReserve()
  { 
     this.apeReserve = await this.ape_invokePair['getReserves']();
     this.ape_reserve0 = Number(ethers.utils.formatUnits(this.apeReserve[0], 18));
    this.ape_reserve1 = Number(ethers.utils.formatUnits(this.apeReserve[1], 18));
  

  }


  public async pairPricingPancake() {
    const balanceOf = 1;
    const pancake_cumulative = this.pancake_reserve1 / this.pancake_reserve0;
    const pancake_withBalanceOf = pancake_cumulative * balanceOf;
    this.pancake_pair =
      pancake_withBalanceOf - (0.25 * pancake_withBalanceOf) / 100; //0.25% fee
   // whichPair = this.operation ;   
    pancakePairPrice = this.pancake_pair;
    console.log(
      `\x1b[33m[PancakeSwap]   ${pancake_cumulative}   _ tokenname         = ${this.pancake_pair.toFixed(
        8
      )} BUSD\x1b[0m`
    );
    
   
  }


  public async pairPricingBakery() {
    const balanceOf = 1;
    const bakery_cumulative = this.bakery_reserve1 / this.bakery_reserve0;
    const bakery_withBalanceOf = bakery_cumulative * balanceOf;
    this.bakery_pair =
      bakery_withBalanceOf - (0.3 * bakery_withBalanceOf) / 100; //0.30% fee
    bakeryPairPrice = this.bakery_pair; //*
    console.log(
      `\x1b[33m[BakerySwap]  ${bakery_cumulative}  _ tokenname            = ${this.bakery_pair.toFixed(
        8
      )} BUSD\x1b[0m`
    );

  }

  public async pairPricingApe() {

    const balanceOf = 1;
    const ape_cumulative = this.ape_reserve1 / this.ape_reserve0;
    const ape_withBalanceOf = ape_cumulative * balanceOf;
    this.ape_pair =
    ape_withBalanceOf - (0.3 * ape_withBalanceOf) / 100; //0.30% fee
    apePairPrice = this.bakery_pair; //*
    console.log(
      `\x1b[33m[ApeSwap]  ${ape_cumulative}  _ tokenname            = ${this.ape_pair.toFixed(
        8
      )} BUSD\x1b[0m`
    );
    
     
  }








  // public appGetTotalFighters(): Observable<any> {
  //   const source = from(this.contract.totalFighters());
  //   return source;
  // }

 
  
  //apply routers
  async routers() {
    this.Pouter = new ethers.Contract(pancakeRouter, pair_abi, this.signer);
    this.Bouter = new ethers.Contract(bakeryRouter, routerV2_abi, this.signer);
    this.Mouter = new ethers.Contract(apeRouter, routerV2_abi, this.signer);
  }





  //begin aritrage contract
  public async activateArbitrage() {

    this.max_from_pairs = this.bakery_pair < this.ape_pair ? this.ape_pair : this.bakery_pair;
    this.shouldStart = this.pancake_pair < this.max_from_pairs;

    let loan = ethers.utils.parseEther('2.0');
    let zero = ethers.utils.parseEther('0.0');

    const contract = new ethers.Contract(
      this.contract_address,
      contract_abi,
      this.signer
    );

    while (this.shouldStart) {
      if (this.max_from_pairs == this.bakery_pair) {
        console.log(
          `\x1b[33mWe are going [pancake] -> [bakery] -> [pancake]\x1b[0m`
        );
      }
      let tx = await contract['startArbitage'](
        pop_cons.wbnb,
        pop_cons.busd,
        zero,
        loan,
        pancakeRouter,
        bakeryRouter,
        {
          gasLimit: 300000,
          gasPrice: this.gas_price,
        }
      );
      await tx.wait();
      console.log(`🔥 ${tx}`);
    }

    if (this.max_from_pairs == this.ape_pair) {
      console.log(
        `\x1b[33mWe are going [pancake] -> [ape] -> [pancake]\x1b[0m`
      );
      let tx = await contract['startArbitage'](
        pop_cons.wbnb,
        pop_cons.busd,
        zero,
        loan,
        pancakeRouter,
        apeRouter,
        {
          gasLimit: 300000,
          gasPrice: this.gas_price,
        }
      );
      await tx.wait();
      console.log(`🔥 ${tx}`);
    }
  }

 
    
  
}

