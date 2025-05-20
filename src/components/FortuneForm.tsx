import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { getDayPillar, getDayBranch, getFiveElements, getCharacter } from '../utils/fortuneUtils';

interface FortuneFormProps {
  onComplete: (user: any) => void;
}

const FortuneForm: React.FC<FortuneFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('여성');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !gender || !birthDate) {
      setError('이름, 성별, 생년월일을 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    // 사주 정보 계산
    const dayPillar = getDayPillar(birthDate);
    const dayBranch = getDayBranch(dayPillar);
    const fiveElements = getFiveElements(dayPillar);
    const character = getCharacter(dayPillar);
    // Supabase에 저장
    const { data, error } = await supabase.from('user_fortune').insert([
      {
        name,
        gender,
        birth_date: birthDate,
        birth_time: birthTime,
        day_pillar: dayPillar,
        day_branch: dayBranch,
        five_elements: fiveElements,
        character_name: character.name,
        character_image_url: character.imageUrl
      }
    ]).select().single();
    setLoading(false);
    if (error) {
      setError('저장에 실패했습니다.');
    } else if (data) {
      onComplete(data);
    }
  };

  return (
    <section className="fortune-form-section">
      <h2>내 사주 및 개인정보 입력</h2>
      <form className="fortune-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} />
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="여성">여성</option>
          <option value="남성">남성</option>
        </select>
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        <label className="fortune-label" htmlFor="birth-time">시간</label>
        <input id="birth-time" type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} placeholder="태어난 시(선택)" />
        <button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장하고 결과 보기'}</button>
        {error && <div className="form-error">{error}</div>}
      </form>
      <style>{`
        .fortune-form-section { max-width: 400px; margin: 2rem auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 12px #0001; padding: 2rem 1rem; }
        .fortune-form { display: flex; flex-direction: column; gap: 1rem; }
        .fortune-form-section h2 { color: #222; }
        .fortune-form input, .fortune-form select {
          padding: 0.8rem 1rem;
          border-radius: 8px;
          border: 1.5px solid #eee;
          font-size: 1rem;
          background: #fff;
          color: #222;
        }
        .fortune-form input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        .fortune-label {
          color: #222;
          font-size: 0.98rem;
          margin-bottom: -0.5rem;
          margin-top: -0.5rem;
          font-weight: 500;
        }
        .fortune-form input::placeholder {
          color: #aaa;
        }
        .fortune-form button { background: linear-gradient(90deg, #ffb88c 0%, #ea8d8d 100%); color: #fff; border: none; border-radius: 10px; padding: 0.9rem 0; font-size: 1.1rem; font-weight: 600; cursor: pointer; }
        .form-error { color: #e74c3c; margin-top: 0.5rem; text-align: center; }
      `}</style>
    </section>
  );
};

export default FortuneForm; 