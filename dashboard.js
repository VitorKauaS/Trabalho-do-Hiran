// Quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    
    // ======================
    // 1. PEGA OS ELEMENTOS DO HTML
    // ======================
    
    // Botões principais
    const logoutBtn = document.getElementById('logoutBtn');
    const newLicenseBtn = document.getElementById('newLicenseBtn');
    
    // Modal (popup)
    const modal = document.getElementById('addLicenseModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelAddLicenseBtn');
    
    // Formulário do modal
    const licenseForm = document.getElementById('addLicenseForm');
    
    // Onde a tabela vai ser preenchida
    const tableBody = document.getElementById('licensesTableBody');
    
    // Números dos cards (total, ativas, etc)
    const totalEl = document.getElementById('totalLicenses');
    const activeEl = document.getElementById('activeLicenses');
    const expiringEl = document.getElementById('expiringLicenses');
    const expiredEl = document.getElementById('expiredLicenses');
    
    // ======================
    // 2. DADOS DE EXEMPLO
    // ======================
    
    // Lista de licenças 
    let licenses = [
        {
            name: 'Licença Ambiental',
            type: 'Ambiental',
            issuer: 'IBAMA',
            number: 'LAO-2023-001',
            emission: '2023-01-15',
            validity: '2024-01-15',
            status: 'expirada'  
        },
        {
            name: 'Alvará de Funcionamento',
            type: 'Operação',
            issuer: 'Prefeitura',
            number: 'AF-2023-045',
            emission: '2023-03-10',
            validity: '2024-12-31',
            status: 'ativa'
        },
        {
            name: 'Licença Sanitária',
            type: 'Sanitária',
            issuer: 'Vigilância',
            number: 'LS-2023-078',
            emission: '2023-06-20',
            validity: '2023-12-20',
            status: 'expirando'
        }
    ];
    
    // ======================
    // 3. FUNÇÕES PARA ATUALIZAR A TELA
    // ======================
    
    // Atualiza os números dos cards (total: 3, ativas: 1, etc)
    function updateCards() {
        // Conta quantas licenças tem de cada tipo
        totalEl.textContent = licenses.length;
        activeEl.textContent = licenses.filter(l => l.status === 'ativa').length;
        expiringEl.textContent = licenses.filter(l => l.status === 'expirando').length;
        expiredEl.textContent = licenses.filter(l => l.status === 'expirada').length;
    }
    
    // Preenche a tabela com as licenças
    function renderTable() {
        // Limpa a tabela antes de preencher
        tableBody.innerHTML = '';
        
        // Para cada licença, cria uma linha na tabela
        licenses.forEach(license => {
            const row = document.createElement('tr');
            
            // Converte data de YYYY-MM-DD para DD/MM/YYYY
            function formatDate(dateStr) {
                if (!dateStr) return '';
                const parts = dateStr.split('-');
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            
            // Texto do status (Ativa, Expirando ou Expirada)
            let statusText = 'Ativa';
            if (license.status === 'expirando') statusText = 'Expirando';
            if (license.status === 'expirada') statusText = 'Expirada';
            
            // Cria o HTML da linha da tabela
            row.innerHTML = `
                <td>${license.name}</td>
                <td>${license.type}</td>
                <td>${license.issuer}</td>
                <td>${license.number}</td>
                <td>${formatDate(license.emission)}</td>
                <td>${formatDate(license.validity)}</td>
                <td>
                    <span class="status-tag status-${license.status}">
                        ${statusText}
                    </span>
                </td>
                <td>
                    <button class="delete-btn" data-number="${license.number}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </td>
            `;
            
            // Adiciona a linha na tabela
            tableBody.appendChild(row);
        });
        
        // Adiciona evento de clique nos botões de deletar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const licenseNumber = this.getAttribute('data-number');
                deleteLicense(licenseNumber);
            });
        });
    }
    
    // ======================
    // 4. FUNÇÕES DO MODAL (POPUP)
    // ======================
    
    // Abre o modal para adicionar nova licença
    function openModal() {
        modal.classList.add('active');
        licenseForm.reset();
    }
    
    // Fecha o modal
    function closeModal() {
        modal.classList.remove('active');
    }
    
    // Adiciona uma nova licença
    function addLicense(event) {
        event.preventDefault(); // Impede o formulário de recarregar a página
        
        // Pega os valores dos campos do formulário
        const newLicense = {
            name: document.getElementById('licenseName').value,
            type: document.getElementById('licenseType').value,
            issuer: document.getElementById('issuer').value,
            number: document.getElementById('licenseNumber').value,
            emission: document.getElementById('emissionDate').value,
            validity: document.getElementById('validityDate').value,
            status: 'ativa' // Nova licença sempre começa como ativa
        };
        
        // Adiciona na lista
        licenses.push(newLicense);
        
        // Atualiza a tela
        updateCards();
        renderTable();
        
        // Fecha o modal e mostra mensagem
        closeModal();
        alert('Licença adicionada com sucesso!');
    }
    
    // Remove uma licença
    function deleteLicense(licenseNumber) {
        if (!confirm('Tem certeza que deseja excluir esta licença?')) {
            return; // Usuário cancelou
        }
        
        // Filtra a lista, removendo a licença com esse número
        licenses = licenses.filter(license => license.number !== licenseNumber);
        
        // Atualiza a tela
        updateCards();
        renderTable();
        
        alert('Licença excluída!');
    }
    
    // ======================
    // 5. CONFIGURA OS BOTÕES
    // ======================
    
    // Botão "Nova Licença" → Abre modal
    newLicenseBtn.addEventListener('click', openModal);
    
    // Botões de fechar modal
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Fechar modal clicando fora (no overlay)
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Formulário de nova licença
    licenseForm.addEventListener('submit', addLicense);
    
    // Botão "Sair" → Volta para login
    logoutBtn.addEventListener('click', function() {
        if (confirm('Deseja sair do sistema?')) {
            // Em app real, aqui limparia a sessão
            window.location.href = 'index.html';
        }
    });
    
    // ======================
    // 6. INICIA O SISTEMA
    // ======================
    
    // Primeira atualização da tela
    updateCards();
    renderTable();
    
});