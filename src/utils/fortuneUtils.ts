// 오행, 일지, 일주, 캐릭터명, 캐릭터이미지 계산 유틸리티

// @ts-ignore
// eslint-disable-next-line
declare module 'lunar-javascript';
import { Lunar } from 'lunar-javascript';

// 실제 일주(간지) 계산 (양력 기준)
export function getDayPillar(birthDate: string, birthTime?: string): string {
  // birthDate: 'YYYY-MM-DD', birthTime: 'HH:MM' (선택)
  const [year, month, day] = birthDate.split('-').map(Number);
  let hour = 0;
  if (birthTime) {
    hour = Number(birthTime.split(':')[0]);
  }
  // lunar-javascript는 0~23시 기준, 분은 무시
  const lunar = Lunar.fromYmdHms(year, month, day, hour, 0, 0);
  return lunar.getDayInGanZhi(); // 예: '을미'
}

// 일지(지지) 추출
export function getDayBranch(dayPillar: string): string {
  // 일주에서 뒤 1~2글자 추출
  return dayPillar.slice(1);
}

// 오행 계산 (천간 기준)
export function getFiveElements(dayPillar: string): string {
  const gan = dayPillar[0];
  const map: Record<string, string> = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수',
  };
  return map[gan] || '미상';
}

// 오행별 컬러
export function getElementColor(element: string): string {
  return {
    '목': '#4CAF50', // 초록
    '화': '#FF7043', // 주황
    '토': '#FFD54F', // 노랑
    '금': '#90A4AE', // 회색
    '수': '#42A5F5', // 파랑
  }[element] || '#eee';
}

// 일지(지지)별 캐릭터명, 이미지
export function getCharacter(dayPillar: string): { name: string, imageUrl: string } {
  const branch = getDayBranch(dayPillar);
  const element = getFiveElements(dayPillar);
  const animals: Record<string, string> = {
    '자': '쥐', '축': '소', '인': '호랑이', '묘': '토끼', '진': '용', '사': '뱀',
    '오': '말', '미': '양', '신': '원숭이', '유': '닭', '술': '개', '해': '돼지',
  };
  const colors: Record<string, string> = {
    '목': '푸른', '화': '붉은', '토': '노란', '금': '하얀', '수': '검은',
  };
  const animal = animals[branch] || '동물';
  const color = colors[element] || '';
  // 이미지: /characters/지지.png (예: /characters/양.png)
  return {
    name: `${color} ${animal}`,
    imageUrl: `/characters/${animal}.png`,
  };
} 