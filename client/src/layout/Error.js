import React from 'react';
import { useSelector } from 'react-redux';

import Section from '../components/Section';

const Error = () => {

  let { errors } = useSelector((state) => state.data);

  return (
    <Section>
      {errors.type &&
        <div className={`alert ${errors.type}`}>{errors.data}</div>
      }
    </Section>
  );
};

export default Error;
