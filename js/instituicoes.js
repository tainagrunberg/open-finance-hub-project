/* ==========================================================
   Open Finance Hub — instituicoes.js
   Simulação de conectar / revogar acesso das instituições.
   (Menu mobile e logout ficam no layout.js)
   ========================================================== */

const lista = document.getElementById('lista-instituicoes');
const aviso = document.getElementById('aviso-status');

/* ---------- Atualiza o card para conectado ou desconectado ---------- */
function atualizarCard(card, conectado) {
  const nome  = card.dataset.nome;
  const badge = card.querySelector('.badge');
  const desc  = card.querySelector('.conn__desc');
  const botao = card.querySelector('.conn__btn');

  // Classe do card (estado geral)
  card.classList.toggle('conn--on', conectado);
  card.classList.toggle('conn--off', !conectado);

  // Badge: cor e texto
  badge.classList.toggle('badge--on', conectado);
  badge.classList.toggle('badge--off', !conectado);
  badge.textContent = conectado ? 'Conectado' : 'Desconectado';

  // Texto de apoio
  desc.textContent = conectado ? 'Dados compartilhados' : 'Sem compartilhamento';

  // Botão: estilo (outline x solid) e texto
  botao.classList.toggle('conn__btn--outline', conectado);
  botao.classList.toggle('conn__btn--solid', !conectado);
  botao.textContent = conectado ? 'Revogar acesso' : 'Conectar';

  // Acessibilidade: o leitor de tela sabe de qual instituição é o botão
  botao.setAttribute('aria-label', `${botao.textContent} ${nome}`);

  // Avisa leitores de tela sobre a mudança
  aviso.textContent = conectado
    ? `${nome} conectado. Dados compartilhados.`
    : `Acesso do ${nome} revogado. Sem compartilhamento.`;
}

/* ---------- Modal de confirmação ---------- */
const modal        = document.getElementById('modal-revogar');
const modalTitulo  = document.getElementById('modal-titulo');
const btnVoltar    = document.getElementById('modal-voltar');
const btnConfirmar = document.getElementById('modal-confirmar');

let cardAlvo = null;     // card que está sendo revogado
let botaoOrigem = null;  // botão que abriu o modal (devolve o foco ao fechar)

function abrirModal(card, botao) {
  cardAlvo = card;
  botaoOrigem = botao;

  // Injeta o nome da instituição no título
  modalTitulo.textContent = `Revogar acesso ao ${card.dataset.nome}?`;

  modal.classList.remove('hidden');
  btnVoltar.focus();
}

function fecharModal() {
  modal.classList.add('hidden');
  if (botaoOrigem) botaoOrigem.focus();
  cardAlvo = null;
  botaoOrigem = null;
}

/* ---------- Clique nos botões dos cards ---------- */
lista.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.conn__btn');
  if (!botao) return;

  const card = botao.closest('.conn');

  if (card.classList.contains('conn--on')) {
    abrirModal(card, botao);        // "Revogar acesso" abre o modal
  } else {
      abrirModalConectar(card, botao); // "Conectar" abre o modal de confirmação
  }
});

/* ---------- Ações do modal ---------- */
btnVoltar.addEventListener('click', fecharModal);

// Clique no fundo escuro (fora do container) só fecha
modal.addEventListener('click', (evento) => {
  if (evento.target === modal) fecharModal();
});

// "Revogar": atualiza o card clicado (badge, texto e botão) e fecha
btnConfirmar.addEventListener('click', () => {
  const card = cardAlvo;
  fecharModal();
  atualizarCard(card, false);
});

// Teclado: Esc fecha e Tab fica preso nos 2 botões do modal
document.addEventListener('keydown', (evento) => {
  if (modal.classList.contains('hidden')) return;

  if (evento.key === 'Escape') fecharModal();

  if (evento.key === 'Tab') {
    if (evento.shiftKey && document.activeElement === btnVoltar) {
      evento.preventDefault();
      btnConfirmar.focus();
    } else if (!evento.shiftKey && document.activeElement === btnConfirmar) {
      evento.preventDefault();
      btnVoltar.focus();
    }
  }
});



/* ---------- Ações do modal ---------- */
btnVoltar.addEventListener('click', fecharModal);

// Clique fora do container (no fundo escuro) também fecha
modal.addEventListener('click', (evento) => {
  if (evento.target === modal) fecharModal();
});

// Revogar: atualiza o card e fecha
btnConfirmar.addEventListener('click', () => {
  atualizarCard(cardAlvo, false);
  fecharModal();
});

// Teclado: Esc fecha e Tab fica preso nos 2 botões do modal
document.addEventListener('keydown', (evento) => {
  if (modal.classList.contains('hidden')) return;

  if (evento.key === 'Escape') {
    fecharModal();
  }

  if (evento.key === 'Tab') {
    const primeiro = btnVoltar;
    const ultimo = btnConfirmar;

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }
});

/* ---------- Modal "Confirmar dados" (conectar) ---------- */
const modalConectar     = document.getElementById('modal-conectar');
const conectarNome      = document.getElementById('modal-conectar-instituicao');
const btnConectarVoltar = document.getElementById('modal-conectar-voltar');
const btnConectarOk     = document.getElementById('modal-conectar-confirmar');

let cardConectar = null;     // card que está sendo conectado
let botaoConectar = null;    // botão que abriu o modal (devolve o foco ao fechar)

function abrirModalConectar(card, botao) {
  cardConectar = card;
  botaoConectar = botao;

  // Injeta o nome da instituição na primeira linha da lista
  conectarNome.textContent = card.dataset.nome;

  modalConectar.classList.remove('hidden');
  btnConectarVoltar.focus();
}

function fecharModalConectar() {
  modalConectar.classList.add('hidden');
  if (botaoConectar) botaoConectar.focus();
  cardConectar = null;
  botaoConectar = null;
}

// "Voltar" só fecha
btnConectarVoltar.addEventListener('click', fecharModalConectar);

// Clique no fundo escuro só fecha
modalConectar.addEventListener('click', (evento) => {
  if (evento.target === modalConectar) fecharModalConectar();
});

// "Confirmar": fecha e atualiza o card para Conectado
btnConectarOk.addEventListener('click', () => {
  const card = cardConectar;
  fecharModalConectar();
  atualizarCard(card, true);
});

// Teclado: Esc fecha e Tab fica preso nos 2 botões do modal
document.addEventListener('keydown', (evento) => {
  if (modalConectar.classList.contains('hidden')) return;

  if (evento.key === 'Escape') fecharModalConectar();

  if (evento.key === 'Tab') {
    if (evento.shiftKey && document.activeElement === btnConectarVoltar) {
      evento.preventDefault();
      btnConectarOk.focus();
    } else if (!evento.shiftKey && document.activeElement === btnConectarOk) {
      evento.preventDefault();
      btnConectarVoltar.focus();
    }
  }
});

// Define o aria-label inicial dos botões (ex.: "Revogar acesso Nubank")
document.querySelectorAll('.conn').forEach((card) => {
  const botao = card.querySelector('.conn__btn');
  botao.setAttribute('aria-label', `${botao.textContent} ${card.dataset.nome}`);
});
