// ================================
// CHIFA SAZÓN & BRASA — JS
// ================================

let carrito = [];
let total = 0;

function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  total += precio;
  actualizar();
}

function quitar(index) {
  total -= carrito[index].precio;
  if (total < 0) total = 0;
  carrito.splice(index, 1);
  actualizar();
}

function limpiar() {
  carrito = [];
  total = 0;
  actualizar();
}

function actualizar() {
  const lista        = document.getElementById('lista');
  const vacio        = document.getElementById('carritoVacio');
  const carritoTotal = document.getElementById('carritoTotal');
  const floatBtn     = document.getElementById('carritoFloat');
  const badge        = document.getElementById('carritoCount');

  lista.innerHTML = '';

  if (carrito.length === 0) {
    vacio.style.display = 'block';
    carritoTotal.style.display = 'none';
    floatBtn.style.display = 'none';
  } else {
    vacio.style.display = 'none';
    carritoTotal.style.display = 'block';
    floatBtn.style.display = 'flex';
    badge.textContent = carrito.length;

    carrito.forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="item-nombre">${p.nombre}</span>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="item-precio">S/ ${p.precio}</span>
          <button class="btn-quitar" onclick="quitar(${i})" title="Quitar">✕</button>
        </div>
      `;
      lista.appendChild(li);
    });
  }

  document.getElementById('total').textContent = total;
}

function enviar() {
  if (carrito.length === 0) {
    alert('¡Agrega algo al pedido primero! 🍜');
    return;
  }

  let msg = '🍜 *Hola, quiero hacer un pedido de Chifa Sazón & Brasa*%0A%0A';
  msg += '*Mi pedido:*%0A';
  carrito.forEach(p => { msg += `• ${p.nombre} — S/ ${p.precio}%0A`; });
  msg += `%0A*Total: S/ ${total}*%0A%0A¡Gracias! 😊`;

  window.open('https://wa.me/51932951567?text=' + msg, '_blank');
}

function scrollPedido() {
  document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
}

// ================================
// ANIMACIÓN — partículas chifa
// ================================
const canvas = document.getElementById('particulas');
const ctx    = canvas.getContext('2d');
let parts = [], raf;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const EMOJIS  = ['🍜', '🍗', '🥢', '🏮', '🔥', '🍜', '🍗', '⭐', '🌶️', '🥡'];
const COLORES = ['#C0392B', '#D4A017', '#F5C842', '#E53935', '#FF6B35', '#8B0000'];

function crearParte() {
  return {
    x:         Math.random() * canvas.width,
    y:         -50,
    size:      Math.random() * 18 + 12,
    speed:     Math.random() * 1.3 + 0.3,
    rot:       Math.random() * Math.PI * 2,
    rotSpd:    (Math.random() - 0.5) * 0.04,
    emoji:     EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    color:     COLORES[Math.floor(Math.random() * COLORES.length)],
    sway:      Math.random() * 0.9 + 0.2,
    swayOff:   Math.random() * Math.PI * 2,
    opacity:   Math.random() * 0.45 + 0.2,
    isCircle:  Math.random() < 0.12,
  };
}

for (let i = 0; i < 25; i++) {
  const p = crearParte();
  p.y = Math.random() * canvas.height;
  parts.push(p);
}

let tick = 0;

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tick++;

  if (tick % 50 === 0 && parts.length < 32) parts.push(crearParte());

  parts.forEach((p, i) => {
    p.y   += p.speed;
    p.x   += Math.sin(tick * 0.018 + p.swayOff) * p.sway;
    p.rot += p.rotSpd;

    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    if (p.isCircle) {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else {
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 6;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
    }

    ctx.restore();

    if (p.y > canvas.height + 60) parts[i] = crearParte();
  });

  raf = requestAnimationFrame(animar);
}

animar();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(raf);
  else animar();
});

actualizar();
