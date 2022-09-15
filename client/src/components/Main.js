import React from 'react';
import { Fade } from 'react-awesome-reveal';

import Section from './Section';
import Top from './Top';
import Bottom from '../components/Bottom';

const Main = () => {

  return (
    <Section className="main">
      <Fade direction="down">
        <Top />
      </Fade>
      <Fade direction="up">
        <Bottom />
      </Fade>
    </Section>
  );
};

export default Main;
