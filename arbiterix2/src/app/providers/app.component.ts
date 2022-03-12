import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Columns, Config, DefaultConfig} from 'ngx-easy-table';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {interval, Observable, Subject, timer} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {HomeComponent} from './home/home.component';
import {PancakeService, pancakePairPrice, pancakeTokenMap} from './providers/pancake.service';
import {ApeService, apePairPrice, apeTokenMap} from './providers/ape.service';
import {BakeryService, bakeryPairPrice, bakeryTokenMap } from './providers/bakery.service';
import {data1 as _data1, data2 as _data2, columns as _columns} from './constants/data/table_data';
import {JsonEncoderService, jsonStr} from './workers/json-encoder.service';
import {NgxDatatableModule, ColumnMode} from '@swimlane/ngx-datatable';

export let arbentina: string;


interface Data {
    status: string;
    amount: number;
    company: string;
    limit: number;
    balance: number;
}

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'], changeDetection: ChangeDetectionStrategy.OnPush})export class AppComponent {
    @ViewChild('mydatatable')mydatatable : any;


    columns1 = [
        {
            prop: 'exchange'
        }, {
            name: 'token'
        }, {
            name: 'value'
        }
    ];

    columns2 = [
        {
            prop: 'name',
            name: 'Name'
        }, {
            name: 'Gender'
        }
    ];


    ColumnMode = ColumnMode;

    rows1 = [{
            exchange: 'arbentinaswap',
            token: 'arbentina gold',
            value: '.00001'
        }];

    rows2 = [{
            name: 'Callie',
            gender: 'Female'
        }];
    constructor(private cd : ChangeDetectorRef, private cdr : ChangeDetectorRef, public cake : PancakeService, public bake : BakeryService, public ape : ApeService, public jsonEncoderServer : JsonEncoderService) {}


    ops : number = 0;

    source = timer(100, 1000).subscribe(async (x) => {
        switch (this.ops) {
          case 0: arbentina = "wbnb";
            
            this.cake.conventionSwitch(arbentina);
            this.bake.conventionSwitch(arbentina);
            this.ape.conventionSwitch(arbentina);

            
                        this.rows1[0] = {
                            exchange: 'pancake',
                            token: "wbnb",
                            value: pancakeTokenMap["wbnb"].toString()
                        }


                        this.rows1[1] = {
                            exchange: 'bakery',
                            token: "wbnb",
                            value: bakeryTokenMap["wbnb"].toString()
                        }

                        this.rows1[2] = {
                            exchange: 'ape',
                            token: "wbnb",
                            value: apeTokenMap["wbnb"].toString()
                        }

                  

             

                // this.jsonEncoderServer.jsonObject();
                this.ops = 1;
            // console.log(pancakeTokenMap );
     
           // console.log(pancakeTokenMap["eth"].toString());
                // this.rows1.push({ name: arbentina, gender: arbentina, company: arbentina });
                // console.log(this.rows1);
                this.rows1 = [...this.rows1];

                break;
            case 1: arbentina = "shiba";
                this.cake.conventionSwitch(arbentina);
              
                    this.rows1[3] = {
                        exchange: 'pancake',
                        token:"shiba",
                      value: pancakeTokenMap[ "shiba"].toString()
                    }
              
                this.bake.conventionSwitch(arbentina);
                
                    this.rows1[4] = {
                        exchange: 'bakery',
                        token:  "shiba",
                        value: bakeryTokenMap[ "shiba"].toString()
                    }
             
                this.ape.conventionSwitch(arbentina);
             
                    this.rows1[5] = {
                        exchange: 'ape',
                        token:  "shiba",
                        value: apeTokenMap[ "shiba"].toString()
                    }
               
                // this.jsonEncoderServer.jsonObject();
                this.ops = 0;
                // this.rows1[1] ={ name: arbentina, gender: arbentina, company: arbentina }
                this.rows1 = [...this.rows1];

                break;
            case 2: arbentina = "eth";
                this.cake.conventionSwitch(arbentina);
               
                    this.rows1[6] = {
                        exchange: 'pancake',
                        token: arbentina,
                        value: pancakeTokenMap[arbentina].toString()
                    }
                
                this.bake.conventionSwitch(arbentina);
                
                    this.rows1[7] = {
                        exchange: 'bakery',
                        token: arbentina,
                        value: (bakeryPairPrice).toString()
                    }
               
                this.ape.conventionSwitch(arbentina);
                
                    this.rows1[8] = {
                        exchange: 'ape',
                        token: arbentina,
                        value: (apePairPrice).toString()
                    }
                
                // this.jsonEncoderServer.jsonObject();
                this.ops = 0;
                // this.rows1[2] ={ name: arbentina, gender: arbentina, company: arbentina }
                this.rows1 = [...this.rows1];

                break;
            default:
                console.log("Invalid operator");
        }

        this.rows1.push();

        this.cd.markForCheck();

    });


}


// https://ngx-easy-table.eu/#/
// http://localhost:4200/#/dynamic-row
// https://auth0.com/blog/real-time-charts-using-angular-d3-and-socket-io/
// "allowSyntheticImports" = true in tsconfig
// https://thegraph.com/hosted-service/subgraph/mmontes11/pancakeswap?query=Example%20query
// https://api.thegraph.com/subgraphs/name/mmontes11/pancakeswap
// https://www.typescriptlang.org/docs/handbook/modules.html
// https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider

// export interface ServerResponse {
// generated: boolean;
// }

// https://stackoverflow.com/questions/37587732/how-to-call-another-components-function-in-angular2https://stackoverflow.com/questions/37587732/how-to-call-another-components-function-in-angular2
// https://github.com/mdichtler/PancakeSwap-Price-Scraper/blob/main/scraper/__init__.py
// private _init = async () => {
// const pancake_token0 = await pancakeData.Fetcher.fetchTokenData(
//     pancakeData.ChainId.MAINNET,
//     this._tokenAddress.busd,
//     this.provider
// );
// // console.log(pancake_busd);
// const pancake_token1 = await pancakeData.Fetcher.fetchTokenData(
//     pancakeData.ChainId.MAINNET,
//     this._tokenAddress.wbnb,
//     this.provider
// );
// console.log(pancake_token1);

// const pancake_pairData = await pancakeData.Fetcher.fetchPairData(
//     pancake_token0,
//     pancake_token1,
//     this.provider
// );

// const uniswapResults = await Promise.all([
//         daiWeth.getOutputAmount(new TokenAmount(dai, AMOUNT_DAI_WEI)),
//         daiWeth.getOutputAmount(new TokenAmount(weth, AMOUNT_ETH_WEI))
//       ]);
//       const uniswapRates = {
//         buy: parseFloat( AMOUNT_DAI_WEI / (uniswapResults[0][0].toExact() * 10 ** 18)),
//         sell: parseFloat(uniswapResults[1][0].toExact() / AMOUNT_ETH),
//       };
//       console.log('Uniswap ETH/DAI');
// console.log(uniswapRates);

// console.log(pancake_token0);
// console.log(pancake_token1);

// const pancakeswapResults = await Promise.all([
// pancake_pairData.getInputAmount(
//     new TokenAmount(pancake_token0, this.AMOUNT_BUSD_WEI.toString())
//     //      daiWeth.getOutputAmount(new TokenAmount(dai, AMOUNT_DAI_WEI)),
//     //     daiWeth.getOutputAmount(new TokenAmount(weth, AMOUNT_ETH_WEI))
// ),

// pancake_pairData.getOutputAmount(
//     new pancakeData.TokenAmount(
//       pancake_token0,
//       this.AMOUNT_BUSD_WEI.toString()
//     )
// ),
// pancake_pairData.getOutputAmount(
//     new pancakeData.TokenAmount(
//       pancake_token1,
//       this.AMOUNT_BNB_WEI.toString()
//     )
// ),
// ]);

// const what =
//     Number(this.AMOUNT_BUSD_WEI) /
//     (Number(pancakeswapResults[0][0].toExact()) * 10 ** 18);
// const what2 =
//     Number(this.AMOUNT_BUSD_WEI) /
//     (Number(pancakeswapResults[1][0].toExact()) * 10 ** 18);
// const pancakeswapRates = {
//     buy:
//       Number(this.AMOUNT_BUSD_WEI) /
//       (Number(pancakeswapResults[0][0].toExact()) * 10 ** 18),
//     sell: Number(pancakeswapResults[1][0].toExact()) * 10 ** 18,
// }; //"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"

// console.log("buy");
// console.log(pancakeswapRates.buy);
// console.log("sell");
// console.log(pancakeswapRates.sell);

// };
