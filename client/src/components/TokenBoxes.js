import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Section from './Section';

const TokenBoxes = ({ link }) => {

  const navigate = useNavigate();
  const { tokens } = useSelector((state) => state.data);

  let list = [];
  const redirect = (addr) => {
    navigate(`/token/${addr}`)
  }

  if (link == "searched") {
    tokens.map((token) => {
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
        <tr key={token.timestamp} onClick={() => redirect(token.address)}>
          <th className='hideOnSmall'>{token.name}</th>
          <th className='showOnSmall'>{token.name}({token.symbol})</th>
          <td className='hideOnSmall'>{token.symbol}</td>
          <td className='hideOnMedium'>{token.address}</td>
          <td>{ago}</td>
          <td>{token.type}</td>
        </tr>
      )
    })
  } else {
    tokens.map((token) => {
      if (token.isMalicious) {
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
          <tr key={token.timestamp} onClick={() => redirect(token.address)}>
            <th className='hideOnSmall'>{token.name}</th>
            <th className='showOnSmall'>{token.name}({token.symbol})</th>
            <td className='hideOnSmall'>{token.symbol}</td>
            <td className='hideOnMedium'>{token.address}</td>
            <td>{ago}</td>
            <td>{token.type}</td>
          </tr>
        )
      }
    })
  }

  return (
    <Section className="tokenboxes">
      <table>
        <thead>
          <tr>
            <th className='hideOnSmall'>Name</th>
            <th className='showOnSmall'>Name(Symbol)</th>
            <th className='hideOnSmall'>Symbol</th>
            <th className='hideOnMedium'>Address</th>
            <th>Added</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {list}
        </tbody>
      </table>
    </Section>
  );
};

export default TokenBoxes;
