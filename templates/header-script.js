(function () {
  function initHeaderScripts() {
    const userActions = document.getElementById("userActions");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("userEmail") || "Người dùng";

    // ✅ Hiển thị user hoặc nút đăng nhập/đăng ký
    if (userActions && isLoggedIn === "true") {
      userActions.innerHTML = `
        <div class="top-act__user">
          <span class="user-name">${username}</span>
          <button id="logoutBtn" class="btn btn--text">Đăng xuất</button>
        </div>
      `;
    }

    // ✅ Xử lý đăng xuất
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        alert("Bạn đã đăng xuất!");
        window.location.href = "./sign-in.html";
      });
    }

    // ✅ Xử lý thanh tìm kiếm
    function initSearchBar() {
      const searchInput = document.querySelector("#searchInput");
      const searchBtn = document.querySelector("#searchBtn");
      if (!searchInput || !searchBtn) return; // Nếu header chưa load xong thì thoát

      function goToSearch() {
        const keyword = (searchInput.value || "").trim();
        if (keyword === "") return;

        const currentPage = window.location.pathname.split("/").pop().toLowerCase();
        const target = currentPage.includes("logined")
          ? `./search-result-logined.html?search=${encodeURIComponent(keyword)}`
          : `./search-result.html?search=${encodeURIComponent(keyword)}`;

        window.location.href = target;
      }

      // ✅ Gắn sự kiện (tránh bị gắn trùng)
      if (!searchBtn._bound) {
        searchBtn.addEventListener("click", goToSearch);
        searchBtn._bound = true;
      }
      if (!searchInput._bound) {
        searchInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            goToSearch();
          }
        });
        searchInput._bound = true;
      }
    }

    // ✅ Gọi initSearchBar sau khi header load xong
    setTimeout(initSearchBar, 300);

    // ✅ Xử lý mở / đóng tìm kiếm nâng cao
    const advancedSearchToggle = document.querySelector("#advancedSearchToggle");
    const advancedSearchPanel = document.querySelector("#advancedSearchPanel");

    if (advancedSearchToggle && advancedSearchPanel) {
      advancedSearchToggle.addEventListener("click", function () {
        advancedSearchPanel.classList.toggle("active");
      });
    }
  }

  // ✅ Chờ DOM sẵn sàng rồi mới khởi động toàn bộ script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeaderScripts);
  } else {
    initHeaderScripts();
  }
})();
