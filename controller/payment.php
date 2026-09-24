<?php
// payment.php - Payment Controller
session_start();

// Lấy tham số từ GET
$amount = isset($_GET['amount']) ? $_GET['amount'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : '';
$madh = isset($_GET['madh']) ? $_GET['madh'] : '';
// Kiểm tra các tham số bắt buộc
if (empty($amount) || empty($action) || empty($madh)) {
    die("Thiếu tham số bắt buộc. Vui lòng cung cấp: amount, action, madh");
}

// Xử lý theo phương thức thanh toán
if ($action == 'VN Pay') {
    // Xử lý cho VNPAY - tạo form với form-data
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chuyển hướng thanh toán VNPAY</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <form id="paymentForm" action="../vnpay_php/vnpay_create_payment.php" method="post" enctype="multipart/form-data">
            <input type="hidden" name="amount" value="<?php echo htmlspecialchars($amount); ?>">
            <input type="hidden" name="madh" value="<?php echo htmlspecialchars($madh); ?>">
            <!-- Có thể thêm các trường khác nếu cần -->
        </form>
        
        <script>
            // Tự động submit form
            document.getElementById('paymentForm').submit();
        </script>
        
        <p>Đang chuyển hướng đến cổng thanh toán VNPAY...</p>
    </body>
    </html>
    <?php
    
} elseif ($action == 'MOMO') {
   $api_url = "/momo_php/index.php";
    $post_data = array(
        'orderId' => $madh, // Sử dụng biến $madh từ GET ở trên
        'amount' => $amount
    );

    // 2. Sử dụng cURL để gọi API
    $ch = curl_init($api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    // 3. Giải mã kết quả JSON
    $result = json_decode($response, true);

    // 4. Xử lý logic chuyển hướng hoặc thông báo lỗi
    if (isset($result['success']) && $result['success'] === true && !empty($result['payUrl'])) {
        // Nếu thành công, chuyển hướng ngay lập tức
        header('Location: ' . $result['payUrl']);
        exit();
    } else {
        ?>
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lỗi Thanh Toán</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f8f9fa;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }
                .icon {
                    font-size: 64px;
                    color: #dc3545;
                    margin-bottom: 20px;
                }
                h2 {
                    color: #333;
                    margin-bottom: 10px;
                }
                p {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                .btn-home {
                    display: inline-block;
                    background-color: #A50064; /* Màu thương hiệu MoMo hoặc tùy chọn */
                    color: white;
                    text-decoration: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: background 0.3s;
                }
                .btn-home:hover {
                    background-color: #820050;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">✕</div>
                <h2>Thanh toán thất bại</h2>
                <p>Không thể tạo đường dẫn thanh toán MoMo lúc này. Vui lòng thử lại sau hoặc chọn phương thức khác.</p>
                <a href="../index.html" class="btn-home">Quay về Trang chủ</a>
            </div>
        </body>
        </html>
        <?php
    }
} 

?>