import React from "react";

import Section from './Section';

const Navbar = () => {

  return (
    <Section className="nav">
      <div className="logo">
        <a href="http://localhost:3000">
          <div className="navTitle">Token Checker</div>
        </a>
      </div>
    </Section>
  );
};

export default Navbar;