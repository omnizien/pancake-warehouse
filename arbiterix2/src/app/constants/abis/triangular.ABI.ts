  
 export const pair_abi = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  ];

  export const factory_abi = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  ];

  export const routerV2_abi = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)',
  ];

  export const  contract_abi = [
    'function startArbitage(address token0, address token1, uint256 amount0, uint256 amount1, address sourceRouter, address targetRouter) external',
  ];


