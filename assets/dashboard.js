(function () {
  const AUTH_CODE = "055714";
  const AUTH_KEY = "apseon_dashboard_auth_v1";
  let initialized = false;

  function getAuthState() {
    try {
      if (localStorage.getItem(AUTH_KEY) === "1") {
        return true;
      }
    } catch (error) {}

    try {
      if (sessionStorage.getItem(AUTH_KEY) === "1") {
        return true;
      }
    } catch (error) {}

    return false;
  }

  function setAuthState() {
    try {
      localStorage.setItem(AUTH_KEY, "1");
    } catch (error) {}

    try {
      sessionStorage.setItem(AUTH_KEY, "1");
    } catch (error) {}
  }

  function createAuthGate() {
    const gate = document.createElement("div");
    gate.className = "auth-gate";
    gate.id = "authGate";
    gate.innerHTML = `
      <section class="auth-card" aria-label="인증번호 입력">
        <span class="auth-chip"><i class="fa-solid fa-shield-halved"></i> ACCESS CONTROL</span>
        <h2>인증번호를 입력해주세요</h2>
        <p>보안 설정된 페이지입니다. 인증번호를 입력하면 대시보드가 열립니다.</p>
        <div class="auth-form">
          <label for="authCodeInput">인증번호</label>
          <input id="authCodeInput" type="password" inputmode="numeric" autocomplete="off" placeholder="인증번호 입력" />
          <button id="authSubmit" class="auth-submit" type="button">확인</button>
          <p class="auth-error" id="authError" role="status" aria-live="polite"></p>
        </div>
      </section>
    `;
    document.body.prepend(gate);
    return gate;
  }

  function unlock(gate) {
    document.body.classList.remove("auth-locked");
    if (gate && gate.parentNode) {
      gate.parentNode.removeChild(gate);
    }
    setAuthState();
    initializeDashboardFeatures();
  }

  function initAuth() {
    if (getAuthState()) {
      initializeDashboardFeatures();
      return;
    }

    document.body.classList.add("auth-locked");
    const gate = createAuthGate();
    const input = document.getElementById("authCodeInput");
    const submit = document.getElementById("authSubmit");
    const error = document.getElementById("authError");

    const fail = () => {
      if (error) {
        error.textContent = "인증번호가 올바르지 않습니다.";
      }
      if (input) {
        input.focus();
        input.select();
      }
    };

    const verify = () => {
      if (!input) {
        return;
      }
      if (input.value.trim() === AUTH_CODE) {
        unlock(gate);
      } else {
        fail();
      }
    };

    if (submit) {
      submit.addEventListener("click", verify);
    }

    if (input) {
      setTimeout(() => input.focus(), 60);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          verify();
        }
      });
    }
  }

  function animateSubscriberCount() {
    const el = document.getElementById("subscriberCount");
    if (!el) {
      return;
    }

    const target = Number(el.dataset.target || "561");
    const start = Math.max(0, target - 120);
    const duration = 1800;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(start + (target - start) * easeOutCubic(progress));
      el.textContent = value.toLocaleString("ko-KR");

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  function renderRegionChart() {
    const canvas = document.getElementById("regionChart");
    if (!canvas || typeof Chart === "undefined") {
      return;
    }

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["경기도", "서울", "부산", "경상남도", "충청남도", "대구"],
        datasets: [
          {
            label: "조회수",
            data: [5428, 4476, 926, 453, 356, 169],
            backgroundColor: ["#2d57de", "#3f68e8", "#5b7def", "#7f9bf2", "#9fb5f6", "#c8d5f6"],
            borderRadius: 8,
            maxBarThickness: 34,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => "조회수 " + context.parsed.y.toLocaleString("ko-KR") + "회",
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#5d6f8d",
              font: { family: "Noto Sans KR", size: 11 },
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#edf2fa" },
            ticks: {
              color: "#5d6f8d",
              font: { family: "Manrope", size: 11, weight: "700" },
              callback: (value) => Number(value).toLocaleString("ko-KR"),
            },
          },
        },
      },
    });
  }

  function renderTrafficChart() {
    const canvas = document.getElementById("trafficSourceChart");
    if (!canvas || typeof Chart === "undefined") {
      return;
    }

    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["Shorts 피드", "YouTube 검색", "탐색 기능", "기타"],
        datasets: [
          {
            data: [43.1, 41.1, 9.1, 6.7],
            backgroundColor: ["#2d57de", "#0b8b74", "#b76826", "#d4deef"],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#4f607f",
              boxWidth: 11,
              boxHeight: 11,
              font: { family: "Noto Sans KR", size: 12, weight: "600" },
            },
          },
        },
        cutout: "68%",
      },
    });
  }

  function renderLongformRankingChart() {
    const canvas = document.getElementById("longformRankingChart");
    if (!canvas || typeof Chart === "undefined") {
      return;
    }

    const rows = [
      { title: "임플란트 수술 후 부작용", views: 690, avg: "4분 19초", rate: 34.3 },
      { title: "임플란트만 권하는 치과?", views: 316, avg: "2분 31초", rate: 45.3 },
      { title: "치아 미백 vs 라미네이트", views: 295, avg: "2분 44초", rate: 38.1 },
    ];

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((row) => row.title),
        datasets: [
          {
            label: "조회수",
            data: rows.map((row) => row.views),
            backgroundColor: ["#2d57de", "#4f73e8", "#7a96ef"],
            borderRadius: 8,
            barThickness: 34,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const row = rows[context.dataIndex];
                return [
                  "조회수: " + row.views.toLocaleString("ko-KR") + "회",
                  "평균 시청: " + row.avg,
                  "조회율: " + row.rate + "%",
                ];
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "#edf2fa" },
            ticks: {
              color: "#5d6f8d",
              font: { family: "Manrope", size: 11, weight: "700" },
              callback: (value) => Number(value).toLocaleString("ko-KR"),
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              color: "#4e5f7e",
              font: { family: "Noto Sans KR", size: 12, weight: "700" },
            },
          },
        },
      },
    });
  }

  function initContractModal() {
    const backdrop = document.getElementById("contractModalBackdrop");
    const openBtn = document.getElementById("openContractInfo");
    const closeBtn = document.getElementById("closeContractInfo");

    if (!backdrop || !openBtn || !closeBtn) {
      return;
    }

    const openModal = () => {
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
    };

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && backdrop.classList.contains("open")) {
        closeModal();
      }
    });
  }

  function initializeDashboardFeatures() {
    if (initialized) {
      return;
    }
    initialized = true;

    animateSubscriberCount();
    renderRegionChart();
    renderTrafficChart();
    renderLongformRankingChart();
    initContractModal();
  }

  document.addEventListener("DOMContentLoaded", initAuth);
})();
