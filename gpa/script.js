// نظام التقديرات حسب لائحة كلية الحاسبات والمعلومات - جامعة كفر الشيخ
const gradeSystem = {
    'A+': { points: 4.0, percentage: 96 },
    'A': { points: 3.7, percentage: 92 },
    'A-': { points: 3.4, percentage: 88 },
    'B+': { points: 3.2, percentage: 84 },
    'B': { points: 3.0, percentage: 80 },
    'B-': { points: 2.8, percentage: 76 },
    'C+': { points: 2.6, percentage: 72 },
    'C': { points: 2.4, percentage: 68 },
    'C-': { points: 2.2, percentage: 64 },
    'D+': { points: 2.0, percentage: 60 },
    'D': { points: 1.5, percentage: 55 },
    'D-': { points: 1.0, percentage: 50 },
    'F': { points: 0.0, percentage: 0 },
    'Abs': { points: 0.0, percentage: 0 },
    'W': { points: null, percentage: null },
    'I': { points: null, percentage: null },
    'Con': { points: null, percentage: null }
};

// المواد حسب التخصص
const courses = {
    science: [
        { name: 'Math 0', hours: 0, counted: false }, // ماث زيرو ملهاش ساعات معتمدة
        { name: 'Math 1', hours: 3, counted: true },
        { name: 'تاريخ حوسبة', hours: 2, counted: true },
        { name: 'قوانين حوسبة', hours: 2, counted: true },
        { name: 'إنجليزي', hours: 2, counted: true },
        { name: 'فيزياء', hours: 3, counted: true },
        { name: 'إلكترونيات', hours: 3, counted: true },
        { name: 'IT', hours: 3, counted: true }
    ],
    math: [
        { name: 'Math 1', hours: 3, counted: true },
        { name: 'تاريخ حوسبة', hours: 2, counted: true },
        { name: 'قوانين حوسبة', hours: 2, counted: true },
        { name: 'إنجليزي', hours: 2, counted: true },
        { name: 'فيزياء', hours: 3, counted: true },
        { name: 'إلكترونيات', hours: 3, counted: true },
        { name: 'IT', hours: 3, counted: true }
    ]
};

let selectedSpecialization = null;

// اختيار التخصص
function selectSpecialization(type) {
    selectedSpecialization = type;
    
    // تحديث أزرار التخصص
    document.querySelectorAll('.btn-specialization').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (type === 'science') {
        document.getElementById('scienceBtn').classList.add('active');
        document.getElementById('selectedSpec').textContent = '✓ تم اختيار: علمي علوم';
    } else {
        document.getElementById('mathBtn').classList.add('active');
        document.getElementById('selectedSpec').textContent = '✓ تم اختيار: علمي رياضة';
    }
    
    document.getElementById('selectedSpec').classList.remove('hidden');
    
    // إظهار الأقسام الأخرى
    document.getElementById('previousGPASection').classList.remove('hidden');
    document.getElementById('coursesSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // إضافة المواد
    loadCourses(type);
    
    // التمرير للأسفل
    setTimeout(() => {
        document.getElementById('coursesSection').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// تحميل المواد حسب التخصص
function loadCourses(type) {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';
    
    const coursesData = courses[type];
    
    coursesData.forEach((course, index) => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-item';
        courseDiv.id = `course-${index}`;
        
        // إضافة ملاحظة لماث زيرو
        const mathZeroNote = course.name === 'Math 0' ? 
            '<p style="color: #ea580c; font-size: 0.9rem; margin-top: 8px; font-weight: 600;">⚠️ هذه المادة لا تحتسب في المعدل (ليس لها ساعات معتمدة)</p>' : '';
        
        courseDiv.innerHTML = `
            <div class="course-header">
                <div class="course-number">${index + 1}</div>
                <div style="flex: 1; padding: 0 15px;">
                    <strong style="font-size: 1.1rem; color: var(--dark);">${course.name}</strong>
                    ${course.counted ? `<span style="color: var(--gray); font-size: 0.9rem; margin-right: 10px;">(${course.hours} ساعة معتمدة)</span>` : ''}
                </div>
            </div>
            <div class="course-inputs">
                <select id="courseGrade-${index}" class="course-grade" required>
                    <option value="">اختر التقدير</option>
                    <optgroup label="ممتاز">
                        <option value="A+">A+ (4.0) - 96% فأكثر</option>
                        <option value="A">A (3.7) - 92% - 96%</option>
                        <option value="A-">A- (3.4) - 88% - 92%</option>
                    </optgroup>
                    <optgroup label="جيد جداً">
                        <option value="B+">B+ (3.2) - 84% - 88%</option>
                        <option value="B">B (3.0) - 80% - 84%</option>
                        <option value="B-">B- (2.8) - 76% - 80%</option>
                    </optgroup>
                    <optgroup label="جيد">
                        <option value="C+">C+ (2.6) - 72% - 76%</option>
                        <option value="C">C (2.4) - 68% - 72%</option>
                        <option value="C-">C- (2.2) - 64% - 68%</option>
                    </optgroup>
                    <optgroup label="مقبول">
                        <option value="D+">D+ (2.0) - 60% - 64%</option>
                        <option value="D">D (1.5) - 55% - 60%</option>
                        <option value="D-">D- (1.0) - 50% - 55%</option>
                    </optgroup>
                    <optgroup label="راسب">
                        <option value="F">F (0.0) - أقل من 50%</option>
                    </optgroup>
                    <optgroup label="حالات خاصة">
                        <option value="Abs">Abs - غياب</option>
                        <option value="W">W - انسحاب</option>
                        <option value="I">I - غير مكتمل</option>
                        <option value="Con">Con - مستمر</option>
                    </optgroup>
                </select>
                <input type="number" 
                       id="coursePercentage-${index}" 
                       placeholder="النسبة المئوية (اختياري)"
                       min="0"
                       max="100"
                       step="0.01"
                       class="course-percentage">
            </div>
            ${mathZeroNote}
        `;
        
        // حفظ بيانات المادة
        courseDiv.dataset.courseName = course.name;
        courseDiv.dataset.courseHours = course.hours;
        courseDiv.dataset.courseCounted = course.counted;
        
        container.appendChild(courseDiv);
    });
}

// تغيير التخصص
function changeSpecialization() {
    if (confirm('هل أنت متأكد من تغيير التخصص؟ سيتم حذف جميع التقديرات المدخلة.')) {
        // إعادة تعيين كل شيء
        selectedSpecialization = null;
        document.getElementById('coursesContainer').innerHTML = '';
        document.getElementById('selectedSpec').classList.add('hidden');
        document.getElementById('previousGPASection').classList.add('hidden');
        document.getElementById('coursesSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('results').classList.add('hidden');
        
        document.querySelectorAll('.btn-specialization').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // التمرير للأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// حساب المعدل
function calculateGPA() {
    if (!selectedSpecialization) {
        alert('⚠️ الرجاء اختيار التخصص أولاً');
        return;
    }
    
    const coursesData = courses[selectedSpecialization];
    let totalPoints = 0;
    let totalHours = 0;
    let isValid = true;
    let errorMessages = [];
    
    coursesData.forEach((course, index) => {
        const gradeSelect = document.getElementById(`courseGrade-${index}`);
        const grade = gradeSelect.value;
        
        // التحقق من إدخال التقدير
        if (!grade) {
            errorMessages.push(`❌ ${course.name}: الرجاء اختيار التقدير`);
            gradeSelect.style.borderColor = 'red';
            isValid = false;
        } else {
            gradeSelect.style.borderColor = '';
            
            // حساب النقاط والساعات (فقط للمواد المحتسبة)
            if (course.counted && gradeSystem[grade].points !== null) {
                totalPoints += gradeSystem[grade].points * course.hours;
                totalHours += course.hours;
            }
        }
    });
    
    if (!isValid) {
        alert(errorMessages.join('\n'));
        return;
    }
    
    if (totalHours === 0) {
        alert('⚠️ لا توجد مواد محتسبة');
        return;
    }
    
    // حساب المعدل الفصلي (GPA)
    const semesterGPA = (totalPoints / totalHours).toFixed(2);
    
    // حساب المعدل التراكمي (CGPA)
    const previousGPA = parseFloat(document.getElementById('previousGPA').value) || 0;
    const previousHours = parseFloat(document.getElementById('previousHours').value) || 0;
    
    let cumulativeGPA;
    let totalCumulativeHours;
    
    if (previousGPA > 0 && previousHours > 0) {
        const previousTotalPoints = previousGPA * previousHours;
        const newTotalPoints = previousTotalPoints + totalPoints;
        totalCumulativeHours = previousHours + totalHours;
        cumulativeGPA = (newTotalPoints / totalCumulativeHours).toFixed(2);
    } else {
        cumulativeGPA = semesterGPA;
        totalCumulativeHours = totalHours;
    }
    
    // تحديد التقدير العام
    const overallGrade = getGradeDescription(parseFloat(cumulativeGPA));
    
    // عرض النتائج
    document.getElementById('semesterGPA').textContent = semesterGPA;
    document.getElementById('cumulativeGPA').textContent = cumulativeGPA;
    document.getElementById('totalHours').textContent = totalCumulativeHours;
    document.getElementById('overallGrade').textContent = overallGrade;
    
    // إضافة ألوان للتقديرات
    const gradeElement = document.getElementById('overallGrade');
    gradeElement.className = 'result-grade';
    
    if (parseFloat(cumulativeGPA) >= 3.4) {
        gradeElement.style.color = '#16a34a';
    } else if (parseFloat(cumulativeGPA) >= 2.8) {
        gradeElement.style.color = '#2563eb';
    } else if (parseFloat(cumulativeGPA) >= 2.2) {
        gradeElement.style.color = '#eab308';
    } else if (parseFloat(cumulativeGPA) >= 1.0) {
        gradeElement.style.color = '#ea580c';
    } else {
        gradeElement.style.color = '#dc2626';
    }
    
    // إظهار قسم النتائج
    document.getElementById('results').classList.remove('hidden');
    
    // التمرير إلى النتائج
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// الحصول على وصف التقدير
function getGradeDescription(gpa) {
    if (gpa >= 3.4) return 'ممتاز 🌟';
    if (gpa >= 2.8) return 'جيد جداً ⭐';
    if (gpa >= 2.2) return 'جيد ✓';
    if (gpa >= 1.0) return 'مقبول';
    return 'راسب';
}

// إعادة تعيين الحاسبة
function resetCalculator() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟')) {
        location.reload();
    }
}

// إظهار/إخفاء جدول التقديرات
function toggleGradeTable() {
    const table = document.getElementById('gradeTable');
    table.classList.toggle('hidden');
    
    if (!table.classList.contains('hidden')) {
        table.scrollIntoView({ behavior: 'smooth' });
    }
}

// إضافة تأثيرات عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // إضافة أنيميشن للعناصر
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.5s ease-out';
            }
        });
    });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
