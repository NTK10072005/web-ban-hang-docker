function initializeSearch() {
        const searchBtn = document.getElementById("searchBtn");
        const searchBtn2 = document.getElementById("search");

        const searchInput = document.getElementById("searchInput");

        // Tạo modal nếu chưa có
        if (!document.getElementById('searchModal')) {
            // Tìm phần modalHTML trong hàm initializeSearch() và sửa như sau:

const modalHTML = `
    <div id="searchModal" class="search-modal" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
    ">
        <div class="modal-content" style="
            background: white;
            width: 90%;
            max-width: 1200px;
            max-height: 80vh;
            border-radius: 10px;
            padding: 20px;
            overflow-y: auto;
        ">
            <div style="
                position: relative; /* Quan trọng: để nút đóng định vị theo đây */
                display: flex;
                justify-content: center; /* Căn giữa theo chiều ngang */
                align-items: center; /* Căn giữa theo chiều dọc */
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
                min-height: 50px; /* Chiều cao tối thiểu */
            ">
                <h3 style="
                    margin: 0;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                ">Kết quả tìm kiếm</h3>
                <button id="closeSearchModalBtn" style="
                    position: absolute; /* Đặt vị trí tuyệt đối */
                    right: 0; /* Nằm sát bên phải */
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
            <div id="searchResults" style="min-height: 200px;"></div>
        </div>
    </div>
`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Sự kiện đóng modal - SỬ DỤNG ID RIÊNG
            document.getElementById('closeSearchModalBtn').addEventListener('click', () => {
                document.getElementById('searchModal').style.display = 'none';
            });
            
            document.getElementById('searchModal').addEventListener('click', (e) => {
                if (e.target.id === 'searchModal') {
                    document.getElementById('searchModal').style.display = 'none';
                }
            });
            
            // ESC để đóng modal tìm kiếm
            document.addEventListener('keydown', function(e) {
                const searchModal = document.getElementById('searchModal');
                if (e.key === 'Escape' && searchModal.style.display === 'flex') {
                    searchModal.style.display = 'none';
                }
            });
        }
        

        // Hàm gọi API và hiển thị kết quả
       async function performSearch() {
    let keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) return;

    // Chuyển hướng sang trang mới kèm tham số
    window.location.href = `ketquatimkiem.php?action=search&keywords=${encodeURIComponent(keyword)}`;
}

// Thay thế hàm tìm kiếm nâng cao
async function performSearch2() {
    const tensp = document.getElementById('tensp').value;
    const category = document.querySelector('select[name="category"]').value;
    let giatu = document.querySelector('input[name="minPrice"]').value.replace(/\./g, '');
    let giaden = document.querySelector('input[name="maxPrice"]').value.replace(/\./g, '');

    // Tạo URL query string
    const params = new URLSearchParams({
        action: 'searchnangcao',
        category: category,
        tensp: tensp,
        giatu: giatu,
        giaden: giaden
    });

    window.location.href = `ketquatimkiem.php?${params.toString()}`;
}
        // Biến toàn cục lưu kết quả tìm kiếm
        let searchResults = [];
        let currentPage = 1;
        const itemsPerPage = 8;

        // Hiển thị kết quả với phân trang
        function displaySearchResults(products) {
            searchResults = products;
            currentPage = 1;
            renderResults();
        }

        // Render kết quả theo trang
        function renderResults() {
            const resultsDiv = document.getElementById('searchResults');
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageProducts = searchResults.slice(start, end);
              const categoryMapping = {
            'Thieunhi': 'Thiếu nhi',
            'Tamly': 'Tâm lý',
            'Tongiao': 'Tôn giáo',
            'Lichsu': 'Lịch sử',
            'Vanhoc': 'Văn học'
        };
            if (pageProducts.length === 0) {
                resultsDiv.innerHTML = '<p style="text-align: center; padding: 50px;">Không có sản phẩm nào.</p>';
                return;
            }

            // Tạo HTML cho sản phẩm
            let html = `<div style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            ">`;
          
            pageProducts.forEach(product => {
                const price = parseInt(product.gia).toLocaleString('vi-VN') + ' đ';
                const category =categoryMapping[product.danhmuc];
                
                
                html += `
                    <div style="
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                        background: white;
                    ">
                        <div style="height: 150px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <img src="${product.link}" alt="${product.tensp}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <h4 style="margin: 0 0 10px 0; font-size: 16px; height: 40px; overflow: hidden; line-height: 1.3;">${product.tensp}</h4>
                        <p style="color: #ff6f61; font-weight: bold; margin: 0 0 5px 0;">${price}</p>
                        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">${category}</p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button onclick="addToCart('${product.masp}'); event.stopPropagation();" style="
                                background: #ff6f61;
                                color: white;
                                border: none;
                                padding: 8px 15px;
                                border-radius: 4px;
                                cursor: pointer;
                            ">Thêm giỏ hàng</button>
                            <button onclick="openQuickViewForSearchResult('${product.masp}')" style="
                                background: #4CAF50;
                                color: white;
                                border: none;
                                padding: 8px 15px;
                                border-radius: 4px;
                                cursor: pointer;
                            ">Xem chi tiết</button>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            
            // Thêm phân trang nếu có nhiều sản phẩm
            if (searchResults.length > itemsPerPage) {
                const totalPages = Math.ceil(searchResults.length / itemsPerPage);
                
                html += `<div style="
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                ">`;
                
                // Nút trang trước
                if (currentPage > 1) {
                    html += `<button onclick="goToPage(${currentPage - 1})" style="
                        padding: 8px 15px;
                        border: 1px solid #ddd;
                        background: white;
                        cursor: pointer;
                        border-radius: 4px;
                    "><<</button>`;
                }
                
                // Các số trang
                for (let i = 1; i <= totalPages; i++) {
                    if (i === currentPage) {
                        html += `<button style="
                            padding: 8px 15px;
                            border: 1px solid #ff6f61;
                            background: #ff6f61;
                            color: white;
                            cursor: pointer;
                            border-radius: 4px;
                        ">${i}</button>`;
                    } else {
                        html += `<button onclick="goToPage(${i})" style="
                            padding: 8px 15px;
                            border: 1px solid #ddd;
                            background: white;
                            cursor: pointer;
                            border-radius: 4px;
                        ">${i}</button>`;
                    }
                }
                
                // Nút trang sau
                if (currentPage < totalPages) {
                    html += `<button onclick="goToPage(${currentPage + 1})" style="
                        padding: 8px 15px;
                        border: 1px solid #ddd;
                        background: white;
                        cursor: pointer;
                        border-radius: 4px;
                    ">>></button>`;
                }
                
                html += '</div>';
            }
            
            resultsDiv.innerHTML = html;
        }

        // Hàm mở Quick View cho sản phẩm từ kết quả tìm kiếm
        window.openQuickViewForSearchResult = async function(productId) {
            // KHÔNG đóng modal tìm kiếm
            // Tạo một card ảo để sử dụng hàm openQuickViewFromCard
            const fakeCard = document.createElement('div');
            fakeCard.setAttribute('data-product-id', productId);
            
            // Mở Quick View bằng hàm đã có
            openQuickViewFromCard(fakeCard);
        };

        // Hàm chuyển trang
        window.goToPage = function(page) {
            currentPage = page;
            renderResults();
            document.getElementById('searchResults').scrollTop = 0;
        };

        // Gắn sự kiện
        if (searchBtn) {
            searchBtn.addEventListener("click", (e) => {
                e.preventDefault();
                performSearch();
            });
        }
          if (searchBtn2) {
            searchBtn2.addEventListener("click", (e) => {
                e.preventDefault();
                performSearch2();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    }
    
    // Gọi hàm initializeSearch khi trang tải xong
    document.addEventListener('DOMContentLoaded', function() {
        initializeSearch();
    });
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

        // 9. Hàm thêm vào giỏ hàng (mẫu)
        async function addToCart(productId) {
           event.preventDefault();
           if (!window.userGlobalData || !window.userGlobalData.success) {
        showMessage('Vui lòng đăng nhập để sử dụng giỏ hàng', 'error'); // Nên để type là 'error' hoặc 'warning'
        return; // Dừng hàm
    }
            const magio =   window.userGlobalData.data.idkhach;
            const formData = new FormData();
            formData.append('magio',magio);
            formData.append('masp',productId);
            formData.append('soluong',1);
             try {
        // Gửi request đến API (thay YOUR_API_URL bằng URL thực tế)
        const response =  await fetch('http://localhost/web2/controller/cart.php', {
            method: 'POST',
            body: formData
        });
        
        const result =  await response.json();
        
        // Xử lý kết quả
        if (result.success) {
            showMessage('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            
            // Đợi 1.5 giây rồi chuyển hướng
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1500);
        } else {
            // Hiển thị thông báo lỗi từ server
            const errorMessage = result.message || 'Cập nhật thất bại!';
            showMessage(`❌ ${errorMessage}`, 'error');
        }
        
    } catch (error) {
        // Xử lý lỗi
        console.error('Error:', error);
        showMessage(`❌ Đã xảy ra lỗi: ${error.message}`, 'error');
    }

        }
        
// ==================== UTILITY FUNCTIONS ====================
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Category mapping


// ==================== QUICK VIEW FUNCTIONS ====================
function ensureQuickViewRoot() {
    let root = document.querySelector('.qv-overlay');
    if (root) return root;
    root = document.createElement('div');
    root.className = 'qv-overlay';
    document.body.appendChild(root);
    return root;
}

async function openQuickViewFromCard(card) {
    const productId = card.dataset.productId;

    if (!productId) {
        console.error('Product ID not found');
        return;
    }

    try {
        // Fetch product details from API
        const response = await fetch(`controller/product.php?masp=${productId}`);
        const data = await response.json();

        if (!data.success) {
            console.error('Failed to fetch product details:', data.message);
            return;
        }

        const product = data.data;
        const imageUrl = product.link;
         const categoryMapping = {
                    'Thieunhi': 'Thiếu nhi',
                    'Tamly': 'Tâm lý',
                    'Tongiao': 'Tôn giáo',
                    'Lichsu': 'Lịch sử',
                    'Vanhoc': 'Văn học'
                };
        const danhmuc = categoryMapping[product.danhmuc];

        const root = ensureQuickViewRoot();
        root.innerHTML = `
            <div class="qv-card" role="dialog" aria-modal="true" aria-label="Xem nhanh sản phẩm">
                <button class="qv-close" aria-label="Đóng">✖</button>
                <div class="qv-body">
                    <div class="qv-img">
                        <img src="${imageUrl}" alt="${product.tensp}" onerror="this.src='img/default-book.jpg'">
                    </div>
                    <div class="qv-content">
                        <h2 class="qv-title">${product.tensp}</h2>
                        <div class="qv-price">Giá: ${formatPrice(product.gia)}</div>
                        <div class="qv-desc">${product.mota || 'Chưa có mô tả cho sản phẩm này.'}</div>
                        
                        <div class="qv-meta-container">
                            <div class="qv-meta-item">
                                <i class="fas fa-user"></i>
                                <span>Tác giả: <em>${product.tacgia}</em></span>
                            </div>
                            <div class="qv-meta-item">
                                <i class="fas fa-book"></i>
                                <span>Thể loại: <em>${danhmuc}</em></span>
                            </div>
                            <button class="qv-add" onclick="addToCart('${productId}')">
                                <i class="fa fa-shopping-cart"></i>
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        root.style.display = 'flex';

        const close = () => { 
            root.style.display = 'none'; 
            root.innerHTML = ''; 
        };
        
        root.addEventListener('click', (e) => { 
            if (e.target === root) close(); 
        });
        
        root.querySelector('.qv-close').addEventListener('click', close);
        
        const onEsc = (e) => { 
            if (e.key === 'Escape') { 
                close(); 
                document.removeEventListener('keydown', onEsc); 
            } 
        };
        document.addEventListener('keydown', onEsc);

    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Ghi đè hàm openQuickViewForSearchResult
window.openQuickViewForSearchResult = async function(productId) {
    // Tạo một card ảo để sử dụng hàm openQuickViewFromCard
    const fakeCard = document.createElement('div');
    fakeCard.setAttribute('data-product-id', productId);
    
    // Mở Quick View bằng hàm đã có
    openQuickViewFromCard(fakeCard);
};

// Khởi tạo
ensureQuickViewRoot();