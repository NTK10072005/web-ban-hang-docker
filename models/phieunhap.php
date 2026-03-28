<?php
class Phieunhap {
    private $conn;
    private $table_phieunhap = "phieunhap";
    private $table_chitiet = "chitietphieunhap";
    private $table_sanpham = "sanpham";

    public $mapn;
    public $ngaynhap;
    public $tongtien;
    public $chitiet = array(); // Dữ liệu nhận từ Client

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * THÊM PHIẾU NHẬP & CẬP NHẬT KHO
     * Công thức giá nhập: (Giá mới*SL mới + Giá cũ*Tồn cũ) / (SL mới + Tồn cũ)
     */
    public function themPhieuNhap() {
        $this->conn->begin_transaction();

        try {
            // 1. Tạo phiếu nhập cơ sở
           // 1. Thay đổi câu SQL: Chuyển 'NOW()' thành '?' để nhận dữ liệu từ biến
        $query_pn = "INSERT INTO " . $this->table_phieunhap . " (ngaynhap, tongtien) VALUES (?, 0)";
        $stmt_pn = $this->conn->prepare($query_pn);
        
        // Kiểm tra nếu biến ngaynhap rỗng thì lấy ngày giờ hiện tại của hệ thống (phòng hờ lỗi)
        $ngay_thuc_te = !empty($this->ngaynhap) ? $this->ngaynhap : date('Y-m-d H:i:s');
        
        // Bind biến vào dấu ?
        $stmt_pn->bind_param("s", $ngay_thuc_te);

        if (!$stmt_pn->execute()) {
            throw new Exception("Không thể tạo phiếu nhập: " . $stmt_pn->error);
        }
        
        $this->mapn = $stmt_pn->insert_id;
        $tong_bill = 0;

            // 2. Xử lý từng sản phẩm trong chi tiết
            foreach ($this->chitiet as $item) {
                $masp = (int)$item['masp'];
                $sl_nhap = (int)$item['soluong'];
                $gia_nhap_moi = (float)$item['gianhap'];

                // A. Lấy giá và tồn hiện tại (Khóa dòng để tránh xung đột)
                $query_sp = "SELECT gianhap, tonkho FROM " . $this->table_sanpham . " WHERE masp = ? FOR UPDATE";
                $stmt_sp = $this->conn->prepare($query_sp);
                $stmt_sp->bind_param("i", $masp);
                $stmt_sp->execute();
                $sp = $stmt_sp->get_result()->fetch_assoc();

                if (!$sp) throw new Exception("Sản phẩm ID $masp không tồn tại");

                // B. Tính toán giá vốn bình quân
                $ton_cu = (int)$sp['tonkho'];
                $gia_cu = (float)$sp['gianhap'];
                
                $tong_ton = $sl_nhap + $ton_cu;
                // Công thức: $$NewPrice = \frac{(P_{new} \times Q_{new}) + (P_{old} \times Q_{old})}{Q_{total}}$$
                $gia_binh_quan =round((($gia_nhap_moi * $sl_nhap) + ($gia_cu * $ton_cu)) / ($tong_ton > 0 ? $tong_ton : 1));
                // C. Cập nhật bảng sanpham
                $query_up_sp = "UPDATE " . $this->table_sanpham . " SET gianhap = ?, tonkho = ? WHERE masp = ?";
                $stmt_up_sp = $this->conn->prepare($query_up_sp);
                $stmt_up_sp->bind_param("dii", $gia_binh_quan, $tong_ton, $masp);
                $stmt_up_sp->execute();

                //Cập nhật giá bán theo giá nhập mới
                $query_update_gia = "UPDATE " . $this->table_sanpham . " SET gia = ROUND(? * (100 + tyle) / 100) WHERE masp = ? and tyle !=0";
$stmt_update_gia = $this->conn->prepare($query_update_gia);
$stmt_update_gia->bind_param("di", $gia_binh_quan, $masp);
$stmt_update_gia->execute();

                // D. Lưu vào chitietphieunhap
                $query_ct = "INSERT INTO " . $this->table_chitiet . " (mapn, masp, soluong,gianhap) VALUES (?, ?, ?,?)";
                $stmt_ct = $this->conn->prepare($query_ct);
                $stmt_ct->bind_param("iiid", $this->mapn, $masp, $sl_nhap, $gia_binh_quan);
                $stmt_ct->execute();

                $tong_bill += ( $gia_binh_quan * $sl_nhap);
            }

            // 3. Cập nhật lại tổng tiền cho phiếu nhập
            $query_up_pn = "UPDATE " . $this->table_phieunhap . " SET tongtien = ? WHERE mapn = ?";
            $stmt_up_pn = $this->conn->prepare($query_up_pn);
            $stmt_up_pn->bind_param("di", $tong_bill, $this->mapn);
            $stmt_up_pn->execute();

            $this->conn->commit();
            $this->tongtien = $tong_bill;
            return true;

        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Lỗi PhieuNhap: " . $e->getMessage());
            return false;
        }
    }

    /**
     * LẤY DANH SÁCH TẤT CẢ PHIẾU NHẬP
     */
    /**
 * Lấy tất cả danh sách phiếu nhập kèm số lượng sản phẩm
 */
public function layTatCaPhieuNhap() {
    try {
        $query = "SELECT 
                    pn.*, 
                    DATE_FORMAT(pn.ngaynhap, '%d/%m/%Y %H:%i') as ngaynhap_formatted,
                    COUNT(ct.masp) as tong_mathang,
                    SUM(ct.soluong) as tong_soluong
                  FROM " . $this->table_phieunhap . " pn
                  LEFT JOIN " . $this->table_chitiet . " ct ON pn.mapn = ct.mapn
                  GROUP BY pn.mapn
                  ORDER BY pn.ngaynhap DESC";
        
        return $this->conn->query($query);
    } catch (Exception $e) {
        error_log("Lỗi layTatCaPhieuNhap: " . $e->getMessage());
        return false;
    }
}

    /**
     * LẤY THÔNG TIN 1 PHIẾU NHẬP THEO MÃ
     */
    public function layPhieuNhapTheoMa() {
        $query = "SELECT *, DATE_FORMAT(ngaynhap, '%d/%m/%Y %H:%i') as ngaynhap_formatted 
                  FROM " . $this->table_phieunhap . " WHERE mapn = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->mapn);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    /**
     * LẤY CHI TIẾT SẢN PHẨM CỦA PHIẾU NHẬP
     */
    public function layChiTietPhieuNhap() {
        $query = "SELECT ct.*, sp.tensp,sp.link,sp.tacgia
                  FROM " . $this->table_chitiet . " ct
                  JOIN " . $this->table_sanpham . " sp ON ct.masp = sp.masp
                  WHERE ct.mapn = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->mapn);
        $stmt->execute();
        return $stmt->get_result();
    }
    public function timKiemPhieuNhapTheoNgay($ngayBatDau, $ngayKetThuc) {
    try {
        $query = "SELECT 
                    pn.*, 
                    DATE_FORMAT(pn.ngaynhap, '%d/%m/%Y %H:%i') as ngaynhap_formatted,
                    COUNT(ct.masp) as tong_mathang,
                    SUM(ct.soluong) as tong_soluong
                  FROM " . $this->table_phieunhap . " pn
                  LEFT JOIN " . $this->table_chitiet . " ct ON pn.mapn = ct.mapn";
        
        $conditions = [];
        $params = [];
        $types = "";
        
        // Xử lý các trường hợp ngày
        if (!empty($ngayBatDau) && !empty($ngayKetThuc)) {
            // Cả hai ngày đều có giá trị
            $conditions[] = "DATE(pn.ngaynhap) BETWEEN ? AND ?";
            $params[] = $ngayBatDau;
            $params[] = $ngayKetThuc;
            $types .= "ss";
        } elseif (!empty($ngayBatDau) && empty($ngayKetThuc)) {
            // Chỉ có ngày bắt đầu
            $conditions[] = "DATE(pn.ngaynhap) >= ?";
            $params[] = $ngayBatDau;
            $types .= "s";
        } elseif (empty($ngayBatDau) && !empty($ngayKetThuc)) {
            // Chỉ có ngày kết thúc
            $conditions[] = "DATE(pn.ngaynhap) <= ?";
            $params[] = $ngayKetThuc;
            $types .= "s";
        }
        // Nếu cả hai đều rỗng thì không thêm điều kiện WHERE
        
        // Thêm điều kiện vào query nếu có
        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }
        
        $query .= " GROUP BY pn.mapn ORDER BY pn.ngaynhap DESC";
        
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters nếu có
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        
        return $stmt->get_result();
    } catch (Exception $e) {
        error_log("Lỗi timKiemPhieuNhapTheoNgay: " . $e->getMessage());
        return false;
    }
}
}
?>