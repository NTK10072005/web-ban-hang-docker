function dangxuat() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    window.location.href = "logout.php";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.hash) {
    const tabId = window.location.hash.substring(1); // Bỏ dấu # ở đầu
    activateTabById(tabId);
  } else if (localStorage.getItem("activeTab")) {
    const tabId = localStorage.getItem("activeTab");
    activateTabById(tabId);
    localStorage.removeItem("activeTab");
  }
});

// JavaScript cho nút phễu lọc và form tìm kiếm nâng cao
document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.getElementById("filterBtn");
  const modal = document.getElementById("advancedSearchModal");
  const closeModal = document.querySelector(".close-modal");
  const form = document.getElementById("advancedSearchForm");
  const resetBtn = document.querySelector(".btn-reset");

  // Hiển thị modal khi click nút phễu
  filterBtn.addEventListener("click", function () {
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Ngăn cuộn trang
  });

  // Đóng modal
  function closeModalHandler() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  closeModal.addEventListener("click", closeModalHandler);

  // Đóng modal khi click bên ngoài
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModalHandler();
    }
  });

  // Đóng modal khi nhấn ESC
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "block") {
      closeModalHandler();
    }
  });

  // Xử lý form submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Thu thập dữ liệu form
    const formData = new FormData(form);
    const searchParams = new URLSearchParams();

    for (let [key, value] of formData.entries()) {
      if (value.trim() !== "") {
        searchParams.append(key, value);
      }
    }

    // Đóng modal và chuyển hướng
    closeModalHandler();
    window.location.href = "searchcotaikhoan.html?" + searchParams.toString();
  });

  // Reset form
  resetBtn.addEventListener("click", function () {
    form.reset();
  });
});

// Search functionality
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// Khi click nút tìm kiếm

// Hàm định dạng số
function formatNumber(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hàm xử lý sự kiện input
function handleInput(event) {
  let input = event.target;
  let value = input.value.replace(/[^0-9]/g, ""); // Loại bỏ các ký tự không phải là số
  input.value = formatNumber(value); // Áp dụng định dạng
}

// Gán sự kiện cho các input
window.onload = function () {
  const minPriceInput = document.querySelector('input[name="minPrice"]');
  const maxPriceInput = document.querySelector('input[name="maxPrice"]');

  minPriceInput.addEventListener("input", handleInput);
  maxPriceInput.addEventListener("input", handleInput);
};

// 1. Khai báo biến toàn cục
window.userGlobalData = null;
// Hàm tải danh sách đơn hàng
// ========== PHÂN TRANG ĐƠN HÀNG ==========
let allOrders = []; // lưu tất cả đơn hàng
let currentPage = 1;
const itemsPerPage = 5; // 5 đơn hàng / trang
async function loadOrders() {
  try {
    if (!window.userGlobalData?.success) {
      showNoOrderMessage("Vui lòng đăng nhập để xem đơn hàng");
      return;
    }

    const customerId = window.userGlobalData.data.idkhach;
    const response = await fetch(
      `/controller/donhang.php?action=khach&makh=${customerId}`,
    );
    const result = await response.json();

    if (result.success && result.data.data?.length > 0) {
      allOrders = result.data.data; // lưu toàn bộ
      currentPage = 1; // về trang đầu
      renderOrdersPage(); // vẽ trang hiện tại
    } else {
      allOrders = [];
      showNoOrderMessage("Chưa có đơn hàng nào");
    }
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error);
    showNoOrderMessage("Đã xảy ra lỗi khi tải đơn hàng");
  }
}
function renderOrdersPage() {
  const tbody = document.querySelector("#orders-tab table tbody");
  const paginationDiv = document.getElementById("ordersPagination");
  if (!tbody) return;

  // Nếu không có đơn hàng
  if (allOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">Chưa có đơn hàng nào</td></tr>`;
    if (paginationDiv) paginationDiv.innerHTML = "";
    return;
  }

  // Tính start, end
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageOrders = allOrders.slice(start, end);
  const totalPages = Math.ceil(allOrders.length / itemsPerPage);

  // Vẽ hàng trong bảng
  let html = "";
  pageOrders.forEach((order) => {
    const status = getOrderStatus(order.trangthaidon);
    const formattedPrice =
      new Intl.NumberFormat("vi-VN").format(order.tongtien) + "đ";

    // Nút Xem chi tiết
    let actionButtons = `
            <a href="chitietdonhang.php?madh=${order.madh}" class="btn btn-sm btn-info">
                <i class="fa fa-eye"></i> Xem
            </a>
        `;

    // Nếu trạng thái = 0 (Chưa thanh toán) -> thêm nút Thanh toán lại
    // ✅ Nếu đơn hàng chưa thanh toán (trạng thái = 0) -> thêm nút "Thanh toán lại"
    if (parseInt(order.trangthaidon) === 0) {
      actionButtons += `
        <a href="/controller/payment.php?amount=${order.tongtien}&action=${order.thanhtoan}&madh=${order.madh}" class="btn btn-sm btn-warning ml-1">
            <i class="fa fa-credit-card"></i> Thanh toán
        </a>
    `;
    }

    html += `
            <tr>
                <td>${order.madh}</td>
                <td>${order.ngaydat_formatted}</td>
                <td>${formattedPrice}</td>
                <td>${order.thanhtoan}</td>
                <td><span class="${status.class}">${status.text}</span></td>
                <td>${actionButtons}</td>
            </tr>
        `;
  });

  tbody.innerHTML = html;

  // Vẽ phân trang
  renderPagination(totalPages);
}
function renderPagination(totalPages) {
  const paginationDiv = document.getElementById("ordersPagination");
  if (!paginationDiv) return;
  if (totalPages <= 1) {
    paginationDiv.innerHTML = "";
    return;
  }

  let html = '<ul class="pagination justify-content-center">';

  // Nút Previous
  html += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
            </li>`;

  // Logic hiển thị các số trang + dấu ...
  const maxVisible = 5; // số nút tối đa hiển thị (chưa kể ...)
  let startPage, endPage;

  if (totalPages <= maxVisible) {
    startPage = 1;
    endPage = totalPages;
  } else {
    // luôn hiện trang đầu, trang cuối, và 3 trang xung quanh currentPage
    const around = 1; // số trang mỗi bên
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 4;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
      endPage = totalPages;
    } else {
      startPage = currentPage - around;
      endPage = currentPage + around;
    }
  }

  // Trang 1 luôn hiển thị (nếu chưa có trong khoảng startPage)
  if (startPage > 1) {
    html += `<li class="page-item ${currentPage === 1 ? "active" : ""}">
                    <a class="page-link" href="#" data-page="1">1</a>
                 </li>`;
    if (startPage > 2) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Các trang trong khoảng startPage -> endPage
  for (let i = startPage; i <= endPage; i++) {
    html += `<li class="page-item ${currentPage === i ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                 </li>`;
  }

  // Trang cuối cùng
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    html += `<li class="page-item ${currentPage === totalPages ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                 </li>`;
  }

  // Nút Next
  html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
            </li>`;

  html += "</ul>";
  paginationDiv.innerHTML = html;

  // Gắn sự kiện click
  paginationDiv.querySelectorAll(".page-link[data-page]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.dataset.page);
      if (
        !isNaN(page) &&
        page !== currentPage &&
        page >= 1 &&
        page <= totalPages
      ) {
        currentPage = page;
        renderOrdersPage();
      }
    });
  });
}
// Hàm hiển thị thông báo khi không có đơn hàng
function showNoOrderMessage(message) {
  const tbody = document.querySelector("#orders-tab table tbody");
  tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">${message}</td>
        </tr>
    `;
}

// Hàm chuyển đổi trạng thái đơn hàng sang text và class CSS
function getOrderStatus(status) {
  switch (status) {
    case 0:
      return { text: "Chưa thanh toán", class: "text-warning" };
    case 1:
      return { text: "Đã thanh toán", class: "text-success" };
    case 2:
      return { text: "Đang xử lý", class: "text-info" };
    case 3:
      return { text: "Đang giao", class: "text-primary" };
    case 4:
      return { text: "Đã giao", class: "text-dark" };
    case 5:
      return { text: "Đã hủy", class: "text-danger" };
    default:
      return { text: "Không xác định", class: "text-secondary" };
  }
}

// Hàm hiển thị danh sách đơn hàng vào bảng
function renderOrders(orders) {
  const tbody = document.querySelector("#orders-tab table tbody");
  let html = "";

  orders.forEach((order) => {
    const status = getOrderStatus(order.trangthaidon);

    const formattedPrice =
      new Intl.NumberFormat("vi-VN").format(order.tongtien) + "đ";

    // Tạo mã đơn hàng với định dạng DH + madh (thêm số 0 phía trước nếu cần)

    html += `
            <tr>
                <td>${order.madh}</td>
                <td>${order.ngaydat_formatted}</td>

                <td>${formattedPrice}</td>
                <td>${order.thanhtoan}</td>

                <td><span class="${status.class}">${status.text}</span></td>
                <td>
                    <a href="chitietdonhang.php?madh=${order.madh}" class="btn btn-sm btn-info">
                        <i class="fa fa-eye"></i> Xem
                    </a>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

// Hàm tích hợp với quy trình đăng nhập hiện tại
async function loadOrdersAfterLogin() {
  // Đợi cho đến khi có dữ liệu user
  if (!window.userGlobalData) {
    setTimeout(loadOrdersAfterLogin, 100);
    return;
  }

  // Kiểm tra nếu đang ở trang lịch sử mua hàng thì mới tải đơn hàng
  if (window.location.pathname.includes("lichsumuahang.html")) {
    loadOrders();
  }
}
// Chạy khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra xem có đang ở trang lịch sử mua hàng không
  if (window.location.pathname.includes("lichsumuahang.html")) {
    // Nếu đã có dữ liệu user, tải đơn hàng ngay
    if (window.userGlobalData) {
      loadOrders();
    } else {
      // Nếu chưa có, đợi hàm checkLoginAndUpdateUI chạy xong
      // (hàm này sẽ tự động gọi loadOrders)
    }
  }
});
// 2. Hàm gọi API và lưu dữ liệu
async function checkLoginAndUpdateUI() {
  try {
    // Gọi API kiểm tra đăng nhập
    const response = await fetch("/controller/checklogin.php");
    window.userGlobalData = await response.json();

    // Cập nhật giao diện
    updateNavigation();
    if (window.location.pathname.includes("lichsumuahang.html")) {
      loadOrders();
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng nhập:", error);
    updateNavigation(); // Vẫn cập nhật UI (hiển thị chưa đăng nhập)
    if (window.location.pathname.includes("lichsumuahang.html")) {
      loadOrders();
    }
  }
}

// 3. Hàm cập nhật navigation
function updateNavigation() {
  const dropdownToggle = document.querySelector(".nav-link.dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (!dropdownToggle || !dropdownMenu) return;

  if (window.userGlobalData?.success) {
    // ĐÃ đăng nhập
    // Thay "Huynh Duc" bằng tên thật từ API
    dropdownToggle.innerHTML = `<i class="fas fa-user"></i> &nbsp;${window.userGlobalData.data.tenkhach}`;

    // Hiển thị đầy đủ menu (giữ nguyên HTML gốc)
    dropdownMenu.innerHTML = `
            <a href="thongtintaikhoan.html" class="dropdown-item"><i class="fa fa-id-card me-2"></i>  &nbsp;Thông tin</a>
            <a href="lichsumuahang.html" class="dropdown-item"> <i class="fa fa-history me-2"></i>&nbsp;Lịch sử mua hàng</a>
            <a href="controller/logout.php" class="dropdown-item"> <i class="fa fa-sign-out-alt me-2"></i>&nbsp;Đăng xuất</a>
        `;
  } else {
    // CHƯA đăng nhập
    // Thay bằng "Taikhoan"
    dropdownToggle.innerHTML = '<i class="fas fa-user"></i> &nbsp;Tài Khoản';

    // Chỉ hiển thị mục Đăng nhập
    dropdownMenu.innerHTML = `
            <a href="login.html" class="dropdown-item"><i class="fa fa-sign-in-alt me-2"></i>&nbsp;Đăng nhập</a>
            <a href="register.html" class="dropdown-item"> <i class="fa fa-user-plus"></i>&nbsp;&nbsp;Đăng ký</a>

        `;
  }
}
function check() {
  event.preventDefault();
  if (window.userGlobalData?.success) {
    window.location.href = "cart.html";
  } else {
    showMessage("Vui lòng đăng nhập để sử dụng giỏ hàng", "error"); // Nên để type là 'error' hoặc 'warning'
    return; // Dừng hàm
  }
}
// 4. Gọi hàm khi trang load
document.addEventListener("DOMContentLoaded", checkLoginAndUpdateUI);

// FIX HEADER HEIGHT AND POSITION
document.addEventListener("DOMContentLoaded", function () {
  // Đợi một chút để đảm bảo các phần tử đã load xong
  setTimeout(function () {
    fixHeaderPosition();
  }, 100);

  // Cũng fix lại khi resize window
  window.addEventListener("resize", fixHeaderPosition);
});

function fixHeaderPosition() {
  const nav = document.querySelector(".nav");
  const bottomBar = document.querySelector(".bottom-bar");

  if (!nav || !bottomBar) return;

  // 1. Lấy chiều cao chính xác của nav
  const navHeight = nav.offsetHeight;

  // 2. Đặt bottom-bar sát dưới nav
  bottomBar.style.top = navHeight + "px";

  // 3. Tính tổng chiều cao và đặt padding cho body
  const totalHeight = navHeight + bottomBar.offsetHeight;
  document.body.style.paddingTop = totalHeight + "px";

  console.log(
    "Header fixed - Nav height:",
    navHeight,
    "Total height:",
    totalHeight,
  );
}
