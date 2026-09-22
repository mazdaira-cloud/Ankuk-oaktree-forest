/**
 * Anguk 700 Digital Oaks - Effects & Certificate Generator
 * Web Audio API 효과음, Canvas Confetti 폭죽, HTML5 Canvas 떡갈나무 수호목 인증서 발급기
 */

class EffectsManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.particles = [];
    this.animationFrame = null;

    this.initConfettiCanvas();
  }

  // Web Audio Context 지연 초기화 (브라우저 정책 대응)
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Web Audio 효과음 합성 연주
  playSound(type = "click") {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "levelup" || type === "growth") {
        // C-E-G-C5 아르페지오 (상승 코드음)
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteTime = now + idx * 0.08;
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0.2, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.35);
        });
      } else if (type === "fanfare") {
        // 승리 팡파레
        const notes = [
          { f: 523.25, t: 0 },
          { f: 659.25, t: 0.12 },
          { f: 783.99, t: 0.24 },
          { f: 1046.5, t: 0.4 },
          { f: 1318.5, t: 0.6 }
        ];
        notes.forEach(({ f, t }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteTime = now + t;
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, noteTime);
          gain.gain.setValueAtTime(0.25, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.5);
        });
      } else if (type === "coin") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn("Audio play sound error:", e);
    }
  }

  // Confetti 캔버스 초기화
  initConfettiCanvas() {
    let canvas = document.getElementById("effects-confetti-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "effects-confetti-canvas";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9999";
      document.body.appendChild(canvas);
    }
    this.confettiCanvas = canvas;
    this.confettiCtx = canvas.getContext("2d");

    window.addEventListener("resize", () => {
      this.resizeCanvas();
    });
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (this.confettiCanvas) {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }
  }

  // 폭죽 이펙트 발사
  triggerConfetti(count = 70) {
    this.resizeCanvas();
    const colors = ["#10b981", "#34d399", "#f59e0b", "#eab308", "#3b82f6", "#ffffff", "#047857"];
    const w = this.confettiCanvas.width;
    const h = this.confettiCanvas.height;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: w / 2 + (Math.random() - 0.5) * 200,
        y: h / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1,
        life: 0
      });
    }

    if (!this.animationFrame) {
      this.animateConfetti();
    }
  }

  animateConfetti() {
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // 중력
      p.rotation += p.vRot;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / 80);

      this.confettiCtx.save();
      this.confettiCtx.globalAlpha = p.alpha;
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.confettiCtx.restore();

      if (p.alpha <= 0 || p.y > this.confettiCanvas.height) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.animationFrame = null;
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }

  // 완주/성장 디지털 인증서 캔버스 생성 및 모달 표시
  openCertificateModal(data = {}) {
    const modal = document.getElementById("modal-certificate");
    if (!modal) return;

    const canvas = document.getElementById("certificate-canvas");
    if (canvas) {
      this.drawCertificate(canvas, data);
    }

    modal.classList.add("open");
  }

  drawCertificate(canvas, data) {
    const ctx = canvas.getContext("2d");
    const w = 720;
    const h = 960;
    canvas.width = w;
    canvas.height = h;

    // 1. 고급 배경 그라디언트
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#064e3b");
    bgGrad.addColorStop(0.4, "#047857");
    bgGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. 내부 프레임 (금빛 테두리)
    ctx.strokeStyle = "rgba(234, 179, 8, 0.6)";
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(34, 34, w - 68, h - 68);

    // 3. 상단 헤더
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ANGUK DIGITAL SOCIAL SCULPTURE", w / 2, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 36px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText("700 떡갈나무 수호목 완주 인증서", w / 2, 130);

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "15px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText("Joseph Beuys 《7000 Eichen》 시민 참여형 플로깅 프로젝트", w / 2, 160);

    // 4. 중앙 심볼 아이콘
    ctx.font = "72px sans-serif";
    ctx.fillText("🌳", w / 2, 260);

    // 5. 철학 인용문 박스
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(60, 310, w - 120, 80, 16);
    ctx.fill();

    ctx.fillStyle = "#fef08a";
    ctx.font = "italic 16px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText('"모든 인간은 예술가이며, 사회의 상처를 직접 치유한다."', w / 2, 345);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText("— 요셉 보이스(Joseph Beuys)", w / 2, 370);

    // 6. 활동 통계 카드 그리드
    const durationMin = Math.floor((data.durationSec || 0) / 60);
    const durationSec = (data.durationSec || 0) % 60;
    const timeStr = `${durationMin}분 ${durationSec}초`;

    const stats = [
      { label: "정화 이동 거리", val: `${data.distanceKm || '0.00'} km` },
      { label: "소요 시간", val: timeStr },
      { label: "소모 칼로리", val: `${data.calories || 0} kcal` },
      { label: "획득 도토리", val: `+${data.earnedPoints || 150} P` }
    ];

    const cardW = 280;
    const cardH = 90;
    const startX = 70;
    const startY = 420;

    stats.forEach((s, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cardW + 20);
      const y = startY + row * (cardH + 16);

      ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(s.label, x + cardW / 2, y + 32);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
      ctx.fillText(s.val, x + cardW / 2, y + 68);
    });

    // 7. 발급 정보 & 직인
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    const serial = `AGK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText(`발급 번호: ${serial}`, 70, 680);
    ctx.fillText(`인증 일자: ${dateStr}`, 70, 710);
    ctx.fillText(`수호 지역: 서울특별시 종로구 안국역 일대`, 70, 740);

    // 빨간 직인 도장 렌더링
    ctx.save();
    ctx.translate(w - 150, 710);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("사회적", 0, -8);
    ctx.fillText("조각인", 0, 14);
    ctx.restore();

    // 8. 하단 서명
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("안국역 700 떡갈나무 시민 행동 연대", w / 2, 860);
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif";
    ctx.fillText("ANGUK CITIZEN PLOGGING & SMART CITY SCULPTURE", w / 2, 885);
  }

  // 인증서 이미지 다운로드
  downloadCertificate() {
    const canvas = document.getElementById("certificate-canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `안국_떡갈나무_수호목_완주인증서_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    if (window.AppStore) {
      window.AppStore.showToast("💾 인증서 이미지가 기기에 다운로드되었습니다.");
    }
  }

  // 네이티브 Web Share API 연동
  async shareCertificate() {
    const canvas = document.getElementById("certificate-canvas");
    if (!canvas) return;

    if (navigator.share && canvas.toBlob) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "anguk_oaks_certificate.png", { type: "image/png" });
        try {
          await navigator.share({
            title: "700 떡갈나무 수호목 완주 인증서",
            text: "안국역 일대를 플로깅하고 떡갈나무를 키웠습니다! 🌳 요셉 보이스 사회적 조각 프로젝트",
            files: [file]
          });
        } catch (err) {
          console.log("Share canceled or failed", err);
        }
      });
    } else {
      this.downloadCertificate();
    }
  }
}

window.EffectsManager = new EffectsManager();
