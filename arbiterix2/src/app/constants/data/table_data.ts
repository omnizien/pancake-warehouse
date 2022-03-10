import { Data } from "@angular/router";
import { Columns } from "ngx-easy-table";

export let data: Data[] = [
    {
      status: 'PANCAKESWAP',
      amount: 1,
      company: 'WBNB-USD',
      limit: 0,
      balance: 0,
    },
    {
      status: 'BAKERYSWAP',
      amount: 1,
      company: 'WBNB-USD',
      limit: 0,
      balance: 0,
    },
  {
    status: 'APESWAP',
    amount: 1,
    company: 'WBNB-USD',
    limit: 0,
    balance: 0
  },
    {
      status: 'PANCAKESWAP',
      amount: 999,
      company: 'SHIBA-BUSD',
      limit: 999,
      balance: 999,
    },
    {
      status: 'BAKERYSWAP',
      amount: 999,
      company: 'SHIBA-BUSD',
      limit: 999,
      balance: 999,
    },
    {
      status: 'APESWAP',
      amount: 999,
      company: 'SHIBA-BUSD',
      limit: 999,
      balance: 999,
    },
    {
      status: 'PANCAKESWAP',
      amount: 999,
      company: 'ETH-BUSD',
      limit: 999,
      balance: 999,
    },
    {
      status: 'BAKERYSWAP',
      amount: 999,
      company: 'ETH-BUSD',
      limit: 999,
      balance: 999,
    },
    {
      status: 'APESWAP',
      amount: 999,
      company: 'ETH-BUSD',
      limit: 999,
      balance: 999,
    },
];
  
export  let columns: Columns[] = [
    { key: 'status', title: 'Is active' },
    { key: 'amount', title: 'Amount' },
    { key: 'company', title: 'Convention' },
    { key: 'limit', title: 'Limit' },
    { key: 'balance', title: 'Balance' },
  ];