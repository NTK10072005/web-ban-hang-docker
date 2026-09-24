<?php
// 1. Kiểm tra và lấy madh từ GET
$madh = isset($_GET['madh']) ? intval($_GET['madh']) : 0;



// 3. Gọi API để lấy chi tiết đơn hàng
$api_url = "/controller/donhang.php?action=chitiet&madh=" . $madh;
$json_data = file_get_contents($api_url);



// 4. Decode JSON
$result = json_decode($json_data, true);

// 5. Kiểm tra kết quả
if (!$result || !$result['success'] || empty($result['data'])) {
    echo "<script>alert('Không tìm thấy chi tiết đơn hàng!'); window.location.href = 'lichsumuahang.html';</script>";
    exit();
}

// 6. Lấy dữ liệu
$order = $result['data'];
$order_details = $order['chitiet'];
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Chi tiết đơn hàng #<?php echo $madh; ?> - BOOK STORE</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="eCommerce HTML Template Free Download" name="keywords">
    <meta content="eCommerce HTML Template Free Download" name="description">

    <!-- Favicon -->
    <link href="img/tieude.jpg" rel="icon">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400|Source+Code+Pro:700,900&display=swap" rel="stylesheet">

    <!-- CSS Libraries -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="lib/slick/slick.css" rel="stylesheet">
    <link href="lib/slick/slick-theme.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="css/style.css" rel="stylesheet">
    <link href="css/fix.css" rel="stylesheet">
    <style>
        /* Container tổng cho vùng search */
        .search-container {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
        }

        /* Thanh search bên trái */
        .search {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
        }

        .search input {
            width: 100%;
            padding-right: 30px; /* Chừa chỗ cho nút search sát rìa */
        }

        .search button {
            position: absolute !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            z-index: 2;
            background: transparent !important;
            border: none !important;
            padding: 0 18px !important;
            color: #ff6f61 !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 0 !important;
            cursor: pointer;
            margin: 0 !important;
        }

        .search button:hover {
            background: #ff6f61 !important;
            color: white !important;
        }

        .search button i {
            font-size: 16px;
            line-height: 1;
        }

        /* Nút phễu bên phải thanh search */
        .filter-button-container {
            flex-shrink: 0;
        }

        /* Nút phễu lọc */
        .filter-btn {
            width: 45px;
            height: 45px;
            border-radius: 8px;
            background: white;
            border: 2px solid #28a745;
            color: #28a745;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .filter-btn:hover {
            background: #28a745;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        /* Modal tìm kiếm nâng cao */
        .advanced-search-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
        }

        .modal-content {
                background-color: white;
            margin: 3% auto;
            padding: 0;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }

        .close-modal:hover {
            color: #333;
        }

        .modal-body {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }

        .price-range {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .price-range input {
            width: calc(50% - 5px);
        }

        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        .btn-search {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-reset {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }
        
        /* Căn giữa cho phần tổng kết đơn hàng */
        .table tfoot tr td {
            text-align: center !important;
        }
        
        /* Căn giữa tiêu đề card */
        .card-header.text-center h4 {
            margin: 0;
            width: 100%;
        }
        
        /* Căn giữa toàn bộ nội dung bảng */
        .table {
            text-align: center;
        }

        .table thead th,
        .table tbody td,
        .table tfoot td {
            text-align: center;
            vertical-align: middle;
        }

        /* Đảm bảo hình ảnh trong bảng cũng được căn giữa */
        .table td img {
            display: block;
            margin: 0 auto;
        }

        /* Căn giữa tiêu đề các cột */
        .table th {
            text-align: center;
        }

        /* Đảm bảo các ô trong tfoot căn giữa hoàn toàn */
        .table tfoot tr td {
            text-align: center !important;
        }
        
        /* Định dạng giá tiền */
        .price {
            text-align: right;
            white-space: nowrap;
        }
        /* ================== FIXED HEADER - NO GAP - NO SCROLL ================== */
.nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    margin: 0 !important;
    padding: 0 !important;
}

.bottom-bar {
    position: fixed;
    top: 45px; /* Chiều cao ước tính của .nav */
    left: 0;
    width: 100%;
    z-index: 999;
    margin: 0 !important;
    padding: 0 !important;
    border-top: none !important;
}

/* Đảm bảo body có padding để nội dung không bị che */
body {
    padding-top: 115px !important; /* 45px (nav) + 70px (bottom-bar) */
}
 /* ==================== QUICK VIEW STYLES ==================== */
/* QUICK VIEW */
.qv-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .45);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.qv-card {
    background: #fff;
    border-radius: 14px;
    max-width: 980px;
    width: calc(100% - 32px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, .25);
    position: relative;
    padding: 28px;
}

.qv-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #1e6bd6;
    color: #1e6bd6;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
}

.qv-body {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 24px;
    align-items: start;
}

.qv-img {
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    display: grid;
    place-items: center;
}

.qv-img img {
    max-width: 100%;
    height: auto;
    display: block;
}

.qv-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.qv-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 6px;
}

.qv-meta {
    margin: 8px 0 14px;
    color: #1e6bd6;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
}

.qv-price {
    font-size: 28px;
    font-weight: 800;
    color: #ff6f61;
    margin: 0 0 14px;
}

.qv-desc {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 12px;
}

.qv-note {
    color: #1e6bd6;
    margin: 8px 0 18px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.qv-meta-container {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.qv-meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.qv-meta-item i {
    color: #1e6bd6;
    width: 20px;
}

.qv-meta-item span {
    font-weight: 500;
}

.qv-meta-item em {
    color: #333;
}

.qv-add {
    margin-top: 10px;
    width: 100%;
    padding: 12px;
    background: #1e6bd6;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 18px;
}

.qv-add i {
    font-size: 18px;
}
    </style>
</head>

<body>
    <!-- Header Start -->
    
    
    <div class="nav">
            <div class="container-fluid">
                <nav class="navbar navbar-expand-md bg-dark navbar-dark">
                  <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <div class="navbar-nav mr-auto">
                            <a href="index.html" class="nav-item nav-link active">Trang chủ</a>
                        </div>
                        <div class="navbar-nav ml-auto">
                            <div class="nav-item dropdown">
                                <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown"> <i class="fas fa-user"></i> &nbsp;Huynh Duc</a>
                                <div class="dropdown-menu">
                                    <a href="thongtintaikhoan.html" class="dropdown-item"><i class="fa fa-id-card me-2"></i>  &nbsp;Thông tin</a>
                                    <a href="lichsumuahang.html" class="dropdown-item"> <i class="fa fa-history me-2"></i>&nbsp;Lịch sử mua hàng</a>

                                    <a href="login.html" class="dropdown-item"> <i class="fa fa-sign-out-alt me-2"></i>&nbsp;Đăng xuất</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    <div class="bottom-bar">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-md-3">
                    <div class="logo">
                        <a href="index.html">
                            <img src="img/logo.png" alt="Logo">
                        </a>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="search-container">
                        <div class="search">
                            <input type="text" id="searchInput" placeholder="Tìm kiếm sản phẩm">
                            <button id="searchBtn"><i class="fa fa-search"></i></button>
                        </div>
                        
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="user">
                        <a href="cart.html" class="btn cart">
                            <i class="fa fa-shopping-cart"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Header End -->

    <!-- Breadcrumb Start -->
    <div class="breadcrumb-wrap">
        <div class="container-fluid">
            <ul class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Trang chủ</a></li>
                <li class="breadcrumb-item"><a href="lichsumuahang.html">Lịch sử mua hàng</a></li>
                <li class="breadcrumb-item active">Chi tiết đơn hàng #<?php echo $madh; ?></li>
            </ul>
        </div>
    </div>
    <!-- Breadcrumb End -->

    <!-- Order Detail Start -->
    <div class="container-fluid pt-4 pb-4">
    <div class="row">
            <!-- Sidebar Start -->
            <!-- Sidebar End -->

            <!-- Order Detail Content Start -->
            <div class="col-md-8 offset-md-2">
                <div class="card">
                    <div class="card-header text-center">
                        <h4>Chi tiết đơn hàng #<?php echo $madh; ?></h4>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5>Thông tin đơn hàng</h5>
                                <p><strong>Mã đơn hàng:</strong> <?php echo $order['madh']; ?></p>
                                <p><strong>Ngày đặt:</strong> <?php echo date('d/m/Y H:i', strtotime($order['ngaydat'])); ?></p>
                                <p><strong>Phương thức thanh toán:</strong> <?php echo $order['thanhtoan']; ?></p>
                                <p><strong>Trạng thái:</strong>
                                    <span class="${getOrderStatus(<?php echo $order['trangthaidon']?>).class}" id="trangthaidon">
                                    </span>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <h5>Thông tin khách hàng</h5>
                                <p><strong>Họ tên:</strong> <?php echo $order['tenkhachhang']; ?></p>
                                <p><strong>Email:</strong> <?php echo $order['email']; ?></p>
                                <p><strong>Số điện thoại:</strong> <?php echo $order['sdt']; ?></p>
                                <p><strong>Địa chỉ: </strong> <?php echo $order['diachi']; ?></p>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Hình ảnh</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Giảm giá(%)</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                    $total_products = 0;
                                    $total_amount = 0;
                                    foreach ($order_details as $item): 
                                        $total_products += $item['soluong'];
                                        $total_amount += $item['thanhtien'];
                                    ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($item['tensp']); ?></td>
                                        <td>
                                            <img src="<?php echo $item['link']; ?>" alt="<?php echo htmlspecialchars($item['tensp']); ?>" style="max-width: 50px;">
                                        </td>
                                        <td class="price"><?php echo number_format($item['gia'], 0, ',', '.') . 'đ'; ?></td>
                                        <td><?php echo $item['soluong']; ?></td>
                                        <td><?php echo $item['giamgia']; ?></td>
                                        <td class="price"><?php echo number_format($item['thanhtien'], 0, ',', '.') . 'đ'; ?></td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                                
                                <tfoot>
                                    <tr>
                                        <td colspan="3" class="text-center"><strong>Tiền hàng:</strong></td>
                                        <td colspan="2" class="text-center"><strong><?php echo number_format($order['tongtien'], 0, ',', '.') . 'đ'; ?></strong></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" class="text-center"><strong>Phí vận chuyển:</strong></td>
                                        <td colspan="2" class="text-center"><strong>Freeship</strong></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" class="text-center"><strong>Tổng cộng:</strong></td>
                                        <td colspan="2" class="text-center"><strong><?php echo number_format($order['tongtien'], 0, ',', '.') . 'đ'; ?></strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div class="text-right mt-4 d-flex justify-content-end">
                            <a href="lichsumuahang.html" class="btn btn-secondary">Quay về</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Order Detail End -->

    <!-- Form tìm kiếm nâng cao -->
<div id="advancedSearchModal" class="advanced-search-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Tìm kiếm nâng cao</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="advancedSearchForm">
                    <div class="form-group">
                        <label>Tên sản phẩm:</label>
                        <input id="tensp" type="text" name="keyword" placeholder="Nhập tên sản phẩm tìm kiếm...">
                    </div>

                  
<div class="form-group">
    <label>Danh mục:</label>
    <!-- Thêm id="advancedCategorySelect" -->
    <select name="category" id="advancedCategorySelect">
        <option value="">Tất cả</option>
        <!-- Các option khác sẽ được load từ API -->
    </select>
</div>
                    <div class="form-group">
                        <label>Khoảng giá:</label>
                        <div class="price-range">
                            <input type="text" name="minPrice" placeholder="Từ">
                            <span>-</span>
                            <input type="text" name="maxPrice" placeholder="Đến">
                        </div>
                    </div>
                    <div class="form-actions">
                                              <button id="search" type="submit" class="btn-search">Tìm kiếm</button>

                        <button type="button" class="btn-reset">Đặt lại</button>
                    </div>
                </form>
            </div>
        </div>
    </div>



     <div class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-md-6">
          <div class="footer-widget">
            <h2>Liên hệ</h2>
            <div class="contact-info">
              <p><i class="fa fa-map-marker"></i>273 An Dương Vương Phường 3 Quận 5 TPHCM</p>
              <p><i class="fa fa-envelope"></i>info@example.com</p>
              <p><i class="fa fa-phone"></i>+012-345-67890</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="footer-widget">
            <h2>Theo dõi chúng tôi</h2>
            <div class="contact-info">
              <div class="social">
                <a href=""><i class="fab fa-twitter"></i></a>
                <a href=""><i class="fab fa-facebook-f"></i></a>
                <a href=""><i class="fab fa-linkedin-in"></i></a>
                <a href=""><i class="fab fa-instagram"></i></a>
                <a href=""><i class="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="footer-widget">
            <h2>Thông tin công ty</h2>
            <ul>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản & Điều kiện</a></li>
            </ul>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="footer-widget">
            <h2>Thông tin mua hàng</h2>
            <ul>
              <li><a href="#">Chính sách thanh toán</a></li>
              <li><a href="#">Chính sách vận chuyển</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row payment align-items-center">
        <div class="col-md-6">
          <div class="payment-method">
            <h2>Chúng tôi chấp nhận:</h2>
            <img src="img/payment-method.png" alt="Payment Method" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="payment-security">
            <h2>Được bảo mật bởi:</h2>
            <img src="img/godaddy.svg" alt="Payment Security" />
            <img src="img/norton.svg" alt="Payment Security" />
            <img src="img/ssl.svg" alt="Payment Security" />
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Back to Top -->
    <a href="#" class="back-to-top"><i class="fa fa-chevron-up"></i></a>

    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>
    <script src="lib/easing/easing.min.js"></script>
    <script src="lib/slick/slick.min.js"></script>
    <!-- Template Javascript -->
    <script src="js/main.js"></script>
     <script>
         function getOrderStatus(status) {
    switch(status) {
        case 0:
            return { text: 'Chưa thanh toán', class: 'text-warning' };
        case 1:
            return { text: 'Đã thanh toán', class: 'text-info' };
        case 2:
            return { text: 'Đang xử lý', class: 'text-info' };
        case 3:
            return { text: 'Đang giao', class: 'text-success' };
        case 4:
            return { text: 'Đã giao', class: 'text-danger' };
        case 5:
            return { text: 'Đã hủy', class: 'text-danger' };
        default:
            return { text: 'Không xác định', class: 'text-secondary' };
    }
}
document.getElementById('trangthaidon').innerHTML=getOrderStatus(<?php echo $order['trangthaidon']?>).text;

        // 1. Khai báo biến toàn cục
window.userGlobalData = null;

// 2. Hàm gọi API và lưu dữ liệu
async function checkLoginAndUpdateUI() {
    try {
        // Gọi API kiểm tra đăng nhập
        const response = await fetch('/controller/checklogin.php');
        window.userGlobalData = await response.json();
        
        // Cập nhật giao diện
        updateNavigation();
        
    } catch (error) {
        console.error('Lỗi khi kiểm tra đăng nhập:', error);
        updateNavigation(); // Vẫn cập nhật UI (hiển thị chưa đăng nhập)
    }
}

// 3. Hàm cập nhật navigation
function updateNavigation() {
    const dropdownToggle = document.querySelector('.nav-link.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
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
function check(){
    event.preventDefault();
     if (window.userGlobalData?.success) {
          window.location.href="cart.html";
     }
     else{
         showMessage('Vui lòng đăng nhập để sử dụng giỏ hàng', 'error'); // Nên để type là 'error' hoặc 'warning'
        return; // Dừng hàm
     }
}
// 4. Gọi hàm khi trang load
document.addEventListener('DOMContentLoaded', checkLoginAndUpdateUI);
   
    </script>
    <script>
        
        function dangxuat() {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                window.location.href = 'logout.php';
            }
        }

        function activateTab(tabId) {
            localStorage.setItem('activeTab', tabId);
        }
        // JavaScript cho nút phễu lọc và form tìm kiếm nâng cao
        document.addEventListener('DOMContentLoaded', function() {
            const filterBtn = document.getElementById('filterBtn');
            const modal = document.getElementById('advancedSearchModal');
            const closeModal = document.querySelector('.close-modal');
            const form = document.getElementById('advancedSearchForm');
            const resetBtn = document.querySelector('.btn-reset');

            // Hiển thị modal khi click nút phễu
            filterBtn.addEventListener('click', function() {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Ngăn cuộn trang
            });

            // Đóng modal
            function closeModalHandler() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            closeModal.addEventListener('click', closeModalHandler);

            // Đóng modal khi click bên ngoài
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModalHandler();
                }
            });

            // Đóng modal khi nhấn ESC
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && modal.style.display === 'block') {
                    closeModalHandler();
                }
            });

            // Xử lý form submit
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Thu thập dữ liệu form
                const formData = new FormData(form);
                const searchParams = new URLSearchParams();

                for (let [key, value] of formData.entries()) {
                    if (value.trim() !== '') {
                        searchParams.append(key, value);
                    }
                }

                // Đóng modal và chuyển hướng
                closeModalHandler();
                window.location.href = 'searchcotaikhoan.html?' + searchParams.toString();
            });

            // Reset form
            resetBtn.addEventListener('click', function() {
                form.reset();
            });
        });

        // Search functionality
        const searchBtn = document.getElementById("searchBtn");
        const searchInput = document.getElementById("searchInput");

       
    </script>
    <script>
    function initializeSearch() {
        const searchBtn = document.getElementById("searchBtn");
        const searchBtn2 = document.getElementById("search");

        const searchInput = document.getElementById("searchInput");

        // Tạo modal nếu chưa có
        if (!document.getElementById('searchModal')) {
            // Tìm phần modalHTML trong hàm initializeSearch() và sửa như sau:

const modalHTML = `
    <div id="searchModal" class="search-modal" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
    ">
        <div class="modal-content" style="
            background: white;
            width: 90%;
            max-width: 1200px;
            max-height: 80vh;
            border-radius: 10px;
            padding: 20px;
            overflow-y: auto;
        ">
            <div style="
                position: relative; /* Quan trọng: để nút đóng định vị theo đây */
                display: flex;
                justify-content: center; /* Căn giữa theo chiều ngang */
                align-items: center; /* Căn giữa theo chiều dọc */
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                min-height: 50px; /* Chiều cao tối thiểu */
            ">
                <h3 style="
                    margin: 0;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                ">Kết quả tìm kiếm</h3>
                <button id="closeSearchModalBtn" style="
                    position: absolute; /* Đặt vị trí tuyệt đối */
                    right: 0; /* Nằm sát bên phải */
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
            <div id="searchResults" style="min-height: 200px;"></div>
        </div>
    </div>
`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Sự kiện đóng modal - SỬ DỤNG ID RIÊNG
            document.getElementById('closeSearchModalBtn').addEventListener('click', () => {
                document.getElementById('searchModal').style.display = 'none';
            });
            
            document.getElementById('searchModal').addEventListener('click', (e) => {
                if (e.target.id === 'searchModal') {
                    document.getElementById('searchModal').style.display = 'none';
                }
            });
            
            // ESC để đóng modal tìm kiếm
            document.addEventListener('keydown', function(e) {
                const searchModal = document.getElementById('searchModal');
                if (e.key === 'Escape' && searchModal.style.display === 'flex') {
                    searchModal.style.display = 'none';
                }
            });
        }
        

        // Hàm gọi API và hiển thị kết quả
       async function performSearch() {
    let keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) return;

    // Chuyển hướng sang trang mới kèm tham số
    window.location.href = `ketquatimkiem.php?action=search&keywords=${encodeURIComponent(keyword)}`;
}

// Thay thế hàm tìm kiếm nâng cao
async function performSearch2() {
    const tensp = document.getElementById('tensp').value;
    const category = document.querySelector('select[name="category"]').value;
    let giatu = document.querySelector('input[name="minPrice"]').value.replace(/\./g, '');
    let giaden = document.querySelector('input[name="maxPrice"]').value.replace(/\./g, '');

    // Tạo URL query string
    const params = new URLSearchParams({
        action: 'searchnangcao',
        category: category,
        tensp: tensp,
        giatu: giatu,
        giaden: giaden
    });

    window.location.href = `ketquatimkiem.php?${params.toString()}`;
}
        // Biến toàn cục lưu kết quả tìm kiếm
        let searchResults = [];
        let currentPage = 1;
        const itemsPerPage = 8;

        // Hiển thị kết quả với phân trang
        function displaySearchResults(products) {
            searchResults = products;
            currentPage = 1;
            renderResults();
        }

        // Render kết quả theo trang
        function renderResults() {
            const resultsDiv = document.getElementById('searchResults');
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageProducts = searchResults.slice(start, end);
              const categoryMapping = {
            'Thieunhi': 'Thiếu nhi',
            'Tamly': 'Tâm lý',
            'Tongiao': 'Tôn giáo',
            'Lichsu': 'Lịch sử',
            'Vanhoc': 'Văn học'
        };
            if (pageProducts.length === 0) {
                resultsDiv.innerHTML = '<p style="text-align: center; padding: 50px;">Không có sản phẩm nào.</p>';
                return;
            }

            // Tạo HTML cho sản phẩm
            let html = `<div style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            ">`;
          
            pageProducts.forEach(product => {
                const price = parseInt(product.gia).toLocaleString('vi-VN') + ' đ';
                const category =categoryMapping[product.danhmuc];
                
                
                html += `
                    <div style="
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                        background: white;
                    ">
                        <div style="height: 150px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <img src="${product.link}" alt="${product.tensp}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <h4 style="margin: 0 0 10px 0; font-size: 16px; height: 40px; overflow: hidden; line-height: 1.3;">${product.tensp}</h4>
                        <p style="color: #ff6f61; font-weight: bold; margin: 0 0 5px 0;">${price}</p>
                        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">${category}</p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button onclick="addToCart('${product.masp}'); event.stopPropagation();" style="
                                background: #ff6f61;
                                color: white;
                                border: none;
                                padding: 8px 15px;
                                border-radius: 4px;
                                cursor: pointer;
                            ">Thêm giỏ hàng</button>
                            <button onclick="openQuickViewForSearchResult('${product.masp}')" style="
                                background: #4CAF50;
                                color: white;
                                border: none;
                                padding: 8px 15px;
                                border-radius: 4px;
                                cursor: pointer;
                            ">Xem chi tiết</button>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            
            // Thêm phân trang nếu có nhiều sản phẩm
            if (searchResults.length > itemsPerPage) {
                const totalPages = Math.ceil(searchResults.length / itemsPerPage);
                
                html += `<div style="
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                ">`;
                
                // Nút trang trước
                if (currentPage > 1) {
                    html += `<button onclick="goToPage(${currentPage - 1})" style="
                        padding: 8px 15px;
                        border: 1px solid #ddd;
                        background: white;
                        cursor: pointer;
                        border-radius: 4px;
                    "><<</button>`;
                }
                
                // Các số trang
                for (let i = 1; i <= totalPages; i++) {
                    if (i === currentPage) {
                        html += `<button style="
                            padding: 8px 15px;
                            border: 1px solid #ff6f61;
                            background: #ff6f61;
                            color: white;
                            cursor: pointer;
                            border-radius: 4px;
                        ">${i}</button>`;
                    } else {
                        html += `<button onclick="goToPage(${i})" style="
                            padding: 8px 15px;
                            border: 1px solid #ddd;
                            background: white;
                            cursor: pointer;
                            border-radius: 4px;
                        ">${i}</button>`;
                    }
                }
                
                // Nút trang sau
                if (currentPage < totalPages) {
                    html += `<button onclick="goToPage(${currentPage + 1})" style="
                        padding: 8px 15px;
                        border: 1px solid #ddd;
                        background: white;
                        cursor: pointer;
                        border-radius: 4px;
                    ">>></button>`;
                }
                
                html += '</div>';
            }
            
            resultsDiv.innerHTML = html;
        }

        // Hàm mở Quick View cho sản phẩm từ kết quả tìm kiếm
        window.openQuickViewForSearchResult = async function(productId) {
            // KHÔNG đóng modal tìm kiếm
            // Tạo một card ảo để sử dụng hàm openQuickViewFromCard
            const fakeCard = document.createElement('div');
            fakeCard.setAttribute('data-product-id', productId);
            
            // Mở Quick View bằng hàm đã có
            openQuickViewFromCard(fakeCard);
        };

        // Hàm chuyển trang
        window.goToPage = function(page) {
            currentPage = page;
            renderResults();
            document.getElementById('searchResults').scrollTop = 0;
        };

        // Gắn sự kiện
        if (searchBtn) {
            searchBtn.addEventListener("click", (e) => {
                e.preventDefault();
                performSearch();
            });
        }
          if (searchBtn2) {
            searchBtn2.addEventListener("click", (e) => {
                e.preventDefault();
                performSearch2();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    }
    
    // Gọi hàm initializeSearch khi trang tải xong
    document.addEventListener('DOMContentLoaded', function() {
        initializeSearch();
    });
    function showMessage(message, type = 'success') {
    // Tạo thông báo nếu chưa có
    let messageDiv = document.getElementById('updateMessage');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'updateMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        document.body.appendChild(messageDiv);
    }

    // Thiết lập màu sắc theo loại thông báo
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }

    // Thêm nút đóng
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button id="closeMessage" style="
            background: none;
            border: none;
            color: inherit;
            font-size: 18px;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
        ">&times;</button>
    `;

    // Hiển thị thông báo
    messageDiv.style.display = 'flex';

    // Sự kiện đóng thông báo
    document.getElementById('closeMessage').addEventListener('click', () => {
        messageDiv.style.display = 'none';
    });

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        if (messageDiv.style.display !== 'none') {
            messageDiv.style.display = 'none';
        }
    }, 5000);
}

        // 9. Hàm thêm vào giỏ hàng (mẫu)
        async function addToCart(productId) {
           event.preventDefault();
           if (!window.userGlobalData || !window.userGlobalData.success) {
        showMessage('Vui lòng đăng nhập để sử dụng giỏ hàng', 'error'); // Nên để type là 'error' hoặc 'warning'
        return; // Dừng hàm
    }
            const magio =   window.userGlobalData.data.idkhach;
            const formData = new FormData();
            formData.append('magio',magio);
            formData.append('masp',productId);
            formData.append('soluong',1);
             try {
        // Gửi request đến API (thay YOUR_API_URL bằng URL thực tế)
        const response =  await fetch('/controller/cart.php', {
            method: 'POST',
            body: formData
        });
        
        const result =  await response.json();
        
        // Xử lý kết quả
        if (result.success) {
            showMessage('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            
            // Đợi 1.5 giây rồi chuyển hướng
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1500);
        } else {
            // Hiển thị thông báo lỗi từ server
            const errorMessage = result.message || 'Cập nhật thất bại!';
            showMessage(`❌ ${errorMessage}`, 'error');
        }
        
    } catch (error) {
        // Xử lý lỗi
        console.error('Error:', error);
        showMessage(`❌ Đã xảy ra lỗi: ${error.message}`, 'error');
    }

        }
        
// ==================== UTILITY FUNCTIONS ====================
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Category mapping


// ==================== QUICK VIEW FUNCTIONS ====================
function ensureQuickViewRoot() {
    let root = document.querySelector('.qv-overlay');
    if (root) return root;
    root = document.createElement('div');
    root.className = 'qv-overlay';
    document.body.appendChild(root);
    return root;
}

async function openQuickViewFromCard(card) {
    const productId = card.dataset.productId;

    if (!productId) {
        console.error('Product ID not found');
        return;
    }

    try {
        // Fetch product details from API
        const response = await fetch(`controller/product.php?masp=${productId}`);
        const data = await response.json();

        if (!data.success) {
            console.error('Failed to fetch product details:', data.message);
            return;
        }

        const product = data.data;
        const imageUrl = product.link;
         const categoryMapping = {
                    'Thieunhi': 'Thiếu nhi',
                    'Tamly': 'Tâm lý',
                    'Tongiao': 'Tôn giáo',
                    'Lichsu': 'Lịch sử',
                    'Vanhoc': 'Văn học'
                };
        const danhmuc = categoryMapping[product.danhmuc];

        const root = ensureQuickViewRoot();
        root.innerHTML = `
            <div class="qv-card" role="dialog" aria-modal="true" aria-label="Xem nhanh sản phẩm">
                <button class="qv-close" aria-label="Đóng">✖</button>
                <div class="qv-body">
                    <div class="qv-img">
                        <img src="${imageUrl}" alt="${product.tensp}" onerror="this.src='img/default-book.jpg'">
                    </div>
                    <div class="qv-content">
                        <h2 class="qv-title">${product.tensp}</h2>
                        <div class="qv-price">Giá: ${formatPrice(product.gia)}</div>
                        <div class="qv-desc">${product.mota || 'Chưa có mô tả cho sản phẩm này.'}</div>
                        
                        <div class="qv-meta-container">
                            <div class="qv-meta-item">
                                <i class="fas fa-user"></i>
                                <span>Tác giả: <em>${product.tacgia}</em></span>
                            </div>
                            <div class="qv-meta-item">
                                <i class="fas fa-book"></i>
                                <span>Thể loại: <em>${danhmuc}</em></span>
                            </div>
                            <button class="qv-add" onclick="addToCart('${productId}')">
                                <i class="fa fa-shopping-cart"></i>
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        root.style.display = 'flex';

        const close = () => { 
            root.style.display = 'none'; 
            root.innerHTML = ''; 
        };
        
        root.addEventListener('click', (e) => { 
            if (e.target === root) close(); 
        });
        
        root.querySelector('.qv-close').addEventListener('click', close);
        
        const onEsc = (e) => { 
            if (e.key === 'Escape') { 
                close(); 
                document.removeEventListener('keydown', onEsc); 
            } 
        };
        document.addEventListener('keydown', onEsc);

    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Ghi đè hàm openQuickViewForSearchResult
window.openQuickViewForSearchResult = async function(productId) {
    // Tạo một card ảo để sử dụng hàm openQuickViewFromCard
    const fakeCard = document.createElement('div');
    fakeCard.setAttribute('data-product-id', productId);
    
    // Mở Quick View bằng hàm đã có
    openQuickViewFromCard(fakeCard);
};

// Khởi tạo
ensureQuickViewRoot();

    
</script>
    <script>
        // Hàm định dạng số
        function formatNumber(value) {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        // Hàm xử lý sự kiện input
        function handleInput(event) {
            let input = event.target;
            let value = input.value.replace(/[^0-9]/g, '');  // Loại bỏ các ký tự không phải là số
            input.value = formatNumber(value);  // Áp dụng định dạng
        }

        // Gán sự kiện cho các input
        window.onload = function() {
            const minPriceInput = document.querySelector('input[name="minPrice"]');
            const maxPriceInput = document.querySelector('input[name="maxPrice"]');
            
            minPriceInput.addEventListener('input', handleInput);
            maxPriceInput.addEventListener('input', handleInput);
        };
        // FIX HEADER HEIGHT AND POSITION
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để đảm bảo các phần tử đã load xong
    setTimeout(function() {
        fixHeaderPosition();
    }, 100);
    
    // Cũng fix lại khi resize window
    window.addEventListener('resize', fixHeaderPosition);
});

function fixHeaderPosition() {
    const nav = document.querySelector('.nav');
    const bottomBar = document.querySelector('.bottom-bar');
    
    if (!nav || !bottomBar) return;
    
    // 1. Lấy chiều cao chính xác của nav
    const navHeight = nav.offsetHeight;
    
    // 2. Đặt bottom-bar sát dưới nav
    bottomBar.style.top = navHeight + 'px';
    
    // 3. Tính tổng chiều cao và đặt padding cho body
    const totalHeight = navHeight + bottomBar.offsetHeight;
    document.body.style.paddingTop = totalHeight + 'px';
    
    console.log('Header fixed - Nav height:', navHeight, 'Total height:', totalHeight);
}
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
    // Gọi hàm load danh mục ngay khi trang web tải xong
    loadCategoriesToSearchModal();
});

async function loadCategoriesToSearchModal() {
    const categorySelect = document.getElementById('advancedCategorySelect');
    
    // Đường dẫn API của bạn (thay đổi cho đúng với project của bạn)
    const apiUrl = '/controller/danhmuc.php?action=alladmin'; 

    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.success && result.data) {
            // Giữ lại option mặc định ban đầu (Tất cả)
            let html = '<option value="">Tất cả</option>';

            // Lặp qua mảng data trả về từ API
            result.data.forEach(item => {
                // value là madm, nội dung hiển thị là tendm
                html += `<option value="${item.madm}">${item.tendm}</option>`;
            });

            // Gán lại nội dung HTML cho thẻ select
            categorySelect.innerHTML = html;
        }
    } catch (error) {
        console.error('Lỗi khi gọi API danh mục:', error);
    }
}
    </script>
        
</body>
</html>

