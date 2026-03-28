<?php
// File: momo-result.php
session_start();
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kết Quả Thanh Toán MoMo</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            width: 100%;
            max-width: 500px;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.5s ease-out;
        }
        
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .header {
            background: linear-gradient(to right, #d32f2f, #ff5252);
            padding: 30px 20px;
            text-align: center;
            color: white;
            position: relative;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            width: 100%;
            height: 40px;
            background: white;
            border-radius: 50% 50% 0 0;
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .logo-icon {
            font-size: 32px;
            background: white;
            color: #d32f2f;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo-text {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        
        .header h1 {
            font-size: 22px;
            font-weight: 500;
            margin-top: 10px;
            opacity: 0.9;
        }
        
        .result-card {
            padding: 40px 30px;
            text-align: center;
        }
        
        .result-icon {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
        }
        
        .success .result-icon {
            background: #e8f5e9;
            color: #4caf50;
            border: 5px solid #c8e6c9;
        }
        
        .error .result-icon {
            background: #ffebee;
            color: #f44336;
            border: 5px solid #ffcdd2;
        }
        
        .result-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .success .result-title {
            color: #2e7d32;
        }
        
        .error .result-title {
            color: #c62828;
        }
        
        .result-message {
            font-size: 16px;
            color: #666;
            line-height: 1.5;
            margin-bottom: 30px;
        }
        
        .order-details {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin: 30px 0;
            text-align: left;
        }
        
        .order-details h3 {
            color: #333;
            font-size: 18px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .order-details h3 i {
            color: #d32f2f;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            color: #666;
            font-weight: 500;
        }
        
        .detail-value {
            color: #333;
            font-weight: 600;
        }
        
        .amount {
            color: #d32f2f;
            font-size: 18px;
        }
        
        .status {
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
        }
        
        .status-success {
            background: #e8f5e9;
            color: #2e7d32;
        }
        
        .status-failed {
            background: #ffebee;
            color: #c62828;
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn {
            flex: 1;
            padding: 16px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .btn-primary {
            background: linear-gradient(to right, #d32f2f, #ff5252);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 15px rgba(255, 82, 82, 0.3);
        }
        
        .btn-secondary {
            background: #f0f0f0;
            color: #666;
        }
        
        .btn-secondary:hover {
            background: #e0e0e0;
            transform: translateY(-3px);
        }
        
        .note {
            margin-top: 25px;
            padding: 15px;
            background: #fff8e1;
            border-radius: 10px;
            color: #f57c00;
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            text-align: left;
        }
        
        .note i {
            margin-top: 2px;
            font-size: 18px;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
        }
        
        @media (max-width: 480px) {
            .container {
                border-radius: 15px;
            }
            
            .result-card {
                padding: 30px 20px;
            }
            
            .buttons {
                flex-direction: column;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Kết Quả Thanh Toán</h1>
        </div>
        
        <div class="result-card <?php echo (isset($_GET['resultCode']) && $_GET['resultCode'] == 0) ? 'success' : 'error'; ?>">
            <?php
            // Lấy tham số từ URL
            $resultCode = isset($_GET['resultCode']) ? $_GET['resultCode'] : null;
            $orderId = isset($_GET['orderId']) ? $_GET['orderId'] : 'N/A';
            $amount = isset($_GET['amount']) ? intval($_GET['amount']) : 0;
            $message = isset($_GET['message']) ? urldecode($_GET['message']) : 'Không có thông báo';
            $transId = isset($_GET['transId']) ? $_GET['transId'] : 'N/A';
            $responseTimeRaw = isset($_GET['responseTime']) ? $_GET['responseTime'] : null;
if ($responseTimeRaw && is_numeric($responseTimeRaw)) {
    // MoMo trả về miligiây (13 chữ số), chia cho 1000 để đổi sang giây
    $timestamp = $responseTimeRaw / 1000; 
    $responseTime = date('d/m/Y H:i:s', $timestamp);
} else {
    // Nếu không có hoặc không phải số, lấy thời gian hiện tại
    $responseTime = date('d/m/Y H:i:s');
}
            if ($resultCode == 0) {
                 // Thanh toán thành công
                 $madh_parts = explode('_', $orderId);
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
               
                echo '<div class="result-icon"><i class="fas fa-check-circle"></i></div>';
                echo '<h2 class="result-title">Thanh Toán Thành Công!</h2>';
                echo '<p class="result-message">Giao dịch của bạn đã được xử lý thành công.</p>';
                $statusClass = 'status-success';
                $statusText = 'Đã thanh toán';
            } else {
                // Thanh toán thất bại
                echo '<div class="result-icon"><i class="fas fa-times-circle"></i></div>';
                echo '<h2 class="result-title">Thanh Toán Thất Bại</h2>';
                echo '<p class="result-message">Rất tiếc, giao dịch của bạn không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>';
                $statusClass = 'status-failed';
                $statusText = 'Thất bại';
            }
            ?>
            
            <div class="order-details">
                <h3><i class="fas fa-receipt"></i> Chi Tiết Giao Dịch</h3>
                
                <div class="detail-row">
                    <span class="detail-label">Mã đơn hàng:</span>
                    <span class="detail-value"><?php echo htmlspecialchars($orderId); ?></span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Số tiền:</span>
                    <span class="detail-value amount"><?php echo number_format($amount); ?> ₫</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Trạng thái:</span>
                    <span class="detail-value status <?php echo $statusClass; ?>"><?php echo $statusText; ?></span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Mã giao dịch:</span>
                    <span class="detail-value"><?php echo htmlspecialchars($transId); ?></span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Thời gian:</span>
                    <span class="detail-value"><?php echo htmlspecialchars($responseTime); ?></span>
                </div>
                
                <?php if (isset($_GET['resultCode']) && $_GET['resultCode'] != 0): ?>
                <div class="detail-row">
                    <span class="detail-label">Mã lỗi:</span>
                    <span class="detail-value"><?php echo htmlspecialchars($resultCode); ?></span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Thông báo lỗi:</span>
                    <span class="detail-value"><?php echo htmlspecialchars($message); ?></span>
                </div>
                <?php endif; ?>
            </div>
            
            <div class="note">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Lưu ý:</strong> 
                    <?php 
                    if ($resultCode == 0) {
                        echo 'Đơn hàng của bạn sẽ được xử lý trong vòng 24h ';
                    } else {
                        echo 'Nếu số tiền đã bị trừ nhưng giao dịch thất bại, tiền sẽ được hoàn lại trong 3-5 ngày làm việc.';
                    }
                    ?>
                </div>
            </div>
            
            <div class="buttons">
                <a href="../index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i> Về Trang Chủ
                </a>
            </div>
        </div>
        
       
    </div>
</html>