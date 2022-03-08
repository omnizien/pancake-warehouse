import { Injectable, OnInit, Input } from '@angular/core';
import { fromEvent, Observable, of, Subscription, interval } from 'rxjs';
import * as pancakeData from '@pancakeswap/sdk'; //{ ChainId, TokenAmount, Fetcher, Pair }
import { default as sub_cons } from '../constants/token-lists/sub_cons.json'
import { default as pop_cons } from '../constants/token-lists/pop_cons.json' //"esModuleInterop": true,  "resolveJsonModule": true,

import { BigNumber, ethers } from 'ethers';
import { CurrencyAmount, TokenAmount } from '@pancakeswap/sdk';
import { stringify } from 'querystring';
import * as ethrs from '@ethersproject/providers';

@Injectable({
  providedIn: 'root',
})
export class pancakeService {
  provider: ethers.providers.JsonRpcProvider;
  _tokenAddress: any;
  pancake_pairData?: any;
  pancake_token0: any;
  pancake_token1: any;
  pancakeswapResults: any;

  AMOUNT_token0_WEI: any;
  AMOUNT_token1_WEI: any;

  constructor( ) {
    const _pancake_pairData: pancakeData.Pair = this.pancake_pairData;
    const _pancake_token0: pancakeData.Token = this.pancake_token0;
    const _pancake_token1: pancakeData.Token = this.pancake_token1;
    // const _AMOUNT_BUSD_WEI: BigNumber = this.AMOUNT_BUSD_WEI;
    // const _AMOUNT_BNB_WEI: BigNumber = this.AMOUNT_BNB_WEI;
    this.provider = new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org/'
    );
  }

  public async panccakeDataAlternator() {
    this.fetchTokenStreamer();
    this.fetchPairStreamer();
     this.bigNumberConverter();
      this.pairResultsStreamer();
    // this.pancakeSwapRates();
 
  }


 public async fetchTokenStreamer() {
  const provider = new ethers.providers.JsonRpcProvider(
     'https://bsc-dataseed.binance.org/'
   );

   
   this.pancake_token0 = await pancakeData.Fetcher.fetchTokenData(
     pancakeData.ChainId.MAINNET,
     pop_cons.wbnb,
     provider
   );

    this.pancake_token1 = await pancakeData.Fetcher.fetchTokenData(
     pancakeData.ChainId.MAINNET,
     pop_cons.busd,
     provider
   );

   console.log(this.pancake_token0);
   console.log(this.pancake_token1);
 }



  public async fetchPairStreamer() {
    this.pancake_pairData = await pancakeData.Fetcher.fetchPairData(
      this.pancake_token0,
      this.pancake_token1,
      this.provider
    );
    console.log(this.pancake_pairData);
  }

  public async bigNumberConverter() {
    this.AMOUNT_token0_WEI = ethers.BigNumber.from(
      ethers.utils.formatUnits(1, 'wei')
    );
    this.AMOUNT_token1_WEI = ethers.BigNumber.from(
      ethers.utils.formatUnits(1, 'wei')
    );
  }

  public async pairResultsStreamer() {
    const pancakeswapResults = await Promise.all([
      this.pancake_pairData.getOutputAmount(
        new TokenAmount(this.pancake_token0, this.AMOUNT_token0_WEI.toString()) //insufficient amount error
      ),
      this.pancake_pairData.getOutputAmount(
        new TokenAmount(this.pancake_token1, this.AMOUNT_token1_WEI.toString())
      ),
    ]);
  }

  
  public async hold() {
    const [wbnb, usdc] = await Promise.all(
      [pop_cons.wbnb, pop_cons.usdc].map<any>((_tokenAddress) =>
        pancakeData.Fetcher.fetchTokenData(
          pancakeData.ChainId.MAINNET,
          _tokenAddress,
          this.provider
        )
      )
    );
  }

  
 public async pancakeSwapRates() {
  const pancakeswapRates = {
    buy:
      Number(this.AMOUNT_token0_WEI) /
      (Number(this.pancakeswapResults[0][0].toExact()) * 10 ** 18),
    sell: Number(this.pancakeswapResults[1][0].toExact()),
  }; //"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"

  console.log('buy');
  console.log(pancakeswapRates.buy);
  console.log('sell');
  console.log(pancakeswapRates.sell);
}

 
  
}
//https://ethereum.stackexchange.com/questions/103150/balanceof-giving-wrong-value-on-binance-chain-using-ethers-js
