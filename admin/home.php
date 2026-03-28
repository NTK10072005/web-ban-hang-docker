<?php
session_start();
// Kiểm tra xem biến session 'idkhach' có tồn tại không
if (!isset($_SESSION['idkhach'])) {
    // Nếu không tồn tại, chuyển hướng về trang đăng nhập
    header("Location: login.html"); // Thay 'login.php' bằng đường dẫn trang đăng nhập thực tế
    exit(); // Dừng thực thi script để đảm bảo chuyển hướng
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="icon" type="image/png" href="../img/ryicon.jpg">
  <title>BookStore - Quản lý khách hàng</title>
  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
  <link href="assets/css/pure-style-optimized.css" rel="stylesheet" />
  <link href="assets/css/home.css" rel="stylesheet" />
</head>

<body>

  <!-- SIDEBAR -->
  <aside style="position: fixed; top: 0; left: 0; z-index: 1000; width: 250px; height: 100vh; background: linear-gradient(195deg, #42424a, #191919); color: white; transition: all 0.3s ease; box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.15);" id="sidenav-main">
    <div style="padding: 1.5em 1rem;">
      <a href="#" target="_blank" style="display: flex; align-items: center; font-weight: 600; color: white; text-decoration: none;">
        <span style="margin-left: 0.25rem; font-weight: 700;">TRUNG TÂM ĐIỀU KHIỂN</span>
      </a>
    </div>
    <hr style="width: 100%; border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 1rem 0;">
    <div style="width: 100%; overflow-y: auto; height: 75vh;">
      <ul style="list-style: none; padding: 0; margin: 0;">
       <li>
          <button class="sidebar-btn" onclick="loaddatakhachhang(this)">
            <i class="material-icons">person</i> Quản lý khách hàng
          </button>
        </li>
        <li>
          <button class="sidebar-btn" onclick="loaddatadanhmuc(this)">
            <i class="material-icons">category</i> Quản lý danh mục
          </button>
        </li>
        <li>
          <button class="sidebar-btn" onclick="loaddatadonhang(this)">
            <i class="material-icons">weekend</i> Quản lý đơn hàng
          </button>
        </li>
        <li>
          <button class="sidebar-btn" onclick="loaddatasanpham(this)">
            <i class="material-icons">table_view</i> Quản lý sản phẩm
          </button>
        </li>
        <li>
          <button class="sidebar-btn" onclick=" loaddataphieunhap(this)">
            <i class="material-icons">inventory_2</i> Quản lý nhập hàng
          </button>
        </li>
        <li>
          <button class="sidebar-btn" onclick="loaddatagiaban(this)">
            <i class="material-icons">attach_money</i> Quản lý giá bán
          </button>
        </li>
        <li>
          <button class="sidebar-btn" onclick="loaddatatonkho(this)">
            <i class="material-icons">inventory</i> Quản lý tồn kho
          </button>
        </li>
      </ul>
    </div>
    <div style="position: absolute; width: 100%; bottom: 0; padding: 1rem;">
      <a href="logout.php"><button class="logout-btn" onclick="">Đăng xuất</button></a>
    </div>
  </aside>

  <!-- MAIN -->
  <main style="margin-left: 250px; min-height: 100vh; padding: 1.5rem;">
  </main>
     <div id="notification" style="position: fixed; top: 20px; right: 20px; max-width: 300px; z-index: 1000; display: none;">
            <div style="padding: 1rem; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px;">
                <i class="material-icons-round" id="notification-icon" style="font-size: 24px;"></i>
                <div>
                    <strong id="notification-title"></strong>
                    <p id="notification-message" style="margin: 0; font-size: 14px;"></p>
                </div>
            </div>
        </div>
        <script src="assets/js/manager.js"></script>

</body>
</html>