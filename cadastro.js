document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o formulário de recarregar a página

    // Captura os dados do formulário
    const formData = new FormData(this);
    const msgDiv = document.getElementById('mensagem');

    // Envia os dados para o seu arquivo PHP (ex: cadastro_salvar.php)
    fetch('cadastro_salvar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // Se o PHP retornar '1', deu certo
        if (data.trim() === '1') {
            msgDiv.innerHTML = '<p style="color: green;">Cadastro realizado com sucesso!</p>';
            this.reset(); // Limpa o formulário
        } else {
            msgDiv.innerHTML = '<p style="color: red;">Erro ao cadastrar: ' + data + '</p>';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        msgDiv.innerHTML = '<p style="color: red;">Erro na comunicação com o servidor.</p>';
    });
});