const tabs = Array.from(document.querySelectorAll('.tabs__button'));
const panels = {
  overview: document.getElementById('overview-panel'),
  flows: document.getElementById('flows-panel'),
  reports: document.getElementById('reports-panel'),
  github: document.getElementById('github-panel'),
};

function setActiveTab(tabName) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle('is-active', key === tabName);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
});

// --------- Venda em 3 toques ---------
const saleStepsElement = document.getElementById('sale-steps');
const saleNextButton = document.getElementById('sale-next');
const saleResetButton = document.getElementById('sale-reset');
const saleLogElement = document.getElementById('sale-log');

const saleFlowSteps = [
  {
    label: 'Nova venda aberta',
    message: 'Venda aberta no PDV mobile. Cliente identificado como walk-in.',
  },
  {
    label: 'Peça escaneada',
    message: 'Produto BR-00042 adicionado ao carrinho via QR Code.',
  },
  {
    label: 'PIX gerado',
    message: 'Copia-e-cola fake enviado ao cliente. QR code exibido na tela.',
  },
  {
    label: 'Pagamento confirmado',
    message: 'PSP demo retornou webhook. Status atualizado para pago.',
  },
  {
    label: 'Recibo no WhatsApp',
    message: 'Recibo compartilhado no WhatsApp com link de rastreio.',
  },
];

const saleState = {
  currentStep: -1,
  completed: false,
  message: 'Pronto para iniciar a simulação.',
};

function renderSaleSteps() {
  saleStepsElement.innerHTML = '';
  saleFlowSteps.forEach((step, index) => {
    const li = document.createElement('li');
    li.textContent = step.label;
    li.dataset.index = String(index);
    saleStepsElement.appendChild(li);
  });
}

function updateSaleUI() {
  const items = Array.from(saleStepsElement.children);
  items.forEach((item, index) => {
    item.classList.toggle('is-complete', saleState.completed || index < saleState.currentStep);
    item.classList.toggle('is-active', !saleState.completed && index === saleState.currentStep);
  });

  saleLogElement.textContent = saleState.message;

  if (saleState.completed) {
    saleNextButton.textContent = 'Fluxo concluído';
    saleNextButton.disabled = true;
    saleResetButton.disabled = false;
    return;
  }

  if (saleState.currentStep === -1) {
    saleNextButton.textContent = 'Iniciar fluxo';
    saleNextButton.disabled = false;
    saleResetButton.disabled = true;
  } else if (saleState.currentStep < saleFlowSteps.length - 1) {
    saleNextButton.textContent = 'Próximo passo';
    saleNextButton.disabled = false;
    saleResetButton.disabled = false;
  } else {
    saleNextButton.textContent = 'Concluir fluxo';
    saleNextButton.disabled = false;
    saleResetButton.disabled = false;
  }
}

function handleSaleNext() {
  if (saleState.completed) return;

  if (saleState.currentStep < saleFlowSteps.length - 1) {
    saleState.currentStep += 1;
    saleState.message = saleFlowSteps[saleState.currentStep].message;
  } else {
    saleState.completed = true;
    saleState.message = 'Recibo enviado! A venda foi concluída e registrada nos relatórios.';
  }
  updateSaleUI();
}

function resetSaleFlow() {
  saleState.currentStep = -1;
  saleState.completed = false;
  saleState.message = 'Pronto para iniciar a simulação.';
  updateSaleUI();
}

saleNextButton.addEventListener('click', handleSaleNext);
saleResetButton.addEventListener('click', resetSaleFlow);
renderSaleSteps();
updateSaleUI();

// --------- Reserva temporária ---------
const reservationStatusChip = document.querySelector('#reservation-status .chip');
const reservationTimerElement = document.getElementById('reservation-timer');
const reservationButtons = Array.from(document.querySelectorAll('[data-reservation]'));

let reservationTimerId = null;
let reservationRemaining = 0;

function updateReservationDisplay() {
  if (reservationRemaining > 0) {
    reservationTimerElement.textContent = `Expira em ${String(reservationRemaining).padStart(2, '0')}:00`;
  } else {
    reservationTimerElement.textContent = '—';
  }
}

function clearReservationTimer() {
  if (reservationTimerId) {
    window.clearInterval(reservationTimerId);
    reservationTimerId = null;
  }
}

function releaseReservation(expired = false) {
  clearReservationTimer();
  reservationRemaining = 0;
  reservationStatusChip.textContent = 'Disponível';
  reservationStatusChip.classList.add('chip--available');
  reservationStatusChip.classList.remove('chip--reserved');
  reservationTimerElement.textContent = expired ? 'Reserva expirada' : '—';
}

function startReservation(duration) {
  clearReservationTimer();
  reservationRemaining = duration;
  reservationStatusChip.textContent = `Reservado (${duration} min)`;
  reservationStatusChip.classList.remove('chip--available');
  reservationStatusChip.classList.add('chip--reserved');
  updateReservationDisplay();

  reservationTimerId = window.setInterval(() => {
    reservationRemaining -= 1;
    if (reservationRemaining <= 0) {
      releaseReservation(true);
    } else {
      updateReservationDisplay();
    }
  }, 1000);
}

reservationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const duration = Number(button.dataset.reservation);
    startReservation(duration);
  });
});

// --------- Self-checkout ---------
const selfCheckoutFlag = document.getElementById('self-checkout-flag');
const selfCheckoutFlow = document.getElementById('self-checkout-flow');
const selfCheckoutStatus = document.getElementById('self-checkout-status');
const checkoutScanButton = document.getElementById('checkout-scan');
const checkoutPayButton = document.getElementById('checkout-pay');
const checkoutValidateButton = document.getElementById('checkout-validate');
const checkoutPassBox = document.getElementById('checkout-pass');

const checkoutState = {
  enabled: false,
  stage: 'idle',
  productCode: null,
  passCode: null,
  passValid: false,
  passExpiresAt: null,
};

function randomCode(prefix, digits = 4) {
  const max = 10 ** digits;
  const number = Math.floor(Math.random() * max);
  return `${prefix}-${String(number).padStart(digits, '0')}`;
}

const PASS_DURATION_MS = 2 * 60 * 1000;
let passTimerId = null;

function clearPassTimer() {
  if (passTimerId) {
    window.clearInterval(passTimerId);
    passTimerId = null;
  }
  checkoutState.passExpiresAt = null;
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function renderStatus(title, detail = '', tone = 'info') {
  const tones = ['is-success', 'is-warning', 'is-danger'];
  tones.forEach((className) => selfCheckoutStatus.classList.remove(className));
  if (tone === 'success') {
    selfCheckoutStatus.classList.add('is-success');
  } else if (tone === 'warning') {
    selfCheckoutStatus.classList.add('is-warning');
  } else if (tone === 'danger') {
    selfCheckoutStatus.classList.add('is-danger');
  }

  if (detail) {
    selfCheckoutStatus.innerHTML = `<span>${title}</span><span class="status-detail">${detail}</span>`;
  } else {
    selfCheckoutStatus.innerHTML = `<span>${title}</span>`;
  }
}

function getRemainingMs() {
  if (!checkoutState.passExpiresAt) return PASS_DURATION_MS;
  return Math.max(0, checkoutState.passExpiresAt - Date.now());
}

function startPassTimer() {
  clearPassTimer();
  passTimerId = window.setInterval(() => {
    if (checkoutState.stage !== 'paid') {
      clearPassTimer();
      return;
    }

    const remainingMs = getRemainingMs();
    if (remainingMs <= 0) {
      checkoutState.stage = 'expired';
      checkoutState.passValid = false;
      clearPassTimer();
      updateCheckoutUI();
      return;
    }

    const countdownEl = document.getElementById('pass-countdown');
    if (countdownEl) {
      countdownEl.textContent = `Expira em ${formatCountdown(remainingMs)}`;
    }
  }, 500);
}

function updateCheckoutUI() {
  if (!checkoutState.enabled) {
    selfCheckoutFlow.hidden = true;
    checkoutScanButton.disabled = true;
    checkoutPayButton.disabled = true;
    checkoutValidateButton.disabled = true;
    return;
  }

  selfCheckoutFlow.hidden = false;

  switch (checkoutState.stage) {
    case 'ready':
      renderStatus('Fluxo habilitado.', 'Cliente pode escanear a peça para iniciar.', 'info');
      checkoutScanButton.disabled = false;
      checkoutPayButton.disabled = true;
      checkoutValidateButton.disabled = true;
      checkoutPassBox.hidden = true;
      break;
    case 'awaitingPayment':
      renderStatus(
        `Peça ${checkoutState.productCode} reservada.`,
        'PIX emitido e aguardando confirmação automática do PSP.',
        'warning'
      );
      checkoutScanButton.disabled = true;
      checkoutPayButton.disabled = false;
      checkoutValidateButton.disabled = true;
      checkoutPassBox.hidden = true;
      break;
    case 'paid': {
      renderStatus('Pagamento confirmado!', 'Passe de saída liberado por 2 minutos.', 'success');
      checkoutScanButton.disabled = true;
      checkoutPayButton.disabled = true;
      checkoutValidateButton.disabled = false;
      checkoutPassBox.hidden = false;
      const remainingMs = getRemainingMs();
      checkoutPassBox.innerHTML = `
        <strong>Passe de saída</strong>
        <span class="self-checkout-pass__code">${checkoutState.passCode}</span>
        <span class="pass-countdown" id="pass-countdown">Expira em ${formatCountdown(remainingMs)}</span>
        <span class="self-checkout-pass__hint">Apresente no modo Lojista (Exits) para liberar a saída.</span>
      `;
      break;
    }
    case 'validated':
      renderStatus(
        'Passe validado no lojista.',
        'Sale marcada como concluída (<code>exited_at</code>) e passe invalidado.',
        'success'
      );
      checkoutScanButton.disabled = false;
      checkoutPayButton.disabled = true;
      checkoutValidateButton.disabled = true;
      checkoutPassBox.hidden = false;
      checkoutPassBox.innerHTML = `
        <strong>${checkoutState.passCode}</strong>
        <span>Status: validado e arquivado.</span>
        <span>Para nova compra, escaneie outra peça.</span>
      `;
      break;
    case 'expired':
      renderStatus(
        'Passe expirado.',
        'Reserva liberada automaticamente. Cliente precisa reiniciar o fluxo.',
        'danger'
      );
      checkoutScanButton.disabled = false;
      checkoutPayButton.disabled = true;
      checkoutValidateButton.disabled = true;
      checkoutPassBox.hidden = false;
      checkoutPassBox.innerHTML = `
        <strong>${checkoutState.passCode ?? 'Passe indisponível'}</strong>
        <span>Status: expirado.</span>
        <span>Regenerar exige novo pagamento confirmado.</span>
      `;
      break;
    default:
      break;
  }
}

function resetCheckout() {
  checkoutState.stage = 'idle';
  checkoutState.productCode = null;
  checkoutState.passCode = null;
  checkoutState.passValid = false;
  clearPassTimer();
  updateCheckoutUI();
}

selfCheckoutFlag.addEventListener('change', () => {
  checkoutState.enabled = selfCheckoutFlag.checked;
  if (checkoutState.enabled) {
    checkoutState.stage = 'ready';
  } else {
    resetCheckout();
  }
  updateCheckoutUI();
});

checkoutScanButton.addEventListener('click', () => {
  checkoutState.productCode = randomCode('BR', 5);
  checkoutState.passCode = null;
  checkoutState.passValid = false;
  clearPassTimer();
  checkoutState.stage = 'awaitingPayment';
  updateCheckoutUI();
});

checkoutPayButton.addEventListener('click', () => {
  checkoutState.passCode = randomCode('PASS', 6);
  checkoutState.passExpiresAt = Date.now() + PASS_DURATION_MS;
  checkoutState.stage = 'paid';
  checkoutState.passValid = true;
  updateCheckoutUI();
  startPassTimer();
});

checkoutValidateButton.addEventListener('click', () => {
  checkoutState.stage = 'validated';
  checkoutState.passValid = false;
  checkoutState.productCode = null;
  clearPassTimer();
  updateCheckoutUI();
});

updateCheckoutUI();

// --------- Relatórios ---------
const formatCurrency = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDateLabel = (value) => {
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value;
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const demoSales = [
  { id: 'S-1001', createdAt: '2024-04-01', channel: 'in_store', status: 'paid', total: 280.5 },
  { id: 'S-1002', createdAt: '2024-04-02', channel: 'whatsapp', status: 'paid', total: 185.0 },
  { id: 'S-1003', createdAt: '2024-04-05', channel: 'link', status: 'pending', total: 90.0 },
  { id: 'S-1004', createdAt: '2024-04-08', channel: 'in_store', status: 'paid', total: 320.0 },
  { id: 'S-1005', createdAt: '2024-04-10', channel: 'in_store', status: 'paid', total: 150.0 },
  { id: 'S-1006', createdAt: '2024-04-15', channel: 'whatsapp', status: 'paid', total: 210.75 },
  { id: 'S-1007', createdAt: '2024-04-20', channel: 'link', status: 'canceled', total: 120.0 },
  {
    id: 'S-1008',
    createdAt: '2024-04-21',
    channel: 'self_checkout',
    status: 'paid',
    total: 235.9,
    exitedAt: '2024-04-21T17:12:00Z',
  },
];

const demoPayments = [
  {
    id: 'P-2001',
    saleId: 'S-1001',
    method: 'pix',
    status: 'paid',
    amount: 280.5,
    createdAt: '2024-04-01',
    paidAt: '2024-04-01T14:12:00Z',
  },
  {
    id: 'P-2002',
    saleId: 'S-1002',
    method: 'pix',
    status: 'paid',
    amount: 185.0,
    createdAt: '2024-04-02',
    paidAt: '2024-04-02T12:05:00Z',
  },
  { id: 'P-2003', saleId: 'S-1003', method: 'pix', status: 'pending', amount: 90.0, createdAt: '2024-04-05' },
  {
    id: 'P-2004',
    saleId: 'S-1004',
    method: 'card',
    status: 'paid',
    amount: 320.0,
    createdAt: '2024-04-08',
    paidAt: '2024-04-08T18:43:00Z',
  },
  {
    id: 'P-2005',
    saleId: 'S-1005',
    method: 'cash',
    status: 'paid',
    amount: 150.0,
    createdAt: '2024-04-10',
    paidAt: '2024-04-10T11:31:00Z',
  },
  {
    id: 'P-2006',
    saleId: 'S-1006',
    method: 'pix',
    status: 'paid',
    amount: 210.75,
    createdAt: '2024-04-15',
    paidAt: '2024-04-15T15:58:00Z',
  },
  { id: 'P-2007', saleId: 'S-1007', method: 'pix', status: 'refunded', amount: 120.0, createdAt: '2024-04-20' },
  {
    id: 'P-2008',
    saleId: 'S-1008',
    method: 'pix',
    status: 'paid',
    amount: 235.9,
    createdAt: '2024-04-21',
    paidAt: '2024-04-21T17:10:30Z',
  },
];

const filterStartInput = document.getElementById('filter-start');
const filterEndInput = document.getElementById('filter-end');
const filtersResetButton = document.getElementById('filters-reset');
const kpiSalesValue = document.getElementById('kpi-sales-value');
const kpiSalesCount = document.getElementById('kpi-sales-count');
const kpiAverageTicket = document.getElementById('kpi-average-ticket');
const kpiPixShare = document.getElementById('kpi-pix-share');
const kpiPixTotal = document.getElementById('kpi-pix-total');
const kpiPaymentsCount = document.getElementById('kpi-payments-count');
const kpiPaymentsTotal = document.getElementById('kpi-payments-total');
const salesTableBody = document.getElementById('sales-table-body');
const salesPeriodLabel = document.getElementById('sales-period-label');

function getDateValue(inputValue) {
  return inputValue ? new Date(`${inputValue}T00:00:00Z`) : null;
}

function applyReportsFilters() {
  const startDate = getDateValue(filterStartInput.value);
  const endDate = getDateValue(filterEndInput.value);

  const salesFiltered = demoSales.filter((sale) => {
    const saleDate = new Date(`${sale.createdAt}T00:00:00Z`);
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    return true;
  });

  const paymentsFiltered = demoPayments.filter((payment) => {
    const paymentDate = new Date(`${payment.createdAt}T00:00:00Z`);
    if (startDate && paymentDate < startDate) return false;
    if (endDate && paymentDate > endDate) return false;
    return true;
  });

  const paidSales = salesFiltered.filter((sale) => sale.status === 'paid');
  const totalSalesValue = paidSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageTicket = paidSales.length ? totalSalesValue / paidSales.length : 0;

  const paidPayments = paymentsFiltered.filter((payment) => payment.status === 'paid');
  const totalPaidPayments = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPixPaid = paidPayments
    .filter((payment) => payment.method === 'pix')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pixShare = totalPaidPayments ? Math.round((totalPixPaid / totalPaidPayments) * 100) : 0;

  kpiSalesValue.textContent = formatCurrency(totalSalesValue);
  kpiSalesCount.textContent = `${paidSales.length} venda${paidSales.length === 1 ? '' : 's'}`;
  kpiAverageTicket.textContent = formatCurrency(averageTicket);
  kpiPixShare.textContent = `${pixShare}%`;
  kpiPixTotal.textContent = `${formatCurrency(totalPixPaid)} via PIX`;
  kpiPaymentsCount.textContent = String(paidPayments.length);
  kpiPaymentsTotal.textContent = formatCurrency(totalPaidPayments);

  if (salesFiltered.length === 0) {
    salesTableBody.innerHTML = '<tr><td colspan="5">Nenhuma venda no período selecionado.</td></tr>';
  } else {
    salesTableBody.innerHTML = salesFiltered
      .map((sale) => {
        const dateLabel = formatDateLabel(sale.createdAt);
        const totalLabel = formatCurrency(sale.total);
        return `
          <tr>
            <td>${sale.id}</td>
            <td>${dateLabel}</td>
            <td>${sale.channel.replace('_', ' ')}</td>
            <td>${sale.status}</td>
            <td>${totalLabel}</td>
          </tr>
        `;
      })
      .join('');
  }

  if (startDate || endDate) {
    const startLabel = startDate ? formatDateLabel(startDate) : 'Início';
    const endLabel = endDate ? formatDateLabel(endDate) : 'Sem limite';
    salesPeriodLabel.textContent = `${startLabel} – ${endLabel}`;
  } else {
    salesPeriodLabel.textContent = 'Todos os registros DEMO';
  }
}

function bootstrapFilters() {
  const saleDates = demoSales.map((sale) => sale.createdAt).sort();
  const minDate = saleDates[0];
  const maxDate = saleDates[saleDates.length - 1];

  filterStartInput.value = minDate;
  filterEndInput.value = maxDate;
}

filterStartInput.addEventListener('change', applyReportsFilters);
filterEndInput.addEventListener('change', applyReportsFilters);
filtersResetButton.addEventListener('click', () => {
  filterStartInput.value = '';
  filterEndInput.value = '';
  applyReportsFilters();
});

bootstrapFilters();
applyReportsFilters();

// --------- Login demo ---------
window.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'open-login') {
    window.alert('Fluxo de login não implementado nesta demonstração.');
  }
});
