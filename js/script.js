document.addEventListener('DOMContentLoaded', () => {
    // 簡單的導覽列滾動效果
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 假預告單元點擊提示 (使用事件代理以支援 Modal 內複製的卡片)
    document.addEventListener('click', (e) => {
        const disabledCard = e.target.closest('.lesson-card.disabled');
        if (disabledCard) {
            e.preventDefault();
            alert('🚀 這個有趣的單元還在開發中喔！敬請期待！');
        }
    });

    // 平滑捲動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Modal 彈出選單控制邏輯 ---
    const modal = document.getElementById('category-modal');
    if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        const modalDesc = modal.querySelector('.modal-desc');
        const modalIcon = modal.querySelector('.modal-title-icon');
        const modalGrid = modal.querySelector('.modal-body-grid');
        const modalClose = modal.querySelector('.modal-close');
        const categoryCards = document.querySelectorAll('.category-card');
        const gamesSource = document.getElementById('games-source');

        const openModal = (categoryCard) => {
            const category = categoryCard.dataset.category;
            const title = categoryCard.querySelector('h3').textContent;
            const desc = categoryCard.querySelector('p').textContent;
            const icon = categoryCard.querySelector('.category-icon').textContent;
            
            // 填寫分類標題與介紹
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalIcon.textContent = icon;
            
            // 清空舊列表
            modalGrid.innerHTML = '';
            
            // 複製隱藏的卡片並載入 Modal Grid 中
            const sourceGroup = gamesSource.querySelector(`.games-group[data-category="${category}"]`);
            if (sourceGroup) {
                const clonedGroup = sourceGroup.cloneNode(true);
                // 轉移所有卡片元素 (只移轉真正的元素子節點，避開空白 textNode)
                const children = Array.from(clonedGroup.children);
                console.log(`[Modal] 正在開啟分類: ${title}, 載入 ${children.length} 個遊戲。`);
                children.forEach(card => {
                    modalGrid.appendChild(card);
                });
            } else {
                console.warn(`[Modal] 找不到對應的遊戲來源群組: ${category}`);
            }
            
            // 開啟面板並鎖定背景捲軸
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // 動態選單淡出後清空 Grid
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    modalGrid.innerHTML = '';
                }
            }, 400);
        };

        // 綁定大項目點擊
        categoryCards.forEach(card => {
            card.addEventListener('click', () => openModal(card));
        });

        // 關閉按鈕
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        // 點擊遮罩背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC 鍵盤關閉
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
