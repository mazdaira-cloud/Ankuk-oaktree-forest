/**
 * Anguk 700 Digital Oaks - Map Controller
 * Leaflet 지도 제어, 공공 쓰레기통 50m 원형 버퍼 오버레이, 8단계 떡갈나무 마커, 사각지대 붉은 점멸
 */

class CleanRouteMap {
  constructor() {
    this.map = null;
    this.layers = {
      hotspots: null,
      bins: null,
      binBuffers: null, // 50m 커버리지 버퍼 레이어
      zeroWaste: null,
      greenSpaces: null, // 도심 녹지 쉼터 레이어
      route: null,
      livePath: null,    // 실시간 플로깅 궤적 레이어
      userGpsMarker: null, // 사용자 실시간 위치 마커
      reportMarker: null
    };
    this.activeFilters = {
      trashType: "ALL",
      density: "ALL",
      layerHotspots: true,
      layerBins: true,
      layerBuffers: true, // 50m 원형 버퍼 토글
      layerRoute: true,
      layerZeroWaste: true,
      layerGreenSpaces: true // 도심 녹지 레이어 토글
    };
    this.isPickerMode = false;
    this.onLocationPicked = null;
  }

  // Haversine 거리 계산
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  }

  init() {
    const center = window.AngukData.center;
    this.map = L.map("map-container", {
      center: [center.lat, center.lng],
      zoom: center.zoom,
      zoomControl: false
    });

    // CartoDB Voyager 타일 레이어 (도심 및 한옥 골목길 고대비 렌더링)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(this.map);

    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    // 레이어 그룹 초기화
    this.layers.binBuffers = L.layerGroup().addTo(this.map);
    this.layers.bins = L.layerGroup().addTo(this.map);
    this.layers.hotspots = L.layerGroup().addTo(this.map);
    this.layers.greenSpaces = L.layerGroup().addTo(this.map);
    this.layers.route = L.layerGroup().addTo(this.map);
    this.layers.livePath = L.layerGroup().addTo(this.map);
    this.layers.userGpsMarker = L.layerGroup().addTo(this.map);
    this.layers.zeroWaste = L.layerGroup().addTo(this.map);

    // 맵 클릭 이벤트
    this.map.on("click", (e) => {
      if (this.isPickerMode && this.onLocationPicked) {
        this.setPickerMarker(e.latlng.lat, e.latlng.lng);
        this.onLocationPicked(e.latlng.lat, e.latlng.lng);
      }
    });

    this.renderAllLayers();
  }

  renderAllLayers() {
    this.renderPublicBins();
    this.renderHotspots();
    this.renderGreenSpaces();
    this.renderZeroWaste();
    this.renderCircuitRoute();
  }

  // 1. 공공 쓰레기통 및 50m 원형 버퍼(커버리지) 렌더링
  renderPublicBins() {
    this.layers.bins.clearLayers();
    this.layers.binBuffers.clearLayers();

    if (!this.activeFilters.layerBins) return;

    const bins = window.AngukData.publicBins;

    bins.forEach(bin => {
      // 50m 반경 원형 버퍼 생성
      if (this.activeFilters.layerBuffers) {
        const bufferCircle = L.circle([bin.latitude, bin.longitude], {
          radius: bin.buffer_radius_m || 50,
          color: "#2563eb",
          fillColor: "#3b82f6",
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: "4, 4"
        });
        bufferCircle.bindTooltip(`🗑️ ${bin.name}<br><strong>유효 분리배출 반경: 50m</strong>`, {
          sticky: true,
          className: "buffer-tooltip"
        });
        this.layers.binBuffers.addLayer(bufferCircle);
      }

      // 휴지통 마커
      const iconHtml = `
        <div class="custom-marker marker-bin" style="width: 32px; height: 32px; font-size: 15px;" title="${bin.name}">
          🗑️
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-div-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([bin.latitude, bin.longitude], { icon });

      const popupHtml = `
        <div class="popup-card" style="width: 260px;">
          <div class="popup-content">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="popup-tag bin">종로구 공공 수거함 (OA-15069)</span>
              <span style="font-size:10px; color:#2563eb; font-weight:bold;">버퍼: 50m</span>
            </div>
            <h4 style="font-size:14px; font-weight:800; margin:6px 0; color:#1e3a8a;">${bin.name}</h4>
            <div style="font-size:12px; color:#475569; margin-bottom:6px;">
              <strong>수거 형태:</strong> ${bin.type}
            </div>
            <p style="font-size:11px; color:#64748b; background:#eff6ff; padding:6px; border-radius:6px; margin-bottom:8px;">
              📍 ${bin.description}
            </p>
            <button onclick="window.AppStore.setRouteDestination('${bin.bin_id}')" class="btn-secondary" style="padding:6px 10px; font-size:12px;">
              🏁 이 쓰레기통을 플로깅 배출지로 설정
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      this.layers.bins.addLayer(marker);
    });
  }

  // 2. 무단 투기 및 8단계 떡갈나무 성장 거점 마커 렌더링
  renderHotspots() {
    this.layers.hotspots.clearLayers();
    if (!this.activeFilters.layerHotspots) return;

    const hotspots = window.AppStore.getHotspots();
    const bins = window.AngukData.publicBins;

    hotspots.forEach(spot => {
      // 가장 가까운 쓰레기통과의 거리 계산 (50m 이내 여부)
      let minDistance = Infinity;
      bins.forEach(b => {
        const d = this.calculateDistance(spot.lat, spot.lng, b.latitude, b.longitude);
        if (d < minDistance) minDistance = d;
      });

      const isProtected = minDistance <= 50;
      spot.hasTrashCanNearby = isProtected;
      spot.nearestBinDistance = Math.round(minDistance);

      // 필터 적용
      if (!this.matchesFilter(spot)) return;

      const levelInfo = window.GrowthManager.getLevelInfo(spot.exp || 0);
      spot.level = levelInfo.level;

      // 사각지대 판정: 쓰레기통 50m 버퍼 바깥이면서 정화가 덜 된 상태(Lv.0 ~ Lv.2)
      const isBlindspotAlert = !isProtected && spot.level === 0;

      // 마커 클래스 및 아이콘 생성
      const isWorldTree = spot.level === 7;
      let markerClass = `custom-tree-marker ${levelInfo.markerClass}`;
      if (isWorldTree) markerClass += " glow-world-tree";
      if (isBlindspotAlert) markerClass += " marker-blindspot-alert";

      const iconHtml = `
        <div class="${markerClass}" title="${spot.name} (${levelInfo.name})">
          <div class="tree-icon-badge">${levelInfo.icon}</div>
          <div class="tree-level-pill">Lv.${spot.level}</div>
          ${isBlindspotAlert ? `<div class="blindspot-warning-badge">⚠️</div>` : ""}
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-tree-div",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -24]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon });

      // 클릭 시 해당 거점 인증 바텀시트 열기 및 팝업 표시
      marker.on("click", () => {
        window.AppStore.openSpotDetailModal(spot.id || spot.spot_id);
      });

      this.layers.hotspots.addLayer(marker);
    });
  }

  // 3. 추천 플로깅 순회 경로 (LineString) 렌더링
  renderCircuitRoute() {
    this.layers.route.clearLayers();
    if (!this.activeFilters.layerRoute) return;

    const spots = window.AppStore.getHotspots();
    if (spots.length < 2) return;

    // 안국역 3번 출구에서 시작하여 주요 거점을 잇는 보행 순회선
    const sortedPoints = [
      [37.5768, 126.9860], // 안국역 3번 출구
      ...spots.slice(0, 7).map(s => [s.lat, s.lng]),
      [37.5762, 126.9848]  // 안국역 1번 출구 가로변 쓰레기통
    ];

    const polyline = L.polyline(sortedPoints, {
      color: "#059669",
      weight: 4,
      opacity: 0.75,
      dashArray: "8, 10",
      lineCap: "round",
      lineJoin: "round"
    });

    polyline.bindTooltip("🏃 <strong>안국역 700 떡갈나무 플로깅 순회 루트</strong> (안국역 ↔ 북촌 ↔ 계동)", {
      sticky: true
    });

    this.layers.route.addLayer(polyline);
  }

  // 4. 에코 & 제로웨이스트 상점 렌더링 (순수 매장 소개, 쿠폰 버튼 제외)
  renderZeroWaste() {
    this.layers.zeroWaste.clearLayers();
    if (!this.activeFilters.layerZeroWaste) return;

    const spots = window.AngukData.zeroWasteSpots;
    spots.forEach(shop => {
      const iconHtml = `
        <div class="custom-marker marker-zero" style="width: 32px; height: 32px; font-size: 14px;" title="${shop.name}">
          🌿
        </div>
      `;
      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-div-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon });
      marker.bindPopup(`
        <div class="popup-card" style="width:260px;">
          <img src="${shop.image_url}" class="popup-img" alt="${shop.name}">
          <div class="popup-content">
            <span class="popup-tag eco">${shop.category_label}</span>
            <h4 style="font-size:14px; font-weight:800; margin:4px 0; color:#064e3b;">${shop.name}</h4>
            <div style="font-size:11.5px; color:#047857; margin-bottom:4px; line-height:1.35;">
              🌱 ${shop.eco_feature || '친환경 제로웨이스트 매장'}
            </div>
            <p style="font-size:11px; color:#64748b; margin-bottom:2px;">📍 ${shop.address}</p>
            <span style="font-size:10.5px; color:#64748b;">🕒 ${shop.open_hours} (☎ ${shop.phone})</span>
          </div>
        </div>
      `);
      this.layers.zeroWaste.addLayer(marker);
    });
  }

  // 5. 주민 및 관광객을 위한 도심 녹지 & 휴식 쉼터 렌더링
  renderGreenSpaces() {
    this.layers.greenSpaces.clearLayers();
    if (!this.activeFilters.layerGreenSpaces) return;

    const greens = window.AngukData.greenSpaces || [];
    greens.forEach(green => {
      const iconHtml = `
        <div class="custom-marker marker-green-space" style="width: 34px; height: 34px; font-size: 16px;" title="${green.name}">
          🌳
        </div>
      `;
      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-div-icon",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([green.latitude, green.longitude], { icon });
      marker.bindPopup(`
        <div class="popup-card" style="width:270px;">
          <img src="${green.image_url}" class="popup-img" alt="${green.name}">
          <div class="popup-content">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <span class="popup-tag" style="background:#dcfce7; color:#15803d; font-weight:800;">🌳 ${green.type}</span>
              <span style="font-size:10px; color:#059669; font-weight:700;">무료 개방</span>
            </div>
            <h4 style="font-size:14px; font-weight:800; margin:4px 0; color:#14532d;">${green.name}</h4>
            <div style="font-size:11.5px; color:#166534; font-weight:600; margin-bottom:4px; line-height:1.35;">
              ✨ ${green.features}
            </div>
            <p style="font-size:11px; color:#64748b; margin-bottom:4px;">📍 ${green.address}</p>
            <div style="font-size:10.5px; color:#475569; background:#f0fdf4; padding:5px 7px; border-radius:6px; margin-bottom:6px; line-height:1.3;">
              💡 <em>${green.rest_tip}</em>
            </div>
            <div style="font-size:10px; color:#64748b;">
              🕒 개방시간: ${green.open_hours}
            </div>
          </div>
        </div>
      `);
      this.layers.greenSpaces.addLayer(marker);
    });
  }

  matchesFilter(spot) {
    if (this.activeFilters.trashType !== "ALL") {
      const target = this.activeFilters.trashType;
      const hasType = spot.trash_types && spot.trash_types.some(t => t.includes(target) || target.includes(t));
      if (!hasType) return false;
    }

    if (this.activeFilters.density === "BLINDSPOT") {
      // 사각지대 필터
      if (spot.hasTrashCanNearby) return false;
    } else if (this.activeFilters.density === "CAUTION") {
      if (spot.level >= 4) return false;
    } else if (this.activeFilters.density === "GROWN") {
      if (spot.level < 4) return false;
    }

    return true;
  }

  setTrashTypeFilter(type) {
    this.activeFilters.trashType = type;
    this.renderHotspots();
  }

  setDensityFilter(density) {
    this.activeFilters.density = density;
    this.renderHotspots();
  }

  toggleLayer(layerName, isVisible) {
    if (layerName === "hotspots") {
      this.activeFilters.layerHotspots = isVisible;
      if (isVisible) this.renderHotspots();
      else this.layers.hotspots.clearLayers();
    } else if (layerName === "bins") {
      this.activeFilters.layerBins = isVisible;
      if (isVisible) this.renderPublicBins();
      else {
        this.layers.bins.clearLayers();
        this.layers.binBuffers.clearLayers();
      }
    } else if (layerName === "buffers") {
      this.activeFilters.layerBuffers = isVisible;
      if (isVisible) this.renderPublicBins();
      else this.layers.binBuffers.clearLayers();
    } else if (layerName === "route") {
      this.activeFilters.layerRoute = isVisible;
      if (isVisible) this.renderCircuitRoute();
      else this.layers.route.clearLayers();
    } else if (layerName === "greenSpaces") {
      this.activeFilters.layerGreenSpaces = isVisible;
      if (isVisible) this.renderGreenSpaces();
      else this.layers.greenSpaces.clearLayers();
    } else if (layerName === "zeroWaste") {
      this.activeFilters.layerZeroWaste = isVisible;
      if (isVisible) this.renderZeroWaste();
      else this.layers.zeroWaste.clearLayers();
    }
  }

  enableLocationPicker(callback) {
    this.isPickerMode = true;
    this.onLocationPicked = callback;
    this.map.getContainer().style.cursor = "crosshair";
  }

  disableLocationPicker() {
    this.isPickerMode = false;
    this.onLocationPicked = null;
    this.map.getContainer().style.cursor = "";
  }

  setPickerMarker(lat, lng) {
    if (this.layers.reportMarker) {
      this.map.removeLayer(this.layers.reportMarker);
    }
    const iconHtml = `<div class="custom-marker marker-target" style="width:36px; height:36px; font-size:16px;">📍</div>`;
    const icon = L.divIcon({
      html: iconHtml,
      className: "custom-leaflet-div-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
    this.layers.reportMarker = L.marker([lat, lng], { icon }).addTo(this.map);
  }

  clearPickerMarker() {
    if (this.layers.reportMarker) {
      this.map.removeLayer(this.layers.reportMarker);
      this.layers.reportMarker = null;
    }
  }

  panTo(lat, lng, zoom = 17) {
    this.map.setView([lat, lng], zoom, { animate: true });
  }

  drawRoute(points, startPoint, endBin) {
    this.layers.route.clearLayers();
    const latlngs = points.map(p => [p.lat, p.lng]);
    const polyline = L.polyline(latlngs, {
      color: "#059669",
      weight: 6,
      opacity: 0.85,
      dashArray: "8, 12",
      lineCap: "round",
      lineJoin: "round"
    });
    this.layers.route.addLayer(polyline);

    if (endBin) {
      const endIcon = L.divIcon({
        html: `<div class="custom-marker marker-bin" style="width:38px; height:38px; border:3px solid #facc15;">🏁</div>`,
        className: "custom-leaflet-div-icon",
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });
      const endMarker = L.marker([endBin.latitude, endBin.longitude], { icon: endIcon })
        .bindPopup(`<strong>최종 쓰레기 분리배출 지점</strong><br>${endBin.name}`);
      this.layers.route.addLayer(endMarker);
    }

    this.map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }

  clearRoute() {
    this.layers.route.clearLayers();
    this.renderCircuitRoute();
  }

  // 실시간 플로깅 궤적 초기화
  initLiveTrackerPath(points = []) {
    this.layers.livePath.clearLayers();
    if (points.length < 2) return;
    const polyline = L.polyline(points, {
      color: "#10b981",
      weight: 6,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round"
    });
    this.layers.livePath.addLayer(polyline);
  }

  // 실시간 플로깅 궤적 갱신 및 사용자 펄스 마커 렌더링
  updateLiveTrackerPath(points = [], currentLat, currentLng) {
    this.layers.livePath.clearLayers();
    if (points.length >= 2) {
      const polyline = L.polyline(points, {
        color: "#10b981",
        weight: 6,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round"
      });
      this.layers.livePath.addLayer(polyline);
    }
    if (currentLat && currentLng) {
      this.setUserLocationMarker(currentLat, currentLng);
    }
  }

  // 실시간 사용자 위치 펄스 마커 렌더링
  setUserLocationMarker(lat, lng) {
    this.layers.userGpsMarker.clearLayers();
    const iconHtml = `
      <div class="user-gps-pulse-marker">
        <div class="user-gps-dot"></div>
        <div class="user-gps-ring"></div>
      </div>
    `;
    const icon = L.divIcon({
      html: iconHtml,
      className: "custom-leaflet-gps-div",
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const marker = L.marker([lat, lng], { icon });
    this.layers.userGpsMarker.addLayer(marker);
  }
}

window.CleanRouteMap = CleanRouteMap;
