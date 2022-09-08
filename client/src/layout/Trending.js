import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Section from '../components/Section';
import TrendingTokens from '../components/Tokens';
import { getTokens } from '../actions/getAction';

const Trending = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTokens());
  }, [])

  return (
    <Section className="landing">
      <TrendingTokens title="Searched Tokens" link="searched" />
    </Section>
  );
};

export default Trending;
