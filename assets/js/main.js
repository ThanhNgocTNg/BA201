        let currentLetterFilter = 'ALL';

        function setAlphabetFilter(letter) {
          currentLetterFilter = letter;
          document.querySelectorAll('#alphabet-filters .alpha-btn').forEach(btn => {
            if (btn.getAttribute('data-letter') === letter) {
              btn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm', 'active');
              btn.classList.remove('bg-gray-100', 'dark:bg-slate-700', 'text-gray-700', 'dark:text-gray-300');
            } else {
              btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm', 'active');
              btn.classList.add('bg-gray-100', 'dark:bg-slate-700', 'text-gray-700', 'dark:text-gray-300');
            }
          });
          filterGlossary();
        }

        function filterGlossary() {
          const query = (document.getElementById('glossary-search').value || '').toLowerCase().trim();
          const items = document.querySelectorAll('.glossary-item');
          let visibleCount = 0;

          items.forEach(item => {
            const itemLetter = item.getAttribute('data-letter') || '';
            const itemText = item.textContent.toLowerCase();

            const matchesLetter = (currentLetterFilter === 'ALL' || itemLetter === currentLetterFilter);
            const matchesQuery = (query === '' || itemText.includes(query));

            if (matchesLetter && matchesQuery) {
              item.classList.remove('hidden');
              visibleCount++;
            } else {
              item.classList.add('hidden');
            }
          });

          const emptyState = document.getElementById('glossary-empty');
          const gridEl = document.getElementById('glossary-grid');
          if (emptyState && gridEl) {
            if (visibleCount === 0) {
              emptyState.classList.remove('hidden');
              gridEl.classList.add('hidden');
            } else {
              emptyState.classList.add('hidden');
              gridEl.classList.remove('hidden');
            }
          }
        }

    // JS CONTROLLER FOR VIEWS, TABS, ROADMAP, AND GSAP ANIMATIONS
    function showView(viewId) {
      document.querySelectorAll('main > div').forEach(el => el.classList.add('hidden'));
      const targetEl = document.getElementById('view-' + viewId);
      if (targetEl) {
        targetEl.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(targetEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
          if (viewId === 'overview') {
            const cards = targetEl.querySelectorAll('.grid > div');
            if (cards.length > 0) {
              gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'opacity,transform' });
            }
          }
        }
      }
      document.querySelectorAll('header button').forEach(btn => btn.classList.remove('bg-rikkei-red', 'bg-rikkei-navy', 'bg-amber-500', 'text-white', 'font-bold'));
      const btnOverview = document.getElementById('btn-overview');
      const btnRoadmap = document.getElementById('btn-roadmap');
      const btnGlossary = document.getElementById('btn-glossary');
      if (viewId === 'overview' && btnOverview) {
        btnOverview.classList.add('bg-gray-200', 'font-bold');
      } else if (viewId === 'roadmap' && btnRoadmap) {
        btnRoadmap.classList.add('bg-amber-500', 'text-white', 'font-bold');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    function showSession(sNum) {
      showView('session-' + sNum);
      showLessonTab(sNum, 1);
    }

    // LESSON TABS CONTROLLER
    function showLessonTab(sNum, lId) {
      const sessionView = document.getElementById('view-session-' + sNum);
      if (!sessionView) return;

      sessionView.querySelectorAll('.lesson-panel').forEach(panel => panel.classList.add('hidden'));
      sessionView.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

      const targetPanel = sessionView.querySelector('#panel-s' + sNum + '-l' + lId);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(targetPanel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
        }
      }

      const activeBtn = sessionView.querySelector('#btn-s' + sNum + '-l' + lId);
      if (activeBtn) activeBtn.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function nextLessonInSession(sNum, currentLId) {
      const sessionView = document.getElementById('view-session-' + sNum);
      if (!sessionView) return;
      const tabBtns = Array.from(sessionView.querySelectorAll('.tab-btn'));
      const currentBtnId = 'btn-s' + sNum + '-l' + currentLId;
      const currentIndex = tabBtns.findIndex(btn => btn.id === currentBtnId);
      if (currentIndex !== -1 && currentIndex < tabBtns.length - 1) {
        tabBtns[currentIndex + 1].click();
      } else if (currentIndex === tabBtns.length - 1) {
        if (sNum < 10) {
          showSession(sNum + 1);
        } else {
          showView('view-roadmap');
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function prevLessonInSession(sNum, currentLId) {
      const sessionView = document.getElementById('view-session-' + sNum);
      if (!sessionView) return;
      const tabBtns = Array.from(sessionView.querySelectorAll('.tab-btn'));
      const currentBtnId = 'btn-s' + sNum + '-l' + currentLId;
      const currentIndex = tabBtns.findIndex(btn => btn.id === currentBtnId);
      if (currentIndex > 0) {
        tabBtns[currentIndex - 1].click();
      } else if (currentIndex === 0 && sNum > 1) {
        showSession(sNum - 1);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('scroll', () => {
      const btn = document.getElementById('backToTopBtn');
      if (!btn) return;
      if (window.scrollY > 300) {
        btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        btn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        btn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }
    });

    // ROADMAP DETAIL CONTROLLER (10-STEP BUSINESS ANALYSIS WORKFLOW)
    const roadmapData = {
      1: {
        sNum: 1,
        badge: "BƯỚC 1 • SESSION 1: TỔNG QUAN VỀ BA & VAI TRÒ",
        pain: "Hiểu rõ định nghĩa BA theo chuẩn IIBA BABOK Guide, phân định ranh giới trách nhiệm giữa BA vs DA vs PO vs PM, và xác định tư duy phân tích nghiệp vụ (BA Mindset).",
        skill: "• Khung tư duy giải quyết vấn đề (Problem Solving Framework).<br>• Phân tích chuỗi giá trị (Value Proposition Design).<br>• Ma trận phân định trách nhiệm RACI Matrix.",
        solution: "Bảng phân định ranh giới công việc BA trong dự án CNTT & Kế hoạch phát triển năng lực cá nhân theo chuẩn 6 vùng kiến thức BABOK V3."
      },
      2: {
        sNum: 2,
        badge: "BƯỚC 2 • SESSION 2: KHẢO SÁT HIỆN TRẠNG (AS-IS)",
        pain: "Nhận diện nỗi đau nghiệp vụ tại doanh nghiệp (FPT Retail / Long Châu), thu thập triệu chứng lỗi và bóc tách bối cảnh hiện trạng vận hành AS-IS.",
        skill: "• Kỹ thuật phỏng vấn sơ bộ & quan sát (Shadowing).<br>• Mô hình định nghĩa vấn đề SMART Problem Statement.<br>• Biểu đồ luồng thông tin nghiệp vụ hiện trạng (AS-IS Context).",
        solution: "Tuyên bố vấn đề kinh doanh (SMART Problem Statement) & Báo cáo đánh giá sơ bộ điểm nghẽn vận hành tại quầy POS."
      },
      3: {
        sNum: 3,
        badge: "BƯỚC 3 • SESSION 3: PHÂN TÍCH NGUYÊN NHÂN (RCA)",
        pain: "Đi sâu phân tích nguyên nhân gốc rễ gây ra ùn ứ và lỗi thao tác tại quầy thu ngân, phân vùng lỗi do Quy trình - Con người hay Hệ thống, chốt phạm vi dự án.",
        skill: "• Kỹ thuật 5 Whys (Truy vấn nguyên nhân gốc).<br>• Biểu đồ xương cá Ishikawa (6Ms Analysis).<br>• Phân định giới hạn phạm vi In-Scope vs Out-of-Scope.",
        solution: "Sơ đồ chẩn đoán nguyên nhân gốc rễ (RCA Map) & Tài liệu xác lập phạm vi dự án (Project Scope Statement)."
      },
      4: {
        sNum: 4,
        badge: "BƯỚC 4 • SESSION 4: STAKEHOLDER ANALYSIS",
        pain: "Nhận diện diện rộng 360° tất cả các bên liên quan (Dược sĩ, Khách hàng, IT, Kế toán, Ban Giám đốc), đánh giá quyền lực và mức độ ảnh hưởng của từng nhóm.",
        skill: "• Sơ đồ nhận diện Stakeholders 360°.<br>• Ma trận Quyền lực vs Mức độ quan tâm (Power/Interest Grid).<br>• Chiến lược quản trị kỳ vọng & Giao tiếp (Communication Plan).",
        solution: "Hồ sơ phân tích Stakeholder Matrix & Kế hoạch truyền thông, quản trị rủi ro xung đột lợi ích dự án."
      },
      5: {
        sNum: 5,
        badge: "BƯỚC 5 • SESSION 5: KHAI THÁC YÊU CẦU (ELICITATION)",
        pain: "Trực tiếp điều phối và áp dụng các kỹ thuật khai thác yêu cầu chuyên sâu để lấy được nhu cầu thực tế từ người dùng cuối thay vì ý muốn chủ quan.",
        skill: "• Kỹ thuật Phỏng vấn 1-1 chuyên sâu (Semi-structured Interview).<br>• Tổ chức hội thảo đồng sáng tạo JAD Workshop.<br>• Kỹ thuật tạo Prototype nhanh & Khảo sát thực địa.",
        solution: "Biên bản ghi nhận yêu cầu (Elicitation Minutes) & Danh mục Yêu cầu thô (Raw Requirements Backlog)."
      },
      6: {
        sNum: 7,
        badge: "BƯỚC 6 • SESSION 7: MÔ HÌNH HÓA QUY TRÌNH BPMN",
        pain: "Mô hình hóa và chuẩn hóa luồng nghiệp vụ phối hợp liên phòng ban từ AS-IS sang TO-BE để loại bỏ thao tác thừa và tối ưu thời gian xử lý.",
        skill: "• Sơ đồ quy trình chuẩn quốc tế BPMN 2.0.<br>• Kỹ thuật phân làn Swimlane Process Mapping.<br>• Phân tích điểm nghẽn hand-off & tối ưu hóa luồng (Streamlining).",
        solution: "Sơ đồ luồng nghiệp vụ AS-IS & TO-BE BPMN Swimlane Diagrams được thống nhất giữa Business và IT."
      },
      7: {
        sNum: 8,
        badge: "BƯỚC 7 • SESSION 8: VIẾT USER STORIES & GHERKIN",
        pain: "Chuyển hóa quy trình TO-BE thành các đặc tả Agile nhỏ gọn, dễ lập trình và kiểm thử, đảm bảo IT viết đúng code mà không cần suy đoán.",
        skill: "• Phân rã Epic -> Feature -> User Story chuẩn INVEST.<br>• Viết tiêu chí nghiệm thu Acceptance Criteria chuẩn Gherkin (Given-When-Then).<br>• Thiết kế Wireframe UI/UX POS 3-Click.",
        solution: "Bộ đặc tả User Stories & Acceptance Criteria hoàn chỉnh kèm giao diện Low-fi/High-fi Wireframes."
      },
      8: {
        sNum: 9,
        badge: "BƯỚC 9 • SESSION 9: ƯU TIÊN MoSCoW & ĐÁNH GIÁ ROI",
        pain: "Đứng trước bài toán cắt giảm ngân sách và áp lực tiến độ, BA cần tư vấn giải pháp tối ưu, lựa chọn tính năng MVP và chứng minh hiệu quả đầu tư.",
        skill: "• Kỹ thuật phân loại ưu tiên MoSCoW.<br>• Phân tích đánh đổi tự xây dựng hay mua sẵn (Build vs Buy Analysis).<br>• Tính toán ROI, TCO & Thời gian hoàn vốn (Payback Period).",
        solution: "Tài liệu Đề xuất Phạm vi MVP tinh gọn (5 tính năng cốt lõi) & Bảng phân tích hiệu quả tài chính Cost-Benefit Analysis."
      },
      9: {
        sNum: 10,
        badge: "BƯỚC 9 • SESSION 10: KHỞI TẠO ĐỒ ÁN & BUSINESS CASE",
        pain: "Khởi tạo Hồ sơ Đề xuất Dự án (Business Case) tổng thể cho Đồ án tốt nghiệp thực chiến, chuẩn bị nền tảng bảo vệ trước Hội đồng Ban Giám đốc.",
        skill: "• Tổng hợp Hồ sơ Business Case chuyên nghiệp.<br>• Chuẩn hóa bản đồ Stakeholder & Phạm vi tổng thể.<br>• Kỹ thuật lập luận logic & cấu trúc hồ sơ dự án.",
        solution: "Hồ sơ Đồ án Capstone Project (Phần 1: Khởi tạo, Bối cảnh kinh doanh & Phân tích Vấn đề)."
      },
      10: {
        sNum: 11,
        badge: "BƯỚC 10 • SESSION 11: BẢO VỆ ĐẶC TẢ BRD/SRS & BÀN GIAO",
        pain: "Hoàn thiện 100% tài liệu đặc tả nghiệp vụ (BRD/SRS/SOP), thuyết trình bảo vệ giải pháp chuyển đổi số toàn chuỗi và chính thức ký bàn giao cho IT.",
        skill: "• Soạn thảo bộ Tài liệu Yêu cầu Nghiệp vụ BRD/SRS/SOP.<br>• Kỹ thuật thuyết trình & Bảo vệ trước Executive Board.<br>• Quy trình nghiệm thu Sign-off & Bàn giao kỹ thuật.",
        solution: "Hồ sơ Đặc tả Nghiệp vụ hoàn chỉnh (Signed-off BRD/SRS) & Ký duyệt triển khai thành công trên toàn chuỗi 1.500 cửa hàng."
      }
    };

    function showRoadmapDetail(stageNum) {
      const data = roadmapData[stageNum];
      if (!data) return;
      document.getElementById('rm-stage-badge').innerText = data.badge;
      document.getElementById('rm-pain').innerHTML = data.pain;
      document.getElementById('rm-skill').innerHTML = data.skill;
      document.getElementById('rm-solution').innerHTML = data.solution;

      const jumpBtn = document.getElementById('rm-jump-btn');
      if (jumpBtn) {
        jumpBtn.setAttribute('onclick', 'showSession(' + data.sNum + ')');
      }

      document.querySelectorAll('.rm-card').forEach(card => {
        card.classList.remove('border-amber-500', 'bg-amber-50/40', 'shadow-md');
        card.classList.add('border-amber-200', 'bg-white', 'shadow-sm');
      });
      const activeCard = document.getElementById('rm-card-' + stageNum);
      if (activeCard) {
        activeCard.classList.remove('border-amber-200', 'bg-white', 'shadow-sm');
        activeCard.classList.add('border-amber-500', 'bg-amber-50/40', 'shadow-md');
      }

      const box = document.getElementById('roadmap-detail-box');
      box.classList.remove('animate-fade');
      void box.offsetWidth;
      box.classList.add('animate-fade');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo("#roadmap-detail-box", { opacity: 0, scale: 0.98, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out" });
        gsap.fromTo(["#rm-pain", "#rm-skill", "#rm-solution"], { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.08, ease: "power2.out" });
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      showView('overview');
      if (typeof gsap !== 'undefined') {
        gsap.from("header", { y: -60, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "all" });
        gsap.from("#view-overview > div:first-child", { scale: 0.97, opacity: 0, y: 25, duration: 0.7, ease: "power3.out", delay: 0.1, clearProps: "all" });
      }

      // SIDEBAR TOGGLE
      const sidebar = document.getElementById('sidebar');
      const trigger = document.getElementById('sidebarTrigger');

      if (trigger && sidebar) {
        trigger.addEventListener('mouseenter', () => sidebar.classList.add('open'));
        trigger.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', (e) => {
          if (!sidebar.contains(e.target) && !trigger.contains(e.target)) {
            sidebar.classList.remove('open');
          }
        });
      }
    });
    function closeSidebar() {
      const sidebarEl = document.getElementById('sidebar');
      if (sidebarEl) sidebarEl.classList.remove('open');
    }

    function toggleTheme() {
      const isDark = document.body.classList.toggle('dark-theme');
      const icon = document.getElementById('themeToggleIcon');
      const text = document.getElementById('themeToggleText');
      const btn = document.getElementById('themeToggleBtn');
      if (isDark) {
        if (icon) icon.className = 'ph-fill ph-sun text-base text-yellow-300';
        if (text) text.innerText = 'Chế độ Sáng';
        if (btn) btn.className = 'w-10 h-10 rounded-full flex items-center justify-center bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition shadow-sm border border-yellow-300 shrink-0';
        localStorage.setItem('ba201_theme', 'dark');
      } else {
        if (icon) icon.className = 'ph-fill ph-moon-stars text-base text-yellow-300';
        if (text) text.innerText = 'Chế độ Tối';
        if (btn) btn.className = 'w-10 h-10 rounded-full flex items-center justify-center bg-gray-900 text-yellow-300 hover:bg-gray-800 transition shadow-sm border border-gray-700 shrink-0';
        localStorage.setItem('ba201_theme', 'light');
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      if (localStorage.getItem('ba201_theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.getElementById('themeToggleIcon');
        const text = document.getElementById('themeToggleText');
        const btn = document.getElementById('themeToggleBtn');
        if (icon) icon.className = 'ph-fill ph-sun text-base text-yellow-300';
        if (text) text.innerText = 'Chế độ Sáng';
        if (btn) btn.className = 'w-10 h-10 rounded-full flex items-center justify-center bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition shadow-sm border border-yellow-300 shrink-0';
      }
    });

    let petMoveTimer = null;
    let petBubbleTimer = null;
    let activePetPointer = null;

    let petGrabOffsetX = 0;
    let petGrabOffsetY = 0;
    let petPointerStartX = 0;
    let petPointerStartY = 0;
    let petWasDragged = false;
    let isPetMeat = false;

    function clampPetPosition(left, top) {
      const pet = document.getElementById("web-pet");
      const padding = 8;

      return {
        left: Math.max(
          padding,
          Math.min(
            window.innerWidth - pet.offsetWidth - padding,
            left
          )
        ),

        top: Math.max(
          72,
          Math.min(
            window.innerHeight - pet.offsetHeight - padding,
            top
          )
        )
      };
    }

    function showPetBubble(message) {
      const bubble = document.getElementById("pet-bubble");

      bubble.textContent = message;
      bubble.classList.add("show");

      clearTimeout(petBubbleTimer);

      petBubbleTimer = setTimeout(() => {
        bubble.classList.remove("show");
      }, 1800);
    }

    function togglePetTransformation() {
      const sprite = document.getElementById("pet-sprite");
      const pet = document.getElementById("web-pet");
      if (!sprite || !pet) return;

      isPetMeat = !isPetMeat;
      if (isPetMeat) {
        sprite.textContent = "🥩";
        showPetBubble("Éc éccccccc! 🥩");
        pet.setAttribute("aria-label", "Miếng thịt đang di chuyển. Giữ và kéo để chuyển vị trí");
      } else {
        sprite.textContent = "🐖";
        showPetBubble("Heo con hồi sinh! 🐷");
        pet.setAttribute("aria-label", "Heo con đang chạy. Giữ và kéo để di chuyển heo đến vị trí khác");
      }
    }

    function schedulePetMove(delay) {
      clearTimeout(petMoveTimer);
      petMoveTimer = setTimeout(movePetRandomly, delay);
    }

    function movePetRandomly() {
      const pet = document.getElementById("web-pet");

      if (
        !pet ||
        activePetPointer !== null ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const rect = pet.getBoundingClientRect();

      const target = clampPetPosition(
        8 + Math.random() *
        Math.max(0, window.innerWidth - pet.offsetWidth - 16),

        76 + Math.random() *
        Math.max(0, window.innerHeight - pet.offsetHeight - 84)
      );

      const distance = Math.hypot(
        target.left - rect.left,
        target.top - rect.top
      );

      const duration = Math.max(
        1200,
        Math.min(4800, distance * 9)
      );

      pet.classList.toggle(
        "facing-left",
        target.left > rect.left
      );

      pet.classList.add("is-running");

      pet.style.transition =
        "left " + duration + "ms linear, " +
        "top " + duration + "ms linear";

      pet.style.left = target.left + "px";
      pet.style.top = target.top + "px";

      clearTimeout(petMoveTimer);

      petMoveTimer = setTimeout(() => {
        pet.classList.remove("is-running");

        schedulePetMove(
          500 + Math.random() * 1200
        );
      }, duration);
    }

    function beginPetDrag(event) {
      if (
        event.button !== undefined &&
        event.button !== 0
      ) {
        return;
      }

      const pet = document.getElementById("web-pet");
      const rect = pet.getBoundingClientRect();

      activePetPointer = event.pointerId;

      petGrabOffsetX = event.clientX - rect.left;
      petGrabOffsetY = event.clientY - rect.top;

      petPointerStartX = event.clientX;
      petPointerStartY = event.clientY;
      petWasDragged = false;

      clearTimeout(petMoveTimer);

      pet.style.transition = "none";
      pet.style.left = rect.left + "px";
      pet.style.top = rect.top + "px";

      pet.classList.remove("is-running");
      pet.classList.add("is-held");

      pet.setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    function dragPet(event) {
      if (event.pointerId !== activePetPointer) {
        return;
      }

      const distance = Math.hypot(
        event.clientX - petPointerStartX,
        event.clientY - petPointerStartY
      );

      if (distance > 4) {
        petWasDragged = true;
      }

      const pet = document.getElementById("web-pet");

      const next = clampPetPosition(
        event.clientX - petGrabOffsetX,
        event.clientY - petGrabOffsetY
      );

      pet.style.left = next.left + "px";
      pet.style.top = next.top + "px";

      event.preventDefault();
    }

    function endPetDrag(event) {
      if (event.pointerId !== activePetPointer) {
        return;
      }

      const pet = document.getElementById("web-pet");

      if (pet.hasPointerCapture(event.pointerId)) {
        pet.releasePointerCapture(event.pointerId);
      }

      activePetPointer = null;
      pet.classList.remove("is-held");

      showPetBubble(isPetMeat ? "Thịt thơm ngon! 🥩" : "Ụt ịt! 🐷");

      schedulePetMove(900);
    }

    function keepPetInViewport() {
      const pet = document.getElementById("web-pet");

      if (!pet) {
        return;
      }

      const rect = pet.getBoundingClientRect();

      const safePosition = clampPetPosition(
        rect.left,
        rect.top
      );

      pet.style.transition = "none";
      pet.style.left = safePosition.left + "px";
      pet.style.top = safePosition.top + "px";

      if (activePetPointer === null) {
        schedulePetMove(700);
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      const pet = document.getElementById("web-pet");

      pet.addEventListener(
        "pointerdown",
        beginPetDrag
      );

      pet.addEventListener(
        "pointermove",
        dragPet
      );

      pet.addEventListener(
        "pointerup",
        endPetDrag
      );

      pet.addEventListener(
        "pointercancel",
        endPetDrag
      );

      window.addEventListener(
        "pointerup",
        endPetDrag
      );

      window.addEventListener(
        "pointercancel",
        endPetDrag
      );

      pet.addEventListener("keydown", event => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          showPetBubble(isPetMeat ? "Thịt thơm ngon! 🥩" : "Ụt ịt! 🐷");
        }
      });

      window.addEventListener(
        "resize",
        keepPetInViewport
      );

      keepPetInViewport();

      setTimeout(() => {
        showPetBubble("Ụt ịt! 🐷");
      }, 350);

      schedulePetMove(1900);

      // Vòng lặp 15s đổi qua lại giữa Heo con 🐖 và Miếng thịt 🥩
      setInterval(togglePetTransformation, 15000);
    });
