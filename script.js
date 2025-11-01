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

const marketplaceListings = [
  {
    id: 'mp-0001',
    title: 'Jaqueta Jeans Oversized Vintage',
    description: 'Lavagem média com bordados exclusivos e modelagem ampla.',
    category: 'Jaquetas',
    size: 'M',
    condition: 'Como novo',
    price: 189.9,
    inventory: 64,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=60',
    seller: 'Brechó da Ana',
    location: 'São Paulo, SP',
    postedAt: '2024-09-09',
    highlight: 'Hot agora',
    offers: 420,
    watchers: 1180,
    tags: ['Denim', 'Unissex'],
  },
  {
    id: 'mp-0002',
    title: 'Vestido Midi Floral Enjoei Edition',
    description: 'Modelo fluido com decote reto, tecido leve e bolso invisível.',
    category: 'Vestidos',
    size: 'P',
    condition: 'Novo com etiqueta',
    price: 239.0,
    inventory: 58,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=720&q=60',
    seller: 'Closet da Bia',
    location: 'Rio de Janeiro, RJ',
    postedAt: '2024-09-08',
    highlight: 'Novo com etiqueta',
    offers: 360,
    watchers: 960,
    tags: ['Romântico', 'Eventos'],
  },
  {
    id: 'mp-0003',
    title: 'Blazer Alfaiataria Verde Esmeralda',
    description: 'Corte reto, botões em madrepérola e forro acetinado.',
    category: 'Blazers',
    size: 'G',
    condition: 'Como novo',
    price: 259.9,
    inventory: 54,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&q=60',
    seller: 'Studio Circular',
    location: 'São Paulo, SP',
    postedAt: '2024-09-07',
    highlight: 'Favorito da semana',
    offers: 310,
    watchers: 870,
    tags: ['Executivo', 'Consignado'],
  },
  {
    id: 'mp-0004',
    title: 'Calça Wide Leg Linho Orgânico',
    description: 'Cintura alta, botão de coco reaproveitado e tingimento natural.',
    category: 'Calças',
    size: 'M',
    condition: 'Usado com amor',
    price: 179.9,
    inventory: 48,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=720&q=60',
    seller: 'Brechó Horizonte',
    location: 'Belo Horizonte, MG',
    postedAt: '2024-09-05',
    offers: 280,
    watchers: 640,
    tags: ['Linho', 'Comfort'],
  },
  {
    id: 'mp-0005',
    title: 'Bolsa Bucket Couro Upcycling',
    description: 'Peça única confeccionada a partir de couro reaproveitado.',
    category: 'Acessórios',
    size: 'Único',
    condition: 'Como novo',
    price: 329.0,
    inventory: 46,
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=720&q=60',
    seller: 'Ateliê Circular',
    location: 'Curitiba, PR',
    postedAt: '2024-09-06',
    highlight: 'Peça única',
    offers: 260,
    watchers: 520,
    tags: ['Artesanal', 'Vegano'],
  },
  {
    id: 'mp-0006',
    title: 'Tênis Vintage 90s Branco',
    description: 'Tênis raro com sola restaurada e palmilha biodegradável.',
    category: 'Calçados',
    size: '38',
    condition: 'Usado com amor',
    price: 219.5,
    inventory: 52,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=720&q=60',
    seller: 'Sneaker Lovers BR',
    location: 'Porto Alegre, RS',
    postedAt: '2024-09-04',
    offers: 240,
    watchers: 480,
    tags: ['Street', 'Unissex'],
  },
  {
    id: 'mp-0007',
    title: 'Cardigã Tricot Handmade',
    description: 'Produção colaborativa com fios recuperados, caimento oversized.',
    category: 'Malhas',
    size: 'GG',
    condition: 'Usado com amor',
    price: 159.0,
    inventory: 38,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&q=60',
    seller: 'Casa do Tricô Circular',
    location: 'Florianópolis, SC',
    postedAt: '2024-09-03',
    offers: 220,
    watchers: 360,
    tags: ['Artesanal', 'Inverno'],
  },
  {
    id: 'mp-0008',
    title: 'Saia Midi Plissada Metalizada',
    description: 'Peça statement com elástico confortável e brilho acetinado.',
    category: 'Saias',
    size: 'P',
    condition: 'Como novo',
    price: 189.0,
    inventory: 60,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=720&q=60',
    seller: 'Brechó Futuro',
    location: 'Recife, PE',
    postedAt: '2024-09-02',
    offers: 220,
    watchers: 410,
    tags: ['Festivo', 'Consignado'],
  },
];

const body = document.body;
const page = body.dataset.page;

const APPEARANCE_STORAGE_KEY = 'bipa:appearance';
const rootElement = document.documentElement;

const applyAppearance = (mode) => {
  const normalized = mode === 'light' ? 'light' : 'dark';
  body.dataset.appearance = normalized;
  if (rootElement) {
    rootElement.style.setProperty('color-scheme', normalized);
  }
  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.setAttribute('aria-pressed', normalized === 'light' ? 'true' : 'false');
    const label = toggle.querySelector('.theme-toggle__label');
    if (label) {
      label.textContent = normalized === 'light' ? 'Alternar modo escuro' : 'Alternar modo claro';
      toggle.setAttribute('aria-label', label.textContent);
    }
    const icon = toggle.querySelector('.theme-toggle__icon');
    if (icon) {
      icon.textContent = normalized === 'light' ? '☀️' : '🌗';
    }
  }
  return normalized;
};

const detectPreferredAppearance = () => {
  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    // localStorage indisponível, segue fluxo padrão
  }

  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  if (mediaQuery && mediaQuery.matches) {
    return 'light';
  }
  return 'dark';
};

const persistAppearance = (mode) => {
  const normalized = applyAppearance(mode);
  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, normalized);
  } catch (error) {
    // Ignora se não for possível persistir
  }
};

const initializeAppearanceToggle = () => {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const nextMode = body.dataset.appearance === 'light' ? 'dark' : 'light';
    persistAppearance(nextMode);
  });
};

const initializeAppearance = () => {
  const initial = detectPreferredAppearance();
  applyAppearance(initial);
  initializeAppearanceToggle();

  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  if (mediaQuery) {
    const handleChange = (event) => {
      const stored = (() => {
        try {
          return window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
        } catch (error) {
          return null;
        }
      })();
      if (stored === 'light' || stored === 'dark') {
        return;
      }
      applyAppearance(event.matches ? 'light' : 'dark');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
    }
  }
};

initializeAppearance();

const initializeStepForms = () => {
  const forms = Array.from(document.querySelectorAll('[data-step-form]'));

  forms.forEach((form) => {
    const rawSteps = Array.from(form.querySelectorAll('[data-step-index]'));
    if (!rawSteps.length) {
      return;
    }

    const steps = rawSteps
      .map((step) => ({ step, index: Number(step.dataset.stepIndex) || 0 }))
      .sort((a, b) => a.index - b.index)
      .map((entry, sortedIndex) => {
        entry.step.dataset.stepIndex = String(sortedIndex);
        return entry.step;
      });

    const totalSteps = steps.length;
    let currentIndex = 0;

    const progressItems = Array.from(form.querySelectorAll('[data-step-progress-item]'));
    progressItems.forEach((item, index) => {
      if (index >= totalSteps) {
        item.hidden = true;
        return;
      }
      item.hidden = false;
      item.dataset.stepIndex = String(index);
      item.setAttribute('role', 'listitem');
    });

    const prevButton = form.querySelector('[data-step-prev]');
    const nextButton = form.querySelector('[data-step-next]');
    const submitButton = form.querySelector('[data-step-submit]');

    const focusStep = (step) => {
      if (!step) return;
      const focusable =
        step.querySelector('[data-autofocus]') ||
        step.querySelector(
          'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        );
      if (focusable && typeof focusable.focus === 'function') {
        window.setTimeout(() => {
          try {
            focusable.focus({ preventScroll: false });
          } catch (error) {
            focusable.focus();
          }
        }, 80);
      }
    };

    const dispatchChange = () => {
      const step = steps[currentIndex];
      form.dataset.stepCurrent = String(currentIndex);
      form.dataset.stepTotal = String(totalSteps);
      form.dispatchEvent(
        new CustomEvent('step:change', {
          detail: { index: currentIndex, step, totalSteps },
        })
      );
    };

    const syncControls = () => {
      if (prevButton) {
        const hidden = currentIndex === 0;
        prevButton.hidden = hidden;
        prevButton.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      }
      if (nextButton) {
        const hidden = currentIndex >= totalSteps - 1;
        nextButton.hidden = hidden;
        nextButton.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      }
      if (submitButton) {
        const hidden = currentIndex < totalSteps - 1;
        submitButton.hidden = hidden;
        submitButton.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      }
    };

    const syncProgress = () => {
      progressItems.forEach((item, index) => {
        if (index >= totalSteps) {
          return;
        }
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        item.classList.toggle('is-active', isActive);
        item.classList.toggle('is-complete', isComplete);
        item.setAttribute('aria-current', isActive ? 'step' : 'false');
        const step = steps[index];
        const label = step?.dataset.stepLabel;
        if (label) {
          item.setAttribute('aria-label', `Etapa ${index + 1}: ${label}`);
        }
      });
    };

    const showStep = (targetIndex, { focus = true } = {}) => {
      const clamped = Math.max(0, Math.min(targetIndex, totalSteps - 1));
      currentIndex = clamped;

      steps.forEach((step, index) => {
        const isActive = index === currentIndex;
        if (isActive) {
          step.hidden = false;
          step.setAttribute('aria-hidden', 'false');
        } else {
          step.hidden = true;
          step.setAttribute('aria-hidden', 'true');
        }
      });

      syncControls();
      syncProgress();
      dispatchChange();

      if (focus) {
        focusStep(steps[currentIndex]);
      }
    };

    const validateStep = (index) => {
      const step = steps[index];
      if (!step) {
        return true;
      }

      const validationEvent = new CustomEvent('step:validate', {
        detail: { index, step, form },
        cancelable: true,
      });

      if (!form.dispatchEvent(validationEvent)) {
        return false;
      }

      const inputs = Array.from(
        step.querySelectorAll('input, select, textarea')
      ).filter((element) => !element.disabled && element.type !== 'hidden');

      let firstInvalid = null;

      inputs.forEach((input) => {
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
        const ariaInvalid = input.getAttribute('aria-invalid') === 'true';
        const nativeInvalid = typeof input.checkValidity === 'function' ? !input.checkValidity() : false;
        if ((ariaInvalid || nativeInvalid) && !firstInvalid) {
          firstInvalid = input;
        }
      });

      if (firstInvalid && typeof firstInvalid.focus === 'function') {
        try {
          firstInvalid.focus({ preventScroll: false });
        } catch (error) {
          firstInvalid.focus();
        }
        return false;
      }

      return true;
    };

    if (nextButton) {
      nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!validateStep(currentIndex)) {
          return;
        }
        showStep(currentIndex + 1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', (event) => {
        event.preventDefault();
        showStep(currentIndex - 1);
      });
    }

    progressItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const index = Number(item.dataset.stepIndex);
        if (Number.isNaN(index) || index === currentIndex) {
          return;
        }
        if (index > currentIndex && !validateStep(currentIndex)) {
          return;
        }
        showStep(index);
      });
    });

    showStep(0, { focus: false });
  });
};

initializeStepForms();

const formatCustomerOption = (customer) => `${customer.name} · ${customer.phoneLabel}`;

// --------- Create store ---------
if (page === 'create-store') {
  const form = document.querySelector('.auth-form');
  const statusElement = document.getElementById('create-store-status');
  const submitButton = form?.querySelector('[type="submit"]');
  const requiredInputs = form ? Array.from(form.querySelectorAll('input[required]')) : [];
  const phoneInput = form?.querySelector('input[name="owner-phone"]');

  const statusVariants = ['auth-form__status--error', 'auth-form__status--success', 'auth-form__status--info'];

  const getFieldLabel = (input) => {
    const field = input.closest('.form-field');
    const label = field?.querySelector('.form-label');
    return label?.textContent?.trim() || input.name;
  };

  const setFieldError = (input, message) => {
    const field = input.closest('.form-field');
    const feedback = field?.querySelector('.form-field__feedback');
    const hasError = Boolean(message);
    field?.classList.toggle('form-field--error', hasError);
    if (hasError) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
    if (feedback) {
      feedback.textContent = message || '';
      feedback.hidden = !hasError;
    }
  };

  const showStatus = (message, variant) => {
    if (!statusElement) return;
    statusVariants.forEach((className) => statusElement.classList.remove(className));
    if (!message) {
      statusElement.hidden = true;
      statusElement.textContent = '';
      return;
    }
    statusElement.hidden = false;
    if (variant && statusVariants.includes(`auth-form__status--${variant}`)) {
      statusElement.classList.add(`auth-form__status--${variant}`);
    }
    statusElement.textContent = message;
  };

  const validateInput = (input) => {
    const value = input.value.trim();
    const label = getFieldLabel(input);
    if (!value) {
      return `Preencha o campo "${label}".`;
    }
    if (input.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(value.toLowerCase())) {
        return 'Informe um email válido.';
      }
    }
    if (input.type === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) {
        return 'Informe um telefone com DDD (10 ou 11 dígitos).';
      }
    }
    return '';
  };

  const handleInputValidation = (input) => {
    const message = validateInput(input);
    setFieldError(input, message);
    return message;
  };

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const digits = phoneInput.value.replace(/\D/g, '');
      if (digits.length >= 10 && digits.length <= 11) {
        phoneInput.value = formatPhone(digits);
      }
    });
  }

  requiredInputs.forEach((input) => {
    input.addEventListener('blur', () => handleInputValidation(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        handleInputValidation(input);
      }
      if (statusElement && statusElement.classList.contains('auth-form__status--error')) {
        showStatus('', null);
      }
    });
  });

  if (form) {
    form.addEventListener('step:change', () => {
      if (statusElement && statusElement.classList.contains('auth-form__status--error')) {
        showStatus('', null);
      }
    });

    form.addEventListener('step:validate', (event) => {
      const stepElement = event.detail?.step;
      if (!stepElement) {
        return;
      }
      const stepInputs = requiredInputs.filter((input) => stepElement.contains(input));
      if (!stepInputs.length) {
        return;
      }

      let firstInvalid = null;
      const errors = stepInputs
        .map((input) => {
          const message = handleInputValidation(input);
          if (message && !firstInvalid) {
            firstInvalid = input;
          }
          return message;
        })
        .filter(Boolean);

      if (errors.length) {
        event.preventDefault();
        showStatus('Revise os campos destacados antes de continuar.', 'error');
        if (firstInvalid) {
          window.setTimeout(() => firstInvalid.focus(), 50);
        }
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let firstInvalid = null;
      const errors = requiredInputs
        .map((input) => {
          const errorMessage = handleInputValidation(input);
          if (errorMessage && !firstInvalid) firstInvalid = input;
          return errorMessage;
        })
        .filter(Boolean);

      if (errors.length) {
        showStatus('Revise os campos destacados antes de enviar.', 'error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.loading = 'true';
        submitButton.textContent = 'Enviando...';
      }
      showStatus('Enviando pedido de criação...', 'info');

      const formData = new FormData(form);
      const storeName = (formData.get('store-name') || '').toString().trim();
      const ownerName = (formData.get('owner-name') || '').toString().trim();
      const ownerEmail = (formData.get('owner-email') || '').toString().trim();
      const ownerPhone = (formData.get('owner-phone') || '').toString().trim();
      const segment = (formData.get('segment') || '').toString().trim();
      const formattedPhone = formatPhone(ownerPhone);

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.dataset.loading = 'false';
          submitButton.textContent = 'Solicitar criação';
        }
        form.reset();
        requiredInputs.forEach((input) => setFieldError(input, ''));
        const firstProgress = form.querySelector('[data-step-progress-item]');
        if (firstProgress) {
          firstProgress.click();
        }
        const segmentNote = segment ? ` do segmento ${segment}` : '';
        const phoneLabel = formattedPhone || ownerPhone;
        showStatus(
          `Recebemos o pedido da loja ${storeName}${segmentNote}. ${ownerName}, entraremos em contato pelo ${
            phoneLabel || 'telefone informado'
          } e enviaremos as instruções para ${ownerEmail}.`,
          'success'
        );
        if (requiredInputs[0]) {
          requiredInputs[0].focus();
        }
      }, 800);
    });
  }
}

// --------- Login ---------
if (page === 'login') {
  const form = document.querySelector('.auth-form');
  const summary = document.getElementById('login-error-summary');
  const summaryList = summary?.querySelector('ul');
  const summaryTitle = summary?.querySelector('strong');
  const submitButton = form?.querySelector('[type="submit"]');
  const forgotPasswordLink = form?.querySelector('[data-forgot-password]');

  const buildFieldController = (selector) => {
    const fieldElement = form?.querySelector(selector);
    if (!fieldElement) return null;
    const input = fieldElement.querySelector('input, select, textarea');
    const label = fieldElement.querySelector('.form-label')?.textContent?.trim() || '';
    const feedback = fieldElement.querySelector('.form-field__feedback');
    return { fieldElement, input, label, feedback };
  };

  const emailField = buildFieldController('[data-field="email"]');
  const passwordField = buildFieldController('[data-field="password"]');
  const fieldControllers = [emailField, passwordField].filter(Boolean);

  const showSummary = (variant, title, messages) => {
    if (!summary || !summaryList) return;
    const normalizedVariant = ['success', 'info'].includes(variant) ? variant : 'error';
    summary.dataset.variant = normalizedVariant;
    summary.classList.remove('form-errors--success', 'form-errors--info');
    if (normalizedVariant === 'success') {
      summary.classList.add('form-errors--success');
    } else if (normalizedVariant === 'info') {
      summary.classList.add('form-errors--info');
    }

    summary.setAttribute('role', normalizedVariant === 'error' ? 'alert' : 'status');

    summary.hidden = false;
    if (summaryTitle) {
      summaryTitle.textContent = title;
    }

    summaryList.innerHTML = '';
    (messages || []).forEach((message) => {
      if (!message) return;
      const item = document.createElement('li');
      item.textContent = message;
      summaryList.appendChild(item);
    });
  };

  const clearSummary = () => {
    if (!summary || !summaryList) return;
    summary.hidden = true;
    summary.dataset.variant = '';
    summary.classList.remove('form-errors--success', 'form-errors--info');
    summary.setAttribute('role', 'alert');
    if (summaryTitle) {
      summaryTitle.textContent = '';
    }
    summaryList.innerHTML = '';
  };

  const setFieldState = (controller, message) => {
    if (!controller || !controller.fieldElement || !controller.input) return;
    const hasMessage = Boolean(message);
    const trimmedValue = controller.input.value.trim();
    const hasValue = trimmedValue.length > 0;

    controller.fieldElement.classList.toggle('form-field--error', hasMessage);
    controller.fieldElement.classList.toggle('form-field--success', !hasMessage && hasValue);

    if (hasMessage) {
      controller.input.setAttribute('aria-invalid', 'true');
    } else {
      controller.input.removeAttribute('aria-invalid');
    }

    if (controller.feedback) {
      if (hasMessage) {
        controller.feedback.textContent = message;
        controller.feedback.hidden = false;
      } else if (hasValue) {
        controller.feedback.textContent = 'Tudo certo.';
        controller.feedback.hidden = false;
      } else {
        controller.feedback.textContent = '';
        controller.feedback.hidden = true;
      }
    }
  };

  const validateEmailField = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Informe seu email ou usuário.';
    }
    if (trimmed.includes('@')) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(trimmed.toLowerCase())) {
        return 'Informe um email válido.';
      }
    } else if (trimmed.length < 3) {
      return 'O usuário deve ter pelo menos 3 caracteres.';
    }
    return '';
  };

  const validatePasswordField = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Informe sua senha.';
    }
    if (trimmed.length < 6) {
      return 'A senha deve conter pelo menos 6 caracteres.';
    }
    return '';
  };

  const validators = new Map([
    [emailField, validateEmailField],
    [passwordField, validatePasswordField],
  ]);

  const validateController = (controller) => {
    if (!controller || !controller.input) return '';
    const validator = validators.get(controller);
    const message = validator ? validator(controller.input.value) : '';
    setFieldState(controller, message);
    if (!message) {
      return '';
    }
    const labelPrefix = controller.label ? `${controller.label}: ` : '';
    return `${labelPrefix}${message}`;
  };

  if (form) {
    form.setAttribute('novalidate', 'novalidate');
    fieldControllers.forEach((controller) => {
      if (!controller.input) return;
      controller.input.addEventListener('blur', () => {
        const message = validateController(controller);
        if (message) {
          showSummary('error', 'Revise os campos informados', [message]);
        }
      });

      controller.input.addEventListener('input', () => {
        validateController(controller);
        if (summary && summary.dataset.variant === 'error') {
          clearSummary();
        }
      });
    });

    form.addEventListener('step:change', () => {
      if (summary && summary.dataset.variant === 'error') {
        clearSummary();
      }
    });

    form.addEventListener('step:validate', (event) => {
      const stepElement = event.detail?.step;
      if (!stepElement) {
        return;
      }
      const stepControllers = fieldControllers.filter((controller) =>
        controller?.fieldElement ? stepElement.contains(controller.fieldElement) : false
      );
      if (!stepControllers.length) {
        return;
      }

      const messages = stepControllers.map((controller) => validateController(controller)).filter(Boolean);

      if (messages.length) {
        event.preventDefault();
        showSummary('error', 'Revise os campos informados', messages);
        const firstInvalid = stepControllers.find((controller) => controller.fieldElement?.classList.contains('form-field--error'));
        if (firstInvalid?.input) {
          window.setTimeout(() => firstInvalid.input.focus(), 50);
        }
      }
    });

    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSummary('info', 'Precisa redefinir a senha?', [
          'Envie uma solicitação para suporte@bipa.app ou procure o administrador da sua loja.',
        ]);
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const messages = fieldControllers
        .map((controller) => validateController(controller))
        .filter((message) => Boolean(message));

      if (messages.length) {
        showSummary('error', 'Corrija os campos destacados', messages);
        const firstInvalid = fieldControllers.find((controller) => controller.fieldElement?.classList.contains('form-field--error'));
        if (firstInvalid?.input) {
          firstInvalid.input.focus();
        }
        return;
      }

      showSummary('info', 'Validando credenciais…', ['Estamos confirmando seus dados com segurança.']);

      if (submitButton) {
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
      }

      window.setTimeout(() => {
        showSummary('success', 'Tudo certo!', ['Redirecionando você para o painel principal.']);
        window.setTimeout(() => {
          window.location.href = '/app/selecionar-modulo/';
        }, 500);
      }, 600);
    });
  }
}

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

// --------- Marketplace ---------
if (page === 'marketplace') {
  const listingsElement = document.getElementById('marketplace-listings');
  const resultsCountElement = document.getElementById('marketplace-results-count');
  const categorySelect = document.getElementById('marketplace-filter-category');
  const sizeSelect = document.getElementById('marketplace-filter-size');
  const conditionSelect = document.getElementById('marketplace-filter-condition');
  const locationSelect = document.getElementById('marketplace-filter-location');
  const priceInput = document.getElementById('marketplace-filter-price');
  const priceOutput = document.getElementById('marketplace-filter-price-output');
  const searchInput = document.getElementById('marketplace-search-input');
  const filtersForm = document.getElementById('marketplace-filters');
  const latestList = document.getElementById('marketplace-latest');
  const activeMetric = document.getElementById('marketplace-metric-active');
  const offersMetric = document.getElementById('marketplace-metric-offers');
  const ticketMetric = document.getElementById('marketplace-metric-ticket');

  if (listingsElement && resultsCountElement && filtersForm) {
    const baseSizeOptions = new Set();
    if (sizeSelect) {
      Array.from(sizeSelect.options).forEach((option) => {
        if (option.value) baseSizeOptions.add(option.value);
      });
    }

    const categories = Array.from(new Set(marketplaceListings.map((item) => item.category))).sort();
    categories.forEach((category) => {
      if (!categorySelect) return;
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    const sizes = Array.from(new Set(marketplaceListings.map((item) => item.size))).sort();
    sizes.forEach((size) => {
      if (!sizeSelect || baseSizeOptions.has(size)) return;
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });

    const locations = Array.from(new Set(marketplaceListings.map((item) => item.location))).sort();
    locations.forEach((location) => {
      if (!locationSelect) return;
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      locationSelect.appendChild(option);
    });

    const renderListings = (items) => {
      listingsElement.innerHTML = '';

      if (!items.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'storefront__empty';
        emptyState.textContent = 'Nenhuma peça encontrada com os filtros aplicados. Tente ajustar sua busca.';
        listingsElement.appendChild(emptyState);
        return;
      }

      items.forEach((listing) => {
        const card = document.createElement('article');
        card.className = 'listing-card';
        card.setAttribute('role', 'listitem');
        const price = formatCurrency(listing.price);
        const tags = (listing.tags || []).map((tag) => `<span class="chip">${tag}</span>`).join('');
        const stats = [
          Number.isFinite(Number(listing.offers))
            ? `${Number(listing.offers).toLocaleString('pt-BR')} propostas`
            : '',
          Number.isFinite(Number(listing.inventory))
            ? `${Number(listing.inventory).toLocaleString('pt-BR')} peças no lote`
            : '',
          Number.isFinite(Number(listing.watchers))
            ? `${Number(listing.watchers).toLocaleString('pt-BR')} favoritos`
            : '',
        ]
          .filter(Boolean)
          .map((text) => `<span>${text}</span>`)
          .join('');
        card.innerHTML = `
          <div class="listing-card__image" style="background-image: url('${listing.image}')">
            ${listing.highlight ? `<span class="listing-card__tag">${listing.highlight}</span>` : ''}
          </div>
          <div class="listing-card__body">
            <h3 class="listing-card__title">${listing.title}</h3>
            <div class="listing-card__meta">
              <span>${listing.category}</span>
              <span>Tam. ${listing.size}</span>
              <span>${listing.condition}</span>
              <span>${listing.location}</span>
            </div>
            <strong class="listing-card__price">${price}</strong>
            <span class="listing-card__seller">por ${listing.seller}</span>
            ${stats ? `<div class="listing-card__meta">${stats}</div>` : ''}
            ${tags ? `<div class="listing-card__meta">${tags}</div>` : ''}
            <div class="listing-card__actions">
              <a class="btn btn--primary btn--small" href="#">Fazer proposta</a>
              <a class="btn btn--ghost btn--small" href="#">Abrir chat seguro</a>
            </div>
          </div>
        `;
        listingsElement.appendChild(card);
      });
    };

    const updateResults = () => {
      const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const category = categorySelect ? categorySelect.value : '';
      const size = sizeSelect ? sizeSelect.value : '';
      const condition = conditionSelect ? conditionSelect.value : '';
      const location = locationSelect ? locationSelect.value : '';
      const maxPrice = priceInput ? Number(priceInput.value) : Number.POSITIVE_INFINITY;

      const filtered = marketplaceListings.filter((listing) => {
        const matchesSearch = !searchTerm
          || listing.title.toLowerCase().includes(searchTerm)
          || (listing.description || '').toLowerCase().includes(searchTerm)
          || (listing.seller || '').toLowerCase().includes(searchTerm);
        const matchesCategory = !category || listing.category === category;
        const matchesSize = !size || listing.size === size;
        const matchesCondition = !condition || listing.condition === condition;
        const matchesLocation = !location || listing.location === location;
        const matchesPrice = !Number.isFinite(maxPrice) ? true : Number(listing.price) <= maxPrice;
        return (
          matchesSearch &&
          matchesCategory &&
          matchesSize &&
          matchesCondition &&
          matchesLocation &&
          matchesPrice
        );
      });

      renderListings(filtered);

      if (resultsCountElement) {
        if (filtered.length) {
          resultsCountElement.textContent = `Mostrando ${filtered.length} de ${marketplaceListings.length} peças disponíveis`;
        } else {
          resultsCountElement.textContent = 'Nenhuma peça encontrada com os filtros selecionados';
        }
      }
    };

    if (priceOutput && priceInput) {
      const updatePriceOutput = () => {
        const value = Number(priceInput.value);
        const formatted = Number.isFinite(value) ? formatCurrency(value) : formatCurrency(priceInput.max || 0);
        priceOutput.textContent = `Até ${formatted}`;
      };
      updatePriceOutput();
      priceInput.addEventListener('input', () => {
        updatePriceOutput();
        updateResults();
      });
    }

    if (searchInput) searchInput.addEventListener('input', () => updateResults());
    if (categorySelect) categorySelect.addEventListener('change', () => updateResults());
    if (sizeSelect) sizeSelect.addEventListener('change', () => updateResults());
    if (conditionSelect) conditionSelect.addEventListener('change', () => updateResults());
    if (locationSelect) locationSelect.addEventListener('change', () => updateResults());

    filtersForm.addEventListener('reset', () => {
      window.setTimeout(() => {
        if (priceInput && priceOutput) {
          priceInput.value = priceInput.max || priceInput.value;
          const formatted = formatCurrency(priceInput.value);
          priceOutput.textContent = `Até ${formatted}`;
        }
        updateResults();
      }, 0);
    });

    if (activeMetric) {
      const totalPieces = marketplaceListings.reduce(
        (total, listing) => total + (Number(listing.inventory) || 1),
        0
      );
      activeMetric.textContent = totalPieces.toLocaleString('pt-BR');
    }

    if (offersMetric) {
      const totalOffers = marketplaceListings.reduce((total, listing) => total + (Number(listing.offers) || 0), 0);
      offersMetric.textContent = totalOffers.toLocaleString('pt-BR');
    }

    if (ticketMetric) {
      const totalValue = marketplaceListings.reduce((total, listing) => total + (Number(listing.price) || 0), 0);
      const average = marketplaceListings.length ? totalValue / marketplaceListings.length : 0;
      ticketMetric.textContent = formatCurrency(average);
    }

    if (latestList) {
      latestList.innerHTML = '';
      const latestItems = [...marketplaceListings]
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
        .slice(0, 3);
      latestItems.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.title}</strong><span>${formatCurrency(item.price)} · ${item.location}</span>`;
        latestList.appendChild(li);
      });
    }

    updateResults();
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
  const registerNameFeedback = document.getElementById('pdv-register-name-feedback');
  const registerWhatsappFeedback = document.getElementById('pdv-register-whatsapp-feedback');
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

  const setRegisterFeedback = (input, feedback, message) => {
    if (!input || !feedback) return;
    const hasMessage = Boolean(message);
    if (hasMessage) {
      feedback.textContent = message;
      feedback.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      feedback.textContent = '';
      feedback.hidden = true;
      input.removeAttribute('aria-invalid');
    }
  };

  const validateRegisterName = () => {
    if (!registerNameInput) return true;
    const value = registerNameInput.value.trim();
    registerNameInput.value = value;
    const message = value ? '' : 'Informe o nome do cliente.';
    setRegisterFeedback(registerNameInput, registerNameFeedback, message);
    return !message;
  };

  const validateRegisterWhatsapp = () => {
    if (!registerWhatsappInput) return true;
    const raw = registerWhatsappInput.value.trim();
    const digits = raw.replace(/\D/g, '');
    let message = '';
    if (!digits) {
      message = 'Informe o WhatsApp do cliente.';
    } else if (digits.length < 10 || digits.length > 11) {
      message = 'Inclua o DDD com 10 ou 11 dígitos.';
    }

    if (!message) {
      registerWhatsappInput.value = formatPhone(digits);
    }

    setRegisterFeedback(registerWhatsappInput, registerWhatsappFeedback, message);
    return !message;
  };

  if (registerNameInput) {
    registerNameInput.addEventListener('blur', validateRegisterName);
    registerNameInput.addEventListener('input', () => {
      if (registerNameInput.getAttribute('aria-invalid') === 'true') {
        validateRegisterName();
      }
    });
  }

  if (registerWhatsappInput) {
    registerWhatsappInput.addEventListener('blur', validateRegisterWhatsapp);
    registerWhatsappInput.addEventListener('input', () => {
      if (registerWhatsappInput.getAttribute('aria-invalid') === 'true') {
        validateRegisterWhatsapp();
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('reset', () => {
      setRegisterFeedback(registerNameInput, registerNameFeedback, '');
      setRegisterFeedback(registerWhatsappInput, registerWhatsappFeedback, '');
      const firstProgress = registerForm.querySelector('[data-step-progress-item]');
      if (firstProgress) {
        firstProgress.click();
      }
    });

    registerForm.addEventListener('step:validate', (event) => {
      const stepElement = event.detail?.step;
      if (!stepElement) return;
      let isValid = true;
      if (registerNameInput && stepElement.contains(registerNameInput)) {
        isValid = validateRegisterName();
      }
      if (registerWhatsappInput && stepElement.contains(registerWhatsappInput)) {
        isValid = validateRegisterWhatsapp() && isValid;
      }
      if (!isValid) {
        event.preventDefault();
      }
    });
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (!registerNameInput || !registerWhatsappInput) return;
    const isNameValid = validateRegisterName();
    const isWhatsappValid = validateRegisterWhatsapp();
    if (!isNameValid) {
      const prevButton = registerForm.querySelector('[data-step-prev]');
      if (prevButton && !prevButton.hidden) {
        prevButton.click();
      }
      registerNameInput.focus();
      return;
    }
    if (!isWhatsappValid) {
      registerWhatsappInput.focus();
      return;
    }

    const name = registerNameInput.value.trim();
    const whatsapp = registerWhatsappInput.value.trim();

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
