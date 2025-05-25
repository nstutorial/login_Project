fetch('navbar/nav.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navContainer').innerHTML = data;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const role = currentUser?.role;

    if (currentUser?.name) {
      document.getElementById('userName').textContent = currentUser.name;
    }

    // Hide pages not allowed for non-admins
    if (role !== 'admin') {
      ['usersLink', 'adminLink', 'settingsLink'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
    }

    // Logout clears user session
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
      });
    }
  });
