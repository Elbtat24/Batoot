// lectures-integration.js
// هذا الملف يجب إضافته إلى index.html لربط صفحة المحاضرات مع المنصة الرئيسية

// Override the openLectures function to navigate to the new lectures page
function openLectures(subject) {
    // Navigate to lectures viewer page with subject parameter
    window.location.href = `lectures-viewer.html?subject=${subject}`;
}

// Alternative: Open lectures in a modal/overlay (optional implementation)
function openLecturesModal(subject) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal';
    overlay.style.display = 'flex';
    overlay.style.backdropFilter = 'blur(12px) saturate(120%)';
    overlay.style.background = 'rgba(0,0,0,.55)';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '900px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '85vh';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = `
        <h2><i class="fas fa-book"></i> المحاضرات</h2>
        <button class="close-modal" onclick="this.closest('.modal').remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.style.overflow = 'auto';
    body.innerHTML = `
        <iframe 
            src="lectures-viewer.html?subject=${subject}" 
            style="width: 100%; height: 500px; border: none; border-radius: 12px;"
            frameborder="0">
        </iframe>
    `;
    
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    overlay.appendChild(modalContent);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Add this script to index.html just before the closing </body> tag
// <script src="lectures-integration.js"></script>
