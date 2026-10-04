/* ==========================================================
   Open Finance Hub — Tela de Login
   Toggle de senha + validação em tempo real
   ========================================================== */

// ---------- Elementos ----------
const form        = document.getElementById('login-form');
const inputSenha  = document.getElementById('senha');
const btnToggle   = document.getElementById('toggle-senha');
const itensRegras = document.querySelectorAll('.rules__item');

/* ---------- 1. Toggle: mostrar/ocultar senha ---------- */
btnToggle.addEventListener('click', () => {
  const estaOculta = inputSenha.type === 'password';

  // Alterna entre password e text
  inputSenha.type = estaOculta ? 'text' : 'password';

  // Atualiza texto e aria-label para leitores de tela
  btnToggle.textContent = estaOculta ? 'Ocultar' : 'Mostrar';
  btnToggle.setAttribute('aria-label', estaOculta ? 'Ocultar senha' : 'Mostrar senha');
});

/* ---------- 2. Regras de validação da senha ---------- */
// Cada regra tem um nome (igual ao data-regra do HTML) e um teste
const regras = {
  tamanho:   (valor) => valor.length >= 8,
  maiuscula: (valor) => /[A-ZÀ-Ý]/.test(valor),
  numero:    (valor) => /\d/.test(valor),
  simbolo:   (valor) => /[^A-Za-z0-9\s]/.test(valor)
};

// Marca um item como atendido ou pendente (cor, ícone e texto para leitor de tela)
function atualizarItem(item, atendida) {
  item.classList.toggle('is-ok', atendida);
  item.querySelector('.rules__icon').textContent = atendida ? '✓' : '×';
  item.querySelector('.rules__status').textContent = atendida ? '(atendido)' : '(pendente)';
}

// Roda todas as regras; retorna true se todas passaram
function validarSenha() {
  const valor = inputSenha.value;
  let tudoOk = true;

  itensRegras.forEach((item) => {
    const atendida = regras[item.dataset.regra](valor);
    atualizarItem(item, atendida);
    if (!atendida) tudoOk = false;
  });

  return tudoOk;
}

// Valida a cada tecla digitada
inputSenha.addEventListener('input', validarSenha);

/* ---------- 3. Envio do formulário ---------- */
form.addEventListener('submit', (evento) => {
  evento.preventDefault(); // sem backend por enquanto

  // Se a senha não cumpre as regras, devolve o foco para o campo
  if (!validarSenha()) {
    inputSenha.focus();
    return;
  }

  // TODO: integrar com a API de autenticação
  // Login simulado: vai para a Visão Consolidada
  window.location.href = 'inicio.html';
});

// Estado inicial: todas as regras começam como pendentes
validarSenha();
