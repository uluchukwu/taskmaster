document.addEventListener("DOMContentLoaded", function () {
    // Validate function
    function validateFields(fields) {
        for (const field of fields) {
            if (!field.value.trim()) {
                showToast(`${field.name} is required`, "error");
                return false;
            }
        }
        return true;
    }

    function showToast(message, type) {
        const toast = document.createElement("div");
        toast.classList.add("toast", type);
        toast.innerText = message;

        document.body.appendChild(toast);

        // Show the toast
        setTimeout(() => {
            toast.style.display = "block";
            toast.style.opacity = "1";
        }, 100);

        // Hide after 3 seconds
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Signup handler
    const signup_form = document.getElementById("signup-form");

    if (signup_form) {
        signup_form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const c_password = document.getElementById("c_password").value;
            const authBtn = document.querySelector(".auth-button");

            const isValid = validateFields([
                { name: "Username", value: username },
                { name: "Email", value: email },
                { name: "Password", value: password },
                { name: "Confirm Password", value: c_password },
            ]);
            if (!isValid) return;

            if (password.length < 6) {
                showToast("Password must be at least 6 characters long", "error");
                return;
            }

            if (password !== c_password) {
                showToast("Passwords do not match!", "error");
                return;
            }

            authBtn.disabled = true;
            authBtn.innerHTML = `
                <div class="loader"></div> 
                <span>Signing Up...</span>`;

            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/signup",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, email, password }),
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    showToast("Signup successful", "success");
                    window.location.href = "login.html";
                } else {
                    showToast(data.message || "Signup failed", "error");
                }
            } catch (error) {
                console.log("Signup error:", error);
                showToast("Failed to register user", "error");
            } finally {
                authBtn.disabled = false;
                authBtn.innerHTML = "Sign Up";
            }
        });
    }

    // Login handler
    const login_form = document.getElementById("login-form");

    if (login_form) {
        login_form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            const authBtn = document.querySelector(".auth-button");

            const isValid = validateFields([
                { name: "Email", value: email },
                { name: "Password", value: password },
            ]);
            if (!isValid) return;

            if (password.length < 6) {
                showToast("Password must be at least 6 characters long", "error");
                return;
            }

            authBtn.disabled = true;
            authBtn.innerHTML = `
                <div class="loader"></div>
                <span>Logging in...</span>`;

            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ email, password }),
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    showToast("Login successful", "success");
                    window.location.href = "dashboard.html"; // Redirect
                } else {
                    showToast(data.message || "Login failed", "error");
                }
            } catch (error) {
                console.error("Login error:", error);
                showToast("Failed to login user", "error");
            } finally {
                authBtn.disabled = false;
                authBtn.innerHTML = "Login";
            }
        });
    }
});
