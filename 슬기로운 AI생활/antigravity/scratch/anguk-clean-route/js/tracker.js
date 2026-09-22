/**
 * Anguk 700 Digital Oaks - Live Plogging Tracker
 * 실시간 플로깅 운동 기록 (타이머, GPS 궤적 폴리라인, 이동거리, 소모 칼로리, 실시간 HUD)
 */

class PloggingTracker {
  constructor() {
    this.isActive = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedElapsed = 0;
    this.timerInterval = null;

    this.pathPoints = []; // [[lat, lng], ...]
    this.totalDistanceMeters = 0;
    this.caloriesBurned = 0;
    this.collectedTrashCount = 0;

    this.watchId = null;
    this.simulatedInterval = null;
  }

  // 플로깅 시작
  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.pausedElapsed = 0;
    this.pathPoints = [];
    this.totalDistanceMeters = 0;
    this.caloriesBurned = 0;
    this.collectedTrashCount = 0;

    // 현재 사용자 위치를 첫 포인트로
    const curLoc = window.AppStore ? window.AppStore.userLocation : { lat: 37.5768, lng: 126.9858 };
    this.pathPoints.push([curLoc.lat, curLoc.lng]);

    // 맵에 실시간 궤적 레이어 초기화
    if (window.CleanRouteMapInstance) {
      window.CleanRouteMapInstance.initLiveTrackerPath(this.pathPoints);
    }

    // 타이머 인터벌 가동
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);

    // 실시간 GPS 추적 활성화
    this.startLocationWatch();

    // UI HUD 표시
    this.updateUI();
    const hud = document.getElementById("plogging-live-hud");
    if (hud) hud.classList.add("active");

    if (window.EffectsManager) {
      window.EffectsManager.playSound("start");
    }

    if (window.AppStore) {
      window.AppStore.showToast("🏃 플로깅 트래킹을 시작합니다! 안전에 유의하여 걸어주세요.");
    }
  }

  // 일시정지 / 재개 토글
  togglePause() {
    if (!this.isActive) return;

    if (this.isPaused) {
      // 재개
      this.isPaused = false;
      this.startTime = Date.now() - this.pausedElapsed;
      if (window.AppStore) window.AppStore.showToast("▶️ 플로깅을 재개합니다.");
    } else {
      // 일시정지
      this.isPaused = true;
      this.pausedElapsed = Date.now() - this.startTime;
      if (window.AppStore) window.AppStore.showToast("⏸️ 플로깅이 일시정지되었습니다.");
    }
    this.updateUI();
  }

  // 플로깅 완료 및 종료
  finish() {
    if (!this.isActive) return;

    const totalDurationSec = Math.floor((this.isPaused ? this.pausedElapsed : (Date.now() - this.startTime)) / 1000);
    const finalDistanceKm = (this.totalDistanceMeters / 1000).toFixed(2);
    const finalCalories = Math.round(this.caloriesBurned);
    const finalTrash = this.collectedTrashCount;

    // 정리
    clearInterval(this.timerInterval);
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    if (this.simulatedInterval) {
      clearInterval(this.simulatedInterval);
    }

    this.isActive = false;
    this.isPaused = false;

    const hud = document.getElementById("plogging-live-hud");
    if (hud) hud.classList.remove("active");

    // 보너스 마일리지 지급 (기본 150P + 거리 비례)
    const earnedPoints = Math.max(100, Math.round(parseFloat(finalDistanceKm) * 100) + 50);
    if (window.AppStore) {
      window.AppStore.addMileage(earnedPoints);
    }

    if (window.EffectsManager) {
      window.EffectsManager.playSound("fanfare");
      window.EffectsManager.triggerConfetti();
      // 완주 인증서 모달 호출
      window.EffectsManager.openCertificateModal({
        durationSec: totalDurationSec,
        distanceKm: finalDistanceKm,
        calories: finalCalories,
        trashCount: finalTrash,
        earnedPoints: earnedPoints
      });
    }

    if (window.AppStore) {
      window.AppStore.showToast(`🎉 플로깅 완주! +${earnedPoints}P 도토리 마일리지가 적립되었습니다!`, 4000);
    }
  }

  // 타이머 갱신
  updateTimer() {
    if (!this.isActive || this.isPaused) return;

    const elapsedMs = Date.now() - this.startTime;
    const totalSec = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;

    const formattedTime = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    // 칼로리 계산 (평균 걷기/플로깅 1분당 약 4.2 kcal + 쓰레기 수거 가산)
    this.caloriesBurned = (totalSec / 60) * 4.5 + this.collectedTrashCount * 2;

    const timerEl = document.getElementById("hud-time");
    const calEl = document.getElementById("hud-calories");
    const distEl = document.getElementById("hud-distance");

    if (timerEl) timerEl.textContent = formattedTime;
    if (calEl) calEl.textContent = `${Math.round(this.caloriesBurned)} kcal`;
    if (distEl) distEl.textContent = `${(this.totalDistanceMeters / 1000).toFixed(2)} km`;
  }

  // 실시간 위치 추적
  startLocationWatch() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.handleNewPosition(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("[Tracker] Geolocation watch error, fallback to simulated motion:", err);
          this.startSimulatedWalking();
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    } else {
      this.startSimulatedWalking();
    }
  }

  // 모의 걷기 시뮬레이터 (GPS 지원이 제한된 환경이나 데스크톱 테스트용)
  startSimulatedWalking() {
    if (this.simulatedInterval) clearInterval(this.simulatedInterval);
    this.simulatedInterval = setInterval(() => {
      if (!this.isActive || this.isPaused) return;
      const lastPoint = this.pathPoints[this.pathPoints.length - 1];
      if (lastPoint) {
        // 미세한 랜덤 이동 (약 3~5미터 전진)
        const dLat = (Math.random() - 0.45) * 0.00006;
        const dLng = (Math.random() - 0.45) * 0.00006;
        this.handleNewPosition(lastPoint[0] + dLat, lastPoint[1] + dLng);
      }
    }, 3000);
  }

  // 새 위치 수신 처리
  handleNewPosition(lat, lng) {
    if (!this.isActive || this.isPaused) return;

    const lastPoint = this.pathPoints[this.pathPoints.length - 1];
    if (lastPoint) {
      const dist = this.calculateDistance(lastPoint[0], lastPoint[1], lat, lng);
      // 최소 1m 이상 이동 시에만 누적
      if (dist >= 1 && dist < 100) {
        this.totalDistanceMeters += dist;
        this.pathPoints.push([lat, lng]);

        if (window.AppStore) {
          window.AppStore.userLocation = { lat, lng };
        }

        if (window.CleanRouteMapInstance) {
          window.CleanRouteMapInstance.updateLiveTrackerPath(this.pathPoints, lat, lng);
        }
      }
    } else {
      this.pathPoints.push([lat, lng]);
    }
  }

  // 거리 계산
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  incrementTrashCount(count = 1) {
    this.collectedTrashCount += count;
    const trashEl = document.getElementById("hud-trash");
    if (trashEl) trashEl.textContent = `${this.collectedTrashCount}개`;
  }

  updateUI() {
    const pauseBtn = document.getElementById("btn-hud-pause");
    if (pauseBtn) {
      pauseBtn.innerHTML = this.isPaused ? "<span>▶️</span> <span>재개</span>" : "<span>⏸️</span> <span>일시정지</span>";
    }
  }
}

window.PloggingTrackerInstance = new PloggingTracker();
