const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
const currentPage = document.body.dataset.page;

if (currentPage) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.nav === currentPage;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

const tabs = Array.from(document.querySelectorAll('.tabs__button'));

if (tabs.length > 0) {
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
      if (!panel) return;
      panel.classList.toggle('is-active', key === tabName);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });
}

const currencyFormatterGlobal = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatCurrencyGlobal(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return currencyFormatterGlobal.format(0);
  return currencyFormatterGlobal.format(number);
}

let demoReportsData = null;

// --------- Venda em 3 toques ---------
const saleStepsElement = document.getElementById('sale-steps');
const saleNextButton = document.getElementById('sale-next');
const saleResetButton = document.getElementById('sale-reset');
const saleLogElement = document.getElementById('sale-log');

if (saleStepsElement && saleNextButton && saleResetButton && saleLogElement) {
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
}

// --------- Reserva temporária ---------
const reservationStatusChip = document.querySelector('#reservation-status .chip');
const reservationTimerElement = document.getElementById('reservation-timer');
const reservationButtons = Array.from(document.querySelectorAll('[data-reservation]'));

if (reservationStatusChip && reservationTimerElement) {
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
}

// --------- Self-checkout ---------
const selfCheckoutFlag = document.getElementById('self-checkout-flag');
const selfCheckoutFlow = document.getElementById('self-checkout-flow');
const selfCheckoutStatus = document.getElementById('self-checkout-status');
const checkoutScanButton = document.getElementById('checkout-scan');
const checkoutPayButton = document.getElementById('checkout-pay');
const checkoutValidateButton = document.getElementById('checkout-validate');
const checkoutPassBox = document.getElementById('checkout-pass');

if (
  selfCheckoutFlag &&
  selfCheckoutFlow &&
  selfCheckoutStatus &&
  checkoutScanButton &&
  checkoutPayButton &&
  checkoutValidateButton &&
  checkoutPassBox
) {
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
}

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

  demoReportsData = generateDemoReportsData();

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
      const closeMenu = () => {
        const details = menu.closest('details');
        if (details) details.open = false;
      };
      menu.addEventListener('click', (event) => {
        const target = event.target.closest('.chip-option');
        if (!target) return;
        const value = target.dataset.value;
        if (!value || reportState.filters[key] === value) {
          closeMenu();
          return;
        }
        reportState.filters[key] = value;
        updateFilterLabels();
        syncMenuState();
        closeMenu();
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

// --------- Workspace demo ---------
const workspaceElements = {
  root: document.getElementById('demo-workspace'),
  shell: document.querySelector('#demo-workspace .workspace__shell'),
  navButtons: Array.from(document.querySelectorAll('.workspace__nav-btn')),
  views: Array.from(document.querySelectorAll('.workspace-view')),
  productForm: document.getElementById('product-form'),
  productFormReset: document.getElementById('product-form-reset'),
  productFormFeedback: document.getElementById('product-form-feedback'),
  productCode: document.getElementById('product-code'),
  productList: document.getElementById('pdv-product-list'),
  cart: document.getElementById('pdv-cart'),
  ticketLabel: document.getElementById('pdv-ticket'),
  itemCount: document.getElementById('pdv-item-count'),
  discountDisplay: document.getElementById('pdv-discount'),
  total: document.getElementById('pdv-total'),
  log: document.getElementById('pdv-log'),
  discountPercent: document.getElementById('discount-percent'),
  discountValue: document.getElementById('discount-value'),
  discountClear: document.getElementById('discount-clear'),
  paymentRadios: Array.from(document.querySelectorAll('input[name="payment-method"]')),
  paymentSummary: document.getElementById('payment-summary'),
  inventoryCategory: document.getElementById('inventory-category'),
  inventoryStatus: document.getElementById('inventory-status'),
  inventoryList: document.getElementById('inventory-list'),
  inventoryActions: document.getElementById('inventory-actions'),
  customerSearch: document.getElementById('customers-search'),
  customerList: document.getElementById('customers-list'),
  customerDetails: document.getElementById('customer-details'),
  customerQuickForm: document.getElementById('customer-quick-form'),
  customerQuickFeedback: document.getElementById('customer-quick-feedback'),
  selfSession: document.getElementById('self-session'),
  selfLog: document.getElementById('self-log'),
  selfScanButton: document.querySelector('[data-action="self-scan"]'),
  selfValidateButton: document.querySelector('[data-action="self-validate"]'),
  selfExpireButton: document.querySelector('[data-action="self-expire"]'),
  kpis: document.getElementById('workspace-kpis'),
  highlights: document.getElementById('workspace-highlights'),
  paymentBreakdown: document.getElementById('payment-breakdown'),
};

const contactElements = {
  form: document.getElementById('contact-form'),
  feedback: document.getElementById('contact-feedback'),
};

const scannerElements = {
  root: document.getElementById('scanner-panel'),
  video: document.getElementById('scanner-video'),
  status: document.getElementById('scanner-status'),
  fallback: document.getElementById('scanner-fallback'),
  confirmButton: document.querySelector('[data-action="scanner-confirm"]'),
};

if (contactElements.form) {
  contactElements.form.reset();
}

const workspaceState = {
  initialized: false,
  view: 'productForm',
  products: [],
  inventory: [],
  customers: [],
  cart: [],
  discount: { percent: 0, value: 0 },
  pdvLog: [],
  paymentMethod: 'pix',
  inventorySelection: null,
  customerSelection: null,
  metrics: null,
  nextProductNumber: 1,
  nextCustomerNumber: 1,
  self: {
    stage: 'idle',
    product: null,
    passCode: null,
    expiresAt: null,
    timerId: null,
    log: [],
  },
  scanner: {
    mode: null,
    stream: null,
    timeoutId: null,
    product: null,
  },
};

if (workspaceElements.root) {
  workspaceElements.shell?.setAttribute('tabindex', '-1');
  workspaceElements.navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!button.dataset.view) return;
      setWorkspaceView(button.dataset.view);
    });
  });
  workspaceElements.productFormReset?.addEventListener('click', resetProductForm);
  workspaceElements.discountPercent?.addEventListener('input', (event) => {
    const value = Number(event.target.value);
    setDiscountPercent(Number.isFinite(value) ? value : 0);
  });
  workspaceElements.discountValue?.addEventListener('input', (event) => {
    const raw = (event.target.value || '').toString().replace(',', '.');
    const value = Number(raw);
    setDiscountValue(Number.isFinite(value) ? value : 0);
  });
  workspaceElements.discountClear?.addEventListener('click', () => {
    clearDiscount();
    syncDiscountInputs();
    renderCart();
  });
  workspaceElements.paymentRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        setPaymentMethod(radio.value);
      }
    });
  });
  workspaceElements.inventoryCategory?.addEventListener('change', () => renderInventoryList());
  workspaceElements.inventoryStatus?.addEventListener('change', () => renderInventoryList());
  workspaceElements.customerSearch?.addEventListener('input', (event) => {
    renderCustomersList(event.target.value || '');
  });

  document.addEventListener('click', handleActionClick);
  document.addEventListener('submit', handleSubmit);

  ensureWorkspaceInitialized();
  setWorkspaceView(workspaceState.view || 'productForm');
  updateProductFormCode();
  syncDiscountInputs();
  updatePaymentSummary();
  workspaceElements.paymentRadios.forEach((radio) => {
    radio.checked = radio.value === workspaceState.paymentMethod;
  });
  if (workspaceElements.productFormFeedback) {
    workspaceElements.productFormFeedback.textContent = '';
    workspaceElements.productFormFeedback.classList.remove('workspace-success');
  }
  if (workspaceElements.customerQuickFeedback) {
    workspaceElements.customerQuickFeedback.textContent = '';
    workspaceElements.customerQuickFeedback.classList.remove('workspace-success');
  }
}

if (scannerElements.root) {
  scannerElements.root.setAttribute('tabindex', '-1');
}

function handleActionClick(event) {
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;

  switch (action) {
    case 'pdv-scan':
      openScanner('pdv');
      break;
    case 'pdv-discount':
      applyPdvDiscount();
      break;
    case 'pdv-checkout':
      completePdvCheckout();
      break;
    case 'pdv-add':
      if (actionTarget.dataset.productId) addProductToCart(actionTarget.dataset.productId);
      break;
    case 'pdv-remove':
      if (actionTarget.dataset.productId) removeProductFromCart(actionTarget.dataset.productId);
      break;
    case 'inventory-select':
      if (actionTarget.dataset.productId) selectInventoryItem(actionTarget.dataset.productId);
      break;
    case 'inventory-reserve':
      updateInventoryStatus('reserved');
      break;
    case 'inventory-release':
      updateInventoryStatus('available');
      break;
    case 'inventory-sell':
      updateInventoryStatus('sold');
      break;
    case 'inventory-restock':
      updateInventoryStatus('available');
      break;
    case 'inventory-highlight':
      highlightInventoryItem();
      break;
    case 'customer-select':
      if (actionTarget.dataset.customerId) selectCustomer(actionTarget.dataset.customerId);
      break;
    case 'customer-receipt':
      sendCustomerReceipt();
      break;
    case 'customer-hold':
      holdCustomerItem();
      break;
    case 'self-scan':
      openScanner('self');
      break;
    case 'self-pay':
      confirmSelfPayment();
      break;
    case 'self-validate':
      validateSelfPass();
      break;
    case 'self-expire':
      expireSelfPass(true);
      break;
    case 'scanner-hide':
      closeScanner();
      break;
    case 'scanner-trigger':
      simulateScannerDetection(true);
      break;
    case 'scanner-confirm':
      confirmScannerSelection();
      break;
    default:
      break;
  }
}

function handleSubmit(event) {
  if (event.target === contactElements.form) {
    event.preventDefault();
    handleContactSubmit();
    return;
  }
  if (event.target === workspaceElements.productForm) {
    event.preventDefault();
    handleProductFormSubmit();
    return;
  }
  if (event.target === workspaceElements.customerQuickForm) {
    event.preventDefault();
    handleQuickCustomerSubmit();
  }
}

function formatInternalProductCode(sequence) {
  const number = Math.max(1, Number(sequence) || 1);
  return `BR-${String(number).padStart(4, '0')}`;
}

function updateProductFormCode() {
  if (!workspaceElements.productCode) return;
  workspaceElements.productCode.textContent = formatInternalProductCode(workspaceState.nextProductNumber || 1);
}

function resetProductForm() {
  if (!workspaceElements.productForm) return;
  workspaceElements.productForm.reset();
  if (workspaceElements.productFormFeedback) {
    workspaceElements.productFormFeedback.textContent = '';
    workspaceElements.productFormFeedback.classList.remove('workspace-success');
  }
  updateProductFormCode();
}

function handleProductFormSubmit() {
  if (!workspaceElements.productForm) return;
  const formData = new FormData(workspaceElements.productForm);
  const name = (formData.get('name') || '').toString().trim();
  const category = (formData.get('category') || '').toString();
  const size = (formData.get('size') || '').toString();
  const color = (formData.get('color') || '').toString();
  const gender = (formData.get('gender') || '').toString();
  const condition = (formData.get('condition') || '').toString();
  const origin = (formData.get('origin') || '').toString();
  const status = (formData.get('status') || 'available').toString();

  const parseNumericInput = (value) => {
    if (value === null || value === undefined) return NaN;
    return Number(value.toString().replace(',', '.'));
  };

  const price = parseNumericInput(formData.get('price'));
  const costPriceValue = parseNumericInput(formData.get('costPrice'));
  const costPrice = Number.isFinite(costPriceValue) && costPriceValue > 0 ? costPriceValue : null;

  if (!name || !category || !size || !color || !gender || !condition || !origin || !Number.isFinite(price) || price <= 0) {
    if (workspaceElements.productFormFeedback) {
      workspaceElements.productFormFeedback.textContent = 'Preencha todos os campos obrigatórios para salvar a peça.';
      workspaceElements.productFormFeedback.classList.remove('workspace-success');
    }
    return;
  }

  const code = formatInternalProductCode(workspaceState.nextProductNumber || 1);
  workspaceState.nextProductNumber += 1;

  const product = {
    id: `demo-prod-${Date.now()}`,
    code,
    name,
    category,
    size,
    color,
    gender,
    condition,
    price,
    costPrice,
    origin,
    status,
    quantity: 1,
  };

  workspaceState.inventory.unshift(product);
  workspaceState.products = workspaceState.inventory;
  workspaceState.inventorySelection = product.id;

  if (workspaceState.metrics) {
    workspaceState.metrics.availableCount = workspaceState.inventory.filter((item) => item.status === 'available').length;
    workspaceState.metrics.productTotals.set(product.id, { name: product.name, qty: 0 });
    renderWorkspaceKpis();
    renderWorkspaceHighlights();
    renderPaymentBreakdown();
  }

  addPdvLog(`Peça ${product.code} cadastrada no estoque.`);

  if (workspaceElements.productFormFeedback) {
    workspaceElements.productFormFeedback.classList.add('workspace-success');
    workspaceElements.productFormFeedback.textContent = `Produto ${product.code} pronto para o catálogo e PDV.`;
  }

  workspaceElements.productForm.reset();
  updateProductFormCode();
  renderInventoryFilters();
  renderInventoryList();
  renderInventoryActions();
  renderProductList();
}

function handleQuickCustomerSubmit() {
  if (!workspaceElements.customerQuickForm) return;
  const formData = new FormData(workspaceElements.customerQuickForm);
  const name = (formData.get('quick-name') || '').toString().trim();
  const phone = (formData.get('quick-phone') || '').toString().trim();
  const tag = (formData.get('quick-tag') || '').toString().trim();
  if (!name || !phone) {
    if (workspaceElements.customerQuickFeedback) {
      workspaceElements.customerQuickFeedback.textContent = 'Informe nome e WhatsApp para cadastrar o cliente.';
      workspaceElements.customerQuickFeedback.classList.remove('workspace-success');
    }
    return;
  }

  const id = `demo-cust-${Date.now()}`;
  const customer = {
    id,
    name,
    phone,
    tag: tag || 'Cliente',
    total: 0,
    orders: 0,
  };

  workspaceState.customers.unshift(customer);
  workspaceState.customerSelection = id;

  if (workspaceState.metrics) {
    workspaceState.metrics.customerTotals.set(id, { name: customer.name, total: 0, count: 0 });
  }

  if (workspaceElements.customerSearch) {
    workspaceElements.customerSearch.value = '';
  }

  renderCustomersList('');
  renderCustomerDetails(customer);

  if (workspaceElements.customerQuickFeedback) {
    workspaceElements.customerQuickFeedback.classList.add('workspace-success');
    workspaceElements.customerQuickFeedback.textContent = `${customer.name} cadastrado e selecionado.`;
  }

  workspaceElements.customerQuickForm.reset();
  addPdvLog(`Cliente ${customer.name} entrou na base com tag ${customer.tag}.`);
}

function ensureWorkspaceInitialized() {
  ensureDemoDataset();
  if (workspaceState.initialized) return;
  initializeWorkspace();
}

function ensureDemoDataset() {
  if (demoReportsData) return;
  demoReportsData = {
    products: [
      {
        id: 'demo-prod-1',
        code: 'BR-0001',
        name: 'Vestido envelope floral',
        category: 'Vestido',
        size: 'M',
        color: 'Floral',
        gender: 'Feminino',
        condition: 'Seminovo',
        price: 219,
        costPrice: 92,
        origin: 'Consignado',
        status: 'available',
      },
      {
        id: 'demo-prod-2',
        code: 'BR-0002',
        name: 'Camisa linho areia',
        category: 'Blusa',
        size: 'G',
        color: 'Areia',
        gender: 'Unissex',
        condition: 'Premium',
        price: 159,
        costPrice: 65,
        origin: 'Estoque próprio',
        status: 'available',
      },
      {
        id: 'demo-prod-3',
        code: 'BR-0003',
        name: 'Calça mom jeans',
        category: 'Calça',
        size: '38',
        color: 'Azul',
        gender: 'Feminino',
        condition: 'Seminovo',
        price: 189,
        costPrice: 78,
        origin: 'Consignado',
        status: 'reserved',
      },
      {
        id: 'demo-prod-4',
        code: 'BR-0004',
        name: 'Saia midi plissada',
        category: 'Saia',
        size: 'M',
        color: 'Vinho',
        gender: 'Feminino',
        condition: 'Novo',
        price: 199,
        costPrice: 110,
        origin: 'Estoque próprio',
        status: 'available',
      },
      {
        id: 'demo-prod-5',
        code: 'BR-0005',
        name: 'Blazer alfaiataria preto',
        category: 'Casaco',
        size: 'M',
        color: 'Preto',
        gender: 'Feminino',
        condition: 'Premium',
        price: 289,
        costPrice: 130,
        origin: 'Consignado',
        status: 'sold',
      },
      {
        id: 'demo-prod-6',
        code: 'BR-0006',
        name: 'Body canelado manga longa',
        category: 'Blusa',
        size: 'P',
        color: 'Preto',
        gender: 'Feminino',
        condition: 'Novo',
        price: 129,
        costPrice: 48,
        origin: 'Estoque próprio',
        status: 'available',
      },
      {
        id: 'demo-prod-7',
        code: 'BR-0007',
        name: 'Macacão pantacourt terracota',
        category: 'Vestido',
        size: 'G',
        color: 'Terracota',
        gender: 'Feminino',
        condition: 'Seminovo',
        price: 239,
        costPrice: 95,
        origin: 'Doação',
        status: 'available',
      },
      {
        id: 'demo-prod-8',
        code: 'BR-0008',
        name: 'Bolsa tiracolo caramelo',
        category: 'Acessório',
        size: 'Único',
        color: 'Caramelo',
        gender: 'Feminino',
        condition: 'Seminovo',
        price: 149,
        costPrice: 40,
        origin: 'Consignado',
        status: 'reserved',
      },
    ],
    users: [
      { id: 'demo-user-1', name: 'Bianca Dona' },
      { id: 'demo-user-2', name: 'Lia Caixa' },
    ],
    customers: [
      { id: 'demo-cust-1', name: 'Juliana Demo', phone: '(11) 98888-0001', tag: 'VIP' },
      { id: 'demo-cust-2', name: 'Carlos Demo', phone: '(11) 97777-0002', tag: 'Consignado' },
      { id: 'demo-cust-3', name: 'Patrícia Luz', phone: '(11) 96666-0003', tag: 'Amiga da dona' },
    ],
    sales: [
      {
        id: 'sale-001',
        status: 'paid',
        createdBy: 'demo-user-2',
        customerId: 'demo-cust-1',
        total: 219,
        discountValue: 19.9,
        paymentMethod: 'pix',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sale-002',
        status: 'paid',
        createdBy: 'demo-user-2',
        customerId: 'demo-cust-2',
        total: 289,
        discountValue: 0,
        paymentMethod: 'card',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sale-003',
        status: 'paid',
        createdBy: 'demo-user-1',
        customerId: null,
        total: 159,
        discountValue: 10,
        paymentMethod: 'cash',
        createdAt: new Date().toISOString(),
      },
    ],
    saleItems: [
      { id: 'sale-001-item-1', saleId: 'sale-001', productId: 'demo-prod-1', unitPrice: 219, quantity: 1 },
      { id: 'sale-002-item-1', saleId: 'sale-002', productId: 'demo-prod-5', unitPrice: 289, quantity: 1 },
      { id: 'sale-003-item-1', saleId: 'sale-003', productId: 'demo-prod-2', unitPrice: 159, quantity: 1 },
    ],
    payments: [
      { id: 'pay-001', saleId: 'sale-001', method: 'pix', amount: 219, status: 'paid', createdAt: new Date().toISOString() },
      { id: 'pay-002', saleId: 'sale-002', method: 'card', amount: 289, status: 'paid', createdAt: new Date().toISOString() },
      { id: 'pay-003', saleId: 'sale-003', method: 'cash', amount: 159, status: 'paid', createdAt: new Date().toISOString() },
    ],
  };
}

function initializeWorkspace() {
  const baseProducts = demoReportsData?.products || [];

  workspaceState.inventory = (baseProducts.length > 0
    ? baseProducts
    : [
        {
          id: 'fallback-prod',
          code: 'BR-0001',
          name: 'Peça Demo',
          category: 'Acervo',
          size: 'U',
          color: 'Sortido',
          gender: 'Feminino',
          condition: 'Seminovo',
          price: 199,
          costPrice: 80,
          origin: 'Consignado',
          status: 'available',
        },
      ]
  ).map((product) => ({
    id: product.id,
    code: product.code,
    name: product.name,
    category: product.category || 'Acervo',
    size: product.size || 'U',
    color: product.color || 'Sortido',
    gender: product.gender || 'Feminino',
    condition: product.condition || 'Seminovo',
    price: product.price ?? 199,
    costPrice: product.costPrice ?? null,
    origin: product.origin || 'Consignado',
    status: product.status || 'available',
    quantity: 1,
  }));

  workspaceState.products = workspaceState.inventory;

  workspaceState.nextProductNumber = workspaceState.inventory.reduce((max, product) => {
    const match = /BR-(\d+)/.exec(product.code || '');
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0);
  workspaceState.nextProductNumber += 1;

  const paidSales = (demoReportsData.sales || []).filter((sale) => sale.status === 'paid');
  const totalRevenue = paidSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const salesCount = paidSales.length;
  const averageTicket = salesCount ? totalRevenue / salesCount : 0;

  const productTotals = new Map();
  (demoReportsData.saleItems || []).forEach((item) => {
    const product = workspaceState.inventory.find((entry) => entry.id === item.productId);
    if (!product) return;
    const entry = productTotals.get(product.id) || { name: product.name, qty: 0 };
    entry.qty += Math.abs(item.quantity ?? 1);
    productTotals.set(product.id, entry);
  });

  const sellerTotals = new Map();
  paidSales.forEach((sale) => {
    const seller = (demoReportsData.users || []).find((user) => user.id === sale.createdBy);
    const name = seller ? seller.name : 'Equipe DEMO';
    const key = sale.createdBy || 'demo';
    const entry = sellerTotals.get(key) || { name, total: 0 };
    entry.total += sale.total || 0;
    sellerTotals.set(key, entry);
  });

  const customerTotals = new Map();
  paidSales.forEach((sale) => {
    const key = sale.customerId || 'walkin';
    const customer = (demoReportsData.customers || []).find((entry) => entry.id === sale.customerId);
    const name = customer ? customer.name : 'Cliente avulso';
    const entry = customerTotals.get(key) || { name, total: 0, count: 0 };
    entry.total += sale.total || 0;
    entry.count += 1;
    customerTotals.set(key, entry);
  });

  const paymentCounts = { pix: 0, card: 0, cash: 0, fiado: 0 };
  const paymentTotals = { pix: 0, card: 0, cash: 0, fiado: 0 };
  (demoReportsData.payments || []).forEach((payment) => {
    if (payment.status !== 'paid') return;
    const method = payment.method || 'other';
    if (paymentCounts[method] === undefined) {
      paymentCounts[method] = 0;
      paymentTotals[method] = 0;
    }
    paymentCounts[method] += 1;
    paymentTotals[method] += Number(payment.amount) || 0;
  });

  workspaceState.customers = (demoReportsData.customers || []).map((customer) => {
    const stats = customerTotals.get(customer.id) || { total: 0, count: 0 };
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone || customer.whatsapp || '(00) 00000-0000',
      tag: customer.tag || 'Cliente',
      total: stats.total,
      orders: stats.count,
    };
  });

  if (workspaceState.customers.length === 0) {
    workspaceState.customers = [
      { id: 'demo-cust-fallback', name: 'Cliente Demo', phone: '(11) 90000-0000', tag: 'VIP', total: 0, orders: 0 },
    ];
  }

  workspaceState.nextCustomerNumber = workspaceState.customers.length + 1;

  workspaceState.metrics = {
    totalRevenue,
    salesCount,
    averageTicket,
    availableCount: workspaceState.inventory.filter((item) => item.status === 'available').length,
    productTotals,
    sellerTotals,
    customerTotals,
    paymentCounts,
    paymentTotals,
  };

  workspaceState.cart = [];
  workspaceState.discount = { percent: 0, value: 0 };
  workspaceState.paymentMethod = 'pix';
  workspaceState.pdvLog = [];
  workspaceState.inventorySelection = null;
  workspaceState.customerSelection = null;
  workspaceState.initialized = true;

  renderProductList();
  renderCart();
  renderInventoryFilters();
  renderInventoryList();
  renderInventoryActions();
  renderCustomersList('');
  renderCustomerDetails(null);
  resetSelfSession();
  renderWorkspaceKpis();
  renderWorkspaceHighlights();
  renderPaymentBreakdown();
  updateTicketLabel();
}

function renderProductList() {
  if (!workspaceElements.productList) return;
  const availableProducts = workspaceState.inventory.filter((product) => product.status === 'available');
  if (availableProducts.length === 0) {
    workspaceElements.productList.innerHTML = '<li class="workspace-empty">Nenhuma peça disponível. Cadastre uma nova peça para vender.</li>';
    return;
  }

  workspaceElements.productList.innerHTML = availableProducts
    .map(
      (product) => `
        <li>
          <button type="button" class="workspace-item" data-action="pdv-add" data-product-id="${product.id}">
            <div class="workspace-item__info">
              <strong>${product.name}</strong>
              <span>${product.code} • ${product.category} • Tam. ${product.size}</span>
            </div>
            <span class="workspace-item__price">${formatCurrencyGlobal(product.price)}</span>
          </button>
        </li>
      `,
    )
    .join('');
}

function addProductToCart(productId) {
  const product = workspaceState.inventory.find((item) => item.id === productId);
  if (!product) return;
  if (product.status !== 'available') {
    addPdvLog(`Peça ${product.code} não está disponível para venda.`);
    return;
  }
  const existing = workspaceState.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    workspaceState.cart.push({
      id: product.id,
      name: product.name,
      code: product.code,
      price: product.price,
      quantity: 1,
    });
  }
  addPdvLog(`Peça ${product.code} adicionada ao carrinho.`);
  renderCart();
}

function removeProductFromCart(productId) {
  const index = workspaceState.cart.findIndex((item) => item.id === productId);
  if (index === -1) return;
  const [removed] = workspaceState.cart.splice(index, 1);
  addPdvLog(`Peça ${removed.code} removida do carrinho.`);
  renderCart();
}

function renderCart() {
  if (!workspaceElements.cart) return;
  if (workspaceState.cart.length === 0) {
    workspaceElements.cart.innerHTML = '<p class="workspace-empty">Nenhum item. Escaneie para começar.</p>';
  } else {
    workspaceElements.cart.innerHTML = workspaceState.cart
      .map(
        (item) => `
          <div class="workspace-cart__item">
            <div>
              <strong>${item.name}</strong>
              <span>${item.code}</span>
            </div>
            <div class="workspace-cart__item-meta">
              <span>${item.quantity} un.</span>
              <strong>${formatCurrencyGlobal(item.price * item.quantity)}</strong>
              <button type="button" class="workspace-remove" data-action="pdv-remove" data-product-id="${item.id}" aria-label="Remover ${item.name}">&times;</button>
            </div>
          </div>
        `,
      )
      .join('');
  }

  const itemCount = workspaceState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = workspaceState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountState = workspaceState.discount || { percent: 0, value: 0 };
  const percentDiscount = subtotal * (Math.max(0, Math.min(100, discountState.percent)) / 100);
  const fixedDiscount = Math.max(0, discountState.value);
  const totalDiscount = Math.min(subtotal, percentDiscount + fixedDiscount);
  const total = Math.max(0, subtotal - totalDiscount);

  if (workspaceElements.itemCount) workspaceElements.itemCount.textContent = String(itemCount);
  if (workspaceElements.discountDisplay) {
    workspaceElements.discountDisplay.textContent = formatCurrencyGlobal(totalDiscount);
  }
  if (workspaceElements.total) {
    workspaceElements.total.textContent = formatCurrencyGlobal(total);
  }
}

function addPdvLog(message) {
  workspaceState.pdvLog.unshift({ message, timestamp: Date.now() });
  workspaceState.pdvLog = workspaceState.pdvLog.slice(0, 4);
  if (!workspaceElements.log) return;
  workspaceElements.log.innerHTML = workspaceState.pdvLog
    .map((entry) => `<p>${entry.message}</p>`)
    .join('');
}

function applyPdvDiscount() {
  if (workspaceState.cart.length === 0) {
    addPdvLog('Adicione itens antes de aplicar desconto.');
    return;
  }
  setDiscountPercent(10);
  addPdvLog('Desconto promocional de 10% aplicado.');
  syncDiscountInputs();
  renderCart();
}

function completePdvCheckout() {
  if (workspaceState.cart.length === 0) {
    addPdvLog('Carrinho vazio. Escaneie uma peça primeiro.');
    return;
  }
  const subtotal = workspaceState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountState = workspaceState.discount || { percent: 0, value: 0 };
  const percentDiscount = subtotal * (Math.max(0, Math.min(100, discountState.percent)) / 100);
  const fixedDiscount = Math.max(0, discountState.value);
  const totalDiscount = Math.min(subtotal, percentDiscount + fixedDiscount);
  const total = Math.max(0, subtotal - totalDiscount);
  const customer = workspaceState.customerSelection
    ? workspaceState.customers.find((item) => item.id === workspaceState.customerSelection)
    : null;
  const customerName = customer ? customer.name : 'Cliente walk-in';
  const paymentMethod = workspaceState.paymentMethod || 'pix';
  const paymentLabel = getPaymentLabel(paymentMethod);

  addPdvLog(`${paymentLabel} confirmado para ${customerName}. Total ${formatCurrencyGlobal(total)}.`);
  updateMetricsAfterSale(total, workspaceState.cart, customer, paymentMethod);

  workspaceState.cart = [];
  clearDiscount();
  syncDiscountInputs();
  renderCart();
}

function updateMetricsAfterSale(total, cartItems, customer, paymentMethod) {
  if (!workspaceState.metrics) return;
  workspaceState.metrics.totalRevenue += total;
  workspaceState.metrics.salesCount += 1;
  workspaceState.metrics.averageTicket = workspaceState.metrics.salesCount
    ? workspaceState.metrics.totalRevenue / workspaceState.metrics.salesCount
    : 0;

  if (workspaceState.metrics.paymentCounts[paymentMethod] === undefined) {
    workspaceState.metrics.paymentCounts[paymentMethod] = 0;
    workspaceState.metrics.paymentTotals[paymentMethod] = 0;
  }
  workspaceState.metrics.paymentCounts[paymentMethod] += 1;
  workspaceState.metrics.paymentTotals[paymentMethod] += total;

  cartItems.forEach((item) => {
    const entry = workspaceState.metrics.productTotals.get(item.id) || { name: item.name, qty: 0 };
    entry.qty += item.quantity;
    workspaceState.metrics.productTotals.set(item.id, entry);

    const inventoryItem = workspaceState.inventory.find((product) => product.id === item.id);
    if (inventoryItem) {
      inventoryItem.status = 'sold';
    }
  });

  workspaceState.metrics.availableCount = workspaceState.inventory.filter((item) => item.status === 'available').length;

  if (customer) {
    const entry = workspaceState.metrics.customerTotals.get(customer.id) || { name: customer.name, total: 0, count: 0 };
    entry.total += total;
    entry.count += 1;
    workspaceState.metrics.customerTotals.set(customer.id, entry);
    customer.total = entry.total;
    customer.orders = entry.count;
  } else {
    const walkin = workspaceState.metrics.customerTotals.get('walkin') || { name: 'Cliente avulso', total: 0, count: 0 };
    walkin.total += total;
    walkin.count += 1;
    workspaceState.metrics.customerTotals.set('walkin', walkin);
  }

  renderWorkspaceKpis();
  renderWorkspaceHighlights();
  renderPaymentBreakdown();
  updateTicketLabel();
  renderCustomersList(workspaceElements.customerSearch?.value || '');
  renderCustomerDetails(customer || null);
  renderInventoryList();
  renderInventoryActions();
  renderProductList();
}

function setDiscountPercent(value) {
  const normalized = Math.min(100, Math.max(0, Number(value) || 0));
  workspaceState.discount.percent = normalized;
  syncDiscountInputs();
  renderCart();
}

function setDiscountValue(value) {
  const normalized = Math.max(0, Number(value) || 0);
  workspaceState.discount.value = normalized;
  syncDiscountInputs();
  renderCart();
}

function clearDiscount() {
  workspaceState.discount.percent = 0;
  workspaceState.discount.value = 0;
}

function syncDiscountInputs() {
  if (workspaceElements.discountPercent) {
    workspaceElements.discountPercent.value = String(workspaceState.discount.percent ?? 0);
  }
  if (workspaceElements.discountValue) {
    workspaceElements.discountValue.value = String(workspaceState.discount.value ?? 0);
  }
}

function setPaymentMethod(method) {
  workspaceState.paymentMethod = method;
  updatePaymentSummary();
}

function getPaymentLabel(method) {
  const map = {
    pix: 'PIX',
    cash: 'Pagamento em dinheiro',
    card: 'Cartão aprovado',
    fiado: 'Fiado registrado',
  };
  return map[method] || 'Pagamento';
}

function updatePaymentSummary() {
  if (!workspaceElements.paymentSummary) return;
  const map = {
    pix: 'Recebe via PIX com confirmação instantânea.',
    cash: 'Registre o recebimento em dinheiro e feche o caixa depois.',
    card: 'Lance a venda no POS e marque como pago aqui.',
    fiado: 'Venda fiado registrada — acompanhe depois no relatório.',
  };
  workspaceElements.paymentSummary.textContent = map[workspaceState.paymentMethod] || 'Defina a forma de pagamento para registrar a venda.';
}

function renderPaymentBreakdown() {
  if (!workspaceElements.paymentBreakdown || !workspaceState.metrics) return;
  const entries = Object.entries(workspaceState.metrics.paymentCounts);
  if (entries.length === 0) {
    workspaceElements.paymentBreakdown.innerHTML = '<li class="workspace-empty">Nenhum pagamento registrado hoje.</li>';
    return;
  }

  workspaceElements.paymentBreakdown.innerHTML = entries
    .filter(([, count]) => count > 0)
    .map(([method, count]) => {
      const total = workspaceState.metrics.paymentTotals[method] || 0;
      return `
        <li>
          <div class="workspace-payment__summary">
            <strong>${getPaymentLabel(method).replace('registrado', '').trim()}</strong>
            <span>${count}× • ${formatCurrencyGlobal(total)}</span>
          </div>
        </li>
      `;
    })
    .join('');

  if (!workspaceElements.paymentBreakdown.innerHTML) {
    workspaceElements.paymentBreakdown.innerHTML = '<li class="workspace-empty">Nenhum pagamento registrado hoje.</li>';
  }
}

function updateTicketLabel() {
  if (!workspaceElements.ticketLabel || !workspaceState.metrics) return;
  workspaceElements.ticketLabel.textContent = `Ticket médio: ${formatCurrencyGlobal(workspaceState.metrics.averageTicket)}`;
}

function renderInventoryFilters() {
  if (!workspaceElements.inventoryCategory) return;
  const categories = Array.from(new Set(workspaceState.inventory.map((product) => product.category))).filter(Boolean);
  workspaceElements.inventoryCategory.innerHTML = ['<option value="all">Todas</option>']
    .concat(categories.map((category) => `<option value="${category}">${category}</option>`))
    .join('');
  workspaceElements.inventoryCategory.value = 'all';
  if (workspaceElements.inventoryStatus) workspaceElements.inventoryStatus.value = 'all';
}

function renderInventoryList() {
  if (!workspaceElements.inventoryList) return;
  const categoryFilter = workspaceElements.inventoryCategory?.value || 'all';
  const statusFilter = workspaceElements.inventoryStatus?.value || 'all';

  const filtered = workspaceState.inventory.filter((item) => {
    const categoryOk = categoryFilter === 'all' || item.category === categoryFilter;
    const statusOk = statusFilter === 'all' || item.status === statusFilter;
    return categoryOk && statusOk;
  });

  if (filtered.length === 0) {
    workspaceElements.inventoryList.innerHTML = '<li class="workspace-empty">Nenhuma peça encontrada.</li>';
  } else {
    workspaceElements.inventoryList.innerHTML = filtered
      .map((item) => {
        const isSelected = workspaceState.inventorySelection === item.id;
        return `
          <li>
            <button type="button" class="workspace-item${isSelected ? ' is-selected' : ''}" data-action="inventory-select" data-product-id="${item.id}">
              <div class="workspace-item__info">
                <strong>${item.name}</strong>
                <span>${item.code} • ${item.category} • Tam. ${item.size}</span>
              </div>
              <span class="workspace-status workspace-status--${item.status}">${formatInventoryStatus(item.status)}</span>
            </button>
          </li>
        `;
      })
      .join('');
  }

  if (workspaceState.metrics) {
    workspaceState.metrics.availableCount = workspaceState.inventory.filter((item) => item.status === 'available').length;
    renderWorkspaceKpis();
  }
}

function selectInventoryItem(productId) {
  if (!productId) return;
  workspaceState.inventorySelection = productId;
  renderInventoryList();
  renderInventoryActions();
}

function renderInventoryActions() {
  if (!workspaceElements.inventoryActions) return;
  if (!workspaceState.inventorySelection) {
    workspaceElements.inventoryActions.innerHTML = '<p>Selecione uma peça para simular as ações.</p>';
    return;
  }
  const item = workspaceState.inventory.find((entry) => entry.id === workspaceState.inventorySelection);
  if (!item) {
    workspaceElements.inventoryActions.innerHTML = '<p>Peça não encontrada.</p>';
    return;
  }

  const buttons = [];
  if (item.status !== 'reserved') buttons.push('<button type="button" class="btn btn--ghost btn--small" data-action="inventory-reserve">Reservar 30 min</button>');
  if (item.status === 'reserved') buttons.push('<button type="button" class="btn btn--ghost btn--small" data-action="inventory-release">Liberar</button>');
  if (item.status !== 'sold') buttons.push('<button type="button" class="btn btn--primary btn--small" data-action="inventory-sell">Marcar como vendida</button>');
  if (item.status === 'sold') buttons.push('<button type="button" class="btn btn--ghost btn--small" data-action="inventory-restock">Devolver ao estoque</button>');
  buttons.push('<button type="button" class="btn btn--ghost btn--small" data-action="inventory-highlight">Destacar no catálogo</button>');

  workspaceElements.inventoryActions.innerHTML = `
    <div class="workspace-actions__card">
      <h4>${item.name}</h4>
      <p>${item.code} • Tam. ${item.size} • ${formatCurrencyGlobal(item.price)}</p>
      <p>Origem: <strong>${item.origin}</strong> • Condição: <strong>${item.condition}</strong></p>
      <p>Status atual: <strong>${formatInventoryStatus(item.status)}</strong></p>
      <div class="workspace-actions__buttons">
        ${buttons.join('')}
      </div>
    </div>
  `;
}

function updateInventoryStatus(status) {
  if (!workspaceState.inventorySelection) return;
  const item = workspaceState.inventory.find((entry) => entry.id === workspaceState.inventorySelection);
  if (!item) return;
  item.status = status;
  addPdvLog(`Peça ${item.code} agora está ${formatInventoryStatus(status).toLowerCase()}.`);
  renderInventoryList();
  renderInventoryActions();
  if (workspaceState.metrics) {
    workspaceState.metrics.availableCount = workspaceState.inventory.filter((entry) => entry.status === 'available').length;
    renderWorkspaceKpis();
  }
  renderProductList();
}

function highlightInventoryItem() {
  if (!workspaceState.inventorySelection) return;
  const item = workspaceState.inventory.find((entry) => entry.id === workspaceState.inventorySelection);
  if (!item) return;
  addPdvLog(`Peça ${item.code} destacada no catálogo público.`);
}

function formatInventoryStatus(status) {
  const map = {
    available: 'Disponível',
    reserved: 'Reservada',
    sold: 'Vendida',
  };
  return map[status] || status;
}

function renderCustomersList(query) {
  if (!workspaceElements.customerList) return;
  const normalized = (query || '').trim().toLowerCase();
  const filtered = workspaceState.customers.filter((customer) => {
    if (!normalized) return true;
    return customer.name.toLowerCase().includes(normalized) || customer.phone.toLowerCase().includes(normalized);
  });

  if (filtered.length === 0) {
    workspaceElements.customerList.innerHTML = '<li class="workspace-empty">Nenhum cliente encontrado.</li>';
    return;
  }

  workspaceElements.customerList.innerHTML = filtered
    .map((customer) => {
      const isSelected = workspaceState.customerSelection === customer.id;
      return `
        <li>
          <button type="button" class="workspace-item${isSelected ? ' is-selected' : ''}" data-action="customer-select" data-customer-id="${customer.id}">
            <div class="workspace-item__info">
              <strong>${customer.name}</strong>
              <span>${customer.phone} • ${customer.tag || 'Cliente'}</span>
            </div>
            <span class="workspace-item__badge">${customer.orders || 0} pedidos</span>
          </button>
        </li>
      `;
    })
    .join('');
}

function selectCustomer(customerId) {
  workspaceState.customerSelection = customerId;
  renderCustomersList(workspaceElements.customerSearch?.value || '');
  const customer = workspaceState.customers.find((entry) => entry.id === customerId) || null;
  renderCustomerDetails(customer);
}

function renderCustomerDetails(customer) {
  if (!workspaceElements.customerDetails) return;
  if (!customer) {
    workspaceElements.customerDetails.innerHTML = '<p>Escolha um cliente para disparar recibo ou reservar peças.</p>';
    return;
  }

  workspaceElements.customerDetails.innerHTML = `
    <div class="workspace-customer__header">
      <strong>${customer.name}</strong>
      <span>${customer.phone}</span>
    </div>
    <p>Tag: <strong>${customer.tag || 'Cliente'}</strong></p>
    <p>Pedidos: <strong>${customer.orders || 0}</strong> • Total: <strong>${formatCurrencyGlobal(customer.total || 0)}</strong></p>
    <div class="workspace-cart__actions">
      <button type="button" class="btn btn--ghost btn--small" data-action="customer-receipt">Enviar recibo</button>
      <button type="button" class="btn btn--ghost btn--small" data-action="customer-hold">Reservar peça</button>
    </div>
    <p class="workspace-note">Cliente selecionado será usado na próxima venda.</p>
    <div class="workspace-customer__feedback"></div>
  `;
}

function showCustomerFeedback(message) {
  if (!workspaceElements.customerDetails) return;
  const container = workspaceElements.customerDetails.querySelector('.workspace-customer__feedback');
  if (!container) return;
  container.textContent = message;
}

function sendCustomerReceipt() {
  if (!workspaceState.customerSelection) {
    addPdvLog('Selecione um cliente para enviar o recibo.');
    return;
  }
  const customer = workspaceState.customers.find((entry) => entry.id === workspaceState.customerSelection);
  if (!customer) return;
  addPdvLog(`Recibo enviado para ${customer.name} via WhatsApp.`);
  showCustomerFeedback(`${customer.name} recebeu o comprovante no WhatsApp.`);
}

function holdCustomerItem() {
  if (!workspaceState.customerSelection) {
    addPdvLog('Escolha um cliente antes de reservar a peça.');
    return;
  }
  if (!workspaceState.inventorySelection) {
    addPdvLog('Selecione uma peça no estoque para reservar.');
    return;
  }
  const customer = workspaceState.customers.find((entry) => entry.id === workspaceState.customerSelection);
  const item = workspaceState.inventory.find((entry) => entry.id === workspaceState.inventorySelection);
  if (!customer || !item) return;
  item.status = 'reserved';
  addPdvLog(`Peça ${item.code} reservada para ${customer.name} por 30 minutos.`);
  showCustomerFeedback(`Reserva criada para ${customer.name}.`);
  renderInventoryList();
  renderInventoryActions();
}

function resetSelfSession() {
  clearSelfTimer();
  workspaceState.self.stage = 'idle';
  workspaceState.self.product = null;
  workspaceState.self.passCode = null;
  workspaceState.self.expiresAt = null;
  workspaceState.self.log = [];
  addSelfLog('Self-checkout liberado. Escaneie uma peça para iniciar.');
  renderSelfSession();
}

function renderSelfSession() {
  if (!workspaceElements.selfSession) return;
  const { stage, product, passCode, expiresAt } = workspaceState.self;
  let content = '';

  if (stage === 'idle') {
    content = '<p>Escaneie uma peça para abrir o self-checkout.</p>';
  } else if (stage === 'awaitingPayment' && product) {
    content = `
      <div class="workspace-self__card">
        <h4>${product.name}</h4>
        <p>${product.code} • ${product.category}</p>
        <strong>${formatCurrencyGlobal(product.price)}</strong>
        <button type="button" class="btn btn--primary btn--small" data-action="self-pay">Simular pagamento PIX</button>
      </div>
    `;
  } else if (stage === 'paid' && product) {
    content = `
      <div class="workspace-self__card is-paid">
        <h4>${product.name}</h4>
        <p>${product.code} • ${product.category}</p>
        <strong>${formatCurrencyGlobal(product.price)}</strong>
        <div class="workspace-pass">
          <span class="workspace-pass__label">Passe liberado</span>
          <span class="workspace-pass__code">${passCode}</span>
          <span class="workspace-pass__timer" id="self-countdown">${expiresAt ? formatCountdownText(expiresAt - Date.now()) : ''}</span>
        </div>
      </div>
    `;
  } else if (stage === 'validated') {
    content = '<p class="workspace-success">Passe validado pelo lojista. Cliente liberado.</p>';
  } else if (stage === 'expired') {
    content = '<p class="workspace-warning">Passe expirado. É preciso gerar novo pagamento.</p>';
  }

  workspaceElements.selfSession.innerHTML = content;
  updateSelfButtons();
}

function addSelfLog(message) {
  workspaceState.self.log.unshift({ message, timestamp: Date.now() });
  workspaceState.self.log = workspaceState.self.log.slice(0, 4);
  if (!workspaceElements.selfLog) return;
  workspaceElements.selfLog.innerHTML = workspaceState.self.log.map((entry) => `<p>${entry.message}</p>`).join('');
}

function confirmSelfPayment() {
  if (workspaceState.self.stage !== 'awaitingPayment' || !workspaceState.self.product) return;
  workspaceState.self.stage = 'paid';
  workspaceState.self.passCode = `PASS-${Math.floor(Math.random() * 900000 + 100000)}`;
  workspaceState.self.expiresAt = Date.now() + 2 * 60 * 1000;
  addSelfLog('Pagamento confirmado automaticamente pelo PSP demo.');
  renderSelfSession();
  startSelfTimer();
}

function validateSelfPass() {
  if (workspaceState.self.stage !== 'paid') {
    addSelfLog('Nenhum passe disponível para validar.');
    return;
  }
  workspaceState.self.stage = 'validated';
  addSelfLog('Passe validado. Estoque liberado.');
  clearSelfTimer();
  renderSelfSession();
}

function expireSelfPass(manual = false) {
  if (workspaceState.self.stage !== 'paid') return;
  workspaceState.self.stage = 'expired';
  clearSelfTimer();
  addSelfLog(manual ? 'Passe expirado manualmente pelo lojista.' : 'Passe expirou automaticamente após 2 minutos.');
  renderSelfSession();
}

function updateSelfButtons() {
  if (workspaceElements.selfValidateButton) {
    workspaceElements.selfValidateButton.disabled = workspaceState.self.stage !== 'paid';
  }
  if (workspaceElements.selfExpireButton) {
    workspaceElements.selfExpireButton.disabled = workspaceState.self.stage !== 'paid';
  }
  if (workspaceElements.selfScanButton) {
    workspaceElements.selfScanButton.disabled = workspaceState.self.stage === 'paid';
  }
}

function startSelfTimer() {
  clearSelfTimer();
  workspaceState.self.timerId = window.setInterval(() => {
    if (workspaceState.self.stage !== 'paid' || !workspaceState.self.expiresAt) {
      clearSelfTimer();
      return;
    }
    const remaining = workspaceState.self.expiresAt - Date.now();
    if (remaining <= 0) {
      expireSelfPass(false);
      return;
    }
    const countdown = document.getElementById('self-countdown');
    if (countdown) countdown.textContent = formatCountdownText(remaining);
  }, 500);
}

function clearSelfTimer() {
  if (workspaceState.self.timerId) {
    window.clearInterval(workspaceState.self.timerId);
    workspaceState.self.timerId = null;
  }
}

function openScanner(mode) {
  if (!scannerElements.root) return;
  ensureWorkspaceInitialized();
  workspaceState.scanner.mode = mode;
  workspaceState.scanner.product = null;
  scannerElements.status.textContent = 'Aponte para um QR Code.';
  if (scannerElements.confirmButton) scannerElements.confirmButton.disabled = true;
  if (scannerElements.fallback) scannerElements.fallback.hidden = true;
  scannerElements.root.hidden = false;
  scannerElements.root.classList.add('is-active');
  startScannerStream();
  scannerElements.root.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function startScannerStream() {
  if (!scannerElements.video) return;
  stopScannerStream();
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showScannerFallback();
    return;
  }
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => {
      workspaceState.scanner.stream = stream;
      scannerElements.video.srcObject = stream;
      scannerElements.video.play().catch(() => {});
      scheduleScannerDetection();
    })
    .catch(() => {
      showScannerFallback();
    });
}

function showScannerFallback() {
  if (scannerElements.fallback) scannerElements.fallback.hidden = false;
  scannerElements.status.textContent = 'Não conseguimos acessar a câmera. Use o botão para simular a leitura.';
}

function scheduleScannerDetection() {
  clearScannerTimeout();
  workspaceState.scanner.timeoutId = window.setTimeout(() => simulateScannerDetection(false), 2200);
}

function clearScannerTimeout() {
  if (workspaceState.scanner.timeoutId) {
    window.clearTimeout(workspaceState.scanner.timeoutId);
    workspaceState.scanner.timeoutId = null;
  }
}

function simulateScannerDetection(force) {
  if (!scannerElements.status) return;
  if (workspaceState.scanner.product && !force) return;
  clearScannerTimeout();
  const product = getRandomProductForMode(workspaceState.scanner.mode);
  if (!product) {
    scannerElements.status.textContent = 'Nenhuma peça disponível para este modo.';
    return;
  }
  workspaceState.scanner.product = product;
  scannerElements.status.textContent = `Produto detectado: ${product.name} (${product.code})`;
  if (scannerElements.confirmButton) scannerElements.confirmButton.disabled = false;
}

function getRandomProductForMode(mode) {
  if (mode === 'self') {
    const available = workspaceState.inventory.filter((item) => item.status === 'available');
    if (available.length === 0) return workspaceState.products[0] || null;
    return available[Math.floor(Math.random() * available.length)];
  }
  if (workspaceState.products.length === 0) return null;
  return workspaceState.products[Math.floor(Math.random() * workspaceState.products.length)];
}

function confirmScannerSelection() {
  if (!workspaceState.scanner.product) return;
  const product = workspaceState.scanner.product;
  if (workspaceState.scanner.mode === 'self') {
    workspaceState.self.product = {
      id: product.id,
      name: product.name,
      code: product.code,
      category: product.category,
      price: product.price,
    };
    workspaceState.self.stage = 'awaitingPayment';
    addSelfLog(`Peça ${product.code} escaneada no modo cliente.`);
    renderSelfSession();
  } else {
    addProductToCart(product.id);
  }
  closeScanner();
}

function closeScanner() {
  if (!scannerElements.root) return;
  stopScannerStream();
  clearScannerTimeout();
  workspaceState.scanner.product = null;
  scannerElements.root.hidden = true;
  scannerElements.root.classList.remove('is-active');
}

function stopScannerStream() {
  if (workspaceState.scanner.stream) {
    workspaceState.scanner.stream.getTracks().forEach((track) => track.stop());
    workspaceState.scanner.stream = null;
  }
  if (scannerElements.video) {
    scannerElements.video.srcObject = null;
  }
}

function handleContactSubmit() {
  if (!contactElements.form) return;
  const formData = new FormData(contactElements.form);
  const name = (formData.get('name') || 'Time').toString();
  contactElements.form.reset();
  if (contactElements.feedback) {
    contactElements.feedback.textContent = `${name}, recebemos o seu interesse! Entraremos em contato em até 1 dia útil.`;
  }
}

function setWorkspaceView(view) {
  workspaceState.view = view;
  workspaceElements.navButtons.forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
  workspaceElements.views.forEach((panel) => {
    const isActive = panel.dataset.view === view;
    panel.classList.toggle('is-active', isActive);
    if (isActive) {
      panel.removeAttribute('aria-hidden');
    } else {
      panel.setAttribute('aria-hidden', 'true');
    }
  });
}

function renderWorkspaceKpis() {
  if (!workspaceElements.kpis || !workspaceState.metrics) return;
  const metrics = workspaceState.metrics;
  const paymentCounts = metrics.paymentCounts || {};
  const totalPayments = Object.values(paymentCounts).reduce((sum, count) => sum + count, 0);
  const pixConversion = totalPayments ? Math.round(((paymentCounts.pix || 0) / totalPayments) * 100) : null;
  workspaceElements.kpis.innerHTML = `
    <div><dt>Vendas pagas</dt><dd>${metrics.salesCount}</dd></div>
    <div><dt>Receita líquida</dt><dd>${formatCurrencyGlobal(metrics.totalRevenue)}</dd></div>
    <div><dt>Ticket médio</dt><dd>${formatCurrencyGlobal(metrics.averageTicket)}</dd></div>
    <div><dt>Conversão PIX</dt><dd>${pixConversion !== null ? `${pixConversion}%` : '—'}</dd></div>
    <div><dt>Peças disponíveis</dt><dd>${metrics.availableCount}</dd></div>
  `;
}

function renderWorkspaceHighlights() {
  if (!workspaceElements.highlights || !workspaceState.metrics) return;
  const metrics = workspaceState.metrics;
  const topProduct = Array.from(metrics.productTotals.values()).sort((a, b) => b.qty - a.qty)[0] || null;
  const topSeller = Array.from(metrics.sellerTotals.values()).sort((a, b) => b.total - a.total)[0] || null;
  const topCustomer = Array.from(metrics.customerTotals.values()).sort((a, b) => b.total - a.total)[0] || null;

  workspaceElements.highlights.innerHTML = `
    <li><span>Produto destaque</span><strong>${topProduct ? `${topProduct.name} (${topProduct.qty} un.)` : '—'}</strong></li>
    <li><span>Melhor vendedor</span><strong>${topSeller ? `${topSeller.name} (${formatCurrencyGlobal(topSeller.total)})` : '—'}</strong></li>
    <li><span>Cliente VIP</span><strong>${topCustomer ? `${topCustomer.name} (${formatCurrencyGlobal(topCustomer.total)})` : '—'}</strong></li>
  `;
}

function formatCountdownText(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

