<?php
// 1. Khởi động session để đọc dữ liệu phiên đăng nhập
session_start();

// Lưu trữ các biến session cần thiết
$session_tenkhach = isset($_SESSION['tenkhach']) ? $_SESSION['tenkhach'] : '';
$session_sdt      = isset($_SESSION['sdt']) ? $_SESSION['sdt'] : '';
$session_address  = isset($_SESSION['address']) ? $_SESSION['address'] : '';
$session_idkhach  = isset($_SESSION['idkhach']) ? $_SESSION['idkhach'] : null;

// QUAN TRỌNG: Đóng và lưu session ngay để tránh Deadlock khi cURL gọi API nội bộ container
session_write_close();

// Khởi tạo các biến chứa dữ liệu thanh toán
$cartItems = [];
$subtotal = 0;
$total = 0;

// 2. Xử lý nhận dữ liệu sản phẩm khi có yêu cầu POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Hỗ trợ cả 2 định dạng: JSON thô từ fetch() và Form chuẩn qua $_POST
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $products = [];
    if (!empty($data['products']) && is_array($data['products'])) {
        $products = $data['products'];
    } elseif (!empty($_POST['products'])) {
        $products = is_string($_POST['products']) ? json_decode($_POST['products'], true) : $_POST['products'];
    }

    if (is_array($products) && count($products) > 0) {
        foreach ($products as $productData) {
            $masp = isset($productData['masp']) ? $productData['masp'] : null;
            $soluong = isset($productData['soluong']) ? intval($productData['soluong']) : 1;

            if (!$masp) continue;

            // Sử dụng 127.0.0.1 và cổng 80 nội bộ của Apache bên trong container
            $api_url = "http://127.0.0.1/controller/product.php?masp=" . urlencode($masp);

            $response = false;

            // Gọi API thông qua cURL ép dải IPv4
            if (function_exists('curl_init')) {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $api_url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 5);
                curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
                $response = curl_exec($ch);
                curl_close($ch);
            }

            // Cơ chế dự phòng bằng file_get_contents nếu cURL gặp trục trặc
            if (!$response && ini_get('allow_url_fopen')) {
                $response = @file_get_contents($api_url);
            }

            if ($response) {
                $product_info = json_decode($response, true);

                if (!empty($product_info['success']) && isset($product_info['data'])) {
                    $product = $product_info['data'];
                    $giamgia = floatval(isset($product['giamgia']) ? $product['giamgia'] : 0);
                    $gia = floatval(isset($product['gia']) ? $product['gia'] : 0);
                    $item_total = $gia * $soluong * (1 - $giamgia);
                    $subtotal += $item_total;

                    $cartItems[] = [
                        'masp'     => $product['masp'],
                        'tensp'    => $product['tensp'],
                        'tacgia'   => isset($product['tacgia']) ? $product['tacgia'] : '',
                        'gia'      => $gia,
                        'soluong'  => $soluong,
                        'total'    => $item_total,
                        'image'    => isset($product['link']) ? $product['link'] : '',
                        'mota'     => isset($product['mota']) ? $product['mota'] : '',
                        'giamgia'  => $giamgia
                    ];
                }
            }
        }
    }

    $total = $subtotal;
}

function formatPrice($price) {
    return number_format($price, 0, ',', '.') . 'đ';
}
?>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="utf-8">
        <title>CHECK BOOK STORE</title>
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
            .search input,
            .form-control {
                color: #000;
            }

            .search input::placeholder,
            .form-control::placeholder {
                color: #000;
                opacity: 1;
            }

            .footer {
                margin-top: 20px;
            }

            .search-container {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
            }

            .search {
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
            }

            .search input {
                width: 100%;
                padding-right: 30px;
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

            .filter-button-container {
                flex-shrink: 0;
            }

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

            .nav-item.dropdown:hover .dropdown-menu {
                display: block;
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
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
                min-height: 42px;
                box-sizing: border-box;
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

            .btn-new-address {
                background-color: #ff7b00;
                border-color: #ff7b00;
                color: white;
                display: block;
                width: fit-content;
                margin: 10px auto 0;
                padding: 8px 20px;
                border-radius: 4px;
                transition: all 0.3s;
            }

            .btn-new-address:hover {
                background-color: #e66a00;
                border-color: #e66a00;
                color: white;
            }

            .empty-cart {
                text-align: center;
                padding: 50px 0;
            }

            .empty-cart i {
                font-size: 60px;
                color: #ddd;
                margin-bottom: 20px;
            }

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
                top: 45px;
                left: 0;
                width: 100%;
                z-index: 999;
                margin: 0 !important;
                padding: 0 !important;
                border-top: none !important;
            }

            body {
                padding-top: 115px !important;
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
                                <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
                                    <i class="fas fa-user"></i> &nbsp;<?php echo htmlspecialchars($session_tenkhach ? $session_tenkhach : 'Tài khoản'); ?>
                                </a>
                                <div class="dropdown-menu">
                                    <a href="thongtintaikhoan.html" class="dropdown-item"><i class="fa fa-id-card me-2"></i>  &nbsp;Thông tin</a>
                                    <a href="lichsumuahang.html" class="dropdown-item"> <i class="fa fa-history me-2"></i>&nbsp;Lịch sử mua hàng</a>
                                    <a href="controller/logout.php" class="dropdown-item"> <i class="fa fa-sign-out-alt me-2"></i>&nbsp;Đăng xuất</a>
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
                    <li class="breadcrumb-item"><a href="cart.html">Giỏ hàng</a></li>
                    <li class="breadcrumb-item active">Thanh toán</li>
                </ul>
            </div>
        </div>
        <!-- Breadcrumb End -->

        <!-- Checkout Start -->
        <div class="checkout">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-8">
                        <div class="checkout-inner">
                            <div class="billing-address">
                                <h2>DANH SÁCH SẢN PHẨM ĐÃ CHỌN MUA</h2>
                                <div class="cart-page-inner">
                                    <div class="table-responsive">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style="background-color: #ffffff; color: #000000;">Sản phẩm</th>
                                                    <th style="background-color: #ffffff; color: #000000;">Giá</th>
                                                    <th style="background-color: #ffffff; color: #000000;">Số lượng</th>
                                                    <th style="background-color: #ffffff; color: #000000;">Giảm giá(%)</th>
                                                    <th style="background-color: #ffffff; color: #000000;">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody class="align-middle" id="product-list">
                                                <?php if (count($cartItems) > 0): ?>
                                                    <?php foreach ($cartItems as $item): ?>
                                                    <tr>
                                                        <td>
                                                            <div class="img" style="display: flex; align-items: center; gap: 10px;">
                                                                <img src="<?php echo htmlspecialchars($item['image']); ?>" alt="Image" style="width: 60px; height: 80px; object-fit: cover;">
                                                                <p style="margin: 0;"><strong><?php echo htmlspecialchars($item['tensp']); ?></strong><br>
                                                                <small>Tác giả: <?php echo htmlspecialchars($item['tacgia']); ?></small></p>
                                                            </div>
                                                        </td>
                                                        <td><?php echo formatPrice($item['gia']); ?></td>
                                                        <td><?php echo $item['soluong']; ?></td>
                                                        <td><?php echo $item['giamgia'] * 100; ?>%</td>
                                                        <td><?php echo formatPrice($item['total']); ?></td>
                                                    </tr>
                                                    <?php endforeach; ?>
                                                <?php else: ?>
                                                    <tr>
                                                        <td colspan="5" class="text-center">
                                                            <div class="empty-cart">
                                                                <i class="fa fa-shopping-cart"></i>
                                                                <h4>Giỏ hàng trống</h4>
                                                                <p>Không có sản phẩm nào để thanh toán</p>
                                                                <a href="index.html" class="btn btn-primary">Quay lại mua sắm</a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                <?php endif; ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="shipping-address mt-4" id="shipping-form">
                                <h2>THÔNG TIN GIAO HÀNG</h2>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Họ và tên:</label>
                                            <input class="form-control" type="text" value="<?php echo htmlspecialchars($session_tenkhach); ?>" name="fullname" placeholder="Nhập họ và tên" required>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Số điện thoại:</label>
                                            <input class="form-control" type="tel" value="<?php echo htmlspecialchars($session_sdt); ?>" name="phone" placeholder="Nhập số điện thoại" required>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Địa chỉ giao hàng:</label>
                                            <input type="text" class="form-control" id="address-select" name="address" value="<?php echo htmlspecialchars($session_address); ?>" readonly>
                                            <button type="button" class="btn btn-new-address" id="btn-new-address">Thay đổi địa chỉ giao hàng</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="checkout-inner">
                            <div class="checkout-summary">
                                <h1>Thông tin đơn hàng</h1>
                                <p class="sub-total">Tiền Hàng<span id="subtotal"><?php echo formatPrice($subtotal); ?></span></p>
                                <p class="ship-cost">Phí Ship<span>Freeship</span></p>
                                <h2>Tổng Cộng<span id="total"><?php echo formatPrice($total); ?></span></h2>
                            </div>

                            <div class="checkout-payment">
                                <div class="payment-methods">
                                    <h2>Phương Thức Thanh Toán</h2>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="payment-method">
                                                <div class="custom-control custom-radio">
                                                    <input type="radio" class="custom-control-input" id="payment-1" name="payment_method" value="MOMO" onclick="showQRCode('momo')">
                                                    <label class="custom-control-label" for="payment-1">MOMO</label>
                                                </div>
                                            </div>
                                            <div class="payment-method">
                                                <div class="custom-control custom-radio">
                                                    <input type="radio" class="custom-control-input" id="payment-2" name="payment_method" value="VN Pay" onclick="showQRCode('vnpay')">
                                                    <label class="custom-control-label" for="payment-2">VN PAY</label>
                                                </div>
                                            </div>
                                            <div class="payment-method">
                                                <div class="custom-control custom-radio">
                                                    <input type="radio" class="custom-control-input" id="payment-5" name="payment_method" value="COD" onclick="showQRCode('cod')" checked>
                                                    <label class="custom-control-label" for="payment-5">COD</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div id="qr-code-container" style="display: none; text-align: center;">
                                                <img id="qr-code-image" src="" alt="QR Code" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 10px;">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="checkout-btn mt-3">
                                        <button type="button" class="btn btn-block btn-primary" id="orderBtn" style="background-color: #ff6f61; border-color: #ff6f61; font-weight: bold; padding: 12px;">Đặt hàng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Address Modal -->
        <div class="modal fade address-modal" id="addressFormModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h5 class="modal-title w-100">Thay đổi địa chỉ giao hàng</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="address-form" class="address-form">
                            <div class="form-group">
                                <label for="address-street">Số nhà, tên đường:</label>
                                <input type="text" class="form-control" id="address-street" placeholder="Nhập số nhà, tên đường">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="address-district">Phường/Xã:</label>
                                        <input type="text" class="form-control" id="address-district" placeholder="Nhập tên phường/xã">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="address-city">Tỉnh/Thành phố:</label>
                                        <input type="text" class="form-control" id="address-city" placeholder="Nhập tên tỉnh/thành phố">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="button" class="btn btn-primary w-100" id="btn-save-address" style="background-color: #ff7b00; border-color: #ff7b00; margin-top: 15px; color: white;">Lưu địa chỉ</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- JavaScript Libraries -->
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>

        <script>
            var cartItems = <?php echo json_encode($cartItems); ?>;
            var totalAmount = <?php echo floatval($total); ?>;
            var customerId = <?php echo $session_idkhach ? json_encode($session_idkhach) : 'null'; ?>;

            console.log('Cart items:', cartItems);
            console.log('Customer ID:', customerId);

            function showQRCode(paymentMethod) {
                const qrCodeContainer = document.getElementById('qr-code-container');
                const qrCodeImage = document.getElementById('qr-code-image');

                if (!qrCodeContainer || !qrCodeImage) return;

                if (paymentMethod === 'momo') {
                    qrCodeImage.src = 'img/momo.png';
                    qrCodeContainer.style.display = 'block';
                } else if (paymentMethod === 'vnpay') {
                    qrCodeImage.src = 'img/vnpay.png';
                    qrCodeContainer.style.display = 'block';
                } else if (paymentMethod === 'cod') {
                    qrCodeImage.src = 'img/cod.jpg';
                    qrCodeContainer.style.display = 'block';
                } else {
                    qrCodeContainer.style.display = 'none';
                }
            }

            function showError(message) {
                alert(message);
            }

            function showMessage(message, type) {
                alert(message);
            }

            function validateForm() {
                const fullname = document.querySelector('input[name="fullname"]').value.trim();
                const phone = document.querySelector('input[name="phone"]').value.trim();
                const address = document.getElementById('address-select').value.trim();
                const paymentMethod = document.querySelector('input[name="payment_method"]:checked');

                if (!fullname) {
                    showError('Vui lòng nhập họ và tên!');
                    return false;
                }
                if (!phone) {
                    showError('Vui lòng nhập số điện thoại!');
                    return false;
                }
                if (!address) {
                    showError('Vui lòng chọn địa chỉ giao hàng!');
                    return false;
                }
                if (!paymentMethod) {
                    showError('Vui lòng chọn phương thức thanh toán!');
                    return false;
                }
                if (!cartItems || cartItems.length === 0) {
                    showError('Giỏ hàng trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
                    return false;
                }
                if (!customerId) {
                    showError('Vui lòng đăng nhập để đặt hàng!');
                    return false;
                }
                return true;
            }

            function createOrderData() {
                const phone = document.querySelector('input[name="phone"]').value.trim();
                const address = document.getElementById('address-select').value.trim();
                const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

                const chitiet = cartItems.map(item => ({
                    masp: parseInt(item.masp),
                    soluong: parseInt(item.soluong),
                    giamgia: parseFloat(item.giamgia),
                    gia: parseInt(item.gia)
                }));

                return {
                    action: "them",
                    makh: parseInt(customerId),
                    ngaydat: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    diachi: address,
                    sdt: phone,
                    tongtien: parseFloat(totalAmount),
                    thanhtoan: paymentMethod,
                    trangthaidon: paymentMethod === 'COD' ? 2 : 0,
                    chitiet: chitiet
                };
            }

            async function submitOrder(orderData) {
                try {
                    const response = await fetch('/controller/donhang.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });

                    const result = await response.json();
                    if (result.success) {
                        showMessage('Tạo đơn hàng thành công!', 'success');
                        await clearCart();
                        if (orderData.thanhtoan !== 'COD') {
                            setTimeout(() => {
                                window.location.href = `/controller/payment.php?amount=${orderData.tongtien}&action=${orderData.thanhtoan}&madh=${result.data.madh}`;
                            }, 1500);
                        } else {
                            setTimeout(() => {
                                window.location.href = 'lichsumuahang.html';
                            }, 2000);
                        }
                    } else {
                        showError(result.message || 'Có lỗi xảy ra khi đặt hàng!');
                    }
                } catch (error) {
                    console.error('Lỗi kết nối:', error);
                    showError('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau!');
                }
            }

            async function clearCart() {
                if (!customerId || !cartItems.length) return;
                for (const item of cartItems) {
                    try {
                        await fetch(`/controller/cart.php?magio=${customerId}&masp=${item.masp}`, {
                            method: 'DELETE'
                        });
                    } catch (e) {
                        console.error('Lỗi xóa mục giỏ hàng:', e);
                    }
                }
            }

            // Gán sự kiện và xử lý nút Đặt hàng
            document.addEventListener('DOMContentLoaded', function() {
                const orderBtn = document.getElementById('orderBtn');

                if (orderBtn) {
                    if (!cartItems || cartItems.length === 0) {
                        orderBtn.disabled = true;
                        orderBtn.style.opacity = '0.5';
                        orderBtn.style.cursor = 'not-allowed';
                    }

                    orderBtn.addEventListener('click', async function(e) {
                        e.preventDefault();
                        if (!validateForm()) return;

                        const originalText = orderBtn.innerHTML;
                        orderBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang xử lý...';
                        orderBtn.disabled = true;

                        try {
                            const orderData = createOrderData();
                            await submitOrder(orderData);
                        } finally {
                            orderBtn.innerHTML = originalText;
                            orderBtn.disabled = false;
                        }
                    });
                }

                // Xử lý modal đổi địa chỉ an toàn
                const btnNewAddress = document.getElementById('btn-new-address');
                if (btnNewAddress) {
                    btnNewAddress.addEventListener('click', function() {
                        $('#addressFormModal').modal('show');
                    });
                }

                const btnSaveAddress = document.getElementById('btn-save-address');
                if (btnSaveAddress) {
                    btnSaveAddress.addEventListener('click', function() {
                        const street = document.getElementById('address-street').value.trim();
                        const district = document.getElementById('address-district').value.trim();
                        const city = document.getElementById('address-city').value.trim();

                        if (!street || !district || !city) {
                            alert('Vui lòng điền đầy đủ số nhà, phường/xã và tỉnh/thành phố!');
                            return;
                        }

                        document.getElementById('address-select').value = street + ', ' + district + ', ' + city;
                        $('#addressFormModal').modal('hide');
                    });
                }

                // Mặc định hiện QR code COD
                showQRCode('cod');
            });
        </script>
    </body>
</html>