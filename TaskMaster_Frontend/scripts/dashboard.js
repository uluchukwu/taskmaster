document.addEventListener('DOMContentLoaded', async () => {

    try {
        const response = await fetch('http://localhost:5000/api/auth/current-user', {
            method: 'GET',
            credentials: 'include'
        });
    
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
    
        const data = await response.json();
        
        const username = document.querySelector(".username");
        username.innerHTML = `Hello, <b>${data.username}!</b>`;
    } catch (error) {
        console.log(response.message);
           
    }
    

    const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn");
    const mainLogoutBtn = document.getElementById("main-logout-btn");

    function showToast(message, type = "success") {
        const toastContainer = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerText = message;
        toastContainer.appendChild(toast);
    
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    async function logout() {
        mainLogoutBtn.disabled = true;

        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
                method: 'POST',
                credentials: 'include', 
            });

            const data = await response.json();

            if (response.ok) {
                
                showToast(data.message, "success");

                setTimeout(() => {
                    window.location.href = "login.html"; 
                }, 1000); 
            } else {
             
                showToast(data.message || "Failed to log out.", "error");
            }
        } catch (error) {
            console.error("Error during logout:", error);
           
            showToast(response.message || "An error occurred during logout.", "error");
        } finally {
            mainLogoutBtn.disabled = false
        }
    }

    sidebarLogoutBtn.addEventListener("click", logout)
    mainLogoutBtn.addEventListener("click", logout) 

    
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.getElementById("sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar-btn");
  
    function toggleSidebar() {
      const isOpen = sidebar.classList.toggle("open");
      hamburgerBtn.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "auto"; // Prevent scrolling when sidebar is open
    }
  
    hamburgerBtn.addEventListener("click", toggleSidebar);
    closeSidebarBtn.addEventListener("click", toggleSidebar);
  
    // Optional: Close sidebar when clicking outside it
    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target) && sidebar.classList.contains("open")) {
        toggleSidebar();
      }
    });
    
});
