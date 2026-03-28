 // JavaScript cho nút phễu lọc và form tìm kiếm nâng cao
        document.addEventListener('DOMContentLoaded', function () {
            const filterBtn = document.getElementById('filterBtn');
            const modal = document.getElementById('advancedSearchModal');
            const closeModal = document.querySelector('.close-modal');
            const form = document.getElementById('advancedSearchForm');
            const resetBtn = document.querySelector('.btn-reset');

            // Hiển thị modal khi click nút phễu
            filterBtn.addEventListener('click', function () {
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
            window.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeModalHandler();
                }
            });

            // Đóng modal khi nhấn ESC
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && modal.style.display === 'block') {
                    closeModalHandler();
                }
            });
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
        window.onload = function () {
            const minPriceInput = document.querySelector('input[name="minPrice"]');
            const maxPriceInput = document.querySelector('input[name="maxPrice"]');

            minPriceInput.addEventListener('input', handleInput);
            maxPriceInput.addEventListener('input', handleInput);
        };
   
    // Thêm hàm này vào phần JavaScript (có thể đặt sau renderProductPrice)
function renderSearchResultPrice(product) {
    const price = parseInt(product.gia);
    const discount = parseFloat(product.hesogiamgia) || 0;
    
    if (discount > 0) {
        const discountedPrice = Math.round(price * (1 - discount));
        const discountPercent = Math.round(discount * 100);
        
        return `
            <div style="margin: 0 0 5px 0;">
                <div style="color: #999; font-size: 14px; text-decoration: line-through;">
                    ${price.toLocaleString('vi-VN')} đ
                </div>
                <div style="color: #ff6f61; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    ${discountedPrice.toLocaleString('vi-VN')} đ
                    <span style="background: #ff6f61; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">
                        -${discountPercent}%
                    </span>
                </div>
            </div>
        `;
    } else {
        return `<p style="color: #ff6f61; font-weight: bold; margin: 0 0 5px 0;">${price.toLocaleString('vi-VN')} đ</p>`;
    }
}
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
            max-height: 90vh;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            flex-direction: column;
        ">
            <div style="
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
            ">
                <h3 style="margin: 0; font-size: 24px; font-weight: bold; color: #333;">Kết quả tìm kiếm</h3>
                <button id="closeSearchModalBtn" style="
                    position: absolute;
                    right: 0;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
            </div>

            <div id="sortContainer" style="display: none; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 15px;">
                <label for="sortSelect" style="font-weight: bold; color: #555;">Sắp xếp theo:</label>
                <select id="sortSelect" style="padding: 8px 12px; border-radius: 5px; border: 1px solid #ddd; outline: none; cursor: pointer;">
                    <option value="default">Mặc định</option>
                    <option value="az">Tên: A -> Z</option>
                    <option value="za">Tên: Z -> A</option>
                    <option value="priceAsc">Giá: Tăng dần</option>
                    <option value="priceDesc">Giá: Giảm dần</option>
                </select>
            </div>

            <div id="searchResults" style="overflow-y: auto; flex-grow: 1; min-height: 200px;"></div>
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
       

        // Thay thế hàm tìm kiếm cơ bản
async function performSearch() {
    let keyword = document.getElementById("searchInput").value.trim();

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
    
    const sortContainer = document.getElementById('sortContainer');
    const sortSelect = document.getElementById('sortSelect');
    
    if (products && products.length > 0) {
        sortContainer.style.display = 'flex'; // Hiện thanh sắp xếp
        sortSelect.value = 'default'; // Reset về mặc định cho mỗi lần tìm kiếm mới
    } else {
        sortContainer.style.display = 'none'; // Ẩn nếu không có kết quả
    }
    
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
                        ${renderSearchResultPrice(product)}
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
        // Hàm tính giá thực tế (sau khi đã trừ chiết khấu) để sắp xếp chính xác
function getEffectivePrice(product) {
    const price = parseInt(product.gia);
    const discount = parseFloat(product.hesogiamgia) || 0;
    return Math.round(price * (1 - discount));
}

// Lắng nghe sự kiện thay đổi của Combobox sắp xếp
document.getElementById('sortSelect').addEventListener('change', function(e) {
    const sortType = e.target.value;
    
    if (searchResults.length === 0) return;

    switch(sortType) {
        case 'az':
            searchResults.sort((a, b) => a.tensp.localeCompare(b.tensp));
            break;
        case 'za':
            searchResults.sort((a, b) => b.tensp.localeCompare(a.tensp));
            break;
        case 'priceAsc':
            searchResults.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
            break;
        case 'priceDesc':
            searchResults.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
            break;
        default:
            // Nếu là mặc định, thường bạn phải lưu lại mảng gốc ban đầu 
            // Ở đây để đơn giản, chúng ta giữ nguyên trạng thái hiện tại
            break;
    }

    currentPage = 1; // Quay về trang 1 sau khi sắp xếp
    renderResults();
});
    }
    
    // Gọi hàm initializeSearch khi trang tải xong
    document.addEventListener('DOMContentLoaded', function() {
        initializeSearch();
    });

    