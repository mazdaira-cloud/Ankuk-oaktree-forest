/**
 * Anguk 700 Digital Oaks - Seed Dataset
 * 요셉 보이스 '사회적 조각' 철학 기반 안국역 일대 거점 및 공공 쓰레기통(OA-15069)
 */

const ANGUK_CENTER = {
  lat: 37.5765,
  lng: 126.9855,
  zoom: 16
};

// 1. 무단 투기 및 떡갈나무 성장 거점 데이터셋 (8단계 레벨 및 exp 스키마)
const INITIAL_HOTSPOTS = [
  {
    id: 1,
    spot_id: "ANGUK_SPOT_001",
    name: "안국역 2번 출구 북촌로 진입 골목",
    lat: 37.5772,
    lng: 126.9858,
    level: 0,
    exp: 0,
    hasTrashCanNearby: false,
    description: "테이크아웃 컵 및 담배꽁초 다발 투기 구역 (사각지대)",
    trash_count_estimate: 15,
    trash_types: ["일회용 컵", "담배꽁초"],
    difficulty: "보통",
    hazard_note: "화단 틈새와 배수구 덮개에 꽁초 및 플라스틱 컵 다수 투기",
    photo_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
    zone: "북촌로"
  },
  {
    id: 2,
    spot_id: "ANGUK_SPOT_002",
    name: "윤보선길 초입 카페 밀집 구간",
    lat: 37.5781,
    lng: 126.9839,
    level: 3,
    exp: 7,
    hasTrashCanNearby: true,
    description: "정기 플로깅 활동 진행 중 (본잎 단계)",
    trash_count_estimate: 5,
    trash_types: ["일회용 컵", "비닐·포장재"],
    difficulty: "쉬움",
    hazard_note: "카페 테이크아웃 컵 잔여물 주기적 수거 구역",
    photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    zone: "윤보선길"
  },
  {
    id: 3,
    spot_id: "ANGUK_SPOT_003",
    name: "북촌로 5가길 한옥 골목길 축대 틈새",
    lat: 37.5815,
    lng: 126.9832,
    level: 0,
    exp: 0,
    hasTrashCanNearby: false,
    description: "관광객들이 음료 컵과 꼬치류를 축대 뒤편에 무단 적치 (사각지대 🔴)",
    trash_count_estimate: 18,
    trash_types: ["일회용 컵", "비닐·포장재", "꼬치류"],
    difficulty: "어려움",
    hazard_note: "한옥 석축 틈새 쓰레기 밀집, 쓰레기통과 150m 이상 이격",
    photo_url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80",
    zone: "북촌"
  },
  {
    id: 4,
    spot_id: "ANGUK_SPOT_004",
    name: "계동길 배렴가옥 앞 골목 배수구",
    lat: 37.5802,
    lng: 126.9867,
    level: 2,
    exp: 4,
    hasTrashCanNearby: false,
    description: "한옥 담벼락 아래 배수구 덮개 사이 꽁초 투기 구역 (새싹 단계 🌱)",
    trash_count_estimate: 8,
    trash_types: ["담배꽁초", "비닐·포장재"],
    difficulty: "쉬움",
    hazard_note: "담벼락 사이 꽁초 밀집, 지역 주민 자원봉사자 수거 중",
    photo_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    zone: "계동길"
  },
  {
    id: 5,
    spot_id: "ANGUK_SPOT_005",
    name: "인사동 쌈지길 후문 샛골목",
    lat: 37.5744,
    lng: 126.9849,
    level: 1,
    exp: 2,
    hasTrashCanNearby: true,
    description: "길거리 음식 포장지 및 탕후루 꼬치 다발 (씨앗 단계 🌰)",
    trash_count_estimate: 12,
    trash_types: ["일회용 컵", "비닐·포장재", "꼬치류"],
    difficulty: "어려움",
    hazard_note: "나무 꼬치 찔림 주의, 인근 북인사마당 휴지통 유도 필요",
    photo_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    zone: "인사동"
  },
  {
    id: 6,
    spot_id: "ANGUK_SPOT_006",
    name: "익선동 한옥카페 골목 막다른 길",
    lat: 37.5735,
    lng: 126.9882,
    level: 0,
    exp: 0,
    hasTrashCanNearby: false,
    description: "에어컨 실외기 틈새 테이크아웃 플라스틱 컵 끼워넣기 (사각지대 🔴)",
    trash_count_estimate: 16,
    trash_types: ["일회용 컵", "비닐·포장재"],
    difficulty: "보통",
    hazard_note: "실외기 화재 위험 및 쓰레기통 50m 반경 밖 고립 구역",
    photo_url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80",
    zone: "익선동"
  },
  {
    id: 7,
    spot_id: "ANGUK_SPOT_007",
    name: "운현궁 담장길 쉼터 벤치 하부",
    lat: 37.5756,
    lng: 126.9875,
    level: 4,
    exp: 12,
    hasTrashCanNearby: true,
    description: "역사문화재 담장 옆 쉼터 (어린 나무 단계 🪴)",
    trash_count_estimate: 4,
    trash_types: ["담배꽁초", "비닐·포장재"],
    difficulty: "쉬움",
    hazard_note: "플로거 동호회 '안국지킴이' 집중 수거로 정화 정착 중",
    photo_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
    zone: "운현궁"
  },
  {
    id: 8,
    spot_id: "ANGUK_SPOT_008",
    name: "창덕궁 돈화문로 연결 보행로 가로수",
    lat: 37.5772,
    lng: 126.9904,
    level: 5,
    exp: 18,
    hasTrashCanNearby: true,
    description: "가로수 보호틀 주변 상시 정화 (큰 나무 단계 🌳)",
    trash_count_estimate: 3,
    trash_types: ["일회용 컵", "기타"],
    difficulty: "쉬움",
    hazard_note: "인근 창덕궁 삼거리 분리배출함과 성공적 연계",
    photo_url: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80",
    zone: "창덕궁"
  },
  {
    id: 9,
    spot_id: "ANGUK_SPOT_009",
    name: "감고당길 (정독도서관 방향) 돌담 쉼터",
    lat: 37.5786,
    lng: 126.9818,
    level: 7,
    exp: 35,
    hasTrashCanNearby: false,
    description: "요셉 보이스의 사회적 조각 완성 모범 사례 (황금빛 세계수 ✨)",
    trash_count_estimate: 0,
    trash_types: ["일회용 컵", "비닐·포장재"],
    difficulty: "완료",
    hazard_note: "시민 35회 연속 플로깅 완수로 무단투기 완전 퇴치 달성 구역",
    photo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    zone: "북촌"
  },
  {
    id: 10,
    spot_id: "ANGUK_SPOT_010",
    name: "안국역 6번 출구 북인사마당 입구 화단",
    lat: 37.5758,
    lng: 126.9842,
    level: 6,
    exp: 24,
    hasTrashCanNearby: true,
    description: "인사동 진입로 수호목 (고령 나무 단계 🌲)",
    trash_count_estimate: 2,
    trash_types: ["담배꽁초", "일회용 컵"],
    difficulty: "쉬움",
    hazard_note: "북인사마당 수거함 바로 앞, 상시 관리 우수",
    photo_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    zone: "인사동"
  }
];

// 2. 서울 열린데이터광장(OA-15069) 기반 종로구 공공 쓰레기통 및 50m 커버리지 버퍼
const PUBLIC_TRASH_BINS = [
  {
    bin_id: "BIN_001",
    name: "안국역 1번 출구 가로변 공공 쓰레기통",
    latitude: 37.5762,
    longitude: 126.9848,
    type: "일반/재활용 분리형",
    buffer_radius_m: 50,
    zone: "안국역",
    description: "3호선 안국역 1번 출구 에스컬레이터 앞 보도"
  },
  {
    bin_id: "BIN_002",
    name: "안국역 3번 출구 버스정류장 수거함",
    latitude: 37.5767,
    longitude: 126.9863,
    type: "일반/재활용 분리형",
    buffer_radius_m: 50,
    zone: "안국역",
    description: "종로01/종로02 마을버스 정류소 바로 옆"
  },
  {
    bin_id: "BIN_003",
    name: "북촌 관광안내소 입구 공공 수거함",
    latitude: 37.5795,
    longitude: 126.9839,
    type: "재활용 집중형",
    buffer_radius_m: 50,
    zone: "북촌",
    description: "재동초등학교 앞 관광안내소 보행로"
  },
  {
    bin_id: "BIN_004",
    name: "북인사마당 관광안내소 앞 쓰레기통",
    latitude: 37.5753,
    longitude: 126.9846,
    type: "일반/재활용 분리형",
    buffer_radius_m: 50,
    zone: "인사동",
    description: "인사동 문화의거리 북쪽 입구 상징 조형물 부근"
  },
  {
    bin_id: "BIN_005",
    name: "창덕궁 삼거리 보행로 분리배출함",
    latitude: 37.5781,
    longitude: 126.9908,
    type: "일반/재활용 분리형",
    buffer_radius_m: 50,
    zone: "창덕궁",
    description: "돈화문 앞 사거리 횡단보도 대기선 옆"
  },
  {
    bin_id: "BIN_006",
    name: "계동 현대사옥 맞은편 재활용 수거함",
    latitude: 37.5788,
    longitude: 126.9869,
    type: "종량제/재활용 분리형",
    buffer_radius_m: 50,
    zone: "계동길",
    description: "계동길 초입 편의점 옆 인도"
  },
  {
    bin_id: "BIN_007",
    name: "종로 세무서 옆 골목 클린하우스",
    latitude: 37.5728,
    longitude: 126.9892,
    type: "종로구 상설 클린하우스",
    buffer_radius_m: 50,
    zone: "익선동",
    description: "대형 종량제 봉투 및 플라스틱 대량 분리배출 가능"
  }
];

// 3. 종로구 안국역 일대 에코 & 제로웨이스트 샵 (쿠폰 없이 순수 친환경 매장 소개)
const ZERO_WASTE_SPOTS = [
  {
    shop_id: "ZERO_001",
    name: "더피커 & 에코라움 안국 팝업",
    category: "zerowaste",
    category_label: "에코 & 제로웨이스트 샵",
    latitude: 37.5782,
    longitude: 126.9841,
    phone: "02-730-1234",
    address: "서울 종로구 북촌로 19 (안국역 2번 출구 도보 3분)",
    eco_feature: "무포장 유기농 곡물, 친환경 생필품, 대나무 칫솔 및 천연 수세미 등 제로웨이스트 라이프스타일 굿즈 전문점",
    open_hours: "10:30 - 20:00",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
  },
  {
    shop_id: "ZERO_002",
    name: "카페 슬로우포레스트 삼청",
    category: "tumbler",
    category_label: "친환경 카페",
    latitude: 37.5812,
    longitude: 126.9815,
    phone: "02-733-5678",
    address: "서울 종로구 삼청로 130",
    eco_feature: "일회용품을 최소화하고 생분해 컵과 텀블러 사용을 장려하는 북촌 삼청동 숲속 친환경 카페",
    open_hours: "11:00 - 21:00",
    image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
  },
  {
    shop_id: "ZERO_003",
    name: "오세계향 (인사동 비건 전통한식)",
    category: "vegan",
    category_label: "비건 친환경 식당",
    latitude: 37.5746,
    longitude: 126.9852,
    phone: "02-735-7171",
    address: "서울 종로구 인사동12길 14-5",
    eco_feature: "탄소 배출을 줄이는 100% 식물성 비건 재료만을 사용하는 인사동의 대표적인 친환경 전통 한식당",
    open_hours: "11:30 - 21:00",
    image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
  },
  {
    shop_id: "ZERO_004",
    name: "어니언 안국 (Onion)",
    category: "tumbler",
    category_label: "친환경 한옥 베이커리",
    latitude: 37.5769,
    longitude: 126.9868,
    phone: "02-743-2121",
    address: "서울 종로구 계동길 5 (안국역 3번 출구 앞)",
    eco_feature: "다회용 텀블러 지참 적극 권장 및 옥수수 전분 생분해 빨대를 사용하는 한옥 문화 카페",
    open_hours: "07:00 - 22:00",
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
  },
  {
    shop_id: "ZERO_005",
    name: "업사이클링 공방 '결'",
    category: "workshop",
    category_label: "새활용 문화 공방",
    latitude: 37.5798,
    longitude: 126.9872,
    phone: "02-766-9901",
    address: "서울 종로구 계동길 88",
    eco_feature: "버려지는 플라스틱 병뚜껑과 폐현수막을 일상 소품으로 재탄생시키는 계동길 업사이클 공방",
    open_hours: "10:00 - 18:00 (월 휴무)",
    image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
  },
  {
    shop_id: "ZERO_006",
    name: "알맹상점 리필스테이션 종로 파트너",
    category: "zerowaste",
    category_label: "리필스테이션",
    latitude: 37.5739,
    longitude: 126.9878,
    phone: "02-720-4321",
    address: "서울 종로구 수표로28길 21",
    eco_feature: "개인 용기를 지참하여 원하는 용량만큼 친환경 세제와 화장품을 덜어 구매하는 소분 리필 매장",
    open_hours: "12:00 - 20:00",
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
  }
];

// 4. 안국역 일대 주민 및 관광객을 위한 도심 녹지 & 휴식 쉼터
const GREEN_REST_SPOTS = [
  {
    green_id: "GREEN_001",
    name: "열린송현 녹지광장",
    type: "도심 잔디광장 & 야생화원",
    latitude: 37.5756,
    longitude: 126.9825,
    address: "서울 종로구 송현동 48-9 (안국역 1번 출구 도보 2분)",
    features: "3만 7천㎡ 규모의 드넓은 천연 잔디광장, 계절 야생화(코스모스, 해바라기) 군락, 그늘 벤치 쉼터, 완만한 보행 산책로",
    open_hours: "24시간 상시 무료 개방",
    rest_tip: "넓은 하늘과 북악산이 한눈에 보이는 탁 트인 잔디밭에서 돗자리를 펴거나 벤치에 앉아 조용히 휴식하기 좋습니다.",
    image_url: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80"
  },
  {
    green_id: "GREEN_002",
    name: "정독도서관 야외 숲 정원",
    type: "도서관 녹음 쉼터",
    latitude: 37.5806,
    longitude: 126.9826,
    address: "서울 종로구 북촌로5길 48",
    features: "백 년 고목 느티나무와 벚나무 숲, 등나무 그늘 휴게 벤치, 잔디마당 및 분수대",
    open_hours: "07:00 - 22:00 (연중 개방, 무료)",
    rest_tip: "북촌 한옥마을 언덕을 걷다 나무 그늘 벤치에서 책을 읽거나 시원한 바람을 쐬며 땀을 식히기 최적의 녹지 쉼터입니다.",
    image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
  },
  {
    green_id: "GREEN_003",
    name: "운현궁 야외 마당 및 송림 쉼터",
    type: "전통 한옥 녹지 쉼터",
    latitude: 37.5758,
    longitude: 126.9877,
    address: "서울 종로구 삼일대로 464 (안국역 4번 출구 도보 1분)",
    features: "고풍스러운 노락당/이로당 한옥 처마 그늘, 소나무 숲 벤치, 조용하고 아늑한 전통 도심 정원",
    open_hours: "09:00 - 18:00 (월요일 휴관, 무료 입장)",
    rest_tip: "안국역 바로 옆에 위치해 접근성이 뛰어나며, 도심 속 소음에서 벗어나 고즈넉하게 쉴 수 있는 힐링 명소입니다.",
    image_url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80"
  },
  {
    green_id: "GREEN_004",
    name: "감고당길 보행 돌담길 쉼터",
    type: "돌담 가로수 포켓 쉼터",
    latitude: 37.5778,
    longitude: 126.9828,
    address: "서울 종로구 율곡로3길 (안국동 ↔ 화동)",
    features: "차 없는 보행 전용 돌담길, 가로수 그늘 나무 벤치, 버스킹 및 길거리 예술 쉼터",
    open_hours: "상시 개방",
    rest_tip: "인사동에서 북촌으로 넘어가는 돌담길을 따라 곳곳에 나무 벤치가 마련되어 있어 가벼운 산책 중 쉬어가기 좋습니다.",
    image_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80"
  },
  {
    green_id: "GREEN_005",
    name: "창덕궁 돈화문 앞 율곡로 궁궐숲길",
    type: "궁궐 녹지 산책로",
    latitude: 37.5776,
    longitude: 126.9902,
    address: "서울 종로구 율곡로 99",
    features: "율곡로 도로 지하화로 복원된 궁궐 녹지 보행축, 울창한 소나무 및 회화나무 숲, 보행 목재 데크 쉼터",
    open_hours: "상시 개방",
    rest_tip: "창덕궁과 종묘의 푸른 궁궐 담장을 바라보며 솔바람을 느낄 수 있는 도심 속 쾌적한 숲길 쉼터입니다.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  },
  {
    green_id: "GREEN_006",
    name: "계동 배렴가옥 열린 한옥 안뜰",
    type: "한옥 문화 예술 쉼터",
    latitude: 37.5804,
    longitude: 126.9868,
    address: "서울 종로구 계동길 89",
    features: "등록문화재 한옥, 아담한 마당 수목과 툇마루 쉼터, 무료 전시 및 쉼터 공간",
    open_hours: "10:00 - 18:00 (월요일 휴무, 무료 개방)",
    rest_tip: "계동길 골목 플로깅 후 툇마루에 걸터앉아 마당의 작은 정원을 감상하며 조용히 사색하기 좋습니다.",
    image_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
  }
];

// 5. 추천 플로깅 출발지
const START_POINTS = [
  { id: "START_01", name: "안국역 3번 출구 (계동길 방면)", lat: 37.5768, lng: 126.9860 },
  { id: "START_02", name: "안국역 2번 출구 (북촌 방면)", lat: 37.5766, lng: 126.9855 },
  { id: "START_03", name: "안국역 6번 출구 (인사동 입구)", lat: 37.5759, lng: 126.9844 },
  { id: "START_04", name: "헌법재판소 정문 앞", lat: 37.5784, lng: 126.9840 },
  { id: "START_05", name: "익선동 입구 (운현궁 방면)", lat: 37.5736, lng: 126.9880 }
];

window.AngukData = {
  center: ANGUK_CENTER,
  initialHotspots: INITIAL_HOTSPOTS,
  publicBins: PUBLIC_TRASH_BINS,
  zeroWasteSpots: ZERO_WASTE_SPOTS,
  greenSpaces: GREEN_REST_SPOTS,
  startPoints: START_POINTS
};
