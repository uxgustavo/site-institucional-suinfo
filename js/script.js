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
        colaboradores: 'Equipe e Colaboradores · SUINFO',
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
});
