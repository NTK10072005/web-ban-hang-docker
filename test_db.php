<?php
$host = "db";
$user = "root";
$pass = "";
$db   = "web2";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo "<h1>❌ Lỗi kết nối: " . $conn->connect_error . "</h1>";
} else {
    echo "<h1>✅ Kết nối thành công tới Docker DB!</h1>";
    
    // Thử lấy danh sách sản phẩm xem có dữ liệu không
    $result = $conn->query("SELECT * FROM sanpham LIMIT 5");
    if ($result && $result->num_rows > 0) {
        echo "<p>Đã tìm thấy " . $result->num_rows . " sản phẩm đầu tiên.</p>";
    } else {
        echo "<p>Bảng sanpham trống hoặc bị lỗi truy vấn.</p>";
    }
}
?>