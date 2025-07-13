        let tasks = [];
        let taskIdCounter = 1;
        let currentFilter = 'all';
        let currentSort = 'date';
        let searchQuery = '';
        let isDarkMode = false;

        const taskForm = document.getElementById('taskForm');
        const taskList = document.getElementById('taskList');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const clearFormBtn = document.getElementById('clearForm');
        const searchInput = document.getElementById('searchInput');
        const themeToggle = document.getElementById('themeToggle');

        const showAllBtn = document.getElementById('showAll');
        const showCompletedBtn = document.getElementById('showCompleted');
        const showPendingBtn = document.getElementById('showPending');
        const showOverdueBtn = document.getElementById('showOverdue');
        const sortSelect = document.getElementById('sortBy');

        const totalTasksSpan = document.getElementById('totalTasks');
        const completedTasksSpan = document.getElementById('completedTasks');
        const pendingTasksSpan = document.getElementById('pendingTasks');
        const overdueTasksSpan = document.getElementById('overdueTasks');
        const progressFill = document.getElementById('progressFill');

        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            loadFromStorage();
        });

        function initializeApp() {
            taskForm.addEventListener('submit', handleFormSubmit);
            clearFormBtn.addEventListener('click', clearForm);
            searchInput.addEventListener('input', handleSearch);
            themeToggle.addEventListener('click', toggleTheme);
            
            showAllBtn.addEventListener('click', () => setFilter('all'));
            showCompletedBtn.addEventListener('click', () => setFilter('completed'));
            showPendingBtn.addEventListener('click', () => setFilter('pending'));
            showOverdueBtn.addEventListener('click', () => setFilter('overdue'));
            
            sortSelect.addEventListener('change', handleSortChange);
            
            taskList.addEventListener('click', handleTaskListClick);
            
            renderTasks();
            updateStats();
            
            setDefaultDateTime();
        }

        function setDefaultDateTime() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
            document.getElementById('taskDueTime').value = '17:00';
        }

        function handleFormSubmit(event) {
            event.preventDefault();
            
            try {
                const formData = new FormData(event.target);
                const title = formData.get('title').trim();
                const description = formData.get('description').trim();
                const category = formData.get('category');
                const priority = formData.get('priority');
                const dueDate = formData.get('dueDate');
                const dueTime = formData.get('dueTime');
                
  
                if (!title) {
                    showError('Görev başlığı boş olamaz!');
                    return;
                }
                
                if (!priority) {
                    showError('Öncelik seviyesi seçilmelidir!');
                    return;
                }
                
              
                let dueDateTime = null;
                if (dueDate) {
                    dueDateTime = new Date(dueDate + (dueTime ? ' ' + dueTime : ' 23:59'));
                }
                
           
                const newTask = {
                    id: taskIdCounter++,
                    title: title,
                    description: description,
                    category: category || 'genel',
                    priority: priority,
                    completed: false,
                    dueDate: dueDateTime,
                    createdAt: new Date()
                };
                
                tasks.push(newTask);
                
                clearForm();
                hideError();
                showSuccess('Görev başarıyla eklendi! 🎉');
                
                renderTasks();
                updateStats();
                saveToStorage();
                
            } catch (error) {
                showError('Görev eklenirken bir hata oluştu: ' + error.message);
            }
        }

        function clearForm() {
            taskForm.reset();
            hideError();
            hideSuccess();
            setDefaultDateTime();
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            setTimeout(hideError, 5000);
        }

        function hideError() {
            errorMessage.style.display = 'none';
        }

        function showSuccess(message) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            setTimeout(hideSuccess, 3000);
        }

        function hideSuccess() {
            successMessage.style.display = 'none';
        }

        function handleSearch(event) {
            searchQuery = event.target.value.toLowerCase();
            renderTasks();
        }

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
            localStorage.setItem('darkMode', isDarkMode);
        }

        function handleTaskListClick(event) {
            event.stopPropagation();
            
            const target = event.target;
            const taskItem = target.closest('.task-item');
            
            if (!taskItem) return;
            
            const taskId = parseInt(taskItem.dataset.taskId);
            
            if (target.classList.contains('btn-complete')) {
                toggleTaskCompletion(taskId);
            } else if (target.classList.contains('btn-delete')) {
                deleteTask(taskId);
            } else if (target.classList.contains('btn-undo')) {
                toggleTaskCompletion(taskId);
            } else if (target.classList.contains('btn-edit')) {
                editTask(taskId);
            }
        }

        function toggleTaskCompletion(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                task.completedAt = task.completed ? new Date() : null;
                renderTasks();
                updateStats();
                saveToStorage();
                
                const message = task.completed ? 'Görev tamamlandı! 🎉' : 'Görev tekrar açıldı! 🔄';
                showSuccess(message);
            }
        }

        function deleteTask(taskId) {
            if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
                tasks = tasks.filter(t => t.id !== taskId);
                renderTasks();
                updateStats();
                saveToStorage();
                showSuccess('Görev silindi! 🗑️');
            }
        }

        function editTask(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {

                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskCategory').value = task.category || '';
                
                if (task.dueDate) {
                    const date = new Date(task.dueDate);
                    document.getElementById('taskDueDate').value = date.toISOString().split('T')[0];
                    document.getElementById('taskDueTime').value = date.toTimeString().substr(0, 5);
                }
                
                document.querySelector(`input[name="priority"][value="${task.priority}"]`).checked = true;
                
                deleteTask(taskId);
                
                document.getElementById('taskTitle').focus();
                showSuccess('Görev düzenleme moduna alındı! ✏️');
            }
        }

        function setFilter(filter) {
            currentFilter = filter;
            
            document.querySelectorAll('.btn-filter').forEach(btn => {
                btn.classList.remove('active');
            });
            
            if (filter === 'all') {
                showAllBtn.classList.add('active');
            } else if (filter === 'completed') {
                showCompletedBtn.classList.add('active');
            } else if (filter === 'pending') {
                showPendingBtn.classList.add('active');
            } else if (filter === 'overdue') {
                showOverdueBtn.classList.add('active');
            }
            
            renderTasks();
        }

        function handleSortChange(event) {
            currentSort = event.target.value;
            renderTasks();
        }

        function isTaskOverdue(task) {
            if (!task.dueDate || task.completed) return false;
            return new Date() > new Date(task.dueDate);
        }

        function getFilteredTasks() {
            let filteredTasks = [...tasks];
            
            if (searchQuery) {
                filteredTasks = filteredTasks.filter(task => 
                    task.title.toLowerCase().includes(searchQuery) ||
                    (task.description && task.description.toLowerCase().includes(searchQuery)) ||
                    (task.category && task.category.toLowerCase().includes(searchQuery))
                );
            }
            
            if (currentFilter === 'completed') {
                filteredTasks = filteredTasks.filter(task => task.completed);
            } else if (currentFilter === 'pending') {
                filteredTasks = filteredTasks.filter(task => !task.completed);
            } else if (currentFilter === 'overdue') {
                filteredTasks = filteredTasks.filter(task => isTaskOverdue(task));
            }
            
            filteredTasks.sort((a, b) => {
                if (currentSort === 'date') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                } else if (currentSort === 'priority') {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                } else if (currentSort === 'title') {
                    return a.title.localeCompare(b.title, 'tr');
                } else if (currentSort === 'dueDate') {
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                } else if (currentSort === 'category') {
                    return (a.category || '').localeCompare(b.category || '', 'tr');
                }
                return 0;
            });
            
            return filteredTasks;
        }

        function renderTasks() {
            const filteredTasks = getFilteredTasks();
            
            if (filteredTasks.length === 0) {
                const emptyMessage = searchQuery ? 
                    `"${searchQuery}" araması için görev bulunamadı. 🔍` : 
                    'Görüntülenecek görev bulunamadı. 📋';
                taskList.innerHTML = `<div class="empty-state"><p>${emptyMessage}</p></div>`;
                return;
            }
            
            const tasksHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
            taskList.innerHTML = tasksHTML;
        }

        function createTaskHTML(task) {
            const priorityClass = `priority-${task.priority}`;
            const priorityText = getPriorityText(task.priority);
            const completedClass = task.completed ? 'completed' : '';
            const overdueClass = isTaskOverdue(task) ? 'overdue' : '';
            
            const actionButton = task.completed 
                ? '<button class="btn-undo">↩️ Geri Al</button>'
                : '<button class="btn-complete">✅ Tamamla</button>';
            
            const formattedDate = formatDate(task.createdAt);
            const dueDateText = task.dueDate ? formatDueDate(task.dueDate) : '';
            
            return `
                <div class="task-item ${completedClass} ${overdueClass}" data-task-id="${task.id}">
                    <div class="task-header">
                        <h3 class="task-title">${task.title}</h3>
                        <div class="task-badges">
                            <span class="task-priority ${priorityClass}">${priorityText}</span>
                            ${task.category ? `<span class="task-category">${getCategoryEmoji(task.category)} ${task.category}</span>` : ''}
                        </div>
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-meta">
                        <span> Oluşturulma: ${formattedDate}</span>
                        ${dueDateText ? `<span class="task-due-date ${getDueDateClass(task)}">${dueDateText}</span>` : ''}
                    </div>
                    <div class="task-actions">
                        ${actionButton}
                        <button class="btn-edit">✏️ Düzenle</button>
                        <button class="btn-delete">🗑️ Sil</button>
                    </div>
                </div>
            `;
        }

        function getPriorityText(priority) {
            const priorityTexts = {
                low: 'Düşük',
                medium: 'Orta',
                high: 'Yüksek'
            };
            return priorityTexts[priority] || priority;
        }

        function getCategoryEmoji(category) {
            const categoryEmojis = {
                'iş': '💼',
                'kişisel': '👤',
                'alışveriş': '🛒',
                'eğitim': '📚',
                'sağlık': '🏥',
                'diğer': '📝'
            };
            return categoryEmojis[category] || '📁';
        }

        function getDueDateClass(task) {
            if (!task.dueDate || task.completed) return '';
            
            const now = new Date();
            const dueDate = new Date(task.dueDate);
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            
            if (dueDate < now) return 'overdue';
            if (taskDate.getTime() === today.getTime()) return 'today';
            return '';
        }

        function formatDate(date) {
            return new Date(date).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function formatDueDate(date) {
            const now = new Date();
            const dueDate = new Date(date);
            const isOverdue = dueDate < now;
            
            const formatted = dueDate.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            
            if (isOverdue) {
                return `⚠️ Gecikmiş: ${formatted}`;
            } else if (taskDate.getTime() === today.getTime()) {
                return `⏰ Bugün: ${formatted}`;
            } else {
                return `📅 Bitiş: ${formatted}`;
            }
        }

        function updateStats() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            const pendingTasks = totalTasks - completedTasks;
            const overdueTasks = tasks.filter(task => isTaskOverdue(task)).length;
            
            totalTasksSpan.textContent = totalTasks;
            completedTasksSpan.textContent = completedTasks;
            pendingTasksSpan.textContent = pendingTasks;
            overdueTasksSpan.textContent = overdueTasks;
            
            const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            progressFill.style.width = `${progressPercentage}%`;
        }

        function saveToStorage() {
            try {
                const data = {
                    tasks: tasks,
                    taskIdCounter: taskIdCounter,
                    darkMode: isDarkMode
                };
                window.taskData = data;
            } catch (error) {
                console.error('Veri kaydedilemedi:', error);
            }
        }

        function loadFromStorage() {
            try {
                const data = window.taskData;
                if (data) {
                    tasks = data.tasks || [];
                    taskIdCounter = data.taskIdCounter || 1;
                    isDarkMode = data.darkMode || false;
                    
                    if (isDarkMode) {
                        toggleTheme();
                    }
                    
                    renderTasks();
                    updateStats();
                }
            } catch (error) {
                console.error('Veri yüklenemedi:', error);
            }
        }

        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'Enter') {
                const titleInput = document.getElementById('taskTitle');
                if (titleInput.value.trim()) {
                    taskForm.dispatchEvent(new Event('submit'));
                }
            }
            
            if (event.key === 'Escape') {
                clearForm();
                searchInput.value = '';
                searchQuery = '';
                renderTasks();
            }
            
            if (event.ctrlKey && event.key === 'f') {
                event.preventDefault();
                searchInput.focus();
            }
        });

        document.getElementById('taskTitle').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                taskForm.dispatchEvent(new Event('submit'));
            }
        });

        setInterval(function() {
            if (tasks.length > 0) {
                saveToStorage();
            }
        }, 30000); 