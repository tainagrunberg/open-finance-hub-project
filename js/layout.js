/* ==========================================================
   Open Finance Hub — layout.js
   Comportamentos comuns a todas as telas logadas:
   menu mobile (hambúrguer), logout e links de páginas ainda não criadas.
   ========================================================== */

const btnSair = document.getElementById('btn-sair');
const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

/* ---------- 1. Logout simulado ---------- */
btnSair.addEventListener('click', () => {
  if (confirm('Deseja realmente sair da sua conta?')) {
    console.log('Sessão encerrada. Redirecionando para o login...');
    window.location.href = 'index.html';
  }
});

/* ---------- 2. Links de páginas que ainda não existem (href="#...") ---------- */
// Páginas prontas navegam normalmente. Quando "Extrato" e "Fluxo" forem criadas,
// é só trocar o href delas para o arquivo .html correspondente.
document.querySelectorAll('.menu__link[href^="#"]').forEach((link) => {
  link.addEventListener('click', (evento) => {
    evento.preventDefault();
    console.log(`Página "${link.textContent}" ainda não foi criada.`);
  });
});

/* ---------- 3. Menu mobile (hambúrguer) ---------- */
function abrirMenu() {
  sidebar.classList.add('is-open');
  overlay.hidden = false;
  btnMenu.setAttribute('aria-expanded', 'true');
  btnMenu.setAttribute('aria-label', 'Fechar menu');
}

function fecharMenu() {
  sidebar.classList.remove('is-open');
  overlay.hidden = true;
  btnMenu.setAttribute('aria-expanded', 'false');
  btnMenu.setAttribute('aria-label', 'Abrir menu');
}

btnMenu.addEventListener('click', () => {
  sidebar.classList.contains('is-open') ? fecharMenu() : abrirMenu();
});

// Clique no fundo escuro fecha o menu
overlay.addEventListener('click', fecharMenu);

// Tecla Esc fecha o menu e devolve o foco ao botão
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && sidebar.classList.contains('is-open')) {
    fecharMenu();
    btnMenu.focus();
  }
});
