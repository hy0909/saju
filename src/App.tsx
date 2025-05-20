import React, { useState } from 'react'
import './styles/App.css'
import FortuneForm from './components/FortuneForm'
import FortuneResult from './components/FortuneResult'
import MatchChat from './components/MatchChat'

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null)
  const [showChat, setShowChat] = useState(false)

  // CTA: 소개팅 매칭 버튼 클릭 시
  const handleMatch = () => {
    setShowChat(true)
  }

  // 공유 버튼 클릭 시
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '나의 사주 궁합 결과',
        text: '나와 잘 맞는 궁합을 확인해보세요!',
        url: window.location.href,
      })
    } else {
      window.navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다!')
    }
  }

  // 채팅에서 돌아가기
  const handleBackFromChat = () => {
    setShowChat(false)
  }

  return (
    <div className="app">
      {!user ? (
        <FortuneForm onComplete={setUser} />
      ) : showChat ? (
        <MatchChat user={user} onBack={handleBackFromChat} />
      ) : (
        <FortuneResult user={user} onMatch={handleMatch} onShare={handleShare} />
      )}
    </div>
  )
}

export default App 