// Dark Mode Toggle
// to enable or disable dark mode based on the checkbox state.
    // Nếu chưa đăng nhập thì quay về login
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login-admin.html";
    }

    function logout() {
        localStorage.removeItem("isLoggedIn");
        window.location.href = "login-admin.html";
    }

const darkMode = document.getElementById("dark-mode");
darkMode.addEventListener("change", function (event) {
  event.stopPropagation();
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

// Sidebar Active Menu Highlight
// Highlights the active menu item in the sidebar by adding the "active" class to the clicked item
// and removing the class from all others.
const SideMenu = document.querySelectorAll(".sidebar .side-menu.top li a");
SideMenu.forEach((item) => {
  const li = item.parentElement;
  item.addEventListener("click", function () {
    SideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// Modal Open/Close Handling
// Handles the opening and closing of a modal. Disables body scrolling when the modal is open
// and closes the modal when clicking outside it or on the close button.
const formContainer = document.querySelector(".form-main");
const inputContainer = document.querySelector(".form-input-container");
const searchBtn = document.querySelector(".nav-search-btn");
const modalCloseBtn = document.querySelector(".modal-close-btn");

searchBtn.addEventListener("click", () => {
  formDisplay();
  console.log("Modal opened");
  document.body.style.overflowY = "hidden";
});

// Opens the modal by adding the "show-form" class to the form container.
function formDisplay() {
  formContainer.classList.add("show-form");
}

modalCloseBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  if (formContainer.classList.contains("show-form")) {
    closeModal();
    console.log("Modal closed via close button");
  }
});

// Closes the modal by removing the "show-form" class and restoring body scrolling.
function closeModal() {
  formContainer.classList.remove("show-form");
  document.body.style.overflowY = "scroll";
}

document.addEventListener("click", (event) => {
  if (
    formContainer.classList.contains("show-form") &&
    !inputContainer.contains(event.target) &&
    !searchBtn.contains(event.target)
  ) {
    closeModal();
    console.log("Modal closed by clicking outside");
  }
});

// Prevents event propagation when clicking inside the modal input container.
inputContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Sidebar Toggle and Shadow Overlay
// Toggles the sidebar visibility, adds/removes a shadow overlay, and adjusts text visibility.
const toggleBtn = document.querySelector(".toggle-btn");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");
const shadowOverlay = document.querySelector(".shadow-overlay");
const sidebarText = document.querySelectorAll(".sidebar-text");

// Prevents event propagation when clicking inside the sidebar.
sidebar.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Toggles the sidebar and shadow overlay, and adjusts text visibility on toggle button click.
toggleBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  openSidebar();
  hideText();
});

// Opens the sidebar by toggling the "hide" class and adding the "show-shadow" class.
function openSidebar() {
  sidebar.classList.toggle("hide");
  shadowOverlay.classList.add("show-shadow");
  document.body.style.overflowY = "hidden";
  toggleBtn.classList.toggle("rotate");
  if (window.innerWidth < 1300) {
    window.addEventListener("click", function () {
      closeSidebar();
    });
  } else {
    document.body.style.overflowY = "scroll";
  }
}

// Hides or shows the text inside the sidebar based on the sidebar's state and screen size.
function hideText() {
  if (window.innerWidth > 1300) {
    sidebarText.forEach((textElement) => {
      if (sidebar.classList.contains("hide")) {
        textElement.classList.add("hide-text");
      } else {
        textElement.classList.remove("hide-text");
      }
    });
  }
}

// Adjusts text visibility inside the sidebar on screen resize.
function enableTextOnResize() {
  if (!sidebar.classList.contains("hide")) {
    sidebarText.forEach((textElement) => {
      textElement.classList.remove("hide-text");
    });
  } else {
    sidebarText.forEach((textElement) => {
      textElement.classList.add("hide-text");
    });
  }
}

// Ensures text is always visible in the sidebar for smaller screens.
function disableHideText() {
  if (window.innerWidth < 1300) {
    sidebarText.forEach((textElement) => {
      textElement.classList.remove("hide-text");
    });
  }
}

// Closes the sidebar by adding the "hide" class and removing the shadow overlay.
function closeSidebar() {
  sidebar.classList.add("hide");
  document.body.style.overflowY = "scroll";
  shadowOverlay.classList.remove("show-shadow");
}

// Closes the sidebar when the close button is clicked.
closeBtn.addEventListener("click", function (event) {
  closeSidebar();
});

// Automatically closes or opens the sidebar based on screen size.
function sidebarAutoClose() {
  if (window.innerWidth < 1300) {
    sidebar.classList.add("hide");
    shadowOverlay.classList.remove("show-shadow");
  } else {
    sidebar.classList.remove("hide");
  }
}

// Initializes sidebar state on page load.
window.addEventListener("DOMContentLoaded", () => {
  sidebarAutoClose();
});

// Adjusts sidebar and text visibility on screen resize.
window.addEventListener("resize", () => {
  sidebarAutoClose();
  enableTextOnResize();
});


const colorPrimary = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim();

    const colorDefault = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-default")
        .trim();

    const colorLabel = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-label")
        .trim();

    const fontFamily = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-family")
        .trim();

    const defaultOptions = {
        chart: {
            toolbar: {
                show: false,
            },
            selection: {
                enabled: false,
            },
            zoom: {
                enabled: false,
            },
            width: "100%",
            height: 220,
            offsetY: 8,
        },
        stroke: {
            lineCap: "round",
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        states: {
            hover: {
                filter: {
                    type: "none",
                },
            },
        },
    };

    const barOptions = {
        ...defaultOptions,
        chart: {
            ...defaultOptions.chart,
            type: "bar",
        },
        tooltip: {
            enabled: true,
            fillSeriesColor: true,
            style: {
                fontFamily: fontFamily,
            },
            y: {
                formatter: (value) => {
                    return `${value}K`;
                },
            },
        },
        series: [
            {
                name: "2024",
                data: [30, 50, 70, 90, 30, 50],
            },
            {
                name: "2023",
                data: [40, 20, 60, 80, 40, 20],
            },
        ],
        colors: [colorPrimary, colorDefault],
        stroke: { show: true },
        grid: {
            borderColor: "hsla(0, 0.00%, 65.90%, 0.53)",
            padding: { left: 0, right: 0, top: -16, bottom: -8 },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "15px",
                borderRadius: 4,
            },
        },
        yaxis: {
            show: true,
        },
        xaxis: {
            labels: {
                floating: false,
                show: true,
                style: {
                    fontFamily: fontFamily,
                    colors: colorLabel,
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            crosshairs: {
                show: true,
            },
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        },
    };

    // Khởi tạo biểu đồ sau khi DOM đã sẵn sàng
    const barChartElement = document.querySelector("#bar-chart");
    if (barChartElement && typeof ApexCharts !== 'undefined') {
        const barChart = new ApexCharts(
            barChartElement,
            barOptions
        );
        barChart.render();
    } else {
         console.error("Không tìm thấy phần tử '#bar-chart' hoặc thư viện ApexCharts chưa được tải.");
    }



    function loadPage(url) {
        dashboard.style.display = 'none'; // Ẩn dashboard
        iframe.style.display = 'block';   // Hiện iframe
        iframe.src = url;                  // Load trang vào iframe
    }


    const userIcon = document.getElementById("userIcon");
const userDropdown = document.getElementById("userDropdown");

userIcon.addEventListener("click", () => {
    userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
});

// Click ra ngoài sẽ đóng menu
document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.style.display = "none";
    }
});


function loadPage(page) {
    document.getElementById("content-frame").src = page;
}


