import React from 'react';

import Section from './Section';
import Box from './Box';

const Bottom = () => {

  return (
    <Section className="bottom">
      <Box
        title="Searched Tokens"
        apis="trending"
      />
      <Box
        title="Latest Scams"
        apis="scams"
      />
    </Section>
  );
};

export default Bottom;
