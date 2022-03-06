import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ArbitrageService {
  constructor() {}

  pancake_address = ' ';
  bakery_address = ' ';
  ape_address = ' ';
 
  pancakeRouter = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
  bakeryRouter = '0xCDe540d7eAFE93aC5fE6233Bee57E1270D3E330F';
  apeRouter = '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7';

  contract_address = '0xEB537CaBb5bb8bcaE71108e2DdA1Ba9B8e576CAa';

  provider = new ethers.providers.JsonRpcProvider(
    ' '
  );
  signer = new ethers.Wallet(
    `0x${' '}`,
    this.provider
  );

  pair_abi = [
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  ];

  factory_abi = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  ];

  routerV2_abi = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)',
  ];

  contract_abi = [
    'function startArbitage(address token0, address token1, uint256 amount0, uint256 amount1, address sourceRouter, address targetRouter) external',
  ];

  runBot = async () => {
    const gas_price = await this.provider.getGasPrice();

    const contract = new ethers.Contract(
      this.contract_address,
      this.contract_abi,
      this.signer
    );

    const pancakeFactory = new ethers.Contract(
      this.pancake_address,
      this.factory_abi,
      this.signer
    );
    const bakeryFactory = new ethers.Contract(
      this.bakery_address,
      this.factory_abi,
      this.signer
    );
    const apeFactory = new ethers.Contract(
      this.ape_address,
      this.factory_abi,
      this.signer
    );

    const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    const BUSD = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';

    const resPancake = await pancakeFactory['getPair'](WBNB, BUSD);
    const resBakery = await bakeryFactory['getPair'](WBNB, BUSD);
    const resApe = await apeFactory['getPair'](WBNB, BUSD);

    const Pancake_WBNB_TO_BUSD = new ethers.Contract(
      resPancake,
      this.pair_abi,
      this.signer
    );

    const Bakery_WBNB_TO_BUSD = new ethers.Contract(
      resBakery,
      this.pair_abi,
      this.signer
    );
    const Ape_WBNB_TO_BUSD = new ethers.Contract(
      resApe,
      this.pair_abi,
      this.signer
    );

    const Pouter = new ethers.Contract(
      this.pancakeRouter,
      this.routerV2_abi,
      this.signer
    );
    const Bouter = new ethers.Contract(
      this.bakeryRouter,
      this.routerV2_abi,
      this.signer
    );
    const Mouter = new ethers.Contract(
      this.apeRouter,
      this.routerV2_abi,
      this.signer
    );

    try {
      const pancakeReserves = await Pancake_WBNB_TO_BUSD['getReserves']();
      const bakeryReserves = await Bakery_WBNB_TO_BUSD['getReserves']();
      const apeReserves = await Ape_WBNB_TO_BUSD['getReserves']();

      const pancake_reserve0 = Number(
        ethers.utils.formatUnits(pancakeReserves[0], 18)
      );
      const pancake_reserve1 = Number(
        ethers.utils.formatUnits(pancakeReserves[1], 18)
      );

      const bakery_reserve0 = Number(
        ethers.utils.formatUnits(bakeryReserves[0], 18)
      );
      const bakery_reserve1 = Number(
        ethers.utils.formatUnits(bakeryReserves[1], 18)
      );

      const ape_reserve0 = Number(ethers.utils.formatUnits(apeReserves[0], 18));
      const ape_reserve1 = Number(ethers.utils.formatUnits(apeReserves[1], 18));

      const pancake_pair = pancake_reserve1 / pancake_reserve0;
      const bakery_pair = bakery_reserve1 / bakery_reserve0;
      const ape_pair = ape_reserve1 / ape_reserve0;

      console.log(
        `\x1b[33m[PancakeSwap] 1 WBNB            = ${pancake_pair.toFixed(
          5
        )} BUSD\x1b[0m`
      );
      console.log(
        `\x1b[33m[BakerySwap]  1 WBNB            = ${bakery_pair.toFixed(
          5
        )} BUSD\x1b[0m`
      );
      console.log(
        `\x1b[33m[ApeSwap]     1 WBNB            = ${ape_pair.toFixed(
          5
        )} BUSD\x1b[0m`
      );

      const max_from_pairs = bakery_pair < ape_pair ? ape_pair : bakery_pair;
      const souldStart = pancake_pair < max_from_pairs;

      console.log(`\x1b[33m[souldStart]          = ${souldStart}\x1b[0m`);

      let loan = ethers.utils.parseEther('2.0');
      let zero = ethers.utils.parseEther('0.0');

      //   while (souldStart) {
      //     if (max_from_pairs == bakery_pair) {
      //       console.log(
      //         `\x1b[33mWe are going [pancake] -> [bakery] -> [pancake]\x1b[0m`
      //       );
      //       let tx = await contract.startArbitage(
      //         WBNB,
      //         BUSD,
      //         zero,
      //         loan,
      //         pancakeRouter,
      //         bakeryRouter,
      //         {
      //           gasLimit: 300000,
      //           gasPrice: gas_price,
      //         }
      //       );
      //       await tx.wait();
      //       console.log(`🔥 ${tx}`);
      //     }

      // if (max_from_pairs == ape_pair) {
      //   console.log(
      //     `\x1b[33mWe are going [pancake] -> [ape] -> [pancake]\x1b[0m`
      //   );
      //   let tx = await contract.startArbitage(
      //     WBNB,
      //     BUSD,
      //     zero,
      //     loan,
      //     pancakeRouter,
      //     apeRouter,
      //     {
      //       gasLimit: 300000,
      //       gasPrice: gas_price,
      //     }
      //   );
      //   await tx.wait();
      //   console.log(`🔥 ${tx}`);
      // }
      // }
    } catch (err) {
      console.log(`========${err}========`);
    }
    //end of the bot here
  };
}
