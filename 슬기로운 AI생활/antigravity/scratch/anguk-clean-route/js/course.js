/**
 * Anguk Clean-Route Course Generator & Tracker
 * PAGE 2: 맞춤형 플로깅 코스 추천 및 경로 최적화, 배출 쓰레기통 연계 알고리즘
 */

class CourseGenerator {
  constructor(mapController) {
    this.mapController = mapController;
    this.currentCourse = null;
    this.activeTracking = false;
  }

  // Haversine 거리 계산 (미터 단위)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 지구 반경 (m)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * 플로깅 추천 경로 생성
   * @param {string} startPointId - 선택된 출발지 ID
   * @param {string} targetTime - "30m" | "60m" | "free"
   * @param {string} theme - "alley" | "tourist" | "flat"
   */
  generateCourse(startPointId, targetTime = "30m", theme = "alley") {
    const startObj = window.AngukData.startPoints.find(p => p.id === startPointId) || window.AngukData.startPoints[0];
    const allHotspots = window.AppStore.getHotspots().filter(s => s.status !== "RESOLVED");
    const bins = window.AngukData.publicBins;

    // 1. 테마별 핫스팟 필터링/가중치 부여
    let candidateSpots = allHotspots.filter(spot => {
      if (theme === "alley") {
        return spot.zone === "계동길" || spot.zone === "북촌" || spot.zone === "익선동";
      } else if (theme === "tourist") {
        return spot.zone === "인사동" || spot.zone === "창덕궁" || spot.zone === "운현궁" || spot.zone === "북촌";
      } else if (theme === "flat") {
        // 비교적 평지인 율곡로, 인사동, 운현궁 일대
        return spot.zone === "인사동" || spot.zone === "운현궁" || spot.location_name.includes("안국역");
      }
      return true;
    });

    if (candidateSpots.length === 0) {
      candidateSpots = allHotspots;
    }

    // 2. 목표 시간에 따른 경유 핫스팟 개수 결정
    let maxWaypoints = 3;
    if (targetTime === "30m") maxWaypoints = 3;
    else if (targetTime === "60m") maxWaypoints = 6;
    else maxWaypoints = Math.min(candidateSpots.length, 8);

    // 3. 최근접 이웃(Nearest Neighbor) 휴리스틱으로 핫스팟 순서 정렬
    let currentLat = startObj.lat;
    let currentLng = startObj.lng;
    const orderedSpots = [];
    const remaining = [...candidateSpots];

    while (orderedSpots.length < maxWaypoints && remaining.length > 0) {
      let nearestIdx = -1;
      let minDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const spotLat = remaining[i].lat ?? remaining[i].latitude;
        const spotLng = remaining[i].lng ?? remaining[i].longitude;
        const d = this.calculateDistance(currentLat, currentLng, spotLat, spotLng);
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }

      if (nearestIdx !== -1) {
        const nextSpot = remaining.splice(nearestIdx, 1)[0];
        orderedSpots.push(nextSpot);
        currentLat = nextSpot.lat ?? nextSpot.latitude;
        currentLng = nextSpot.lng ?? nextSpot.longitude;
      }
    }

    // 4. 마지막 핫스팟에서 가장 가까운 종로구 공공 쓰레기통 검색 (분리배출 목적지)
    let bestBin = bins[0];
    let minBinDist = Infinity;
    bins.forEach(bin => {
      const d = this.calculateDistance(currentLat, currentLng, bin.latitude, bin.longitude);
      if (d < minBinDist) {
        minBinDist = d;
        bestBin = bin;
      }
    });

    // 5. 전체 경로 포인트 배열 및 메트릭 산출
    const points = [
      { lat: startObj.lat, lng: startObj.lng, name: startObj.name, type: "START" }
    ];

    let totalMeters = 0;
    let totalTrashEstimate = 0;

    orderedSpots.forEach((spot, idx) => {
      const prev = points[points.length - 1];
      const spotLat = spot.lat ?? spot.latitude;
      const spotLng = spot.lng ?? spot.longitude;
      const dist = this.calculateDistance(prev.lat, prev.lng, spotLat, spotLng);
      totalMeters += dist;
      totalTrashEstimate += (spot.trash_count_estimate || 5);

      points.push({
        lat: spotLat,
        lng: spotLng,
        name: spot.name || spot.location_name,
        type: "HOTSPOT",
        spotData: spot,
        order: idx + 1
      });
    });

    // 최종 쓰레기통 추가
    const lastSpot = points[points.length - 1];
    const finalDist = this.calculateDistance(lastSpot.lat, lastSpot.lng, bestBin.latitude, bestBin.longitude);
    totalMeters += finalDist;

    points.push({
      lat: bestBin.latitude,
      lng: bestBin.longitude,
      name: bestBin.name,
      type: "BIN",
      binData: bestBin
    });

    // 플로깅 칼로리 산출 (약 6km/h 걷기 + 스쿼트 줍기 활동 -> 약 350 kcal/시간 기준)
    const distanceKm = (totalMeters / 1000).toFixed(2);
    const estimatedTimeMin = Math.round((totalMeters / 65) + (orderedSpots.length * 3)); // 걷기 + 정화 시간
    const estimatedCalories = Math.round(estimatedTimeMin * 5.8);

    this.currentCourse = {
      startPoint: startObj,
      endBin: bestBin,
      waypoints: orderedSpots,
      points: points,
      totalDistanceMeters: Math.round(totalMeters),
      distanceKm: distanceKm,
      estimatedTimeMin: estimatedTimeMin,
      estimatedCalories: estimatedCalories,
      totalTrashEstimate: totalTrashEstimate,
      theme: theme
    };

    // 지도에 경로 렌더링
    this.mapController.drawRoute(points, startObj, bestBin);

    return this.currentCourse;
  }

  // 트래킹 완료 시뮬레이션
  completeTracking() {
    if (!this.currentCourse) return null;
    
    // 코스 내 핫스팟들을 수거 완료 처리하고 마일리지 보상 부여
    const count = this.currentCourse.waypoints.length;
    const earnedMileage = count * 200 + 500; // 스팟당 200P + 코스완주 500P

    this.currentCourse.waypoints.forEach(spot => {
      window.AppStore.resolveHotspot(spot.spot_id, "10L", "플로깅 추천 코스 완주자");
    });

    window.AppStore.addMileage(earnedMileage, `안국 플로깅 코스 완주 (${this.currentCourse.distanceKm}km)`);
    this.mapController.clearRoute();
    this.currentCourse = null;

    return {
      cleanedCount: count,
      earnedMileage: earnedMileage
    };
  }
}

window.CourseGenerator = CourseGenerator;
