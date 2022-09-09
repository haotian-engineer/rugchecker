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
  console.log("---", token);

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
                  <img src='https://explorer.dogechain.dog/images/favicon.ico' alt='dg-explorer' />
                  <a href={`https://explorer.dogechain.dog/address/${addr}`}>Dogechain explorer</a>
                </td>
              </tr>
              <tr className='linkGroup'>
                <th className='name'>Chart</th>
                <td className='link'>
                  <img src='https://tokensniffer.com/dexscreener.png' alt='tokensniffer.com' />
                  <a href={`https://dexscreener.com/dogechain/${addr}`}>DEX Screener</a>
                  <img src='https://tokensniffer.com/gt.png' alt='tokensniffer.com' />
                  <a href={`https://www.geckoterminal.com/dogechain/pools/${addr}`}>Gecko Terminal</a>
                </td>
              </tr>
            </tbody>
          </table>
          <div className='mal'>
            <div className='analyze'>
              <div className='title'>Summary</div>
              <p>The audit score ***50/100 is a measure of how well the token contract and characteristics meet the criteria for safety.  Results may not be applicable if the token is in presale.  Automated scanners like this one are limited and not always completely accurate.  A token with a high score may still have hidden malicious code. The score is not advice and should be considered along with other factors. Always do your own research and consult multiple sources of information.</p>
            </div>
            <div className='analyze'>
              <div className='title'>Swap Analysis</div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Token is sellable (not a honeypot) at this time.</span>
                <div className='description'>**</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Buy fee is less than 5%(**)</span>
                <div className='description'>This token has a ** buy fee.</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Sell fee is less than 5%(**)</span>
                <div className='description'>This token has a ** sell fee.</div>
                <div className='description'>Excessive fees are often sold for profit which can negatively affect the token's price.  Ask the project team how fees are being allocated and used.</div>
              </div>
            </div>
            <div className='analyze'>
              <div className='title'>Contract Analysis</div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Verified Contract Source</span>
                <div className='description'>**</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Ownership renounced or source does not contain an owner contract</span>
                <div className='description'>This token has a ** buy fee.</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Creator not authorized for special permission</span>
                <div className='description'>This token has a ** sell fee.</div>
                <div className='description'>Excessive fees are often sold for profit which can negatively affect the token's price.  Ask the project team how fees are being allocated and used.</div>
              </div>
            </div>
            <div className='analyze'>
              <div className='title'>Holder Analysis</div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Creator wallet contains less than 5% of circulating token supply (4.8%)</span>
                <div className='description'>**</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>All other holders possess less than 5% of circulating token supply</span>
                <div className='description'>This token has a ** buy fee.</div>
              </div>
            </div>
            <div className='analyze'>
              <div className='title'>Liquidity Analysis</div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Adequate current liquidity</span>
                <div className='description'>**</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Adequate initial liquidity</span>
                <div className='description'>This token has a ** buy fee.</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>At least 95% of liquidity burned/locked for 15 days</span>
                <div className='description'>**</div>
              </div>
              <div className='criteria'>
                <div className='tick'>✔</div>
                <div className='cross'>✘</div>
                <span>Creator wallet contains less than 5% of liquidity</span>
                <div className='description'>This token has a ** buy fee.</div>
              </div>
            </div>

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
