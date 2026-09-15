const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const bookingForm = document.getElementById('booking-form');
const dateInput = document.getElementById('booking-date');
const dateStatus = document.getElementById('date-status');
const timeStatus = document.getElementById('time-status');
const timeOptions = document.getElementById('time-options');
const selectedTimeInput = document.getElementById('selected-time');
const selectedDateLabel = document.getElementById('selected-date-label');
const bookingSummary = document.getElementById('booking-summary');
const continueDate = document.getElementById('continue-date');
const continueTime = document.getElementById('continue-time');
const steps = [...document.querySelectorAll('.booking-step')];
const stepIndicators = [...document.querySelectorAll('.booking-steps span')];

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
if (dateInput) dateInput.min = localDate;

// Demo availability: replace this function with a call to the real booking API later.
function getAvailableHours(dateString) {
  if (!dateString) return [];
  const day = new Date(`${dateString}T12:00:00`).getDay();
  if (day === 0 || day === 1) return []; // Sunday and Monday closed
  if (day === 6) return ['09:00', '10:30', '12:00', '16:00'];
  return ['09:00', '10:30', '12:00', '16:00', '17:30', '19:00'];
}

function showStep(number) {
  steps.forEach((step) => {
    const active = Number(step.dataset.step) === number;
    step.hidden = !active;
    step.classList.toggle('active', active);
  });
  stepIndicators.forEach((indicator, index) => indicator.classList.toggle('active', index + 1 === number));
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${dateString}T12:00:00`));
}

function renderHours(hours) {
  if (!timeOptions) return;
  timeOptions.innerHTML = '';
  hours.forEach((hour) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'time-option';
    button.textContent = hour;
    button.addEventListener('click', () => {
      document.querySelectorAll('.time-option').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      selectedTimeInput.value = hour;
      continueTime.disabled = false;
      timeStatus.textContent = '';
    });
    timeOptions.appendChild(button);
  });
}

dateInput?.addEventListener('change', () => {
  const hours = getAvailableHours(dateInput.value);
  continueDate.disabled = hours.length === 0;
  dateStatus.textContent = hours.length ? `${hours.length} horarios disponibles.` : 'Este día no está disponible. Elige otra fecha.';
  dateStatus.classList.toggle('unavailable', hours.length === 0);
});

continueDate?.addEventListener('click', () => {
  const hours = getAvailableHours(dateInput.value);
  if (!hours.length) return;
  selectedDateLabel.textContent = `Horarios disponibles para el ${formatDate(dateInput.value)}.`;
  renderHours(hours);
  selectedTimeInput.value = '';
  continueTime.disabled = true;
  showStep(2);
});

continueTime?.addEventListener('click', () => {
  if (!selectedTimeInput.value) return;
  bookingSummary.textContent = `${formatDate(dateInput.value)} a las ${selectedTimeInput.value}.`;
  showStep(3);
});

document.querySelectorAll('.step-back').forEach((button) => {
  button.addEventListener('click', () => showStep(Number(button.closest('.booking-step').dataset.step) - 1));
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.getElementById('booking-status');
  status.textContent = '¡Gracias! Tu solicitud está preparada. Para activar la reserva real, conecta este flujo con tu backend de Plesk/MySQL.';
});

const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.getElementById('contact-status');
  status.textContent = '¡Mensaje preparado! Para recibirlo realmente, conecta el formulario con tu backend de Plesk o un servicio de formularios.';
  contactForm.reset();
});