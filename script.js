if (!localStorage.getItem('userEmail')) {
    window.location.href = 'login.html'; // Expulsa quem tentar entrar direto pela URL
}
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email'); // id do campo de login/email
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        emailError.textContent = '';

        // 1. Validação básica de formato (Front-end)
        const loginValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!loginValue || !passwordValue) {
            alert('Preencha todos os campos');
            return;
        }

        // 2. Preparar os dados para enviar ao PHP
        // Usamos FormData para que o PHP receba como $_POST["pLogin"] e $_POST["pSenha"]
        const dados = new FormData();
        dados.append('pLogin', loginValue);
        dados.append('pSenha', passwordValue);

        try {
            // 3. Chamada ao servidor (Back-end)
            const response = await fetch('login_validar.php', {
                method: 'POST',
                body: dados
            });

            const resultado = await response.text();

            // 4. Verificar a resposta do PHP
            if (resultado.trim() === '1') {
                // SUCESSO: Usuário existe e senha confere
                localStorage.setItem('userEmail', loginValue);
                window.location.href = 'dashboard.html';
            } else {
                // ERRO: Usuário não cadastrado ou senha errada
                emailError.textContent = 'Usuário ou senha incorretos.';
                emailError.style.color = 'red';
            }

        } catch (error) {
            console.error('Erro na conexão:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
});