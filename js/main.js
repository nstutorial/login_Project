document.addEventListener("DOMContentLoaded", () => {
    // Helper: show alerts
    function showAlert(message, type = "error") {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type}`;
      alertDiv.textContent = message;
      document.querySelector('.container').insertBefore(alertDiv, document.querySelector('form'));
      setTimeout(() => alertDiv.remove(), 5000);
    }
  
    // Login form submit handler
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();
  
        // Clear any existing alerts
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
  
        // Validate input
        if (!username || !password) {
          showAlert("Please enter both username and password.");
          return;
        }
  
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';
  
        try {
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ email: username, password }),
          });
          
          const data = await res.json();
          console.log(data);
  
          if (res.ok) {
            // Save token and user info in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
              _id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role
            }));
            
            // Show success message
            showAlert("Login successful! Redirecting...", "success");
            
            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = "dashboard.html";
            }, 1000);
          } else {
            showAlert(data.message || "Login failed. Please check your credentials.");
          }
        } catch (err) {
          console.error("Login error:", err);
          showAlert("Server error. Please try again later.");
        } finally {
          // Re-enable submit button
          submitButton.disabled = false;
          submitButton.textContent = 'Login';
        }
      });
    }
  
    // Register form submit handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = registerForm.querySelector('button[type="submit"]');
        
        // Clear any existing alerts
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.querySelector('select[name="role"]').value;
        
        // Validate input
        if (!name || !email || !password) {
          showAlert("Please fill in all required fields.");
          return;
        }
        
        if (password.length < 6) {
          showAlert("Password must be at least 6 characters long.");
          return;
        }
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';
        
        try {
          const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ name, email, password, role }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            showAlert("Registration successful! Redirecting to login...", "success");
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 1500);
          } else {
            showAlert(data.message || 'Registration failed');
          }
        } catch (err) {
          console.error('Registration error:', err);
          showAlert('An error occurred. Please try again.');
        } finally {
          // Re-enable submit button
          submitButton.disabled = false;
          submitButton.textContent = 'Register';
        }
      });
    }
  
    // Dashboard page - load user info
    const userNameSpan = document.getElementById("userName");
    if (userNameSpan) {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        window.location.href = "index.html";
        return;
      }
      try {
        const user = JSON.parse(userStr);
        userNameSpan.textContent = user.name || user.email || "User";
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
    }
  
    // Profile page - load profile data
    if (document.getElementById("profileName")) {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        window.location.href = "index.html";
        return;
      }
      try {
        const user = JSON.parse(userStr);
        document.getElementById("profileName").textContent = user.name || "N/A";
        document.getElementById("profileEmail").textContent = user.email || "N/A";
        document.getElementById("profileRole").textContent = user.role || "User";
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
    }
  
    // Logout handler
    document.querySelectorAll('a[href="index.html"]').forEach(link => {
      link.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
    });
  });
  