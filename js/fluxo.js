/* ==========================================================
   Open Finance Hub — fluxo.js
   Calcula a projeção de saldo e desenha o gráfico em SVG.
   O menu e o logout ficam em layout.js.
   ========================================================== */

// Dados de exemplo (troque pelos seus)
const SALDO_INICIAL = 3030;            // saldo em Set/2026
const INICIO = { ano: 2026, mes: 8 };  // mês 8 = Setembro (0 = Janeiro)
const QTD_MESES = 7;                   // Set → Mar

const recorrentes = [
  { nome: 'Salário · todo dia 10', valor: 5200 },
  { nome: 'Aluguel · todo dia 5',  valor: -1800 },
  { nome: 'Assinaturas · mensal',  valor: -180 },
];

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// -1800 -> "−R$ 1.800,00"
function moeda(n) {
  const numero = Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${n < 0 ? '−' : ''}R$ ${numero}`;
}

/* ---------- 1. Projeção: saldo inicial + (soma dos recorrentes × meses) ---------- */
const liquidoMensal = recorrentes.reduce((soma, r) => soma + r.valor, 0);

const pontos = Array.from({ length: QTD_MESES }, (_, i) => {
  const data = new Date(INICIO.ano, INICIO.mes + i, 1);
  return { rotulo: MESES[data.getMonth()], ano: data.getFullYear(), saldo: SALDO_INICIAL + liquidoMensal * i };
});
const ultimo = pontos[pontos.length - 1];

/* ---------- 2. Textos do card principal ---------- */
document.getElementById('flx-mes').textContent = `${ultimo.rotulo}/${ultimo.ano}`;
document.getElementById('flx-saldo').textContent = moeda(ultimo.saldo);

/* ---------- 3. Lista de recorrentes ---------- */
document.getElementById('flx-rec-lista').replaceChildren(...recorrentes.map((r) => {
  const li = document.createElement('li');
  const nome = document.createElement('span');
  const valor = document.createElement('strong');
  nome.textContent = r.nome;
  valor.textContent = (r.valor > 0 ? '+' : '') + moeda(r.valor);
  if (r.valor > 0) valor.className = 'is-pos';
  li.append(nome, valor);
  return li;
}));

/* ---------- 4. Gráfico SVG (viewBox 520×200, escala de 0 ao maior saldo) ---------- */
const W = 520, H = 200;
const margem = { esq: 16, dir: 24, topo: 16, base: 28 };
const maximo = Math.max(...pontos.map((p) => p.saldo), 1);

const x = (i) => margem.esq + ((W - margem.esq - margem.dir) * i) / (pontos.length - 1);
const y = (v) => margem.topo + (H - margem.topo - margem.base) * (1 - Math.max(v, 0) / maximo);
const yBase = H - margem.base;

const coords = pontos.map((p, i) => `${x(i).toFixed(1)},${y(p.saldo).toFixed(1)}`);
const area = `M${x(0)},${yBase} L${coords.join(' L')} L${x(pontos.length - 1)},${yBase} Z`;

document.getElementById('flx-chart').innerHTML =
  `<path class="flx-chart__area" d="${area}"/>` +
  `<polyline class="flx-chart__linha" points="${coords.join(' ')}"/>` +
  pontos.map((p, i) =>
    `<circle class="flx-chart__ponto" cx="${x(i)}" cy="${y(p.saldo).toFixed(1)}" r="4"/>` +
    `<text class="flx-chart__eixo" x="${x(i)}" y="${H - 8}" text-anchor="middle">${p.rotulo}</text>`
  ).join('');

/* ---------- 5. Tabela equivalente para leitores de tela ---------- */
document.getElementById('flx-tabela').innerHTML =
  '<caption>Saldo projetado por mês</caption>' +
  '<tr><th scope="col">Mês</th><th scope="col">Saldo</th></tr>' +
  pontos.map((p) => `<tr><td>${p.rotulo}/${p.ano}</td><td>${moeda(p.saldo)}</td></tr>`).join('');
