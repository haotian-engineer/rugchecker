import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Section from '../components/Section';
import TrendingTokens from '../components/Tokens';
import { getTokens } from '../actions/getAction';

const Scams = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTokens());
  }, [])

  return (
    <Section className="landing">
      <TrendingTokens title="Latest Scams" link="scams" />
    </Section>
  );
};

export default Scams;
