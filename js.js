document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const buttonText = loginButton.querySelector('.btn-text');
    const spinner = loginButton.querySelector('.spinner-border');
    const alertContainer = document.getElementById('alert-container');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Email validation
        if (!emailInput.value.trim()) {
            showFieldError(emailInput, 'O email é obrigatório');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showFieldError(emailInput, 'Por favor, insira um email válido');
            isValid = false;
        } else {
            clearFieldError(emailInput);
        }
        
        // Password validation
        if (!passwordInput.value.trim()) {
            showFieldError(passwordInput, 'A senha é obrigatória');
            isValid = false;
        } else if (passwordInput.value.trim().length < 6) {
            showFieldError(passwordInput, 'A senha deve ter pelo menos 6 caracteres');
            isValid = false;
        } else {
            clearFieldError(passwordInput);
        }
        
        return isValid;
    }
    
    // Show field error
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        const feedbackElement = document.getElementById(`${field.id}-feedback`);
        if (feedbackElement) {
            feedbackElement.textContent = message;
        }
        field.parentElement.classList.add('shake');
        
        // Remove shake animation after it completes
        setTimeout(() => {
            field.parentElement.classList.remove('shake');
        }, 500);
    }
    
    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedbackElement = document.getElementById(`${field.id}-feedback`);
        if (feedbackElement) {
            feedbackElement.textContent = '';
        }
    }
    
    // Show alert message
    function showAlert(message, type = 'danger') {
        // Clear any existing alerts
        alertContainer.innerHTML = '';
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.role = 'alert';
        
        // Add icon based on alert type
        let icon = 'fa-circle-exclamation';
        if (type === 'success') {
            icon = 'fa-circle-check';
        } else if (type === 'warning') {
            icon = 'fa-triangle-exclamation';
        } else if (type === 'info') {
            icon = 'fa-circle-info';
        }
        
        alert.innerHTML = `
            <i class="fas ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Add alert to container
        alertContainer.appendChild(alert);
        
        // Auto dismiss after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.classList.remove('show');
                    setTimeout(() => {
                        if (alert.parentNode) {
                            alert.parentNode.removeChild(alert);
                        }
                    }, 150);
                }
            }, 5000);
        }
    }
    
    // Set loading state
    function setLoading(isLoading) {
        if (isLoading) {
            loginButton.disabled = true;
            buttonText.textContent = 'Entrando...';
            spinner.classList.remove('d-none');
        } else {
            loginButton.disabled = false;
            buttonText.textContent = 'Entrar';
            spinner.classList.add('d-none');
        }
    }
    
    // Form submission handler
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Reset previous errors
        alertContainer.innerHTML = '';
        clearFieldError(emailInput);
        clearFieldError(passwordInput);
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Set loading state
        setLoading(true);
        
        // Prepare data
        const loginData = {
            email: emailInput.value.trim(),
            senha: passwordInput.value.trim()
        };
        
        // Send login request
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer login. Verifique suas credenciais.');
            }
            return response.json();
        })
        .then(data => {
            showAlert('Login realizado com sucesso!', 'success');
            console.log('Login successful:', data);
            
            // Simulate redirect to dashboard after successful login
            setTimeout(() => {
                showAlert('Redirecionando para o painel...', 'info');
                // This would redirect in a real application
                // window.location.href = '/dashboard';
            }, 1500);
        })
        .catch(error => {
            console.error('Login error:', error);
            showAlert('Falha no login: ' + error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    });
    
    // Live validation on input
    emailInput.addEventListener('input', function() {
        if (this.value.trim() && this.classList.contains('is-invalid')) {
            if (isValidEmail(this.value.trim())) {
                clearFieldError(this);
            }
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.value.trim() && this.classList.contains('is-invalid')) {
            clearFieldError(this);
        }
    });
});