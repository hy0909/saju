import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
  side: '신랑' | '신부';
}

const Guestbook: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [side, setSide] = useState<'신랑' | '신부'>('신랑');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 방명록 불러오기
  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setEntries(data as GuestbookEntry[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Toast 메시지
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // 방명록 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast('이름과 메시지를 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    // message 앞에 [신랑] 또는 [신부] 태그를 붙여 저장
    const taggedMessage = `[${side}] ${message}`;
    const insertObj: { name: string; message: string; password?: string } = {
      name,
      message: taggedMessage,
    };
    if (password.trim()) {
      insertObj.password = password;
    }
    const { error } = await supabase.from('guestbook').insert([
      insertObj
    ]);
    setLoading(false);
    if (!error) {
      setName('');
      setMessage('');
      setPassword('');
      setSide('신랑');
      fetchEntries();
      showToast('방명록이 등록되었습니다!');
    } else {
      showToast('방명록 작성에 실패했습니다.');
    }
  };

  return (
    <section className="guestbook-section">
      <h2 className="guestbook-title">방명록</h2>
      <form className="guestbook-form" onSubmit={handleSubmit}>
        <div className="side-select">
          <label className={side === '신랑' ? 'selected' : ''}>
            <input
              type="radio"
              value="신랑"
              checked={side === '신랑'}
              onChange={() => setSide('신랑')}
            /> 신랑 측
          </label>
          <label className={side === '신부' ? 'selected' : ''}>
            <input
              type="radio"
              value="신부"
              checked={side === '신부'}
              onChange={() => setSide('신부')}
            /> 신부 측
          </label>
        </div>
        <div className="input-row">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={e => setName(e.target.value)}
            className="guestbook-input"
            maxLength={12}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="guestbook-input"
            maxLength={12}
          />
        </div>
        <textarea
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          className="guestbook-textarea"
          maxLength={200}
        />
        <button type="submit" className="guestbook-btn" disabled={loading}>
          {loading ? '작성 중...' : '방명록 남기기'}
        </button>
      </form>
      <div className="guestbook-list">
        {loading && entries.length === 0 ? (
          <div className="guestbook-loading">불러오는 중...</div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="guestbook-entry">
              <div className="entry-header">
                <span className={`side-badge ${entry.side === '신랑' ? 'groom' : 'bride'}`}>{entry.side}</span>
                <span className="entry-name">{entry.name}</span>
                <span className="entry-date">{new Date(entry.created_at).toLocaleString()}</span>
              </div>
              <div className="entry-message">{entry.message}</div>
            </div>
          ))
        )}
      </div>
      {toast && <div className="toast show">{toast}</div>}
      <style>{`
        .guestbook-section {
          background: linear-gradient(135deg, #f8fafc 0%, #fbeee6 100%);
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          padding: 2rem 1rem 2.5rem 1rem;
          max-width: 480px;
          margin: 2rem auto 0 auto;
        }
        .guestbook-title {
          text-align: center;
          font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
          font-size: 1.6rem;
          color: #222;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }
        .guestbook-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-bottom: 2rem;
        }
        .side-select {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .side-select label {
          font-size: 1rem;
          color: #888;
          cursor: pointer;
          padding: 0.3rem 1.2rem;
          border-radius: 16px;
          border: 1.5px solid #eee;
          transition: all 0.2s;
        }
        .side-select label.selected {
          background: #fff6e9;
          color: #d17c4b;
          border: 1.5px solid #f5cba7;
          font-weight: 600;
        }
        .input-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          width: 100%;
        }
        .guestbook-input {
          flex: 1;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #e0e0e0;
          font-size: 1rem;
          background: #fff;
          transition: border 0.2s;
          color: #222;
          max-width: 100%;
        }
        .guestbook-input:focus {
          border: 1.5px solid #d17c4b;
          outline: none;
        }
        .guestbook-textarea {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 0.9rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #e0e0e0;
          font-size: 1rem;
          background: #fff;
          resize: vertical;
          min-height: 70px;
          transition: border 0.2s;
          color: #222;
        }
        .guestbook-textarea:focus {
          border: 1.5px solid #d17c4b;
          outline: none;
        }
        .guestbook-btn {
          background: linear-gradient(90deg, #ffb88c 0%, #ea8d8d 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.9rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.2rem;
          box-shadow: 0 2px 8px rgba(234,141,141,0.08);
          transition: background 0.2s;
        }
        .guestbook-btn:active {
          background: linear-gradient(90deg, #ea8d8d 0%, #ffb88c 100%);
        }
        .guestbook-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .guestbook-entry {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(234,141,141,0.07);
          padding: 1.1rem 1rem 0.9rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .entry-header {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.2rem;
        }
        .side-badge {
          font-size: 0.95em;
          font-weight: 700;
          padding: 0.2em 0.9em;
          border-radius: 12px;
          color: #fff;
          background: #d17c4b;
        }
        .side-badge.bride {
          background: #ea8d8d;
        }
        .entry-name {
          font-weight: 600;
          color: #333;
        }
        .entry-date {
          margin-left: auto;
          font-size: 0.85em;
          color: #b7b7b7;
        }
        .entry-message {
          font-size: 1.08em;
          color: #444;
          word-break: break-all;
          line-height: 1.7;
        }
        .guestbook-loading {
          text-align: center;
          color: #d17c4b;
          font-size: 1.1em;
        }
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.95rem;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          pointer-events: none;
        }
        .toast.show {
          opacity: 1;
        }
        @media (max-width: 600px) {
          .guestbook-section {
            padding: 1.2rem 0.2rem 1.5rem 0.2rem;
          }
          .guestbook-title {
            font-size: 1.2rem;
          }
          .guestbook-entry {
            padding: 0.8rem 0.5rem 0.7rem 0.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Guestbook; 