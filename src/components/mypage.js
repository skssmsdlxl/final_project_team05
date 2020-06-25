import React from 'react';
import { Link } from 'react-router-dom';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Backspace from '@material-ui/icons/Backspace';

import './mypage.scss';

export default function Mypage() {
  const [image, setImage] = React.useState(null);
  const [score, setScore] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [nickname, setNickname] = React.useState(null);

  const handleChange = (e) => {
    setScore(null);
    if (e.target.files) {
      setImage(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleClick = () => {
    const formData = new FormData();
    formData.append('image', image);

    fetch('https://kay.airygall.com:4343/score', {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
      .then((resJson) => {
        if (resJson) {
          switch (resJson.error) {
            case 1:
              switch (resJson.faceCount) {
                case 0:
                  setAlert('얼굴을 찾지 못했어요 ㅜ_ㅜ');
                  setScore(null);
                  break;
                default:
                  setAlert('얼굴이 너무 많아요 ㅠ_ㅠ');
                  setScore(null);
                  break;
              }
              break;
            case 0:
              if (resJson.emotion === 'fear' || resJson.emotion === 'surprise') {
                setScore(resJson.score);
              } else {
                setAlert('다시 도전해보세요~ 메롱~');
                setScore(null);
              }
              break;
            default:
              setAlert(resJson.error);
          }
          setTimeout(() => setAlert(null), 3000);
        }
      });
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (nickname) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('nickname', nickname);
      formData.append('score', score);

      fetch('https://kay.airygall.com:4343/photo', {
        method: 'POST',
        body: formData,
      }).then((response) => response.json())
        .then((resJson) => {
          if (resJson.error === 0) {
            setAlert('성공적으로 등록되었습니다!');
            setTimeout(() => setAlert(null), 3000);
            setTimeout(() => setScore(null), 3000);
            setTimeout(() => setPreviewUrl(null), 3000);
            setTimeout(() => setImage(null), 0);
          } else {
            setAlert('업로드 과정에서 문제가 발생하였습니다!');
            setTimeout(() => setAlert(null), 3000);
          }
        });
    } else {
      setAlert('닉네임을 입력하세요');
      setTimeout(() => setAlert(null), 3000);
    }
  };

  let $imagePreview = (
    <div className="previewText image-container">
      <div>파일 선택을 눌러서 </div>
      <div>도전할 사진을 선택하세요!</div>
    </div>
  );
  if (previewUrl) {
    $imagePreview = (
      <div className="image-container">
        <img src={previewUrl} alt="icon" width="100%" />
      </div>
    );
  }

  return (
    <div className="mypage">
      <Link to="/rankers" style={{}}>
        <IconButton aria-label="upload picture" component="span" id="backIcon">
          <Backspace />
        </IconButton>
      </Link>

      <div>
        <input accept="image/*" id="icon-button-file" type="file" onChange={handleChange} />
        {/* <IconButton aria-label="upload picture" component="span" id="cameraIcon">
          <PhotoCamera />
        </IconButton> */}
      </div>

      {$imagePreview}

      {score ? (
        <div className="scoreboard">
          <div className="score">
            당신의 점수는...
            {' '}
            {score}
            점
          </div>
          <form>
            <input className="nickname_space" placeholder="닉네임을 적어주세요" type="text" onChange={handleNicknameChange} />
            <input type="submit" value="도전하기" onClick={handleUpload} className="buttomForUpload" />
          </form>
        </div>
      ) : (
        <button type="submit" className="buttomForUpload2" onClick={handleClick}>점수 확인하기</button>
      )}
      <div style={{ opacity: alert ? 1 : 0, transition: '0.5s ease' }}>
        {alert}
      </div>
    </div>
  );
}
