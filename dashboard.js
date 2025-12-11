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
    
    // Campos de data do formulário
    const emissionDateInput = document.getElementById('emissionDate');
    const validityDateInput = document.getElementById('validityDate');
    
    // ======================
    // 2. DADOS DE EXEMPLO
    // ======================
    
    // Lista de licenças (em app real viria de um banco de dados)
    let licenses = [
        {
            name: 'Licença Ambiental',
            type: 'Ambiental',
            issuer: 'IBAMA',
            number: 'LAO-2023-001',
            emission: '2023-01-15',
            validity: '2026-01-15',
            status: 'ativa'  // Pode ser: ativa, expirando ou expirada
        },
        {
            name: 'Alvará de Funcionamento',
            type: 'Operação',
            issuer: 'Prefeitura',
            number: 'AF-2023-045',
            emission: '2023-03-10',
            validity: '2024-12-31',
            status: 'expirada'
        },
        {
            name: 'Licença Sanitária',
            type: 'Sanitária',
            issuer: 'Vigilância',
            number: 'LS-2023-078',
            emission: '2023-06-20',
            validity: '2025-12-20',
            status: 'expirando'
        }
    ];
    
    // ======================
    // 3. FUNÇÕES DE DATA E VALIDAÇÃO
    // ======================
    
    // Formata data de YYYY-MM-DD para DD/MM/YYYY
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    
    // Calcula status baseado na data de validade
    function calculateStatus(validityDate) {
        const today = new Date();
        const validity = new Date(validityDate);
        
        // Zera as horas para comparar só as datas
        today.setHours(0, 0, 0, 0);
        validity.setHours(0, 0, 0, 0);
        
        // Calcula diferença em dias
        const diffTime = validity - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        // Define status baseado nos dias
        if (diffDays < 0) {
            return 'expirada';        // Já passou da validade
        } else if (diffDays <= 30) {
            return 'expirando';       // Vai expirar em até 30 dias
        } else {
            return 'ativa';           // Ainda tem mais de 30 dias
        }
    }
    
    // Verifica se a data de validade é válida
    function validateDates(emission, validity) {
        const errors = [];
        
        // Converte para objetos Date
        const emissionDate = new Date(emission);
        const validityDate = new Date(validity);
        
        // Verifica se as datas são válidas
        if (isNaN(emissionDate.getTime())) {
            errors.push('Data de emissão inválida');
        }
        
        if (isNaN(validityDate.getTime())) {
            errors.push('Data de validade inválida');
        }
        
        // Só continua se ambas as datas forem válidas
        if (errors.length > 0) return errors;
        
        // Verifica se validade é depois da emissão
        if (validityDate <= emissionDate) {
            errors.push('A data de validade deve ser posterior à data de emissão');
        }
        
        // Verifica se emissão não é no futuro
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (emissionDate > today) {
            errors.push('Data de emissão não pode ser no futuro');
        }
        
        return errors;
    }
    
    // ======================
    // 4. FUNÇÕES PARA ATUALIZAR A TELA
    // ======================
    
    // Atualiza os números dos cards (total: 3, ativas: 1, etc)
    function updateCards() {
        // Primeiro atualiza status de todas as licenças
        licenses.forEach(license => {
            license.status = calculateStatus(license.validity);
        });
        
        // Depois conta quantas tem de cada tipo
        totalEl.textContent = licenses.length;
        activeEl.textContent = licenses.filter(l => l.status === 'ativa').length;
        expiringEl.textContent = licenses.filter(l => l.status === 'expirando').length;
        expiredEl.textContent = licenses.filter(l => l.status === 'expirada').length;
    }
    
    // Preenche a tabela com as licenças
    function renderTable() {
        // Limpa a tabela antes de preencher
        tableBody.innerHTML = '';
        
        // Ordena: expiradas primeiro, depois expirando, depois ativas
        const sortedLicenses = [...licenses].sort((a, b) => {
            const order = { 'expirada': 0, 'expirando': 1, 'ativa': 2 };
            return order[a.status] - order[b.status];
        });
        
        // Para cada licença, cria uma linha na tabela
        sortedLicenses.forEach(license => {
            const row = document.createElement('tr');
            
            // Texto do status com mais informações
            let statusText = 'Ativa';
            let statusClass = 'status-ativa';
            
            if (license.status === 'expirando') {
                statusText = 'Expirando';
                statusClass = 'status-expirando';
            } else if (license.status === 'expirada') {
                statusText = 'Expirada';
                statusClass = 'status-expirada';
            }
            
            // Cria o HTML da linha da tabela
            row.innerHTML = `
                <td>${license.name}</td>
                <td>${license.type}</td>
                <td>${license.issuer}</td>
                <td>${license.number}</td>
                <td>${formatDate(license.emission)}</td>
                <td>${formatDate(license.validity)}</td>
                <td>
                    <span class="status-tag ${statusClass}">
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
    // 5. FUNÇÕES DO MODAL (POPUP)
    // ======================
    
    // Abre o modal para adicionar nova licença
    function openModal() {
        modal.classList.add('active');
        licenseForm.reset();
        
        // Configura datas iniciais
        const today = new Date().toISOString().split('T')[0];
        
        // Data de emissão: hoje (e não pode ser futura)
        emissionDateInput.value = today;
        emissionDateInput.max = today;
        
        // Data de validade: mínimo amanhã
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        validityDateInput.min = tomorrow.toISOString().split('T')[0];
        validityDateInput.value = '';
    }
    
    // Fecha o modal
    function closeModal() {
        modal.classList.remove('active');
    }
    
    // Adiciona uma nova licença com validação
    function addLicense(event) {
        event.preventDefault(); // Impede o formulário de recarregar a página
        
        // Pega os valores dos campos do formulário
        const formData = {
            name: document.getElementById('licenseName').value.trim(),
            type: document.getElementById('licenseType').value,
            issuer: document.getElementById('issuer').value.trim(),
            number: document.getElementById('licenseNumber').value.trim(),
            emission: emissionDateInput.value,
            validity: validityDateInput.value
        };
        
        // Validação básica dos campos
        if (!formData.name || !formData.type || !formData.issuer || !formData.number) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }
        
        // VALIDAÇÃO DAS DATAS
        const dateErrors = validateDates(formData.emission, formData.validity);
        if (dateErrors.length > 0) {
            alert('Erro nas datas:\n' + dateErrors.join('\n'));
            return;
        }
        
        // Calcula o status automaticamente
        const status = calculateStatus(formData.validity);
        
        // Cria o objeto da nova licença
        const newLicense = {
            ...formData,
            status: status
        };
        
        // Adiciona na lista (no início)
        licenses.unshift(newLicense);
        
        // Atualiza a tela
        updateCards();
        renderTable();
        
        // Fecha o modal e mostra mensagem
        closeModal();
        alert('Licença adicionada com sucesso!\nStatus: ' + 
              (status === 'ativa' ? 'Ativa' : 
               status === 'expirando' ? 'Expirando em breve' : 'Expirada'));
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
    // 6. CONFIGURA OS BOTÕES
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
    // 7. INICIA O SISTEMA
    // ======================
    
    // Configura restrições iniciais nas datas
    const today = new Date().toISOString().split('T')[0];
    emissionDateInput.max = today; // Emissão não pode ser futura
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    validityDateInput.min = tomorrow.toISOString().split('T')[0]; // Validade mínima: amanhã
    
    // Primeira atualização da tela
    updateCards();
    renderTable();
    
});