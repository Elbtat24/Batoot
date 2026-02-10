// lectures-manager.js
// نظام إدارة المحاضرات - رفع الملفات على GitHub وحفظ البيانات في Firebase

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAh3FELUxVKt9TJN1qpJUKR5mNxZbNBzFQ",
    authDomain: "batoot-70a2a.firebaseapp.com",
    databaseURL: "https://batoot-70a2a-default-rtdb.firebaseio.com",
    projectId: "batoot-70a2a",
    storageBucket: "batoot-70a2a.firebasestorage.app",
    messagingSenderId: "522464341625",
    appId: "1:522464341625:web:df8db0f875f7cd8b6d28bb",
    measurementId: "G-2PBK5QG5CJ"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();

// GitHub Configuration Keys
const GITHUB_TOKEN_KEY = 'batoot_github_token';
const GITHUB_USERNAME_KEY = 'batoot_github_username';
const GITHUB_REPO_KEY = 'batoot_github_repo';

// Get GitHub config from localStorage
function getGithubConfig() {
    return {
        token: localStorage.getItem(GITHUB_TOKEN_KEY) || '',
        username: localStorage.getItem(GITHUB_USERNAME_KEY) || '',
        repo: localStorage.getItem(GITHUB_REPO_KEY) || ''
    };
}

// Save GitHub config to localStorage
function saveGithubConfig() {
    const token = document.getElementById('githubToken').value.trim();
    const username = document.getElementById('githubUsername').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();
    
    if (!token || !username || !repo) {
        showMessage('يرجى ملء جميع حقول إعدادات GitHub', 'error');
        return;
    }
    
    localStorage.setItem(GITHUB_TOKEN_KEY, token);
    localStorage.setItem(GITHUB_USERNAME_KEY, username);
    localStorage.setItem(GITHUB_REPO_KEY, repo);
    
    showMessage('تم حفظ إعدادات GitHub بنجاح!', 'success');
}

// Load saved GitHub config
function loadGithubConfig() {
    const config = getGithubConfig();
    document.getElementById('githubToken').value = config.token;
    document.getElementById('githubUsername').value = config.username;
    document.getElementById('githubRepo').value = config.repo;
}

// Show status message
function showMessage(message, type = 'success') {
    const msgEl = document.getElementById('statusMessage');
    msgEl.textContent = message;
    msgEl.className = `status-message ${type}`;
    msgEl.style.display = 'block';
    
    setTimeout(() => {
        msgEl.style.display = 'none';
    }, 5000);
}

// Show/hide loading overlay
function setLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.toggle('active', show);
}

// Convert file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remove the data:application/pdf;base64, prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Upload file to GitHub
async function uploadToGithub(file, path) {
    const config = getGithubConfig();
    
    if (!config.token || !config.username || !config.repo) {
        throw new Error('يرجى إعداد GitHub أولاً');
    }
    
    // Check file size (GitHub has 25MB limit for files via API)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
        throw new Error('حجم الملف كبير جداً. الحد الأقصى 25 ميجابايت');
    }
    
    const content = await fileToBase64(file);
    
    const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${path}`;
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${config.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Upload: ${file.name}`,
            content: content,
            branch: 'main' // or 'master' depending on your default branch
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل رفع الملف على GitHub');
    }
    
    const data = await response.json();
    return data.content.download_url;
}

// Delete file from GitHub
async function deleteFromGithub(path) {
    const config = getGithubConfig();
    
    if (!config.token || !config.username || !config.repo) {
        throw new Error('يرجى إعداد GitHub أولاً');
    }
    
    // First, get the file SHA
    const getUrl = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${path}`;
    const getResponse = await fetch(getUrl, {
        headers: {
            'Authorization': `token ${config.token}`,
        }
    });
    
    if (!getResponse.ok) {
        throw new Error('فشل الحصول على معلومات الملف');
    }
    
    const fileData = await getResponse.json();
    
    // Now delete the file
    const deleteUrl = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${path}`;
    const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Authorization': `token ${config.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Delete: ${path}`,
            sha: fileData.sha,
            branch: 'main'
        })
    });
    
    if (!deleteResponse.ok) {
        throw new Error('فشل حذف الملف من GitHub');
    }
}

// Upload form handler
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById('subjectSelect').value;
    const title = document.getElementById('lectureTitle').value.trim();
    const description = document.getElementById('lectureDescription').value.trim();
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];
    
    if (!subject || !title || !file) {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // Validate PDF
    if (file.type !== 'application/pdf') {
        showMessage('يرجى رفع ملف PDF فقط', 'error');
        return;
    }
    
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.disabled = true;
    setLoading(true);
    
    try {
        // Generate safe filename
        const timestamp = Date.now();
        const safeFilename = `${subject}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const githubPath = `lectures/${subject}/${safeFilename}`;
        
        // Upload to GitHub
        const fileUrl = await uploadToGithub(file, githubPath);
        
        // Save to Firebase
        const lectureData = {
            subject: subject,
            title: title,
            description: description,
            filename: file.name,
            fileUrl: fileUrl,
            githubPath: githubPath,
            fileSize: file.size,
            uploadedAt: firebase.database.ServerValue.TIMESTAMP,
            uploadedBy: auth.currentUser ? auth.currentUser.email : 'admin'
        };
        
        await db.ref('lectures').push(lectureData);
        
        showMessage('تم رفع المحاضرة بنجاح!', 'success');
        
        // Reset form
        document.getElementById('uploadForm').reset();
        
        // Reload lectures
        loadLectures();
        
    } catch (error) {
        console.error('Error uploading lecture:', error);
        showMessage(`خطأ: ${error.message}`, 'error');
    } finally {
        uploadBtn.disabled = false;
        setLoading(false);
    }
});

// Get subject display name in Arabic
function getSubjectNameAr(subject) {
    const names = {
        'circuit': 'الدوائر الكهربائية',
        'economic': 'الاقتصاد',
        'math': 'الرياضيات',
        'physics': 'الفيزياء',
        'privacy': 'الخصوصية',
        'programing': 'البرمجة'
    };
    return names[subject] || subject;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Load and display lectures
let allLectures = [];

async function loadLectures() {
    try {
        const snapshot = await db.ref('lectures').once('value');
        const lectures = [];
        
        snapshot.forEach((child) => {
            lectures.push({
                id: child.key,
                ...child.val()
            });
        });
        
        // Sort by upload date (newest first)
        lectures.sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
        
        allLectures = lectures;
        displayLectures(lectures);
        
    } catch (error) {
        console.error('Error loading lectures:', error);
        showMessage('خطأ في تحميل المحاضرات', 'error');
    }
}

// Display lectures
function displayLectures(lectures) {
    const container = document.getElementById('lecturesList');
    
    if (lectures.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: rgba(238,242,255,.5); padding: 40px 0;">
                لا توجد محاضرات
            </p>
        `;
        return;
    }
    
    container.innerHTML = lectures.map(lecture => `
        <div class="lecture-item">
            <div class="lecture-info">
                <h4>${lecture.title}</h4>
                ${lecture.description ? `<p style="color: rgba(238,242,255,.7); margin: 5px 0;">${lecture.description}</p>` : ''}
                <div class="lecture-meta">
                    <span>
                        <i class="fas fa-book"></i>
                        ${getSubjectNameAr(lecture.subject)}
                    </span>
                    <span>
                        <i class="fas fa-file-pdf"></i>
                        ${formatFileSize(lecture.fileSize)}
                    </span>
                    <span>
                        <i class="fas fa-calendar"></i>
                        ${formatDate(lecture.uploadedAt)}
                    </span>
                </div>
            </div>
            <div class="lecture-actions">
                <a href="${lecture.fileUrl}" target="_blank" class="btn-icon" title="عرض الملف">
                    <i class="fas fa-eye"></i>
                </a>
                <a href="${lecture.fileUrl}" download class="btn-icon" title="تحميل">
                    <i class="fas fa-download"></i>
                </a>
                <button class="btn-icon btn-delete" onclick="deleteLecture('${lecture.id}', '${lecture.githubPath}')" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Filter lectures by subject
function filterLectures() {
    const selectedSubject = document.getElementById('filterSubject').value;
    
    if (!selectedSubject) {
        displayLectures(allLectures);
        return;
    }
    
    const filtered = allLectures.filter(lecture => lecture.subject === selectedSubject);
    displayLectures(filtered);
}

// Delete lecture
async function deleteLecture(lectureId, githubPath) {
    if (!confirm('هل أنت متأكد من حذف هذه المحاضرة؟')) {
        return;
    }
    
    setLoading(true);
    
    try {
        // Delete from GitHub
        await deleteFromGithub(githubPath);
        
        // Delete from Firebase
        await db.ref(`lectures/${lectureId}`).remove();
        
        showMessage('تم حذف المحاضرة بنجاح', 'success');
        
        // Reload lectures
        loadLectures();
        
    } catch (error) {
        console.error('Error deleting lecture:', error);
        showMessage(`خطأ في حذف المحاضرة: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGithubConfig();
    loadLectures();
    
    // Check authentication
    auth.onAuthStateChanged((user) => {
        if (!user) {
            // Optionally redirect to login or show message
            console.log('Not authenticated');
        }
    });
});
