document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');

    // Configuração inicial baseada no tamanho da tela
    let isDesktop = window.innerWidth >= 1024;
    let sidebarCollapsed = !isDesktop; // Mobile começa recolhido (true), Desktop expandido (false)
    let isHoverExpanding = false;

    // Função para aplicar o estado visual no DOM
    function applySidebarState() {
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            if (collapseBtn) collapseBtn.classList.add('rotate');
        } else {
            sidebar.classList.remove('collapsed');
            if (collapseBtn) collapseBtn.classList.remove('rotate');
        }
    }

    // Aplicar estado inicial
    applySidebarState();

    // Toggle ao clicar no botão
    if (collapseBtn) {
        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar conflito com eventos parentes
            sidebarCollapsed = !sidebarCollapsed;
            applySidebarState();

            // Sempre remove a classe hover-expanded ao clicar,
            // independentemente de expandir ou recolher, para evitar bugs visuais.
            sidebar.classList.remove('hover-expanded');
            isHoverExpanding = false;
        });
    }

    // Hover-to-expand
    sidebar.addEventListener('mouseenter', () => {
        if (sidebarCollapsed) {
            isHoverExpanding = true;
            sidebar.classList.add('hover-expanded');
        }
    });

    sidebar.addEventListener('mouseleave', () => {
        if (sidebarCollapsed && isHoverExpanding) {
            isHoverExpanding = false;
            sidebar.classList.remove('hover-expanded');
        }
    });

    // Monitorar resize para ajustar o estado padrão do Mobile-First de forma responsiva
    window.addEventListener('resize', () => {
        const currentlyDesktop = window.innerWidth >= 1024;
        if (currentlyDesktop !== isDesktop) {
            isDesktop = currentlyDesktop;
            sidebarCollapsed = !isDesktop;
            applySidebarState();
            sidebar.classList.remove('hover-expanded');
        }
    });

    // ============================================================
    // DYNAMIC NAVIGATION (SPA Like)
    // ============================================================
    const pageTitles = {
        home: 'Página Inicial · SUINFO',
        dashboard: 'Dashboard · Supervisão de Informática',
        sistemas: 'Sistemas Gerenciados · SUINFO',
        dad: 'DAD · Análise e Desenvolvimento',
        dir: 'DIR · Infraestrutura e Redes',
        dos: 'DOS · Operação e Suporte',
        pendencias: 'Pendências e Riscos',
        conclusao: 'Considerações Finais'
    };

    // Exporta globalmente para os onclicks no HTML
    window.showPage = function (pageId, navEl) {
        // Remove classes ativas
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        // Ativa página alvo
        const target = document.getElementById('page-' + pageId);
        if (target) {
            target.classList.add('active');

            // Inicializa gráficos se existirem as funções no escopo global
            if (typeof initChartsForPage === 'function') {
                initChartsForPage(pageId);
            }
            if (typeof animateBars === 'function') {
                animateBars();
            }
        }

        // Ativa link correspondente
        if (navEl) {
            navEl.classList.add('active');
        } else { // Caso seja chamado via JS e não clique, procura o link
            const link = document.querySelector(`[onclick="showPage('${pageId}',this)"]`);
            if (link) link.classList.add('active');
        }

        // Atualiza título da topbar
        const topbarTitle = document.getElementById('topbarTitle');
        if (topbarTitle) {
            topbarTitle.textContent = pageTitles[pageId] || '';
        }

        // Fechar overlay mobile se ativo
        if (window.innerWidth < 1024 && typeof window.closeSidebar === 'function') {
            window.closeSidebar();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============================================================
    // SIDEBAR METÓDOS GLOBAIS (Overlay Mobile)
    // ============================================================
    const overlay = document.getElementById('overlay');
    window.openSidebar = function () {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeSidebar = function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // ============================================================
    // TEAM FILTERING
    // ============================================================
    const teamData = [
        // DAD
        { name: 'João Carlos R. Ribeiro', div: 'DAD', role: 'Responsável DAD / Análise e Desenvolvimento', badge: 'teal' },
        { name: 'Paulo Almeida', div: 'DAD', role: 'Desenvolvimento Fullstack', badge: 'teal' },
        { name: 'Luis Silva', div: 'DAD', role: 'Frontend e UI/UX', badge: 'teal' },
        { name: 'Leonardo Vasconselos', div: 'DAD', role: 'Desenvolvimento Mobile/Web', badge: 'teal' },
        { name: 'Magno Ribeiro', div: 'DAD', role: 'Backend e APIs', badge: 'teal' },
        { name: 'Vinicius Caldas', div: 'DAD', role: 'Suporte a Sistemas e SEI', badge: 'teal' },
        
        // DIR
        { name: 'Felipe Dias Corrêa', div: 'DIR', role: 'Responsável DIR / Infraestrutura e Redes', badge: 'emerald' },
        { name: 'Gabriel Pereira Gomes', div: 'DIR', role: 'Segurança Perimetral e Firewall', badge: 'emerald' },
        { name: 'Reginaldo Marques', div: 'DIR', role: 'Sustentação de Infra Crítica', badge: 'emerald' },
        { name: 'Lucas David Jesus', div: 'DIR', role: 'Redes e Conectividade Wi-Fi', badge: 'emerald' },
        { name: 'Victor Coelho Silva', div: 'DIR', role: 'Observabilidade (Zabbix/Grafana)', badge: 'emerald' },
        
        // DOS
        { name: 'Ronilson Costa', div: 'DOS', role: 'Responsável DOS / Operação e Suporte', badge: 'blue' },
        { name: 'Gabriel Mouta', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Mayron Oliveira', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Luan Barbosa', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Jadiel Costa', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Maikon Keslley', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Gabriel Pereira', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Marcos Barbosa', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Bruno Kauan', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Matheus Gonçalves', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Rosivânia Silva', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Cássio Herbeth', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Eric Oliveira', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Daniel Santos', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'João Martins', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Bruno Gonçalves', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Gilson', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Juan Carlos', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Julio César', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' },
        { name: 'Natan Sousa', div: 'DOS', role: 'Operação e Suporte', badge: 'blue' }
    ];

    window.filterTeam = function (divName) {
        const tbody = document.getElementById('team-table-body');
        if (!tbody) return;

        // Limpar
        tbody.innerHTML = '';

        // Filtrar
        const filtered = divName === 'ALL' ? teamData : teamData.filter(m => m.div === divName);

        // Renderizar
        filtered.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${m.name}</strong></td>
                <td><span class="badge ${m.badge}">${m.div}</span></td>
                <td>${m.role}</td>
            `;
            tbody.appendChild(tr);
        });

        // Atualizar visual do botão Limpar
        const btnClear = document.getElementById('clearTeamFilter');
        if (btnClear) {
            btnClear.style.display = divName === 'ALL' ? 'none' : 'inline-block';
        }
        
        // Efeito de destaque nas colunas lideranças
        document.querySelectorAll('.kpi-card[data-div]').forEach(c => {
            c.classList.remove('active-filter');
            if (divName !== 'ALL' && c.getAttribute('data-div') === divName) {
                c.classList.add('active-filter');
            }
        });
    };

    // Render original após carregamento
    setTimeout(() => { if (typeof filterTeam === 'function') filterTeam('ALL'); }, 100);
});
