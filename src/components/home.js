import React from 'react';
import './home.scss';
import { Link } from 'react-router-dom';

import jjal from '../images/jjals.png';

export default function Home() {
  return (
    <>
      <img alt="jjal" src={jjal} className="row" />
      <h1 className="title">
        놀란얼굴 챌린지
      </h1>
      <Link to="/rankers" style={{ textDecoration: 'none', color: 'white' }}>
        <button type="submit" className="start_button">
          시
          {' '}
          작
        </button>
      </Link>
    </>
  );
}
