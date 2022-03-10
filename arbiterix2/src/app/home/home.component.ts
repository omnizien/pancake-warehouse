import { Component, OnInit  } from '@angular/core';
import { fromEvent, Observable, of, Subscription, interval } from 'rxjs';
import { timer, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BigNumber, ethers } from 'ethers';
import { ArbitrageService } from '../providers/arbitrage.service';   
import { Router } from '@angular/router';  
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
  
 



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

 
  ngOnInit(): void {
    
  }
  
  title = '';

LastBlock: any;
SafeGasPrice: any;
ProposeGasPrice: any;
FastGasPrice: any;
BnbUsdPrice: any;
_tokenAddress: any;
token0price: any;
//public cake: pancakeService
  
 

 
  constructor(public arb: ArbitrageService) {
  
    
}
 
web3 = new ethers.providers.WebSocketProvider(
  'wss://rpc-mainnet.matic.quiknode.pro'
);

source = timer(1000, 2000).subscribe((x) => {
  // this.BnbUsdPrice = this.makeRequest();
  this.bscDataInit();
 // this.cake.panccakeDataAlternator();
  this.arb.runBot();
 // this.title = this.BnbUsdPrice.toString();
});
//https://geckoterminal.com/bsc/pools/0x58f876857a02d6762e0101bb5c46a8c1ed44dc16?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart

  bscDataInit = async () => {
 


  let num = fetch(
    'https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=VHI95QI4QUE4DYGB63U3VJIRV1ED9WXBBU'
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.FastGasPrice;
      let i: any;
      for (i in data) {
        if (data[i] instanceof Object) {
          this.LastBlock = parseFloat(data[i]['LastBlock']);
          // console.log("LastBlock: " + LastBlock);
          this.SafeGasPrice = parseFloat(data[i]['SafeGasPrice']);
          // console.log("ProposeGasPrice: " + SafeGasPrice);
          this.ProposeGasPrice = parseFloat(data[i]['ProposeGasPrice']);
          //  console.log("FastGasPrice: " + ProposeGasPrice);
          this.FastGasPrice = parseFloat(data[i]['FastGasPrice']);
          // console.log("FastGasPrice: " + FastGasPrice);
          this.BnbUsdPrice = parseFloat(data[i]['UsdPrice']);
          console.log('bscan: ' + this.BnbUsdPrice);
        }
      }
    })
    .catch((err) => {
      console.log('bscScan Error:  ');
    });
  };
  

 
  

 


 

}
