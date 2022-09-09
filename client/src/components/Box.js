import React from 'react';
import { useSelector } from 'react-redux';

import Section from './Section';

const Box = ({ title, apis }) => {

  const { tokens } = useSelector((state) => state.data);
  let list = [];
  if (apis === "trending") {
    tokens.map((token) => {
      if (list.length < 10) {
        let interval = new Date(Date.now() - Date.parse(token.timestamp));
        let ago = "";
        if (interval.getDate() - 1 === 0) {
          if (interval.getHours() - 1 === 0) {
            if (interval.getMinutes() - 1 === 0) {
              ago = (interval.getSeconds() - 1) + "secs ago";
            } else {
              ago = (interval.getMinutes() - 1) + "mins ago";
            }
          } else {
            ago = (interval.getHours() - 1) + "hours ago";
          }
        } else {
          ago = (interval.getDate() - 1) + "days ago";
        }
        list.push(
          <div className='item' key={token.timestamp}>
            <a href={`/token/${token.address}`}>
              <div>{token.name}({token.symbol})</div>
              <div>{ago}</div>
            </a>
          </div>
        )
      }
    })
  } else if (apis === "scams") {
    tokens.map((token) => {
      if (list.length < 10 && token.isMalicious) {
        let interval = new Date(Date.now() - Date.parse(token.timestamp));
        let ago = "";
        if (interval.getDate() - 1 === 0) {
          if (interval.getHours() - 1 === 0) {
            if (interval.getMinutes() - 1 === 0) {
              ago = (interval.getSeconds() - 1) + "secs ago";
            } else {
              ago = (interval.getMinutes() - 1) + "mins ago";
            }
          } else {
            ago = (interval.getHours() - 1) + "hours ago";
          }
        } else {
          ago = (interval.getDate() - 1) + "days ago";
        }
        list.push(
          <div className='item' key={token.timestamp}>
            <a href={`/token/${token.address}`}>
              <div>{token.name}({token.symbol})</div>
              <div>{ago}</div>
            </a>
          </div>
        )
      }
    })
  }
  return (
    <Section className="box">
      <div className='title'>
        <a href={apis}>{title}</a>
      </div>
      <div className='tokenList'>
        {list}
      </div>
      <div className='link'>
        <a href={apis} >See all</a>
      </div>
    </Section>
  );
};

export default Box;
