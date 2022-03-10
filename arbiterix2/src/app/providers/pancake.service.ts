import { EventEmitter, Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { default as sub_cons } from '../constants/token-lists/sub_cons.json';
import { default as pop_cons } from '../constants/token-lists/pop_cons.json';
import {
  web3,
  contract_address,
  provider,
  signer,
} from '../constants/constants';
import {
  pair_abi,
  factory_abi,
  routerV2_abi,
  contract_abi,
} from '../constants/abis/triangular.ABI';
import { pancake_address } from '../constants/addresses/addresses';
import { pancakeRouter } from '../constants/router/routers';
import {
  LastBlock,
  SafeGasPrice,
  ProposeGasPrice,
  FastGasPrice,
  BnbUsdPrice,
  _tokenAddress,
  token0price,
  bscscan,
} from './bsscan';
import { from, Observable } from 'rxjs';
// import { bsscan, } from '../interfaces/tri_interface';

export let pairPrice = 0;
export let whichPair = 0;

 



@Injectable({
  providedIn: 'root',
})
export class PancakeService {
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

  tokenAddress0: string = '';
  tokenAddress1: string = '';

  

  constructor(public _bscan: bscscan) {}

  public conventionSwitch(ops: string) {
    switch (ops) {
      case 'wbnb':
        this.tokenAddress0 = pop_cons.wbnb;
        this.tokenAddress1 = pop_cons.busd;
        break;
      case 'shiba':
        this.tokenAddress0 = sub_cons.shiba;
        this.tokenAddress1 = pop_cons.busd;
        break;
      case 'eth':
        this.tokenAddress0 = pop_cons.eth;
        this.tokenAddress1 = pop_cons.busd;

        break;
      default:
        console.log('Invalid operator');
    }

    console.log('------------------------- ? ' + ops);
    this.exchangeFactories();
  }

  public async exchangeFactories() {
    this.factory = new ethers.Contract(pancake_address, factory_abi, signer);
    this.establishPair();
  }

  public async establishPair() {
    console.log('?');

    const getPair = await this.factory['getPair'](
      this.tokenAddress0,
      this.tokenAddress1
    ); //no fren
    this.invokePair = new ethers.Contract(getPair, pair_abi, signer);
    this.pairReserve();
  }

  public async pairReserve() {
    console.log('??????');
    this.reserve = await this.invokePair['getReserves']();
    console.log('this.reserve');
    console.log(this.reserve);
    this.reserve0 = Number(ethers.utils.formatUnits(this.reserve[0], 18));
    this.reserve1 = Number(ethers.utils.formatUnits(this.reserve[1], 18));
    console.log(this.reserve0);
    this.pairPricing();
  }

  public async pairPricing() {
    const balanceOf = 1;
    const cumulative = this.reserve1 / this.reserve0;
    const withBalanceOf = cumulative * balanceOf;
    this.pair = withBalanceOf - (0.3 * withBalanceOf) / 100; //0.30% fee
    console.log(this.pair);

    pairPrice = this.pair; //*

    console.log(
      `\x1b[33m[PancakeSwap]  ${cumulative}  _ tokenname            = ${this.pair.toFixed(
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
    this.Mouter = new ethers.Contract(pancakeRouter, routerV2_abi, signer);
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
