// Aguarda até que o HTML esteja completamente carregado
document.addEventListener('DOMContentLoaded', () => {
        // Seleciona os elementos principais do DOM
    const loginForm = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
     // Adiciona um ouvinte para quando o formulário for enviado
    loginForm.addEventListener('submit', (e) => {
        // Previne o comportamento padrão (recarregar página)
        e.preventDefault();
        // Limpa qualquer erro anterior do email
        emailError.textContent = '';

        // Testa se o email tem formato válido usando regex
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        
        // Se email for inválido, mostra erro e para a execução
        if (!isValid) {
            emailError.textContent = 'E-mail inválido';
            return;
        }
        
         // Valida se a senha não está vazia
        if (!document.getElementById('password').value.trim()) {
            alert('Senha obrigatória');
            return;
        }
        
        // Salva o email no localStorage (para usar no dashboard)
        localStorage.setItem('userEmail', email.value.trim());
        // Redireciona para a página do dashboard
        window.location.href = 'dashboard.html';
    });
});