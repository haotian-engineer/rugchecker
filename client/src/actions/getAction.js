import axios from 'axios';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { Actions } from './types';
import { BASE_TOKEN_URI, BASE_SERVER_URI } from '../config/private';

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
    let type = "none";
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

    const TEST_AMOUNT = 10 ** 17 * 5;
    const GAS_LIMIT = "4500000";

    const RunHoneyContract = async (
      from, honeyCheckerAddress, token, router, rcpAddress) => {
      let buyTax = 0;
      let sellTax = 0;
      let buyGasCost = 0;
      let sellGasCost = 0;
      let isHoneypot = 0;

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
      console.log(buyTax + "--", sellTax + "--", buyGasCost + "--", sellGasCost + "--", isHoneypot + "--")
      return {
        buyTax,
        sellTax,
        buyGasCost,
        sellGasCost,
        isHoneypot,
      };
    };
    const analyze = await RunHoneyContract(
      "0x2772fcbf3e6d9128bccec98d5138ab63c712cb7b",
      "0xF662d39558F57031F2Caa45dEaFCD5341D5c7C1E",
      contract.contractAddress,
      "0xa4ee06ce40cb7e8c04e127c1f7d3dfb7f7039c81",
      "https://rpc03-sg.dogechain.dog"
    )
      .catch()
      .then((e) => { honey = e.isHoneypot });
    let contractCodeRequest;
    const contractCodeAbi = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getabi&address=${contract.contractAddress}`);
    if (contractCodeAbi.data.message !== "Contract source code not verified"){
      contractCodeRequest = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getsourcecode&address=${contract.contractAddress}`);
      console.log("in")
    }
      console.log("abi", contractCodeAbi.data.message);
    console.log("abi", contractCodeAbi);
    if (contractCodeAbi.data.message === "Contract source code not verified") {
      type = "Contract source code isn't verified.";
    }
    else if (contractCodeRequest && contractCodeRequest['data']['result'][0]['IsProxy'] === true) {
      type = "Contract use proxy.";
    }
    else if (honey) {
      type = "Contract is honeypot."
    }
    else {
      malicious = false;
      type = "Contract is clean."
    }
    console.log("analyze", analyze);
    const payload = await axios.post(`${BASE_SERVER_URI}/tokens`, {
      address: contract.contractAddress,
      name: contract.name,
      symbol: contract.symbol,
      total: contract.totalSupply,
      type: contract.type,
      isMalicious: malicious,
      malType: type,
    })
    dispatch({
      type: Actions.CHECK,
      payload: payload.data
    })
    if (malicious)
      dispatch(alert("error", type));
    else
      dispatch(alert("success", type));
  } catch (err) {
    dispatch(alert("error", err.message));
  }
}