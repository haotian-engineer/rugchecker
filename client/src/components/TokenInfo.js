import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Section from './Section';
import { getTokens } from '../actions/getAction';

const TokenInfo = ({ addr }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTokens());
  }, [])

  const { tokens } = useSelector((state) => state.data);
  let token;
  tokens.map((tk) => {
    if (tk.address === addr) {
      token = tk;
    }
  })

  return (
    <Section className="main">
      {token &&
        <div className='tokenInfo'>
          <div className='title'>
            <h1>{token.name}({token.symbol})</h1>
            <h2>{token.address}</h2>
          </div>
          <table className='links'>
            <tbody>
              <tr className='linkGroup'>
                <th className='name'>Links</th>
                <td className='link'>
                  <img src='https://explorer.dogechain.dog/images/favicon.ico' />
                  <a href={`https://explorer.dogechain.dog/address/${addr}`}>Dogechain explorer</a>
                </td>
              </tr>
              <tr className='linkGroup'>
                <th className='name'>Chart</th>
                <td className='link'>
                  <img src='https://tokensniffer.com/dexscreener.png' />
                  <a href={`https://dexscreener.com/dogechain/${addr}`}>DEX Screener</a>
                  <img src='https://tokensniffer.com/gt.png' />
                  <a href={`https://www.geckoterminal.com/dogechain/pools/${addr}`}>Gecko Terminal</a>
                </td>
              </tr>
            </tbody>
          </table>
          <div className='mal'>
            <div><strong>Malicious:</strong> {String(token.isMalicious)}</div>
            <div><strong>Type:</strong> {token.malType}</div>
            <div><strong>Check on:</strong> <a href={`https://explorer.dogechain.dog/address/${addr}`}>DogeChain Explorer</a></div>
            <div><strong>Contract Code:</strong> <a href={`https://explorer.dogechain.dog/address/${addr}/contracts`}>Dogechain Explorer</a></div>
          </div>
        </div>
      }
    </Section>
  );
};

export default TokenInfo;
