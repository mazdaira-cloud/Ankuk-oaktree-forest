/**
 * Anguk 700 Digital Oaks - PWA Controller
 * Service Worker 등록, 앱 설치 프롬프트(beforeinstallprompt), 온/오프라인 네트워크 상태 관리
 */

class PWAController {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    // 1. Service Worker 등록
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("[PWA] Service Worker registration failed:", error);
          });
      });
    }

    // 2. 앱 설치 프로모션 이벤트 수신 (Chrome/Edge/Android)
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallUI(true);
    });

    // 3. 앱 설치 완료 감지
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
      this.isInstalled = true;
      this.showInstallUI(false);
      if (window.AppStore) {
        window.AppStore.showToast("🎉 앱이 성공적으로 설치되었습니다! 홈 화면에서 편리하게 실행하세요.");
      }
    });

    // 4. 네트워크 상태 감지
    window.addEventListener("online", () => {
      this.updateOnlineStatus(true);
    });
    window.addEventListener("offline", () => {
      this.updateOnlineStatus(false);
    });

    // 5. Standalone 모드 감지 (이미 PWA로 실행 중인지 확인)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (isStandalone) {
      this.isInstalled = true;
      this.showInstallUI(false);
    }
  }

  // PWA 설치 프롬프트 실행
  async promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`[PWA] User response to install prompt: ${outcome}`);
      this.deferredPrompt = null;
      this.showInstallUI(false);
    } else {
      // iOS Safari 또는 직접 설치 안내
      this.showManualInstallModal();
    }
  }

  showInstallUI(show) {
    const installBtn = document.getElementById("btn-pwa-install");
    const installBanner = document.getElementById("pwa-install-banner");
    if (installBtn) {
      installBtn.style.display = show ? "inline-flex" : "none";
    }
    if (installBanner) {
      installBanner.style.display = show ? "flex" : "none";
    }
  }

  showManualInstallModal() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let message = "브라우저 메뉴에서 [홈 화면에 추가] 또는 [앱 설치]를 선택하시면 독립 앱으로 사용하실 수 있습니다.";
    
    if (isIOS) {
      message = "Safari 하단의 [공유(네모+화살표)] 버튼을 누른 후, [홈 화면에 추가]를 탭해주세요.";
    }

    if (window.AppStore) {
      window.AppStore.showToast(`📲 ${message}`, 5000);
    } else {
      alert(message);
    }
  }

  updateOnlineStatus(isOnline) {
    const statusChip = document.getElementById("header-gps-badge");
    if (isOnline) {
      if (window.AppStore) {
        window.AppStore.showToast("🟢 온라인 상태로 복귀했습니다.");
      }
    } else {
      if (window.AppStore) {
        window.AppStore.showToast("⚠️ 오프라인 모드: 캐시된 지도와 로컬 데이터를 이용합니다.", 4000);
      }
    }
  }
}

window.PWAControllerInstance = new PWAController();
