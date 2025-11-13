document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Limpa mensagens de erro anteriores
        emailError.textContent = '';
        emailInput.classList.remove('invalid');

        let isValid = true;

        // --- Validação do E-mail ---
        const emailValue = emailInput.value.trim();
        if (emailValue === '') {
            emailError.textContent = 'O e-mail é obrigatório.';
            emailInput.classList.add('invalid');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            emailError.textContent = 'Por favor, insira um e-mail válido (ex: seu@dominio.com).';
            emailInput.classList.add('invalid');
            isValid = false;
        }

        // --- Validação da Senha (Exemplo básico) ---
        // Você pode adicionar mais validações aqui, como comprimento mínimo
        if (passwordInput.value.trim() === '') {
            // Normalmente, você não mostraria um erro específico para senha vazia
            // por questões de segurança (não informar se o problema é email ou senha)
            // Mas para demonstração, poderíamos ter um erro aqui.
            // Por enquanto, apenas consideramos o formulário inválido.
            isValid = false;
        }

        // --- Se todas as validações passarem ---
        if (isValid) {
            // Aqui você faria a lógica de autenticação real (AJAX para um backend, etc.)
            // Por enquanto, vamos simular um login bem-sucedido.

            console.log('E-mail:', emailValue);
            console.log('Senha:', passwordInput.value);

            alert('Login bem-sucedido! Redirecionando...');

            // --- Ponto para Redirecionamento ---
            // Substitua 'proxima_pagina.html' pelo caminho da sua próxima página.
            window.location.href = 'dashboard.html';
        }
    });

    // Função de validação de e-mail com regex
    function isValidEmail(email) {
        // Regex para verificar formato básico de e-mail (com @ e domínio)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Opcional: Remover mensagem de erro quando o usuário começa a digitar novamente
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '' && isValidEmail(emailInput.value.trim())) {
            emailError.textContent = '';
            emailInput.classList.remove('invalid');
        }
    });
});