import axios from 'axios';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { Actions } from './types';
import { BASE_TOKEN_URI, BASE_SERVER_URI, BASE_LIQUIDITY_URI } from '../config/private';

export const alert = (type, payload) => async (dispatch) => {
  dispatch({
    type: Actions.ERROR,
    payload: { type: type, data: payload }
  })
  setTimeout(() => {
    dispatch({
      type: Actions.REMOVE_ERROR,
    })
  }, 5000)
}

export const searchTokens = (query) => async (dispatch) => {
  try {
    dispatch({ type: Actions.LOADING });
    const { data, status } = await axios.get(`${BASE_TOKEN_URI}?module=token&action=getToken&contractaddress=${query}`);
    if (data.message === "OK") {
      dispatch({
        type: Actions.SEARCH,
        payload: data
      });
    } else {
      dispatch(alert("error", data.message));
    }
  } catch (err) {
    dispatch(alert("error", err));
  }
};
export const getTokens = () => async (dispatch) => {
  try {
    dispatch({
      type: Actions.LOADING
    });
    const tokens = await axios.get(`${BASE_SERVER_URI}/tokens`);
    dispatch({
      type: Actions.GET_TOKENS,
      payload: tokens.data
    });

  } catch (err) {
    dispatch(alert("error", err));
  }
}
export const scan = (contract) => async (dispatch) => {
  dispatch({ type: Actions.LOADING });
  try {
    let honey;
    let malicious = true;
    let type = [];
    let buyTax = 0;
    let sellTax = 0;
    let buyGasCost = 0;
    let sellGasCost = 0;
    let isHoneypot = 0;
    let creator = "";
    let circulating = 0;
    let creatorCharge = 0;
    let currentLiquidity = 0;
    let contractCodeRequest;
    let liqDatas
    let liquidity = 0;
    let max = 0;
    let burnt = 0;
    let creatorLiquidity = 0;
    let score = 100;
    let lockerAddr = [
      '0x217b069f3b93c483B36CC63fa88677866ec2D6c5',
      '0xf1700Bb0240A9212B75d009857AB1748E84480E1',
      '0xcE1029bE7240f602dF70B68a63b0d3CB9e236F8E',
      '0x71eDB8286964CFeAcaE1884e7E1b48679A63e9A4',
      '0x37a1cc2Cb2ed8eB91781624822E17629705D4016',
      '0x13bcF77cEe2891a1025B3937BAEA9BBd15A9B7b4',
      '0xdfA1Fe099523F2305cdE9FeeF4220387e4337a31',
      '0xF0804E3609e2127D2De1e8eE64CfcD2e5E51d9a7',
      '0xEADBDa95E1923D1602fF25C11EC31b0F08F19984',
      '0x2b9fEf95524d3d3a494ad6Bf8061bC869AC7f14f',
      '0x459c1D964EE92c6B946b632B0cC54aCbA2001a95',
      '0x67DdE6C2f2DEcC32090106EE385C95012ECe3149',
      '0x08C6fD5FeA07B3A6b45A58E4aAB2C80780B33aa1',
      '0xA4C852e06170052c067b4a343F54570F781a36b9',
    ];

    
    const TEST_AMOUNT = 10 ** 17 * 5;
    const GAS_LIMIT = "4500000";

    const contractAbi = [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "targetTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "idexRouterAddres",
            type: "address",
          },
        ],
        name: "honeyCheck",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "buyResult",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "tokenBalance2",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "sellResult",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "buyCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "sellCost",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expectedAmount",
                type: "uint256",
              },
            ],
            internalType: "struct honeyCheckerV5.HoneyResponse",
            name: "response",
            type: "tuple",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "router",
        outputs: [
          {
            internalType: "contract IDEXRouter",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const LPAbi = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "Burn",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1",
            "type": "uint256"
          }
        ],
        "name": "Mint",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0In",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1In",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0Out",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1Out",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "Swap",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint112",
            "name": "reserve0",
            "type": "uint112"
          },
          {
            "indexed": false,
            "internalType": "uint112",
            "name": "reserve1",
            "type": "uint112"
          }
        ],
        "name": "Sync",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "DOMAIN_SEPARATOR",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "MINIMUM_LIQUIDITY",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "PERMIT_TYPEHASH",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "burn",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "amount0",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount1",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "factory",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getReserves",
        "outputs": [
          {
            "internalType": "uint112",
            "name": "reserve0",
            "type": "uint112"
          },
          {
            "internalType": "uint112",
            "name": "reserve1",
            "type": "uint112"
          },
          {
            "internalType": "uint32",
            "name": "blockTimestampLast",
            "type": "uint32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "kLast",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "mint",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "liquidity",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "nonces",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "name": "permit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "price0CumulativeLast",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "price1CumulativeLast",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "skim",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amount0Out",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount1Out",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "swap",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "sync",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "token0",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "token1",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
    const Getburnt = async (pairAddr) => {
      const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc03-sg.dogechain.dog"));
      const contract = new web3.eth.Contract(LPAbi, pairAddr)
      burnt += await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call();
      for (let i = 0; i < lockerAddr.length; i++) {
        burnt += await contract.methods.balanceOf(lockerAddr[i]).call();
      }
      creatorLiquidity = await contract.methods.balanceOf(creator).call();
    }
    
    const RunHoneyContract = async (
      from,
      honeyCheckerAddress,
      token,
      router,
      rcpAddress
    ) => {

      const web3 = new Web3(rcpAddress);
      const gasPrice = await web3.eth.getGasPrice();
    
      const honeyCheck = new web3.eth.Contract(contractAbi);
    
      const data = honeyCheck.methods.honeyCheck(token, router).encodeABI();
    
      let honeyTxResult;
    
      try {
        honeyTxResult = await web3.eth.call({
          from,
          to: honeyCheckerAddress,
          gas: GAS_LIMIT,
          gasPrice: Math.floor(Number(gasPrice) * 1.2).toString(),
          value: TEST_AMOUNT,
          nonce: undefined,
          data,
        });
      } catch (error) {
        return {
          buyTax: -1,
          sellTax: -1,
          isHoneypot: 1,
          error: error,
        };
      }
    
      const decoded = web3.eth.abi.decodeParameter(
        "tuple(uint256,uint256,uint256,uint256,uint256,uint256)",
        honeyTxResult
      );
    
      buyGasCost = decoded[3];
      sellGasCost = decoded[4];
    
      const res = {
        buyResult: decoded[0],
        leftOver: decoded[1],
        sellResult: decoded[2],
        expectedAmount: decoded[5],
      };
    
      buyTax =
        (1 -
          new BigNumber(res.buyResult)
            .dividedBy(new BigNumber(res.expectedAmount))
            .toNumber()) *
        100;
      sellTax =
        (1 -
          new BigNumber(res.sellResult)
            .dividedBy(new BigNumber(TEST_AMOUNT))
            .toNumber()) *
          100 -
        buyTax;
    
      return {
        buyTax,
        sellTax,
        buyGasCost,
        sellGasCost,
        isHoneypot,
      };
    };
    RunHoneyContract(
      "0x2772fcbf3e6d9128bccec98d5138ab63c712cb7b",
      "0xDB2135662F55C241EEEef9424B68f661d5c0D298",
      contract.contractAddress,
      "0xa4ee06ce40cb7e8c04e127c1f7d3dfb7f7039c81",
      "https://rpc03-sg.dogechain.dog"
    )
      .catch()
      .then((e) => { honey = e.isHoneypot; console.log("DogeChain", e) });

    const contractCodeAbi = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getabi&address=${contract.contractAddress}`);
    if (contractCodeAbi.data.message !== "Contract source code not verified") {
      contractCodeRequest = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getsourcecode&address=${contract.contractAddress}`);
    }
    const txlist = await axios.get(`${BASE_TOKEN_URI}?module=account&action=txlist&address=${contract.contractAddress}`)
    creator = txlist.data.result[txlist.data.result.length - 1].from;
    const holders = await axios.get(`${BASE_TOKEN_URI}?module=token&action=getTokenHolders&contractaddress=${contract.contractAddress}`);
    liqDatas = await axios.get(`${BASE_LIQUIDITY_URI}${contract.contractAddress}`)
    console.log("liqdatas", liqDatas)
    liqDatas.data.pairs.map(async (liqdata) => {
      liquidity += liqdata.liquidity.usd;
      await Getburnt(liqdata.pairAddress)
    })
    currentLiquidity = liquidity;
    holders.data.result.map((holder) => {
      circulating += parseFloat(holder.value)
      if (holder.address === creator) creatorCharge = holder.value;
      else if (holder.value > max) max = holder.value;
    })
    if (contractCodeAbi.data.message === "Contract source code not verified") {
      type.push("Contract source code isn't verified.");
      score -= 9;
    }
    if (contractCodeRequest && contractCodeRequest['data']['result'][0]['IsProxy'] === true) {
      type.push("Contract use proxy.");
      score -= 9;
    }
    if (contractCodeRequest && String(contractCodeRequest['data']['result'][0]['SourceCode']).indexOf(creator) !== -1) {
      type.push("Creator authorized for special permission.");
      score -= 9;
    }
    if (contractCodeRequest && String(contractCodeRequest['data']['result'][0]['SourceCode']).indexOf("onlyOwner") !== -1 && String(contractCodeRequest['data']['result'][0]['SourceCode']).indexOf("OwnershipTransferred(_owner, address(0))" === -1)) {
      type.push("Contract has an owner functions.");
      score -= 9;
    }
    if (honey) {
      type.push("Contract is honeypot.");
      score = 0;
    }
    if(buyTax > 5)
      score -= 9;
    if(sellTax > 5)
      score -= 9;
    if(creatorCharge/circulating > 0.05)
      score -= 9;
    if(max/circulating > 0.05)
      score -= 9;
    if(currentLiquidity < 1000)
      score -= 9;
    if (burnt/currentLiquidity < 0.95)
      score -= 9;
    if (creator / currentLiquidity > 0.05)
      score -= 9;
    if (score < 0) score = 0;
    if (score < 50) malicious = true;
    else malicious = false;
    
    const payload = await axios.post(`${BASE_SERVER_URI}/tokens`, {
      address: contract.contractAddress,
      name: contract.name,
      symbol: contract.symbol,
      total: contract.totalSupply,
      type: contract.type,
      isMalicious: malicious,
      malType: type,
      buyTax: buyTax,
      sellTax: sellTax,
      buyGasCost: buyGasCost,
      sellGasCost: sellGasCost,
      circulating: circulating,
      cRate: creatorCharge / circulating * 100,
      oRate: max / circulating * 100,
      currentLiquidity: currentLiquidity,
      burnt: burnt / 2,
      creatorLiquidity: creatorLiquidity,
      score: score
    })
    dispatch({
      type: Actions.CHECK,
      payload: payload.data
    })
    if (malicious)
      dispatch(alert("error", "Contract is Malicious"));
    else
      dispatch(alert("success", "Contract is Clean"));
  } catch (err) {
    dispatch(alert("error", err.message));
  }
}

export const searchonContract = (query, addr) => async (dispatch) => {

  try {
    dispatch({ type: Actions.LOADING });
    let contractCodeRequest;
    let res;
    const contractCodeAbi = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getabi&address=${addr}`);
    if (contractCodeAbi.data.message !== "Contract source code not verified") {
      contractCodeRequest = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getsourcecode&address=${addr}`);
      if (contractCodeRequest && String(contractCodeRequest['data']['result'][0]['SourceCode']).indexOf(query) === -1) {
        res = false;
      }
      else res = true;
    }
    dispatch({
      type: Actions.QUERY_SEARCH,
      payload: res
    })
  } catch (err) {
    dispatch(alert("error", err));
  }
}