import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Section from '../components/Section';
import Main from '../components/Main';
import { getTokens } from '../actions/getAction';

const Landing = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTokens());
  }, [])

  return (
    <Section className="landing">
      <Main />
    </Section>
  );
};

export default Landing;