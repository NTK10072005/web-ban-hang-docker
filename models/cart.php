<?php
class Cart {
    private $conn;
    private $table_name = "giohang";
    
    // Object properties
    public $id;
    public $magio;
    public $masp;
    public $soluong;
    public $trangthai;
    public $created_at;
    public $updated_at;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     * Nếu sản phẩm đã tồn tại thì cộng dồn số lượng
     */
    public function addToCart() {
        try {
            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            $existingItem = $this->getCartItem();
            
            if ($existingItem) {
                // Cập nhật số lượng: số lượng hiện tại + số lượng mới
                $newQuantity = $existingItem['soluong'] + $this->soluong;
                return $this->updateQuantity($newQuantity);
            } else {
                // Thêm mới sản phẩm vào giỏ hàng
                $query = "INSERT INTO " . $this->table_name . " 
                         (magio, masp, soluong, trangthai) 
                         VALUES (?, ?, ?, ?)";
                
                $stmt = $this->conn->prepare($query);
                
                // Làm sạch dữ liệu
                $this->magio = htmlspecialchars(strip_tags($this->magio));
                $this->masp = htmlspecialchars(strip_tags($this->masp));
                $this->soluong = htmlspecialchars(strip_tags($this->soluong));
                $this->trangthai = htmlspecialchars(strip_tags($this->trangthai));
                
                $stmt->bind_param("siii", 
                    $this->magio, 
                    $this->masp, 
                    $this->soluong, 
                    $this->trangthai
                );
                
                if ($stmt->execute()) {
                    return true;
                }
                return false;
            }
        } catch (Exception $e) {
            error_log("Cart add error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Lấy thông tin một sản phẩm trong giỏ hàng
     */
    private function getCartItem() {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE magio = ? AND masp = ? AND trangthai = 1 
                 LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $this->magio, $this->masp);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        return false;
    }
    
    /**
     * Cập nhật số lượng sản phẩm
     */
    private function updateQuantity($newQuantity) {
        $newQuantity = max(1, $newQuantity);
        $query = "UPDATE " . $this->table_name . " 
                 SET soluong = ?
                 WHERE magio = ? AND masp = ? AND trangthai = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isi", $newQuantity, $this->magio, $this->masp);
        
        return $stmt->execute();
    }
    
    /**
     * Lấy tất cả sản phẩm trong giỏ hàng
     */
    public function getCartItems() {
        $query = "SELECT g.magio, g.masp, g.soluong, g.trangthai, p.tensp, p.tacgia, p.danhmuc, p.gia, p.mota, p.link, COALESCE(km.max_heso, 0) AS hesogiamgia, (g.soluong * p.gia * (1 - COALESCE(km.max_heso, 0))) AS thanhtien FROM " . $this->table_name . " g INNER JOIN sanpham p ON g.masp = p.masp LEFT JOIN ( SELECT masp, MAX(heso) AS max_heso FROM khuyenmai WHERE CURDATE() BETWEEN ngaybatdau AND ngayketthuc GROUP BY masp ) km ON g.masp = km.masp WHERE g.magio = ? AND g.trangthai = 1";

                 
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->magio);
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    /**
     * Cập nhật số lượng cụ thể
     */
    public function updateCartItem() {
        $query = "UPDATE " . $this->table_name . " 
                 SET soluong = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE magio = ? AND masp = ? AND trangthai = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isi", $this->soluong, $this->magio, $this->masp);
        
        return $stmt->execute();
    }
    
    /**
     * Xóa sản phẩm khỏi giỏ hàng (soft delete)
     */
    public function removeFromCart() {
        $query = "Delete from " . $this->table_name . " 
                 WHERE magio = ? AND masp = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $this->magio, $this->masp);
        
        return $stmt->execute();
    }
    
    /**
     * Xóa toàn bộ giỏ hàng (soft delete)
     */
    public function clearCart() {
        $query = "Delete from " . $this->table_name . " 
                 WHERE magio = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $this->magio);
        
        return $stmt->execute();
    }
    
    /**
     * Đếm số lượng sản phẩm trong giỏ hàng
     */
    public function countItems() {
        $query = "SELECT COUNT(*) as total_items, SUM(soluong) as total_quantity 
                 FROM " . $this->table_name . " 
                 WHERE magio = ? AND trangthai = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $this->magio);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        return array('total_items' => 0, 'total_quantity' => 0);
    }
    
    /**
     * Tính tổng tiền giỏ hàng
     */
    public function getCartTotal() {
        $query = "SELECT SUM(g.soluong * p.gia) as total_amount
                 FROM " . $this->table_name . " g
                 INNER JOIN sanpham p ON g.masp = p.masp
                 WHERE g.magio = ? AND g.trangthai = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $this->magio);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $row['total_amount'] ? $row['total_amount'] : 0;
        }
        return 0;
    }
}
?>