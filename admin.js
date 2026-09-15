const availabilityDefaults = [
  { day: 'Lunes', key: 1, open: false, hours: ['09:00', '10:30', '12:00', '16:00', '17:30', '19:00'] },
  { day: 'Martes', key: 2, open: true, hours: ['09:00', '10:30', '12:00', '16:00', '17:30', '19:00'] },
  { day: 'Miércoles', key: 3, open: true, hours: ['09:00', '10:30', '12:00', '16:00', '17:30', '19:00'] },
  { day: 'Jueves', key: 4, open: true, hours: ['09:00', '10:30', '12:00', '16:00', '17:30', '19:00'] },
  { day: 'Viernes', key: 5, open: true, hours: ['09:00', '10:30', '12:00', '16:00', '17:30', '19:00'] },
  { day: 'Sábado', key: 6, open: true, hours: ['09:00', '10:30', '12:00', '16:00'] },
  { day: 'Domingo', key: 0, open: false, hours: [] }
];

const demoAppointments = [
  { id: 1, date: '2026-09-18', time: '16:00', name: 'Carlos Martínez', service: 'Corte + Barba', phone: '+34 600 123 456', address: 'Castellón de la Plana', status: 'pending' },
  { id: 2, date: '2026-09-19', time: '10:30', name: 'Álvaro Ruiz', service: 'Corte de pelo', phone: '+34 611 222 333', address: 'Grao de Castellón', status: 'confirmed' },
  { id: 3, date: '2026-09-22', time: '17:30', name: 'Javier López', service: 'Arreglo de barba', phone: '+34 622 333 444', address: 'Castellón de la Plana', status: 'pending' }
];

const availabilityKey = 'barberJosephAvailability';
const appointmentsKey = 'barberJosephAppointments';
const availability = JSON.parse(localStorage.getItem(availabilityKey) || 'null') || availabilityDefaults;
const appointments = JSON.parse(localStorage.getItem(appointmentsKey) || 'null') || demoAppointments;

const moneyDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
const statusLabel = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada' };

function renderAvailability() {
  const container = document.querySelector('#availability-list');
  container.innerHTML = availability.map((item, index) => `
    <div class="availability-row" data-index="${index}">
      <label class="day-toggle"><input type="checkbox" class="day-open" ${item.open ? 'checked' : ''}><span>${item.day}</span></label>
      <div class="hours-input"><input class="day-hours" value="${item.hours.join(', ')}" placeholder="09:00, 10:30, 12:00" ${item.open ? '' : 'disabled'} aria-label="Horas para ${item.day}"><small>Separadas por comas</small></div>
    </div>
  `).join('');

  container.querySelectorAll('.availability-row').forEach((row) => {
    row.querySelector('.day-open').addEventListener('change', (event) => {
      row.querySelector('.day-hours').disabled = !event.target.checked;
    });
  });
}

function renderAppointments() {
  const filter = document.querySelector('#appointment-filter').value;
  const list = document.querySelector('#appointments-list');
  const filtered = appointments
    .filter((appointment) => filter === 'all' || appointment.status === filter)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  list.innerHTML = filtered.length ? filtered.map((appointment) => `
    <article class="appointment-row">
      <div class="appointment-date"><strong>${moneyDate(appointment.date)}</strong><span>${appointment.time}</span></div>
      <div class="appointment-main"><strong>${appointment.name}</strong><span>${appointment.service} · ${appointment.address}</span><small>${appointment.phone}</small></div>
      <div class="appointment-actions">
        <span class="status-pill status-${appointment.status}">${statusLabel[appointment.status]}</span>
        ${appointment.status !== 'confirmed' && appointment.status !== 'cancelled' ? `<button class="text-button" data-action="confirm" data-id="${appointment.id}">Confirmar</button>` : ''}
        ${appointment.status !== 'cancelled' ? `<button class="text-button danger" data-action="cancel" data-id="${appointment.id}">Cancelar</button>` : ''}
      </div>
    </article>
  `).join('') : '<p class="muted">No hay citas para este filtro.</p>';

  list.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const appointment = appointments.find((item) => item.id === Number(button.dataset.id));
      if (!appointment) return;
      appointment.status = button.dataset.action === 'confirm' ? 'confirmed' : 'cancelled';
      localStorage.setItem(appointmentsKey, JSON.stringify(appointments));
      renderAppointments();
      renderStats();
    });
  });
}

function renderStats() {
  document.querySelector('#pending-count').textContent = appointments.filter((item) => item.status === 'pending').length;
  document.querySelector('#upcoming-count').textContent = appointments.filter((item) => item.status !== 'cancelled').length;
  document.querySelector('#open-days-count').textContent = availability.filter((item) => item.open).length;
}

document.querySelector('#today-label').textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
document.querySelector('#appointment-filter').addEventListener('change', renderAppointments);
document.querySelector('#save-availability').addEventListener('click', () => {
  document.querySelectorAll('.availability-row').forEach((row) => {
    const item = availability[Number(row.dataset.index)];
    item.open = row.querySelector('.day-open').checked;
    item.hours = row.querySelector('.day-hours').value.split(',').map((hour) => hour.trim()).filter(Boolean);
    if (!item.open) item.hours = [];
  });
  localStorage.setItem(availabilityKey, JSON.stringify(availability));
  document.querySelector('#availability-status').textContent = 'Disponibilidad guardada en este navegador.';
  renderStats();
});

renderAvailability();
renderAppointments();
renderStats();
