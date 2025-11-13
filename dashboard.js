document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const newLicenseBtn = document.getElementById('newLicenseBtn');
    const addLicenseModal = document.getElementById('addLicenseModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelAddLicenseBtn = document.getElementById('cancelAddLicenseBtn');
    const addLicenseForm = document.getElementById('addLicenseForm');
    const licensesTableBody = document.getElementById('licensesTableBody');

    // Elementos do contador
    const totalLicensesSpan = document.getElementById('totalLicenses');
    const activeLicensesSpan = document.getElementById('activeLicenses');
    const expiringLicensesSpan = document.getElementById('expiringLicenses');
    const expiredLicensesSpan = document.getElementById('expiredLicenses');

    // Simulação de um "banco de dados" de licenças
    let licenses = [
        {
            id: 1,
            name: "Licença Ambiental de Operação",
            type: "Ambiental",
            issuer: "IBAMA",
            number: "LAO-2023-001",
            emissionDate: "2023-01-14",
            validityDate: "2025-12-30"
        },
        {
            id: 2,
            name: "Alvará de Funcionamento",
            type: "Operação",
            issuer: "Prefeitura Municipal",
            number: "ALV-2023-045",
            emissionDate: "2023-03-19",
            validityDate: "2024-12-19" // Expira em breve (expirando)
        },
        {
            id: 3,
            name: "Certificado de Regularidade FGTS",
            type: "Trabalhista",
            issuer: "Caixa Econômica Federal",
            number: "CRF-2023-789",
            emissionDate: "2023-02-09",
            validityDate: "2024-02-09" // Expirada
        }
    ];

    // --- Funções Auxiliares ---

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    function getLicenseStatus(validityDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Para comparar apenas a data
        const validity = new Date(validityDate);
        validity.setHours(0, 0, 0, 0);

        const diffTime = validity.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: 'Expirada', class: 'status-expirada' };
        } else if (diffDays <= 90) { // Considerar "expirando" se faltar até 90 dias
            return { text: 'Expirando', class: 'status-expirando' };
        } else {
            return { text: 'Ativa', class: 'status-ativa' };
        }
    }

    function updateSummaryCards() {
        let total = licenses.length;
        let active = 0;
        let expiring = 0;
        let expired = 0;

        licenses.forEach(license => {
            const status = getLicenseStatus(license.validityDate).text;
            if (status === 'Ativa') {
                active++;
            } else if (status === 'Expirando') {
                expiring++;
            } else { // Expirada
                expired++;
            }
        });

        totalLicensesSpan.textContent = total;
        activeLicensesSpan.textContent = active;
        expiringLicensesSpan.textContent = expiring;
        expiredLicensesSpan.textContent = expired;
    }

    function renderLicensesTable() {
        licensesTableBody.innerHTML = ''; // Limpa a tabela antes de renderizar
        licenses.forEach(license => {
            const status = getLicenseStatus(license.validityDate);
            const row = licensesTableBody.insertRow();
            row.setAttribute('data-id', license.id); // Adiciona ID para facilitar a exclusão

            row.innerHTML = `
                <td>${license.name}</td>
                <td>${license.type}</td>
                <td>${license.issuer}</td>
                <td>${license.number}</td>
                <td>${formatDate(license.emissionDate)}</td>
                <td>${formatDate(license.validityDate)}</td>
                <td><span class="status-tag ${status.class}">${status.text}</span></td>
                <td>
                    <button class="delete-btn" data-id="${license.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5L13 1H9.5L7 4H5v2h14V4z"/></svg>
                    </button>
                </td>
            `;
        });
        attachDeleteEventListeners(); // Anexa eventos de clique após renderizar
    }

    function attachDeleteEventListeners() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (event) => {
                const licenseId = parseInt(event.currentTarget.getAttribute('data-id'));
                deleteLicense(licenseId);
            };
        });
    }

    function deleteLicense(id) {
        if (confirm('Tem certeza que deseja excluir esta licença?')) {
            licenses = licenses.filter(license => license.id !== id);
            renderLicensesTable();
            updateSummaryCards();
        }
    }

    // --- Event Listeners ---

    // Botão Sair - Redireciona para a página de login
    logoutBtn.addEventListener('click', () => {
        // Redireciona para a página de login (o index.html que criamos antes)
        window.location.href = 'index.html';
    });

    // Abrir Modal de Nova Licença
    newLicenseBtn.addEventListener('click', () => {
        addLicenseModal.classList.add('active');
    });

    // Fechar Modal com o "X"
    closeModalBtn.addEventListener('click', () => {
        addLicenseModal.classList.remove('active');
        addLicenseForm.reset(); // Limpa o formulário
    });

    // Fechar Modal com o botão "Cancelar"
    cancelAddLicenseBtn.addEventListener('click', () => {
        addLicenseModal.classList.remove('active');
        addLicenseForm.reset(); // Limpa o formulário
    });

    // Fechar Modal clicando fora dele
    addLicenseModal.addEventListener('click', (event) => {
        if (event.target === addLicenseModal) {
            addLicenseModal.classList.remove('active');
            addLicenseForm.reset(); // Limpa o formulário
        }
    });

    // Enviar formulário de Nova Licença
    addLicenseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newLicense = {
            id: licenses.length > 0 ? Math.max(...licenses.map(l => l.id)) + 1 : 1, // Gerar um ID simples
            name: document.getElementById('licenseName').value,
            type: document.getElementById('licenseType').value,
            emissionDate: document.getElementById('emissionDate').value,
            validityDate: document.getElementById('validityDate').value,
            issuer: document.getElementById('issuer').value,
            number: document.getElementById('licenseNumber').value
        };

        licenses.push(newLicense);
        renderLicensesTable();
        updateSummaryCards();
        addLicenseModal.classList.remove('active');
        addLicenseForm.reset();
        alert('Licença adicionada com sucesso!');
    });

    // --- Inicialização ---
    updateSummaryCards();
    renderLicensesTable();
});