import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Section from './Section';
import { searchTokens, scan } from "../actions/getAction";

const Top = () => {

  const dispatch = useDispatch();
  let { searched } = useSelector((state) => state.data);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (query.trim() !== "") {
      dispatch(searchTokens(query));
    }
  }, [query]);


  const scanNow = () => {
    setQuery("");
    dispatch(scan(searched.result));
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
