import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import './rankers.scss';

export default function Rankers() {
  const [rankers, setRankers] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [liked, setLiked] = React.useState({});

  const fetchData = () => {
    fetch('https://kay.airygall.com:4343/rankers', {
      method: 'GET',
    }).then((response) => response.json())
      .then((resJson) => {
        if (!resJson.error) {
          setRankers(resJson.rankers);
        }
      })
      .catch((err) => setError(JSON.stringify(err)));
  };

  React.useEffect(() => {
    fetchData();
    if (sessionStorage.getItem('@liked')) {
      setLiked(JSON.parse(sessionStorage.getItem('@liked')));
    }
  }, []);

  const handleLikeUp = (id) => {
    fetch(`https://kay.airygall.com:4343/like/${id}`, {
      method: 'POST',
    }).then((response) => {
      if (response.ok) {
        const likedTemp = liked;
        likedTemp[id] = true;
        setLiked(likedTemp);
        sessionStorage.setItem('@liked', JSON.stringify(liked));
        fetchData();
      }
    });
  };

  const handleLikeDown = (id) => {
    fetch(`https://kay.airygall.com:4343/like/${id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        const likedTemp = liked;
        likedTemp[id] = false;
        setLiked(likedTemp);
        sessionStorage.setItem('@liked', JSON.stringify(liked));
        fetchData();
      }
    });
  };

  return (
    <div className="rankerRoot">
      <Link to="/mypage" style={{ textDecoration: 'none', color: 'white' }}>
        <button type="submit" className="start_button">
          참여하기
        </button>
      </Link>

      {rankers && (
        <div className="container">
          {rankers.map((ranker) => (
            <div key={ranker.id} className="rankerItem">
              <img alt="ranker_image" src={`https://kay.airygall.com:4343/${ranker.url}`} />
              <div className="info">
                <div>
                  <p>
                    참가자 :
                    {' '}
                    {ranker.nickname}
                  </p>
                  <span>
                    점수 :
                    {' '}
                    {Math.round(ranker.score * 10) / 10}
                    점
                  </span>
                  <br />
                  <span>
                    따봉수 :
                    {' '}
                    {ranker.like}
                  </span>
                </div>
                <div className="buttonBox">
                  <Button
                    variant="contained"
                    color={liked[ranker.id] ? 'default' : 'primary'}
                    onClick={liked[ranker.id]
                      ? () => handleLikeDown(ranker.id)
                      : () => handleLikeUp(ranker.id)}
                  >
                    {!liked[ranker.id] ? '따봉!' : '취소~'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>{error}</div>
    </div>
  );
}
