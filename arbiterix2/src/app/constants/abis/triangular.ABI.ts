  
 export const pair_abi = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  ];

  export const factory_abi = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  ];
  export const pancakeRouter_abi = [
    'function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) '  
  ];
 

  export const routerV2_abi = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)',
  ];

  export const  contract_abi = [
    'function startArbitage(address token0, address token1, uint256 amount0, uint256 amount1, address sourceRouter, address targetRouter) external',
  ];

  export const latte_factory_abi = [
    'function pairFor(address tokenA, address tokenB) external view returns (address pair)',
  ];

 
  
export const pancakequoter = [
 'function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) '  
 
]
 
/*
quote = Given some asset amount and reserves, returns an amount of the other asset representing equivalent value.
getAmountOut = Given an input asset amount, returns the maximum output amount of the other asset (accounting for fees) given reserves.
getAmountIn = Returns the minimum input asset amount required to buy the given output asset amount (accounting for fees) given reserves.
getAmountsOut = Given an input asset amount and an array of token addresses, calculates all subsequent maximum output token amounts 
     by calling getReserves for each pair of token addresses in the path in turn, and using these to call getAmountOut.
    *Useful for calculating optimal token amounts before calling swap.
getAmountsIn = Given an output asset amount and an array of token addresses, calculates all preceding minimum input token amounts
      by calling getReserves for each pair of token addresses in the path in turn, and using these to call getAmountIn.
    *Useful for calculating optimal token amounts before calling swap.
*/
export const pancakev2_lib_abi = [
  'function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1)',
  'function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair)',
  'function getReserves(address factory, address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB)',
  'function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB)',
  'function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
];

 



