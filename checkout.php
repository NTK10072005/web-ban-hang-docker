<?php
// Bắt đầu session
session_start();

// Khởi tạo biến
$cartItems = [];
$subtotal = 0;
$total = 0;

// Kiểm tra nếu có dữ liệu POST gửi lên
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Đọc dữ liệu JSON từ body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $products = $data['products'];
    if (is_array($products)) {
        foreach ($products as $productData) {
            $masp = $productData['masp'];
            $soluong = $productData['soluong'];
            
            // Gọi API để lấy thông tin sản phẩm
            $api_url = "http://localhost/web2/controller/product.php?masp=" . urlencode($masp);
            
            // Sử dụng cURL để gọi API
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $api_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            $response = curl_exec($ch);
            curl_close($ch);
            
            // Nếu không dùng được cURL, có thể dùng file_get_contents (cần bật allow_url_fopen)
            // $response = @file_get_contents($api_url);
            
            if ($response) {
                $product_info = json_decode($response, true);
                
                if ($product_info['success'] && isset($product_info['data'])) {
                    $product = $product_info['data'];
                    $item_total = $product['gia'] * $soluong*(1-$product['giamgia']);
                    $subtotal += $item_total;
                    
                    $cartItems[] = [
                        'masp' => $product['masp'],
                        'tensp' => $product['tensp'],
                        'tacgia' => $product['tacgia'],
                        'gia' => $product['gia'],
                        'soluong' => $soluong,
                        'total' => $item_total,
                        'image' => $product['link'],
                        'mota' => $product['mota'],
                        'giamgia'=>$product['giamgia']
                    ];
                }
            }
        }
    }
    
    // Tính tổng tiền
    $total = $subtotal;
    
   
} 

// Hàm định dạng tiền
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
            color: #000; /* đảm bảo chữ nhập vào màu đen */
            }

            /* Modern browsers */
            .search input::placeholder,
            .form-control::placeholder {
            color: #000;
            opacity: 1; /* nhiều trình duyệt dùng opacity mặc định <1 */
            }
.footer {
    margin-top: 20px;
}
            /* WebKit (Chrome, Safari, newer) */
            .search input::-webkit-input-placeholder {
            color: #000;
            opacity: 1;
            }

            /* Firefox 19+ */
            .search input::-moz-placeholder {
            color: #000;
            opacity: 1;
            }

            /* IE 10+ */
            .search input:-ms-input-placeholder {
            color: #000;
            }

            /* Edge */
            .search input::-ms-input-placeholder {
            color: #000;
            }

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
             select.form-control option[value=""] {
  color: #999;
}

/* Style cho các option khác của select */
select.form-control option {
  color: #000;
}
        /* Các style hiện có giữ nguyên */
        .search input,
        .form-control {
        color: #000;
        }

        .search input::placeholder,
        .form-control::placeholder {
        color: #999;
        opacity: 1;
        }

        /* Style cho nút thêm địa chỉ mới */
       .btn-new-address {
    background-color: #ff7b00;
    border-color: #ff7b00;
    color: white;
    
    /* CHIẾN THUẬT CĂN GIỮA NẰM Ở ĐÂY */
    display: block;        /* Chuyển sang dạng khối để nhận margin auto */
    width: fit-content;    /* Rất quan trọng: Giúp nút chỉ dài vừa bằng nội dung chữ */
    margin: 10px auto 0;   /* auto ở trái và phải sẽ đẩy nút ra giữa */
    
    padding: 8px 20px;
    border-radius: 4px;
    transition: all 0.3s;
}
        
        .btn-new-address:hover {
            background-color: #e66a00;
            border-color: #e66a00;
            color: white;
        }
        
        /* Style cho modal form địa chỉ */
        .address-form .form-group {
            margin-bottom: 15px;
        }
        
        .address-form label {
            font-weight: bold;
        }
        
        /* Style cho giỏ hàng trống */
        .empty-cart {
            text-align: center;
            padding: 50px 0;
        }
        
        .empty-cart i {
            font-size: 60px;
            color: #ddd;
            margin-bottom: 20px;
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

@media (max-width: 768px) {
    .qv-body {
        grid-template-columns: 1fr;
    }
}
/* Modal xác nhận đơn giản */
#simpleConfirmModal .modal-body {
    padding: 30px;
}

#simpleConfirmModal .modal-content {
    border-radius: 15px;
    overflow: hidden;
    border: none;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

#simpleConfirmModal .btn {
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s;
    border: 2px solid transparent;
}

#simpleConfirmModal .btn-outline-secondary {
    background-color: #f8f9fa;
    border-color: #dee2e6;
    color: #495057;
}

#simpleConfirmModal .btn-outline-secondary:hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
    transform: translateY(-2px);
}

#simpleConfirmModal .btn-primary {
    background-color: #ff6f61;
    border-color: #ff6f61;
    color: white;
}

#simpleConfirmModal .btn-primary:hover {
    background-color: #e65a50;
    border-color: #e65a50;
    transform: translateY(-2px);
}

#simpleConfirmModal .d-flex {
    gap: 20px;
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
        </style>
    </head>

    <body>
        <!-- Simple Confirmation Modal -->
<div class="modal fade" id="simpleConfirmModal" tabindex="-1" role="dialog" aria-labelledby="simpleConfirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        <div class="modal-content" style="border-radius: 10px; border: none; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <div class="modal-body text-center p-4">
                <div class="mb-3">
                    <i class="fas fa-question-circle fa-2x" style="color: #ff6f61;"></i>
                </div>
                <h5 class="mb-3" style="font-weight: 600; color: #333;">Bạn có chắc chắn muốn đặt hàng?</h5>
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button type="button" class="btn btn-outline-secondary" id="simpleConfirmNo" style="min-width: 80px; border-radius: 5px;">
                        Không
                    </button>
                    <button type="button" class="btn btn-primary" id="simpleConfirmYes" style="min-width: 80px; background-color: #ff6f61; border-color: #ff6f61; border-radius: 5px;">
                        Có
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
        <!-- Header Start -->
        <script>
        // 1. Khai báo biến toàn cục
window.userGlobalData = null;

// 2. Hàm gọi API và lưu dữ liệu
async function checkLoginAndUpdateUI() {
    try {
        // Gọi API kiểm tra đăng nhập
        const response = await fetch('http://localhost/web2/controller/checklogin.php');
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
        dropdownToggle.innerHTML = '<i class="fas fa-user"></i> &nbsp;Taikhoan';
        
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
        const response =  await fetch('http://localhost/web2/controller/cart.php', {
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
                    <li class="breadcrumb-item"><a href="cart.html">Giỏ hàng</a></li>
                    <li class="breadcrumb-item active">Thanh toán</li>
                </ul>
            </div>
        </div>
        <!-- Breadcrumb End -->

        <!-- Checkout Start -->
        <div class="checkout">
        <div class="container-fluid">
            <!-- Error message placeholder (hidden by default) -->
           
            </div>
            
            <div class="row">
                <div class="col-lg-8">
                    <form method="POST" action="#" id="checkoutForm">
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
                                                            <div class="img">
                                                                <img src="<?php echo $item['image']; ?>" alt="Image" style="width: 60px; height: 80px; object-fit: cover;">
                                                                <p><strong><?php echo htmlspecialchars($item['tensp']); ?></strong><br>
                                                                <small>Tác giả: <?php echo htmlspecialchars($item['tacgia']); ?></small></p>
                                                            </div>
                                                        </td>
                                                        <td><?php echo formatPrice($item['gia']); ?></td>
                                                        <td><?php echo $item['soluong']; ?></td>
                                                        <td><?php echo $item['giamgia']*100; ?></td>
                                                        <td><?php echo formatPrice($item['total']); ?></td>
                                                    </tr>
                                                    <?php endforeach; ?>
                                                <?php else: ?>
                                                    <tr>
                                                        <td colspan="4" class="text-center">
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

                            <!-- Shipping address form đã được cập nhật -->
                            <div class="shipping-address mt-4" id="shipping-form">
                                <h2>THÔNG TIN GIAO HÀNG</h2>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Họ và tên:</label>
                                            <input class="form-control" type="text" value="<?php echo isset($_SESSION['tenkhach']) ? htmlspecialchars($_SESSION['tenkhach']) : ''; ?>" name="fullname" placeholder="Nhập họ và tên" required>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Số điện thoại:</label>
                                            <input class="form-control" type="tel" value="<?php echo isset($_SESSION['sdt']) ? htmlspecialchars($_SESSION['sdt']) : ''; ?>" name="phone" placeholder="Nhập số điện thoại" required>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Địa chỉ giao hàng:</label>
                                            <input type ="text" class="form-control" id="address-select" name="address" value="<?php echo isset($_SESSION['address']) ? htmlspecialchars($_SESSION['address']) : ''; ?>" readonly>
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
                                                <input type="radio" class="custom-control-input" id="payment-1" name="payment_method" value="MOMO" onclick="showQRCode('momo')" required>
                                                <label class="custom-control-label" for="payment-1">MOMO</label>
                                            </div>
                                        </div>
                                        <div class="payment-method">
                                            <div class="custom-control custom-radio">
                                                <input type="radio" class="custom-control-input" id="payment-2" name="payment_method" value="VN Pay" onclick="showQRCode('vnpay')" required>
                                                <label class="custom-control-label" for="payment-2">VN PAY</label>
                                            </div>
                                        </div>
                                        <div class="payment-method">
                                            <div class="custom-control custom-radio">
                                                <input type="radio" class="custom-control-input" id="payment-5" name="payment_method" value="COD" onclick="showQRCode('cod')" required checked>
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
                                <div class="checkout-btn">
                                    <button type="button" class="btn" id="orderBtn">Đặt hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="modal fade address-modal" id="addressFormModal" tabindex="-1" role="dialog" aria-labelledby="addressFormModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header text-center">
                <h5 class="modal-title w-100" id="addressFormModalLabel">Thay đổi địa chỉ giao hàng</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="address-form" class="address-form">
                    <input type="hidden" id="edit-address-id" value="">
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
                    
                    
                    <!-- Nút Lưu địa chỉ với chiều dài bằng ô nhập số nhà -->
                    <div class="form-group">
                        <button type="button" class="btn btn-primary w-100" id="btn-save-address" style="background-color: #ff7b00; border-color: #ff7b00; margin-top: 20px; color: white;">Đổi</button>
                    </div>
                </form>
            </div>
            <!-- Đã bỏ modal-footer để chỉ còn lại nút Lưu địa chỉ trong form -->
        </div>
    </div>
</div>

    <!-- JavaScript Libraries -->
    

    <script>
        
// Hàm hiển thị lỗi trong modal địa chỉ


// Hàm nối chuỗi địa chỉ

// Thêm CSS cho thông báo lỗi trong modal
const style = document.createElement('style');
style.textContent = `
    .address-error {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

        // Các hàm khác giữ nguyên
        function showQRCode(paymentMethod) {
            const qrCodeContainer = document.getElementById('qr-code-container');
            const qrCodeImage = document.getElementById('qr-code-image');

            if (paymentMethod === 'momo') {
                qrCodeImage.src = 'img/momo.png';
                qrCodeContainer.style.display = 'block';
            } else if (paymentMethod === 'vnpay') {
                qrCodeImage.src = 'img/vnpay.png';
                qrCodeContainer.style.display = 'block';
            } else {
                qrCodeContainer.style.display = 'none';
            }
        }

    </script>
        <!-- Checkout End -->
        
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

        <!-- Footer Bottom Start -->

        <!-- Footer Bottom End -->

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
            function showQRCode(paymentMethod) {
                const qrCodeContainer = document.getElementById('qr-code-container');
                const qrCodeImage = document.getElementById('qr-code-image');

                if (paymentMethod === 'momo') {
                    qrCodeImage.src = 'img/momo.png';
                    qrCodeContainer.style.display = 'block';
                } else if (paymentMethod === 'vnpay') {
                    qrCodeImage.src = 'img/vnpay.png';
                    qrCodeContainer.style.display = 'block';
                } else if (paymentMethod === 'cod') {
                    qrCodeImage.src = 'img/cod.jpg';
                    qrCodeContainer.style.display = 'block';
                 }else {
                    qrCodeContainer.style.display = 'none';
                }
            }

        </script>

    <script>
// Biến từ PHP sang JavaScript
var cartItems = <?php echo json_encode($cartItems); ?>;
var totalAmount = <?php echo $total; ?>;
var customerId = <?php echo isset($_SESSION['idkhach']) ? json_encode($_SESSION['idkhach']) : 'null'; ?>;

console.log('Cart items:', cartItems);
console.log('Customer ID:', customerId);

// Hàm hiển thị thông báo lỗi
// Hàm hiển thị thông báo lỗi dạng toast bên phải
function showError(message) {
    // Tạo toast container nếu chưa có
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        padding: 15px 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        max-width: 100%;
    `;
    
    // Nội dung toast
    toast.innerHTML = `
        <div style="flex: 1; margin-right: 15px;">
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <i class="fa fa-exclamation-circle" style="font-size: 18px; margin-right: 8px;"></i>
                <strong style="font-size: 14px;">Lỗi</strong>
            </div>
            <div style="font-size: 13px; line-height: 1.4;">${message}</div>
        </div>
        <button class="toast-close" style="
            background: none;
            border: none;
            color: #721c24;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
            opacity: 0.7;
        ">&times;</button>
    `;
    
    // Thêm vào container
    toastContainer.appendChild(toast);
    
    // Sự kiện đóng toast
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    // Tự động đóng sau 5 giây
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
    
    // Thêm CSS animation nếu chưa có
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}
// Hàm hiển thị thông báo thành công
function showSuccess(message) {
    alert(message); // Tạm thời dùng alert để debug
}

// Hàm kiểm tra form đã điền đầy đủ chưa
function validateForm() {
    console.log('Validating form...');
    
    const fullname = document.querySelector('input[name="fullname"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const address = document.getElementById('address-select').value;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
    
    console.log('Form values:', { fullname, phone, address, paymentMethod });
    
    // Kiểm tra các trường bắt buộc
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
    
    // Kiểm tra giỏ hàng có sản phẩm không
    if (cartItems.length === 0) {
        showError('Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng.');
        return false;
    }
    
    // Kiểm tra id khách hàng
    if (!customerId) {
        showError('Vui lòng đăng nhập để đặt hàng!');
        return false;
    }
    
    console.log('Form validation passed');
    return true;
}

// Hàm tạo JSON data để gửi đến API đơn hàng
function createOrderData() {
    const fullname = document.querySelector('input[name="fullname"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const address = document.getElementById('address-select').value;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    
    console.log('Creating order data...');
    
    // Tạo mảng chi tiết sản phẩm với masp và soluong
    const chitiet = cartItems.map(item => ({
        masp: parseInt(item.masp),
        soluong: parseInt(item.soluong),
        giamgia: parseFloat(item.giamgia),
        gia: parseInt(item.gia)
    }));
        const trangthaidons = paymentMethod === 'COD' ? 2 : 0;

    
    // Tạo đối tượng đơn hàng
    const orderData = {
        action: "them",
        makh: parseInt(customerId),
        ngaydat: new Date().toISOString().slice(0, 19).replace('T', ' '),
        diachi: address,
        sdt: phone,
        tongtien: parseFloat(totalAmount),
        thanhtoan: paymentMethod,
        trangthaidon: trangthaidons,
        chitiet: chitiet
    };
    
    console.log('Order data:', orderData);
    return orderData;
}

// Hàm gửi đơn hàng đến API donhang.php
async function submitOrder(orderData) {
    try {
        console.log('Submitting order...');
        const apiUrl = 'http://localhost/web2/controller/donhang.php';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success) {
            showMessage('Tạo đơn hàng thành công','success');
            await clearCart();
            if(orderData.thanhtoan !== 'COD'){
            setTimeout(() => {
                window.location.href = `http://localhost/web2/controller/payment.php?amount=${orderData.tongtien}&action=${orderData.thanhtoan}&madh=${result.data.madh}`;
            }, 2000);
         }
         else{
             setTimeout(() => {
                window.location.href = 'lichsumuahang.html';
            }, 4000);
         }
        } else {
            showError(result.message || 'Có lỗi xảy ra khi đặt hàng!');
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
        showError('Lỗi kết nối đến server. Vui lòng thử lại sau!');
    }
}

// Hàm xóa từng sản phẩm trong giỏ hàng sau khi đặt hàng thành công
async function clearCart() {
    if (!customerId || cartItems.length === 0) {
        return;
    }
    
    try {
        for (const item of cartItems) {
            try {
                const response = await fetch(`http://localhost/web2/controller/cart.php?magio=${customerId}&masp=${item.masp}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                console.log(`Delete result for ${item.masp}:`, result);
                
            } catch (error) {
                console.error(`Lỗi khi xóa sản phẩm ${item.masp}:`, error);
            }
        }
        
        console.log('Đã hoàn thành xóa giỏ hàng');
        
    } catch (error) {
        console.error('Lỗi tổng quát khi xóa giỏ hàng:', error);
    }
}
// Hàm hiển thị modal xác nhận đơn giản
function showSimpleConfirm(message) {
    return new Promise((resolve) => {
        // Cập nhật message nếu có
        if (message) {
            document.querySelector('#simpleConfirmModal h5').textContent = message;
        }
        
        // Hiển thị modal
        $('#simpleConfirmModal').modal('show');
        
        // Xử lý khi nhấn nút Có
        $('#simpleConfirmYes').off('click').on('click', function() {
            $('#simpleConfirmModal').modal('hide');
            resolve(true);
        });
        
        // Xử lý khi nhấn nút Không
        $('#simpleConfirmNo').off('click').on('click', function() {
            $('#simpleConfirmModal').modal('hide');
            resolve(false);
        });
        
        // Xử lý khi đóng modal
        $('#simpleConfirmModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
            resolve(false);
        });
    });
}
// Xử lý sự kiện khi nhấn nút "Đặt hàng" - Sửa lại phần này
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners...');
    
    const orderBtn = document.getElementById('orderBtn');
    console.log('Order button found:', orderBtn);
    
    if (orderBtn) {
        orderBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Order button clicked!');
            
            // Kiểm tra form
            if (!validateForm()) {
                console.log('Form validation failed');
                return;
            }
            
            // Hiển thị xác nhận
            // Hiển thị modal xác nhận đơn giản

            
            // Tạo dữ liệu đơn hàng
            const orderData = createOrderData();
            
            // Hiển thị loading
            const originalText = orderBtn.innerHTML;
            orderBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang xử lý...';
            orderBtn.disabled = true;
            
            // Gửi đơn hàng đến API
            try {
                await submitOrder(orderData);
            } finally {
                // Khôi phục lại trạng thái nút
                orderBtn.innerHTML = originalText;
                orderBtn.disabled = false;
            }
        });
    } else {
        console.error('Order button not found!');
    }
    
    // Disable nút nếu giỏ hàng trống
    if (cartItems.length === 0) {
        const orderBtn = document.getElementById('orderBtn');
        if (orderBtn) {
            orderBtn.disabled = true;
            orderBtn.style.opacity = '0.5';
            orderBtn.style.cursor = 'not-allowed';
            orderBtn.onclick = function(e) {
                e.preventDefault();
                showError('Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.');
            };
        }
    }
});
</script>
<script>
// Đảm bảo trang luôn ở đầu khi tải
window.onload = function() {
    window.scrollTo(0, 0);
};

// Tùy chọn: đặt lại scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
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
    function buildAddressString(street, district, city) {
    let address = street;
    
    // Thêm district nếu có
    if (district) {
        address += ', ' + district;
    }
    
    // Thêm city nếu có
    if (city) {
        address += ', ' + city;
    }
    
    return address;
}

// Hàm hiển thị thông báo thành công trong modal
function showAddressSuccess(message) {
    // Xóa thông báo cũ nếu có
    const existingError = document.querySelector('.address-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Tạo thông báo thành công
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success address-error';
    successDiv.style.marginTop = '10px';
    successDiv.style.marginBottom = '10px';
    successDiv.innerHTML = '<i class="fa fa-check-circle"></i> ' + message;
    
    // Thêm vào trước nút "Thêm"
    const saveButton = document.getElementById('btn-save-address');
    saveButton.parentNode.insertBefore(successDiv, saveButton);
}

// Sự kiện khi modal đóng, xóa thông báo lỗi
$('#addressFormModal').on('hidden.bs.modal', function () {
    const existingError = document.querySelector('.address-error');
    if (existingError) {
        existingError.remove();
    }
});

    function showAddressError(message) {
    // Xóa thông báo lỗi cũ nếu có
    const existingError = document.querySelector('.address-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Tạo thông báo lỗi mới
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger address-error';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.marginBottom = '10px';
    errorDiv.innerHTML = '<i class="fa fa-exclamation-circle"></i> ' + message;
    
    // Thêm vào trước nút "Thêm"
    const saveButton = document.getElementById('btn-save-address');
    saveButton.parentNode.insertBefore(errorDiv, saveButton);
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}
    function validateAddressForm() {
    const street = document.getElementById('address-street').value.trim();
    const district = document.getElementById('address-district').value;
    const city = document.getElementById('address-city').value;
    
    // Kiểm tra các trường bắt buộc
    if (!street) {
        showAddressError('Vui lòng nhập số nhà, tên đường!');
        return false;
    }
    
    if (!district) {
        showAddressError('Vui lòng chọn phường/xã!');
        return false;
    }
    
    if (!city) {
        showAddressError('Vui lòng chọn tỉnh/thành phố!');
        return false;
    }
    
    return true;
}

       document.getElementById('btn-new-address').addEventListener('click', function() {
    $('#addressFormModal').modal('show');
    document.getElementById('addressFormModalLabel').textContent = 'Thay đổi địa chỉ giao hàng';
    document.getElementById('edit-address-id').value = '';
    document.getElementById('address-form').reset();
    
    // Xóa thông báo lỗi cũ nếu có
    const existingError = document.querySelector('.address-error');
    if (existingError) {
        existingError.remove();
    }
});


// Sự kiện khi nhấn nút "Thêm" trong modal form địa chỉ
document.getElementById('btn-save-address').addEventListener('click', function() {
    // Kiểm tra form
    if (!validateAddressForm()) {
        return;
    }
    
    // Lấy giá trị từ form
    const street = document.getElementById('address-street').value.trim();
    const district = document.getElementById('address-district').value;
    const city = document.getElementById('address-city').value;
    
    // Nối chuỗi địa chỉ
    const fullAddress = buildAddressString(street, district, city);
    
    // Gán vào trường địa chỉ giao hàng
    const addressInput = document.getElementById('address-select');
    addressInput.value = fullAddress;
    
    // Lưu vào sessionStorage để lần sau sử dụng
    sessionStorage.setItem('lastAddress', fullAddress);
    
    // Hiển thị thông báo thành công
    showAddressSuccess('Đã thêm địa chỉ mới thành công!');
    
    // Đóng modal sau 1 giây
    setTimeout(() => {
        $('#addressFormModal').modal('hide');
    }, 1000);
});


    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
    // Gọi hàm load danh mục ngay khi trang web tải xong
    loadCategoriesToSearchModal();
});

async function loadCategoriesToSearchModal() {
    const categorySelect = document.getElementById('advancedCategorySelect');
    
    // Đường dẫn API của bạn (thay đổi cho đúng với project của bạn)
    const apiUrl = 'http://localhost/web2/controller/danhmuc.php?action=all'; 

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

// Đặt dòng này ở cuối cùng trong thẻ <script>
showQRCode('cod');
    </script>
    </body>
</html>