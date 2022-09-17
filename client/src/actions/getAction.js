import axios from 'axios';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { Actions } from './types';
import { BASE_TOKEN_URI, BASE_SERVER_URI, BASE_LIQUIDITY_URI } from '../config/private';
import { honeyAbi } from '../config/honeyAbi';
import { LPAbi } from '../config/LPAbi';

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
export const scan = (contract, lockData) => async (dispatch) => {
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
    let locked = 0;
    let creatorLiquidity = 0;
    let score = 100;
    let from;
    let to;

    const TEST_AMOUNT = 10 ** 17 * 5;
    const GAS_LIMIT = "4500000";

    const GetLockedLiquidity = async () => {
      lockData.map(async lockdata => {
        from = lockdata.createdAt*1000;
        to = lockdata.unlockTime*1000;
        locked += parseInt(lockdata.balance);
        const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc01-sg.dogechain.dog"));
        const contract = new web3.eth.Contract(LPAbi, lockdata.token);
        burnt += parseInt(await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call());
        
      })
      burnt += locked;
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

      const honeyCheck = new web3.eth.Contract(honeyAbi);

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
    liqDatas.data.pairs.map(async (liqdata) => {
      liquidity += liqdata.liquidity.usd;
    })
    await GetLockedLiquidity();
    currentLiquidity = liquidity*2;
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
    if (contractCodeRequest && String(contractCodeRequest['data']['result'][0]['SourceCode']).indexOf("onlyOwner") !== -1 && (String(contractCodeRequest['data']['result'][0]['SourceCode']).indexOf("OwnershipTransferred(_owner, address(0))" === -1)) || String(contractCodeRequest['data']['result'][0]['SourceCode']).indexOf("OwnershipTransferred(owner, address(0))" === -1)) {
      type.push("Contract has an owner functions.");
      score -= 9;
    }
    if (honey) {
      type.push("Contract is honeypot.");
      score = 0;
    }
    if (buyTax > 5)
      score -= 9;
    if (sellTax > 5)
      score -= 9;
    if (creatorCharge / circulating > 0.05)
      score -= 9;
    if (max / circulating > 0.05)
      score -= 9;
    if (currentLiquidity < 1000)
      score -= 9;
    if (burnt / currentLiquidity < 0.95)
      score -= 9;
    if (creator / currentLiquidity > 0.05)
      score -= 9;
    if (score < 0) score = 0;
    if (score < 50) malicious = true;
    else malicious = false;
    
    burnt *= 10**(-18);
    creatorCharge *= 10**(-18);
    max *= 10**(-18);
    circulating*= 10**(-18);
    const data = {
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
      burnt: burnt,
      creatorLiquidity: creatorLiquidity,
      from: from,
      to: to,
      score: score
    }
    console.log("data to server", data)
    const payload = await axios.post(`${BASE_SERVER_URI}/tokens`, data);
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
    let res = [];
    const contractCodeAbi = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getabi&address=${addr}`);
    if (contractCodeAbi.data.message !== "Contract source code not verified") {
      contractCodeRequest = await axios.get(`${BASE_TOKEN_URI}?module=contract&action=getsourcecode&address=${addr}`);
      query.map(q => {
        if (contractCodeRequest && String(contractCodeRequest['data']['result'][0]['SourceCode']).toLowerCase().indexOf(String(q).toLowerCase()) === -1) {
          res.push(false);
        }
        else res.push(true);
      })
    }
    dispatch({
      type: Actions.QUERY_SEARCH,
      payload: res
    })
  } catch (err) {
    console.log("err", err);
    dispatch(alert("error", err));
  }
}