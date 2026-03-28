 window.userGlobalData = null;

  // Hàm để tải và điền dữ liệu
  async function loadUserData() {
    
        // Gọi API kiểm tra đăng nhập
        const response = await fetch('controller/checklogin.php');
        window.userGlobalData = await response.json();
        const dropdownToggle = document.querySelector('.nav-link.dropdown-toggle');
        dropdownToggle.innerHTML = `<i class="fas fa-user"></i> &nbsp;${window.userGlobalData.data.tenkhach}`;

        if(window.userGlobalData.success){
         const response2 = await fetch(`controller/customer.php?makh=${window.userGlobalData.data.idkhach}`);
        const mang2=await response2.json();
        // Điền dữ liệu vào form
        document.getElementById('fullName').value = mang2.data.hoten|| "";
        document.getElementById('email').value = mang2.data.email || "";
        document.getElementById('phone').value = mang2.data.sdt|| "";
        document.getElementById('streetAddress').value = mang2.data.sonha|| "";
        document.getElementById('district').value = mang2.data.phuongxa || "";
        document.getElementById('city').value = mang2.data.thanhpho || "";
        }
        else{
        window.location.href='login.html';
        }
    
  }

  // Gọi hàm loadUserData khi DOM đã sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUserData);
  } else {
    // DOM đã sẵn sàng
    loadUserData();
  }

  

    // JavaScript cho nút phễu lọc và form tìm kiếm nâng cao
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
        

        // Reset form
        resetBtn.addEventListener('click', function() {
            form.reset();
        });
    });

      // Hàm định dạng số
        function formatNumber(value) {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        // Hàm xử lý sự kiện input
        function handleInput(event) {
            let input = event.target;
            let value = input.value.replace(/[^0-9]/g, '');  // Loại bỏ các ký tự không phải là số
            input.value = formatNumber(value);  // Áp dụng định dạng
        }

        // Gán sự kiện cho các input
        window.onload = function() {
            const minPriceInput = document.querySelector('input[name="minPrice"]');
            const maxPriceInput = document.querySelector('input[name="maxPrice"]');
            
            minPriceInput.addEventListener('input', handleInput);
            maxPriceInput.addEventListener('input', handleInput);
        };

        // Hàm hiển thị thông báo
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

// Xử lý submit form
document.getElementById('editAccountForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Hiển thị loading
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    submitBtn.disabled = true;
    
  
// 1. LẤY GIÁ TRỊ TRƯỚC KHI THÊM VÀO FORMDATA
const fullName = document.getElementById('fullName').value;
const email = document.getElementById('email').value;
const phone = document.getElementById('phone').value;
const streetAddress = document.getElementById('streetAddress').value;
const district = document.getElementById('district').value;
const city = document.getElementById('city').value;
const newPassword = document.getElementById('newPassword').value;
const confirmPassword = document.getElementById('confirmPassword').value;

// 2. KIỂM TRA MẬT KHẨU TRƯỚC KHI TẠO FORMDATA
if (newPassword && newPassword !== confirmPassword) {
    showMessage('❌ Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    return;
}

// 3. TẠO FORMDATA SAU KHI ĐÃ KIỂM TRA
const formData = new FormData();
formData.append('hoten', fullName);
formData.append('makh',window.userGlobalData.data.idkhach);
formData.append('email', email);
formData.append('sdt', phone);
formData.append('sonha', streetAddress);
formData.append('phuongxa', district);
formData.append('thanhpho', city);
formData.append('newPassword', newPassword);
formData.append('confirmPassword', confirmPassword);
    
    try {
        // Gửi request đến API (thay YOUR_API_URL bằng URL thực tế)
        const response = await fetch('http://localhost/web2/controller/customer.php', {
            method: 'POST',
            body: formData
        });
        
        // Kiểm tra response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON response
        const result = await response.json();
        
        // Xử lý kết quả
        if (result.success === true) {
            showMessage('Cập nhật thông tin thành công!', 'success');
            

            // Đợi 1.5 giây rồi chuyển hướng
            setTimeout(() => {
                window.location.href = 'thongtintaikhoan.html';
            }, 1500);
        } else {
            // Hiển thị thông báo lỗi từ server
            const errorMessage = result.message || 'Cập nhật thất bại!';
            showMessage(`❌ ${errorMessage}`, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        
    } catch (error) {
        // Xử lý lỗi
        console.error('Error:', error);
        showMessage(`❌ Đã xảy ra lỗi: ${error.message}`, 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Hủy bỏ
document.getElementById('btnCancel').addEventListener('click', function() {
        window.location.href = 'thongtintaikhoan.html';
    
});

// Thêm CSS animation cho thông báo
const style = document.createElement('style');
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