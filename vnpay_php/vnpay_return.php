<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>VNPAY RESPONSE</title>
        <link href="./assets/bootstrap.min.css" rel="stylesheet"/>
        <link href="./assets/jumbotron-narrow.css" rel="stylesheet">         
        <script src="./assets/jquery-1.11.3.min.js"></script>
    </head>
    <body>
        <?php
        require_once("./config.php");

        // 1. Lấy và an toàn hóa dữ liệu đầu vào
        $vnp_SecureHash = $_GET['vnp_SecureHash'] ?? "";
        $inputData = array();
        foreach ($_GET as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
        
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        // 2. Kiểm tra chữ ký
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        
        // Lấy các giá trị quan trọng (dùng ?? để tránh lỗi Warning)
        $vnp_ResponseCode = $_GET['vnp_ResponseCode'] ?? "";
        $vnp_TransactionStatus = $_GET['vnp_TransactionStatus'] ?? "";
        $vnp_TxnRef = $_GET['vnp_TxnRef'] ?? "N/A";
        $vnp_Amount = $_GET['vnp_Amount'] ?? 0;
        $vnp_TransactionNo = $_GET['vnp_TransactionNo'] ?? "0";
        $vnp_BankCode = $_GET['vnp_BankCode'] ?? "N/A";
        $vnp_PayDate = $_GET['vnp_PayDate'] ?? "";
        $vnp_OrderInfo = $_GET['vnp_OrderInfo'] ?? "";

        $isSuccess = false;

        // 3. Xử lý Logic khi Chữ ký hợp lệ
        if ($secureHash == $vnp_SecureHash) {
            // Check thành công (Cả ResponseCode và TransactionStatus phải là 00)
            if ($vnp_ResponseCode == '00' && $vnp_TransactionStatus == '00') {
                $isSuccess = true;
                
                // Gọi API cập nhật database của bạn
                $madh_parts = explode('_', $vnp_TxnRef);
                $madh = $madh_parts[0];
                
                $api_url = 'http://localhost/web2/controller/donhang.php';
                $post_data = array(
                    'madh' => $madh,
                    'action' => 'suapay',
                    'trangthaidon' => 1
                );
                
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $api_url);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
                
                $api_response = curl_exec($ch);
                curl_close($ch);
            }
        }
        ?>

        <div class="container">
            <div class="header clearfix">
                <h3 class="text-muted">KẾT QUẢ THANH TOÁN</h3>
            </div>
            <div class="table-responsive">
                <div class="form-group">
                    <label>Mã đơn hàng:</label>
                    <label><?php echo htmlspecialchars($vnp_TxnRef) ?></label>
                </div>    
                <div class="form-group">
                    <label>Số tiền:</label>
                    <label><?php echo number_format($vnp_Amount / 100) ?> VND</label>
                </div>  
                <div class="form-group">
                    <label>Nội dung thanh toán:</label>
                    <label><?php echo htmlspecialchars($vnp_OrderInfo) ?></label>
                </div> 
                <div class="form-group">
    <label>Mã phản hồi / Trạng thái:</label>
    <label>
        <?php 
            // Nếu có ResponseCode thì hiện, không thì hiện TransactionStatus
            echo htmlspecialchars($vnp_ResponseCode ?: $vnp_TransactionStatus); 
        ?>
    </label>
</div> 
                <div class="form-group">
                    <label>Mã GD Tại VNPAY:</label>
                    <label><?php echo htmlspecialchars($vnp_TransactionNo) ?></label>
                </div> 
                <div class="form-group">
                    <label>Mã Ngân hàng:</label>
                    <label><?php echo htmlspecialchars($vnp_BankCode) ?></label>
                </div> 
                <div class="form-group">
                    <label>Thời gian thanh toán:</label>
                    <label><?php echo htmlspecialchars($vnp_PayDate) ?></label>
                </div> 
               <div class="form-group">
    <label>Kết quả:</label>
    <label>
        <?php
        if ($secureHash == $vnp_SecureHash) {
            if ($isSuccess) {
                echo "<span style='color:blue; font-weight:bold'>Thanh toán thành công</span>";
            } else {
                // Hiển thị mã lỗi cụ thể từ một trong hai biến
                $displayErr = $vnp_ResponseCode ?: $vnp_TransactionStatus;
                echo "<span style='color:red; font-weight:bold'>Giao dịch thất bại (Mã lỗi: $displayErr)</span>";
            }
        } else {
            echo "<span style='color:red; font-weight:bold'>Chữ ký không hợp lệ (Sai checksum)</span>";
        }
        ?>
    </label>
</div>
                
                <div class="form-group" style="margin-top: 20px;">
                    <a href="../index.html" class="btn btn-primary">Quay về trang chủ</a>
                </div>
            </div>
            <footer class="footer">
                <p>&copy; VNPAY <?php echo date('Y')?></p>
            </footer>
        </div>  
    </body>
</html>