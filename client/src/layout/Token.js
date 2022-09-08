import React from 'react';
import { useParams } from 'react-router-dom';

import Section from '../components/Section';
import TokenInfo from '../components/TokenInfo';

const Token = () => {

  const { addr } = useParams();

  return (
    <Section className="landing">
      <TokenInfo addr={addr} />
    </Section>
  );
};

export default Token;
