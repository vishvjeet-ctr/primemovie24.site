// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                sidebar.classList.remove('sidebar-open');
            }
        });
    }

    // Movie Search Functionality
    const movieSearch = document.getElementById('movieSearch');
    if (movieSearch) {
        movieSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const movieRows = document.querySelectorAll('.movies-table tbody tr');
            
            movieRows.forEach(function(row) {
                const titleCell = row.querySelector('.title-cell');
                if (titleCell) {
                    const title = titleCell.textContent.toLowerCase();
                    if (title.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }
});
