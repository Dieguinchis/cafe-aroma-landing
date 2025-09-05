// Seleccionamos elementos
const openMenu = document.querySelector('#open-menu');
const closeMenu = document.querySelector('#close-menu');
const menu = document.querySelector('#container-links');

// Abrir menú
openMenu.addEventListener('click', () => {
  menu.classList.add('visible');
});

// Cerrar menú
closeMenu.addEventListener('click', () => {
  menu.classList.remove('visible');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav_lists a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('visible');
  });
});


//Inicializar Swiper
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
	clickable: true,
	dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  
  //Responsive Breakpoints
  breakpoints: {
	0: {
		slidesPerView: 1
	},
	768: {
		slidesPerView: 2
	},
	1024: {
		slidesPerView: 3
	}
  }
});






// Animación de entrada para la sección de inicio y la navbar
// Y cambio de color de navbar al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
	// Animación para la sección de inicio
	const inicio = document.getElementById('inicio');
	if (inicio) {
		inicio.classList.add('fade-in-up');
	}
	// Animación para la navbar
	const navbar = document.querySelector('.navbar');
	if (navbar) {
		navbar.classList.add('fade-in-down');
		// --- CAMBIO DE COLOR AL SCROLL ---
		// Esta función agrega la clase .navbar-scrolled si el usuario baja 50px o más
		function checkNavbarScroll() {
			if (window.scrollY > 50) {
				navbar.classList.add('navbar-scrolled');
			} else {
				navbar.classList.remove('navbar-scrolled');
			}
		}
		// Ejecuta al cargar y al hacer scroll
		window.addEventListener('scroll', checkNavbarScroll);
		checkNavbarScroll();
	}
});

// Script para reservas con validaciones y WhatsApp
document.addEventListener('DOMContentLoaded', function() {
	// 1. Selecciona el formulario de reservas
	const form = document.querySelector('.form-reservas');
	if (!form) return; // Si no existe, no hace nada

	// 2. Selecciona los campos de fecha y hora
	const fechaInput = form.querySelector('input[name="fecha"]');
	const horaInput = form.querySelector('input[name="hora"]');

	// 3. Bloquea fechas pasadas en el input de fecha
	// Obtiene la fecha de hoy en formato YYYY-MM-DD
	const hoy = new Date();
	const yyyy = hoy.getFullYear();
	const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes con 0 inicial
	const dd = String(hoy.getDate()).padStart(2, '0'); // Día con 0 inicial
	const hoyStr = `${yyyy}-${mm}-${dd}`;
	fechaInput.min = hoyStr; // Establece el mínimo en el input


	// 4. Reemplaza el input de hora por un select dinámico según el día
	const horaDiv = horaInput.parentElement;
	horaInput.remove();
	const selectHora = document.createElement('select');
	selectHora.name = 'hora';
	selectHora.id = 'hora';
	selectHora.required = true;
	horaDiv.appendChild(selectHora);

	// Referencia al botón de reservar
	const btnReservar = form.querySelector('button[type="submit"]');
	// Mensaje visual para domingos
	let msgDomingo = document.createElement('div');
	msgDomingo.style.color = 'crimson';
	msgDomingo.style.fontWeight = 'bold';
	msgDomingo.style.marginTop = '0.5rem';
	msgDomingo.textContent = 'Cerrado los domingos';
	msgDomingo.style.display = 'none';
	form.appendChild(msgDomingo);

	// Función para generar las opciones de hora según el día de la semana
	function actualizarOpcionesHora() {
		selectHora.innerHTML = '';
		// Si no hay fecha seleccionada, deshabilita el select y el botón
		if (!fechaInput.value) {
			selectHora.disabled = true;
			btnReservar.disabled = true;
			msgDomingo.style.display = 'none';
			const opt = document.createElement('option');
			opt.textContent = 'Horario';
			opt.value = '';
			selectHora.appendChild(opt);
			return;
		}
		// Obtiene el día de la semana (0=domingo, 6=sábado)
		const fecha = new Date(fechaInput.value + 'T00:00:00');
		const dia = fecha.getDay();
		let desde, hasta;
		if (dia === 0) { // Domingo
			selectHora.disabled = true;
			btnReservar.disabled = true;
			msgDomingo.style.display = 'block';
			const opt = document.createElement('option');
			opt.textContent = 'CERRADO';
			opt.value = '';
			selectHora.appendChild(opt);
			return;
		} else if (dia === 6) { // Sábado
			desde = 9;
			hasta = 19; // Última reserva 19:00
		} else { // Lunes a viernes
			desde = 8;
			hasta = 20.5; // Última reserva 20:30
		}
		selectHora.disabled = false;
		btnReservar.disabled = false;
		msgDomingo.style.display = 'none';
		// Opción por defecto vacía
		const optDefault = document.createElement('option');
		optDefault.textContent = 'Horario';
		optDefault.value = '';
		optDefault.disabled = true;
		optDefault.selected = true;
		selectHora.appendChild(optDefault);
		// Genera las opciones cada 30 minutos
		for (let h = desde; h <= Math.floor(hasta); h++) {
			for (let m = 0; m < 60; m += 30) {
				let horaDecimal = h + m / 60;
				if (horaDecimal > hasta) break;
				const horaStr = `${String(h).padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
				const option = document.createElement('option');
				option.value = horaStr;
				option.textContent = horaStr;
				selectHora.appendChild(option);
			}
		}
	}

	// Actualiza las opciones al cargar y cuando cambia la fecha
	actualizarOpcionesHora();
	fechaInput.addEventListener('change', actualizarOpcionesHora);

	// 5. Escucha el evento de envío del formulario
	form.addEventListener('submit', function(e) {
		e.preventDefault(); // Evita recargar la página

		// 6. Valida que la fecha no sea pasada (extra por seguridad)
		const fechaSeleccionada = new Date(form.fecha.value);
		const hoySinHora = new Date(yyyy, hoy.getMonth(), hoy.getDate());
		if (fechaSeleccionada < hoySinHora) {
			alert('No puedes reservar en fechas pasadas.');
			return;
		}

		// 7. Obtiene los valores del formulario
		const numero = '5491126855071'; // Tu número de WhatsApp
		const nombre = form.nombre.value.trim();
		const apellido = form.apellido.value.trim();
		const email = form.email.value.trim();
		const telefono = form.telefono.value.trim();
		const personas = form.personas.value.trim();
		const fecha = form.fecha.value;
		const hora = form.hora.value;

		// 8. Arma el mensaje para WhatsApp
		let mensaje = `¡Hola! Quiero reservar una mesa en Café Aroma:%0A`;
		mensaje += `Nombre: ${nombre} ${apellido}%0A`;
		mensaje += `Email: ${email}%0A`;
		mensaje += `Teléfono: ${telefono}%0A`;
		mensaje += `Personas: ${personas}%0A`;
		mensaje += `Fecha: ${fecha}%0A`;
		mensaje += `Hora: ${hora}`;

		// 9. Crea la URL de WhatsApp y abre en nueva pestaña
		const url = `https://wa.me/${numero}?text=${mensaje}`;
		window.open(url, '_blank');
	});
});
