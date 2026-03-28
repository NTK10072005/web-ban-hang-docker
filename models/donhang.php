<?php
class Donhang {
    private $conn;
    private $table_name_donhang = "donhang";
    private $table_name_chitiet = "chitietdonhang";
    
    // Object properties
    public $madh;
    public $makh;
    public $ngaydat;
    public $diachi;
    public $sdt;
    public $tongtien;
    public $thanhtoan;
    public $trangthaidon;
    
    // Chi tiết đơn hàng (mảng)
    public $chitiet = array();
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Thêm đơn hàng mới (bao gồm cả chi tiết đơn hàng)
     * Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
     */
   public function themDonhang() {
        // Bắt đầu transaction
        $this->conn->begin_transaction();
        
        try {
            // 1. Thêm vào bảng donhang (KHÔNG có madh vì auto-increment)
            $query = "INSERT INTO " . $this->table_name_donhang . " 
                     (makh, ngaydat, diachi, sdt, tongtien, thanhtoan,trangthaidon) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($query);
            
            // Làm sạch dữ liệu
            $makh = (int)$this->makh;
            $ngaydat = htmlspecialchars(strip_tags($this->ngaydat));
            $diachi = htmlspecialchars(strip_tags($this->diachi));
            $sdt = htmlspecialchars(strip_tags($this->sdt));
            $tongtien = (float)$this->tongtien;
            $thanhtoan = htmlspecialchars(strip_tags($this->thanhtoan));
            $trangthaidon = (int)$this->trangthaidon;
            
            $stmt->bind_param("isssdsi", 
                $makh, $ngaydat, $diachi, $sdt,
                $tongtien, $thanhtoan,$trangthaidon
            );
            
            if (!$stmt->execute()) {
                throw new Exception("Không thể thêm đơn hàng: " . $stmt->error);
            }
            
            // Lấy madh vừa được tạo (auto-increment)
            $this->madh = $stmt->insert_id;
            
            // 2. Thêm chi tiết đơn hàng
            foreach ($this->chitiet as $item) {
                $query_chitiet = "INSERT INTO " . $this->table_name_chitiet . " 
                                 (madh, masp, soluong,giamgia) 
                                 VALUES (?, ?, ?,?)";
                
                $stmt_chitiet = $this->conn->prepare($query_chitiet);
                
                $masp = (int)$item['masp'];
                $soluong = (int)$item['soluong'];
                $giamgia = isset($item['giamgia']) ? (float)$item['giamgia'] : 0;
                $stmt_chitiet->bind_param("iiid", $this->madh, $masp, $soluong, $giamgia);
                
                if (!$stmt_chitiet->execute()) {
                    throw new Exception("Không thể thêm chi tiết đơn hàng: " . $stmt_chitiet->error);
                }
                
                // 3. Có thể trừ số lượng tồn kho ở đây nếu cần
                // $this->capNhatSoLuongTon($masp, $soluong);
            }
            
            // Commit transaction nếu tất cả thành công
            $this->conn->commit();
            return true;
            
        } catch (Exception $e) {
            // Rollback nếu có lỗi
            $this->conn->rollback();
            error_log("Donhang error: " . $e->getMessage());
            throw $e;
        }
    }
      
    /**
     * Cập nhật trạng thái đơn hàng (trangthaidon)
     */
   public function capNhatTrangThaiDonHang() {
    try {
        $query = "UPDATE donhang
                 SET trangthaidon = ?
                 WHERE madh = ?
                 AND ? >= trangthaidon
                 AND trangthaidon != 0";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isi", $this->trangthaidon, $this->madh, $this->trangthaidon);
        
        if ($stmt->execute()) {
            // Kiểm tra xem có dòng nào bị ảnh hưởng không
            if ($stmt->affected_rows > 0) {
                return true;
            } else {
                // Không có dòng nào được cập nhật
                return false;
            }
        } else {
            // Nếu execute() trả về false (có lỗi trong truy vấn)
            return false;
        }
    } catch (Exception $e) {
        error_log("Cap nhat trang thai don hang error: " . $e->getMessage());
        return false;
    }
}
 public function capNhatTrangThaiDonHangpayment() {
    try {
        $query = "UPDATE donhang
                 SET trangthaidon = ?
                 WHERE madh = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $this->trangthaidon, $this->madh);
        
        if ($stmt->execute()) {
            // Kiểm tra xem có dòng nào bị ảnh hưởng không
            if ($stmt->affected_rows > 0) {
                return true;
            } else {
                // Không có dòng nào được cập nhật
                return false;
            }
        } else {
            // Nếu execute() trả về false (có lỗi trong truy vấn)
            return false;
        }
    } catch (Exception $e) {
        error_log("Cap nhat trang thai don hang error: " . $e->getMessage());
        return false;
    }
}


public function timKiemDonhangTheoNgayVaTrangThai($tungay = null, $denngay = null, $trangthai = null) {
    try {
        // Xây dựng câu truy vấn động
        $query = "SELECT 
                     dh.*,
                     kh.hoten as tenkhachhang,
                     kh.email,
                     kh.sdt as sdt_khachhang,
                     COUNT(ctdh.masp) as tong_sanpham,
                     SUM(ctdh.soluong) as tong_soluong,
                     DATE_FORMAT(dh.ngaydat, '%d/%m/%Y %H:%i') as ngaydat_formatted
                 FROM " . $this->table_name_donhang . " dh
                 LEFT JOIN khachhang kh ON dh.makh = kh.makh
                 LEFT JOIN chitietdonhang ctdh ON dh.madh = ctdh.madh
                 WHERE 1=1";
        
        $params = array();
        $types = "";
        
        // Thêm điều kiện tìm kiếm theo ngày
        if (!empty($tungay)) {
            $query .= " AND DATE(dh.ngaydat) >= ?";
            $params[] = $tungay;
            $types .= "s";
        }
        
        if (!empty($denngay)) {
            $query .= " AND DATE(dh.ngaydat) <= ?";
            $params[] = $denngay;
            $types .= "s";
        }
        
        // Thêm điều kiện trạng thái (nếu có)
        if ($trangthai !== null && $trangthai !== '') {
            $query .= " AND dh.trangthaidon = ?";
            $params[] = (int)$trangthai;
            $types .= "i";
        }
        
        // Group by và order by
        $query .= " GROUP BY dh.madh
                   ORDER BY dh.ngaydat DESC";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters nếu có
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        return $stmt->get_result();
        
    } catch (Exception $e) {
        error_log("Tim kiem don hang theo ngay va trang thai error: " . $e->getMessage());
        return false;
    }
}

    
    /**
     * Cập nhật thông tin đơn hàng (địa chỉ, sdt)
     */
    public function capNhatThongTinDonhang() {
        try {
            $query = "UPDATE " . $this->table_name_donhang . " 
                     SET diachi = ?, sdt = ?, ngaycapnhat = NOW()
                     WHERE madh = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("sss", $this->diachi, $this->sdt, $this->madh);
            
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Cap nhat thong tin don hang error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Lấy thông tin đơn hàng theo mã
     */
    public function layDonhangTheoMa() {
        try {
            $query = "SELECT 
                         dh.*,
                         kh.hoten as tenkhachhang,
                         kh.email
                     FROM " . $this->table_name_donhang . " dh
                     LEFT JOIN khachhang kh ON dh.makh = kh.makh
                     WHERE dh.madh = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("s", $this->madh);
            $stmt->execute();
            
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                return $result->fetch_assoc();
            }
            return null;
        } catch (Exception $e) {
            error_log("Lay don hang theo ma error: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Lấy đơn hàng theo khách hàng
     */
    public function layDonhangTheoKhachHang() {
        try {
            $query = "SELECT 
                         madh, makh, ngaydat, tongtien, 
                         thanhtoan,trangthaidon,
                         DATE_FORMAT(ngaydat, '%d/%m/%Y %H:%i') as ngaydat_formatted
                     FROM " . $this->table_name_donhang . " 
                     WHERE makh = ?
                     ORDER BY ngaydat DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $this->makh);
            $stmt->execute();
            
            return $stmt->get_result();
        } catch (Exception $e) {
            error_log("Lay don hang theo khach hang error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Lấy chi tiết đơn hàng
     */
    public function layChiTietDonhang() {
        try {
            $query = "SELECT 
                         ctdh.masp, ctdh.soluong, ctdh.giamgia*100 as giamgia,
                         sp.tensp, sp.gia, sp.link,
                         (ctdh.soluong * sp.gia*(1-ctdh.giamgia)) as thanhtien
                     FROM " . $this->table_name_chitiet . " ctdh
                     LEFT JOIN sanpham sp ON ctdh.masp = sp.masp
                     WHERE ctdh.madh = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $this->madh);
            $stmt->execute();
            
            return $stmt->get_result();
        } catch (Exception $e) {
            error_log("Lay chi tiet don hang error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Xóa đơn hàng (có thể là soft delete hoặc hard delete)
     */
    public function xoaDonhang() {
        // TH1: Hard delete (xóa vĩnh viễn)
        try {
            // Bắt đầu transaction
            $this->conn->begin_transaction();
            
            // 1. Xóa chi tiết đơn hàng
            $query1 = "DELETE FROM " . $this->table_name_chitiet . " WHERE madh = ?";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bind_param("s", $this->madh);
            
            if (!$stmt1->execute()) {
                throw new Exception("Không thể xóa chi tiết đơn hàng");
            }
            
            // 2. Xóa đơn hàng
            $query2 = "DELETE FROM " . $this->table_name_donhang . " WHERE madh = ?";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bind_param("s", $this->madh);
            
            if (!$stmt2->execute()) {
                throw new Exception("Không thể xóa đơn hàng");
            }
            
            $this->conn->commit();
            return true;
            
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Xoa don hang error: " . $e->getMessage());
            return false;
        }
        
        /*
        // TH2: Soft delete (nếu muốn giữ lại dữ liệu)
        $query = "UPDATE " . $this->table_name_donhang . " 
                 SET trangthaidon = 99, ngaycapnhat = NOW() 
                 WHERE madh = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $this->madh);
        
        return $stmt->execute();
        */
    }
    
    /**
     * Cập nhật số lượng tồn kho (nếu cần)
     */
    private function capNhatSoLuongTon($masp, $soluong) {
        $query = "UPDATE sanpham 
                 SET soluongton = soluongton - ? 
                 WHERE masp = ? AND soluongton >= ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iii", $soluong, $masp, $soluong);
        
        return $stmt->execute();
    }
    
    /**
     * Lấy tất cả đơn hàng (cho admin)
     */
    public function layTatCaDonhang() {
        try {
            $query = "SELECT 
                         dh.*,
                         kh.hoten as tenkhachhang,
                         COUNT(ctdh.masp) as tong_sanpham
                     FROM " . $this->table_name_donhang . " dh
                     LEFT JOIN khachhang kh ON dh.makh = kh.makh
                     LEFT JOIN chitietdonhang ctdh ON dh.madh = ctdh.madh
                     GROUP BY dh.madh
                     ORDER BY dh.ngaydat DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->get_result();
        } catch (Exception $e) {
            error_log("Lay tat ca don hang error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Thống kê đơn hàng
     */
    public function thongKeDonhang() {
        try {
            $query = "SELECT 
                         COUNT(*) as tong_donhang,
                         SUM(CASE WHEN trangthaidon = 1 THEN 1 ELSE 0 END) as dang_xu_ly,
                         SUM(CASE WHEN trangthaidon = 2 THEN 1 ELSE 0 END) as dang_giao,
                         SUM(CASE WHEN trangthaidon = 3 THEN 1 ELSE 0 END) as hoan_thanh,
                         SUM(CASE WHEN trangthaidon = 4 THEN 1 ELSE 0 END) as da_huy,
                         SUM(tongtien) as tong_doanhthu
                     FROM " . $this->table_name_donhang . "
                     WHERE trangthaidon IN (1,2,3)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                return $result->fetch_assoc();
            }
            return null;
        } catch (Exception $e) {
            error_log("Thong ke don hang error: " . $e->getMessage());
            return null;
        }
    }
}
?>