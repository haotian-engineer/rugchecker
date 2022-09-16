import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Section from './Section';
import { getTokens, searchonContract } from '../actions/getAction';

const TokenInfo = ({ addr }) => {

  const dispatch = useDispatch();

  const { tokens } = useSelector((state) => state.data);
  const { isThere } = useSelector((state) => state.data);

  let token;
  let burnRate = 0;
  let creatorRate = 0;

  let query = "mint";
  useEffect(() => {
    dispatch(getTokens());
    dispatch(searchonContract(query, addr));
  }, [])

  tokens.map((tk) => {
    if (tk.address === addr) {
      token = tk;
    }
  })
  
  if (token && parseFloat(token.currentLiquidity) !== 0) {
    console.log("liqui", token.currentLiquidity)
    burnRate = parseFloat(token.burnt/token.currentLiquidity).toFixed(2);
    creatorRate = parseFloat(token.creator / token.currentLiquidity).toFixed(2);
  }
  
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
                  <img src='https://tokensniffer.com/dexscreener.png' alt='dexscreener.com' />
                  <a href={`https://dexscreener.com/dogechain/${addr}`}>DEX Screener</a>
                  <img src='https://tokensniffer.com/gt.png' alt='geckoterminal.com' />
                  <a href={`https://www.geckoterminal.com/dogechain/pools/${addr}`}>Gecko Terminal</a>
                </td>
              </tr>
            </tbody>
          </table>
          <div className='mal'>
            <div className='analyze'>
              <div className='title'>Summary {token.score}/100</div>
              <div className='description'>The audit score {token.score}/100 is a measure of how well the token contract and characteristics meet the criteria for safety.  Results may not be applicable if the token is in presale.  Automated scanners like this one are limited and not always completely accurate.  A token with a high score may still have hidden malicious code. The score is not advice and should be considered along with other factors. Always do your own research and consult multiple sources of information.</div>
            </div>
            <div className='analyze'>
              <div className='title'>Swap Analysis</div>
              <div className='criteria'>
                {token.malType.includes("Contract is honeypot.") ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Token is sellable (not a honeypot) at this time.</span>
              </div>
              {token.malType.includes("Contract is honeypot.") && <div className='description'>This token appears to be unsellable (ignore for presale).</div>}
              <div className='criteria'>
                {(token.buyTax < 0 || token.buyTax > 5) ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Buy fee is less than 5% ({token.buyTax >= 0 ? parseFloat(token.buyTax).toFixed(2) : "-"})</span>
              </div>
              <div className='description'>This token has {token.buyTax >= 0 ? parseFloat(token.buyTax).toFixed(2) + "%" : "no"} buy fee.</div>
              <div className='criteria'>
                {(token.sellTax < 0 || token.sellTax > 5) ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Sell fee is less than 5% ({token.sellTax >= 0 ? parseFloat(token.sellTax).toFixed(2) : "-"})</span>
              </div>
              <div className='description'>This token has {token.sellTax >= 0 ? parseFloat(token.sellTax).toFixed(2) + "%" : "no"} sell fee.</div>
              {token.sellTax > 5 && <div className='description'>Excessive fees are often sold for profit which can negatively affect the token's price.  Ask the project team how fees are being allocated and used.</div>}
            </div>
            <div className='analyze'>
              <div className='title'>Contract Analysis</div>
              <div className='criteria'>
                {token.malType.includes("Contract source code isn't verified.") ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Verified Contract Source</span>
              </div>
              <div className='criteria'>
                {token.malType.includes("Contract has an owner functions.") ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Ownership renounced or source does not contain an owner contract</span>
              </div>
              {token.malType.includes("Contract has an owner functions.") && <div className='description'>The contract contains ownership functionality and ownership is not renounced which may allow the creator or current owner to modify contract behavior (for example: disable selling, change fees, or mint new tokens).  There can be legitimate reasons for not renouncing ownership, check with the project team for such information.</div>}
              <div className='criteria'>
                {token.malType.includes("Creator authorized for special permission.") ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Creator not authorized for special permission</span>
              </div>
            </div>
            <div className='analyze'>
              <div className='title'>Holder Analysis</div>
              <div className='criteria'>
                {token.cRate > 5 ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Creator wallet contains less than 5% of circulating token supply ({parseFloat(token.cRate).toFixed(2)}%)</span>
              </div>
              {token.cRate > 5 && <div className='description'>The creator wallet contains a substantial amount of tokens which could have a large impact on the token price if sold.</div>}
              <div className='criteria'>
                {token.oRate > 5 ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>All other holders possess less than 5% of circulating token supply ({parseFloat(token.oRate).toFixed(2)}%)</span>
              </div>
            </div>
            <div className='analyze'>
              <div className='title'>Liquidity Analysis</div>
              <div className='criteria'>
                {token.currentLiquidity < 1000 ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Adequate current liquidity</span>
              </div>
              {token.currentLiquidity < 1000 && <div className='description'>	Not enough liquidity is present which could potentially cause high slippage and other problems when swapping (ignore for presale).</div>}
              <div className='criteria'>
                {burnRate < 0.95 ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>At least 95% of liquidity burned/locked for 15 days ({parseFloat(burnRate).toFixed(2) * 100}%)</span>
              </div>
              {burnRate < 0.95 && <div className='description'>	Not enough liquidity is secured for the minimum duration which could allow for significant amounts to be removed (rug pull). NOTE: this test only checks well-known lockers and will not accurately represent locked liquidity from custom locking/vesting contracts.</div>}
              <div className='criteria'>
                {creatorRate > 0.05 ? <div className='cross'>✘</div> : <div className='tick'>✔</div>}
                <span>Creator wallet contains less than 5% of liquidity ({parseFloat(creatorRate).toFixed(2) * 100}%)</span>
              </div>
            </div>
          </div>
          <div className='mal'>
            <div className='queryResult'>Result: {token.malType.includes("Contract source code isn't verified.") ? "Contract is not verified." : isThere && `There is "${query}" string in contract.`}</div>
          </div>
        </div>
      }
    </Section>
  );
};

export default TokenInfo;
