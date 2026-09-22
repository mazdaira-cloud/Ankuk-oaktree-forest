/**
 * Anguk 700 Digital Oaks - Municipal Administrative Insight Controller
 * 지자체(종로구청/환경부) 제안용 행정 리포트, 사각지대 Top 3 분석, GeoJSON 내보내기, 건의 공문 생성
 */

class AdminReportController {
  constructor() {
    this.blindspotCandidates = [];
  }

  // Haversine 거리 계산 (미터)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  }

  // 데이터 분석 및 사각지대 순위 도출
  analyzeData() {
    const hotspots = window.AppStore ? window.AppStore.getHotspots() : window.AngukData.initialHotspots;
    const bins = window.AngukData.publicBins;

    // 각 거점별로 가장 가까운 쓰레기통과의 거리 계산 및 50m 인접 여부 판정
    const enrichedSpots = hotspots.map(spot => {
      let minDistance = Infinity;
      let closestBin = null;

      bins.forEach(bin => {
        const d = this.calculateDistance(spot.lat, spot.lng, bin.latitude, bin.longitude);
        if (d < minDistance) {
          minDistance = d;
          closestBin = bin;
        }
      });

      const hasNearbyBin = minDistance <= 50;
      return {
        ...spot,
        nearestBinDistance: Math.round(minDistance),
        closestBinName: closestBin ? closestBin.name : "-",
        hasTrashCanNearby: hasNearbyBin
      };
    });

    // 사각지대 후보: 50m 버퍼 바깥에 위치한 곳
    // 우선순위 정렬: 레벨이 낮을수록 (Lv.0 우선), 쓰레기 추정량이 많을수록, 가장 가까운 쓰레기통과의 거리가 멀수록 상위
    const blindspots = enrichedSpots.filter(s => !s.hasTrashCanNearby);
    blindspots.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level; // 레벨 낮은 순 (취약한 곳)
      if (b.trash_count_estimate !== a.trash_count_estimate) {
        return b.trash_count_estimate - a.trash_count_estimate; // 투기량 많은 순
      }
      return b.nearestBinDistance - a.nearestBinDistance; // 쓰레기통에서 더 먼 순
    });

    this.blindspotCandidates = blindspots.slice(0, 3); // 상위 3곳

    // 통계 지표 산출
    const totalSpots = enrichedSpots.length;
    const totalExp = enrichedSpots.reduce((acc, s) => acc + (s.exp || 0), 0);
    const resolvedSpots = enrichedSpots.filter(s => s.level >= 5).length;
    const blindspotCount = blindspots.length;
    const estimatedCleanedVolume = totalExp * 12; // 회당 평균 12L 수거 환산

    return {
      totalSpots,
      totalExp,
      resolvedSpots,
      blindspotCount,
      estimatedCleanedVolume,
      topCandidates: this.blindspotCandidates,
      allEnrichedSpots: enrichedSpots
    };
  }

  // 모달 렌더링
  renderModal() {
    const analysis = this.analyzeData();

    // 요약 KPI
    const totalEl = document.getElementById("admin-kpi-total");
    const expEl = document.getElementById("admin-kpi-exp");
    const blindEl = document.getElementById("admin-kpi-blind");
    const volEl = document.getElementById("admin-kpi-vol");

    if (totalEl) totalEl.textContent = analysis.totalSpots + "개소";
    if (expEl) expEl.textContent = analysis.totalExp + "회";
    if (blindEl) blindEl.textContent = analysis.blindspotCount + "개소";
    if (volEl) volEl.textContent = analysis.estimatedCleanedVolume.toLocaleString() + " L";

    // 상위 3개 권고 구역 리스트
    const listEl = document.getElementById("admin-top-candidates-list");
    if (listEl) {
      if (analysis.topCandidates.length === 0) {
        listEl.innerHTML = `<div style="padding:12px; color:#64748b; text-align:center;">모든 거점이 쓰레기통 50m 반경 내에 보호되고 있습니다.</div>`;
      } else {
        listEl.innerHTML = analysis.topCandidates.map((cand, idx) => `
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-left:4px solid #ef4444; border-radius:10px; padding:12px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:11px; font-weight:800; background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:6px;">
                🚨 설치 권고 ${idx + 1}순위 (사각지대)
              </span>
              <span style="font-size:11px; color:#64748b; font-weight:bold;">
                최인접 휴지통 거리: <strong style="color:#ef4444;">${cand.nearestBinDistance}m</strong>
              </span>
            </div>
            <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin:4px 0;">${cand.name}</h4>
            <div style="font-size:12px; color:#475569; margin-bottom:4px;">
              📍 정밀 좌표: <code style="background:#f1f5f9; padding:2px 4px; border-radius:4px;">${cand.lat.toFixed(5)}, ${cand.lng.toFixed(5)}</code>
            </div>
            <div style="font-size:12px; color:#64748b; background:#f8fafc; padding:6px 8px; border-radius:6px;">
              💡 <strong>투기 현황:</strong> ${cand.description} (초기 추정 ${cand.trash_count_estimate}개, 현재 성장 ${cand.level}단계)
            </div>
          </div>
        `).join("");
      }
    }
  }

  // GeoJSON 데이터 생성 및 파일 다운로드
  downloadGeoJSON() {
    const analysis = this.analyzeData();
    const bins = window.AngukData.publicBins;

    const features = [];

    // 1. 투기 및 정화 거점 Point Features
    analysis.allEnrichedSpots.forEach(spot => {
      const levelInfo = window.GrowthManager.getLevelInfo(spot.exp || 0);
      features.push({
        type: "Feature",
        properties: {
          id: spot.id,
          name: spot.name,
          level: spot.level,
          level_name: levelInfo.name,
          exp: spot.exp || 0,
          trash_count_estimate: spot.trash_count_estimate,
          hasTrashCanNearby: spot.hasTrashCanNearby,
          nearestBinDistanceMeters: spot.nearestBinDistance,
          closestBinName: spot.closestBinName,
          description: spot.description,
          zone: spot.zone
        },
        geometry: {
          type: "Point",
          coordinates: [spot.lng, spot.lat]
        }
      });
    });

    // 2. 공공 쓰레기통 Point Features
    bins.forEach(bin => {
      features.push({
        type: "Feature",
        properties: {
          bin_id: bin.bin_id,
          name: bin.name,
          type: bin.type,
          coverage_buffer_meters: 50,
          description: bin.description
        },
        geometry: {
          type: "Point",
          coordinates: [bin.longitude, bin.latitude]
        }
      });
    });

    // 3. 추천 플로깅 순회 경로 (LineString)
    const circuitCoords = analysis.allEnrichedSpots.map(s => [s.lng, s.lat]);
    if (circuitCoords.length > 1) {
      features.push({
        type: "Feature",
        properties: {
          name: "안국역 700 디지털 떡갈나무 플로깅 순회 경로",
          type: "RECOMMENDED_CIRCUIT"
        },
        geometry: {
          type: "LineString",
          coordinates: circuitCoords
        }
      });
    }

    const geojson = {
      type: "FeatureCollection",
      metadata: {
        title: "안국역 디지털 사회적 조각 '700그루의 디지털 떡갈나무' 행정 분석 데이터셋",
        generated_at: new Date().toISOString(),
        author: "안국역 시민 플로깅 참여단 & Clean-Route Team",
        basis: "요셉 보이스 7000 Eichen 사회적 조각 프로젝트"
      },
      features: features
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "anguk_digital_oaks_administrative_report.geojson");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (window.AppStore) {
      window.AppStore.showToast("📁 GeoJSON 파일이 성공적으로 다운로드되었습니다.");
    }
  }

  // 종로구청 / 환경부 건의용 공문 요약본 클립보드 복사
  copyAdministrativePetition() {
    const analysis = this.analyzeData();
    const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

    const topListText = analysis.topCandidates.map((c, i) => `
${i + 1}. [설치 권고 ${i + 1}순위] ${c.name}
  - 정밀 좌표: 위도 ${c.lat.toFixed(5)}, 경도 ${c.lng.toFixed(5)}
  - 쓰레기통 사각지대 거리: 최인접 공공휴지통으로부터 ${c.nearestBinDistance}m 이격 (반경 50m 초과)
  - 현장 투기 현황: ${c.description} (테이크아웃 컵 및 담배꽁초 상습 적치 구역)`).join("\n");

    const petitionText = `[민원 제안서: 안국역 일대 무단투기 사각지대 해소를 위한 공공 쓰레기통 신규 설치 건의]

1. 수신: 서울특별시 종로구청장 (참조: 청소행정과장, 도시미관과장)
2. 발신: 안국역 '700그루의 디지털 떡갈나무' 시민 플로깅 참여단
3. 일자: ${today}

4. 제안 배경:
안국역 일대(북촌, 계동길, 인사동)는 관광객과 유동인구가 집중되는 도심 관광지이나, 테이크아웃 컵 및 담배꽁초 무단 투기가 빈발하고 있습니다.
본 참여단은 예술가 요셉 보이스(Joseph Beuys)의 《7000그루의 떡갈나무》 '사회적 조각' 철학을 기반으로, 안국역 현장에서 시민 직접 수거 활동을 펼치며 GIS 데이터(서울시 가로휴지통 OA-15069 기준)를 수집·분석하였습니다.

5. 현장 데이터 분석 요약:
- 안국역 일대 총 모니터링 거점: ${analysis.totalSpots}개소
- 누적 시민 플로깅 정화 활동: 총 ${analysis.totalExp}회 (수거 추정량 약 ${analysis.estimatedCleanedVolume}L)
- 기존 공공 쓰레기통(반경 50m) 커버리지 사각지대: 총 ${analysis.blindspotCount}개소 확인

6. 신규 공공 쓰레기통 / 분리배출함 설치 권고 1순위 구역:
${topListText}

7. 건의 사항:
위 권고 지점들은 기존 가로 쓰레기통의 50m 보행 유효 반경을 벗어나 시민들의 분리배출이 원천적으로 불가능한 구역입니다.
상기 3개소에 신규 분리배출 쓰레기통(재활용/일반 분리형) 또는 클린하우스 정거장의 우선 설치를 정중히 건의드립니다.

첨부: 안국역 무단투기 사각지대 GIS 공간분석 데이터셋 (GeoJSON 별첨)`;

    navigator.clipboard.writeText(petitionText).then(() => {
      if (window.AppStore) {
        window.AppStore.showToast("📋 종로구청 건의 공문 전문이 클립보드에 복사되었습니다!");
      } else {
        alert("종로구청 건의 공문 전문이 클립보드에 복사되었습니다.");
      }
    }).catch(err => {
      console.error("클립보드 복사 실패", err);
      alert("클립보드 복사에 실패했습니다.");
    });
  }
}

window.AdminReportController = AdminReportController;
