/* ==========================================================================
   LÓGICA DE INTERACCIÓN Y MOTOR DE PARTÍCULAS - SCRIPT.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS DEL DOM ---
  const mainHeading = document.getElementById('main-heading');
  const cardImage = document.getElementById('card-image');
  const cardText = document.getElementById('card-text');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const cardElement = document.querySelector('.card');
  
  const questionScreen = document.getElementById('question-screen');
  const successScreen = document.getElementById('success-screen');
  const successSubtitle = document.getElementById('success-subtitle');
  const lovePhrasesContainer = document.getElementById('love-phrases');
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  // --- CONFIGURACIÓN DE ESTADOS PARA EL BOTÓN "NO" ---
  const noStates = [
    {
      heading: "¿Estás segura? 🥺",
      imageSrc: "images/photo_2.png",
      caption: "Piensa en todo lo bonito que hemos vivido... ❤️"
    },
    {
      heading: "¿Segurisisisísima? 🥺❤️",
      imageSrc: "images/photo_3.png",
      caption: "¡Prometo hacerte sonreír cada día!"
    },
    {
      heading: "Piénsalo otra vez... ❤️",
      imageSrc: "images/photo_4.png",
      caption: "Mira esta carita, ¿le dirás que no? 🥺"
    },
    {
      heading: "Última oportunidad... 🥺🌹",
      imageSrc: "images/photo_5.png",
      caption: "¡Un 'Sí' cambiará nuestras vidas para siempre!"
    }
  ];

  let noClickCount = 0;
  let isSuccess = false;

  // --- FRASES ROMÁNTICAS PARA LA PANTALLA FINAL ---
  const lovePhrases = [
    "Prometo hacerte sonreír todos los días. ✨",
    "Espero que esta sigamos coleccionando muchas aventuras juntos. 🗺️❤️",
    "Gracias por existir y por ser tan especial. 🥰",
    "¡Eres lo más bonito de mi vida! 💖"
  ];

  // --- MOTOR DE PARTÍCULAS (CANVAS) ---
  let particles = [];
  const colors = ['#ff758c', '#ff7eb3', '#ff2a6d', '#ff5e7e', '#f48fb1', '#ffb74d'];

  // Ajustar tamaño del canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Crear partícula de fondo (corazones flotando suavemente hacia arriba)
  function createBackgroundHeart() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 12 + 6,
      speedY: -(Math.random() * 1.2 + 0.6),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.4 + 0.15,
      color: colors[Math.floor(Math.random() * 4)], // Colores rosados
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      type: 'heart',
      isExplosion: false
    };
  }

  // Inicializar partículas de fondo
  const maxBgHearts = 25;
  for (let i = 0; i < maxBgHearts; i++) {
    particles.push({
      ...createBackgroundHeart(),
      y: Math.random() * canvas.height // Distribuirlas por la pantalla inicialmente
    });
  }

  // Crear partículas de explosión (Confeti de Corazones y Brillos)
  function triggerConfetiExplosion() {
    const count = 140;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      
      particles.push({
        x: centerX,
        y: centerY - 50, // Un poco más arriba del centro visual
        size: Math.random() * 18 + 8,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 2, // Empuje inicial hacia arriba
        gravity: 0.28,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        type: Math.random() > 0.4 ? 'heart' : 'circle',
        isExplosion: true,
        fadeSpeed: Math.random() * 0.01 + 0.008
      });
    }
  }

  // Dibujar un corazón en 2D Canvas
  function drawHeart(ctx, x, y, size, rotation, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    
    ctx.beginPath();
    // Centramos el dibujo del corazón con respecto a x, y
    const d = size;
    ctx.moveTo(0, d / 4);
    ctx.quadraticCurveTo(0, 0, d / 2, 0);
    ctx.quadraticCurveTo(d, 0, d, d / 3);
    ctx.quadraticCurveTo(d, d * 2/3, 0, d * 1.1);
    ctx.quadraticCurveTo(-d, d * 2/3, -d, d / 3);
    ctx.quadraticCurveTo(-d, 0, -d / 2, 0);
    ctx.quadraticCurveTo(0, 0, 0, d / 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Animación del Canvas
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      if (!p.isExplosion) {
        // Lógica de partículas de fondo
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.3;
        p.angle += p.spinSpeed;

        // Resetear al salir de pantalla
        if (p.y < -20) {
          particles[i] = createBackgroundHeart();
        } else {
          drawHeart(ctx, p.x, p.y, p.size, p.angle, p.color, p.opacity);
        }
      } else {
        // Lógica de partículas de explosión (Confeti)
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity; // Aplicar gravedad
        p.speedX *= 0.98;     // Fricción del aire
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
        } else {
          // Círculo de brillo/glitter
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();

  // --- LÓGICA DE INTERACCIÓN ---

  // Efecto de sacudida y vibración (vibración háptica móvil si está disponible)
  function triggerFeedback() {
    if (navigator.vibrate) {
      navigator.vibrate(40); // Pequeña vibración en dispositivos móviles
    }
    
    // Animación de sacudida visual a la tarjeta
    cardElement.classList.add('shake-animation');
    cardElement.style.setProperty('--current-scale', '1');
    setTimeout(() => {
      cardElement.classList.remove('shake-animation');
    }, 400);
  }

  // Actualizar el estado visual de la tarjeta cuando presionan "No"
  function updateNoInteraction() {
    triggerFeedback();

    if (noClickCount <= noStates.length) {
      const stateIndex = noClickCount - 1;
      const state = noStates[stateIndex];

      // Cambiar encabezado con transición
      mainHeading.style.transform = 'scale(0.9)';
      setTimeout(() => {
        mainHeading.textContent = state.heading;
        mainHeading.style.transform = 'scale(1)';
      }, 200);

      // Cambiar imagen con efecto fade
      cardImage.style.opacity = '0';
      cardImage.style.transform = 'scale(0.9) rotate(-1deg)';
      
      setTimeout(() => {
        cardImage.src = state.imageSrc;
        cardImage.style.opacity = '1';
        cardImage.style.transform = 'scale(1) rotate(0)';
      }, 300);

      // Cambiar descripción inferior
      cardText.textContent = state.caption;

      // Calcular nuevos tamaños usando propiedades CSS personalizadas
      // El botón Sí crece, el botón No se reduce
      const scaleYes = 1 + noClickCount * 0.28;
      const scaleNo = Math.max(0.2, 1 - noClickCount * 0.2);

      btnYes.style.setProperty('--yes-scale', scaleYes);
      btnNo.style.setProperty('--no-scale', scaleNo);

      // Si el botón No ya es muy pequeño (estado 4+), activar el modo "esquivar"
      if (noClickCount >= 4) {
        enableEvasiveButton();
      }
    }
  }

  // Activa el comportamiento evasivo para el botón "No"
  function enableEvasiveButton() {
    btnNo.style.position = 'fixed';
    teleportNoButton();
    
    // Agregar oyentes de hover/touch
    btnNo.addEventListener('mouseenter', teleportNoButton);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Evitar comportamientos por defecto y clics accidentales
      teleportNoButton();
    });
  }

  // Mueve el botón "No" a un lugar aleatorio y seguro dentro del viewport
  function teleportNoButton() {
    if (isSuccess) return;

    const btnWidth = btnNo.offsetWidth || 80;
    const btnHeight = btnNo.offsetHeight || 40;

    // Límites seguros (dejando un margen)
    const maxX = window.innerWidth - btnWidth - 40;
    const maxY = window.innerHeight - btnHeight - 40;

    let randomX = Math.random() * maxX + 20;
    let randomY = Math.random() * maxY + 20;

    // Evitar que aparezca directamente encima del botón "Sí"
    const yesRect = btnYes.getBoundingClientRect();
    const yesX = yesRect.left;
    const yesY = yesRect.top;

    if (Math.abs(randomX - yesX) < 120 && Math.abs(randomY - yesY) < 120) {
      randomX = (randomX + 200) % maxX;
      randomY = (randomY + 200) % maxY;
    }

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
  }

  // Efecto Máquina de Escribir (Typewriter)
  function typeWriter(text, element, speed = 40, callback = null) {
    let i = 0;
    element.innerHTML = '';
    element.classList.add('cursor-typing');

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.classList.remove('cursor-typing');
        if (callback) callback();
      }
    }
    type();
  }

  // Mostrar frases románticas secuenciales
  function showLovePhrases() {
    let index = 0;
    
    function displayNext() {
      if (index < lovePhrases.length) {
        const pElement = document.createElement('p');
        pElement.className = 'phrase';
        pElement.textContent = lovePhrases[index];
        lovePhrasesContainer.appendChild(pElement);

        // Disparar reflow para activar animación
        pElement.offsetHeight;
        pElement.classList.add('visible');

        index++;
        setTimeout(displayNext, 1800); // 1.8 segundos entre frase y frase
      }
    }
    
    setTimeout(displayNext, 600); // Pequeño delay inicial
  }

  // --- EVENTOS ---

  // Botón "No" Click
  btnNo.addEventListener('click', () => {
    if (noClickCount < 4) {
      noClickCount++;
      updateNoInteraction();
    } else {
      // Si de alguna forma logran darle clic en el modo evasivo
      teleportNoButton();
    }
  });

  // Botón "Sí" Click (Aceptación)
  btnYes.addEventListener('click', () => {
    if (isSuccess) return;
    isSuccess = true;

    // Vibración de éxito más larga
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Efecto de explosión de corazones en la pantalla
    triggerConfetiExplosion();

    // Transición de pantallas
    questionScreen.classList.remove('active');
    
    setTimeout(() => {
      questionScreen.style.display = 'none';
      successScreen.classList.add('active');
      
      // Lanzar confeti continuo cada cierto tiempo
      const interval = setInterval(() => {
        if (!isSuccess) {
          clearInterval(interval);
          return;
        }
        triggerConfetiExplosion();
      }, 3500);

      // Iniciar máquina de escribir en subtítulo de éxito
      const subtext = "Muchas gracias. No sabes lo feliz que me haces... ❤️";
      typeWriter(subtext, successSubtitle, 45, () => {
        // Al terminar la máquina de escribir, mostrar frases secuenciales
        showLovePhrases();
      });

    }, 500); // Esperar que termine la animación de salida de la pantalla principal
  });
});
