// axiosCall = async () => {
//     let result = await axios.default.post(
//       'https://api.thegraph.com/subgraphs/name/mmontes11/pancakeswap',
//       {
//         query: `
//         {
//           pairs(where: 
//             {
//               token0: "0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae",
//               token1: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
//             }) {
//             id
//             token0 {
//               id
//               symbol
//               decimals
//             }
//             token1 {
//               id
//               symbol
//               decimals
//             }
//             reserve0
//             reserve1
//           }
//         }
//       `,
        
//       }
//     );
//     console.log((result.data.data.pairs));
//   };