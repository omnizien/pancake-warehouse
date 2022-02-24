//test file

  
var LastBlock;
var MinGasPrice;
var ProposeGasPrice;
var MaxGasPrice;
var BaseToken_UsdPrice;

 
const web3 = new Web3(
  new Web3.providers.WebsocketProvider('YOUR_PROVIDER')
);

const { JsonRpcProvider } = require("@ethersproject/providers");
const provider = new JsonRpcProvider("YOUR_RPC_PROVIDER");

const AMOUNT_usdToken_WEI = web3.utils.toBN(web3.utils.toWei("20000")); //20000 is arbitrary number
const AMOUNT_BaseToken_WEI = web3.utils.toBN(web3.utils.toWei("1"));




const baseTokenDataInit = async () => { 

  fetch(
    "YOUR_DATA_FETCH"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      MaxGasPrice;
      for (i in data) {
        if (data[i] instanceof Object) {
          LastBlock = parseFloat(data[i]["LastBlock"]);
         // console.log("LastBlock: " + LastBlock);
          MinGasPrice = parseFloat(data[i]["SafeGasPrice"]);
         // console.log("ProposeGasPrice: " + SafeGasPrice);
          ProposeGasPrice = parseFloat(data[i]["ProposeGasPrice"]);
        //  console.log("FastGasPrice: " + ProposeGasPrice);
          MaxGasPrice = parseFloat(data[i]["FastGasPrice"]);
         // console.log("FastGasPrice: " + FastGasPrice);
          BaseToken_UsdPrice = parseFloat(data[i]["UsdPrice"]);  
          console.log(BaseToken_UsdPrice);
        }
      }
  
    })
    .catch((err) => {
      console.log("bscScan Error:  ");
    });
}


const init = async () => {

  web3.eth
    .subscribe("newBlockHeaders")
    .on("data", async (block) => {
      console.log(`New block received. Block # ${block.number}`);
   
      baseTokenDataInit();
         
      const pancake_usdToken = await Fetcher.fetchTokenData(
        pancakeChainId.MAINNET,
        addresses.tokens.usdToken,
        provider
      );
      const pancake_wBaseToken = await Fetcher.fetchTokenData(
        pancakeChainId.MAINNET,
        addresses.tokens.wBaseToken,
        provider
      );
      const pancake_usdTokenWBaseToken = await Fetcher.fetchPairData(
        pancake_usdToken,
        pancake_wBaseToken,
        provider
      );

      const pancakeswapResults = await Promise.all([
        pancake_usdTokenWBaseToken.getOutputAmount(
          new TokenAmount(pancake_usdToken, AMOUNT_usdToken_WEI)
        ),
        pancake_usdTokenWBaseToken.getOutputAmount(
          new TokenAmount(pancake_wBaseToken, AMOUNT_BaseToken_WEI)
        ),
      ]);

      const pancakeswapRates = {
        buy: parseFloat(
          AMOUNT_usdToken_WEI / (pancakeswapResults[0][0].toExact() * 10 ** 18)
        ),
        sell: parseFloat(pancakeswapResults[1][0].toExact()),
      };

 
      const sushiPair = await sushiData.exchange.pair({
        pair_address: "PAIR_ADDRESS",
      });

   
      const sushiPairRates = {
        buy: parseFloat(
          AMOUNT_usdToken_WEI / (pancakeswapResults[0][0].toExact() * 10 ** 18)
        ),
        sell: parseFloat(pancakeswapResults[1][0].toExact()),
      };

 
 
      var sushiTradeFeePercentage = 0.3;
      var sushiTradeFee = (sushiTradeFeePercentage / 100) * sushiPair.token1Price;
      var pancakeTradeFeePercentage = 0.2;
      var pancakeTradeFee = (pancakeTradeFeePercentage / 100) * pancakeswapRates.sell;
      
      console.log("trade fee " );
      console.log(sushiTradeFee);
      
      var amountOfTokenA = 1;
     
       console.log("pancake buy ");
      console.log(pancakeswapRates.buy);
      console.log("pancake sell ");
      console.log(pancakeswapRates.sell);

      console.log("sushi buy ");
      console.log(sushiPair.token1Price);
      console.log("suhhi sell ");
      console.log(sushiPair.token1Price);
      
      // incomplete
      const profit1 = ( amountOfTokenA *  (pancakeswapRates.buy  - sushiPair.token1Price));  
      const profit2 = (amountOfTokenA * (sushiPair.token1Price  - pancakeswapRates.sell)) ;    

      console.log("profit1   ");
      console.log(profit1);
      console.log("profit2   ");
      console.log(profit2);

      if (profit1 > 0) {
        console.log("Arb opportunity found!");
        console.log(
          `Buy BaseToken on pancakeswap at ${pancakeswapRates.buy} _ _ _ _`
        );  
        console.log(`Sell BaseToken on sushi at ${sushiPair.token1Price}  `); 
        console.log(`Expected profit: ${profit1}  `);
        
      } else if (profit2 > 0) {
        console.log("Arb opportunity found!");
        console.log(`Buy BaseToken from sushi at ${sushiPair.token1Price}  `);  
        console.log(`Sell BaseToken from pancakeswap at ${pancakeswapRates.sell}  `);  
        console.log(`Expected profit: ${profit2}  `);
       
      }
    })
    .on("error", (error) => {
      console.log(error);
    });
};
init();
 
 