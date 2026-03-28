// ==================== MUA NGAY - MODAL ĐƠN GIẢN ====================

// Biến lưu sản phẩm đang chọn
let currentProductId = null;

// Tạo modal nếu chưa có
if (!document.getElementById('buyNowModal')) {
    const modalHTML = `
    <div id="buyNowModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2000;align-items:center;justify-content:center;">
        <div style="background:white;border-radius:8px;padding:20px;width:90%;max-width:300px;">
            <h3 style="margin:0 0 15px 0; text-align: center;">Mua Ngay</h3>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
                <button id="decreaseBtn" style="width:30px;height:30px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">-</button>
                <input type="number" id="quantityInput" value="1" min="1" style="flex:1;height:30px;text-align:center;border:1px solid #ddd;border-radius:4px;">
                <button id="increaseBtn" style="width:30px;height:30px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">+</button>
            </div>
            <div style="display:flex;gap:10px;">
                <button id="cancelBtn" style="flex:1;padding:8px;border:1px solid #ddd;background:white;border-radius:4px;cursor:pointer;">Hủy</button>
                <button id="confirmBtn" style="flex:1;padding:8px;background:#ff6f61;color:white;border:none;border-radius:4px;cursor:pointer;">Mua</button>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Xử lý sự kiện modal
    const modal = document.getElementById('buyNowModal');
    const quantityInput = document.getElementById('quantityInput');
    
    // Tăng/giảm số lượng
    document.getElementById('decreaseBtn').addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        quantityInput.value = Math.max(1, value - 1);
    });
    
    document.getElementById('increaseBtn').addEventListener('click', () => {
        let value = parseInt(quantityInput.value) || 1;
        quantityInput.value = value + 1;
    });
    
    // Đảm bảo số lượng >= 1
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 1) quantityInput.value = 1;
    });
    
    // Hủy
    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.style.display = 'none';
        currentProductId = null;
    });
    
    // Đóng khi click ra ngoài
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            currentProductId = null;
        }
    });
    
    // Mua
    document.getElementById('confirmBtn').addEventListener('click', async () => {
        if (!currentProductId) return;
        
        const quantity = parseInt(quantityInput.value) || 1;
        const checkStockUrl = `http://localhost/web2/controller/tonkho.php?action=checktonkho&soluong=${quantity}&masp=${currentProductId}`;
        
        const checkResponse = await fetch(checkStockUrl);
        if (!checkResponse.ok) {
            throw new Error('Không thể kết nối đến máy chủ kiểm tra tồn kho');
        }

        const checkResult = await checkResponse.json();

        // Nếu success là false (hết hàng hoặc không đủ số lượng)
        if (!checkResult.success) {
            // Sử dụng hàm showMessage của bạn để thông báo
            showMessage(checkResult.message || 'Sản phẩm không đủ số lượng trong kho!', 'error');
            return; // Dừng thực hiện các bước tiếp theo
        }
        const data  = {
    "products": [
        {
            "masp": currentProductId,
            "soluong": quantity
        }
    ]
}
    
        
       try {
            // Hiển thị loading (tùy chọn)
            
            
            const response = await fetch('http://localhost/web2/checkout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: data.products,
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // 4. Nhận HTML trả về và render toàn bộ trang
            const html = await response.text();
            
            // Xóa toàn bộ trang hiện tại và render trang mới
            console.log(html);
            document.open();
            document.write(html);
            document.close();
            
            
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xử lý thanh toán! Vui lòng thử lại.');
        }
    });
}

// Hàm mở modal mua ngay
function openBuyNowModal(productId) {
     if (!window.userGlobalData || !window.userGlobalData.success) {
        showMessage('Vui lòng đăng nhập để mua ngay sản phẩm', 'error'); // Nên để type là 'error' hoặc 'warning'
        return; // Dừng hàm
    }
    currentProductId = productId;
    document.getElementById('quantityInput').value = 1;
    document.getElementById('buyNowModal').style.display = 'flex';
}

// Thêm style cho nút mua ngay
const style = document.createElement('style');
style.textContent = `
    .action-btn.buy-now {
        background: linear-gradient(135deg, #1a237e, #283593);
    }
    .action-btn.buy-now:hover {
        background: linear-gradient(135deg, #283593, #3949ab);
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);
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