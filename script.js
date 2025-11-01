const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

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

  const cart = new Map();
  let selectedPayment = 'PIX';

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
        Fiado: ['Associe ao cliente responsável pelo pagamento.', 'A venda entra no relatório de fiado.'],
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
        <p>Cliente: <strong>${clientInput?.value || 'Cliente Avulso'}</strong></p>
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
    cart.clear();
    renderCart();
  };

  if (searchInput) {
    searchInput.addEventListener('input', (event) => renderProducts(event.target.value));
  }

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
