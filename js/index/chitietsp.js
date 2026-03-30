
        // ==================== UTILITY FUNCTIONS FOR QUICK VIEW ====================
        function formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
        }

        function getProductImage(category) {
            const imageMap = {
                'Lichsu': 'img/su' + (Math.floor(Math.random() * 30) + 1) + '.jfif',
                'Tongiao': 'img/tg' + (Math.floor(Math.random() * 15) + 1) + '.jfif',
                'Tamly': 'img/tl' + (Math.floor(Math.random() * 30) + 1) + '.png',
                'Vanhoc': 'img/vh' + (Math.floor(Math.random() * 15) + 1) + '.jfif',
                'Thieunhi': 'img/tn' + (Math.floor(Math.random() * 15) + 1) + '.jfif'
            };

            return imageMap[category] || 'img/book1.webp';
        }

        // ==================== QUICK VIEW ====================
        function renderQuickViewPrice(product) {
    const price = parseInt(product.gia);
    const discount = parseFloat(product.giamgia) || 0;
    
    if (discount > 0) {
        const discountedPrice = Math.round(price * (1 - discount));
        const discountPercent = Math.round(discount * 100);
        
        return `
            <div class="qv-price-container">
                <div class="qv-original-price">${formatPrice(price)}</div>
                <div class="qv-discounted-price">${formatPrice(discountedPrice)}</div>
                <div class="qv-discount-badge">-${discountPercent}%</div>
            </div>
        `;
    } else {
        return `<div class="qv-price">Giá: ${formatPrice(price)}</div>`;
    }
}
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
        const response = await fetch(`http://localhost/web2/controller/product.php?masp=${productId}`);
        const data = await response.json();

        if (!data.success) {
            console.error('Failed to fetch product details:', data.message);
            return;
        }

        const product = data.data;
        const imageUrl = product.link;

        // ================= ĐOẠN THAY ĐỔI Ở ĐÂY =================
        // Sử dụng biến toàn cục categoryMapping đã được fetch từ danhmuc.php
        // Nếu không tìm thấy mã danh mục, sẽ hiển thị chính mã đó (fallback)
        const danhmucTen = categoryMapping[product.danhmuc] || product.danhmuc;
        // =====================================================
        const detailedInfo = {
            'Nhà xuất bản': product.nhaxuatban || 'Đang cập nhật',
            'Năm xuất bản': product.namxuatban || 'Đang cập nhật',
            'Số trang': product.sotrang || 'Đang cập nhật',
            'Ngôn ngữ': product.ngonngu || 'Tiếng Việt',
            'Kích thước': product.kichthuoc || 'Đang cập nhật',
            'Trọng lượng': product.trongluong || 'Đang cập nhật',
            'ISBN': product.isbn || '388053101-3',
            'Hình thức bìa': product.loaibia || 'Bìa mềm'
        };
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
            ${renderQuickViewPrice(product)}
            <div class="qv-desc">${product.mota || 'Chưa có mô tả cho sản phẩm này.'}</div>
            
            <div class="qv-meta-container">
              <div class="qv-meta-item">
                <i class="fas fa-user"></i>
                <span>Tác giả: <em>${product.tacgia}</em></span>
              </div>
              <div class="qv-meta-item">
                <i class="fas fa-book"></i>
                <span>Thể loại: <em>${danhmucTen}</em></span>
                
              </div>
                <!-- Phần Xem thêm với tooltip hover -->
              <div class="qv-more-info">
                <a href="javascript:void(0)" 
                   class="view-more-link">
                  <i class="fas fa-info-circle"></i>
                  Xem thêm
                </a>
                <div class="more-info-tooltip" 
                     style="position: absolute !important; bottom: 100% !important; left: 50% !important; transform: translateX(-50%) !important; z-index: 10000 !important; display: none; margin-bottom: 12px !important; padding: 15px !important; background: white !important; border-radius: 8px !important; border: 1px solid #e0e0e0 !important; font-size: 13px !important; width: 280px !important; box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important; animation: fadeInTooltip 0.2s ease !important; box-sizing: border-box !important;">
                  <div style="font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">Thông tin chi tiết:</div>
                  ${Object.entries(detailedInfo).map(([key, value]) => `
                    <div style="display: flex; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid #f0f0f0;">
                      <span style="min-width: 100px; color: #666; font-weight: 500;">${key}:</span>
                      <span style="color: #333; flex: 1; text-align: right;">${value}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="qv-button-grid">
                <button class="qv-add" onclick="addToCart('${productId}'); event.stopPropagation();">
                  <i class="fa fa-shopping-cart"></i>
                  <span>Thêm vào giỏ</span>
                </button>
                <button class="qv-buy-now" onclick="openBuyNowModal('${productId}'); event.stopPropagation();">
                  <i class="fas fa-bolt"></i>
                  <span>Mua ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

        root.style.display = 'flex';
// Thêm JavaScript cho hover tooltip
        const moreInfoElement = root.querySelector('.qv-more-info');
        const tooltip = root.querySelector('.more-info-tooltip');
        
        // Hover trên cả container hoặc link đều hiển thị tooltip
        moreInfoElement.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            // Sử dụng setProperty với important
            tooltip.style.setProperty('display', 'block', 'important');
        });
        
        moreInfoElement.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            // Sử dụng setTimeout để tránh flicker
            setTimeout(() => {
                if (!moreInfoElement.matches(':hover') && !tooltip.matches(':hover')) {
                    tooltip.style.setProperty('display', 'none', 'important');
                }
            }, 100);
        });
        
        tooltip.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            tooltip.style.setProperty('display', 'block', 'important');
        });
        
        tooltip.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            setTimeout(() => {
                if (!moreInfoElement.matches(':hover') && !tooltip.matches(':hover')) {
                    tooltip.style.setProperty('display', 'none', 'important');
                }
            }, 100);
        });

        // Logic đóng Modal
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
        function toggleMoreInfo(element) {
    const tooltip = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (tooltip.style.display === 'none' || !tooltip.style.display) {
        tooltip.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
        element.style.fontWeight = '600';
    } else {
        tooltip.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        element.style.fontWeight = '500';
    }
}

        // Xử lý click vào toàn bộ sản phẩm (trừ các nút giỏ hàng và xem chi tiết)
        // Xử lý click vào toàn bộ sản phẩm (trừ các nút giỏ hàng, xem chi tiết VÀ MUA NGAY)
document.addEventListener('click', function (e) {
    // Kiểm tra nếu click vào nút giỏ hàng hoặc xem chi tiết hoặc mua ngay thì không làm gì
    if (e.target.closest('.add-cart') || e.target.closest('.view-detail') || e.target.closest('.buy-now')) {
        return;
    }

    // Kiểm tra nếu click vào sản phẩm
    const productItem = e.target.closest('.new-product-item, .category-product-item');
    if (!productItem) return;

    e.preventDefault();
    openQuickViewFromCard(productItem);
});

        // Xử lý click vào nút xem chi tiết (mắt)
        document.addEventListener('click', function (e) {
            const viewBtn = e.target.closest('.view-detail');
            if (!viewBtn) return;
            e.preventDefault();
            e.stopPropagation(); // Ngăn sự kiện lan ra sản phẩm cha
            const card = viewBtn.closest('.category-product-item, .new-product-item');
            if (!card) return;
            openQuickViewFromCard(card);
        });

        ensureQuickViewRoot();