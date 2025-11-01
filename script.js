const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

const formatDate = (isoDate) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(isoDate)
  );

const formatPhone = (value) => {
  const digits = (value || '').toString().replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length > 0) {
    return digits;
  }
  return value;
};

const normalizeProductCode = (code) => (code || '').toString().trim().toUpperCase();

const demoCustomers = [
  {
    id: 'cli-0001',
    name: 'Bianca Souza',
    whatsapp: '5511998881122',
    phoneLabel: '(11) 99888-1122',
    email: 'bianca.souza@cliente.demo',
    tag: 'VIP',
    tagClass: 'chip--available',
    lastPurchase: '2024-09-06',
    totalSpent: 8734.2,
    subtitle: 'Cliente VIP desde 2022',
    notes: 'Cliente assídua, gosta de novidades premium e combos com acessórios.',
    history: [
      { id: '0001', date: '2024-09-06', items: 2, total: 299.8, url: '/app/pdv/recibo/0001/' },
      { id: '0987', date: '2024-08-24', items: 3, total: 512.4 },
      { id: '0970', date: '2024-08-15', items: 1, total: 189.9 },
    ],
  },
  {
    id: 'cli-0002',
    name: 'Carlos Lima',
    whatsapp: '5511993213344',
    phoneLabel: '(11) 99321-3344',
    email: 'carlos.lima@cliente.demo',
    tag: 'Consignado',
    tagClass: '',
    lastPurchase: '2024-09-04',
    totalSpent: 4210.5,
    subtitle: 'Fornecedor em consignação',
    notes: 'Fornece peças consignadas mensalmente. Atualizar comissão a cada coleção.',
    history: [
      { id: '0004', date: '2024-09-04', items: 1, total: 189.9 },
      { id: '0950', date: '2024-08-10', items: 2, total: 340.0 },
      { id: '0922', date: '2024-07-28', items: 1, total: 159.9 },
    ],
  },
  {
    id: 'cli-0003',
    name: 'Fernanda Prado',
    whatsapp: '5511997775566',
    phoneLabel: '(11) 99777-5566',
    email: 'fernanda.prado@cliente.demo',
    tag: 'Fiado',
    tagClass: 'chip--reserved',
    lastPurchase: '2024-08-29',
    totalSpent: 2980.75,
    subtitle: 'Cliente com limite de fiado',
    notes: 'Prefere fechar via fiado. Lembrar de oferecer novidades em alfaiataria.',
    history: [
      { id: '0007', date: '2024-08-29', items: 1, total: 219.9, status: 'pending' },
      { id: '0910', date: '2024-08-12', items: 2, total: 398.0 },
      { id: '0881', date: '2024-07-30', items: 1, total: 189.9 },
    ],
  },
];

const demoCustomersMap = Object.fromEntries(demoCustomers.map((customer) => [customer.id, customer]));

const demoProducts = [
  {
    code: 'BR-0001',
    name: 'Jaqueta Jeans Oversized',
    category: 'Outerwear',
    size: 'M',
    price: 189.9,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=60',
    status: 'available',
  },
  {
    code: 'BR-0002',
    name: 'Vestido Midi Floral',
    category: 'Vestidos',
    size: 'M',
    price: 129.9,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60',
    status: 'available',
  },
  {
    code: 'BR-0003',
    name: 'Calça Alfaiataria Cropped',
    category: 'Calças',
    size: 'G',
    price: 219.9,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=60',
    status: 'available',
  },
  {
    code: 'BR-0004',
    name: 'Saia Plissada Grafite',
    category: 'Saias',
    size: 'P',
    price: 149.9,
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=60',
    status: 'available',
  },
  {
    code: 'BR-0005',
    name: 'Camisa Linho Relax',
    category: 'Camisas',
    size: 'M',
    price: 149.0,
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60',
    status: 'available',
  },
  {
    code: 'BR-0006',
    name: 'Blazer Alfaiataria Verde',
    category: 'Outerwear',
    size: 'G',
    price: 259.9,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60',
    status: 'available',
  },
];

const demoProductsMap = Object.fromEntries(
  demoProducts.map((product) => [normalizeProductCode(product.code), product])
);

const demoStorefronts = {
  'brecho-da-ana': {
    name: 'Brechó da Ana',
    slug: 'brecho-da-ana',
    whatsapp: '5500000000000',
    message: 'Olá Ana! Vim da vitrine BIPA e amei esta peça:',
    description: 'Peças selecionadas com curadoria afetiva.',
    products: demoProducts.filter((product, index) => index < 5),
  },
};

const body = document.body;
const page = body.dataset.page;

const formatCustomerOption = (customer) => `${customer.name} · ${customer.phoneLabel}`;

// --------- Admin > Customers list ---------
if (page === 'admin-customers') {
  const tableBody = document.getElementById('customer-table-body');

  if (tableBody) {
    tableBody.innerHTML = '';

    demoCustomers.forEach((customer) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <a class="link" href="/app/admin/clientes/${customer.id}/">${customer.name}</a>
        </td>
        <td>${customer.phoneLabel}</td>
        <td>${
          customer.tag
            ? `<span class="chip ${customer.tagClass || ''}">${customer.tag}</span>`
            : '<span class="chip">Sem tag</span>'
        }</td>
        <td>${formatDate(customer.lastPurchase)}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// --------- Admin > Customer profile ---------
if (page === 'admin-customer-profile') {
  const customerId = body.dataset.customer;
  const customer = demoCustomersMap[customerId];

  if (customer) {
    const nameElement = document.getElementById('customer-name');
    const subtitleElement = document.getElementById('customer-subtitle');
    const phoneElement = document.getElementById('customer-phone');
    const emailElement = document.getElementById('customer-email');
    const tagElement = document.getElementById('customer-tag');
    const lastPurchaseElement = document.getElementById('customer-last-purchase');
    const totalElement = document.getElementById('customer-total');
    const notesElement = document.getElementById('customer-notes');
    const historyBody = document.getElementById('customer-history-body');
    const messageButton = document.getElementById('customer-message');

    if (nameElement) nameElement.textContent = customer.name;
    if (subtitleElement) {
      const subtitlePrefix = customer.subtitle || 'Cliente BIPA';
      subtitleElement.textContent = `${subtitlePrefix} · Última compra em ${formatDate(
        customer.lastPurchase
      )}`;
    }
    if (phoneElement) phoneElement.textContent = customer.phoneLabel;
    if (emailElement) emailElement.textContent = customer.email || '—';
    if (tagElement) {
      tagElement.textContent = customer.tag || 'Sem tag';
      tagElement.className = `chip ${customer.tagClass || ''}`.trim();
    }
    if (lastPurchaseElement) lastPurchaseElement.textContent = formatDate(customer.lastPurchase);
    if (totalElement) totalElement.textContent = formatCurrency(customer.totalSpent);
    if (notesElement) notesElement.textContent = customer.notes || 'Sem observações cadastradas.';
    if (messageButton) {
      const url = `https://wa.me/${customer.whatsapp}?text=${encodeURIComponent(
        `Olá ${customer.name}! Aqui é do BIPA, tudo bem?`
      )}`;
      messageButton.setAttribute('href', url);
    }

    if (historyBody) {
      historyBody.innerHTML = '';
      customer.history.forEach((entry) => {
        const row = document.createElement('tr');
        const saleLabel = `#${entry.id}`;
        const saleCell = entry.url
          ? `<a class="link" href="${entry.url}">${saleLabel}</a>`
          : saleLabel;
        const statusChip =
          entry.status === 'pending'
            ? '<span class="chip chip--reserved">Pendente</span>'
            : '';
        row.innerHTML = `
          <td>${formatDate(entry.date)}</td>
          <td>${saleCell}</td>
          <td>${entry.items}</td>
          <td>
            ${formatCurrency(entry.total)}
            ${statusChip}
          </td>
        `;
        historyBody.appendChild(row);
      });
    }
  }
}

// --------- Storefront ---------
if (page === 'storefront') {
  const storeSlug = body.dataset.store;
  const store = demoStorefronts[storeSlug];
  const galleryElement = document.getElementById('storefront-gallery');
  const categorySelect = document.getElementById('filter-category');
  const sizeSelect = document.getElementById('filter-size');

  if (store && galleryElement && categorySelect && sizeSelect) {
    const products = store.products;
    const categories = ['todos', ...new Set(products.map((item) => item.category))];
    const sizes = ['todos', ...new Set(products.map((item) => item.size))];

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category === 'todos' ? 'Todas' : category;
      categorySelect.appendChild(option);
    });

    sizes.forEach((size) => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size === 'todos' ? 'Todos' : size;
      sizeSelect.appendChild(option);
    });

    const renderGallery = () => {
      const selectedCategory = categorySelect.value;
      const selectedSize = sizeSelect.value;

      galleryElement.innerHTML = '';

    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      const matchesSize = selectedSize === 'todos' || product.size === selectedSize;
      const isAvailable = product.status !== 'sold';
      return matchesCategory && matchesSize && isAvailable;
    });

    if (filtered.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'storefront__empty';
      emptyState.textContent = 'Nenhuma peça disponível com os filtros selecionados.';
      galleryElement.appendChild(emptyState);
      return;
    }

    filtered.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <div class="product-card__body">
            <h3 class="product-card__title">${product.name}</h3>
            <div class="product-card__meta">
              <span>${product.category}</span>
              <span>Tam. ${product.size}</span>
            </div>
            <div class="product-card__price">${formatCurrency(product.price)}</div>
            <a class="btn btn--surface" target="_blank" rel="noopener"
              href="https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`${store.message} ${product.name} (${product.code})`)}">
              Quero
            </a>
          </div>
        `;
        galleryElement.appendChild(card);
      });
    };

    categorySelect.addEventListener('change', renderGallery);
    sizeSelect.addEventListener('change', renderGallery);
    renderGallery();
  }
}

// --------- PDV ---------
if (page === 'pdv') {
  const productListElement = document.getElementById('pdv-product-list');
  const searchInput = document.getElementById('pdv-search');
  const cartElement = document.getElementById('pdv-cart');
  const subtotalElement = document.getElementById('pdv-subtotal');
  const totalDiscountElement = document.getElementById('pdv-total-discount');
  const totalElement = document.getElementById('pdv-total');
  const discountInput = document.getElementById('pdv-discount');
  const discountTypeButtons = Array.from(document.querySelectorAll('[data-discount-type]'));
  const discountUnitElement = document.getElementById('pdv-discount-unit');
  const paymentButtons = Array.from(document.querySelectorAll('.payment-button'));
  const paymentContextElement = document.getElementById('pdv-payment-context');
  const finishButton = document.getElementById('pdv-finish');
  const clientInput = document.getElementById('pdv-client');
  const clientResultsElement = document.getElementById('pdv-client-results');
  const clientCurrentElement = document.getElementById('pdv-client-current');
  const clientClearButton = document.getElementById('pdv-client-clear');
  const clientRegisterButton = document.getElementById('pdv-client-register');
  const customerZoneElement = document.querySelector('.customer-zone');
  const mainShell = document.querySelector('.pdv-shell');
  const successSection = document.getElementById('pdv-success');
  const successTotalElement = document.getElementById('pdv-success-total');
  const newSaleButton = document.getElementById('pdv-success-new-sale');
  const whatsappButton = document.getElementById('pdv-success-whatsapp');
  const registerModal = document.getElementById('pdv-register-modal');
  const registerForm = document.getElementById('pdv-register-form');
  const registerNameInput = document.getElementById('pdv-register-name');
  const registerWhatsappInput = document.getElementById('pdv-register-whatsapp');
  const registerCloseButton = document.getElementById('pdv-register-close');
  const registerCancelButton = document.getElementById('pdv-register-cancel');
  const scannerOpenButton = document.getElementById('pdv-open-scanner');
  const scannerModal = document.getElementById('pdv-scanner-modal');
  const scannerVideo = document.getElementById('pdv-scanner-video');
  const scannerStatusElement = document.getElementById('pdv-scanner-status');
  const scannerSupportBadge = document.getElementById('pdv-scanner-support');
  const scannerCloseButton = document.getElementById('pdv-scanner-close');
  const scannerCancelButton = document.getElementById('pdv-scanner-cancel');
  const scannerManualForm = document.getElementById('pdv-scanner-manual');
  const scannerManualInput = document.getElementById('pdv-scanner-input');
  const pixBox = document.getElementById('pdv-pix-box');
  const pixCodeElement = document.getElementById('pdv-pix-code');
  const pixCopyButton = document.getElementById('pdv-pix-copy');
  const pixMarkPaidButton = document.getElementById('pdv-pix-mark-paid');
  const pixStatusElement = document.getElementById('pdv-pix-status');
  const pixQrElement = document.getElementById('pdv-pix-qr');

  const cart = new Map();
  let selectedPayment = 'PIX';
  let selectedCustomer = null;
  let discountType = 'currency';
  let lastSaleSummary = null;
  let pixPaymentStatus = 'pending';
  let lastPixTotal = null;
  let pixQrCodeInstance = null;
  let pixStatusTimeout = null;
  let pixQrLoaderPromise = null;
  let saleCounter = 1;
  let scannerStream = null;
  let scannerActive = false;
  let barcodeDetector = null;

  const getSaleId = () => `PDV-${String(saleCounter).padStart(4, '0')}`;

  const generatePixPayload = (total, saleId) => {
    const amount = Number(total || 0).toFixed(2);
    const numericId = saleId.replace(/\D/g, '').padStart(4, '0');
    const amountLength = String(amount.length).padStart(2, '0');
    return [
      '000201',
      '010212',
      '26360014BR.GOV.BCB.PIX',
      '0114pix@bipa.demo',
      '52040000',
      '5303986',
      `54${amountLength}${amount}`,
      '5802BR',
      '5910BIPA DEMO',
      '6009SAO PAULO',
      `62180515SALE${numericId}`,
      '6304BIPA',
    ].join('');
  };

  const ensurePixQrCode = () => {
    if (!pixQrElement) return null;
    if (typeof QRCode === 'undefined') {
      if (pixQrElement && pixQrElement.innerHTML.trim() === '') {
        pixQrElement.innerHTML = '<span class="pix-box__fallback">Carregando QR Code...</span>';
      }
      if (!pixQrLoaderPromise) {
        pixQrLoaderPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
          script.defer = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.head.appendChild(script);
        }).then((loaded) => {
          if (!loaded) {
            console.warn('Biblioteca de QR Code indisponível.');
            if (pixQrElement) {
              pixQrElement.innerHTML = '<span class="pix-box__fallback">QR Code indisponível offline.</span>';
            }
            return null;
          }
          updatePixBox();
          return pixQrCodeInstance;
        });
      }
      return null;
    }
    if (!pixQrCodeInstance) {
      pixQrElement.innerHTML = '';
      pixQrCodeInstance = new QRCode(pixQrElement, {
        width: 180,
        height: 180,
        correctLevel: QRCode.CorrectLevel.M,
        text: '',
      });
    }
    return pixQrCodeInstance;
  };

  const updatePixStatusUI = (messageOverride) => {
    if (!pixStatusElement) return;
    const hasItems = cart.size > 0;
    const baseMessage = !hasItems
      ? 'Aguardando produtos no carrinho.'
      : pixPaymentStatus === 'paid'
      ? 'Pagamento confirmado. Finalize a venda para registrar o recebimento.'
      : 'Aguardando confirmação do PIX ou clique em “Marcar pagamento recebido”.';
    const message = messageOverride || baseMessage;
    pixStatusElement.textContent = message;
    const shouldWarn = hasItems && selectedPayment === 'PIX' && pixPaymentStatus !== 'paid';
    pixStatusElement.classList.toggle('pix-box__status--success', pixPaymentStatus === 'paid');
    pixStatusElement.classList.toggle('pix-box__status--warning', shouldWarn);
    if (pixMarkPaidButton) {
      pixMarkPaidButton.disabled = pixPaymentStatus === 'paid';
      pixMarkPaidButton.textContent = pixPaymentStatus === 'paid'
        ? 'PIX confirmado'
        : 'Marcar pagamento recebido';
    }
  };

  const showPixTemporaryMessage = (message, duration = 3200) => {
    updatePixStatusUI(message);
    if (pixStatusTimeout) window.clearTimeout(pixStatusTimeout);
    pixStatusTimeout = window.setTimeout(() => updatePixStatusUI(), duration);
  };

  const updatePixBox = (totals) => {
    if (!pixBox) return;
    const hasItems = cart.size > 0;
    const { total } = totals || getTotals();
    if (selectedPayment !== 'PIX' || !hasItems || total <= 0) {
      pixBox.hidden = true;
      if (!hasItems) {
        pixPaymentStatus = 'pending';
      }
      updatePixStatusUI();
      return;
    }

    const totalRounded = Number(total.toFixed(2));
    const lastRounded = lastPixTotal == null ? null : Number(lastPixTotal.toFixed(2));
    if (lastRounded === null || totalRounded !== lastRounded) {
      pixPaymentStatus = 'pending';
    }

    pixBox.hidden = false;
    const saleId = getSaleId();
    const payload = generatePixPayload(total, saleId);
    lastPixTotal = total;

    if (pixCodeElement) pixCodeElement.textContent = payload;
    const qr = ensurePixQrCode();
    if (qr && typeof qr.makeCode === 'function') {
      qr.makeCode(payload);
    } else if (pixQrElement && !pixQrLoaderPromise) {
      pixQrElement.innerHTML = '<span class="pix-box__fallback">Carregando QR Code...</span>';
    }
    updatePixStatusUI();
  };

  const markPixAsPaid = () => {
    if (!cart.size) {
      showPixTemporaryMessage('Adicione produtos para gerar o PIX.');
      return;
    }
    pixPaymentStatus = 'paid';
    updatePixStatusUI();
    console.info(`✅ Pagamento PIX confirmado para ${getSaleId()}.`);
  };

  const copyPixCode = async () => {
    if (!pixCodeElement) return;
    const payload = (pixCodeElement.textContent || '').trim();
    if (!payload || payload === '—') {
      showPixTemporaryMessage('Nenhum código PIX disponível no momento.');
      return;
    }
    try {
      await navigator.clipboard.writeText(payload);
      showPixTemporaryMessage('Código PIX copiado para a área de transferência.');
    } catch (error) {
      console.warn('Não foi possível copiar automaticamente o PIX:', error);
      showPixTemporaryMessage('Copie o código manualmente: seleção automática indisponível.', 4200);
    }
  };

  const setScannerStatus = (message, tone = 'info') => {
    if (!scannerStatusElement) return;
    scannerStatusElement.textContent = message;
    scannerStatusElement.classList.remove('is-success', 'is-error');
    if (tone === 'success') scannerStatusElement.classList.add('is-success');
    if (tone === 'error') scannerStatusElement.classList.add('is-error');
  };

  const stopScanner = () => {
    scannerActive = false;
    if (scannerStream) {
      scannerStream.getTracks().forEach((track) => track.stop());
      scannerStream = null;
    }
    if (scannerVideo) {
      scannerVideo.pause();
      scannerVideo.srcObject = null;
    }
  };

  const closeScanner = () => {
    if (!scannerModal) return;
    stopScanner();
    scannerModal.classList.remove('is-visible');
    scannerModal.setAttribute('aria-hidden', 'true');
  };

  const handleScannedProduct = (rawCode) => {
    const normalizedCode = normalizeProductCode(rawCode);
    if (!normalizedCode) {
      setScannerStatus('Código inválido. Tente novamente ou digite manualmente.', 'error');
      return;
    }
    const product = demoProductsMap[normalizedCode];
    if (!product) {
      setScannerStatus(`Produto ${normalizedCode} não encontrado nesta vitrine.`, 'error');
      return;
    }
    if (product.status === 'sold') {
      setScannerStatus('Esta peça já foi vendida. Escolha outra peça disponível.', 'error');
      return;
    }
    if (cart.has(product.code)) {
      setScannerStatus('Este produto já está no carrinho atual.', 'error');
      return;
    }
    addToCart(product);
    setScannerStatus(`${product.name} adicionada ao carrinho.`, 'success');
    window.setTimeout(() => closeScanner(), 650);
  };

  const detectScannerFrame = async () => {
    if (!scannerActive || !barcodeDetector || !scannerVideo) return;
    try {
      const barcodes = await barcodeDetector.detect(scannerVideo);
      if (barcodes.length > 0) {
        const [first] = barcodes;
        const rawValue = first.rawValue ?? '';
        const fallbackValue = rawValue || (first.rawData ? String(first.rawData) : '');
        stopScanner();
        handleScannedProduct(fallbackValue);
        return;
      }
    } catch (error) {
      console.warn('Erro ao detectar código de barras:', error);
      setScannerStatus('Erro ao ler o código. Digite manualmente ou tente novamente.', 'error');
      stopScanner();
      return;
    }
    if (scannerActive) window.requestAnimationFrame(detectScannerFrame);
  };

  const openScanner = async () => {
    if (!scannerModal) return;
    scannerModal.classList.add('is-visible');
    scannerModal.setAttribute('aria-hidden', 'false');
    if (scannerManualInput) {
      scannerManualInput.value = '';
    }

    const supportsBarcodeDetector = 'BarcodeDetector' in window;
    if (scannerSupportBadge) {
      scannerSupportBadge.textContent = supportsBarcodeDetector
        ? 'Leitor nativo ativo'
        : 'Leitor manual';
      scannerSupportBadge.classList.toggle('is-warning', !supportsBarcodeDetector);
    }

    if (!supportsBarcodeDetector || !navigator.mediaDevices?.getUserMedia) {
      setScannerStatus('Leitor nativo indisponível. Utilize o campo abaixo para digitar o código.', 'error');
      if (scannerManualInput) scannerManualInput.focus();
      return;
    }

    try {
      barcodeDetector = new window.BarcodeDetector({ formats: ['code_128', 'ean_13', 'qr_code', 'code_39'] });
      scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (scannerVideo) {
        scannerVideo.srcObject = scannerStream;
        await scannerVideo.play();
      }
      scannerActive = true;
      setScannerStatus('Aponte a câmera para o código de barras da peça.');
      window.requestAnimationFrame(detectScannerFrame);
    } catch (error) {
      console.warn('Não foi possível iniciar o scanner nativo:', error);
      setScannerStatus('Erro ao acessar a câmera. Digite o código manualmente.', 'error');
      stopScanner();
      if (scannerManualInput) scannerManualInput.focus();
    }
  };

  const clearClientSuggestions = () => {
    if (!clientResultsElement) return;
    clientResultsElement.innerHTML = '';
    clientResultsElement.hidden = true;
    if (clientInput) clientInput.setAttribute('aria-expanded', 'false');
  };

  const renderClientSuggestions = (query = '') => {
    if (!clientResultsElement) return;
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      clearClientSuggestions();
      return;
    }

    const digits = normalized.replace(/\D/g, '');
    const matches = demoCustomers.filter((customer) => {
      const phoneDigits = customer.phoneLabel.replace(/\D/g, '');
      return (
        customer.name.toLowerCase().includes(normalized) ||
        phoneDigits.includes(digits) ||
        customer.whatsapp.includes(digits)
      );
    });

    clientResultsElement.innerHTML = '';

    if (matches.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'customer-suggestions__empty';
      emptyState.textContent = 'Nenhum cliente encontrado. Cadastre rapidamente ao lado.';
      clientResultsElement.appendChild(emptyState);
      clientResultsElement.hidden = false;
      return;
    }

    const list = document.createElement('ul');
    list.className = 'customer-suggestions__list';

    matches.forEach((customer) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'customer-suggestions__item';
      button.setAttribute('role', 'option');
      button.setAttribute('aria-label', `${customer.name} — ${customer.phoneLabel}`);
      button.innerHTML = `
        <strong>${customer.name}</strong>
        <span>${customer.phoneLabel}</span>
      `;
      button.addEventListener('click', () => selectCustomer(customer));
      item.appendChild(button);
      list.appendChild(item);
    });

    clientResultsElement.appendChild(list);
    clientResultsElement.hidden = false;
    if (clientInput) clientInput.setAttribute('aria-expanded', 'true');
  };

  const renderSelectedCustomer = () => {
    if (!clientCurrentElement) return;
    if (selectedCustomer) {
      clientCurrentElement.innerHTML = `Cliente: <strong>${selectedCustomer.name}</strong>`;
      if (clientClearButton) {
        clientClearButton.hidden = false;
        clientClearButton.textContent = 'Alterar';
      }
    } else {
      clientCurrentElement.innerHTML = 'Cliente: <strong>Avulso (Padrão)</strong>';
      if (clientClearButton) clientClearButton.hidden = true;
    }
    updatePaymentContext();
  };

  const selectCustomer = (customer) => {
    selectedCustomer = customer;
    if (clientInput) {
      clientInput.value = '';
      clientInput.setAttribute('aria-expanded', 'false');
    }
    clearClientSuggestions();
    renderSelectedCustomer();
  };

  const clearCustomerSelection = (focusInput = false) => {
    selectedCustomer = null;
    if (clientInput) {
      clientInput.value = '';
      clientInput.setAttribute('aria-expanded', 'false');
    }
    clearClientSuggestions();
    renderSelectedCustomer();
    if (focusInput && clientInput) clientInput.focus();
  };

  const handleCustomerInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      clearClientSuggestions();
      return;
    }

    const match = demoCustomers.find((customer) => formatCustomerOption(customer).toLowerCase() === trimmed.toLowerCase());
    if (match) {
      selectCustomer(match);
      return;
    }

    renderClientSuggestions(trimmed);
  };

  const renderProducts = (query = '') => {
    if (!productListElement) return;
    const normalizedQuery = query.trim().toLowerCase();
    productListElement.innerHTML = '';

    const filtered = demoProducts.filter((product) => {
      if (product.status === 'sold') return false;
      if (!normalizedQuery) return true;
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.code.toLowerCase().includes(normalizedQuery)
      );
    });

    if (filtered.length === 0) {
      const emptyState = document.createElement('li');
      emptyState.className = 'pdv-empty';
      emptyState.textContent = 'Nenhum produto disponível. Verifique o estoque ou remova filtros.';
      emptyState.setAttribute('role', 'status');
      productListElement.appendChild(emptyState);
      return;
    }

    filtered.forEach((product) => {
      const item = document.createElement('li');
      item.className = 'pdv-product';
      item.tabIndex = 0;
      item.innerHTML = `
        <span class="pdv-product__title">${product.name}</span>
        <span class="pdv-product__meta">${product.code} • Tam. ${product.size} • ${formatCurrency(product.price)}</span>
      `;
      item.addEventListener('click', () => addToCart(product));
      item.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') addToCart(product);
      });
      productListElement.appendChild(item);
    });
  };

  const addToCart = (product) => {
    if (product.status === 'sold') {
      alert('Este produto já foi vendido. Atualize o estoque para disponibilizar novas peças.');
      return;
    }
    if (cart.has(product.code)) return;
    cart.set(product.code, { ...product });
    renderCart();
  };

  const removeFromCart = (productCode) => {
    cart.delete(productCode);
    renderCart();
  };

  const renderCart = () => {
    if (!cartElement) return;
    cartElement.innerHTML = '';

    const items = Array.from(cart.values());

    if (items.length === 0) {
      const emptyState = document.createElement('li');
      emptyState.textContent = 'Nenhum item adicionado ainda. Busque uma peça e clique para incluir.';
      emptyState.className = 'pdv-empty';
      emptyState.setAttribute('role', 'status');
      cartElement.appendChild(emptyState);
    } else {
      items.forEach((item) => {
        const cartItem = document.createElement('li');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="cart-item__info">
            <span class="cart-item__name">${item.name}</span>
            <span class="cart-item__meta">${item.code}</span>
          </div>
          <div class="cart-item__value">${formatCurrency(item.price)}</div>
          <button class="cart-item__remove" aria-label="Remover ${item.name}" type="button">×</button>
        `;
        const removeButton = cartItem.querySelector('.cart-item__remove');
        if (removeButton) {
          removeButton.addEventListener('click', () => removeFromCart(item.code));
        }
        cartElement.appendChild(cartItem);
      });
    }

    updateTotals();
  };

  const getTotals = () => {
    const subtotal = Array.from(cart.values()).reduce((sum, item) => sum + item.price, 0);
    const rawDiscount = Math.max(Number(discountInput?.value) || 0, 0);
    let totalDiscount = 0;

    if (discountType === 'percent') {
      const percent = Math.min(rawDiscount, 100);
      totalDiscount = Math.min(subtotal, (subtotal * percent) / 100);
    } else {
      totalDiscount = Math.min(subtotal, rawDiscount);
    }

    const total = Math.max(subtotal - totalDiscount, 0);
    return { subtotal, totalDiscount, total };
  };

  const updateFinishButton = (totalValue, hasItems) => {
    if (!finishButton) return;
    const isLoading = finishButton.dataset.loading === 'true';
    if (isLoading) {
      finishButton.textContent = 'Finalizando...';
      finishButton.disabled = true;
      return;
    }
    finishButton.disabled = !hasItems;
    finishButton.textContent = `FINALIZAR VENDA (${formatCurrency(totalValue)})`;
  };

  const updateTotals = () => {
    const { subtotal, totalDiscount, total } = getTotals();
    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (totalDiscountElement) totalDiscountElement.textContent = formatCurrency(totalDiscount);
    if (totalElement) totalElement.textContent = formatCurrency(total);
    updateFinishButton(total, cart.size > 0);
    updatePixBox({ subtotal, totalDiscount, total });
  };

  const updatePaymentContext = () => {
    if (!paymentContextElement) return;
    const lines = {
      PIX: [
        'Compartilhe o QR Code ou o código copia e cola gerado abaixo.',
        'Após a confirmação, clique em “Marcar pagamento recebido” antes de finalizar.',
      ],
      Dinheiro: ['Receba o valor em espécie e informe o troco se necessário.'],
      Cartão: ['Passe o cartão no POS e confirme a aprovação da operadora.'],
      Fiado: selectedCustomer
        ? [`Venda vinculada a <strong>${selectedCustomer.name}</strong>. Acompanhe em Relatórios > Fiado.`]
        : ['Selecione um cliente para registrar o fiado desta venda.'],
    };

    const message = lines[selectedPayment] || [];
    paymentContextElement.classList.toggle(
      'pdv-payment__context--warning',
      selectedPayment === 'Fiado' && !selectedCustomer
    );

    if (message.length === 0) {
      paymentContextElement.innerHTML = '';
      paymentContextElement.hidden = true;
    } else {
      paymentContextElement.innerHTML = message.map((line) => `<p>${line}</p>`).join('');
      paymentContextElement.hidden = false;
    }
  };

  const setDiscountType = (type) => {
    discountType = type;
    discountTypeButtons.forEach((button) => {
      const isActive = button.dataset.discountType === type;
      button.classList.toggle('is-active', isActive);
    });
    if (discountUnitElement) discountUnitElement.textContent = type === 'percent' ? '%' : 'R$';
    if (discountInput) {
      if (type === 'percent') {
        discountInput.setAttribute('max', '100');
        discountInput.setAttribute('step', '0.5');
      } else {
        discountInput.removeAttribute('max');
        discountInput.setAttribute('step', '0.01');
      }
    }
    updateTotals();
  };

  const setPayment = (method) => {
    selectedPayment = method;
    paymentButtons.forEach((button) => {
      const isActive = button.dataset.payment === method;
      button.classList.toggle('is-active', isActive);
    });
    updatePaymentContext();
    if (method !== 'PIX') {
      pixPaymentStatus = 'pending';
      if (pixStatusTimeout) {
        window.clearTimeout(pixStatusTimeout);
        pixStatusTimeout = null;
      }
    }
    updatePixBox();
  };

  const openRegisterModal = () => {
    if (!registerModal) return;
    registerModal.classList.add('is-visible');
    registerModal.setAttribute('aria-hidden', 'false');
    if (registerNameInput) {
      registerNameInput.value = '';
      registerNameInput.focus();
    }
    if (registerWhatsappInput) registerWhatsappInput.value = '';
  };

  const closeRegisterModal = () => {
    if (!registerModal) return;
    registerModal.classList.remove('is-visible');
    registerModal.setAttribute('aria-hidden', 'true');
    if (registerForm) registerForm.reset();
  };

  const finalizeSale = () => {
    if (!finishButton || cart.size === 0) return;
    finishButton.dataset.loading = 'true';
    updateFinishButton(0, false);

    const items = Array.from(cart.values());
    const totals = getTotals();
    const customerSummary = selectedCustomer
      ? { id: selectedCustomer.id, name: selectedCustomer.name, phone: selectedCustomer.phoneLabel }
      : { id: null, name: 'Cliente Avulso', phone: null };
    const saleId = getSaleId();
    const saleStatus = (() => {
      if (selectedPayment === 'PIX') {
        return pixPaymentStatus === 'paid' ? 'paid' : 'pending';
      }
      if (selectedPayment === 'Fiado') {
        return 'pending';
      }
      return 'paid';
    })();

    window.setTimeout(() => {
      console.groupCollapsed('📦 Nova venda registrada');
      console.log('Venda ID:', saleId);
      console.log('Cliente ID:', customerSummary.id || 'Avulso');
      console.log('Cliente:', customerSummary.name);
      if (customerSummary.phone) console.log('WhatsApp:', customerSummary.phone);
      console.log('Forma de pagamento:', selectedPayment);
      console.log('Status da venda:', saleStatus);
      console.log('Subtotal:', formatCurrency(totals.subtotal));
      console.log('Desconto aplicado:', formatCurrency(totals.totalDiscount));
      console.log('Total final:', formatCurrency(totals.total));
      console.table(
        items.map((item) => ({
          Código: item.code,
          Produto: item.name,
          Valor: formatCurrency(item.price),
        }))
      );
      console.groupEnd();

      lastSaleSummary = {
        total: totals.total,
        customer: customerSummary.name,
        payment: selectedPayment,
        status: saleStatus,
        saleId,
      };

      if (successTotalElement) {
        const statusLabel = saleStatus === 'paid' ? 'Pago' : 'Pendente';
        successTotalElement.textContent = `Venda ${saleId} · Total: ${formatCurrency(totals.total)} (${statusLabel})`;
      }

      items.forEach((item) => {
        const normalized = normalizeProductCode(item.code);
        const product = demoProductsMap[normalized];
        if (product) {
          product.status = 'sold';
          console.log(`Estoque: ${product.code} marcado como sold e removido da vitrine.`);
        }
      });

      cart.clear();
      renderCart();
      renderProducts(searchInput?.value || '');
      if (discountInput) discountInput.value = '0';
      clearCustomerSelection();
      pixPaymentStatus = 'pending';
      lastPixTotal = null;
      if (pixStatusTimeout) {
        window.clearTimeout(pixStatusTimeout);
        pixStatusTimeout = null;
      }
      setPayment('PIX');
      saleCounter += 1;

      finishButton.dataset.loading = 'false';
      updateTotals();
      updatePixStatusUI();

      if (mainShell) mainShell.hidden = true;
      if (successSection) successSection.hidden = false;
    }, 650);
  };

  const startNewSale = () => {
    lastSaleSummary = null;
    if (successSection) successSection.hidden = true;
    if (mainShell) mainShell.hidden = false;
    if (searchInput) searchInput.focus();
    if (finishButton) {
      finishButton.dataset.loading = 'false';
    }
    clearCustomerSelection();
    pixPaymentStatus = 'pending';
    lastPixTotal = null;
    if (pixStatusTimeout) {
      window.clearTimeout(pixStatusTimeout);
      pixStatusTimeout = null;
    }
    setPayment('PIX');
    if (discountInput) discountInput.value = '0';
    renderProducts(searchInput?.value || '');
    updateTotals();
    updatePixStatusUI();
  };

  if (searchInput) {
    searchInput.addEventListener('input', (event) => renderProducts(event.target.value));
  }

  if (clientInput) {
    clientInput.addEventListener('input', (event) => handleCustomerInput(event.target.value));
    clientInput.addEventListener('focus', (event) => {
      if (event.target.value.trim()) {
        renderClientSuggestions(event.target.value);
      }
    });
    clientInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const query = clientInput.value.trim().toLowerCase();
        const match = demoCustomers.find(
          (customer) => formatCustomerOption(customer).toLowerCase() === query
        );
        if (match) selectCustomer(match);
      }
      if (event.key === 'Escape') {
        clearClientSuggestions();
      }
    });
  }

  if (clientClearButton) {
    clientClearButton.addEventListener('click', () => clearCustomerSelection(true));
  }

  if (clientRegisterButton) {
    clientRegisterButton.addEventListener('click', openRegisterModal);
  }

  if (customerZoneElement) {
    document.addEventListener('click', (event) => {
      if (!customerZoneElement.contains(event.target)) {
        clearClientSuggestions();
      }
    });
  }

  if (discountInput) {
    discountInput.addEventListener('input', updateTotals);
  }

  discountTypeButtons.forEach((button) => {
    button.addEventListener('click', () => setDiscountType(button.dataset.discountType || 'currency'));
  });

  paymentButtons.forEach((button) => {
    button.addEventListener('click', () => setPayment(button.dataset.payment || 'PIX'));
  });

  if (pixCopyButton) {
    pixCopyButton.addEventListener('click', copyPixCode);
  }

  if (pixMarkPaidButton) {
    pixMarkPaidButton.addEventListener('click', markPixAsPaid);
  }

  if (scannerOpenButton) {
    scannerOpenButton.addEventListener('click', () => {
      openScanner();
    });
  }

  if (scannerCloseButton) scannerCloseButton.addEventListener('click', closeScanner);
  if (scannerCancelButton) scannerCancelButton.addEventListener('click', closeScanner);

  if (scannerManualForm) {
    scannerManualForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = scannerManualInput?.value || '';
      handleScannedProduct(value);
      if (scannerManualInput) scannerManualInput.focus();
    });
  }

  if (scannerModal) {
    scannerModal.addEventListener('click', (event) => {
      if (event.target === scannerModal) closeScanner();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && scannerModal.classList.contains('is-visible')) {
        closeScanner();
      }
    });
  }

  if (finishButton) {
    finishButton.addEventListener('click', finalizeSale);
  }

  if (newSaleButton) {
    newSaleButton.addEventListener('click', startNewSale);
  }

  if (whatsappButton) {
    whatsappButton.addEventListener('click', () => {
      if (!lastSaleSummary) {
        alert('Finalize uma venda para enviar o recibo pelo WhatsApp.');
        return;
      }
      const statusLabel = lastSaleSummary.status === 'paid' ? 'Pago' : 'Pendente';
      const message = `Oi! Aqui está o resumo da sua compra no BIPA: venda ${lastSaleSummary.saleId} · ${formatCurrency(
        lastSaleSummary.total
      )} • Pagamento: ${lastSaleSummary.payment} (${statusLabel}).`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (!registerNameInput || !registerWhatsappInput) return;
    const name = registerNameInput.value.trim();
    const whatsapp = registerWhatsappInput.value.trim();
    if (!name || !whatsapp) {
      alert('Informe nome e WhatsApp para cadastrar o cliente.');
      return;
    }

    const phoneDigits = whatsapp.replace(/\D/g, '');
    const phoneLabel = formatPhone(whatsapp);
    const newCustomer = {
      id: `cli-${String(demoCustomers.length + 1).padStart(4, '0')}`,
      name,
      whatsapp: phoneDigits,
      phoneLabel: phoneLabel || whatsapp,
      email: '',
      tag: '',
      tagClass: '',
      subtitle: '',
      notes: '',
      history: [],
    };

    demoCustomers.push(newCustomer);
    demoCustomersMap[newCustomer.id] = newCustomer;
    closeRegisterModal();
    selectCustomer(newCustomer);
  };

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
  }

  if (registerCloseButton) registerCloseButton.addEventListener('click', closeRegisterModal);
  if (registerCancelButton) registerCancelButton.addEventListener('click', closeRegisterModal);
  if (registerModal) {
    registerModal.addEventListener('click', (event) => {
      if (event.target === registerModal) closeRegisterModal();
    });
  }

  renderProducts();
  renderCart();
  renderSelectedCustomer();
  setDiscountType('currency');
  setPayment(selectedPayment);
}

// --------- Admin nav highlight (progressive enhancement) ---------
if (page && page.startsWith('admin')) {
  const links = Array.from(document.querySelectorAll('.sidebar__link'));
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isActive = window.location.pathname.startsWith(href);
    link.classList.toggle('is-active', isActive);
  });
}
