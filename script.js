// ===================================
// SALCHIPAPERÍA ¡OH QUE RICO! - JS
// ===================================

let carrito = [];
let total = 0;

// --- AGREGAR AL CARRITO ---
function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  total += precio;
  actualizar();

  // Animación en botón
  const btns = document.querySelectorAll('.card-footer button');
  btns.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(nombre.replace(' ', ''))) {
      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 350);
    }
  });
}

// --- QUITAR DEL CARRITO ---
function quitar(index) {
  total -= carrito[index].precio;
  if (total < 0) total = 0;
  carrito.splice(index, 1);
  actualizar();
}

// --- LIMPIAR CARRITO ---
function limpiar() {
  carrito = [];
  total = 0;
  actualizar();
}

// --- ACTUALIZAR UI ---
function actualizar() {
  const lista = document.getElementById('lista');
  const carritoEmpty = document.getElementById('carritoEmpty');
  const carritoTotal = document.getElementById('carritoTotal');
  const carritoFloat = document.getElementById('carritoFloat');
  const carritoCount = document.getElementById('carritoCount');

  lista.innerHTML = '';

  if (carrito.length === 0) {
    carritoEmpty.style.display = 'block';
    carritoTotal.style.display = 'none';
    carritoFloat.style.display = 'none';
  } else {
    carritoEmpty.style.display = 'none';
    carritoTotal.style.display = 'block';
    carritoFloat.style.display = 'flex';
    carritoCount.textContent = carrito.length;

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

  document.getElementById('subtotal').textContent = total;
  document.getElementById('total').textContent = total;
}

// --- ENVIAR POR WHATSAPP ---
function enviar() {
  if (carrito.length === 0) {
    alert('¡Agrega algo al pedido primero! 🍟');
    return;
  }

  let mensaje = '🍟 *Hola, quiero hacer un pedido de Salchipapería ¡Oh Que Rico!*%0A%0A';
  mensaje += '*Mi pedido:*%0A';

  carrito.forEach(p => {
    mensaje += `• ${p.nombre} — S/ ${p.precio}%0A`;
  });

  mensaje += `%0A*Total: S/ ${total}*%0A%0A¡Gracias! 😊`;

  window.open('https://wa.me/51968531996?text=' + mensaje, '_blank');
}

// --- SCROLL AL CARRITO ---
function scrollCarrito() {
  document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
}

// ===================================
// ANIMACIÓN PAPAS CAYENDO (CANVAS)
// ===================================

const canvas = document.getElementById('friesCanvas');
const ctx = canvas.getContext('2d');

let fries = [];
let animFrame;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

const FRIE_EMOJIS = ['🍟', '🍟', '🌭', '🍟', '🍟', '🧂'];

function createFry() {
  return {
    x: Math.random() * canvas.width,
    y: -60,
    size: Math.random() * 18 + 14,        // 14–32px
    speed: Math.random() * 1.2 + 0.4,    // 0.4–1.6px per frame
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    emoji: FRIE_EMOJIS[Math.floor(Math.random() * FRIE_EMOJIS.length)],
    sway: Math.random() * 0.8 + 0.2,
    swayOffset: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.5 + 0.3,
  };
}

// Init with spread fries
for (let i = 0; i < 22; i++) {
  const f = createFry();
  f.y = Math.random() * canvas.height; // start spread across screen
  fries.push(f);
}

let tick = 0;

function animateFries() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tick++;

  // Spawn new fry occasionally
  if (tick % 55 === 0 && fries.length < 30) {
    fries.push(createFry());
  }

  fries.forEach((f, i) => {
    f.y += f.speed;
    f.x += Math.sin(tick * 0.02 + f.swayOffset) * f.sway;
    f.rotation += f.rotSpeed;

    ctx.save();
    ctx.globalAlpha = f.opacity;
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    ctx.font = `${f.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(f.emoji, 0, 0);
    ctx.restore();

    // Reset if off screen
    if (f.y > canvas.height + 60) {
      fries[i] = createFry();
    }
  });

  animFrame = requestAnimationFrame(animateFries);
}

animateFries();

// Pause animation when tab not visible (perf)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animFrame);
  } else {
    animateFries();
  }
});

// ===================================
// INIT
// ===================================
actualizar();
