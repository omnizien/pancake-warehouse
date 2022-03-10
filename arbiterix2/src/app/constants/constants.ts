import { ethers } from "ethers";

export let web3 = new ethers.providers.WebSocketProvider(
    'wss://rpc-mainnet.matic.quiknode.pro'
  );

  export let contract_address = '0xEB537CaBb5bb8bcaE71108e2DdA1Ba9B8e576CAa';

  export let provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org/'
  );

  export let signer = new ethers.Wallet(
    `0x${'44410aa438c163222cafe93153dd582bdf7c3da30d688b7013086121'}`,
     provider
  );