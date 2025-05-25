
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser || currentUser.role !== 'admin') {
    alert("Access denied. You are not authorized to view this page.");
    window.location.href = 'profile.html'; // or index.html
  }

