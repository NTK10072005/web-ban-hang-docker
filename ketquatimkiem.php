<?php
// Nếu cần khởi tạo session PHP, thêm vào đây
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="utf-8">
    <title>Kết quả tìm kiếm - BOOK STORE</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="eCommerce HTML Template Free Download" name="keywords">
    <meta content="eCommerce HTML Template Free Download" name="description">

    <!-- Favicon -->
    <link href="img/tieude.jpg" rel="icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400|Source+Code+Pro:700,900&display=swap"
        rel="stylesheet">

    <!-- CSS Libraries -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="lib/slick/slick.css" rel="stylesheet">
    <link href="lib/slick/slick-theme.css" rel="stylesheet">

    <!-- Template Stylesheet (chứa toàn bộ CSS của index) -->
    <link href="css/style.css" rel="stylesheet">
    <link href="css/index.css" rel="stylesheet">

    <!-- Thêm style tùy chỉnh -->
    <style>
        .search-summary {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
    text-align: right; /* hoặc left tùy ý */
}
.search-summary span {
    font-weight: 500;
}
.search-summary strong {
    color: #ff6f61;
    font-weight: 700;
}
        /* --- Tùy chỉnh màu sắc phân trang --- */
        .pagination .page-item.active .page-link {
            background-color: #ff6f61 !important;
            border-color: #ff6f61 !important;
            color: #fff !important;
        }
        .pagination .page-link {
            color: #333;
            background-color: transparent;
            border: 1px solid #dee2e6;
            transition: all 0.3s ease;
        }
        .pagination .page-link:hover {
            background-color: #fff5f4;
            color: #ff6f61;
            border-color: #ff6f61;
        }
        .pagination .page-link:focus {
            box-shadow: 0 0 0 0.2rem rgba(255, 111, 97, 0.25);
        }

        /* Quick View Modal */
       .qv-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: none;
    align-items: flex-start; /* Để modal nằm từ trên xuống giúp dễ cuộn */
    justify-content: center;
    z-index: 2000;
    overflow-y: auto;        /* Kích hoạt cuộn cho toàn bộ màn hình */
    padding: 40px 0;         /* Tạo khoảng cách để modal không dính mép màn hình */
}

/* 2. Hộp thoại trắng: Phải để overflow là visible */
.qv-card {
    background: #fff;
    border-radius: 14px;
    max-width: 980px;
    width: calc(100% - 32px);
    position: relative;
    padding: 28px;
    margin-top: 20px;
    /* QUAN TRỌNG: Bỏ max-height và overflow cũ, thay bằng cái này */
    max-height: none !important; 
    overflow: visible !important; 
}
        .qv-close {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #1e6bd6;
            color: #1e6bd6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .qv-close:hover {
            background: #1e6bd6;
            color: #fff;
        }
        .qv-body {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 24px;
            align-items: start;
        }
        .qv-img {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .qv-img img {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
        }
        .qv-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .qv-price-container {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }
        .qv-original-price {
            color: #999;
            font-size: 20px;
            text-decoration: line-through;
        }
        .qv-discounted-price {
            font-size: 28px;
            font-weight: 800;
            color: #ff6f61;
        }
        .qv-discount-badge {
            background: #ff6f61;
            color: #fff;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 14px;
            font-weight: bold;
        }
        .qv-price {
            font-size: 28px;
            font-weight: 800;
            color: #ff6f61;
            margin-bottom: 15px;
        }
        .qv-desc {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 20px;
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
        .qv-button-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 20px;
        }
        .qv-add, .qv-buy-now {
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s;
        }
        .qv-add {
            background: #1e6bd6;
            color: white;
        }
        .qv-add:hover {
            background: #1557b3;
            transform: translateY(-2px);
        }
        .qv-buy-now {
            background: linear-gradient(135deg, #ff6f61, #ff8a80);
            color: white;
        }
        .qv-buy-now:hover {
            background: linear-gradient(135deg, #ff5a4d, #ff756b);
            transform: translateY(-2px);
        }
        @media (max-width: 768px) {
            .qv-body {
                grid-template-columns: 1fr;
            }
        }

        /* Form tìm kiếm nâng cao trong cột trái */
        .advanced-search-form {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        .advanced-search-form h3 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #333;
            border-left: 4px solid #ff6f61;
            padding-left: 12px;
        }
        .advanced-search-form .form-group {
            margin-bottom: 15px;
        }
        .advanced-search-form label {
            font-weight: 600;
            margin-bottom: 5px;
            display: block;
        }
        .advanced-search-form input[type="text"],
        .advanced-search-form select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            transition: 0.2s;
        }
        .advanced-search-form input[type="text"]:focus,
        .advanced-search-form select:focus {
            border-color: #ff6f61;
            outline: none;
            box-shadow: 0 0 0 2px rgba(255,111,97,0.2);
        }
        .price-range {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .price-range input {
            flex: 1;
        }
        .form-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        .btn-search {
            background: #ff6f61;
            border: none;
            padding: 8px 20px;
            border-radius: 30px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
        }
        .btn-search:hover {
            background: #e55a4e;
        }
        .btn-reset {
            background: #e9ecef;
            border: none;
            padding: 8px 20px;
            border-radius: 30px;
            color: #333;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
        }
        .btn-reset:hover {
            background: #dee2e6;
        }

        /* Thanh sắp xếp */
        .sort-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 25px;
        }
        #sortSelect {
            min-width: 250px;
            border-radius: 20px;
            padding: 8px 20px;
            border: 1px solid #ddd;
            font-size: 14px;
            cursor: pointer;
            background-color: #fff;
            transition: all 0.3s;
        }
        #sortSelect:focus {
            border-color: #ff6f61;
            outline: none;
            box-shadow: 0 0 5px rgba(255,111,97,0.2);
        }

        /* Grid sản phẩm */
        .product-grid {
            margin: 0 -15px;
        }
        .category-product-item {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .product-actions {
            margin-top: auto;
        }
@media (min-width: 1200px) {
    .container {
        max-width: 1600px; /* Tăng độ rộng lên thay vì 1140px */
    }
}
        /* Tiêu đề kết quả */
        .search-header h2 {
            font-size: 28px;
            font-weight: 700;
            color: #333;
            display: inline-block;
            position: relative;
            padding-bottom: 15px;
            border-left: none;
            padding-left: 0;
        }
        .search-header h2::after {
            content: '';
            width: 80px;
            height: 3px;
            background: #ff6f61;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .sort-container {
                justify-content: center;
            }
            #sortSelect {
                width: 100%;
            }
            .advanced-search-form {
                margin-bottom: 30px;
            }
        }
        .buy-now {
            background: #28a745;
        }
        .buy-now:hover {
            transform: scale(1.1);
        }
        /* Triệt tiêu margin-top của tiêu đề để hai khối khớp nhau hoàn hảo */
.advanced-search-form h3 {
    margin-top: 0 !important;
    padding-top: 5px; /* Chỉnh nhẹ cho cân với mép trên của card sản phẩm */
}

/* Đảm bảo hàng điều khiển bên trên không chiếm quá nhiều diện tích */
.sort-container {
    margin-bottom: 0 !important;
}

.search-summary {
    margin-bottom: 0 !important;
}

/* Căn chỉnh lại lưới sản phẩm để không có khoảng trống thừa phía trên */
.product-grid {
    margin-top: 0 !important;
}

    </style>
</head>

<body>
    <!-- Header -->
    <div class="nav">
        <div class="container-fluid">
            <nav class="navbar navbar-expand-md bg-dark navbar-dark">
                <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                    <div class="navbar-nav mr-auto">
                        <a href="index.html" class="nav-item nav-link">Trang chủ</a>
                    </div>
                    <div class="navbar-nav ml-auto">
                        <div class="nav-item dropdown">
                            <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown"> <i
                                    class="fas fa-user"></i> &nbsp;Tài khoản</a>
                            <div class="dropdown-menu">
                                <a href="login.html" class="dropdown-item"><i
                                        class="fa fa-sign-in-alt"></i>&nbsp;&nbsp;Đăng nhập</a>
                                <a href="register.html" class="dropdown-item"> <i
                                        class="fa fa-user-plus"></i>&nbsp;&nbsp;Đăng ký</a>
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
                        <a href="cart.html" id="cartBtn" class="btn cart" onclick="check()">
                            <i class="fa fa-shopping-cart"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Nội dung chính: 2 cột (trái: tìm kiếm nâng cao, phải: kết quả) -->
    <div class="container-fluid mt-4">
    <div class="container">
        <div class="row mb-3 align-items-center">
            <div class="col-md-6">
                <div class="search-summary m-0 text-left">
                    <span id="productCountMessage"></span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="sort-container m-0 justify-content-end">
                    <select id="sortSelect">
                        <option value="default">Sắp xếp: Mặc định</option>
                        <option value="az">Tên: A → Z</option>
                        <option value="za">Tên: Z → A</option>
                        <option value="priceAsc">Giá: Thấp → Cao</option>
                        <option value="priceDesc">Giá: Cao → Thấp</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-12 mb-4">
                <div class="advanced-search-form mt-0">
                    <h3 style="margin-top: 0;">Tìm kiếm nâng cao</h3>
                    <form id="advancedSearchForm">
                        <div class="form-group">
                            <label>Tên sản phẩm:</label>
                            <input id="tensp" type="text" name="keyword" placeholder="Nhập tên sản phẩm tìm kiếm...">
                        </div>
                        <div class="form-group">
                            <label>Danh mục:</label>
                            <select name="category" id="advancedCategorySelect">
                                <option value="">Tất cả</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Khoảng giá:</label>
                            <div class="price-range">
                                <input id="giatu" type="text" name="minPrice" placeholder="Từ">
                                <span>-</span>
                                <input id="giaden" type="text" name="maxPrice" placeholder="Đến">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button id="search" type="submit" class="btn-search">Tìm kiếm</button>
                            <button id="reset" type="button" class="btn-reset" onclick="resett();">Đặt lại</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="col-lg-8 col-md-12">
                <div id="searchResults" class="row product-grid mt-0">
                    <div class="col-12 text-center">
                        <p>Đang tải dữ liệu...</p>
                    </div>
                </div>

                <div id="paginationContainer" class="mt-4"></div>
            </div>
        </div>
    </div>
</div>

    <!-- Feature Start -->
    <div class="feature">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-lg-3 col-md-6 feature-col">
                    <div class="feature-content">
                        <i class="fab fa-cc-mastercard"></i>
                        <h2>Bảo mật thanh toán</h2>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 feature-col">
                    <div class="feature-content">
                        <i class="fa fa-truck"></i>
                        <h2>Free ship toàn quốc</h2>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 feature-col">
                    <div class="feature-content">
                        <i class="fa fa-sync-alt"></i>
                        <h2>Đổi trả trong 90 ngày</h2>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 feature-col">
                    <div class="feature-content">
                        <i class="fa fa-comments"></i>
                        <h2>Hỗ trợ 24/7</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Feature End -->

    <!-- Footer Start -->
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
    <!-- Footer End -->

    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>

    <script>
        // ------------------------------
        // HÀM HIỂN THỊ GIÁ (GIỐNG INDEX)
        // ------------------------------
        function renderProductPrice(product) {
            const price = parseInt(product.gia);
            const discount = parseFloat(product.hesogiamgia) || 0;
            
            if (discount > 0) {
                const discountedPrice = Math.round(price * (1 - discount));
                const formattedOriginalPrice = price.toLocaleString('vi-VN') + ' đ';
                const formattedDiscountedPrice = discountedPrice.toLocaleString('vi-VN') + ' đ';
                const discountPercent = Math.round(discount * 100);
                
                return `
                    <div class="product-price-container">
                        <div class="original-price">${formattedOriginalPrice}</div>
                        <div class="discounted-price">${formattedDiscountedPrice}</div>
                        <div class="discount-badge">-${discountPercent}%</div>
                    </div>
                `;
            } else {
                return `<div class="category-product-price">${price.toLocaleString('vi-VN')} đ</div>`;
            }
        }

        // ------------------------------
        // TẠO HTML SẢN PHẨM (GIỐNG INDEX)
        // ------------------------------
        function createProductHTML(product) {
            let imageSrc = product.link || 'img/default-book.jpg';
            imageSrc = imageSrc
                .replace(/\.webg$/, '.webp')
                .replace(/\.img$/, '.jpg')
                .replace(/\.jpgf$/, '.jpg');

            return `
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <div class="category-product-item" data-product-id="${product.masp}">
                        <div class="category-product-image">
                            <img src="${imageSrc}" alt="${product.tensp}" onerror="this.src='img/default-book.jpg'">
                        </div>
                        <div class="category-product-title">${product.tensp}</div>
                        ${renderProductPrice(product)}
                        <div class="category-freeship-badge">Freeship</div>
                        
                        <div class="product-actions">
                            <a href="#" class="action-btn add-cart" title="Thêm vào giỏ hàng" onclick="addToCart('${product.masp}')">
                                <i class="fa fa-shopping-cart"></i>
                            </a>
                            <a href="#" class="action-btn buy-now" title="Mua ngay" onclick="openBuyNowModal('${product.masp}'); return false;">
                                <i class="fab fa-cc-visa"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }

        // ------------------------------
        // HIỂN THỊ THÔNG BÁO
        // ------------------------------
        function showMessage(message, type = 'success') {
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

            if (type === 'success') {
                messageDiv.style.backgroundColor = '#d4edda';
                messageDiv.style.color = '#155724';
                messageDiv.style.border = '1px solid #c3e6cb';
            } else {
                messageDiv.style.backgroundColor = '#f8d7da';
                messageDiv.style.color = '#721c24';
                messageDiv.style.border = '1px solid #f5c6cb';
            }

            messageDiv.innerHTML = `
                <span>${message}</span>
                <button id="closeMessage" style="background:none;border:none;color:inherit;font-size:18px;cursor:pointer;margin-left:15px;">&times;</button>
            `;

            messageDiv.style.display = 'flex';
            document.getElementById('closeMessage').addEventListener('click', () => {
                messageDiv.style.display = 'none';
            });

            setTimeout(() => {
                if (messageDiv.style.display !== 'none') {
                    messageDiv.style.display = 'none';
                }
            }, 5000);
        }

        // ------------------------------
        // THÊM VÀO GIỎ HÀNG (DÙNG CHUNG VỚI INDEX)
        // ------------------------------
        async function addToCart(productId) {
            event.preventDefault();
            if (!window.userGlobalData || !window.userGlobalData.success) {
                showMessage('Vui lòng đăng nhập để sử dụng giỏ hàng', 'error');
                return;
            }
            const magio = window.userGlobalData.data.idkhach;
            const formData = new FormData();
            formData.append('magio', magio);
            formData.append('masp', productId);
            formData.append('soluong', 1);
            try {
                const response = await fetch('/controller/cart.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    showMessage('Đã thêm sản phẩm vào giỏ hàng!', 'success');
                    setTimeout(() => {
                        window.location.href = 'cart.html';
                    }, 1500);
                } else {
                    const errorMessage = result.message || 'Cập nhật thất bại!';
                    showMessage(`❌ ${errorMessage}`, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage(`❌ Đã xảy ra lỗi: ${error.message}`, 'error');
            }
        }

        // ------------------------------
        // BIẾN TOÀN CỤC VÀ PHÂN TRANG
        // ------------------------------
        let allProducts = [];
        let currentPage = 1;
        const productsPerPage = 8;
        let currentSort = 'default';
        let categoryMapping = {};

        async function fetchCategories() {
            try {
                const response2 = await fetch('/controller/danhmuc.php?action=alladmin');
                const data2 = await response2.json();
                if (data2.success) {
                    const categoriesAdmin = data2.data;
                    categoriesAdmin.forEach(cat => {
                        categoryMapping[cat.madm] = cat.tendm;   
                    });
                }
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            }
        }
         

        // ==================== UTILITY FUNCTIONS FOR QUICK VIEW ====================
        function formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
        }

        function renderQuickViewPrice(product) {
            const price = parseInt(product.gia);
            const discount = parseFloat(product.hesogiamgia) || 0;
            
            if (discount > 0) {
                const discountedPrice = Math.round(price * (1 - discount));
                const discountPercent = Math.round(discount * 100);
                return `
                    <div class="qv-price-container">
                        <div class="qv-original-price">${formatPrice(price)}</div>
                        <div class="qv-discounted-price">${formatPrice(discountedPrice)}</div>
                        <div class="qv-discount-badge">-${discountPercent}%</div>
                    </div>
                `;
            } else {
                return `<div class="qv-price">Giá: ${formatPrice(price)}</div>`;
            }
        }

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
            if (!productId) return;

            try {
                const response = await fetch(`/controller/product.php?masp=${productId}`);
                const data = await response.json();
                if (!data.success) {
                    console.error('Lỗi lấy chi tiết sản phẩm:', data.message);
                    return;
                }
                const product = data.data;
                const imageUrl = product.link || 'img/default-book.jpg';
                const danhmucTen = categoryMapping[product.danhmuc] || product.danhmuc;
                const detailedInfo = {
            'Nhà xuất bản': product.nhaxuatban || 'Đang cập nhật',
            'Năm xuất bản': product.namxuatban || 'Đang cập nhật',
            'Số trang': product.sotrang || 'Đang cập nhật',
            'Ngôn ngữ': product.ngonngu || 'Tiếng Việt',
            'Kích thước': product.kichthuoc || 'Đang cập nhật',
            'Trọng lượng': product.trongluong || 'Đang cập nhật',
            'ISBN': product.isbn || '388053101-3',
            'Hình thức bìa': product.loaibia || 'Bìa mềm'
        };
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
                                ${renderQuickViewPrice(product)}
                                <div class="qv-desc">${product.mota || 'Chưa có mô tả cho sản phẩm này.'}</div>
                                <div class="qv-meta-container">
                                    <div class="qv-meta-item">
                                        <i class="fas fa-user"></i>
                                        <span>Tác giả: <em>${product.tacgia}</em></span>
                                    </div>
                                    <div class="qv-meta-item">
                                        <i class="fas fa-book"></i>
                                        <span>Thể loại: <em>${danhmucTen}</em></span>
                                    </div>
                                      <!-- Phần Xem thêm với tooltip hover -->
              <div class="qv-more-info">
                <a href="javascript:void(0)" 
                   class="view-more-link">
                  <i class="fas fa-info-circle"></i>
                  Xem thêm
                </a>
                <div class="more-info-tooltip" 
                     style="position: absolute !important; bottom: 100% !important; left: 50% !important; transform: translateX(-50%) !important; z-index: 10000 !important; display: none; margin-bottom: 12px !important; padding: 15px !important; background: white !important; border-radius: 8px !important; border: 1px solid #e0e0e0 !important; font-size: 13px !important; width: 280px !important; box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important; animation: fadeInTooltip 0.2s ease !important; box-sizing: border-box !important;">
                  <div style="font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">Thông tin chi tiết:</div>
                  ${Object.entries(detailedInfo).map(([key, value]) => `
                    <div style="display: flex; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid #f0f0f0;">
                      <span style="min-width: 100px; color: #666; font-weight: 500;">${key}:</span>
                      <span style="color: #333; flex: 1; text-align: right;">${value}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
                                    <div class="qv-button-grid">
                                        <button class="qv-add" onclick="addToCart('${productId}'); event.stopPropagation();">
                                            <i class="fa fa-shopping-cart"></i>
                                            <span>Thêm vào giỏ</span>
                                        </button>
                                        <button class="qv-buy-now" onclick="openBuyNowModal('${productId}'); event.stopPropagation();">
                                            <i class="fas fa-bolt"></i>
                                            <span>Mua ngay</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                root.style.display = 'flex';
                const moreInfoElement = root.querySelector('.qv-more-info');
        const tooltip = root.querySelector('.more-info-tooltip');
        
        // Hover trên cả container hoặc link đều hiển thị tooltip
        moreInfoElement.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            // Sử dụng setProperty với important
            tooltip.style.setProperty('display', 'block', 'important');
        });
        
        moreInfoElement.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            // Sử dụng setTimeout để tránh flicker
            setTimeout(() => {
                if (!moreInfoElement.matches(':hover') && !tooltip.matches(':hover')) {
                    tooltip.style.setProperty('display', 'none', 'important');
                }
            }, 100);
        });
        
        tooltip.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            tooltip.style.setProperty('display', 'block', 'important');
        });
        
        tooltip.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            setTimeout(() => {
                if (!moreInfoElement.matches(':hover') && !tooltip.matches(':hover')) {
                    tooltip.style.setProperty('display', 'none', 'important');
                }
            }, 100);
        });

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

        // Gắn sự kiện click vào sản phẩm
        document.addEventListener('click', function(e) {
            if (e.target.closest('.add-cart') || e.target.closest('.buy-now')) return;
            const productItem = e.target.closest('.category-product-item');
            if (!productItem) return;
            e.preventDefault();
            openQuickViewFromCard(productItem);
        });

        ensureQuickViewRoot();

        // Hàm sắp xếp
        function applySort() {
            if (currentSort === 'az') {
                allProducts.sort((a, b) => a.tensp.localeCompare(b.tensp));
            } else if (currentSort === 'za') {
                allProducts.sort((a, b) => b.tensp.localeCompare(a.tensp));
            } else if (currentSort === 'priceAsc') {
                allProducts.sort((a, b) => {
                    const priceA = parseInt(a.gia) * (1 - (parseFloat(a.hesogiamgia) || 0));
                    const priceB = parseInt(b.gia) * (1 - (parseFloat(b.hesogiamgia) || 0));
                    return priceA - priceB;
                });
            } else if (currentSort === 'priceDesc') {
                allProducts.sort((a, b) => {
                    const priceA = parseInt(a.gia) * (1 - (parseFloat(a.hesogiamgia) || 0));
                    const priceB = parseInt(b.gia) * (1 - (parseFloat(b.hesogiamgia) || 0));
                    return priceB - priceA;
                });
            }
        }

        function renderPage(page) {
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            const productsToShow = allProducts.slice(start, end);
            
            const container = document.getElementById('searchResults');
            container.innerHTML = '';
            
            if (productsToShow.length === 0) {
                container.innerHTML = '<div class="col-12 text-center"><h3>Không có sản phẩm nào</h3></div>';
                document.getElementById('paginationContainer').innerHTML = '';
                return;
            }

            productsToShow.forEach(p => {
                container.innerHTML += createProductHTML(p);
            });

            renderPagination();
        }

        function renderPagination() {
            const totalPages = Math.ceil(allProducts.length / productsPerPage);
            const paginationDiv = document.getElementById('paginationContainer');
            paginationDiv.innerHTML = '';

            if (totalPages <= 1) return;

            let paginationHtml = '<nav aria-label="Page navigation"><ul class="pagination">';
            paginationHtml += `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">«</a>
                </li>
            `;

            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);
            
            if (startPage > 1) {
                paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
                if (startPage > 2) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationHtml += `
                    <li class="page-item ${currentPage === i ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
            }

            paginationHtml += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">»</a>
                </li>
            `;
            paginationHtml += '</ul></nav>';

            paginationDiv.innerHTML = paginationHtml;

            document.querySelectorAll('#paginationContainer .page-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = parseInt(this.getAttribute('data-page'));
                    if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
                        currentPage = page;
                        renderPage(currentPage);
                        document.getElementById('searchResults').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        }

        async function loadResults(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.success && data.data && data.data.data && data.data.data.length > 0) {
            allProducts = data.data.data;
            // ===== THÊM DÒNG NÀY =====
            const productCount = allProducts.length;
            document.getElementById('productCountMessage').innerHTML = `Tìm thấy <strong>${productCount}</strong> sản phẩm phù hợp`;
            // ==========================
            applySort();
            currentPage = 1;
            renderPage(currentPage);
        } else {
            // Không có sản phẩm
            document.getElementById('searchResults').innerHTML = '<div class="col-12 text-center"><h3>Không tìm thấy sản phẩm nào!</h3></div>';
            document.getElementById('paginationContainer').innerHTML = '';
            // ===== THÊM DÒNG NÀY =====
            // ==========================
        }
    } catch (error) {
        console.error('Lỗi:', error);
        document.getElementById('searchResults').innerHTML = '<div class="col-12 text-center"><h3>Có lỗi xảy ra, vui lòng thử lại!</h3></div>';
        // ===== THÊM DÒNG NÀY (tuỳ chọn) =====
        document.getElementById('productCountMessage').innerHTML = 'Có lỗi xảy ra khi tìm kiếm';
        // =================================
    }
}

        document.addEventListener('DOMContentLoaded', function() {
            loadCategoriesToSearchModal();
            fetchCategories();
            const urlParams = new URLSearchParams(window.location.search);
            const action = urlParams.get('action');
            let apiUrl = '';

            if (action === 'search') {
                apiUrl = `/controller/product.php?action=search&keywords=${encodeURIComponent(urlParams.get('keywords'))}`;
                document.getElementById('tensp').value = `${urlParams.get('keywords')}`;
            } else if (action === 'searchnangcao') {
                apiUrl = `/controller/product.php?action=searchnangcao&category=${urlParams.get('category')}&tensp=${encodeURIComponent(urlParams.get('tensp'))}&giatu=${urlParams.get('giatu')}&giaden=${urlParams.get('giaden')}`;
                document.getElementById('tensp').value = `${urlParams.get('tensp')}`;
                document.getElementById('advancedCategorySelect').value = `${urlParams.get('category')}`;
                document.getElementById('giatu').value = formatNumber(urlParams.get('giatu'));
                document.getElementById('giaden').value = formatNumber(urlParams.get('giaden'));
            }

            if (apiUrl) {
                loadResults(apiUrl);
            } else {
                document.getElementById('searchResults').innerHTML = '<div class="col-12 text-center"><h3>Vui lòng thực hiện tìm kiếm từ trang chủ</h3><a href="index.html" class="btn btn-primary mt-3">Quay lại trang chủ</a></div>';
                document.getElementById('paginationContainer').innerHTML = '';
            }

            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) {
                sortSelect.addEventListener('change', function() {
                    currentSort = this.value;
                    applySort();
                    currentPage = 1;
                    renderPage(currentPage);
                });
            }
        });
    </script>
    
    <script src="js/index/checklogin.js"></script>
    <script src="js/index/muangay.js"></script>
    <script src="js/index/searchnangcao.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            loadCategoriesToSearchModal();
        });
        function resett() {
            document.getElementById('tensp').value = '';
            document.getElementById('advancedCategorySelect').value = '';
            document.getElementById('giatu').value = '';
            document.getElementById('giaden').value = '';
        }

        async function loadCategoriesToSearchModal() {
            const categorySelect = document.getElementById('advancedCategorySelect');
            const apiUrl = '/controller/danhmuc.php?action=all'; 

            try {
                const response = await fetch(apiUrl);
                const result = await response.json();

                if (result.success && result.data) {
                    let html = '<option value="">Tất cả</option>';
                    result.data.forEach(item => {
                        html += `<option value="${item.madm}">${item.tendm}</option>`;
                    });

                    categorySelect.innerHTML = html;

                    const urlParams = new URLSearchParams(window.location.search);
                    const categoryId = urlParams.get('category');
                    if (categoryId) {
                        categorySelect.value = categoryId;
                    }
                }
            } catch (error) {
                console.error('Lỗi:', error);
            }
        }
        
    </script>
</body>

</html>