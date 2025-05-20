import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface MatchChatProps {
  user: any;
  onBack: () => void;
}

interface User {
  id: number;
  name: string;
  day_pillar?: string;
}

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

const MatchChat: React.FC<MatchChatProps> = ({ user, onBack }) => {
  const [matchUser, setMatchUser] = useState<User | null>(null);
  const [matchId, setMatchId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. 매칭 로직: 내 user.id와 궁합이 잘 맞는(다른) user_fortune을 자동 매칭
  useEffect(() => {
    const fetchMatch = async () => {
      // 내 일주 계산 (간단 예시)
      const myDayPillar = user.day_pillar || '경신일주';
      // 궁합이 잘 맞는 일주 리스트 (실제 로직은 추후 확장)
      const bestMatches = ['경신일주', '무신일주', '병신일주', '무술일주', '병오일주'];
      // 최근 입력된 다른 사용자 중 궁합이 맞는 사람 찾기
      const { data: candidates } = await supabase
        .from('user_fortune')
        .select('*')
        .neq('id', user.id)
        .in('day_pillar', bestMatches)
        .order('created_at', { ascending: false })
        .limit(1);
      if (candidates && candidates.length > 0) {
        setMatchUser(candidates[0]);
        // chat_match 생성 또는 기존 매칭 찾기
        const { data: matchData } = await supabase
          .from('chat_match')
          .select('*')
          .or(`user_id.eq.${user.id},matched_user_id.eq.${user.id}`)
          .or(`user_id.eq.${candidates[0].id},matched_user_id.eq.${candidates[0].id}`)
          .limit(1);
        let matchIdVal = null;
        if (matchData && matchData.length > 0) {
          matchIdVal = matchData[0].id;
        } else {
          // 새 매칭 생성
          const { data: newMatch } = await supabase.from('chat_match').insert([
            { user_id: user.id, matched_user_id: candidates[0].id }
          ]).select().single();
          matchIdVal = newMatch?.id;
        }
        setMatchId(matchIdVal);
      }
      setLoading(false);
    };
    fetchMatch();
  }, [user]);

  // 2. 실시간 메시지 구독 및 불러오기
  useEffect(() => {
    if (!matchId) return;
    let subscription: any;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_message')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();
    // 실시간 구독
    subscription = supabase
      .channel('chat-message')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_message', filter: `match_id=eq.${matchId}` }, payload => {
        setMessages(msgs => [...msgs, payload.new as Message]);
      })
      .subscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [matchId]);

  // 3. 메시지 전송
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !matchId) return;
    await supabase.from('chat_message').insert([
      { match_id: matchId, sender_id: user.id, message: input }
    ]);
    setInput('');
  };

  // 4. 스크롤 하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>매칭 중...</div>;
  if (!matchUser) return <div style={{ textAlign: 'center', marginTop: 80 }}>아직 매칭 상대가 없습니다.<br /><button onClick={onBack} style={{marginTop:16}}>돌아가기</button></div>;

  return (
    <section className="chat-section">
      <div className="chat-header">
        <button className="chat-back" onClick={onBack}>←</button>
        <div className="chat-title">{matchUser.name}님과의 채팅</div>
      </div>
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.sender_id === user.id ? 'me' : 'other'}`}>{msg.message}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button className="chat-send" type="submit">전송</button>
      </form>
      <style>{`
        .chat-section { max-width: 420px; margin: 2rem auto; background: #fff; border-radius: 20px; box-shadow: 0 4px 32px #0002; display: flex; flex-direction: column; height: 70vh; }
        .chat-header { display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid #eee; }
        .chat-back { background: none; border: none; font-size: 1.3rem; cursor: pointer; margin-right: 0.5rem; color: #ea8d8d; }
        .chat-title { font-size: 1.1rem; font-weight: 700; color: #ea8d8d; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 1.2rem; display: flex; flex-direction: column; gap: 0.7rem; }
        .chat-bubble { max-width: 70%; padding: 0.7em 1.1em; border-radius: 16px; font-size: 1.05rem; word-break: break-all; }
        .chat-bubble.me { align-self: flex-end; background: linear-gradient(90deg, #ea8d8d 0%, #ffb88c 100%); color: #fff; }
        .chat-bubble.other { align-self: flex-start; background: #f5f5f5; color: #333; }
        .chat-input-row { display: flex; border-top: 1px solid #eee; padding: 0.7rem; gap: 0.5rem; }
        .chat-input { flex: 1; border-radius: 12px; border: 1.5px solid #eee; padding: 0.7rem 1rem; font-size: 1rem; }
        .chat-send { background: linear-gradient(90deg, #ea8d8d 0%, #ffb88c 100%); color: #fff; border: none; border-radius: 10px; padding: 0.7rem 1.2rem; font-size: 1rem; font-weight: 600; cursor: pointer; }
        @media (max-width: 600px) { .chat-section { height: 90vh; } }
      `}</style>
    </section>
  );
};

export default MatchChat; 