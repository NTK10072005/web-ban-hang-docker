// 1. Khai báo biến toàn cục
window.userGlobalData = null;

// 2. Hàm gọi API và lưu dữ liệu
async function checkLoginAndUpdateUI() {
  try {
    // Gọi API kiểm tra đăng nhập
    const response = await fetch("/controller/checklogin.php");
    window.userGlobalData = await response.json();

    // Cập nhật giao diện
    updateNavigation();
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng nhập:", error);
    updateNavigation(); // Vẫn cập nhật UI (hiển thị chưa đăng nhập)
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
  document.activeElement.blur();
  if (window.userGlobalData?.success) {
    window.location.href = "cart.html";
  } else {
    showMessage("Vui lòng đăng nhập để sử dụng giỏ hàng", "error"); // Nên để type là 'error' hoặc 'warning'
    return; // Dừng hàm
  }
}
// 4. Gọi hàm khi trang load
document.addEventListener("DOMContentLoaded", checkLoginAndUpdateUI);
