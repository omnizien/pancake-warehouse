import { Injectable } from "@angular/core";

export let LastBlock = 0;
export let SafeGasPrice = 0;
export let ProposeGasPrice = 0;
export let FastGasPrice= 0;
export let BnbUsdPrice = 0;
export let _tokenAddress  = 0;
export let token0price = 0;

  
@Injectable({
    providedIn: 'root',
  })
export class bscscan {

    bscDataInit = async () => {

        const num = fetch(
            'https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=VHI95QI4QUE4DYGB63U3VJIRV1ED9WXBBU'
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
        
                let i: any;
                for (i in data) {
                    if (data[i] instanceof Object) {
                         LastBlock = parseFloat(data[i]['LastBlock']);
                        // console.log("LastBlock: " + LastBlock);
                         SafeGasPrice = parseFloat(data[i]['SafeGasPrice']);
                        // console.log("ProposeGasPrice: " + SafeGasPrice);
                          ProposeGasPrice = parseFloat(data[i]['ProposeGasPrice']);
                        //  console.log("FastGasPrice: " + ProposeGasPrice);
                         FastGasPrice = parseFloat(data[i]['FastGasPrice']);
                        console.log("FastGasPrice: " + FastGasPrice);
                        
                         BnbUsdPrice = parseFloat(data[i]['UsdPrice']);
                         console.log('bscan: ' + BnbUsdPrice);
                    }
                }
            })
            .catch((err) => {
                console.log('bscScan Error:  ');
            });
    };
}