/**
 * Anguk Clean-Route Report & Verification Controller
 * PAGE 3: 쓰레기 스팟 제보 & 정화 인증 (데이터 수집 및 크라우드소싱)
 */

class ReportController {
  constructor(mapController) {
    this.mapController = mapController;
    this.selectedCoords = null;
    this.reportPhotoData = null;
    this.afterPhotoData = null;
  }

  // GPS 모의 수신 (안국역 중심 무작위 인근 좌표)
  simulateGPS() {
    const center = window.AngukData.center;
    // 반경 200m 이내 살짝 오프셋
    const offsetLat = (Math.random() - 0.5) * 0.003;
    const offsetLng = (Math.random() - 0.5) * 0.003;
    const lat = +(center.lat + offsetLat).toFixed(6);
    const lng = +(center.lng + offsetLng).toFixed(6);

    this.setLocation(lat, lng, "현위치 GPS 자동 수신 성공");
    this.mapController.panTo(lat, lng, 18);
    return { lat, lng };
  }

  setLocation(lat, lng, desc = "") {
    this.selectedCoords = { lat, lng };
    this.mapController.setPickerMarker(lat, lng);
    
    const coordEl = document.getElementById("report-coords-text");
    if (coordEl) {
      coordEl.innerHTML = `위도: ${lat.toFixed(5)}, 경도: ${lng.toFixed(5)} ${desc ? `<span style="color:#059669; font-weight:bold;">(${desc})</span>` : ""}`;
    }
  }

  // 파일 업로드 시 미리보기 처리 (DataURL)
  handleImageUpload(inputEl, previewElId, type = "report") {
    const file = inputEl.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (type === "report") {
        this.reportPhotoData = dataUrl;
      } else {
        this.afterPhotoData = dataUrl;
      }

      const previewEl = document.getElementById(previewElId);
      if (previewEl) {
        previewEl.src = dataUrl;
        previewEl.style.display = "block";
      }
    };
    reader.readAsDataURL(file);
  }

  // 신규 쓰레기 핫스팟 제보 검증 및 등록
  submitReport(formData) {
    const {
      locationName,
      trashCount,
      trashTypes,
      hazardNote,
      difficulty
    } = formData;

    // 1. 유효성 검사: 위치 지정 여부
    if (!this.selectedCoords) {
      alert("지도에서 제보할 위치를 클릭하거나 '현위치 GPS' 버튼을 눌러주세요.");
      return false;
    }

    // 2. 유효성 검사: 핫스팟 기준 (5개 이상)
    const count = parseInt(trashCount, 10);
    if (isNaN(count) || count < 5) {
      alert("⚠️ 핫스팟 기준 미달: 폐기물이 5개 이상(반경 3m) 밀집된 구역만 제보할 수 있습니다.\n현재 입력: " + (isNaN(count) ? "0" : count) + "개");
      return false;
    }

    // 3. 유효성 검사: 쓰레기 유형
    if (!trashTypes || trashTypes.length === 0) {
      alert("쓰레기 종류를 최소 1개 이상 선택해주세요.");
      return false;
    }

    const newSpotId = "ANGUK_SPOT_" + String(Date.now()).slice(-4);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    const newSpot = {
      id: Date.now(),
      spot_id: newSpotId,
      name: locationName || `안국역 인근 떡갈나무 신규 거점 (${this.selectedCoords.lat.toFixed(4)}, ${this.selectedCoords.lng.toFixed(4)})`,
      location_name: locationName || `안국역 인근 떡갈나무 신규 거점 (${this.selectedCoords.lat.toFixed(4)}, ${this.selectedCoords.lng.toFixed(4)})`,
      lat: this.selectedCoords.lat,
      lng: this.selectedCoords.lng,
      latitude: this.selectedCoords.lat,
      longitude: this.selectedCoords.lng,
      level: 0,
      exp: 0,
      hasTrashCanNearby: false,
      description: hazardNote || "시민 제보 완료 (Lv.0 도토리 단계)",
      trash_count_estimate: count,
      trash_types: trashTypes,
      difficulty: difficulty || "보통",
      hazard_note: hazardNote || "시민 제보 완료",
      photo_url: this.reportPhotoData || "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
      reported_at: formattedDate,
      zone: "안국역"
    };

    // Store에 추가
    window.AppStore.addHotspot(newSpot);

    // 보상 마일리지 지급
    window.AppStore.addMileage(100, `신규 쓰레기 핫스팟 제보 (${newSpot.location_name})`);

    // 정리 및 피커 마커 해제
    this.mapController.clearPickerMarker();
    this.selectedCoords = null;
    this.reportPhotoData = null;

    return newSpot;
  }

  // 정화 완료 인증 제출
  submitResolve(spotId, bagVolume, resolvedBy = "안국 플로거") {
    if (!spotId) {
      alert("정화할 핫스팟을 선택해주세요.");
      return false;
    }

    const resolvedSpot = window.AppStore.resolveHotspot(spotId, bagVolume, resolvedBy, this.afterPhotoData);
    if (!resolvedSpot) return false;

    // 보상 마일리지 지급 (스팟 정화: 300P)
    window.AppStore.addMileage(300, `핫스팟 정화 인증 완료 (${resolvedSpot.location_name})`);

    this.afterPhotoData = null;
    return resolvedSpot;
  }
}

window.ReportController = ReportController;
