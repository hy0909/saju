// 컨셉에 따른 컬러 매핑
const conceptColorMap: { [key: string]: string[] } = {
  // 금융, 비즈니스
  finance: ['#1E3D59', '#2D5DA1', '#0066CC', '#17458F'],
  business: ['#1B365D', '#1E4477', '#0A2F5C', '#2E5C8A'],
  
  // 테크, IT
  tech: ['#2962FF', '#2979FF', '#2196F3', '#03A9F4'],
  innovation: ['#00B0FF', '#0091EA', '#40C4FF', '#80D8FF'],
  
  // 건강, 의료
  health: ['#43A047', '#388E3C', '#66BB6A', '#4CAF50'],
  medical: ['#039BE5', '#0288D1', '#29B6F6', '#03A9F4'],
  
  // 교육
  education: ['#5E35B1', '#512DA8', '#673AB7', '#7E57C2'],
  learning: ['#3949AB', '#303F9F', '#3F51B5', '#5C6BC0'],
  
  // 식품, 요리
  food: ['#EF5350', '#F44336', '#E57373', '#FF8A80'],
  restaurant: ['#FB8C00', '#F57C00', '#FFB74D', '#FFE0B2'],
  
  // 예술, 창작
  art: ['#8E24AA', '#6A1B9A', '#AB47BC', '#CE93D8'],
  creative: ['#FF4081', '#F50057', '#FF80AB', '#FF4081'],
  
  // 환경, 자연
  nature: ['#43A047', '#388E3C', '#66BB6A', '#81C784'],
  eco: ['#009688', '#00796B', '#4DB6AC', '#80CBC4'],
  
  // 패션, 뷰티
  fashion: ['#EC407A', '#D81B60', '#F06292', '#FF80AB'],
  beauty: ['#FF80AB', '#FF4081', '#F50057', '#C51162'],
  
  // 스포츠, 피트니스
  sports: ['#FF3D00', '#DD2C00', '#FF6E40', '#FF9E80'],
  fitness: ['#F57C00', '#EF6C00', '#FB8C00', '#FFA726']
}

// 키워드 매칭 점수 계산
const calculateKeywordScore = (concept: string, keyword: string): number => {
  const conceptLower = concept.toLowerCase()
  const keywordLower = keyword.toLowerCase()
  
  if (conceptLower.includes(keywordLower)) return 1
  
  // 연관 키워드 매칭
  const relatedKeywords: { [key: string]: string[] } = {
    finance: ['금융', '은행', '투자', '돈', '자산', '금전'],
    business: ['비즈니스', '기업', '회사', '상업', '경영'],
    tech: ['기술', 'IT', '테크', '디지털', '온라인'],
    innovation: ['혁신', '창의', '미래', '첨단'],
    health: ['건강', '웰빙', '운동', '의료'],
    medical: ['의료', '병원', '진료', '치료'],
    education: ['교육', '학습', '학교', '강의'],
    learning: ['학습', '공부', '교육', '지식'],
    food: ['음식', '요리', '맛집', '레스토랑', '식당'],
    restaurant: ['식당', '레스토랑', '요리', '외식'],
    art: ['예술', '미술', '창작', '디자인'],
    creative: ['창의', '창작', '디자인', '예술'],
    nature: ['자연', '환경', '생태', '친환경'],
    eco: ['환경', '친환경', '생태', '지속가능'],
    fashion: ['패션', '의류', '옷', '스타일'],
    beauty: ['뷰티', '화장품', '미용', '메이크업'],
    sports: ['스포츠', '운동', '경기', '체육'],
    fitness: ['피트니스', '운동', '헬스', '건강']
  }

  const keywords = relatedKeywords[keyword] || []
  return keywords.some(k => conceptLower.includes(k)) ? 0.8 : 0
}

// 컨셉에 가장 적합한 컬러 선택
export const generatePrimaryColorFromConcept = (concept: string): string => {
  let bestMatch = ''
  let highestScore = 0

  Object.entries(conceptColorMap).forEach(([keyword, colors]) => {
    const score = calculateKeywordScore(concept, keyword)
    if (score > highestScore) {
      highestScore = score
      bestMatch = colors[0] // 첫 번째 컬러 선택
    }
  })

  // 매칭되는 키워드가 없으면 기본 컬러 반환
  return highestScore > 0 ? bestMatch : '#2196F3'
}

// HSL 컬러 변환 함수들
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // HEX to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }
  
  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  let l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

const HSLToHex = (h: number, s: number, l: number): string => {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c/2
  let r = 0
  let g = 0
  let b = 0

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0')

  return `#${rHex}${gHex}${bHex}`
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number): string => {
    const hex = Math.max(0, Math.min(255, n)).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mix(a: number, b: number, amount: number) {
  return Math.round(a + (b - a) * amount)
}

export const generateShades = (baseColor: string): string[] => {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return []

  // Tailwind 스타일: 600이 base, 50은 연한 파랑, 100~500은 흰색과 혼합, 700~900은 검정과 혼합
  const shadeLevels = [
    { label: 50,  mix: 1,   to: 255 }, // 50은 별도 처리
    { label: 100, mix: 0.9, to: 255 },
    { label: 200, mix: 0.7, to: 255 },
    { label: 300, mix: 0.5, to: 255 },
    { label: 400, mix: 0.3, to: 255 },
    { label: 500, mix: 0.15, to: 255 },
    { label: 600, mix: 0,   to: null }, // base
    { label: 700, mix: 0.15, to: 0 },   // black
    { label: 800, mix: 0.3,  to: 0 },
    { label: 900, mix: 0.5,  to: 0 },
  ]

  return shadeLevels.map(({ mix: m, to, label }) => {
    if (label === 50) {
      // 더 연한 파란색으로 고정 (Tailwind sky-50)
      return '#f5faff'
    }
    let r = rgb.r, g = rgb.g, b = rgb.b
    if (to === 255) {
      r = mix(rgb.r, 255, m)
      g = mix(rgb.g, 255, m)
      b = mix(rgb.b, 255, m)
    } else if (to === 0) {
      r = mix(rgb.r, 0, m)
      g = mix(rgb.g, 0, m)
      b = mix(rgb.b, 0, m)
    }
    return rgbToHex(r, g, b)
  })
}

// 보조 컬러 생성
export const generateSecondaryColors = (primaryColor: string): string[] => {
  const { h, s, l } = hexToHSL(primaryColor)
  
  // 보색, 분할보색, 유사색 생성
  return [
    HSLToHex((h + 180) % 360, s, l), // 보색
    HSLToHex((h + 120) % 360, s, l), // 삼각 배색 1
    HSLToHex((h + 240) % 360, s, l), // 삼각 배색 2
    HSLToHex((h + 60) % 360, s, l),  // 유사색
  ]
} 