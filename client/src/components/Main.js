import React from 'react';
import { useSelector } from 'react-redux';
import { Fade } from 'react-awesome-reveal';

import Section from './Section';
import Top from './Top';
import Bottom from '../components/Bottom';

const Main = () => {

  const { loading } = useSelector((state) => state.data);

  return (
    <Section className="main">
      <Fade direction="down">
        <Top />
      </Fade>
      <Fade direction="up">
        <Bottom />
      </Fade>
      {loading && <div className='loading'><img src='loading/ecb.gif' alt="loading..." /></div>}
    </Section>
  );
};

export default Main;
