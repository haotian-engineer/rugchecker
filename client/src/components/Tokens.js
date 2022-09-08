import React from 'react';
import { Fade } from "react-awesome-reveal";

import Section from './Section';
import TokenBoxes from './TokenBoxes';

const Tokens = ({ title, link }) => {

  return (
    <Section className="main">
      <Fade direction='bottom'>
        <div className='boxes'>
          <h2>{title}</h2>
          <TokenBoxes link={link} />
        </div>
      </Fade>
    </Section>
  );
};

export default Tokens;
