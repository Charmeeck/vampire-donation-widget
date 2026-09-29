const state = { current: 3750, goal: 10000 };

const el = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString("ru-RU");

function render() {
  const pct = Math.max(0, Math.min(100, state.current / state.goal * 100));
  el("fill").style.width = pct + "%";
  el("amount").textContent = fmt(state.current) + " ₽";
  el("goal").textContent = fmt(state.goal) + " ₽";
  el("percent").textContent = Math.round(pct) + "%";
}

function donation(amount, name = "Донатер") {
  amount = Number(amount);
  if (!Number.isFinite(amount) || amount <= 0) return;
  state.current += amount;
  render();

  el("flash").classList.remove("active");
  void el("flash").offsetWidth;
  el("flash").classList.add("active");

  const d = el("donation");
  d.textContent = `🩸 ${name} — +${fmt(amount)} ₽`;
  d.classList.remove("show");
  void d.offsetWidth;
  d.classList.add("show");
}

// Для теста: index.html?demo=500
const params = new URLSearchParams(location.search);
if (params.has("goal")) state.goal = Number(params.get("goal")) || state.goal;
if (params.has("current")) state.current = Number(params.get("current")) || state.current;

render();

if (params.has("demo")) {
  setTimeout(() => donation(Number(params.get("demo")) || 500, "Тестовый донат"), 1000);
}

// Точка подключения реального сервиса донатов:
// window.vampireDonation(amount, name)
window.vampireDonation = donation;
