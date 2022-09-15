import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './layout/Landing';
import Trending from './layout/Trending';
import Scams from './layout/Scams';
import Token from './layout/Token';
import Error from './layout/Error';
import Loading from './components/Loading';

import store from './store';

import './App.css';

const App = () => {

  return (
    <Provider store={store}>
      <Navbar />
      <Error />
      <Loading />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/scams/" element={<Scams />} />
          <Route path="/token/:addr" element={<Token />} />
        </Routes>
      </Router>
      <Footer />
    </Provider>
  );
};

export default App;
