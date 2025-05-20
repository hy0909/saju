import React from 'react';
// import { getDayPillar, getDayBranch, getFiveElements, getElementColor, getCharacter } from '../utils/fortuneUtils';
import { getElementColor } from '../utils/fortuneUtils';

interface FortuneResultProps {
  user: any;
  onMatch: () => void;
  onShare: () => void;
}

// 궁합 예시 데이터 (실제 로직은 추후 확장)
const bestMatches = ['경신일주', '무신일주', '병신일주', '무술일주', '병오일주'];
const goodMatches = ['정축일주', '병술일주', '갑진일주'];
const normalMatches = ['기타'];
const worstMatches = ['임오일주', '계유일주'];

const FortuneResult: React.FC<FortuneResultProps> = ({ user, onMatch, onShare }) => {
  // 사주 정보는 DB에서 불러온 값을 그대로 사용
  const dayPillar = user.day_pillar;
  const dayBranch = user.day_branch;
  const fiveElements = user.five_elements;
  const elementColor = getElementColor(fiveElements);
  const character = { name: user.character_name, imageUrl: user.character_image_url };

  return (
    <section className="fortune-result-section" style={{ background: `linear-gradient(135deg, ${elementColor} 0%, #fff 100%)` }}>
      <div className="fortune-result-inner">
        <div className="fortune-main-info">
          <div className="day-pillar" style={{ color: elementColor }}>{dayPillar}</div>
          <div className="character-visual">
            <img src={character.imageUrl} alt={character.name} className="character-img" onError={e => (e.currentTarget.src = '/characters/default.png')} />
            <div className="character-name">{character.name}</div>
          </div>
          <div className="element-badge" style={{ background: elementColor }}>{fiveElements}</div>
        </div>
        <div className="fortune-desc">
          <strong>{user.name}</strong>님의 사주는 <b>{dayPillar}</b>입니다.<br />
          오행은 <b>{fiveElements}</b>이고, 일지는 <b>{dayBranch}</b>입니다.<br />
          <span className="desc-impact">{fiveElements}의 기운이 강하게 느껴지는 {character.name}의 기질을 가지고 있습니다.</span>
        </div>
        <div className="match-section">
          <h3>궁합이 잘 맞는 일주</h3>
          <div className="match-list best">
            <div className="match-label">최고의 궁합</div>
            {bestMatches.map(m => <span key={m} className="match-pill best">{m}</span>)}
          </div>
          <div className="match-list good">
            <div className="match-label">좋은 궁합</div>
            {goodMatches.map(m => <span key={m} className="match-pill good">{m}</span>)}
          </div>
          <div className="match-list normal">
            <div className="match-label">평범한 궁합</div>
            {normalMatches.map(m => <span key={m} className="match-pill normal">{m}</span>)}
          </div>
          <div className="match-list worst">
            <div className="match-label">최악의 궁합</div>
            {worstMatches.map(m => <span key={m} className="match-pill worst">{m}</span>)}
          </div>
        </div>
        <div className="fortune-cta-row">
          <button className="fortune-cta" onClick={onMatch}>나와 잘맞는 궁합이랑 소개팅하기</button>
          <button className="fortune-share" onClick={onShare}>공유하기</button>
        </div>
      </div>
      <style>{`
        .fortune-result-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .fortune-result-inner {
          background: rgba(255,255,255,0.95);
          border-radius: 24px;
          box-shadow: 0 4px 32px #0002;
          padding: 2.5rem 1.5rem 2rem 1.5rem;
          max-width: 420px;
          width: 100%;
          margin: 2rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fortune-main-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }
        .day-pillar {
          font-size: 2.7rem;
          font-weight: 900;
          letter-spacing: -2px;
          margin-bottom: 0.2rem;
        }
        .character-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .character-img {
          width: 90px;
          height: 90px;
          object-fit: contain;
          border-radius: 50%;
          background: #f7f7f7;
          margin-bottom: 0.5rem;
        }
        .character-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }
        .element-badge {
          padding: 0.3em 1.2em;
          border-radius: 16px;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          margin-top: 0.5rem;
          box-shadow: 0 2px 8px #0001;
        }
        .fortune-desc {
          margin: 2rem 0 1.5rem 0;
          font-size: 1.08rem;
          color: #444;
          text-align: center;
        }
        .desc-impact {
          display: block;
          margin-top: 0.7rem;
          font-size: 1.15rem;
          color: #ea8d8d;
          font-weight: 700;
        }
        .match-section {
          width: 100%;
          margin-bottom: 2rem;
        }
        .match-section h3 {
          font-size: 1.2rem;
          color: #222;
          margin-bottom: 1rem;
          text-align: center;
        }
        .match-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.7rem;
          align-items: center;
        }
        .match-label {
          font-size: 0.98rem;
          color: #888;
          margin-right: 0.7rem;
          min-width: 80px;
        }
        .match-pill {
          padding: 0.4em 1.1em;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          background: #f5f5f5;
          color: #333;
          box-shadow: 0 1px 4px #0001;
        }
        .match-pill.best { background: #ea8d8d; color: #fff; }
        .match-pill.good { background: #ffb88c; color: #fff; }
        .match-pill.normal { background: #bdbdbd; color: #fff; }
        .match-pill.worst { background: #222; color: #fff; }
        .fortune-cta-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }
        .fortune-cta, .fortune-share {
          border: none;
          border-radius: 12px;
          font-size: 1.08rem;
          font-weight: 700;
          padding: 0.9em 1.7em;
          cursor: pointer;
          box-shadow: 0 2px 8px #ea8d8d22;
          transition: background 0.2s;
        }
        .fortune-cta {
          background: linear-gradient(90deg, #ea8d8d 0%, #ffb88c 100%);
          color: #fff;
        }
        .fortune-cta:active {
          background: linear-gradient(90deg, #ffb88c 0%, #ea8d8d 100%);
        }
        .fortune-share {
          background: #fff;
          color: #ea8d8d;
          border: 2px solid #ea8d8d;
        }
        .fortune-share:active {
          background: #ea8d8d;
          color: #fff;
        }
        @media (max-width: 600px) {
          .fortune-result-inner { padding: 1.2rem 0.2rem 1.2rem 0.2rem; }
          .day-pillar { font-size: 2rem; }
          .character-img { width: 60px; height: 60px; }
        }
      `}</style>
    </section>
  );
};

export default FortuneResult; 