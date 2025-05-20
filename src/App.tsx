import React, { useState } from 'react'
import './styles/App.css'
import ColorShades from './components/ColorShades'
import { generatePrimaryColorFromConcept, generateSecondaryColors } from './utils/colorUtils'
import Guestbook from './components/Guestbook'
import FortuneForm from './components/FortuneForm'
import FortuneResult from './components/FortuneResult'
import MatchChat from './components/MatchChat'

interface ColorResult {
  color: string;
  name: string;
  description?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null)
  const [concept, setConcept] = useState('')
  const [primaryColor, setPrimaryColor] = useState('')
  const [primaryResult, setPrimaryResult] = useState<ColorResult | null>(null)
  const [secondaryResults, setSecondaryResults] = useState<ColorResult[]>([])
  const [showChat, setShowChat] = useState(false)

  const generatePrimaryColor = () => {
    if (!concept.trim()) {
      alert('웹 서비스 컨셉을 입력해주세요!')
      return
    }

    const color = generatePrimaryColorFromConcept(concept)
    
    // Generate description based on concept
    let description = ''
    const conceptLower = concept.toLowerCase()
    
    if (conceptLower.includes('게임') || conceptLower.includes('game')) {
      description = '게임과 관련된 서비스에는 활기찬 에너지를 표현하는 밝은 컬러가 잘 어울려요.'
    } else if (conceptLower.includes('건강') || conceptLower.includes('피트니스') || conceptLower.includes('운동')) {
      description = '건강한 생활을 상징하는 신선하고 활력 있는 컬러로 사용자의 동기부여를 높여줄 수 있어요.'
    } else if (conceptLower.includes('음식') || conceptLower.includes('레시피') || conceptLower.includes('요리')) {
      description = '식욕을 돋구는 따뜻한 컬러로 음식과 관련된 서비스의 특성을 잘 살려줄 수 있어요.'
    } else if (conceptLower.includes('학습') || conceptLower.includes('교육') || conceptLower.includes('공부')) {
      description = '학습에 집중할 수 있는 차분하면서도 지적인 느낌의 컬러를 추천해드려요.'
    } else if (conceptLower.includes('여행') || conceptLower.includes('관광')) {
      description = '모험과 즐거움을 연상시키는 밝고 경쾌한 컬러로 여행의 설렘을 표현해요.'
    } else if (conceptLower.includes('패션') || conceptLower.includes('쇼핑')) {
      description = '트렌디하고 세련된 느낌의 컬러로 패션 서비스의 스타일리시함을 강조해요.'
    } else if (conceptLower.includes('금융') || conceptLower.includes('투자')) {
      description = '신뢰감과 안정감을 주는 프로페셔널한 컬러로 금융 서비스의 신뢰도를 높여줘요.'
    } else {
      description = '입력하신 서비스 컨셉에 가장 잘 어울리는 컬러를 분석하여 추천해드렸어요.'
    }

    setPrimaryResult({
      color,
      name: '메인',
      description
    })
  }

  const generateSecondaryColorsFromPrimary = () => {
    if (!primaryColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      alert('올바른 컬러 코드를 입력하세요 (예: #342434)')
      return
    }

    const colors = generateSecondaryColors(primaryColor)
    setSecondaryResults([
      {
        color: colors[0],
        name: '보조1',
        description: '메인 컬러와 보색 관계로, 강력한 대비를 이루어 시각적 긴장감을 줍니다.'
      },
      {
        color: colors[1],
        name: '보조2',
        description: '메인 컬러와 120도 각도의 삼각 배색으로, 균형잡힌 조화를 이룹니다.'
      },
      {
        color: colors[2],
        name: '보조3',
        description: '메인 컬러와 240도 각도의 삼각 배색으로, 안정적인 구조를 만듭니다.'
      },
      {
        color: colors[3],
        name: '보조4',
        description: '메인 컬러와 유사한 색상으로, 자연스러운 그라데이션 효과를 줍니다.'
      }
    ])
  }

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