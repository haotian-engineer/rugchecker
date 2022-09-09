import React from 'react';

import Section from './Section';

const Footer = () => {

  return (
    <Section className="footer">
      <div className='desc'>
        <strong>Disclaimer:</strong> the information provided on this site, hyperlinked sites, forums, blogs, social media accounts and other platforms is for general informational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information. Under no circumstances shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. No part of the content on this site is meant to be a solicitation, offer, financial advice, or any other form of advice meant for your specific reliance for any purpose. Trading is a highly risky activity that can lead to major losses, please therefore consult your financial advisor before making any decision.
        <div><strong>* Disclosure:</strong> banner advertisements are provided by a third-party service (coinzilla.com) in exchange for payment.</div>
      </div>
      <div className='copyright'>
        © 2022 TokenChecker. All Rights Reserved.
      </div>
    </Section>
  );
};

export default Footer;
