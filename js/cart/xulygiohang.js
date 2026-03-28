 // 1. Khai báo biến toàn cục
window.userGlobalData = null;

// 2. Hàm format tiền tệ
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

// 3. Hàm hiển thị dữ liệu vào bảng
function displayCart(items) {
    const cartBody = document.getElementById('table');
    
    if (!items || items.length === 0) {
        cartBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:20px;">
                    Giỏ hàng trống
                </td>
            </tr>
        `;
        return;
    }
    
    // Xây dựng HTML từ dữ liệu
    let html = ` <thead>
        <tr>
            <th style="background:#fff; font-weight:bold; border:1px solid #dee2e6;">Chọn</th>
            <th style="background:#fff; font-weight:bold; border:1px solid #dee2e6;">Sản phẩm</th>
            <th style="background:#fff; font-weight:bold; border:1px solid #dee2e6;">Số lượng</th>
            <th style="background:#fff; font-weight:bold; border:1px solid #dee2e6;">Đơn giá</th>
             <th style="background:#fff; font-weight:bold; border:1px solid #dee2e6;">Giảm(%)</th>
            <th style="background:#fff; font-weight:bold; border:1px solid #dee2e6;">Thành tiền</th>
            <th style="background:#fff; font-weight:bold; border:1px solid #dee2e6;">Xóa</th>
        </tr>
    </thead>`;
    items.forEach(item => {
        html += `
            <tr id="de-${item.masp}">
                <td style="text-align:center;">
                    <input type="checkbox" class="select-product">
                </td>
                <td style="text-align:left;">
                    <img src="${item.link}" alt="${item.tensp}" 
                         style="width:60px; height:60px; object-fit:cover; margin-right:10px; float:left;">
                    <div>
                        <strong>${item.tensp}</strong><br>
                        <span style="color:#888;">Tác giả: ${item.tacgia}</span>
                    </div>
                </td>
                <td><div class="quantity-control" style="display:flex; align-items:center; justify-content:center;">
    <button onclick="editSoluong(${item.magio},${-1},${item.masp},${item.gia},${item.hesogiamgia*100})" type="button" class="btn btn-sm btn-outline-secondary decrease-btn" data-id="${item.masp || item.id}">-</button>
    <input id=${item.masp} type="text" value="${item.soluong}" class="quantity-input form-control text-center" style="width:50px; margin:0 5px;" readonly>
    <button onclick="editSoluong(${item.magio},${1},${item.masp},${item.gia},${item.hesogiamgia*100})" type="button" class="btn btn-sm btn-outline-secondary increase-btn" data-id="${item.masp || item.id}">+</button>
</div></td>
                <td>${formatCurrency(item.gia)}</td>
                <td>${item.hesogiamgia*100}</td>
                <td id="row-${item.masp}">${formatCurrency(item.thanhtien)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="confirmDelete(${item.magio},${item.masp},'de-${item.masp}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    cartBody.innerHTML = html;
}

// 4. Hàm load giỏ hàng
async function loadCart() {
    try {
       // Gọi API
        const response = await fetch(`http://localhost/web2/controller/cart.php?magio=${window.userGlobalData.data.idkhach}`);
        const result = await response.json();
        
        if (result.success) {
            // Hiển thị dữ liệu vào bảng
            displayCart(result.data.data);
           

        } else {
            console.error('Error:', result.message);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// 5. Hàm kiểm tra đăng nhập
async function checkLogin() {
    try {
        // Gọi API kiểm tra đăng nhập
        const response = await fetch('http://localhost/web2/controller/checklogin.php');
        window.userGlobalData = await response.json();
        const dropdownToggle = document.querySelector('.nav-link.dropdown-toggle');
         dropdownToggle.innerHTML = `<i class="fas fa-user"></i> &nbsp;${window.userGlobalData.data.tenkhach}`;
    } catch (error) {
        console.error('Lỗi khi kiểm tra đăng nhập:', error);
    }
}

// 6. Hàm khởi tạo chính
async function initializeApp() {
    // Kiểm tra đăng nhập trước
    await checkLogin();
    
    // Sau đó load giỏ hàng
    await loadCart();
}
document.addEventListener('DOMContentLoaded', initializeApp);

// Hàm thêm checkbox "Chọn tất cả" dưới tiêu đề
function addSelectAllCheckbox() {
    // Kiểm tra xem đã có container chưa
    if (document.getElementById('select-all-container')) {
        return;
    }
    
    // Tìm phần tử chứa tiêu đề "Giỏ hàng của tôi"
    const cartTitle = document.querySelector('h1');
    if (!cartTitle) return;
    
    // Tìm phần tử cha (div cart-page-inner)
    const cartInner = cartTitle.closest('.cart-page-inner');
    if (!cartInner) return;
    
    // Tìm bảng
    const table = cartInner.querySelector('table');
    
    // Tạo container cho "Chọn tất cả"
    const container = document.createElement('div');
    container.id = 'select-all-container';
    container.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 15px 0 20px 0;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #dee2e6;
    `;
    
    // HTML cho container
    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" 
                   id="select-all-checkbox" 
                   class="select-all-checkbox"
                   style="width: 18px; height: 18px; cursor: pointer;">
            <label for="select-all-checkbox" 
                   style="margin: 0; cursor: pointer; font-weight: 600; font-size: 16px; color: #333;">
                Chọn tất cả sản phẩm
            </label>
        </div>
        <span id="selected-count" style="margin-left: auto; font-weight: 600; color: #ff6f61;">
            Đã chọn: <span id="selected-count-number">0</span>/<span id="total-count">0</span> sản phẩm
        </span>
    `;
    
    // Chèn container vào sau tiêu đề, trước bảng
    if (table) {
        table.parentNode.insertBefore(container, table);
    } else {
        // Nếu không tìm thấy bảng, chèn vào sau tiêu đề
        cartTitle.parentNode.insertBefore(container, cartTitle.nextSibling);
    }
    
    // Gán sự kiện cho checkbox "Chọn tất cả"
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (selectAllCheckbox) {
        // Xóa sự kiện cũ trước khi gán mới
        selectAllCheckbox.onchange = null;
        
        selectAllCheckbox.addEventListener('change', function(e) {
            const isChecked = this.checked;
            const productCheckboxes = document.querySelectorAll('.select-product');
            
            productCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                // Kích hoạt sự kiện change để tính tổng
                const event = new Event('change');
                checkbox.dispatchEvent(event);
            });
        });
    }
}

// Hàm cập nhật checkbox "Chọn tất cả" và đếm số lượng
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (!selectAllCheckbox) return;
    
    const productCheckboxes = document.querySelectorAll('.select-product');
    const checkedCheckboxes = document.querySelectorAll('.select-product:checked');
    const totalCount = productCheckboxes.length;
    const selectedCount = checkedCheckboxes.length;
    
    // Cập nhật số lượng
    const selectedCountNumber = document.getElementById('selected-count-number');
    const totalCountElement = document.getElementById('total-count');
    
    if (selectedCountNumber) {
        selectedCountNumber.textContent = selectedCount;
    }
    
    if (totalCountElement) {
        totalCountElement.textContent = totalCount;
    }
    
    if (productCheckboxes.length === 0) {
        selectAllCheckbox.checked = false;
        // Không đặt indeterminate
        return;
    }
    
    if (checkedCheckboxes.length === productCheckboxes.length) {
        // Tất cả đều được chọn
        selectAllCheckbox.checked = true;
    } else {
        // Trường hợp còn lại: không có cái nào được chọn hoặc một số được chọn
        selectAllCheckbox.checked = false;
    }
    // Không đặt indeterminate trong bất kỳ trường hợp nào
}

// Hàm tính tổng tiền (cập nhật để gọi updateSelectAllCheckbox)
function calculateTotalFromCheckboxes() {
    let total = 0;
    
    // Lặp qua tất cả checkbox được chọn
    document.querySelectorAll('.select-product:checked').forEach(checkbox => {
        const row = checkbox.closest('tr');
        
        // Lấy đơn giá và số lượng
        const priceCell = row.cells[3]; // Cột đơn giá (index 3)
        const quantityCell = row.cells[2]; // Cột số lượng (index 2)
        const heso = row.cells[4]; // Cột giảm (index 4)
        
        // Lấy đơn giá và chuyển đổi từ chuỗi tiền tệ sang số
        const priceText = priceCell.textContent.trim();
        const price = parseCurrency(priceText);
        
        // Lấy số lượng
        const quantityInput = quantityCell.querySelector('input');
        const quantity = parseInt(quantityInput.value) || 1;
        
        // Lấy hệ số giảm giá
        const hesotext = heso.textContent.trim();
        const hesogiam = parseFloat(hesotext) || 0;
        
        // Tính thành tiền và cộng vào tổng
        const subtotal = price * quantity * (1 - (hesogiam/100));
        total += subtotal;
    });
    
    // Cập nhật giá trị
    const formattedTotal = formatCurrency(total);
    document.getElementById('subtotal').textContent = formattedTotal;
    document.getElementById('total').textContent = formattedTotal;
    updateSelectAllCheckbox();
}

// Hàm chuyển đổi chuỗi tiền tệ sang số
function parseCurrency(currencyString) {
    // Loại bỏ ký tự 'đ' và dấu chấm phân cách hàng nghìn
    const cleaned = currencyString.replace('đ', '').replace(/\./g, '');
    return parseInt(cleaned) || 0;
}

// Hàm định dạng số sang tiền tệ
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

// Hàm thiết lập checkbox
function setupCheckboxes() {
    // Thêm sự kiện cho tất cả checkbox sản phẩm
    document.querySelectorAll('.select-product').forEach(checkbox => {
        // Xóa sự kiện cũ nếu có
        const newCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
    });
    
    // Thêm sự kiện mới cho checkbox sản phẩm
    document.querySelectorAll('.select-product').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            calculateTotalFromCheckboxes();
        });
    });
}
// Thêm CSS tùy chỉnh
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Style cho checkbox "Chọn tất cả" */
        .select-all-checkbox {
            accent-color: #ff6f61;
        }
        
        /* Style cho checkbox sản phẩm */
        .select-product {
            accent-color: #ff6f61;
        }
        
        /* Trạng thái indeterminate cho checkbox "Chọn tất cả" */
        .select-all-checkbox:indeterminate {
            background-color: #ff6f61;
            border-color: #ff6f61;
        }
        
        /* Container chọn tất cả */
        #select-all-container {
            transition: all 0.3s ease;
        }
        
        #select-all-container:hover {
            background-color: #e9ecef;
        }
    `;
    document.head.appendChild(style);
}

// Gọi khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', initCartCheckboxes);

// Cũng cập nhật khi có sự kiện thay đổi số lượng
function updateTotalOnQuantityChange() {
    document.querySelectorAll('.quantity-control button').forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(calculateTotalFromCheckboxes, 100);
        });
    });
}

// Cập nhật trong hàm initCartCheckboxes
function initCartCheckboxes() {
    setTimeout(() => {
        addSelectAllCheckbox();
        setupCheckboxes();
        calculateTotalFromCheckboxes();
        addCustomStyles();
        updateTotalOnQuantityChange(); // Thêm dòng này
    }, 500);
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

            // Search functionality
            const searchBtn = document.getElementById("searchBtn");
            const searchInput = document.getElementById("searchInput");

            // Khi click nút tìm kiếm
          
            /**
 * Hàm cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {number|string} magio - Mã giỏ hàng (idkhach)
 * @param {number|string} soluong - Số lượng mới
 * @param {number|string} masp - Mã sản phẩm
 */
async function editSoluong(magio,sl, masp,dongia,giamgia) {
    try {
        // Kiểm tra tham số
        if (!magio|| !masp) {
            alert('Thiếu thông tin cần thiết!');
            window.location.href = 'cart.html';
            return;
        }
        const inputElement = document.getElementById(masp);
        let soluong = parseInt(inputElement.value)+parseInt(sl);
        if(soluong<=0){
            return;
        }
        // Tạo FormData
        const formData = new FormData();
        formData.append('magio', magio);
        formData.append('soluong',sl);
        formData.append('masp', masp);

        // Gọi API với method POST
        const response = await fetch('http://localhost/web2/controller/cart.php', {
            method: 'POST',
            body: formData
        });

        // Kiểm tra response
        

        // Parse JSON response
        const result = await response.json();
        
        // Kiểm tra kết quả
        if (result.success === true || result.success === 'true') {
            document.getElementById(`${masp}`).value=soluong;
             const thanhtien=soluong*dongia*(100-giamgia)/100;
            document.getElementById(`row-${masp}`).textContent=formatCurrency(thanhtien);

           /* const response2 = await fetch(`http://localhost/webbanhang/controller/cart.php?action=summary&magio=${magio}`, {
            method: 'GET',
        });
     const result2 = await response2.json();
      
      
        document.getElementById('subtotal').innerHTML=formatCurrency(result2.data.summary.total_amount);
         document.getElementById('total').innerHTML=formatCurrency(result2.data.summary.total_amount);*/

        } else {
            // Thất bại: hiển thị thông báo rồi chuyển hướng
            alert('Cập nhật số lượng không thành công!');
            window.location.href = 'cart.html';
        }

    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
        alert('Có lỗi xảy ra khi cập nhật số lượng!');
        window.location.href = 'cart.html';
    }
}


// Hàm xác nhận xóa
  function confirmDelete(magio, masp,iddong) {
    // Hiển thị hộp thoại xác nhận tùy chỉnh
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
        min-width: 300px;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-top: 0; color: #333;">Xác nhận xóa</h3>
        <p style="margin-bottom: 25px; color: #666;">Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
        <div style="display: flex; justify-content: center; gap: 15px;">
            <button id="confirmYes" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Có</button>
            <button id="confirmNo" style="
                background: #6c757d;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            ">Không</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Xử lý sự kiện khi click
    document.getElementById('confirmYes').addEventListener('click', async function() {
        try {
            // Gọi API DELETE
            const response = await fetch(`http://localhost/web2/controller/cart.php?magio=${magio}&masp=${masp}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            // Xóa modal
            document.body.removeChild(modal);
            
            if (result.success) {
                // Hiển thị thông báo thành công
                showNotification('Xóa sản phẩm thành công!', 'success');
                 document.getElementById(iddong).style.display = 'none';
                // Chờ 1.5 giây rồi chuyển hướng
                setTimeout(() => {
                    window.location.href = "cart.html";
                }, 1500);
            } else {
                // Hiển thị thông báo thất bại
                showNotification('Xóa sản phẩm không thành công. Vui lòng thử lại!', 'error');
            }
            
        } catch (error) {
            console.error('Error:', error);
            document.body.removeChild(modal);
            showNotification('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
        }
    });
    
    // Hủy bỏ
    document.getElementById('confirmNo').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Hàm hiển thị thông báo
function showNotification(message, type) {
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else {
        notification.style.background = '#dc3545';
    }
    
    notification.textContent = message;
    
    // Thêm animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

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


        // Hàm xử lý nút "Mua"
function setupBuyButton() {
    const buyButton = document.getElementById('buyButton');
    
    if (!buyButton) return;
    
    // Xóa sự kiện click hiện tại (nếu có)
    const newBuyButton = buyButton.cloneNode(true);
    buyButton.parentNode.replaceChild(newBuyButton, buyButton);
    
    // Thêm sự kiện click mới
    document.getElementById('buyButton').addEventListener('click', async function(e) {
        e.preventDefault();
        
        // 1. Kiểm tra checkbox được chọn
        const selectedCheckboxes = document.querySelectorAll('.select-product:checked');
        
        if (selectedCheckboxes.length === 0) {
            showNotification('Hãy chọn sản phẩm để mua sắm', 'error');
            return;
        }
        
        // 2. Thu thập thông tin sản phẩm được chọn
        const selectedProducts = [];
        
        selectedCheckboxes.forEach(checkbox => {
            // Lấy hàng chứa checkbox
            const row = checkbox.closest('tr');
            
            // Lấy masp từ id của hàng (id có dạng "de-{masp}")
            const rowId = row.id;
            const masp = rowId.replace('de-', '');
            
            // Lấy số lượng từ input có id là masp
            const quantityInput = document.getElementById(masp);
            const soluong = quantityInput ? parseInt(quantityInput.value) : 1;
            
            // Thêm vào mảng
            selectedProducts.push({
                masp: masp,
                soluong: soluong,
                tensp: row.querySelector('strong').textContent // Lấy tên để thông báo lỗi nếu cần
            });
        });
        try {
            for (const product of selectedProducts) {
                const checkStockUrl = `http://localhost/web2/controller/tonkho.php?action=checktonkho&soluong=${product.soluong}&masp=${product.masp}`;
                
                const checkResponse = await fetch(checkStockUrl);
                if (!checkResponse.ok) throw new Error('Lỗi kết nối máy chủ kiểm tra tồn kho');
                
                const checkResult = await checkResponse.json();
                
                // Nếu API trả về success: false
                if (!checkResult.success) {
                    showNotification(`Sản phẩm "${product.tensp}": ${checkResult.message}`, 'error');
                    return; // Dừng toàn bộ quá trình, không gọi API checkout
                }
            }
        } catch (error) {
            console.error('Lỗi kiểm tra tồn kho:', error);
            showNotification('Không thể kiểm tra tồn kho. Vui lòng thử lại sau!', 'error');
            return;
        }
        // --- KẾT THÚC KIỂM TRA TỒN KHO ---
        // 3. Gửi dữ liệu đến API checkout.php
        try {
            // Hiển thị loading (tùy chọn)
            showLoading();
            
            const response = await fetch('http://localhost/web2/checkout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: selectedProducts,
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // 4. Nhận HTML trả về và render toàn bộ trang
            const html = await response.text();
            
            // Xóa toàn bộ trang hiện tại và render trang mới
            document.open();
            document.write(html);
            document.close();
            
        } catch (error) {
            console.error('Error:', error);
            hideLoading();
            alert('Có lỗi xảy ra khi xử lý thanh toán! Vui lòng thử lại.');
        }
    });
}

// Hàm hiển thị loading (nếu cần)
function showLoading() {
    // Tạo overlay loading
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 20px;
    `;
    loadingOverlay.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Đang xử lý...</span>
            </div>
            <p style="margin-top: 20px;">Đang xử lý thanh toán...</p>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
}

// Hàm ẩn loading
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Gọi hàm setup khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    setupBuyButton();
});

// Cũng gọi setup sau khi load cart xong (để đảm bảo)
setTimeout(() => {
    setupBuyButton();
}, 1000);

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