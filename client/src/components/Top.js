import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Web3 from 'web3';

import Section from './Section';
import { searchTokens, scan } from "../actions/getAction";
import { getAddress } from "ethers/lib/utils";
import { tokenLockerManagerAbi } from "../config/tokenLockerManagerAbi";

const Top = () => {

  const dispatch = useDispatch();
  let { searched } = useSelector((state) => state.data);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.trim() !== "") {
      dispatch(searchTokens(query));
    }
  }, [query]);


  const scanNow = async () => {
    const lockData = await GetLockedData(query);
    setQuery("");
    dispatch(scan(searched.result, lockData));
  }
  const result = () => {
    return <div className="searched" onClick={scanNow}>
      <div>{searched.result.contractAddress}</div>
      <div>{searched.result.name}({searched.result.symbol})</div>
    </div>
  }

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const GetContract = (async (abi, address) => {
    const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc01-sg.dogechain.dog"));
    const contract = new web3.eth.Contract(abi, address);
    return contract

  });
  const GetLockedData = async (address) => {
    let lockerData = [];
    const lockerManagerContract = await GetContract(tokenLockerManagerAbi, '0x016c1D8cf86f60A5382BA5c42D4be960CBd1b868');
    const lockIds = await lockerManagerContract.methods.getTokenLockersForAddress(getAddress(address)).call();
    lockIds.map(id => id)
      .reverse()
      .map(async (id) => {
        const lockdata = await lockerManagerContract.methods.getTokenLockData(id).call();
        lockerData.push(lockdata);
        console.log("lockerData", lockerData);
      })
    return lockerData;
  }

  return (
    <Section className="top">
      <div className='title'>
        Check TOKEN here
      </div>
      <div className="searchBox">
        <label htmlFor="search" className="title">Scan a token easily.</label>
        <div className="search">
          <FontAwesomeIcon icon={faSearch} />
          <input type="search" id="search" value={query} onChange={onChange} placeholder="Search tokens by address" />
          {searched.result && query && result()}
        </div>
      </div>


    </Section>
  );
};

export default Top;
