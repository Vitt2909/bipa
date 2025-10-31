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

// --------- Relatórios DEMO (MVP) ---------
const reportsRoleSelect = document.getElementById('reports-role');

if (reportsRoleSelect) {
  const REPORT_TIMEZONE = 'America/Manaus';
  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const percentFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const decimalFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const paymentLabels = {
    pix: 'PIX',
    card: 'Cartão',
    cash: 'Dinheiro',
    other: 'Outros',
  };

  const channelLabels = {
    in_store: 'Loja',
    whatsapp: 'WhatsApp',
    link: 'Link',
  };

  const consignedLabels = {
    all: 'Todos',
    yes: 'Sim',
    no: 'Não',
  };

  const paymentColors = {
    pix: '#10b981',
    card: '#6366f1',
    cash: '#f97316',
    other: '#475569',
  };

  const demoReportsData = generateDemoReportsData();

  const productMap = new Map(demoReportsData.products.map((product) => [product.id, product]));
  const userMap = new Map(demoReportsData.users.map((user) => [user.id, user]));
  const customerMap = new Map(demoReportsData.customers.map((customer) => [customer.id, customer]));
  const saleItemsBySale = demoReportsData.saleItems.reduce((acc, item) => {
    if (!acc[item.saleId]) acc[item.saleId] = [];
    acc[item.saleId].push(item);
    return acc;
  }, {});
  const paymentsBySale = demoReportsData.payments.reduce((acc, payment) => {
    if (!acc[payment.saleId]) acc[payment.saleId] = [];
    acc[payment.saleId].push(payment);
    return acc;
  }, {});

  const clerkUser = demoReportsData.users.find((user) => user.role === 'clerk');
  const CLERK_ID = clerkUser ? clerkUser.id : null;

  const reportElements = {
    periodButtons: Array.from(document.querySelectorAll('.chip--period')),
    customRange: document.getElementById('custom-range'),
    customStart: document.getElementById('custom-start'),
    customEnd: document.getElementById('custom-end'),
    customApply: document.getElementById('custom-apply'),
    filterLabels: {
      payment: document.querySelector('[data-filter-label="payment"]'),
      seller: document.querySelector('[data-filter-label="seller"]'),
      channel: document.querySelector('[data-filter-label="channel"]'),
      catalog: document.querySelector('[data-filter-label="catalog"]'),
      consigned: document.querySelector('[data-filter-label="consigned"]'),
    },
    filterMenus: {
      payment: document.querySelector('[data-menu="payment"]'),
      seller: document.querySelector('[data-menu="seller"]'),
      channel: document.querySelector('[data-menu="channel"]'),
      catalog: document.querySelector('[data-menu="catalog"]'),
      consigned: document.querySelector('[data-menu="consigned"]'),
    },
    categorySelect: document.getElementById('filter-category'),
    sizeSelect: document.getElementById('filter-size'),
    colorSelect: document.getElementById('filter-color'),
    clearAllButton: document.getElementById('filters-clear-all'),
    scrollDetailsButton: document.getElementById('reports-scroll-details'),
    kpis: {
      netValue: document.getElementById('kpi-net-value'),
      netVariation: document.getElementById('kpi-net-variation'),
      salesCount: document.getElementById('kpi-sales-count'),
      salesVariation: document.getElementById('kpi-sales-variation'),
      salesDetail: document.getElementById('kpi-sales-detail'),
      ticket: document.getElementById('kpi-ticket'),
      ticketVariation: document.getElementById('kpi-ticket-variation'),
      discounts: document.getElementById('kpi-discounts'),
      discountVariation: document.getElementById('kpi-discount-variation'),
      gross: document.getElementById('kpi-gross'),
      items: document.getElementById('kpi-items'),
      margin: document.getElementById('kpi-margin'),
      marginDetail: document.getElementById('kpi-margin-detail'),
      marginCard: document.getElementById('margin-card'),
      pixConversion: document.getElementById('kpi-pix-conversion'),
      pixDetail: document.getElementById('kpi-pix-detail'),
      refunds: document.getElementById('kpi-refunds'),
    },
    charts: {
      lineSvg: document.getElementById('line-chart'),
      lineLabel: document.getElementById('line-chart-label'),
      categoryBars: document.getElementById('category-bars'),
      categoryHint: document.getElementById('category-hint'),
      paymentDonut: document.getElementById('payment-donut'),
      paymentLegend: document.getElementById('payment-legend'),
      paymentTotal: document.getElementById('payment-total'),
      heatmapTable: document.getElementById('sales-heatmap'),
      heatmapHint: document.getElementById('heatmap-hint'),
    },
    lists: {
      products: document.getElementById('top-products'),
      customers: document.getElementById('top-customers'),
      sellers: document.getElementById('top-sellers'),
      productHint: document.getElementById('top-product-hint'),
      customerHint: document.getElementById('top-customer-hint'),
      sellerHint: document.getElementById('top-seller-hint'),
    },
    table: {
      body: document.getElementById('sales-table-body'),
      periodLabel: document.getElementById('sales-period-label'),
      summary: document.getElementById('sales-count-summary'),
    },
  };

  const reportState = {
    role: reportsRoleSelect.value,
    filters: {
      period: 'month',
      start: null,
      end: null,
      customStart: null,
      customEnd: null,
      payment: 'all',
      seller: 'all',
      channel: 'all',
      category: 'all',
      size: 'all',
      color: 'all',
      consigned: 'all',
    },
  };

  let lastContext = null;

  initializeFilterOptions();
  setupEventListeners();
  setPeriod(reportState.filters.period, { skipRender: true });
  renderReports();

  function setupEventListeners() {
    reportElements.periodButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.period) {
          setPeriod(button.dataset.period);
        }
      });
    });

    reportsRoleSelect.addEventListener('change', () => {
      reportState.role = reportsRoleSelect.value;
      renderReports();
    });

    reportElements.customApply?.addEventListener('click', () => {
      if (!reportElements.customStart?.value || !reportElements.customEnd?.value) return;
      const start = inputToDate(reportElements.customStart.value);
      const end = inputToDate(reportElements.customEnd.value);
      if (!start || !end) return;
      if (end < start) {
        reportState.filters.customStart = end;
        reportState.filters.customEnd = start;
      } else {
        reportState.filters.customStart = start;
        reportState.filters.customEnd = end;
      }
      reportState.filters.start = new Date(reportState.filters.customStart);
      reportState.filters.end = addDays(reportState.filters.customEnd, 1);
      renderReports();
    });

    reportElements.clearAllButton?.addEventListener('click', () => {
      reportState.filters.payment = 'all';
      reportState.filters.seller = 'all';
      reportState.filters.channel = 'all';
      reportState.filters.category = 'all';
      reportState.filters.size = 'all';
      reportState.filters.color = 'all';
      reportState.filters.consigned = 'all';
      if (reportElements.categorySelect) reportElements.categorySelect.value = 'all';
      if (reportElements.sizeSelect) reportElements.sizeSelect.value = 'all';
      if (reportElements.colorSelect) reportElements.colorSelect.value = 'all';
      updateFilterLabels();
      syncMenuState();
      renderReports();
    });

    reportElements.scrollDetailsButton?.addEventListener('click', () => {
      document.querySelector('#reports-panel .table-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    ['payment', 'seller', 'channel', 'consigned'].forEach((key) => {
      const menu = reportElements.filterMenus[key];
      if (!menu) return;
      menu.addEventListener('click', (event) => {
        const target = event.target.closest('.chip-option');
        if (!target) return;
        const value = target.dataset.value;
        if (!value || reportState.filters[key] === value) {
          menu.closest('details')?.open = false;
          return;
        }
        reportState.filters[key] = value;
        updateFilterLabels();
        syncMenuState();
        menu.closest('details')?.open = false;
        renderReports();
      });
    });

    reportElements.categorySelect?.addEventListener('change', () => {
      reportState.filters.category = reportElements.categorySelect.value || 'all';
      updateFilterLabels();
      renderReports();
    });

    reportElements.sizeSelect?.addEventListener('change', () => {
      reportState.filters.size = reportElements.sizeSelect.value || 'all';
      updateFilterLabels();
      renderReports();
    });

    reportElements.colorSelect?.addEventListener('change', () => {
      reportState.filters.color = reportElements.colorSelect.value || 'all';
      updateFilterLabels();
      renderReports();
    });

    document.querySelector('[data-action="clear-catalog"]')?.addEventListener('click', () => {
      reportState.filters.category = 'all';
      reportState.filters.size = 'all';
      reportState.filters.color = 'all';
      if (reportElements.categorySelect) reportElements.categorySelect.value = 'all';
      if (reportElements.sizeSelect) reportElements.sizeSelect.value = 'all';
      if (reportElements.colorSelect) reportElements.colorSelect.value = 'all';
      updateFilterLabels();
      syncMenuState();
      renderReports();
    });

    document.querySelectorAll('[data-export]').forEach((button) => {
      button.addEventListener('click', () => {
        const exportType = button.dataset.export;
        if (exportType) {
          exportCsv(exportType);
        }
      });
    });
  }

  function setPeriod(period, options = {}) {
    reportState.filters.period = period;
    if (period === 'custom') {
      ensureCustomDefaults();
      reportState.filters.start = new Date(reportState.filters.customStart);
      reportState.filters.end = addDays(reportState.filters.customEnd, 1);
      if (reportElements.customStart) {
        reportElements.customStart.value = dateToInputValue(reportState.filters.customStart);
      }
      if (reportElements.customEnd) {
        reportElements.customEnd.value = dateToInputValue(reportState.filters.customEnd);
      }
      if (reportElements.customRange) {
        reportElements.customRange.hidden = false;
      }
      updatePeriodButtons();
      if (!options.skipRender) renderReports();
      return;
    }
    const { start, end } = computeRange(period);
    reportState.filters.start = start;
    reportState.filters.end = end;
    if (reportElements.customRange) {
      reportElements.customRange.hidden = true;
    }
    updatePeriodButtons();
    if (!options.skipRender) renderReports();
  }

  function ensureCustomDefaults() {
    if (reportState.filters.customStart && reportState.filters.customEnd) return;
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    reportState.filters.customStart = start;
    reportState.filters.customEnd = end;
  }

  function updatePeriodButtons() {
    reportElements.periodButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.period === reportState.filters.period);
    });
  }

  function computeRange(period) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = addDays(today, 1);
    const start = new Date(today);
    if (period === 'today') {
      return { start, end };
    }
    if (period === 'week') {
      start.setDate(start.getDate() - 6);
      return { start, end };
    }
    if (period === 'month') {
      start.setDate(1);
      return { start, end };
    }
    return { start, end };
  }

  function renderReports() {
    const { start, end } = reportState.filters;
    if (!start || !end) return;
    const context = buildRangeContext(start, end);
    const duration = end.getTime() - start.getTime();
    const previousEnd = new Date(start);
    const previousStart = new Date(start.getTime() - duration);
    const comparison = buildRangeContext(previousStart, previousEnd);
    lastContext = context;

    renderKpis(context, comparison);
    renderCharts(context);
    renderLists(context);
    renderTable(context);
    updateFilterLabels();
  }

  function buildRangeContext(start, end) {
    const startTime = start.getTime();
    const endTime = end.getTime();

    const filteredSales = demoReportsData.sales.filter((sale) => {
      const createdAt = new Date(sale.createdAt).getTime();
      if (createdAt < startTime || createdAt >= endTime) return false;
      if (reportState.role === 'clerk' && CLERK_ID && sale.createdBy !== CLERK_ID) return false;
      if (reportState.filters.seller !== 'all' && sale.createdBy !== reportState.filters.seller) return false;
      if (reportState.filters.channel !== 'all' && sale.channel !== reportState.filters.channel) return false;
      if (reportState.filters.consigned === 'yes' && !sale.isConsigned) return false;
      if (reportState.filters.consigned === 'no' && sale.isConsigned) return false;

      if (reportState.filters.payment !== 'all') {
        const payments = paymentsBySale[sale.id] || [];
        if (!payments.some((payment) => payment.method === reportState.filters.payment)) {
          return false;
        }
      }

      const items = saleItemsBySale[sale.id] || [];
      if (reportState.filters.category !== 'all') {
        if (!items.some((item) => (productMap.get(item.productId)?.category ?? '') === reportState.filters.category)) {
          return false;
        }
      }
      if (reportState.filters.size !== 'all') {
        if (!items.some((item) => (productMap.get(item.productId)?.size ?? '') === reportState.filters.size)) {
          return false;
        }
      }
      if (reportState.filters.color !== 'all') {
        if (!items.some((item) => (productMap.get(item.productId)?.color ?? '') === reportState.filters.color)) {
          return false;
        }
      }

      return true;
    });

    const saleIdSet = new Set(filteredSales.map((sale) => sale.id));
    const relevantItems = [];
    const relevantPayments = [];
    const itemsBySaleMap = new Map();
    const paymentsBySaleMap = new Map();

    saleIdSet.forEach((saleId) => {
      const items = saleItemsBySale[saleId] || [];
      const payments = paymentsBySale[saleId] || [];
      itemsBySaleMap.set(saleId, items);
      paymentsBySaleMap.set(saleId, payments);
      relevantItems.push(...items);
      relevantPayments.push(...payments);
    });

    const paidSales = filteredSales.filter((sale) => sale.status === 'paid');
    const paidSaleIds = new Set(paidSales.map((sale) => sale.id));
    const paidItems = relevantItems.filter((item) => paidSaleIds.has(item.saleId));
    const paidPayments = relevantPayments.filter((payment) => payment.status === 'paid');

    const grossRevenue = paidItems.reduce((sum, item) => sum + item.unitPrice, 0);
    const grossAbs = paidItems.reduce((sum, item) => sum + Math.abs(item.unitPrice), 0);
    const discounts = paidSales.reduce((sum, sale) => sum + sale.discountValue, 0);
    const netRevenue = paidSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = paidItems.reduce((sum, item) => sum + Math.abs(item.quantity ?? 1), 0);
    const salesCount = paidSales.length;
    const itemsPerSale = salesCount ? totalItems / salesCount : 0;

    const marginNumerator = paidItems.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      const cost = product?.costPrice ?? 0;
      const quantity = item.quantity ?? 1;
      return sum + (item.unitPrice - cost * quantity);
    }, 0);
    const marginDenominator = paidItems.reduce((sum, item) => sum + item.unitPrice, 0);
    const marginPct = marginDenominator !== 0 ? marginNumerator / marginDenominator : null;

    const pixPaid = paidPayments.filter((payment) => payment.method === 'pix');
    const pixPending = relevantPayments.filter((payment) => payment.method === 'pix' && payment.status === 'pending');
    const pixConversion = pixPaid.length + pixPending.length > 0 ? pixPaid.length / (pixPaid.length + pixPending.length) : null;
    const pixAverageMinutes =
      pixPaid.length > 0
        ? pixPaid.reduce((sum, payment) => {
            if (!payment.paidAt) return sum;
            const paidAt = new Date(payment.paidAt);
            const createdAt = new Date(payment.createdAt);
            return sum + (paidAt.getTime() - createdAt.getTime()) / 60000;
          }, 0) / pixPaid.length
        : null;

    const refundSales = paidSales.filter((sale) => sale.total < 0);
    const refundImpact = refundSales.reduce((sum, sale) => sum + sale.total, 0);
    const refundCount = refundSales.length;

    const paymentTotals = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const paymentTotalsAbs = paidPayments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
    const paymentMixMap = new Map();
    paidPayments.forEach((payment) => {
      const current = paymentMixMap.get(payment.method) ?? 0;
      paymentMixMap.set(payment.method, current + payment.amount);
    });
    const paymentMix = Array.from(paymentMixMap.entries())
      .map(([method, amount]) => ({ method, amount, share: paymentTotalsAbs ? Math.abs(amount) / paymentTotalsAbs : 0 }))
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

    const categoriesMap = new Map();
    const sizeMap = new Map();
    const colorMap = new Map();

    paidItems.forEach((item) => {
      const product = productMap.get(item.productId);
      if (!product) return;
      const quantity = Math.abs(item.quantity ?? 1);
      const value = item.unitPrice;
      if (product.category) {
        const entry = categoriesMap.get(product.category) ?? { total: 0, qty: 0 };
        entry.total += value;
        entry.qty += quantity;
        categoriesMap.set(product.category, entry);
      }
      if (product.size) {
        const entry = sizeMap.get(product.size) ?? { total: 0, qty: 0 };
        entry.total += value;
        entry.qty += quantity;
        sizeMap.set(product.size, entry);
      }
      if (product.color) {
        const entry = colorMap.get(product.color) ?? { total: 0, qty: 0 };
        entry.total += value;
        entry.qty += quantity;
        colorMap.set(product.color, entry);
      }
    });

    const categoryList = Array.from(categoriesMap.entries())
      .map(([name, data]) => ({ name, total: data.total, qty: data.qty, share: grossAbs ? Math.abs(data.total) / grossAbs : 0 }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 5);

    const sizeList = Array.from(sizeMap.entries())
      .map(([name, data]) => ({ name, qty: data.qty, total: data.total }))
      .sort((a, b) => b.qty - a.qty || Math.abs(b.total) - Math.abs(a.total));

    const colorList = Array.from(colorMap.entries())
      .map(([name, data]) => ({ name, qty: data.qty, total: data.total }))
      .sort((a, b) => b.qty - a.qty || Math.abs(b.total) - Math.abs(a.total));

    const productAggregates = new Map();
    paidItems.forEach((item) => {
      const product = productMap.get(item.productId);
      if (!product) return;
      const entry = productAggregates.get(product.id) ?? { name: product.name, code: product.code, total: 0, qty: 0 };
      entry.total += item.unitPrice;
      entry.qty += Math.abs(item.quantity ?? 1);
      productAggregates.set(product.id, entry);
    });
    const topProducts = Array.from(productAggregates.values())
      .sort((a, b) => b.qty - a.qty || Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 5);

    const customerAggregates = new Map();
    paidSales.forEach((sale) => {
      const key = sale.customerId ?? 'walkin';
      const entry = customerAggregates.get(key) ?? { total: 0, count: 0 };
      entry.total += sale.total;
      entry.count += 1;
      customerAggregates.set(key, entry);
    });
    const topCustomers = Array.from(customerAggregates.entries())
      .map(([id, data]) => ({
        id,
        name: id === 'walkin' ? 'Cliente walk-in' : customerMap.get(id)?.name || 'Cliente',
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 5);
    const repeatCustomers = Array.from(customerAggregates.values()).filter((entry) => entry.count > 1).length;

    const sellerAggregates = new Map();
    paidSales.forEach((sale) => {
      const entry = sellerAggregates.get(sale.createdBy) ?? { total: 0, count: 0 };
      entry.total += sale.total;
      entry.count += 1;
      sellerAggregates.set(sale.createdBy, entry);
    });
    const topSellers = Array.from(sellerAggregates.entries())
      .map(([id, data]) => ({ id, name: userMap.get(id)?.name || 'Equipe DEMO', total: data.total, count: data.count }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 5);
    const topSellerName = topSellers[0]?.name ?? null;

    const lineSeries = buildLineSeries(paidSales, start, end);
    const heatmap = buildHeatmap(paidSales);

    const salesDays = Math.max(1, Math.round((endTime - startTime) / DAY_IN_MS));
    const salesPerDay = salesCount ? salesCount / salesDays : 0;

    return {
      start,
      end,
      filteredSales,
      paidSales,
      relevantPayments,
      paidPayments,
      itemsBySale: itemsBySaleMap,
      paymentsBySale: paymentsBySaleMap,
      grossRevenue,
      grossAbs,
      discounts,
      netRevenue,
      salesCount,
      itemsPerSale,
      marginNumerator,
      marginDenominator,
      marginPct,
      paymentMix,
      totalPaidAmount: paymentTotals,
      totalPaidAmountAbs: paymentTotalsAbs,
      pix: {
        paidCount: pixPaid.length,
        pendingCount: pixPending.length,
        conversion: pixConversion,
        averageMinutes: pixAverageMinutes,
      },
      refundImpact,
      refundCount,
      categorySummary: {
        name: categoryList[0]?.name ?? null,
        share: categoryList[0]?.share ?? 0,
        list: categoryList,
      },
      sizeSummary: sizeList[0]?.name ?? null,
      colorSummary: colorList[0]?.name ?? null,
      topProducts,
      topCustomers,
      topSellers,
      repeatCustomers,
      topSellerName,
      salesPerDay,
      salesDays,
      lineSeries,
      heatmap,
    };
  }

  function buildLineSeries(paidSales, start, end) {
    const duration = end.getTime() - start.getTime();
    const hourly = duration <= DAY_IN_MS;
    const buckets = hourly ? 24 : Math.max(1, Math.round(duration / DAY_IN_MS));
    const values = new Array(buckets).fill(0);
    const labels = new Array(buckets).fill('');

    if (hourly) {
      for (let hour = 0; hour < 24; hour += 1) {
        labels[hour] = `${String(hour).padStart(2, '0')}h`;
      }
      paidSales.forEach((sale) => {
        const date = new Date(sale.createdAt);
        const hour = date.getHours();
        values[hour] += sale.total;
      });
    } else {
      for (let index = 0; index < buckets; index += 1) {
        const day = addDays(start, index);
        labels[index] = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(day);
      }
      paidSales.forEach((sale) => {
        const createdAt = new Date(sale.createdAt);
        const bucketIndex = Math.floor((createdAt.getTime() - start.getTime()) / DAY_IN_MS);
        if (bucketIndex >= 0 && bucketIndex < buckets) {
          values[bucketIndex] += sale.total;
        }
      });
    }

    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);
    return { labels, values, max, min, mode: hourly ? 'hourly' : 'daily' };
  }

  function buildHeatmap(paidSales) {
    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const bucketLabels = [
      { label: '00-03h', start: 0, end: 4 },
      { label: '04-07h', start: 4, end: 8 },
      { label: '08-11h', start: 8, end: 12 },
      { label: '12-15h', start: 12, end: 16 },
      { label: '16-19h', start: 16, end: 20 },
      { label: '20-23h', start: 20, end: 24 },
    ];
    const matrix = dayLabels.map(() => bucketLabels.map(() => 0));
    let peakValue = 0;
    let peakLabel = null;

    paidSales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const dayIndex = date.getDay();
      const hour = date.getHours();
      const bucketIndex = Math.min(bucketLabels.length - 1, Math.floor(hour / 4));
      matrix[dayIndex][bucketIndex] += sale.total;
      const absValue = Math.abs(matrix[dayIndex][bucketIndex]);
      if (absValue > Math.abs(peakValue)) {
        peakValue = matrix[dayIndex][bucketIndex];
        peakLabel = `${dayLabels[dayIndex]} • ${bucketLabels[bucketIndex].label}`;
      }
    });

    const maxAbs = matrix.flat().reduce((max, value) => Math.max(max, Math.abs(value)), 0);
    return {
      dayLabels,
      bucketLabels,
      matrix,
      maxAbs,
      peak: peakLabel ? { label: peakLabel, value: peakValue } : null,
    };
  }

  function renderKpis(context, comparison) {
    updateKpiValue(reportElements.kpis.netValue, reportElements.kpis.netVariation, context.netRevenue, comparison.netRevenue, formatCurrency);
    updateKpiValue(reportElements.kpis.salesCount, reportElements.kpis.salesVariation, context.salesCount, comparison.salesCount, (value) => String(value));
    const ticket = context.salesCount ? context.netRevenue / context.salesCount : 0;
    const ticketPrev = comparison.salesCount ? comparison.netRevenue / comparison.salesCount : 0;
    updateKpiValue(reportElements.kpis.ticket, reportElements.kpis.ticketVariation, ticket, ticketPrev, formatCurrency);
    updateKpiValue(reportElements.kpis.discounts, reportElements.kpis.discountVariation, context.discounts, comparison.discounts, formatCurrency);

    if (context.salesCount > 0) {
      reportElements.kpis.salesDetail.textContent = `Média: ${decimalFormatter.format(context.salesPerDay)} vendas/dia (${context.salesDays} dias)`;
    } else {
      reportElements.kpis.salesDetail.textContent = 'Sem vendas pagas no período';
    }

    reportElements.kpis.gross.textContent = formatCurrency(context.grossRevenue);
    reportElements.kpis.items.textContent = decimalFormatter.format(context.itemsPerSale || 0);

    if (reportState.role === 'clerk') {
      reportElements.kpis.marginCard.hidden = true;
    } else {
      reportElements.kpis.marginCard.hidden = false;
      if (context.marginPct !== null) {
        reportElements.kpis.margin.textContent = percentFormatter.format(context.marginPct);
        reportElements.kpis.marginDetail.textContent = `${formatCurrency(context.marginNumerator)} de margem bruta`;
      } else {
        reportElements.kpis.margin.textContent = '—';
        reportElements.kpis.marginDetail.textContent = 'Cadastre custo para ver margem';
      }
    }

    if (context.pix.conversion !== null) {
      reportElements.kpis.pixConversion.textContent = percentFormatter.format(context.pix.conversion);
      const minutes = context.pix.averageMinutes !== null ? `${decimalFormatter.format(context.pix.averageMinutes)} min` : '—';
      reportElements.kpis.pixDetail.textContent = `Pagas: ${context.pix.paidCount} • Pendentes: ${context.pix.pendingCount} • Tempo médio: ${minutes}`;
    } else {
      reportElements.kpis.pixConversion.textContent = '—';
      reportElements.kpis.pixDetail.textContent = 'Sem pagamentos PIX no período';
    }

    reportElements.kpis.refunds.textContent = formatCurrency(context.refundImpact);
    reportElements.kpis.refunds.classList.toggle('value-negative', context.refundImpact < 0);
  }

  function updateKpiValue(valueElement, variationElement, current, previous, formatter) {
    if (!valueElement || !variationElement) return;
    valueElement.textContent = formatter(current);
    variationElement.classList.remove('is-positive', 'is-negative');
    if (!Number.isFinite(previous) || previous === 0) {
      if (current === 0) {
        variationElement.textContent = '—';
      } else {
        variationElement.textContent = current > 0 ? '+100%' : '-100%';
        variationElement.classList.add(current > 0 ? 'is-positive' : 'is-negative');
      }
      return;
    }
    const diff = current - previous;
    const variation = diff / Math.abs(previous);
    const formatted = percentFormatter.format(variation);
    variationElement.textContent = variation >= 0 ? `+${formatted}` : formatted;
    if (variation > 0) variationElement.classList.add('is-positive');
    if (variation < 0) variationElement.classList.add('is-negative');
  }

  function renderCharts(context) {
    if (reportElements.charts.lineLabel) {
      reportElements.charts.lineLabel.textContent = context.lineSeries.mode === 'hourly' ? 'Agrupado por hora' : 'Agrupado por dia';
    }
    renderLineChart(context.lineSeries);
    renderCategoryBars(context.categorySummary.list);
    renderPaymentMix(context.paymentMix, context.totalPaidAmount);
    renderHeatmapChart(context.heatmap);
  }

  function renderLineChart(series) {
    const svg = reportElements.charts.lineSvg;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    if (!series || series.values.every((value) => value === 0)) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '50');
      text.setAttribute('y', '32');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#94a3b8');
      text.textContent = 'Sem vendas pagas';
      svg.appendChild(text);
      return;
    }

    const { max, min, values, labels } = series;
    const range = max - min || 1;
    const points = values.map((value, index) => {
      const x = values.length > 1 ? (index / (values.length - 1)) * 100 : 50;
      const y = 55 - ((value - min) / range) * 50;
      return { x, y: Math.min(55, Math.max(5, y)), label: labels[index] };
    });

    const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);

    points.forEach((point) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      circle.setAttribute('r', '1.8');
      svg.appendChild(circle);
    });
  }

  function renderCategoryBars(list) {
    const container = reportElements.charts.categoryBars;
    if (!container) return;
    if (!list || list.length === 0) {
      container.innerHTML = '<li class="value-muted">Sem vendas pagas</li>';
      if (reportElements.charts.categoryHint) reportElements.charts.categoryHint.textContent = '—';
      return;
    }
    container.innerHTML = list
      .map(
        (entry) => `
          <li>
            <div class="bar-chart__label">
              <span>${entry.name}</span>
              <span>${formatCurrency(entry.total)}</span>
            </div>
            <div class="bar-chart__bar">
              <span style="--value:${Math.min(100, entry.share * 100).toFixed(1)}%"></span>
            </div>
          </li>
        `,
      )
      .join('');
    if (reportElements.charts.categoryHint) {
      reportElements.charts.categoryHint.textContent = `${list[0].name} lidera com ${percentFormatter.format(list[0].share)}`;
    }
  }

  function renderPaymentMix(mix, total) {
    const donut = reportElements.charts.paymentDonut;
    const legend = reportElements.charts.paymentLegend;
    if (reportElements.charts.paymentTotal) {
      reportElements.charts.paymentTotal.textContent = `Total confirmado: ${formatCurrency(total)}`;
    }
    if (!donut || !legend) return;
    if (!mix || mix.length === 0) {
      donut.style.background = 'linear-gradient(180deg, rgba(148,163,184,0.2), rgba(148,163,184,0.4))';
      legend.innerHTML = '<li class="value-muted">Sem pagamentos confirmados</li>';
      return;
    }
    let currentAngle = 0;
    const segments = [];
    mix.forEach((entry) => {
      const color = paymentColors[entry.method] || '#94a3b8';
      const sweep = entry.share * 360;
      segments.push(`${color} ${currentAngle}deg ${currentAngle + sweep}deg`);
      currentAngle += sweep;
    });
    donut.style.background = `conic-gradient(${segments.join(', ')})`;

    legend.innerHTML = mix
      .map((entry) => {
        const color = paymentColors[entry.method] || '#94a3b8';
        return `
          <li>
            <span class="legend-dot" style="background:${color}"></span>
            <span>${paymentLabels[entry.method] || entry.method}</span>
            <strong>${formatCurrency(entry.amount)}</strong>
            <span class="value-muted">(${percentFormatter.format(entry.share)})</span>
          </li>
        `;
      })
      .join('');
  }

  function renderHeatmapChart(heatmap) {
    const table = reportElements.charts.heatmapTable;
    if (!table) return;
    if (!heatmap || heatmap.matrix.every((row) => row.every((value) => value === 0))) {
      table.innerHTML = '<tr><td class="value-muted">Sem vendas pagas</td></tr>';
      if (reportElements.charts.heatmapHint) reportElements.charts.heatmapHint.textContent = '—';
      return;
    }

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th'));
    heatmap.bucketLabels.forEach((bucket) => {
      const th = document.createElement('th');
      th.textContent = bucket.label;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const tbody = document.createElement('tbody');
    heatmap.dayLabels.forEach((day, dayIndex) => {
      const row = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = day;
      row.appendChild(th);
      heatmap.bucketLabels.forEach((_, bucketIndex) => {
        const value = heatmap.matrix[dayIndex][bucketIndex];
        const cell = document.createElement('td');
        const span = document.createElement('span');
        span.textContent = value === 0 ? '—' : formatCurrency(value);
        cell.appendChild(span);
        const intensity = heatmap.maxAbs ? Math.abs(value) / heatmap.maxAbs : 0;
        cell.style.setProperty('--intensity', intensity.toFixed(2));
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });

    table.innerHTML = '';
    table.appendChild(thead);
    table.appendChild(tbody);

    if (reportElements.charts.heatmapHint) {
      reportElements.charts.heatmapHint.textContent = heatmap.peak
        ? `${heatmap.peak.label} com ${formatCurrency(heatmap.peak.value)}`
        : '—';
    }
  }

  function renderLists(context) {
    if (reportElements.lists.products) {
      if (context.topProducts.length === 0) {
        reportElements.lists.products.innerHTML = '<li class="value-muted">Sem vendas pagas</li>';
      } else {
        reportElements.lists.products.innerHTML = context.topProducts
          .map(
            (product) => `
              <li>
                <span>${product.name}</span>
                <div class="list-card__meta">
                  <span>${product.qty} un.</span>
                  <span>${formatCurrency(product.total)}</span>
                </div>
              </li>
            `,
          )
          .join('');
      }
    }

    if (reportElements.lists.customers) {
      if (context.topCustomers.length === 0) {
        reportElements.lists.customers.innerHTML = '<li class="value-muted">Sem vendas pagas</li>';
      } else {
        reportElements.lists.customers.innerHTML = context.topCustomers
          .map(
            (customer) => `
              <li>
                <span>${customer.name}</span>
                <div class="list-card__meta">
                  <span>${customer.count} compra${customer.count === 1 ? '' : 's'}</span>
                  <span>${formatCurrency(customer.total)}</span>
                </div>
              </li>
            `,
          )
          .join('');
      }
    }

    if (reportElements.lists.sellers) {
      if (context.topSellers.length === 0) {
        reportElements.lists.sellers.innerHTML = '<li class="value-muted">Sem vendas pagas</li>';
      } else {
        reportElements.lists.sellers.innerHTML = context.topSellers
          .map(
            (seller) => `
              <li>
                <span>${seller.name}</span>
                <div class="list-card__meta">
                  <span>${seller.count} venda${seller.count === 1 ? '' : 's'}</span>
                  <span>${formatCurrency(seller.total)}</span>
                </div>
              </li>
            `,
          )
          .join('');
      }
    }

    const productParts = [];
    if (context.categorySummary.name) productParts.push(context.categorySummary.name);
    if (context.sizeSummary) productParts.push(`Tam ${context.sizeSummary}`);
    if (context.colorSummary) productParts.push(context.colorSummary);
    if (reportElements.lists.productHint) {
      reportElements.lists.productHint.textContent = productParts.length
        ? `${productParts.join(' • ')} no topo.`
        : 'Sem vendas pagas';
    }
    if (reportElements.lists.customerHint) {
      reportElements.lists.customerHint.textContent =
        context.repeatCustomers > 0
          ? `${context.repeatCustomers} cliente${context.repeatCustomers === 1 ? '' : 's'} recorrente${context.repeatCustomers === 1 ? '' : 's'}.`
          : 'Todos os clientes foram novos.';
    }
    if (reportElements.lists.sellerHint) {
      reportElements.lists.sellerHint.textContent = context.topSellerName
        ? `Melhor desempenho: ${context.topSellerName}.`
        : 'Sem vendas pagas.';
    }
  }

  function renderTable(context) {
    const tbody = reportElements.table.body;
    if (!tbody) return;
    const rows = [];
    const sortedSales = context.filteredSales.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sortedSales.forEach((sale) => {
      const items = context.itemsBySale.get(sale.id) || [];
      const payments = context.paymentsBySale.get(sale.id) || [];
      const itemCount = items.reduce((sum, item) => sum + Math.abs(item.quantity ?? 1), 0);
      const sellerName = userMap.get(sale.createdBy)?.name || 'Equipe DEMO';
      const customerName = sale.customerId ? customerMap.get(sale.customerId)?.name || 'Cliente' : 'Cliente walk-in';
      const statusClass = sale.status === 'paid' ? 'status-pill--paid' : sale.status === 'pending' ? 'status-pill--pending' : 'status-pill--refunded';
      const paymentBadges = payments
        .map((payment) => `<span class="payment-badge">${paymentLabels[payment.method] || payment.method} • ${formatStatusLabel(payment.status)}</span>`)
        .join('');
      const totalClass = sale.total < 0 ? 'value-negative' : 'value-positive';

      rows.push(`
        <tr>
          <td>${sale.id}</td>
          <td>${formatTableDate(sale.createdAt)}</td>
          <td>${channelLabels[sale.channel] || sale.channel}</td>
          <td>${sellerName}</td>
          <td>${customerName}</td>
          <td>${itemCount}${sale.isConsigned ? ' • Consignado' : ''}</td>
          <td>${formatCurrency(sale.discountValue)}</td>
          <td class="${totalClass}">${formatCurrency(sale.total)}</td>
          <td><span class="status-pill ${statusClass}">${formatStatusLabel(sale.status)}</span></td>
          <td>${paymentBadges || '<span class="value-muted">—</span>'}</td>
        </tr>
      `);
    });

    tbody.innerHTML = rows.length ? rows.join('') : '<tr><td colspan="10" class="value-muted">Sem registros para os filtros atuais.</td></tr>';

    if (reportElements.table.periodLabel) {
      reportElements.table.periodLabel.textContent = `${formatRangeLabel(context.start, context.end)} • ${REPORT_TIMEZONE}`;
    }
    if (reportElements.table.summary) {
      reportElements.table.summary.textContent = `${context.filteredSales.length} venda${context.filteredSales.length === 1 ? '' : 's'} filtrada${context.filteredSales.length === 1 ? '' : 's'} • ${context.paidSales.length} paga${context.paidSales.length === 1 ? '' : 's'}`;
    }
  }

  function initializeFilterOptions() {
    buildMenu(reportElements.filterMenus.payment, getPaymentOptions(), reportState.filters.payment);
    buildMenu(reportElements.filterMenus.seller, getSellerOptions(), reportState.filters.seller);
    buildMenu(reportElements.filterMenus.channel, getChannelOptions(), reportState.filters.channel);
    buildMenu(reportElements.filterMenus.consigned, getConsignedOptions(), reportState.filters.consigned);

    populateSelect(reportElements.categorySelect, getCatalogValues('category'));
    populateSelect(reportElements.sizeSelect, getCatalogValues('size'));
    populateSelect(reportElements.colorSelect, getCatalogValues('color'));

    if (reportElements.categorySelect) reportElements.categorySelect.value = reportState.filters.category;
    if (reportElements.sizeSelect) reportElements.sizeSelect.value = reportState.filters.size;
    if (reportElements.colorSelect) reportElements.colorSelect.value = reportState.filters.color;

    updateFilterLabels();
    syncMenuState();
  }

  function buildMenu(menu, options, currentValue) {
    if (!menu) return;
    menu.innerHTML = '';
    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chip-option${option.value === currentValue ? ' is-active' : ''}`;
      button.dataset.value = option.value;
      button.textContent = option.label;
      menu.appendChild(button);
    });
  }

  function populateSelect(select, values) {
    if (!select) return;
    select.innerHTML = '';
    const optionAll = document.createElement('option');
    optionAll.value = 'all';
    optionAll.textContent = 'Todos';
    select.appendChild(optionAll);
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function getPaymentOptions() {
    const values = Array.from(new Set(demoReportsData.payments.map((payment) => payment.method))).filter(Boolean);
    values.sort((a, b) => (paymentLabels[a] || a).localeCompare(paymentLabels[b] || b, 'pt-BR'));
    return [{ value: 'all', label: 'Todos' }].concat(values.map((method) => ({ value: method, label: paymentLabels[method] || method })));
  }

  function getSellerOptions() {
    const options = demoReportsData.users.map((user) => ({ value: user.id, label: user.name }));
    options.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
    return [{ value: 'all', label: 'Todos' }].concat(options);
  }

  function getChannelOptions() {
    const values = Array.from(new Set(demoReportsData.sales.map((sale) => sale.channel))).filter(Boolean);
    values.sort((a, b) => (channelLabels[a] || a).localeCompare(channelLabels[b] || b, 'pt-BR'));
    return [{ value: 'all', label: 'Todos' }].concat(values.map((channel) => ({ value: channel, label: channelLabels[channel] || channel })));
  }

  function getConsignedOptions() {
    return [
      { value: 'all', label: 'Todos' },
      { value: 'yes', label: 'Sim' },
      { value: 'no', label: 'Não' },
    ];
  }

  function getCatalogValues(key) {
    const values = new Set();
    demoReportsData.products.forEach((product) => {
      const value = product[key];
      if (value) values.add(value);
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }

  function syncMenuState() {
    ['payment', 'seller', 'channel', 'consigned'].forEach((key) => {
      const menu = reportElements.filterMenus[key];
      if (!menu) return;
      Array.from(menu.querySelectorAll('.chip-option')).forEach((button) => {
        button.classList.toggle('is-active', button.dataset.value === reportState.filters[key]);
      });
    });
  }

  function updateFilterLabels() {
    if (reportElements.filterLabels.payment) {
      reportElements.filterLabels.payment.textContent =
        reportState.filters.payment === 'all' ? 'Todos' : paymentLabels[reportState.filters.payment] || reportState.filters.payment;
    }

    if (reportElements.filterLabels.seller) {
      reportElements.filterLabels.seller.textContent =
        reportState.filters.seller === 'all' ? 'Todos' : userMap.get(reportState.filters.seller)?.name || 'Equipe DEMO';
    }

    if (reportElements.filterLabels.channel) {
      reportElements.filterLabels.channel.textContent =
        reportState.filters.channel === 'all' ? 'Todos' : channelLabels[reportState.filters.channel] || reportState.filters.channel;
    }

    if (reportElements.filterLabels.catalog) {
      const parts = [];
      if (reportState.filters.category !== 'all') parts.push(reportState.filters.category);
      if (reportState.filters.size !== 'all') parts.push(`Tam ${reportState.filters.size}`);
      if (reportState.filters.color !== 'all') parts.push(reportState.filters.color);
      reportElements.filterLabels.catalog.textContent = parts.length ? parts.join(' • ') : 'Todos';
    }

    if (reportElements.filterLabels.consigned) {
      reportElements.filterLabels.consigned.textContent = consignedLabels[reportState.filters.consigned] || 'Todos';
    }
  }

  function formatCurrency(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return currencyFormatter.format(0);
    return currencyFormatter.format(number);
  }

  function formatStatusLabel(status) {
    if (!status) return '—';
    const map = {
      paid: 'Pago',
      pending: 'Pendente',
      refunded: 'Estornado',
      cancelled: 'Cancelado',
    };
    return map[status] || status.charAt(0).toUpperCase() + status.slice(1);
  }

  function formatTableDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: REPORT_TIMEZONE,
    }).format(date);
  }

  function formatRangeLabel(start, end) {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = addDays(end, -1);
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: REPORT_TIMEZONE,
    });
    if (startDate.toDateString() === endDate.toDateString()) {
      return formatter.format(startDate);
    }
    return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
  }

  function inputToDate(value) {
    if (!value) return null;
    const parts = value.split('-').map(Number);
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
    const [year, month, day] = parts;
    const date = new Date();
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function dateToInputValue(date) {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDays(date, amount) {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
  }

  function exportCsv(type) {
    if (!lastContext) return;

    let rows = [];

    if (type === 'sales') {
      rows.push(['sale_id', 'created_at', 'seller', 'customer', 'total', 'method', 'status', 'demo']);
      const sorted = lastContext.filteredSales.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      sorted.forEach((sale) => {
        const payments = lastContext.paymentsBySale.get(sale.id) || [];
        const methods = Array.from(new Set(payments.map((payment) => payment.method))).join('/');
        const sellerName = userMap.get(sale.createdBy)?.name || 'Equipe DEMO';
        const customerName = sale.customerId ? customerMap.get(sale.customerId)?.name || 'Cliente' : 'Cliente walk-in';
        rows.push([
          sale.id,
          new Date(sale.createdAt).toISOString(),
          sellerName,
          customerName,
          Number(sale.total).toFixed(2),
          methods,
          sale.status,
          'true',
        ]);
      });
    } else if (type === 'items') {
      rows.push(['sale_id', 'product_code', 'name', 'unit_price', 'demo']);
      const saleOrder = lastContext.filteredSales
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((sale) => sale.id);
      saleOrder.forEach((saleId) => {
        const items = lastContext.itemsBySale.get(saleId) || [];
        items.forEach((item) => {
          const product = productMap.get(item.productId);
          rows.push([
            saleId,
            product?.code || item.productId,
            product?.name || 'Produto',
            Number(item.unitPrice).toFixed(2),
            'true',
          ]);
        });
      });
    } else if (type === 'payments') {
      rows.push(['sale_id', 'method', 'amount', 'status', 'paid_at', 'demo']);
      const saleOrder = lastContext.filteredSales
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((sale) => sale.id);
      saleOrder.forEach((saleId) => {
        const payments = lastContext.paymentsBySale.get(saleId) || [];
        payments.forEach((payment) => {
          rows.push([
            saleId,
            payment.method,
            Number(payment.amount).toFixed(2),
            payment.status,
            payment.paidAt ? new Date(payment.paidAt).toISOString() : '',
            'true',
          ]);
        });
      });
    } else {
      return;
    }

    const csvContent = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bipa-${type}-${dateToInputValue(new Date())}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  function pickWeighted(options) {
    if (!options || options.length === 0) return null;
    const normalized = options.map((option) => {
      if (Array.isArray(option)) {
        return { value: option[0], weight: Number(option[1] ?? 1) || 0 };
      }
      return { value: option.value, weight: Number(option.weight ?? 1) || 0 };
    });
    const totalWeight = normalized.reduce((sum, option) => sum + option.weight, 0);
    if (totalWeight <= 0) return normalized[0].value;
    let threshold = Math.random() * totalWeight;
    for (let index = 0; index < normalized.length; index += 1) {
      threshold -= normalized[index].weight;
      if (threshold <= 0) {
        return normalized[index].value;
      }
    }
    return normalized[normalized.length - 1].value;
  }

  function generateDemoReportsData() {
    const users = [
      { id: 'user-owner', name: 'Ana Gestora', role: 'owner' },
      { id: 'user-manager', name: 'Bruno Gerente', role: 'manager' },
      { id: 'user-clerk', name: 'Clara Vendedora', role: 'clerk' },
      { id: 'user-consultant', name: 'Diego Consultor', role: 'seller' },
    ];

    const customers = [
      { id: 'cust-001', name: 'Helena Rocha' },
      { id: 'cust-002', name: 'Marina Tavares' },
      { id: 'cust-003', name: 'Luiza Carvalho' },
      { id: 'cust-004', name: 'Juliana Furtado' },
      { id: 'cust-005', name: 'Camila Pereira' },
      { id: 'cust-006', name: 'Renata Gomes' },
      { id: 'cust-007', name: 'Laura Martins' },
      { id: 'cust-008', name: 'Patrícia Dias' },
      { id: 'cust-009', name: 'Fernanda Costa' },
      { id: 'cust-010', name: 'Marcela Prado' },
      { id: 'cust-011', name: 'Tatiana Azevedo' },
      { id: 'cust-012', name: 'Priscila Morais' },
    ];

    const products = [
      { id: 'prod-vest-001', code: 'VST-001', name: 'Vestido Midi Preto', category: 'Vestidos', size: 'M', color: 'Preto', costPrice: 98, price: 219 },
      { id: 'prod-vest-002', code: 'VST-002', name: 'Vestido Envelope Floral', category: 'Vestidos', size: 'M', color: 'Preto', costPrice: 102, price: 229 },
      { id: 'prod-vest-003', code: 'VST-003', name: 'Vestido Longo Azul', category: 'Vestidos', size: 'G', color: 'Azul', costPrice: 115, price: 249 },
      { id: 'prod-vest-004', code: 'VST-004', name: 'Vestido Curto Preto', category: 'Vestidos', size: 'P', color: 'Preto', costPrice: 90, price: 199 },
      { id: 'prod-blusa-001', code: 'BLS-101', name: 'Blusa Cetim Off', category: 'Blusas', size: 'M', color: 'Off White', costPrice: 52, price: 149 },
      { id: 'prod-calca-001', code: 'CAL-201', name: 'Calça Alfaiataria Preta', category: 'Calças', size: 'M', color: 'Preto', costPrice: 88, price: 219 },
      { id: 'prod-saia-001', code: 'SAI-301', name: 'Saia Midi Listrada', category: 'Saias', size: 'M', color: 'Marinho', costPrice: 64, price: 189 },
      { id: 'prod-short-001', code: 'SHT-401', name: 'Short Linho Areia', category: 'Shorts', size: 'M', color: 'Bege', costPrice: 48, price: 159 },
    ];

    const sellerWeights = [
      { value: users[1].id, weight: 2.5 },
      { value: users[2].id, weight: 3.5 },
      { value: users[3].id, weight: 2 },
      { value: users[0].id, weight: 0.5 },
    ];

    const channelWeights = [
      { value: 'in_store', weight: 0.55 },
      { value: 'whatsapp', weight: 0.3 },
      { value: 'link', weight: 0.15 },
    ];

    const paymentWeights = [
      { value: 'pix', weight: 0.65 },
      { value: 'card', weight: 0.25 },
      { value: 'cash', weight: 0.1 },
    ];

    const productWeights = products.map((product) => {
      let weight = 1;
      if (product.category === 'Vestidos') weight += 3;
      if (product.size === 'M') weight += 1;
      if (product.color === 'Preto') weight += 1;
      return { value: product, weight };
    });

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);
    baseDate.setDate(baseDate.getDate() - 29);

    const sales = [];
    const saleItems = [];
    const payments = [];
    let saleCounter = 1;

    const refundDays = new Set([6, 19]);

    const roundCurrency = (value) => Math.round(value * 100) / 100;

    for (let dayOffset = 0; dayOffset < 30; dayOffset += 1) {
      const currentDay = addDays(baseDate, dayOffset);
      const dayOfWeek = currentDay.getDay();
      let dailySales = 6 + Math.floor(Math.random() * 4);
      if (dayOfWeek === 6) dailySales = 12 + Math.floor(Math.random() * 5);
      if (dayOfWeek === 5) dailySales += 2;
      if (dayOfWeek === 0) dailySales = 4 + Math.floor(Math.random() * 3);

      for (let saleIndex = 0; saleIndex < dailySales; saleIndex += 1) {
        const saleId = `S${String(saleCounter).padStart(4, '0')}`;
        saleCounter += 1;

        const createdAt = new Date(currentDay);
        const baseHour = dayOfWeek === 6
          ? pickWeighted([
              { value: 11, weight: 1 },
              { value: 14, weight: 4 },
              { value: 16, weight: 3 },
              { value: 19, weight: 1 },
            ])
          : pickWeighted([
              { value: 10, weight: 1 },
              { value: 12, weight: 1.5 },
              { value: 15, weight: 2 },
              { value: 18, weight: 1.5 },
            ]);
        createdAt.setHours(
          Math.min(21, baseHour + Math.floor(Math.random() * 2)),
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60),
          0,
        );

        const sellerId = pickWeighted(sellerWeights);
        const channel = pickWeighted(channelWeights);
        const isRefund = refundDays.has(dayOffset) && saleIndex === 0;

        const customerId = !isRefund && Math.random() < 0.2 ? null : customers[Math.floor(Math.random() * customers.length)].id;

        let lineTotal = 0;
        const lineCount = isRefund ? 1 : 1 + Math.floor(Math.random() * 3);
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
          const product = pickWeighted(productWeights);
          const quantity = isRefund ? 1 : Math.random() < 0.2 ? 2 : 1;
          const variation = 1 + (Math.random() - 0.5) * 0.05;
          let price = roundCurrency(product.price * quantity * variation);
          if (isRefund) price *= -1;
          lineTotal += price;
          saleItems.push({
            id: `${saleId}-item-${lineIndex + 1}`,
            saleId,
            productId: product.id,
            unitPrice: roundCurrency(price),
            quantity,
          });
        }

        const discount = isRefund
          ? 0
          : Math.random() < 0.25
          ? roundCurrency(Math.abs(lineTotal) * pickWeighted([
              { value: 0.05, weight: 3 },
              { value: 0.1, weight: 1 },
            ]))
          : 0;

        const total = roundCurrency(lineTotal - discount);
        const isConsigned = !isRefund && Math.random() < 0.12;

        let saleStatus = 'paid';
        let paymentMethod = pickWeighted(paymentWeights);
        let paymentStatus = 'paid';

        if (!isRefund && Math.random() < 0.08) {
          saleStatus = 'pending';
          paymentMethod = 'pix';
          paymentStatus = 'pending';
        }

        const sale = {
          id: saleId,
          orgId: 'demo-org',
          createdAt: createdAt.toISOString(),
          status: saleStatus,
          channel,
          createdBy: sellerId,
          customerId,
          discountValue: roundCurrency(discount),
          total,
          isConsigned,
        };
        sales.push(sale);

        const paymentCreatedAt = createdAt.toISOString();
        let paidAt = null;
        if (paymentStatus === 'paid') {
          const paidDate = new Date(createdAt);
          const minutesOffset = paymentMethod === 'pix' ? Math.floor(Math.random() * 25) + 2 : Math.floor(Math.random() * 12) + 1;
          paidDate.setMinutes(paidDate.getMinutes() + minutesOffset);
          paidAt = paidDate.toISOString();
        }

        const paymentAmount = roundCurrency(total);
        payments.push({
          id: `${saleId}-pay-1`,
          saleId,
          method: paymentMethod,
          amount: paymentAmount,
          status: paymentStatus,
          createdAt: paymentCreatedAt,
          paidAt,
        });
      }
    }

    // Ensure a few PIX pendentes for conversão metric.
    payments.forEach((payment) => {
      if (payment.method === 'pix' && payment.status === 'pending' && Math.random() < 0.3) {
        const paidDate = new Date(payment.createdAt);
        paidDate.setMinutes(paidDate.getMinutes() + Math.floor(Math.random() * 40) + 5);
        payment.status = 'paid';
        payment.paidAt = paidDate.toISOString();
      }
    });

    // Guarantee at least two refunds impacting the líquido.
    const refundSales = sales.filter((sale) => sale.total < 0);
    if (refundSales.length < 2) {
      for (let index = refundSales.length; index < 2; index += 1) {
        const sale = sales[sales.length - 1 - index];
        if (!sale) break;
        sale.total = -Math.abs(sale.total || 180);
        sale.discountValue = 0;
        const relatedItems = saleItems.filter((item) => item.saleId === sale.id);
        relatedItems.forEach((item) => {
          item.unitPrice = -Math.abs(item.unitPrice);
        });
        const relatedPayments = payments.filter((payment) => payment.saleId === sale.id);
        relatedPayments.forEach((payment) => {
          payment.amount = sale.total;
          payment.status = 'paid';
          if (!payment.paidAt) payment.paidAt = payment.createdAt;
        });
      }
    }

    return { sales, saleItems, payments, products, users, customers };
  }
}

// --------- Login demo ---------
window.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'open-login') {
    window.alert('Fluxo de login não implementado nesta demonstração.');
  }
});
