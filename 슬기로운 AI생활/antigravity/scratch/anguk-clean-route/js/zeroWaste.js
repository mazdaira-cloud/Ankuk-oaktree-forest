/**
 * Anguk Clean-Route Eco Shops & Green Spaces Controller
 * PAGE 4: 안국역 일대 에코&제로웨이스트 샵 소개 및 주민/관광객을 위한 도심 녹지 쉼터 안내
 */

class ZeroWasteController {
  constructor(mapController) {
    this.mapController = mapController;
    this.selectedCategory = "all";
    this.selectedRadius = 1500; // meters
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  }

  getFilteredItems() {
    const center = window.AngukData.center;
    const shops = (window.AngukData.zeroWasteSpots || []).map(s => ({ ...s, itemType: "SHOP" }));
    const greens = (window.AngukData.greenSpaces || []).map(g => ({ ...g, itemType: "GREEN", category: "greenspace", category_label: "도심 녹지 쉼터" }));

    let combined = [...shops, ...greens];

    return combined.filter(item => {
      // 카테고리 필터
      if (this.selectedCategory !== "all") {
        if (this.selectedCategory === "greenspace") {
          if (item.itemType !== "GREEN") return false;
        } else if (this.selectedCategory === "zerowaste") {
          if (item.itemType !== "SHOP" || (item.category !== "zerowaste")) return false;
        } else if (this.selectedCategory === "tumbler") {
          if (item.category !== "tumbler") return false;
        } else if (this.selectedCategory === "vegan") {
          if (item.category !== "vegan") return false;
        } else if (this.selectedCategory === "workshop") {
          if (item.category !== "workshop") return false;
        }
      }

      // 반경 거리 필터 (안국역 중심 기준)
      const dist = this.calculateDistance(center.lat, center.lng, item.latitude, item.longitude);
      if (dist > this.selectedRadius) {
        return false;
      }
      return true;
    });
  }

  renderCards(containerElId) {
    const container = document.getElementById(containerElId);
    if (!container) return;

    const items = this.getFilteredItems();
    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:36px 16px; color:#64748b;">
          <div style="font-size:36px; margin-bottom:8px;">🌿</div>
          <p style="font-size:14px; font-weight:700; color:#1e293b;">해당 조건의 장소가 없습니다.</p>
          <p style="font-size:12px; margin-top:4px;">상단 카테고리 필터를 변경해보세요.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => {
      if (item.itemType === "GREEN") {
        // 도심 녹지 쉼터 카드
        return `
          <div class="eco-spot-card" style="background:#ffffff; border:1px solid #bbf7d0; border-radius:14px; padding:14px; margin-bottom:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05); transition:transform 0.15s;">
            <div style="display:flex; gap:12px;">
              <img src="${item.image_url}" style="width:84px; height:84px; border-radius:10px; object-fit:cover;" alt="${item.name}">
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <span style="display:inline-block; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:800; background:#dcfce7; color:#15803d;">
                    🌳 ${item.type}
                  </span>
                  <span style="font-size:10px; color:#64748b; font-weight:600;">🕒 ${item.open_hours}</span>
                </div>
                <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin:4px 0 2px;">${item.name}</h4>
                <p style="font-size:11px; color:#64748b; margin-bottom:4px;">📍 ${item.address}</p>
                <p style="font-size:11px; color:#166534; background:#f0fdf4; padding:5px 8px; border-radius:6px; line-height:1.35; margin-bottom:4px;">
                  ✨ <strong>휴식 시설:</strong> ${item.features}
                </p>
                <p style="font-size:10.5px; color:#475569; line-height:1.3;">
                  💡 <em>${item.rest_tip}</em>
                </p>
              </div>
            </div>
            <div style="margin-top:10px;">
              <button onclick="window.CleanRouteMapInstance.panTo(${item.latitude}, ${item.longitude}, 18)" class="btn-secondary" style="padding:6px 12px; font-size:12px; width:100%;">
                🗺️ 지도에서 녹지 쉼터 위치 보기
              </button>
            </div>
          </div>
        `;
      } else {
        // 에코 & 제로웨이스트 샵 소개 카드 (쿠폰 버튼 없음)
        return `
          <div class="eco-spot-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:14px; margin-bottom:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05); transition:transform 0.15s;">
            <div style="display:flex; gap:12px;">
              <img src="${item.image_url}" style="width:84px; height:84px; border-radius:10px; object-fit:cover;" alt="${item.name}">
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <span style="display:inline-block; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:800; background:#ecfdf5; color:#065f46;">
                    🌿 ${item.category_label}
                  </span>
                  <span style="font-size:10px; color:#64748b; font-weight:600;">🕒 ${item.open_hours}</span>
                </div>
                <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin:4px 0 2px;">${item.name}</h4>
                <p style="font-size:11px; color:#64748b; margin-bottom:4px;">📍 ${item.address} (☎ ${item.phone})</p>
                <p style="font-size:11px; color:#064e3b; background:#f0fdf4; padding:5px 8px; border-radius:6px; line-height:1.35;">
                  🌱 <strong>친환경 실천:</strong> ${item.eco_feature}
                </p>
              </div>
            </div>
            <div style="margin-top:10px;">
              <button onclick="window.CleanRouteMapInstance.panTo(${item.latitude}, ${item.longitude}, 18)" class="btn-secondary" style="padding:6px 12px; font-size:12px; width:100%;">
                🗺️ 지도에서 매장 위치 보기
              </button>
            </div>
          </div>
        `;
      }
    }).join("");
  }
}

window.ZeroWasteController = ZeroWasteController;
