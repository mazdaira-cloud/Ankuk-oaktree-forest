// ==========================================
// 안국 클린 루트 (Anguk Clean-Route) Core App
// ==========================================

// Initial Dataset: 안국역 일대 쓰레기 핫스팟 (5개 이상 밀집 지점)
const INITIAL_HOTSPOTS = [
  {
    id: "ANGUK_SPOT_001",
    title: "안국역 3번 출구 인근 골목 화단",
    address: "서울 종로구 율곡로 45 부근",
    coords: [37.5768, 126.9858],
    count: 8,
    types: ["plastic", "cigarette"],
    typeLabels: ["일회용 컵", "담배꽁초"],
    density: "warning",
    difficulty: "보통 (1인 10분)",
    reportedDate: "2026-09-08",
    status: "UNRESOLVED"
  },
  {
    id: "ANGUK_SPOT_002",
    title: "계동길 런던베이글 앞 골목 틈새",
    address: "서울 종로구 북촌로4길 20",
    coords: [37.5795, 126.9862],
    count: 14,
    types: ["plastic", "packaging"],
    typeLabels: ["일회용 컵", "포장재·비닐"],
    density: "danger",
    difficulty: "높음 (집게/대형 봉투 필요)",
    reportedDate: "2026-09-12",
    status: "UNRESOLVED"
  },
  {
    id: "ANGUK_SPOT_003",
    title: "헌법재판소 맞은편 버스정류장 뒤편",
    address: "서울 종로구 북촌로 15",
    coords: [37.5782, 126.9848],
    count: 6,
    types: ["cigarette"],
    typeLabels: ["담배꽁초"],
    density: "warning",
    difficulty: "쉬움 (1인 5분)",
    reportedDate: "2026-09-15",
    status: "UNRESOLVED"
  },
  {
    id: "ANGUK_SPOT_004",
    title: "안국역 6번 출구 인사동 문화거리 입구",
    address: "서울 종로구 인사동길 62",
    coords: [37.5752, 126.9852],
    count: 12,
    types: ["plastic", "packaging", "etc"],
    typeLabels: ["일회용 컵", "포장재·비닐", "기타"],
    density: "danger",
    difficulty: "높음 (관광객 유동인구 많음)",
    reportedDate: "2026-09-18",
    status: "UNRESOLVED"
  },
  {
    id: "ANGUK_SPOT_005",
    title: "익선동 한옥마을 진입 골목 배전함 옆",
    address: "서울 종로구 삼일대로30길",
    coords: [37.5742, 126.9880],
    count: 9,
    types: ["plastic", "cigarette"],
    typeLabels: ["일회용 컵", "담배꽁초"],
    density: "warning",
    difficulty: "보통 (1인 10분)",
    reportedDate: "2026-09-20",
    status: "UNRESOLVED"
  },
  {
    id: "ANGUK_SPOT_006",
    title: "재동초등학교 삼거리 공공 벤치 주변",
    address: "서울 종로구 북촌로 31-1",
    coords: [37.5810, 126.9855],
    count: 7,
    types: ["plastic", "packaging"],
    typeLabels: ["일회용 컵", "포장재·비닐"],
    density: "warning",
    difficulty: "쉬움 (1인 5분)",
    reportedDate: "2026-09-21",
    status: "UNRESOLVED"
  }
];

// 종로구 공공 쓰레기통 및 분리배출함 위치
const TRASH_BINS = [
  { id: "BIN_01", title: "안국역 1번 출구 앞 공공 쓰레기통", coords: [37.5762, 126.9840], type: "일반/재활용 분리함" },
  { id: "BIN_02", title: "안국역 6번 출구 북인사안내소 앞", coords: [37.5755, 126.9855], type: "재활용 수거함" },
  { id: "BIN_03", title: "헌법재판소 정문 우측 클린 스테이션", coords: [37.5780, 126.9845], type: "공공 클린 스테이션" },
  { id: "BIN_04", title: "계동 현대사옥 입구 분리수거함", coords: [37.5790, 126.9875], type: "일반/캔·페트 분리함" }
];

// 종로구 안국역 인근 제로웨이스트 & 친환경 매장
const ECO_STORES = [
  {
    id: "ECO_01",
    name: "보틀팩토리 안국 팝업",
    category: "제로웨이스트 샵",
    address: "서울 종로구 북촌로 19",
    coords: [37.5785, 126.9850],
    benefit: "텀블러 및 리필 용기 지참 시 전 품목 10% 할인",
    dist: "안국역 도보 3분"
  },
  {
    id: "ECO_02",
    name: "비건 & 에코 카페 플랜트 북촌",
    category: "텀블러 할인 카페",
    address: "서울 종로구 계동길 33",
    coords: [37.5802, 126.9868],
    benefit: "개인 텀블러 주문 시 500원 할인 + 플로깅 인증 10% 쿠폰",
    dist: "안국역 도보 6분"
  },
  {
    id: "ECO_03",
    name: "원모어백 & 에코 공방",
    category: "친환경 라이프스타일",
    address: "서울 종로구 필운대로 6-1",
    coords: [37.5770, 126.9790],
    benefit: "플로깅 인증 플로거 대상 생분해 파우치 증정",
    dist: "경복궁/안국역 인근"
  },
  {
    id: "ECO_04",
    name: "어니언 안국 (Onion Anguk)",
    category: "친환경 실천 매장",
    address: "서울 종로구 계동길 5",
    coords: [37.5775, 126.9865],
    benefit: "개인 다회용 컵 사용 시 500원 할인",
    dist: "안국역 3번 출구 도보 1분"
  }
];

// State
let hotspots = JSON.parse(localStorage.getItem('anguk_hotspots')) || INITIAL_HOTSPOTS;
let activeFilters = {
  trashType: 'all',
  density: 'all',
  layers: {
    hotspots: true,
    trashbins: true,
    ecospots: true
  }
};

let mainMap = null;
let courseMap = null;
let hotspotLayerGroup = null;
let trashbinLayerGroup = null;
let ecospotLayerGroup = null;
let courseLayerGroup = null;

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMainMap();
  initCourseTab();
  initReportTab();
  renderEcoCards();
  updateStats();
});

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Update Top Bar Stats
function updateStats() {
  const unresolved = hotspots.filter(s => s.status === 'UNRESOLVED').length;
  const resolved = 28 + (INITIAL_HOTSPOTS.length - unresolved);
  document.getElementById('stat-active-spots').textContent = unresolved;
  document.getElementById('stat-cleaned-spots').textContent = resolved;
}

// Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.dataset.tab;
      const pane = document.getElementById(target);
      if (pane) pane.classList.add('active');

      // Refresh maps when tab becomes visible
      if (target === 'tab-map' && mainMap) {
        setTimeout(() => mainMap.invalidateSize(), 150);
      } else if (target === 'tab-course') {
        if (!courseMap) initCourseMap();
        else setTimeout(() => courseMap.invalidateSize(), 150);
      }
    });
  });
}

// ==========================================
// TAB 1: Main Interactive Map
// ==========================================
function initMainMap() {
  // An-guk Station coordinates: 37.5765, 126.9856
  mainMap = L.map('map', {
    zoomControl: false
  }).setView([37.5775, 126.9858], 15);

  L.control.zoom({ position: 'bottomright' }).addTo(mainMap);

  // High contrast carto map tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(mainMap);

  hotspotLayerGroup = L.layerGroup().addTo(mainMap);
  trashbinLayerGroup = L.layerGroup().addTo(mainMap);
  ecospotLayerGroup = L.layerGroup().addTo(mainMap);

  renderHotspotMarkers();
  renderTrashbinMarkers();
  renderEcospotMarkers();
  initFilterEvents();
  initDetailCardEvents();
}

function createCustomPin(iconClass, className) {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div class="custom-pin ${className}"><i class="${iconClass}"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
}

function renderHotspotMarkers() {
  hotspotLayerGroup.clearLayers();

  const filtered = hotspots.filter(spot => {
    if (spot.status !== 'UNRESOLVED') return false;
    if (activeFilters.trashType !== 'all' && !spot.types.includes(activeFilters.trashType)) return false;
    if (activeFilters.density !== 'all' && spot.density !== activeFilters.density) return false;
    return true;
  });

  filtered.forEach(spot => {
    const isDanger = spot.density === 'danger';
    const pin = createCustomPin('fa-solid fa-triangle-exclamation', isDanger ? 'danger' : 'warning');
    const marker = L.marker(spot.coords, { icon: pin });

    marker.on('click', () => {
      openSpotDetailCard(spot);
    });

    hotspotLayerGroup.addLayer(marker);
  });
}

function renderTrashbinMarkers() {
  trashbinLayerGroup.clearLayers();
  TRASH_BINS.forEach(bin => {
    const pin = createCustomPin('fa-solid fa-trash-can', 'trashbin');
    const marker = L.marker(bin.coords, { icon: pin });
    marker.bindPopup(`<strong>🗑️ ${bin.title}</strong><br><small style="color:#64748b">${bin.type}</small>`);
    trashbinLayerGroup.addLayer(marker);
  });
}

function renderEcospotMarkers() {
  ecospotLayerGroup.clearLayers();
  ECO_STORES.forEach(eco => {
    const pin = createCustomPin('fa-solid fa-leaf', 'ecospot');
    const marker = L.marker(eco.coords, { icon: pin });
    marker.bindPopup(`<strong>🌱 ${eco.name}</strong><br><small style="color:#059669">${eco.benefit}</small>`);
    ecospotLayerGroup.addLayer(marker);
  });
}

function openSpotDetailCard(spot) {
  const card = document.getElementById('spot-detail-card');
  const badge = document.getElementById('spot-card-badge');
  const title = document.getElementById('spot-card-title');
  const address = document.getElementById('spot-card-address');
  const typesContainer = document.getElementById('spot-card-types');
  const date = document.getElementById('spot-card-date');
  const diff = document.getElementById('spot-card-difficulty');

  title.textContent = spot.title;
  address.textContent = spot.address;
  date.textContent = spot.reportedDate;
  diff.textContent = spot.difficulty;

  if (spot.density === 'danger') {
    badge.className = 'spot-card-badge danger';
    badge.textContent = `🔴 심각 (${spot.count}개 방치)`;
  } else {
    badge.className = 'spot-card-badge';
    badge.textContent = `🟡 주의 (${spot.count}개 방치)`;
  }

  typesContainer.innerHTML = spot.typeLabels.map(t => `<span class="tag">${t}</span>`).join('');
  card.classList.remove('hidden');

  // Quick Action: Start plogging to this spot
  document.getElementById('btn-start-plogging-here').onclick = () => {
    document.querySelector('.nav-tab[data-tab="tab-course"]').click();
    showToast(`'${spot.title}'을(를) 포함한 코스를 생성합니다.`);
    generateCourse('alley');
  };

  // Quick Action: Clean spot
  document.getElementById('btn-clean-spot-here').onclick = () => {
    document.querySelector('.nav-tab[data-tab="tab-report"]').click();
    document.getElementById('btn-mode-certify').click();
    document.getElementById('certify-spot-select').value = spot.id;
  };
}

function initDetailCardEvents() {
  document.getElementById('close-detail-btn').addEventListener('click', () => {
    document.getElementById('spot-detail-card').classList.add('hidden');
  });
}

function initFilterEvents() {
  // Trash Type Chips
  document.querySelectorAll('#trash-type-filters .chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#trash-type-filters .chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.trashType = btn.dataset.type;
      renderHotspotMarkers();
    });
  });

  // Density Chips
  document.querySelectorAll('#density-filters .chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#density-filters .chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.density = btn.dataset.density;
      renderHotspotMarkers();
    });
  });

  // Layer Toggles
  document.getElementById('layer-hotspots').addEventListener('change', (e) => {
    if (e.target.checked) mainMap.addLayer(hotspotLayerGroup);
    else mainMap.removeLayer(hotspotLayerGroup);
  });

  document.getElementById('layer-trashbins').addEventListener('change', (e) => {
    if (e.target.checked) mainMap.addLayer(trashbinLayerGroup);
    else mainMap.removeLayer(trashbinLayerGroup);
  });

  document.getElementById('layer-ecospots').addEventListener('change', (e) => {
    if (e.target.checked) mainMap.addLayer(ecospotLayerGroup);
    else mainMap.removeLayer(ecospotLayerGroup);
  });
}

// ==========================================
// TAB 2: Plogging Course Generator
// ==========================================
function initCourseMap() {
  courseMap = L.map('course-map', { zoomControl: false }).setView([37.5775, 126.9858], 15);
  L.control.zoom({ position: 'bottomright' }).addTo(courseMap);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(courseMap);

  courseLayerGroup = L.layerGroup().addTo(courseMap);
  generateCourse('alley');
}

function initCourseTab() {
  // Theme radio clicks
  document.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input');
      radio.checked = true;
    });
  });

  // Segment time select
  document.querySelectorAll('#course-time-select .segment').forEach(seg => {
    seg.addEventListener('click', () => {
      document.querySelectorAll('#course-time-select .segment').forEach(s => s.classList.remove('active'));
      seg.classList.add('active');
    });
  });

  document.getElementById('btn-generate-route').addEventListener('click', () => {
    const selectedTheme = document.querySelector('input[name="course-theme"]:checked').value;
    generateCourse(selectedTheme);
    showToast('✨ 최적의 플로깅 추천 경로가 생성되었습니다!');
  });
}

function generateCourse(theme) {
  if (!courseMap || !courseLayerGroup) return;
  courseLayerGroup.clearLayers();

  let routeCoords = [];
  let spotsCount = 4;
  let calories = 145;
  let trashEst = 25;

  if (theme === 'insadong') {
    // Insadong route
    routeCoords = [
      [37.5752, 126.9852],
      [37.5742, 126.9880],
      [37.5735, 126.9860],
      [37.5755, 126.9855]
    ];
    spotsCount = 3;
    calories = 130;
    trashEst = 22;
  } else if (theme === 'flat') {
    // Flat route along Yulgok-ro
    routeCoords = [
      [37.5762, 126.9840],
      [37.5768, 126.9858],
      [37.5782, 126.9848],
      [37.5780, 126.9845]
    ];
    spotsCount = 3;
    calories = 110;
    trashEst = 18;
  } else {
    // Alley theme (Bukchon/Gyedong)
    routeCoords = [
      [37.5768, 126.9858],
      [37.5795, 126.9862],
      [37.5810, 126.9855],
      [37.5790, 126.9875],
      [37.5762, 126.9840]
    ];
    spotsCount = 5;
    calories = 185;
    trashEst = 34;
  }

  // Draw Polyline
  const polyline = L.polyline(routeCoords, {
    color: '#059669',
    weight: 6,
    opacity: 0.85,
    dashArray: '10, 10'
  }).addTo(courseLayerGroup);

  // Add markers along route
  routeCoords.forEach((coord, idx) => {
    const isStart = idx === 0;
    const isEnd = idx === routeCoords.length - 1;
    let iconClass = 'fa-solid fa-flag-checkered';
    let pinClass = 'warning';

    if (isStart) {
      iconClass = 'fa-solid fa-person-running';
      pinClass = 'ecospot';
    }

    const pin = createCustomPin(iconClass, pinClass);
    L.marker(coord, { icon: pin }).addTo(courseLayerGroup)
      .bindPopup(`<strong>${isStart ? '🚩 출발 지점' : isEnd ? '🏁 최종 배출 및 도착점' : `경유 포인트 #${idx}`}</strong>`);
  });

  courseMap.fitBounds(polyline.getBounds(), { padding: [40, 40] });

  // Update Summary UI
  document.getElementById('res-spots-count').textContent = `${spotsCount}개소`;
  document.getElementById('res-calories').textContent = `${calories} kcal`;
  document.getElementById('res-trash-est').textContent = `약 ${trashEst}개`;
}

// ==========================================
// TAB 3: Report & Certification
// ==========================================
function initReportTab() {
  const btnReport = document.getElementById('btn-mode-report');
  const btnCertify = document.getElementById('btn-mode-certify');
  const formReport = document.getElementById('form-report-container');
  const formCertify = document.getElementById('form-certify-container');

  btnReport.addEventListener('click', () => {
    btnReport.classList.add('active');
    btnCertify.classList.remove('active');
    formReport.classList.remove('hidden');
    formCertify.classList.add('hidden');
  });

  btnCertify.addEventListener('click', () => {
    btnCertify.classList.add('active');
    btnReport.classList.remove('active');
    formCertify.classList.remove('hidden');
    formReport.classList.add('hidden');
    populateCertifySelect();
  });

  // GPS Current Location Simulation
  document.getElementById('btn-gps-current').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          document.getElementById('report-coords').value = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
          showToast('📍 현재 GPS 좌표가 입력되었습니다.');
        },
        () => {
          document.getElementById('report-coords').value = '37.5765, 126.9856';
          showToast('안국역 기본 좌표(37.5765, 126.9856)로 설정되었습니다.');
        }
      );
    }
  });

  // Submit New Spot Report
  document.getElementById('btn-submit-report').addEventListener('click', () => {
    const title = document.getElementById('report-title').value.trim();
    const coordsStr = document.getElementById('report-coords').value.split(',');
    const count = parseInt(document.getElementById('report-count').value, 10) || 8;

    if (!title) {
      alert('장소 명칭을 입력해주세요.');
      return;
    }

    const lat = parseFloat(coordsStr[0]) || 37.5765;
    const lng = parseFloat(coordsStr[1]) || 126.9856;

    const newSpot = {
      id: `ANGUK_SPOT_${Date.now()}`,
      title: title,
      address: `서울 종로구 안국동 부근 (${title})`,
      coords: [lat, lng],
      count: count,
      types: ["plastic", "cigarette"],
      typeLabels: ["일회용 컵", "담배꽁초"],
      density: count >= 10 ? "danger" : "warning",
      difficulty: count >= 10 ? "높음 (수거 요망)" : "보통 (1인 10분)",
      reportedDate: new Date().toISOString().split('T')[0],
      status: "UNRESOLVED"
    };

    hotspots.unshift(newSpot);
    localStorage.setItem('anguk_hotspots', JSON.stringify(hotspots));

    renderHotspotMarkers();
    updateStats();
    showToast('🎉 핫스팟 제보가 성공적으로 등록되었습니다! (+50P 적립)');

    // Reset form
    document.getElementById('report-title').value = '';
    document.querySelector('.nav-tab[data-tab="tab-map"]').click();
  });

  // Submit Clean Certification
  document.getElementById('btn-submit-certify').addEventListener('click', () => {
    const spotId = document.getElementById('certify-spot-select').value;
    const targetSpot = hotspots.find(s => s.id === spotId);
    if (targetSpot) {
      targetSpot.status = 'RESOLVED';
      localStorage.setItem('anguk_hotspots', JSON.stringify(hotspots));
      renderHotspotMarkers();
      updateStats();
    }

    showToast('🏆 플로깅 정화 인증이 완료되었습니다! (+200P 그린 마일리지 지급)');
    document.querySelector('.nav-tab[data-tab="tab-map"]').click();
  });
}

function populateCertifySelect() {
  const select = document.getElementById('certify-spot-select');
  select.innerHTML = '';
  const unresolved = hotspots.filter(s => s.status === 'UNRESOLVED');
  if (unresolved.length === 0) {
    select.innerHTML = '<option>모든 핫스팟이 정화 완료되었습니다! 🌿</option>';
    return;
  }
  unresolved.forEach(spot => {
    const opt = document.createElement('option');
    opt.value = spot.id;
    opt.textContent = `[${spot.density === 'danger' ? '🔴심각' : '🟡주의'}] ${spot.title} (쓰레기 약 ${spot.count}개)`;
    select.appendChild(opt);
  });
}

// ==========================================
// TAB 4: Zero Waste Stores
// ==========================================
function renderEcoCards() {
  const container = document.getElementById('eco-grid');
  if (!container) return;

  container.innerHTML = ECO_STORES.map(store => `
    <div class="eco-card">
      <div class="eco-card-header">
        <span class="eco-category"><i class="fa-solid fa-leaf"></i> ${store.category}</span>
        <span class="eco-distance">${store.dist}</span>
      </div>
      <div class="eco-card-body">
        <h3 class="eco-name">${store.name}</h3>
        <p class="eco-address"><i class="fa-solid fa-location-dot"></i> ${store.address}</p>
        <div class="eco-benefit">
          <i class="fa-solid fa-gift"></i>
          <span>${store.benefit}</span>
        </div>
      </div>
      <div class="eco-card-footer">
        <button class="btn btn-secondary btn-block btn-sm" onclick="showToast('${store.name} 혜택 쿠폰이 발급되었습니다!')">
          <i class="fa-solid fa-ticket"></i> 에코 쿠폰 받기
        </button>
      </div>
    </div>
  `).join('');
}
