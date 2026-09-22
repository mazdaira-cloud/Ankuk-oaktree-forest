/**
 * Anguk 700 Digital Oaks - Growth System Controller (게이미피케이션 8단계 성장 엔진)
 * 요셉 보이스의 《7000그루의 떡갈나무》 사회적 조각 메타포를 적용한 진화 로직
 */

const TREE_LEVELS = [
  {
    level: 0,
    name: "도토리 / 현무암 돌기둥",
    minExp: 0,
    maxExp: 0,
    icon: "🪨",
    badgeClass: "badge-lv0",
    markerClass: "tree-lv0",
    color: "#475569",
    meaning: "투기 취약 상태. 요셉 보이스의 돌기둥처럼 시민의 정화 손길을 기다립니다.",
    quote: "모든 인간은 예술가이며, 사회를 조각할 수 있다. — Joseph Beuys"
  },
  {
    level: 1,
    name: "씨앗",
    minExp: 1,
    maxExp: 2,
    icon: "🌰",
    badgeClass: "badge-lv1",
    markerClass: "tree-lv1",
    color: "#78350f",
    meaning: "첫 정화의 손길이 닿아 흙 속에 묻힌 떡갈나무 씨앗.",
    quote: "도시의 상처 위에 심어진 작은 회복의 약속"
  },
  {
    level: 2,
    name: "새싹",
    minExp: 3,
    maxExp: 5,
    icon: "🌱",
    badgeClass: "badge-lv2",
    markerClass: "tree-lv2",
    color: "#84cc16",
    meaning: "시민의 지속적인 발걸음으로 흙을 뚫고 돋아난 연둣빛 새싹.",
    quote: "쓰레기가 사라진 자리에 생명이 움틉니다."
  },
  {
    level: 3,
    name: "본잎",
    minExp: 6,
    maxExp: 9,
    icon: "🌿",
    badgeClass: "badge-lv3",
    markerClass: "tree-lv3",
    color: "#10b981",
    meaning: "뿌리를 내리고 튼튼한 떡갈나무 본잎이 펼쳐진 상태.",
    quote: "거리의 질서가 시민의 의식으로 조각되는 중입니다."
  },
  {
    level: 4,
    name: "어린 나무",
    minExp: 10,
    maxExp: 14,
    icon: "🪴",
    badgeClass: "badge-lv4",
    markerClass: "tree-lv4",
    color: "#059669",
    meaning: "거리의 버팀목으로 자라나는 늠름한 묘목.",
    quote: "골목의 미관을 안정적으로 지키는 든든한 초록 방패"
  },
  {
    level: 5,
    name: "큰 나무",
    minExp: 15,
    maxExp: 20,
    icon: "🌳",
    badgeClass: "badge-lv5",
    markerClass: "tree-lv5",
    color: "#047857",
    meaning: "풍성한 잎사귀로 보행자에게 쾌적함을 주는 성목(成木).",
    quote: "무단 투기가 완전히 억제된 상시 청결 구역"
  },
  {
    level: 6,
    name: "고령 나무",
    minExp: 21,
    maxExp: 29,
    icon: "🌲",
    badgeClass: "badge-lv6",
    markerClass: "tree-lv6",
    color: "#064e3b",
    meaning: "안국역 일대를 대표하는 거대한 수호목(守護木).",
    quote: "시민 연대의 힘으로 일구어낸 도심 생태 문화유산"
  },
  {
    level: 7,
    name: "세계수 (World Tree)",
    minExp: 30,
    maxExp: Infinity,
    icon: "✨",
    badgeClass: "badge-lv7",
    markerClass: "tree-lv7",
    color: "#eab308",
    meaning: "황금빛 아우라를 내뿜는 완전한 사회적 조각의 완성.",
    quote: "7000그루의 떡갈나무가 완성하는 궁극의 치유와 연대"
  }
];

class GrowthManager {
  static getLevelInfo(exp = 0) {
    const safeExp = Math.max(0, parseInt(exp, 10) || 0);

    for (let i = TREE_LEVELS.length - 1; i >= 0; i--) {
      if (safeExp >= TREE_LEVELS[i].minExp) {
        const cur = TREE_LEVELS[i];
        const next = TREE_LEVELS[i + 1] || null;
        
        let progressPercent = 100;
        let expToNext = 0;

        if (next) {
          const range = next.minExp - cur.minExp;
          const currentInRange = safeExp - cur.minExp;
          progressPercent = Math.min(100, Math.round((currentInRange / range) * 100));
          expToNext = next.minExp - safeExp;
        }

        return {
          level: cur.level,
          name: cur.name,
          icon: cur.icon,
          badgeClass: cur.badgeClass,
          markerClass: cur.markerClass,
          color: cur.color,
          meaning: cur.meaning,
          quote: cur.quote,
          currentExp: safeExp,
          nextLevelExp: next ? next.minExp : null,
          expToNext: expToNext,
          progressPercent: progressPercent,
          isMax: !next
        };
      }
    }
    return TREE_LEVELS[0];
  }

  // 경험치 추가 및 레벨업 여부 판단
  static addExp(currentExp = 0, gain = 1) {
    const prevInfo = GrowthManager.getLevelInfo(currentExp);
    const newExp = currentExp + gain;
    const newInfo = GrowthManager.getLevelInfo(newExp);
    const didLevelUp = newInfo.level > prevInfo.level;

    return {
      newExp: newExp,
      didLevelUp: didLevelUp,
      prevLevel: prevInfo.level,
      newLevel: newInfo.level,
      newInfo: newInfo
    };
  }
}

window.GrowthManager = GrowthManager;
window.TREE_LEVELS = TREE_LEVELS;
