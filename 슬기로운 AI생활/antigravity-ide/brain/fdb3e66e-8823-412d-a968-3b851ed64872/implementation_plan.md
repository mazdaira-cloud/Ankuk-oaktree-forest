# 안국역 700 디지털 떡갈나무: Web App 전환 구현 계획서 (Implementation Plan)

본 프로젝트(안국역 일대 8단계 떡갈나무 사회적 조각 및 플로깅 행정 제안 플랫폼)를 모바일과 데스크톱 환경에서 네이티브 앱처럼 동작하는 **현대적인 Progressive Web App(PWA) 기반의 웹 애플리케이션**으로 전면 변형·고도화합니다.

---

## 🎯 주요 개선 및 변형 목표

1. **PWA (Progressive Web App) 규격 적용**:
   - `manifest.webmanifest`: 홈 화면 추가, 독립 창(Standalone) 실행, 테마 컬러, 바로가기 메뉴(Shortcuts) 구성.
   - `sw.js` (Service Worker): 오프라인 캐싱, 맵 타일/정적 에셋 빠른 로딩, 오프라인 환경 지원.
   - 앱 설치 유도 배너 및 설치 버튼(`beforeinstallprompt` 이벤트 연동).
   - 고해상도 앱 아이콘 및 파비콘 에셋 제작.

2. **모바일 최적화 App Shell 및 인터랙티브 UI**:
   - **모바일 바텀 내비게이션 바 (Bottom Navigation Bar)**: 엄지손가락으로 손쉽게 5대 탭(📍 숲 지도, 🏃 플로깅, 📸 거점 제보, 🌿 에코샵, 🏛️ 행정 리포트) 전환.
   - **드래그형 바텀 시트 (Interactive Bottom Sheet)**: 모바일 화면에서 지도를 가리지 않고 제스처/터치로 3단계(축소/절반/확장) 크기 조절.
   - **데스크톱 플로팅 글래스모피즘 사이드바**: 패널 접기/펼치기 토글과 고급 블러 이펙트 적용.
   - **다크/라이트 모드 지원** 및 실시간 GPS 수신 상태 인디케이터.

3. **고도화된 웹 앱 기능 추가**:
   - **실시간 플로깅 운동 트래커 (Live Plogging Tracker)**: 시작/일시정지/종료, 타이머, 이동거리, 소모 칼로리, GPS 궤적 지도 실시간 드로잉.
   - **8단계 떡갈나무 성장 비주얼라이저 & 축하 이펙트**: 레벨업 시 컨페티(Confetti) 폭죽 및 Web Audio 사운드 효과.
   - **도토리 디지털 인증서/SNS 공유 카드 생성기**: HTML5 Canvas를 이용해 내 나무 성장 증명서(이미지)를 즉시 저장 및 공유.
   - **모바일 카메라 현장 촬영 연동**: `capture="environment"`를 통한 즉시 촬영 및 타임스탬프 워터마크 프리뷰.
   - **에코 쿠폰 바코드/QR코드 인터랙션**: 제로웨이스트 매장 및 텀블러 할인 현장 제시용 바코드 생성.

4. **개발 및 실행 환경 구성 (`package.json`)**:
   - `npm run dev` 또는 `npm start`로 로컬 개발 서버(Vite / Node Static Server)를 구동할 수 있는 환경 제공.
   - 브라우저에서 직접 `index.html` 파일을 열어도 완벽히 동작하는 무결성 유지.

---

## 🏗️ Proposed Changes (상세 변경 내역)

### 1. PWA & Web App 기반 설정 및 에셋

#### [NEW] [manifest.webmanifest](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/manifest.webmanifest)
- Web App Manifest 파일 (App Name, Icons, Theme Color `#047857`, Standalone Display Mode, Shortcuts)

#### [NEW] [sw.js](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/sw.js)
- Service Worker 파일 (App Shell 캐시, Leaflet/폰트 CDN 오프라인 대응, 패치 전략)

#### [NEW] [assets/icons/icon.svg](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/assets/icons/icon.svg)
#### [NEW] [assets/icons/icon-192.png](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/assets/icons/icon-192.png)
#### [NEW] [assets/icons/icon-512.png](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/assets/icons/icon-512.png)
#### [NEW] [assets/icons/favicon.svg](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/assets/icons/favicon.svg)
- 현대적인 떡갈나무 & 황금빛 아우라 디자인의 고화질 벡터 및 래스터 앱 아이콘.

---

### 2. UI 레이아웃 및 스타일 시스템

#### [MODIFY] [css/styles.css](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/css/styles.css)
- 모바일 바텀 내비게이션 바(`.mobile-nav-bar`) 및 안전영역(Safe Area Inset) 스타일링.
- 드래그 바텀 시트(`.bottom-sheet`) 인터랙션 스타일링.
- 다크/라이트 테마 변수 토큰 및 토글 버튼 스타일링.
- 실시간 플로깅 트래커 위젯 및 상태 HUD.
- 인증서 모달 캔버스 및 쿠폰 바코드 UI.
- PWA 설치 안내 팝업 및 토스트 알림 고도화.

---

### 3. 메인 HTML 및 앱 쉘 구조

#### [MODIFY] [index.html](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/index.html)
#### [MODIFY] [안국역 떡갈나무 숲(가제) 0915.html](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/%EC%95%88%EA%B5%AD%EC%97%AD%20%EB%96%A1%EA%B0%88%EB%82%98%EB%AC%B4%20%EC%88%B2%28%EA%B0%80%EC%A0%9C%29%200915.html)
- PWA 메타 태그 (`theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `manifest` 링크).
- 모바일 바텀 네비게이션 바 HTML 구조 추가.
- 실시간 플로깅 트래킹 컨트롤 바 & 통계 HUD 추가.
- 디지털 떡갈나무 인증서 생성/공유 모달 추가.
- PWA 설치 유도 플로팅 배너 및 설치 버튼 추가.
- 카메라 촬영 연동 인풋 속성 보강 (`capture="environment"`).

---

### 4. 핵심 JS 모듈 및 기능 확장

#### [NEW] [js/pwa.js](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/js/pwa.js)
- PWA Service Worker 등록, `beforeinstallprompt` 수신 및 설치 유도 인터페이스 제어, 온라인/오프라인 네트워크 상태 감지.

#### [NEW] [js/tracker.js](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/js/tracker.js)
- 실시간 플로깅 운동 트래커 (타이머, 소모 칼로리, GPS 보행 거리 누적, 지도상 실시간 궤적 폴리라인 렌더링).

#### [NEW] [js/effects.js](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/js/effects.js)
- Web Audio API 기반 오디오 효과음 (레벨업 차임, 플로깅 완료음) & Canvas Confetti 폭죽 이펙트 & 떡갈나무 수호목 인증서 캔버스 생성기.

#### [MODIFY] [js/app.js](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/js/app.js)
- 모바일 바텀 시트 드래그 제스처 및 탭 연동.
- 트래커 및 효과음, 인증서 모달 전역 연동.
- 모바일 카메라 프리뷰 및 타임스탬프 합성 로직.

#### [MODIFY] [js/map.js](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/js/map.js)
- 실시간 플로깅 사용자 이동 경로(Live Path) 레이어 추가.
- 모바일 터치 및 제스처 맵 인터랙션 부드러운 스케일링.

---

### 5. 프로젝트 패키지 및 개발 서버 설정

#### [NEW] [package.json](file:///c:/Users/User/.gemini/antigravity/scratch/anguk-clean-route/package.json)
- `npm run dev` (Vite 또는 초경량 로컬 웹앱 서버 구동) 스크립트 제공.

---

## 🧪 Verification Plan

### 1. PWA & Web App 기능 검증
- **Lighthouse / Manifest 검사**: `manifest.webmanifest` 및 `sw.js` 등록 확인, `display: standalone` 동작 확인.
- **앱 설치 프롬프트**: 설치 버튼 클릭 시 브라우저 설치 대화상자 호출 여부 확인.

### 2. 반응형 레이아웃 및 모바일 UX 검증
- 모바일 뷰포트(375px~430px)에서 하단 바텀 내비게이션 바 및 바텀 시트 동작 확인.
- 데스크톱 뷰포트(1280px+)에서 좌측 플로팅 사이드바 패널 및 지도 상호작용 확인.

### 3. 실시간 플로깅 트래커 및 인터랙션 검증
- 플로깅 시작 → 타이머 및 칼로리 카운트 증가 → 지도 경로 추적 → 완료 시 인증서 생성 확인.
- 거점 플로깅 인증 시 8단계 레벨업 애니메이션 및 Confetti 이펙트 정상 발생 확인.
- 지자체 제안 리포트(GeoJSON 다운로드 및 건의문 복사) 기능 정상 유지 확인.
