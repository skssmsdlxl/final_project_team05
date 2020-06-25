import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './components/home';
import Mypage from './components/mypage';
import Rankers from './components/rankers';
import './App.scss';

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/mypage">
            <Mypage />
          </Route>
          <Route path="/rankers">
            <Rankers />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>

  );
}
