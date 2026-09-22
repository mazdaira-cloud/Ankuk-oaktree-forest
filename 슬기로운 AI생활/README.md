# 🌿 안국 클린 루트 (Anguk Clean-Route)
> **안국역 일대 도심 관광지 무단 투기 쓰레기 핫스팟 지도 & 플로깅 경로 추천 플랫폼**

![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)
![Status: Active](https://img.shields.io/badge/Status-Deploy%20Ready-success.svg)

---

## 📌 1. 프로젝트 개요 (Overview)
안국역 일대(북촌 한옥마을, 계동길, 인사동, 익선동)는 국내외 관광객과 유동인구가 밀집한 대표적인 도심 관광지입니다.  
테이크아웃 일회용품 및 무단 투기 쓰레기 문제를 해결하기 위해, **실제 쓰레기 밀집 구역(5개 이상 방치 구역)을 타겟팅하여 수거하고 정화할 수 있는 데이터 기반의 인터랙티브 플로깅 지도**를 제공합니다.

---

## ✨ 2. 주요 핵심 기능 (Features)

### 🗺️ 1. 핫스팟 인터랙티브 대시보드
- Leaflet 기반 안국역 일대 쓰레기 핫스팟(5~9개 주의 🟡, 10개 이상 심각 🔴) 시각화
- 쓰레기 유형별 필터(일회용 컵, 담배꽁초, 포장재·비닐 등)
- 종로구 공공 쓰레기통 / 클린스테이션 위치 레이어 연동
- 핫스팟 상세 카드 & 원클릭 플로깅 연동

### 🏃 2. 맞춤형 플로깅 코스 추천 & 트래킹
- 출발지(안국역 2·3·6번 출구, 헌법재판소 등) 선택
- 테마별 코스(북촌 골목길 집중 정화, 인사동 문화거리, 평지 쾌적 코스)
- 코스별 예상 소모 칼로리 및 쓰레기 수거량 산출

### 📸 3. 크라우드소싱 스팟 제보 & 정화 인증
- 시민 참여형 신규 쓰레기 다발 구역 제보 (GPS 연동)
- Before / After 수거 인증 및 그린 마일리지 지급 시스템

### 🌿 4. 종로구 제로웨이스트 & 에코 상권 연계
- 안국역 인근 텀블러 할인 카페 및 리필스테이션 지도
- 플로거 전용 에코 쿠폰 및 리워드 생태계

---

## 🚀 3. Vercel 배포 가이드 (Deployment)

1. **GitHub 저장소 Import**: [Vercel](https://vercel.com)에 로그인 후 `Ankuk-Digital-Oak-Forest-Project-` 저장소를 불러옵니다.
2. **배포 클릭**: 정적 웹 애플리케이션(`index.html`, `style.css`, `app.js`)이므로 별도의 빌드 설정 없이 **Deploy** 버튼을 누르면 즉시 배포됩니다.
3. **도메인 연결**: Vercel 프로젝트 대시보드 `Settings > Domains`에서 원하시는 커스텀 도메인을 등록할 수 있습니다.

---

## 🛠️ 4. 기술 스택 (Tech Stack)
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Custom Design System)
- **Map Engine**: Leaflet.js, CartoDB Voyager Maps
- **Icons & Typography**: FontAwesome 6, Pretendard, Plus Jakarta Sans
- **Deployment**: Vercel & GitHub Actions
