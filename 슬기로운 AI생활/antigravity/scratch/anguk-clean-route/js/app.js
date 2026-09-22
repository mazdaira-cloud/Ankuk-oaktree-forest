/**
 * Anguk 700 Digital Oaks - Application Coordinator
 * 요셉 보이스 사회적 조각 PWA 전역 상태 관리, GPS 50m 지오펜싱 판정, 8단계 레벨업 처리, 실시간 트래커 및 바텀 시트 제어
 */

class AppStoreClass {
  constructor() {
    this.STORAGE_KEY_HOTSPOTS = "anguk_digital_oaks_hotspots_v2";
    this.STORAGE_KEY_MILEAGE = "anguk_digital_oaks_mileage_v2";
    this.STORAGE_KEY_COUPONS = "anguk_digital_oaks_coupons_v2";
    this.STORAGE_KEY_THEME = "anguk_digital_oaks_theme_v2";

    this.hotspots = this.loadHotspots();
    this.mileage = this.loadMileage();
    this.coupons = this.loadCoupons();
    this.theme = localStorage.getItem(this.STORAGE_KEY_THEME) || "light";

    this.currentTab = "dashboard";
    this.activeSpot = null;
    this.userLocation = { lat: 37.5768, lng: 126.9858 }; // 초기 안국역 2번 출구 위치
    this.isSimulatedGps = true;
    this.sheetState = "half"; // 'collapsed', 'half', 'expanded'
  }

  loadHotspots() {
    const saved = localStorage.getItem(this.STORAGE_KEY_HOTSPOTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved oaks data", e);
      }
    }
    return [...window.AngukData.initialHotspots];
  }

  saveHotspots() {
    localStorage.setItem(this.STORAGE_KEY_HOTSPOTS, JSON.stringify(this.hotspots));
  }

  loadMileage() {
    const saved = localStorage.getItem(this.STORAGE_KEY_MILEAGE);
    return saved ? parseInt(saved, 10) : 700; // 웰컴 700 디지털 도토리 마일리지
  }

  saveMileage() {
    localStorage.setItem(this.STORAGE_KEY_MILEAGE, String(this.mileage));
  }

  loadCoupons() {
    const saved = localStorage.getItem(this.STORAGE_KEY_COUPONS);
    return saved ? JSON.parse(saved) : [
      { id: "CPN_01", title: "안국 제로웨이스트 10% 할인권", store: "지구샵 북촌점", code: "ZERO-ANGUK-700", expiry: "2026.12.31", used: false },
      { id: "CPN_02", title: "텀블러 음료 500원 할인권", store: "어니언 안국 / 프릳츠", code: "TUMBLER-OAK-500", expiry: "2026.12.31", used: false }
    ];
  }

  saveCoupons() {
    localStorage.setItem(this.STORAGE_KEY_COUPONS, JSON.stringify(this.coupons));
  }

  getHotspots() {
    return this.hotspots;
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

  // 거점 클릭 시 상세 및 GPS 50m 인증 모달 열기
  openSpotDetailModal(spotId) {
    const spot = this.hotspots.find(s => s.id === spotId || s.spot_id === spotId);
    if (!spot) return;

    this.activeSpot = spot;
    const modal = document.getElementById("modal-spot-detail");
    if (!modal) return;

    const levelInfo = window.GrowthManager.getLevelInfo(spot.exp || 0);
    const distanceMeters = Math.round(this.calculateDistance(this.userLocation.lat, this.userLocation.lng, spot.lat, spot.lng));
    const isInsideFence = distanceMeters <= 50;

    // 모달 DOM 바인딩
    const nameEl = document.getElementById("modal-spot-name");
    const descEl = document.getElementById("modal-spot-desc");
    const iconEl = document.getElementById("modal-tree-icon");
    const titleEl = document.getElementById("modal-tree-level-title");
    const quoteEl = document.getElementById("modal-tree-quote");

    if (nameEl) nameEl.textContent = spot.name;
    if (descEl) descEl.textContent = spot.description;
    if (iconEl) iconEl.textContent = levelInfo.icon;
    if (titleEl) titleEl.textContent = `Lv.${levelInfo.level} ${levelInfo.name}`;
    if (quoteEl) quoteEl.textContent = `"${levelInfo.quote}"`;

    // 진행률 바
    const progressFill = document.getElementById("modal-progress-fill");
    const progressText = document.getElementById("modal-progress-text");
    if (progressFill && progressText) {
      if (levelInfo.isMax) {
        progressFill.style.width = "100%";
        progressText.textContent = `최고 단계 도달 (총 ${spot.exp}회 인증 완료)`;
      } else {
        progressFill.style.width = `${levelInfo.progressPercent}%`;
        progressText.textContent = `다음 단계까지 ${levelInfo.expToNext}회 남음 (${spot.exp} / ${levelInfo.nextLevelExp}회)`;
      }
    }

    // 쓰레기통 사각지대 상태 배지
    const binBadge = document.getElementById("modal-bin-status-badge");
    if (binBadge) {
      if (spot.hasTrashCanNearby) {
        binBadge.className = "popup-tag bin";
        binBadge.innerHTML = `🛡️ 공공 쓰레기통 50m 보호 구역`;
      } else {
        binBadge.className = "popup-tag blindspot";
        binBadge.innerHTML = `⚠️ 쓰레기통 사각지대 (${spot.nearestBinDistance || '50m 초과'}m 이격)`;
      }
    }

    // GPS 50m 거리 판정 박스
    const fenceBox = document.getElementById("modal-gps-fence-box");
    const fenceDesc = document.getElementById("modal-gps-fence-desc");
    const verifySection = document.getElementById("modal-verification-section");

    if (fenceBox && fenceDesc && verifySection) {
      if (isInsideFence) {
        fenceBox.className = "distance-fence-box valid";
        fenceDesc.innerHTML = `<strong>✅ 현장 인증 가능 구역</strong> (거점과의 거리: 약 ${distanceMeters}m ≤ 50m)`;
        verifySection.style.display = "block";
      } else {
        fenceBox.className = "distance-fence-box invalid";
        fenceDesc.innerHTML = `<strong>⛔ 현장 거리 기준 초과</strong>: 거점 반경 50m 이내 현장에서만 인증이 가능합니다.<br>(현재 사용자 위치와의 거리: 약 <strong>${distanceMeters}m</strong>)`;
        verifySection.style.display = "none";
      }
    }

    modal.classList.add("open");
  }

  // 사용자 위치를 특정 거점 반경 10m 이내로 모의 이동 (데스크톱 테스트용)
  teleportToActiveSpot() {
    if (!this.activeSpot) return;
    this.userLocation = {
      lat: +(this.activeSpot.lat + 0.00008).toFixed(6),
      lng: +(this.activeSpot.lng + 0.00008).toFixed(6)
    };
    this.showToast(`🧭 사용자 위치를 현장 [${this.activeSpot.name}] 10m 이내로 설정했습니다.`);
    if (window.CleanRouteMapInstance) {
      window.CleanRouteMapInstance.setUserLocationMarker(this.userLocation.lat, this.userLocation.lng);
      window.CleanRouteMapInstance.panTo(this.userLocation.lat, this.userLocation.lng, 17);
    }
    // 모달 상태 갱신
    this.openSpotDetailModal(this.activeSpot.id);
  }

  // 실제 브라우저 GPS 수신
  fetchRealGps() {
    if (!navigator.geolocation) {
      this.showToast("이 브라우저는 Geolocation API를 지원하지 않습니다.");
      return;
    }

    this.showToast("🧭 현재 실제 GPS 좌표를 측정하는 중입니다...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.isSimulatedGps = false;
        this.showToast(`📍 실제 GPS 위치 수신 완료 (${this.userLocation.lat.toFixed(4)}, ${this.userLocation.lng.toFixed(4)})`);
        if (window.CleanRouteMapInstance) {
          window.CleanRouteMapInstance.setUserLocationMarker(this.userLocation.lat, this.userLocation.lng);
          window.CleanRouteMapInstance.panTo(this.userLocation.lat, this.userLocation.lng, 17);
        }
        if (this.activeSpot) {
          this.openSpotDetailModal(this.activeSpot.id);
        }
      },
      (err) => {
        console.warn("GPS 수신 실패", err);
        this.showToast("⚠️ GPS 수신 실패. 데스크톱에서는 '현장 GPS 모의 이동'을 활용하세요.");
      },
      { timeout: 8000 }
    );
  }

  // 플로깅 인증 완료 (exp + 1 및 레벨 성장)
  submitPloggingVerification(photoData = null) {
    if (!this.activeSpot) return;

    const distance = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, this.activeSpot.lat, this.activeSpot.lng);
    if (distance > 50) {
      alert(`⚠️ 현장 인증 불가: 거점 반경 50m 이내에서만 인증할 수 있습니다.\n(현재 측정 거리: ${Math.round(distance)}m)`);
      return;
    }

    const currentExp = this.activeSpot.exp || 0;
    const growthResult = window.GrowthManager.addExp(currentExp, 1);

    this.activeSpot.exp = growthResult.newExp;
    this.activeSpot.level = growthResult.newLevel;
    if (photoData) {
      this.activeSpot.last_photo_url = photoData;
    }

    this.saveHotspots();
    this.addMileage(150, `${this.activeSpot.name} 떡갈나무 플로깅 정화`);
    this.updateKPIs();

    if (window.CleanRouteMapInstance) {
      window.CleanRouteMapInstance.renderHotspots();
    }

    if (growthResult.didLevelUp) {
      this.triggerConfetti(growthResult.newInfo);
      if (window.EffectsManager) {
        window.EffectsManager.playSound("levelup");
        window.EffectsManager.triggerConfetti();
      }
    } else {
      if (window.EffectsManager) {
        window.EffectsManager.playSound("growth");
      }
      this.showToast(`🌱 정화 인증 완료! (${this.activeSpot.name} exp +1)`);
    }

    // 모달 갱신
    this.openSpotDetailModal(this.activeSpot.id);
  }

  addMileage(amount, reason = "") {
    this.mileage += amount;
    this.saveMileage();
    this.updateMileageUI();
    if (window.EffectsManager) {
      window.EffectsManager.playSound("coin");
    }
  }

  updateMileageUI() {
    const elHeader = document.getElementById("header-mileage-val");
    const elWallet = document.getElementById("wallet-modal-mileage");
    const valText = this.mileage.toLocaleString() + " P";
    if (elHeader) elHeader.textContent = valText;
    if (elWallet) elWallet.textContent = valText;
  }

  updateKPIs() {
    const totalCount = this.hotspots.length;
    const resolvedCount = this.hotspots.filter(s => s.level >= 5).length;
    const totalExp = this.hotspots.reduce((acc, s) => acc + (s.exp || 0), 0);

    const elActive = document.getElementById("kpi-active-count");
    const elResolved = document.getElementById("kpi-resolved-count");
    const elTrash = document.getElementById("kpi-trash-sum");

    if (elActive) elActive.textContent = totalCount;
    if (elResolved) elResolved.textContent = resolvedCount;
    if (elTrash) elTrash.textContent = totalExp + "회";
  }

  showToast(message, duration = 3500) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  triggerConfetti(levelInfo) {
    this.showToast(`🎉 <strong>단계 진화 축하!</strong> 거점이 [${levelInfo.icon} ${levelInfo.name}] 단계로 성장했습니다! (+500P)`, 4500);
    this.addMileage(500, `거점 레벨업 보너스 (${levelInfo.name})`);
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
  }

  openAdminReportModal() {
    if (window.AdminReportInstance) {
      window.AdminReportInstance.renderModal();
    }
    const modal = document.getElementById("modal-admin-report");
    if (modal) modal.classList.add("open");
  }

  openWalletModal() {
    const modal = document.getElementById("modal-wallet");
    if (!modal) return;
    this.renderCouponsList();
    this.updateMileageUI();
    modal.classList.add("open");
  }

  renderCouponsList() {
    const listEl = document.getElementById("wallet-coupon-list");
    if (!listEl) return;

    if (this.coupons.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:20px; color:#64748b;">발급된 쿠폰이 없습니다.</div>`;
      return;
    }

    listEl.innerHTML = this.coupons.map((cpn, idx) => `
      <div class="coupon-card ${cpn.used ? 'used' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-size:11px; color:#059669; font-weight:700;">${cpn.store}</div>
            <div style="font-size:14px; font-weight:800; color:#0f172a; margin:2px 0;">${cpn.title}</div>
            <div style="font-size:11px; color:#64748b;">유효기간: ${cpn.expiry}</div>
          </div>
          <span style="font-size:11px; background:${cpn.used?'#e2e8f0':'#dcfce7'}; color:${cpn.used?'#64748b':'#047857'}; font-weight:800; padding:3px 8px; border-radius:8px;">
            ${cpn.used ? '사용완료' : '사용가능'}
          </span>
        </div>
        <div class="coupon-barcode-box">
          <div style="font-family:monospace; font-size:13px; font-weight:800; letter-spacing:2px; color:#1e293b;">
            ${cpn.code}
          </div>
          <div style="font-size:10px; color:#94a3b8; margin-top:2px;">결제 시 매장에 바코드 번호를 제시하세요</div>
        </div>
      </div>
    `).join("");
  }

  switchTab(tabKey) {
    this.currentTab = tabKey;

    // 데스크톱 탭 활성화
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabKey);
    });

    // 모바일 바텀 내비게이션 활성화
    document.querySelectorAll(".mobile-nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.tab === tabKey);
    });

    // 패널 전환
    document.querySelectorAll(".page-panel").forEach(panel => {
      panel.classList.toggle("hidden", panel.id !== `panel-${tabKey}`);
    });

    if (window.EffectsManager) {
      window.EffectsManager.playSound("click");
    }

    if (window.CleanRouteMapInstance) {
      setTimeout(() => window.CleanRouteMapInstance.map.invalidateSize(), 200);
    }

    if (tabKey === "zerowaste" && window.ZeroWasteControllerInstance) {
      window.ZeroWasteControllerInstance.renderCards("zero-waste-cards-container");
    }
  }

  setRouteDestination(binId) {
    const bin = window.AngukData.publicBins.find(b => b.bin_id === binId);
    if (!bin) return;
    this.switchTab("course");
    this.showToast(`🏁 '${bin.name}'이(가) 배출 목적지로 선택되었습니다.`);
    if (window.CourseControllerInstance) {
      window.CourseControllerInstance.generateCourse("START_01", "30m", "alley");
    }
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    localStorage.setItem(this.STORAGE_KEY_THEME, this.theme);
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle("dark-mode", this.theme === "dark");
    const themeBtn = document.getElementById("btn-toggle-theme");
    if (themeBtn) {
      themeBtn.innerHTML = this.theme === "dark" ? "<span>☀️</span>" : "<span>🌙</span>";
    }
  }
}

window.AppStore = new AppStoreClass();

document.addEventListener("DOMContentLoaded", () => {
  // 1. 테마 적용
  window.AppStore.applyTheme();

  // 2. 지도 인스턴스 초기화
  window.CleanRouteMapInstance = new CleanRouteMap();
  window.CleanRouteMapInstance.init();

  // 3. 도메인 컨트롤러 초기화
  window.CourseControllerInstance = new CourseGenerator(window.CleanRouteMapInstance);
  window.ReportControllerInstance = new ReportController(window.CleanRouteMapInstance);
  window.ZeroWasteControllerInstance = new ZeroWasteController(window.CleanRouteMapInstance);
  window.AdminReportInstance = new AdminReportController();

  // 4. KPI 및 마일리지 동기화
  window.AppStore.updateKPIs();
  window.AppStore.updateMileageUI();

  // 5. 데스크톱 & 모바일 탭 리스너 바인딩
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.AppStore.switchTab(btn.dataset.tab);
    });
  });

  document.querySelectorAll(".mobile-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;
      if (tab === "admin") {
        window.AppStore.openAdminReportModal();
      } else {
        window.AppStore.switchTab(tab);
      }
    });
  });

  // 6. PWA 설치 버튼 & 배너 바인딩
  const btnPwaInstall = document.getElementById("btn-pwa-install");
  if (btnPwaInstall) {
    btnPwaInstall.addEventListener("click", () => {
      if (window.PWAControllerInstance) window.PWAControllerInstance.promptInstall();
    });
  }

  const btnPwaBanner = document.getElementById("pwa-install-banner-btn");
  if (btnPwaBanner) {
    btnPwaBanner.addEventListener("click", () => {
      if (window.PWAControllerInstance) window.PWAControllerInstance.promptInstall();
    });
  }

  // 7. 지자체 제안 리포트 & 지갑 버튼
  const btnAdminReport = document.getElementById("btn-open-admin-report");
  if (btnAdminReport) {
    btnAdminReport.addEventListener("click", () => {
      window.AppStore.openAdminReportModal();
    });
  }

  const btnWallet = document.getElementById("btn-open-wallet");
  if (btnWallet) {
    btnWallet.addEventListener("click", () => {
      window.AppStore.openWalletModal();
    });
  }

  // 8. 테마 토글 버튼
  const btnTheme = document.getElementById("btn-toggle-theme");
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      window.AppStore.toggleTheme();
    });
  }

  // 9. 실시간 플로깅 트래커 바인딩
  const btnStartTracker = document.getElementById("btn-start-tracker");
  if (btnStartTracker) {
    btnStartTracker.addEventListener("click", () => {
      if (window.PloggingTrackerInstance) window.PloggingTrackerInstance.start();
    });
  }

  const btnHudPause = document.getElementById("btn-hud-pause");
  if (btnHudPause) {
    btnHudPause.addEventListener("click", () => {
      if (window.PloggingTrackerInstance) window.PloggingTrackerInstance.togglePause();
    });
  }

  const btnHudFinish = document.getElementById("btn-hud-finish");
  if (btnHudFinish) {
    btnHudFinish.addEventListener("click", () => {
      if (window.PloggingTrackerInstance) window.PloggingTrackerInstance.finish();
    });
  }

  const btnHudTrashAdd = document.getElementById("btn-hud-trash-add");
  if (btnHudTrashAdd) {
    btnHudTrashAdd.addEventListener("click", () => {
      if (window.PloggingTrackerInstance) {
        window.PloggingTrackerInstance.incrementTrashCount(1);
        if (window.EffectsManager) window.EffectsManager.playSound("coin");
      }
    });
  }

  // 10. 완주 인증서 다운로드 & 공유 바인딩
  const btnDownloadCert = document.getElementById("btn-download-cert");
  if (btnDownloadCert) {
    btnDownloadCert.addEventListener("click", () => {
      if (window.EffectsManager) window.EffectsManager.downloadCertificate();
    });
  }

  const btnShareCert = document.getElementById("btn-share-cert");
  if (btnShareCert) {
    btnShareCert.addEventListener("click", () => {
      if (window.EffectsManager) window.EffectsManager.shareCertificate();
    });
  }

  // 11. 대시보드 필터 리스너
  document.querySelectorAll(".chip-btn[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filterType = btn.dataset.filter;
      const val = btn.dataset.val;
      if (filterType === "trashType") window.CleanRouteMapInstance.setTrashTypeFilter(val);
      else if (filterType === "density") window.CleanRouteMapInstance.setDensityFilter(val);
    });
  });

  // 레이어 토글
  document.querySelectorAll(".toggle-layer-chk").forEach(chk => {
    chk.addEventListener("change", () => {
      window.CleanRouteMapInstance.toggleLayer(chk.dataset.layer, chk.checked);
    });
  });

  // 12. 모달 내 현장 50m 시뮬레이션 및 인증 버튼 바인딩
  const btnTeleport = document.getElementById("btn-teleport-spot");
  if (btnTeleport) {
    btnTeleport.addEventListener("click", () => {
      window.AppStore.teleportToActiveSpot();
    });
  }

  const btnFetchRealGps = document.getElementById("btn-fetch-real-gps");
  if (btnFetchRealGps) {
    btnFetchRealGps.addEventListener("click", () => {
      window.AppStore.fetchRealGps();
    });
  }

  const btnSubmitVerify = document.getElementById("btn-submit-spot-verification");
  if (btnSubmitVerify) {
    btnSubmitVerify.addEventListener("click", () => {
      window.AppStore.submitPloggingVerification();
    });
  }

  // 사진 업로드 프리뷰 바인딩
  const fileVerify = document.getElementById("spot-verify-file");
  if (fileVerify) {
    fileVerify.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const preview = document.getElementById("spot-verify-preview");
          if (preview) {
            preview.src = re.target.result;
            preview.style.display = "block";
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 13. 지자체 리포트 내보내기 버튼 바인딩
  const btnDownloadGeoJson = document.getElementById("btn-download-geojson");
  if (btnDownloadGeoJson) {
    btnDownloadGeoJson.addEventListener("click", () => {
      window.AdminReportInstance.downloadGeoJSON();
    });
  }

  const btnCopyPetition = document.getElementById("btn-copy-petition");
  if (btnCopyPetition) {
    btnCopyPetition.addEventListener("click", () => {
      window.AdminReportInstance.copyAdministrativePetition();
    });
  }

  // 14. 코스 추천 생성 바인딩
  const btnGenerateCourse = document.getElementById("btn-generate-course");
  if (btnGenerateCourse) {
    btnGenerateCourse.addEventListener("click", () => {
      const startPointId = document.getElementById("course-start-select").value;
      const targetTime = document.querySelector('input[name="course-time"]:checked').value;
      const theme = document.querySelector('input[name="course-theme"]:checked').value;

      const course = window.CourseControllerInstance.generateCourse(startPointId, targetTime, theme);
      if (course) {
        document.getElementById("course-result-card").style.display = "block";
        document.getElementById("res-distance").textContent = course.distanceKm + " km";
        document.getElementById("res-time").textContent = course.estimatedTimeMin + " 분";
        document.getElementById("res-calories").textContent = course.estimatedCalories + " kcal";
        document.getElementById("res-trash").textContent = course.totalTrashEstimate + " 개";
        document.getElementById("res-end-bin").textContent = course.endBin.name;

        const waypointsListEl = document.getElementById("course-waypoints-list");
        waypointsListEl.innerHTML = course.points.map((p, idx) => `
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid #f1f5f9; font-size:12px;">
            <span style="font-weight:bold; color:${p.type==='START'?'#8b5cf6':p.type==='BIN'?'#2563eb':'#10b981'};">${idx+1}</span>
            <span style="flex:1;">${p.name}</span>
            <span style="color:#64748b; font-size:11px;">${p.type==='START'?'[출발]':p.type==='BIN'?'[분리배출 🏁]':'[떡갈나무 성장 🌳]'}</span>
          </div>
        `).join("");

        window.AppStore.showToast(`🎯 '${course.startPoint.name}' 출발 추천 순회 루트가 생성되었습니다.`);
      }
    });
  }

  // 15. 에코 샵 & 도심 녹지 쉼터 카테고리 필터 리스너
  document.querySelectorAll(".chip-btn[data-eco-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (window.ZeroWasteControllerInstance) {
        window.ZeroWasteControllerInstance.selectedCategory = btn.dataset.ecoCat;
        window.ZeroWasteControllerInstance.renderCards("zero-waste-cards-container");
      }
    });
  });

  console.log("[PWA Web App] Anguk 700 Digital Oaks platform initialized.");
});
