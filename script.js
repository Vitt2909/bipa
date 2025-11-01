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
  },
  {
    code: 'BR-0002',
    name: 'Vestido Midi Floral',
    category: 'Vestidos',
    size: 'M',
    price: 129.9,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60',
  },
  {
    code: 'BR-0003',
    name: 'Calça Alfaiataria Cropped',
    category: 'Calças',
    size: 'G',
    price: 219.9,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=60',
  },
  {
    code: 'BR-0004',
    name: 'Saia Plissada Grafite',
    category: 'Saias',
    size: 'P',
    price: 149.9,
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=60',
  },
  {
    code: 'BR-0005',
    name: 'Camisa Linho Relax',
    category: 'Camisas',
    size: 'M',
    price: 149.0,
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60',
  },
  {
    code: 'BR-0006',
    name: 'Blazer Alfaiataria Verde',
    category: 'Outerwear',
    size: 'G',
    price: 259.9,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60',
  },
];

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
        return matchesCategory && matchesSize;
      });

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

  const cart = new Map();
  let selectedPayment = 'PIX';
  let selectedCustomer = null;
  let discountType = 'currency';
  let lastSaleSummary = null;

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
      if (!normalizedQuery) return true;
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.code.toLowerCase().includes(normalizedQuery)
      );
    });

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
  };

  const updatePaymentContext = () => {
    if (!paymentContextElement) return;
    const lines = {
      PIX: [
        'Use a chave PIX <strong>pix@bipa.demo</strong> para receber o pagamento.',
        'Confirme o recebimento antes de finalizar a venda.',
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

    window.setTimeout(() => {
      console.groupCollapsed('📦 Nova venda registrada');
      console.log('Cliente ID:', customerSummary.id || 'Avulso');
      console.log('Cliente:', customerSummary.name);
      if (customerSummary.phone) console.log('WhatsApp:', customerSummary.phone);
      console.log('Forma de pagamento:', selectedPayment);
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
      };

      if (successTotalElement) {
        successTotalElement.textContent = `Total da venda: ${formatCurrency(totals.total)}`;
      }

      cart.clear();
      renderCart();
      if (discountInput) discountInput.value = '0';
      clearCustomerSelection();
      setPayment('PIX');

      finishButton.dataset.loading = 'false';
      updateTotals();

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
    setPayment('PIX');
    if (discountInput) discountInput.value = '0';
    updateTotals();
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
      const message = `Oi! Aqui está o resumo da sua compra no BIPA: ${formatCurrency(
        lastSaleSummary.total
      )} • Pagamento: ${lastSaleSummary.payment}.`; 
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
