import React from 'react';
import { useSelector } from 'react-redux';

import Section from './Section';

const Loading = () => {

  const { loading } = useSelector((state) => state.data);

  return (
    <Section className='container'>
      {loading && <div className='loading'><img src='http://localhost:3000/loading/ecb.gif' alt="loading..." /></div>}
    </Section>
  );
};

export default Loading;
