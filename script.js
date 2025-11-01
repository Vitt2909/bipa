const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

const formatDate = (isoDate) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(isoDate)
  );

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
  const discountValueInput = document.getElementById('pdv-discount-value');
  const discountPercentInput = document.getElementById('pdv-discount-percent');
  const paymentButtons = Array.from(document.querySelectorAll('.payment-button'));
  const paymentDetailsElement = document.getElementById('pdv-payment-details');
  const finishButton = document.getElementById('pdv-finish');
  const modal = document.getElementById('pdv-modal');
  const modalBody = document.getElementById('pdv-modal-body');
  const modalClose = document.getElementById('pdv-modal-close');
  const modalConfirm = document.getElementById('pdv-modal-confirm');
  const clientInput = document.getElementById('pdv-client');
  const clientDatalist = document.getElementById('pdv-client-list');
  const clientResultsElement = document.getElementById('pdv-client-results');
  const clientSelectedElement = document.getElementById('pdv-client-selected');
  const clientClearButton = document.getElementById('pdv-client-clear');
  const customerPickerElement = document.querySelector('.customer-picker');

  const cart = new Map();
  let selectedPayment = 'PIX';
  let selectedCustomer = null;

  const populateClientOptions = () => {
    if (!clientDatalist) return;
    clientDatalist.innerHTML = '<option value="Cliente Avulso"></option>';
    demoCustomers.forEach((customer) => {
      const option = document.createElement('option');
      option.value = formatCustomerOption(customer);
      clientDatalist.appendChild(option);
    });
  };

  const renderSelectedCustomer = () => {
    if (!clientSelectedElement) return;
    if (selectedCustomer) {
      clientSelectedElement.innerHTML = `
        <strong>${selectedCustomer.name}</strong>
        <span>${selectedCustomer.phoneLabel}</span>
      `;
      clientSelectedElement.dataset.hasCustomer = 'true';
    } else {
      clientSelectedElement.innerHTML = `
        <strong>Cliente avulso</strong>
        <span>Venda não vinculada ao CRM.</span>
      `;
      clientSelectedElement.dataset.hasCustomer = 'false';
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
      emptyState.textContent = 'Nenhum cliente encontrado. Cadastre no módulo de gestão.';
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

  const selectCustomer = (customer) => {
    selectedCustomer = customer;
    if (clientInput) clientInput.value = formatCustomerOption(customer);
    renderSelectedCustomer();
    clearClientSuggestions();
    setPayment(selectedPayment);
  };

  const clearCustomerSelection = (focusInput = false) => {
    selectedCustomer = null;
    if (clientInput) clientInput.value = '';
    renderSelectedCustomer();
    clearClientSuggestions();
    setPayment(selectedPayment);
    if (focusInput && clientInput) clientInput.focus();
  };

  const handleCustomerInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'cliente avulso') {
      clearCustomerSelection();
      return;
    }

    const match = demoCustomers.find((customer) => formatCustomerOption(customer) === trimmed);

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
    const item = cart.get(product.code) || { ...product, quantity: 0 };
    item.quantity += 1;
    cart.set(product.code, item);
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
      const emptyState = document.createElement('p');
      emptyState.textContent = 'Nenhum item adicionado ainda. Busque uma peça e clique para incluir.';
      emptyState.className = 'pdv-empty';
      cartElement.appendChild(emptyState);
    } else {
      items.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="cart-item__info">
            <span class="cart-item__name">${item.name}</span>
            <span class="cart-item__meta">${item.code} • Tam. ${item.size}</span>
          </div>
          <div>
            <strong>${item.quantity}x</strong>
            <div>${formatCurrency(item.quantity * item.price)}</div>
          </div>
          <button class="cart-item__remove" aria-label="Remover" type="button">×</button>
        `;
        cartItem.querySelector('.cart-item__remove').addEventListener('click', () => removeFromCart(item.code));
        cartElement.appendChild(cartItem);
      });
    }

    updateTotals();
  };

  const getSubtotal = () => Array.from(cart.values()).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateTotals = () => {
    const subtotal = getSubtotal();
    const discountValue = Math.max(Number(discountValueInput?.value) || 0, 0);
    const discountPercent = Math.min(Math.max(Number(discountPercentInput?.value) || 0, 0), 100);
    const percentValue = (subtotal * discountPercent) / 100;
    const totalDiscount = Math.min(subtotal, discountValue + percentValue);
    const total = Math.max(subtotal - totalDiscount, 0);

    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (totalDiscountElement) totalDiscountElement.textContent = formatCurrency(totalDiscount);
    if (totalElement) totalElement.textContent = formatCurrency(total);
  };

  const setPayment = (method) => {
    selectedPayment = method;
    paymentButtons.forEach((button) => {
      const isActive = button.dataset.payment === method;
      button.classList.toggle('is-active', isActive);
    });

    if (paymentDetailsElement) {
      const messages = {
        PIX: ['Chave da loja: pix@bipa.demo', 'Confirme a transferência antes de concluir.'],
        Dinheiro: ['Prepare o troco necessário.', 'Registre o valor recebido para fechar o caixa.'],
        Cartão: ['Use o POS integrado ao BIPA.', 'Confirme a aprovação da operadora.'],
        Fiado: [
          selectedCustomer
            ? `Venda vinculada a ${selectedCustomer.name}. Acompanhe em Clientes > Fiado.`
            : 'Selecione um cliente para controlar o fiado.',
          'A venda entra no relatório de fiado.',
        ],
      };
      const lines = messages[method] || [];
      paymentDetailsElement.innerHTML = `
        <h3>Forma selecionada: ${method}</h3>
        ${lines.map((line) => `<p>${line}</p>`).join('')}
      `;
    }
  };

  const openModal = () => {
    if (!modal || !modalBody) return;
    const items = Array.from(cart.values());
    if (items.length === 0) {
      alert('Adicione ao menos um item antes de finalizar.');
      return;
    }

    const subtotal = getSubtotal();
    const discountValue = Math.max(Number(discountValueInput?.value) || 0, 0);
    const discountPercent = Math.min(Math.max(Number(discountPercentInput?.value) || 0, 0), 100);
    const percentValue = (subtotal * discountPercent) / 100;
    const totalDiscount = Math.min(subtotal, discountValue + percentValue);
    const total = Math.max(subtotal - totalDiscount, 0);

    const customerSummary = selectedCustomer
      ? `${selectedCustomer.name} (${selectedCustomer.phoneLabel})`
      : 'Cliente Avulso';

    modalBody.innerHTML = `
      <div>
        <h3>Resumo da venda</h3>
        <ul>
          ${items
            .map(
              (item) => `<li>${item.quantity}x ${item.name} (${item.code}) — ${formatCurrency(item.quantity * item.price)}</li>`
            )
            .join('')}
        </ul>
      </div>
      <div>
        <h3>Pagamentos</h3>
        <p>Forma: <strong>${selectedPayment}</strong></p>
        <p>Cliente: <strong>${customerSummary}</strong></p>
        ${
          selectedCustomer
            ? `<p>ID do cliente: <code>${selectedCustomer.id}</code></p>`
            : '<p>Esta venda ficará registrada como avulsa.</p>'
        }
        <p>Desconto aplicado: ${formatCurrency(totalDiscount)}</p>
        <p>Total final: <strong>${formatCurrency(total)}</strong></p>
      </div>
    `;

    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  };

  const confirmSale = () => {
    closeModal();
    alert('Venda registrada com sucesso na conta demo!');
    if (selectedCustomer) {
      console.table({
        'Customer ID': selectedCustomer.id,
        Nome: selectedCustomer.name,
        WhatsApp: selectedCustomer.phoneLabel,
      });
    }
    cart.clear();
    renderCart();
    clearCustomerSelection();
  };

  if (searchInput) {
    searchInput.addEventListener('input', (event) => renderProducts(event.target.value));
  }

  if (clientInput) {
    clientInput.setAttribute('aria-controls', 'pdv-client-results');
    clientInput.setAttribute('aria-haspopup', 'listbox');
    clientInput.setAttribute('aria-expanded', 'false');
    clientInput.addEventListener('input', (event) => handleCustomerInput(event.target.value));
    clientInput.addEventListener('focus', (event) => {
      if (event.target.value.trim()) {
        renderClientSuggestions(event.target.value);
      }
    });
    clientInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const trimmed = clientInput.value.trim();
        const match = demoCustomers.find((customer) => formatCustomerOption(customer) === trimmed);
        if (match) {
          event.preventDefault();
          selectCustomer(match);
        }
      }
      if (event.key === 'Escape') {
        clearClientSuggestions();
      }
    });
  }

  if (clientClearButton) {
    clientClearButton.addEventListener('click', () => clearCustomerSelection(true));
  }

  if (customerPickerElement) {
    document.addEventListener('click', (event) => {
      if (!customerPickerElement.contains(event.target)) {
        clearClientSuggestions();
      }
    });
  }

  populateClientOptions();
  renderSelectedCustomer();
  setPayment(selectedPayment);

  if (discountValueInput) discountValueInput.addEventListener('input', updateTotals);
  if (discountPercentInput) discountPercentInput.addEventListener('input', updateTotals);
  if (finishButton) finishButton.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalConfirm) modalConfirm.addEventListener('click', confirmSale);
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  }

  paymentButtons.forEach((button) =>
    button.addEventListener('click', () => setPayment(button.dataset.payment || 'PIX'))
  );

  renderProducts();
  renderCart();
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
