// ================================
// CHIFA SAZÓN & BRASA — JS
// ================================

let carrito = [], total = 0;

function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  total += precio;
  actualizar();
}

function quitar(i) {
  total -= carrito[i].precio;
  if (total < 0) total = 0;
  carrito.splice(i, 1);
  actualizar();
}

function limpiar() { carrito = []; total = 0; actualizar(); }

function actualizar() {
  const lista  = document.getElementById('lista');
  const vacio  = document.getElementById('pedidoVacio');
  const totEl  = document.getElementById('pedidoTotal');
  const floatB = document.getElementById('carritoFloat');
  const badge  = document.getElementById('carritoCount');

  lista.innerHTML = '';

  if (carrito.length === 0) {
    vacio.style.display = 'block';
    totEl.style.display = 'none';
    floatB.style.display = 'none';
  } else {
    vacio.style.display = 'none';
    totEl.style.display = 'block';
    floatB.style.display = 'flex';
    badge.textContent = carrito.length;

    carrito.forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="item-nombre">${p.nombre}</span>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="item-precio">S/ ${p.precio}</span>
          <button class="btn-quitar" onclick="quitar(${i})">✕</button>
        </div>`;
      lista.appendChild(li);
    });
  }
  document.getElementById('total').textContent = total;
}

function enviar() {
  if (!carrito.length) { alert('¡Agrega algo primero! 🍜'); return; }
  let msg = '🍜 *Pedido — Chifa Sazón & Brasa*%0A%0A';
  carrito.forEach(p => { msg += `• ${p.nombre} — S/ ${p.precio}%0A`; });
  msg += `%0A*Total: S/ ${total}*%0A%0AGracias 😊`;
  window.open('https://wa.me/51932951567?text=' + msg, '_blank');
}

function scrollPedido() {
  document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
}

// ================================
// CANVAS — brasas + emojis chifa
// ================================
const canvas = document.getElementById('fuego');
const ctx = canvas.getContext('2d');
let parts = [], raf;

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const EMOJIS = ['🍜','🍗','🔥','🥢','🌶️','🍜','🍗','🔥','⭐','🥡'];

function crear() {
  return {
    x: Math.random() * canvas.width,
    y: -50,
    size: Math.random() * 16 + 10,
    speed: Math.random() * 1.1 + 0.3,
    rot: Math.random() * Math.PI * 2,
    rspd: (Math.random() - 0.5) * 0.04,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    sway: Math.random() * 0.8 + 0.15,
    soff: Math.random() * Math.PI * 2,
    op: Math.random() * 0.4 + 0.15,
    circle: Math.random() < 0.1,
    color: ['#CC2200','#C9952A','#FF3300','#F0B429','#8B0000'][Math.floor(Math.random()*5)]
  };
}

for (let i = 0; i < 22; i++) { const p = crear(); p.y = Math.random() * canvas.height; parts.push(p); }

let tick = 0;
function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tick++;
  if (tick % 55 === 0 && parts.length < 30) parts.push(crear());

  parts.forEach((p, i) => {
    p.y += p.speed;
    p.x += Math.sin(tick * 0.016 + p.soff) * p.sway;
    p.rot += p.rspd;
    ctx.save();
    ctx.globalAlpha = p.op;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (p.circle) {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
    }
    ctx.restore();
    if (p.y > canvas.height + 60) parts[i] = crear();
  });
  raf = requestAnimationFrame(animar);
}

animar();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(raf); else animar();
});

actualizar();
