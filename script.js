/* ==========================================================================
   Escola Estadual Culto à Ciência — Campinas/SP
   Script Principal do MVP (script.js)
   Trabalho de Conclusão de Curso (TCC)
   
   Sumário de Funcionalidades:
   1. CONTROLE DO MENU MOBILE (HAMBÚRGUER)
   2. ACESSIBILIDADE (FONTE E ALTO CONTRASTE)
   3. FILTROS DA ÁREA DE PROFESSORES
   4. FILTROS DO ACERVO CULTURAL
   5. LIGHTBOX DA GALERIA E ACERVO
   6. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
   7. CHATBOT FLUTUANTE (COM MASCOTE CULTINHO)
   8. BOTÃO VOLTAR AO TOPO & ROLAGEM SUAVE
   ========================================================================== */

// Executa os scripts quando o documento estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CONTROLE DO MENU MOBILE (HAMBÚRGUER)
       Abre e fecha o menu lateral em telas menores.
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    const menuLinks = document.querySelectorAll('.header__link');

    // Alterna o estado do menu hambúrguer
    function toggleMenu() {
        const estaAberto = mainNav.classList.contains('is-open');

        mainNav.classList.toggle('is-open');
        hamburgerBtn.classList.toggle('is-active');
        hamburgerBtn.setAttribute('aria-expanded', !estaAberto);
        
        // Foca no primeiro link para facilitar navegabilidade via teclado
        if (!estaAberto && menuLinks.length > 0) {
            menuLinks[0].focus();
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }

    // Fecha o menu mobile automaticamente ao clicar em uma opção
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       2. ACESSIBILIDADE
       Controle de tamanho de fonte e alternância de alto contraste.
       ========================================================================== */
    
    // Controles de Tamanho de Fonte
    const btnAumentarFonte = document.getElementById('btn-aumentar-fonte');
    const btnRestaurarFonte = document.getElementById('btn-restaurar-fonte');
    const btnDiminuirFonte = document.getElementById('btn-diminuir-fonte');
    
    let tamanhoFonteAtual = 100;
    const limiteMaximoFonte = 125;
    const limiteMinimoFonte = 90;

    if (btnAumentarFonte) {
        btnAumentarFonte.addEventListener('click', () => {
            if (tamanhoFonteAtual < limiteMaximoFonte) {
                tamanhoFonteAtual += 5;
                document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
            }
        });
    }

    if (btnRestaurarFonte) {
        btnRestaurarFonte.addEventListener('click', () => {
            tamanhoFonteAtual = 100;
            document.documentElement.style.fontSize = '100%';
        });
    }

    if (btnDiminuirFonte) {
        btnDiminuirFonte.addEventListener('click', () => {
            if (tamanhoFonteAtual > limiteMinimoFonte) {
                tamanhoFonteAtual -= 5;
                document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
            }
        });
    }

    // Modo de Alto Contraste
    const btnAltoContraste = document.getElementById('btn-alto-contraste');

    if (btnAltoContraste) {
        btnAltoContraste.addEventListener('click', () => {
            document.body.classList.toggle('alto-contraste');
            const contrasteAtivo = document.body.classList.contains('alto-contraste');
            localStorage.setItem('altoContrasteAtivo', contrasteAtivo);
        });

        // Recupera o estado salvo previamente no navegador
        if (localStorage.getItem('altoContrasteAtivo') === 'true') {
            document.body.classList.add('alto-contraste');
        }
    }


    /* ==========================================================================
       3. FILTROS DA ÁREA DE PROFESSORES
       Filtra os cards de professores por área de conhecimento.
       ========================================================================== */
    const botoesFiltroProfessores = document.querySelectorAll('.professores__filter-btn');
    const cardsProfessores = document.querySelectorAll('.professores__card');

    botoesFiltroProfessores.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltroProfessores.forEach(btn => btn.classList.remove('professores__filter-btn--active'));
            botao.classList.add('professores__filter-btn--active');

            const areaSelecionada = botao.getAttribute('data-filter');

            cardsProfessores.forEach(card => {
                const areaCard = card.getAttribute('data-area');
                if (areaSelecionada === 'todos' || areaSelecionada === areaCard) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });


    /* ==========================================================================
       4. FILTROS DO ACERVO CULTURAL
       Filtra os itens do acervo histórico por categoria.
       ========================================================================== */
    const botoesFiltroAcervo = document.querySelectorAll('.acervo__filter-btn');
    const itensAcervo = document.querySelectorAll('.acervo__item');

    botoesFiltroAcervo.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltroAcervo.forEach(btn => btn.classList.remove('acervo__filter-btn--active'));
            botao.classList.add('acervo__filter-btn--active');

            const categoriaSelecionada = botao.getAttribute('data-filter');

            itensAcervo.forEach(item => {
                const categoriaItem = item.getAttribute('data-category');
                if (categoriaSelecionada === 'todos' || categoriaSelecionada === categoriaItem) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });
        });
    });


    /* ==========================================================================
       5. LIGHTBOX DA GALERIA
       Abre imagens da galeria em modal com navegação e suporte a teclado.
       ========================================================================== */
    const galeriaItens = document.querySelectorAll('.galeria__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCaption = document.getElementById('lightbox-caption');

    let indiceAtual = 0;

    const legendasGaleria = [
        'Fachada Principal da Escola',
        'Laboratório Multidisciplinar',
        'Pátio Interno e Área Verde',
        'Quadra Poliesportiva Coberta',
        'Biblioteca e Espaço de Estudos',
        'Sala de Aula e Ambientes de Aprendizagem'
    ];

    function abrirLightbox(index) {
        indiceAtual = index;
        atualizarLightbox();
        lightbox.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }

    function fecharLightbox() {
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    function atualizarLightbox() {
        if (lightboxCaption && legendasGaleria[indiceAtual]) {
            lightboxCaption.textContent = `[ Foto ${indiceAtual + 1}: ${legendasGaleria[indiceAtual]} ]`;
        }
    }

    function imagemAnterior() {
        indiceAtual = (indiceAtual - 1 + legendasGaleria.length) % legendasGaleria.length;
        atualizarLightbox();
    }

    function proximaImagem() {
        indiceAtual = (indiceAtual + 1) % legendasGaleria.length;
        atualizarLightbox();
    }

    galeriaItens.forEach((item, index) => {
        item.addEventListener('click', () => abrirLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', fecharLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', fecharLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', imagemAnterior);
    if (lightboxNext) lightboxNext.addEventListener('click', proximaImagem);

    // Navegação no Lightbox via Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.hasAttribute('hidden')) {
            if (e.key === 'Escape') fecharLightbox();
            if (e.key === 'ArrowLeft') imagemAnterior();
            if (e.key === 'ArrowRight') proximaImagem();
        }
    });


    /* ==========================================================================
       6. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
       Garante o preenchimento de campos obrigatórios antes do envio.
       ========================================================================== */
    const formContato = document.getElementById('form-contato');

    if (formContato) {
        formContato.addEventListener('submit', (e) => {
            e.preventDefault();

            let formularioValido = true;

            const campoNome = document.getElementById('contato-nome');
            const campoTelefone = document.getElementById('contato-telefone');
            const campoEmail = document.getElementById('contato-email');
            const campoMensagem = document.getElementById('contato-mensagem');

            const erroNome = document.getElementById('erro-nome');
            const erroTelefone = document.getElementById('erro-telefone');
            const erroEmail = document.getElementById('erro-email');
            const erroMensagem = document.getElementById('erro-mensagem');
            const feedbackGeral = document.getElementById('form-feedback');

            // Limpa mensagens anteriores
            erroNome.textContent = '';
            erroTelefone.textContent = '';
            erroEmail.textContent = '';
            erroMensagem.textContent = '';
            feedbackGeral.className = 'form-feedback';
            feedbackGeral.textContent = '';

            // Validação do Nome
            if (campoNome.value.trim().length < 3) {
                erroNome.textContent = 'Por favor, digite seu nome completo (mínimo de 3 caracteres).';
                formularioValido = false;
            }

            // Validação do Telefone
            if (campoTelefone.value.trim().length < 8) {
                erroTelefone.textContent = 'Por favor, digite um número de telefone válido.';
                formularioValido = false;
            }

            // Validação do E-mail
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(campoEmail.value.trim())) {
                erroEmail.textContent = 'Por favor, insira um e-mail válido.';
                formularioValido = false;
            }

            // Validação da Mensagem
            if (campoMensagem.value.trim().length < 10) {
                erroMensagem.textContent = 'A mensagem precisa ter pelo menos 10 caracteres.';
                formularioValido = false;
            }

            // Exibição de resposta do formulário
            if (formularioValido) {
                feedbackGeral.classList.add('form-feedback--success');
                feedbackGeral.textContent = 'Mensagem enviada com sucesso! A equipe da escola entrará em contato em breve.';
                formContato.reset();
            } else {
                feedbackGeral.classList.add('form-feedback--error');
                feedbackGeral.textContent = 'Por favor, corrija os campos indicados acima antes de enviar.';
            }
        });
    }


    /* ==========================================================================
       7. CHATBOT FLUTUANTE (COM MASCOTE CULTINHO)
       Interface interativa simples e respostas simuladas do Cultinho.
       ========================================================================== */
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggleBtn && chatbotWindow) {
        chatbotToggleBtn.addEventListener('click', () => {
            const estaOculto = chatbotWindow.hasAttribute('hidden');
            if (estaOculto) {
                chatbotWindow.removeAttribute('hidden');
                chatbotToggleBtn.setAttribute('aria-expanded', 'true');
                chatbotInput.focus();
            } else {
                chatbotWindow.setAttribute('hidden', '');
                chatbotToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotWindow.setAttribute('hidden', '');
            chatbotToggleBtn.setAttribute('aria-expanded', 'false');
        });
    }

    if (chatbotForm) {
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const textoMensagem = chatbotInput.value.trim();

            if (textoMensagem !== '') {
                adicionarMensagemChatbot(textoMensagem, 'user');
                chatbotInput.value = '';

                /*
                   ==================================================================
                   [PONTO DE INTEGRAÇÃO COM DIALOGFLOW]
                   Para integrar esta conversa ao Dialogflow futuramente:
                   
                   fetch('URL_DO_WEBHOOK_DIALOGFLOW', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ message: textoMensagem })
                   })
                   .then(res => res.json())
                   .then(data => adicionarMensagemChatbot(data.fulfillmentText, 'bot'));
                   ==================================================================
                */

                // Resposta simulada do mascote Cultinho
                setTimeout(() => {
                    const resposta = gerarRespostaMascote(textoMensagem);
                    adicionarMensagemChatbot(resposta, 'bot');
                }, 800);
            }
        });
    }

    function adicionarMensagemChatbot(texto, remetente) {
        const divMensagem = document.createElement('div');
        divMensagem.classList.add('chatbot__message', `chatbot__message--${remetente}`);
        
        const p = document.createElement('p');
        p.textContent = texto;
        divMensagem.appendChild(p);

        chatbotMessages.appendChild(divMensagem);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function gerarRespostaMascote(mensagem) {
        const msg = mensagem.toLowerCase();

        if (msg.includes('horario') || msg.includes('horário') || msg.includes('atendimento')) {
            return 'A secretaria atende de segunda a sexta-feira, das 07h00 às 19h00!';
        } else if (msg.includes('matricula') || msg.includes('matrícula') || msg.includes('vaga')) {
            return 'Para informações sobre matrículas e vagas, utilize o formulário de contato abaixo ou visite nossa secretaria!';
        } else if (msg.includes('itinerario') || msg.includes('itinerário') || msg.includes('curso') || msg.includes('integral')) {
            return 'Oferecemos Ensino Integral com itinerários em Desenvolvimento de Sistemas, Humanas, Exatas e Enfermagem!';
        } else if (msg.includes('cultinho') || msg.includes('mascote')) {
            return 'Eu sou o Cultinho, a corujinha mascote da E.E. Culto à Ciência! Represento a sabedoria e a inovação!';
        } else {
            return 'Obrigado por falar comigo! Esta é uma demonstração do assistente. Para contatos oficiais, use o formulário da página!';
        }
    }


    /* ==========================================================================
       8. BOTÃO VOLTAR AO TOPO & ROLAGEM SUAVE
       Exibe botão de retorno após rolagem da tela.
       ========================================================================== */
    const btnVoltarTopo = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnVoltarTopo.classList.add('is-visible');
        } else {
            btnVoltarTopo.classList.remove('is-visible');
        }
    });

    if (btnVoltarTopo) {
        btnVoltarTopo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});