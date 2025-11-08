const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

/**
 * Hàm kiểm tra một phần tử
 * có bị ẩn bởi display: none không
 */
function isHidden(element) {
    if (!element) return true;

    if (window.getComputedStyle(element).display === "none") {
        return true;
    }

    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === "none") {
            return true;
        }
        parent = parent.parentElement;
    }

    return false;
}

/**
 * Hàm buộc một hành động phải đợi
 * sau một khoảng thời gian mới được thực thi
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

/**
 * Hàm tính toán vị trí arrow cho dropdown
 *
 * Cách dùng:
 * 1. Thêm class "js-dropdown-list" vào thẻ ul cấp 1
 * 2. CSS "left" cho arrow qua biến "--arrow-left-pos"
 */
const calArrowPos = debounce(() => {
    if (isHidden($(".js-dropdown-list"))) return;

    const items = $$(".js-dropdown-list > li");

    items.forEach((item) => {
        const arrowPos = item.offsetLeft + item.offsetWidth / 2;
        item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
    });
});

// Tính toán lại vị trí arrow khi resize trình duyệt
window.addEventListener("resize", calArrowPos);

// Tính toán lại vị trí arrow sau khi tải template
window.addEventListener("template-loaded", calArrowPos);

/**
 * Giữ active menu khi hover
 *
 * Cách dùng:
 * 1. Thêm class "js-menu-list" vào thẻ ul menu chính
 * 2. Thêm class "js-dropdown" vào class "dropdown" hiện tại
 *  nếu muốn reset lại item active khi ẩn menu
 */
window.addEventListener("template-loaded", handleActiveMenu);

function handleActiveMenu() {
    const dropdowns = $$(".js-dropdown");
    const menus = $$(".js-menu-list");
    const activeClass = "menu-column__item--active";

    const removeActive = (menu) => {
        menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    };

    const init = () => {
        menus.forEach((menu) => {
            const items = menu.children;
            if (!items.length) return;

            removeActive(menu);
            if (window.innerWidth > 991) items[0].classList.add(activeClass);

            Array.from(items).forEach((item) => {
                item.onmouseenter = () => {
                    if (window.innerWidth <= 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                };
                item.onclick = () => {
                    if (window.innerWidth > 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                    item.scrollIntoView();
                };
            });
        });
    };

    init();

    dropdowns.forEach((dropdown) => {
        dropdown.onmouseleave = () => init();
    });
}

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

window.addEventListener("template-loaded", () => {
    const links = $$(".js-dropdown-list > li > a");

    links.forEach((link) => {
        link.onclick = () => {
            if (window.innerWidth > 991) return;
            const item = link.closest("li");
            item.classList.toggle("navbar__item--active");
        };
    });
});

window.addEventListener("template-loaded", () => {
    const tabsSelector = "prod-tab__item";
    const contentsSelector = "prod-tab__content";

    const tabActive = `${tabsSelector}--current`;
    const contentActive = `${contentsSelector}--current`;

    const tabContainers = $$(".js-tabs");
    tabContainers.forEach((tabContainer) => {
        const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
        const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
        tabs.forEach((tab, index) => {
            tab.onclick = () => {
                tabContainer.querySelector(`.${tabActive}`)?.classList.remove(tabActive);
                tabContainer.querySelector(`.${contentActive}`)?.classList.remove(contentActive);
                tab.classList.add(tabActive);
                contents[index].classList.add(contentActive);
            };
        });
    });
});

window.addEventListener("template-loaded", () => {
    const switchBtn = document.querySelector("#switch-theme-btn");
    if (switchBtn) {
        switchBtn.onclick = function () {
            const isDark = localStorage.dark === "true";
            document.querySelector("html").classList.toggle("dark", !isDark);
            localStorage.setItem("dark", !isDark);
            switchBtn.querySelector("span").textContent = isDark ? "Giao diện tối" : "Giao diện sáng";
        };
        const isDark = localStorage.dark === "true";
        switchBtn.querySelector("span").textContent = isDark ? "Giao diện tối" : "Giao diện sáng";
    }
});

const isDark = localStorage.dark === "true";
document.querySelector("html").classList.toggle("dark", isDark);
// =============================
// XỬ LÝ ĐĂNG NHẬP, LƯU TRẠNG THÁI
// =============================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    // Nếu đang ở trang đăng nhập
    if (form && window.location.pathname.includes("sign-in.html")) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.querySelector('input[type="email"]').value;
            const password = document.querySelector('input[type="password"]').value;

            // Chỉ cần nhập không trống là cho đăng nhập
            if (email.trim() !== "" && password.trim() !== "") {
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "index-logined.html"; // chuyển đến trang chủ sau đăng nhập
            } else {
                alert("Vui lòng nhập email và mật khẩu!");
            }
        });
    }

    // Nếu chưa đăng nhập mà truy cập các trang khác -> chuyển về trang đăng nhập
    

    // Nút đăng xuất
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "sign-in.html";
        });
    }
});
// =============================
// XỬ LÝ TÌM KIẾM SẢN PHẨM
// =============================

// Khi template (header) load xong thì gắn sự kiện tìm kiếm
window.addEventListener("template-loaded", () => {
    const searchInput = document.querySelector("#searchInput");
    const searchBtn = document.querySelector("#searchBtn");

    if (searchInput && searchBtn) {
        // Khi click nút tìm kiếm
        searchBtn.addEventListener("click", () => {
            const keyword = searchInput.value.trim().toLowerCase();
            if (!keyword) {
                alert("Vui lòng nhập tên sản phẩm cần tìm!");
                return;
            }
            // Chuyển hướng đến trang index với tham số tìm kiếm
            window.location.href = `./index.html?search=${encodeURIComponent(keyword)}`;
        });

        // Khi nhấn Enter
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchBtn.click();
            }
        });
    }
});

// Khi trang index load thì lọc kết quả tìm kiếm
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("search");
    if (!keyword) return;

    const searchTerm = keyword.toLowerCase();
    const products = document.querySelectorAll(".product-card");
    let found = 0;

    products.forEach((product) => {
        const title = product.querySelector(".product-card__title").textContent.toLowerCase();
        const brand = product.querySelector(".product-card__brand").textContent.toLowerCase();
        if (title.includes(searchTerm) || brand.includes(searchTerm)) {
            product.style.display = "";
            found++;
        } else {
            product.style.display = "none";
        }
    });

    if (found === 0) {
        const container = document.querySelector(".row.row-cols-5");
        if (container) {
            container.innerHTML = `<p style="font-size:18px; color:#888; text-align:center; width:100%; margin-top:40px;">Không tìm thấy sản phẩm nào phù hợp với từ khóa "<b>${keyword}</b>"</p>`;
        }
    }
});
