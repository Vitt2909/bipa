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
        const matchesCategory = !category || category === 'todos' || listing.category === category;
        const matchesSize = !size || size === 'todos' || listing.size === size;
        const matchesCondition = !condition || condition === 'todos' || listing.condition === condition;
        const matchesLocation = !location || location === 'todos' || listing.location === location;
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
  const discountToggleButton = document.getElementById('pdv-discount-toggle');
  const discountPanel = document.getElementById('pdv-discount-panel');
  const discountCloseButton = document.getElementById('pdv-discount-close');
  const discountClearButton = document.getElementById('pdv-discount-clear');
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
  const checkoutToggleButton = document.getElementById('pdv-cart-toggle');
  const checkoutToggleMeta = document.getElementById('pdv-cart-toggle-meta');
  const checkoutBackButton = document.getElementById('pdv-checkout-back');
  const successSection = document.getElementById('pdv-success');
  const successTotalElement = document.getElementById('pdv-success-total');
  const newSaleButton = document.getElementById('pdv-success-new-sale');
  const whatsappButton = document.getElementById('pdv-success-whatsapp');
  const successCloseButton = document.getElementById('pdv-success-close');
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
  const pixStatusElement = document.getElementById('pdv-pix-status');
  const pixQrElement = document.getElementById('pdv-pix-qr');
  const cardModal = document.getElementById('pdv-card-modal');
  const cardModalCloseButton = document.getElementById('pdv-card-close');
  const cardTotalLabelElement = document.getElementById('pdv-card-total-label');
  const cardTotalElement = document.getElementById('pdv-card-total');
  const cardTransactionButtons = Array.from(document.querySelectorAll('[data-card-transaction]'));
  const cardInstallmentsSection = document.getElementById('pdv-card-installments-section');
  const cardInstallmentsContainer = document.getElementById('pdv-card-installments');
  const cardPassFeesToggle = document.getElementById('pdv-card-pass-fees');
  const cardPassFeesLabel = document.getElementById('pdv-card-pass-fees-label');
  const cardFeeSummaryElement = document.getElementById('pdv-card-fee-summary');
  const cardMethodButtons = Array.from(document.querySelectorAll('[data-card-method]'));
  const cardFeedbackSection = document.getElementById('pdv-card-feedback');
  const cardFeedbackViews = {
    nfc: document.querySelector('[data-card-feedback="nfc"]'),
    manual: document.querySelector('[data-card-feedback="manual"]'),
    external: document.querySelector('[data-card-feedback="external"]'),
  };
  const cardNfcTotalElement = document.getElementById('pdv-card-nfc-total');
  const cardManualForm = document.getElementById('pdv-card-manual');
  const cardManualSubmitButton = document.getElementById('pdv-card-manual-submit');
  const cardManualStatusElement = document.getElementById('pdv-card-manual-status');
  const cardExternalTotalElement = document.getElementById('pdv-card-external-total');

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

  const cardInstallmentOptions = [
    { id: 'credit-1', installments: 1, interestRate: 0, label: '1x (à vista)', description: 'Sem juros' },
    { id: 'credit-2', installments: 2, interestRate: 0.0273, label: '2x', description: 'Com juros' },
    { id: 'credit-3', installments: 3, interestRate: 0.04, label: '3x', description: 'Com juros' },
  ];

  const cardGatewayConfig = {
    debit: { rate: 0.015 },
    credit: cardInstallmentOptions,
  };

  const cardGatewayState = {
    baseTotal: 0,
    transactionType: 'debit',
    installmentId: cardInstallmentOptions[0]?.id || 'credit-1',
    passFees: false,
    method: null,
  };

  const getSelectedCardOption = () =>
    cardGatewayConfig.credit.find((option) => option.id === cardGatewayState.installmentId) ||
    cardGatewayConfig.credit[0];

  const ensureCardInstallmentSelection = () => {
    if (cardGatewayState.transactionType !== 'credit') return;
    if (!cardGatewayConfig.credit.some((option) => option.id === cardGatewayState.installmentId)) {
      cardGatewayState.installmentId = cardGatewayConfig.credit[0]?.id || 'credit-1';
    }
  };

  const calculateCardOptionTotals = (option) => {
    const rate = option?.interestRate || 0;
    const installments = Math.max(option?.installments || 1, 1);
    const totalWithFees = cardGatewayState.baseTotal * (1 + rate);
    const displayTotal = cardGatewayState.passFees ? totalWithFees : cardGatewayState.baseTotal;
    const installmentValue = installments > 0 ? displayTotal / installments : displayTotal;
    return { rate, installments, totalWithFees, displayTotal, installmentValue };
  };

  const getCurrentCardTotals = () => {
    if (cardGatewayState.transactionType === 'credit') {
      ensureCardInstallmentSelection();
      const option = getSelectedCardOption();
      return calculateCardOptionTotals(option);
    }
    const rate = cardGatewayConfig.debit.rate || 0;
    const totalWithFees = cardGatewayState.baseTotal * (1 + rate);
    const displayTotal = cardGatewayState.passFees ? totalWithFees : cardGatewayState.baseTotal;
    return { rate, installments: 1, totalWithFees, displayTotal, installmentValue: displayTotal };
  };

  const resetCardGatewayMethods = () => {
    cardGatewayState.method = null;
    cardMethodButtons.forEach((button) => button.classList.remove('is-active'));
    if (cardFeedbackSection) cardFeedbackSection.hidden = true;
    Object.values(cardFeedbackViews).forEach((view) => {
      if (view) view.hidden = true;
    });
    if (cardManualForm) cardManualForm.reset();
    if (cardManualStatusElement) cardManualStatusElement.textContent = '';
  };

  const renderCardInstallments = () => {
    if (!cardInstallmentsContainer) return;
    if (cardGatewayState.transactionType !== 'credit') {
      cardInstallmentsContainer.innerHTML = '';
      return;
    }
    ensureCardInstallmentSelection();
    const options = cardGatewayConfig.credit;
    const html = options
      .map((option) => {
        const isActive = option.id === cardGatewayState.installmentId;
        const totals = calculateCardOptionTotals(option);
        const metaBits = [];
        if ((option.description || '').trim()) {
          metaBits.push(option.description.trim());
        } else {
          metaBits.push(option.interestRate > 0 ? 'Com juros' : 'Sem juros');
        }
        if (!cardGatewayState.passFees && option.interestRate > 0) {
          metaBits.push('Taxas absorvidas pela loja');
        }
        const metaText = metaBits.join(' • ');
        const totalLabel = cardGatewayState.passFees ? totals.totalWithFees : cardGatewayState.baseTotal;
        return `
          <button
            class="card-gateway__installment${isActive ? ' is-active' : ''}"
            type="button"
            data-card-installment="${option.id}"
            role="option"
            aria-selected="${isActive}"
          >
            <span class="card-gateway__installment-main">
              <strong>${option.installments}x de ${formatCurrency(totals.installmentValue)}</strong>
              <span>${metaText}</span>
            </span>
            <span class="card-gateway__installment-total">${formatCurrency(totalLabel)}</span>
          </button>
        `;
      })
      .join('');
    cardInstallmentsContainer.innerHTML = html;
  };

  const updateCardMethodViews = () => {
    if (!cardFeedbackSection) return;
    const totals = getCurrentCardTotals();
    const chargeAmount = cardGatewayState.passFees ? totals.totalWithFees : cardGatewayState.baseTotal;
    cardMethodButtons.forEach((button) => {
      const isActive = cardGatewayState.method === button.dataset.cardMethod;
      button.classList.toggle('is-active', Boolean(isActive));
    });
    if (cardNfcTotalElement) cardNfcTotalElement.textContent = formatCurrency(chargeAmount);
    if (cardManualSubmitButton) {
      cardManualSubmitButton.textContent = `Pagar ${formatCurrency(chargeAmount)}`;
    }
    if (cardExternalTotalElement) cardExternalTotalElement.textContent = formatCurrency(chargeAmount);
    const hasMethod = Boolean(cardGatewayState.method);
    cardFeedbackSection.hidden = !hasMethod;
    Object.entries(cardFeedbackViews).forEach(([key, view]) => {
      if (!view) return;
      view.hidden = cardGatewayState.method !== key;
    });
  };

  const updateCardGatewayUI = () => {
    cardTransactionButtons.forEach((button) => {
      const isActive = button.dataset.cardTransaction === cardGatewayState.transactionType;
      button.classList.toggle('is-active', Boolean(isActive));
      button.disabled = cardGatewayState.baseTotal <= 0;
    });
    if (cardPassFeesToggle) {
      cardPassFeesToggle.checked = cardGatewayState.passFees;
      cardPassFeesToggle.disabled = cardGatewayState.baseTotal <= 0;
    }
    if (cardPassFeesLabel) {
      cardPassFeesLabel.textContent = cardGatewayState.passFees
        ? 'Repassar taxas da transação ao cliente (ativo)'
        : 'Repassar taxas da transação ao cliente';
    }
    cardMethodButtons.forEach((button) => {
      button.disabled = cardGatewayState.baseTotal <= 0;
    });

    if (cardInstallmentsSection) {
      cardInstallmentsSection.hidden = cardGatewayState.transactionType !== 'credit';
    }

    if (cardGatewayState.baseTotal <= 0) {
      if (cardTotalLabelElement) cardTotalLabelElement.textContent = 'Total da venda';
      if (cardTotalElement) cardTotalElement.textContent = formatCurrency(0);
      if (cardFeeSummaryElement) {
        cardFeeSummaryElement.textContent =
          'Adicione itens ao carrinho para simular o pagamento com cartão.';
      }
      if (cardInstallmentsContainer) cardInstallmentsContainer.innerHTML = '';
      resetCardGatewayMethods();
      return;
    }

    if (cardGatewayState.transactionType === 'credit') {
      renderCardInstallments();
    }

    const totals = getCurrentCardTotals();
    const headerTotal = cardGatewayState.passFees ? totals.totalWithFees : cardGatewayState.baseTotal;
    if (cardTotalLabelElement) {
      cardTotalLabelElement.textContent = cardGatewayState.passFees ? 'Total ao cliente' : 'Total da venda';
    }
    if (cardTotalElement) {
      cardTotalElement.textContent = formatCurrency(headerTotal);
    }
    const feeAmount = Math.max(totals.totalWithFees - cardGatewayState.baseTotal, 0);
    const summaryLines = [];
    if (feeAmount <= 0.004) {
      summaryLines.push('Sem taxas adicionais nesta modalidade.');
    } else if (cardGatewayState.passFees) {
      summaryLines.push(`Cliente paga ${formatCurrency(feeAmount)} em taxas.`);
      summaryLines.push(`Total ao cliente: ${formatCurrency(totals.totalWithFees)}.`);
    } else {
      const netAmount = Math.max(cardGatewayState.baseTotal - feeAmount, 0);
      summaryLines.push(`Lojista absorve ${formatCurrency(feeAmount)} em taxas.`);
      summaryLines.push(`Recebimento líquido estimado: ${formatCurrency(netAmount)}.`);
      summaryLines.push(`Cliente verá ${formatCurrency(cardGatewayState.baseTotal)} na fatura.`);
    }
    if (cardFeeSummaryElement) {
      cardFeeSummaryElement.textContent = summaryLines.join(' ');
    }
    updateCardMethodViews();
  };

  const syncCardGatewayTotal = (total) => {
    cardGatewayState.baseTotal = Number(total) || 0;
    if (cardModal && cardModal.classList.contains('is-visible')) {
      updateCardGatewayUI();
    }
  };

  const closeCardModal = () => {
    if (!cardModal) return;
    cardModal.classList.remove('is-visible');
    cardModal.setAttribute('aria-hidden', 'true');
    resetCardGatewayMethods();
  };

  const getSaleId = () => `PDV-${String(saleCounter).padStart(4, '0')}`;

  const getCartQuantity = () =>
    Array.from(cart.values()).reduce((sum, item) => sum + Math.max(item.quantity || 0, 0), 0);

  const getCurrentPanel = () => mainShell?.getAttribute('data-panel') || 'catalog';

  const showCheckoutPanel = () => {
    if (!mainShell) return;
    mainShell.setAttribute('data-panel', 'checkout');
    if (checkoutToggleButton) {
      checkoutToggleButton.hidden = true;
    }
  };

  const showCatalogPanel = () => {
    if (!mainShell) return;
    mainShell.setAttribute('data-panel', 'catalog');
    updateCheckoutToggle();
  };

  const updateCheckoutToggle = (totals) => {
    if (!checkoutToggleButton) return;
    const itemCount = getCartQuantity();
    if (itemCount === 0) {
      checkoutToggleButton.hidden = true;
      return;
    }
    const totalValue = totals?.total ?? getTotals().total;
    const metaLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'} • ${formatCurrency(totalValue)}`;
    if (checkoutToggleMeta) checkoutToggleMeta.textContent = metaLabel;
    const panel = getCurrentPanel();
    checkoutToggleButton.hidden = panel === 'checkout';
  };

  const updateDiscountToggleLabel = () => {
    if (!discountToggleButton || !discountInput) return;
    const hasDiscount = Number(discountInput.value || 0) > 0;
    discountToggleButton.textContent = hasDiscount ? 'Editar desconto' : 'Adicionar desconto';
  };

  const setDiscountPanelVisibility = (isOpen) => {
    if (!discountPanel || !discountToggleButton) return;
    discountPanel.hidden = !isOpen;
    discountToggleButton.setAttribute('aria-expanded', String(Boolean(isOpen)));
    if (isOpen) {
      discountToggleButton.textContent = 'Ocultar desconto';
      const firstInput = discountPanel.querySelector('input');
      if (firstInput) {
        window.setTimeout(() => firstInput.focus(), 10);
      }
    } else {
      updateDiscountToggleLabel();
    }
  };

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
    const awaitingMessage = 'Compartilhe o QR Code e finalize após confirmar o recebimento.';
    const baseMessage = !hasItems
      ? 'Aguardando produtos no carrinho.'
      : pixPaymentStatus === 'paid'
      ? 'Pagamento confirmado. Finalize a venda para registrar o recebimento.'
      : awaitingMessage;
    const message = messageOverride || baseMessage;
    pixStatusElement.textContent = message;
    const shouldWarn = hasItems && selectedPayment === 'PIX' && pixPaymentStatus !== 'paid';
    pixStatusElement.classList.toggle('pix-box__status--success', pixPaymentStatus === 'paid');
    pixStatusElement.classList.toggle('pix-box__status--warning', shouldWarn);
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
    const wasEmpty = cart.size === 0;
    const existing = cart.get(product.code);
    if (existing) {
      existing.quantity = Math.max((existing.quantity || 0) + 1, 1);
    } else {
      cart.set(product.code, { ...product, quantity: 1, itemDiscount: 0 });
    }
    renderCart();
    if (wasEmpty) {
      showCheckoutPanel();
    }
  };

  const removeFromCart = (productCode) => {
    cart.delete(productCode);
    renderCart();
    if (cart.size === 0) {
      if (discountInput) discountInput.value = '0';
      updateDiscountToggleLabel();
      setDiscountPanelVisibility(false);
      showCatalogPanel();
      updateTotals();
    }
  };

  const changeCartQuantity = (productCode, delta) => {
    const entry = cart.get(productCode);
    if (!entry) return;
    const nextQuantity = (entry.quantity || 0) + delta;
    if (nextQuantity <= 0) {
      removeFromCart(productCode);
      return;
    }
    entry.quantity = nextQuantity;
    if (entry.itemDiscount) {
      entry.itemDiscount = Math.min(entry.itemDiscount, entry.price * entry.quantity);
    }
    renderCart();
  };

  const handleItemDiscount = (productCode) => {
    const entry = cart.get(productCode);
    if (!entry) return;
    const current = Number(entry.itemDiscount || 0);
    const maxDiscount = entry.price * entry.quantity;
    const response = window.prompt(
      `Informe o desconto em reais para ${entry.name} (máximo ${formatCurrency(maxDiscount)})`,
      current > 0 ? current.toFixed(2).replace('.', ',') : ''
    );
    if (response === null) return;
    const normalized = Number(response.replace(',', '.'));
    if (Number.isNaN(normalized) || normalized < 0) {
      alert('Valor de desconto inválido. Utilize apenas números positivos.');
      return;
    }
    entry.itemDiscount = Math.min(normalized, maxDiscount);
    renderCart();
  };

  const renderCart = () => {
    if (!cartElement) return;
    cartElement.innerHTML = '';

    const items = Array.from(cart.values());

    if (items.length === 0) {
      const emptyState = document.createElement('li');
      emptyState.textContent = 'Nenhum item adicionado ainda. Busque uma peça e clique para incluir.';
      emptyState.className = 'checkout-cart__empty';
      emptyState.setAttribute('role', 'status');
      cartElement.appendChild(emptyState);
    } else {
      items.forEach((item) => {
        const imageSrc =
          item.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        const lineTotal = Math.max(item.price * item.quantity - (item.itemDiscount || 0), 0);
        const hasItemDiscount = Number(item.itemDiscount || 0) > 0;
        const cartItem = document.createElement('li');
        cartItem.className = 'checkout-cart__item';
        cartItem.dataset.productCode = item.code;
        cartItem.innerHTML = `
          <div class="checkout-cart__main">
            <div class="checkout-cart__media" aria-hidden="true">
              <img src="${imageSrc}" alt="" loading="lazy" />
            </div>
            <div class="checkout-cart__details">
              <span class="checkout-cart__name">${item.name}</span>
              <span class="checkout-cart__meta">${item.code} • Tam. ${item.size}</span>
              <button class="checkout-cart__discount" type="button">
                ${hasItemDiscount ? 'Editar desconto' : 'Aplicar desconto'}
              </button>
            </div>
          </div>
          <div class="checkout-cart__side">
            <div class="quantity-control" role="group" aria-label="Quantidade de ${item.name}">
              <button class="quantity-control__btn" data-action="decrease" type="button" aria-label="Remover uma unidade">−</button>
              <span class="quantity-control__value" aria-live="polite">${item.quantity}</span>
              <button class="quantity-control__btn" data-action="increase" type="button" aria-label="Adicionar uma unidade">+</button>
            </div>
            <div class="checkout-cart__pricing">
              <span class="checkout-cart__price">${formatCurrency(lineTotal)}</span>
              <span class="checkout-cart__unit">${formatCurrency(item.price)} / un.</span>
              ${hasItemDiscount ? `<span class="checkout-cart__discount-tag">-${formatCurrency(item.itemDiscount)}</span>` : ''}
            </div>
            <button class="checkout-cart__remove" aria-label="Remover ${item.name}" type="button">×</button>
          </div>
        `;

        const [decreaseButton, increaseButton] = cartItem.querySelectorAll('.quantity-control__btn');
        if (decreaseButton) {
          decreaseButton.addEventListener('click', () => changeCartQuantity(item.code, -1));
        }
        if (increaseButton) {
          increaseButton.addEventListener('click', () => changeCartQuantity(item.code, 1));
        }
        const removeButton = cartItem.querySelector('.checkout-cart__remove');
        if (removeButton) {
          removeButton.addEventListener('click', () => removeFromCart(item.code));
        }
        const discountButton = cartItem.querySelector('.checkout-cart__discount');
        if (discountButton) {
          discountButton.addEventListener('click', () => handleItemDiscount(item.code));
        }
        cartElement.appendChild(cartItem);
      });
    }

    updateTotals();
  };

  const getTotals = () => {
    const items = Array.from(cart.values());
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItemDiscount = items.reduce(
      (sum, item) => sum + Math.min(item.itemDiscount || 0, item.price * item.quantity),
      0
    );
    const baseForGlobalDiscount = Math.max(subtotal - totalItemDiscount, 0);
    const rawDiscount = Math.max(Number(discountInput?.value) || 0, 0);
    let globalDiscount = 0;

    if (discountType === 'percent') {
      const percent = Math.min(rawDiscount, 100);
      globalDiscount = Math.min(baseForGlobalDiscount, (baseForGlobalDiscount * percent) / 100);
    } else {
      globalDiscount = Math.min(baseForGlobalDiscount, rawDiscount);
    }

    const totalDiscount = Math.min(subtotal, totalItemDiscount + globalDiscount);
    const total = Math.max(subtotal - totalDiscount, 0);
    return { subtotal, totalDiscount, total, itemDiscount: totalItemDiscount, globalDiscount };
  };

  const openCardModal = () => {
    if (!cardModal) return;
    const totals = getTotals();
    syncCardGatewayTotal(totals.total);
    cardGatewayState.transactionType = 'debit';
    cardGatewayState.installmentId = cardInstallmentOptions[0]?.id || 'credit-1';
    cardGatewayState.passFees = false;
    resetCardGatewayMethods();
    if (cardPassFeesToggle) cardPassFeesToggle.checked = false;
    updateCardGatewayUI();
    cardModal.classList.add('is-visible');
    cardModal.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => {
      const focusTarget = cardTransactionButtons.find((button) => !button.disabled);
      focusTarget?.focus();
    }, 20);
  };

  const getFinishButtonCopy = (totalValue) => {
    const formattedTotal = formatCurrency(totalValue);
    switch (selectedPayment) {
      case 'PIX':
        return `Confirmar recebimento (PIX) • ${formattedTotal}`;
      case 'Dinheiro':
        return `Finalizar venda (Dinheiro) • ${formattedTotal}`;
      case 'Cartão':
        return `Pagamento aprovado (Cartão)? • ${formattedTotal}`;
      case 'Fiado':
        return `Salvar venda (Fiado) • ${formattedTotal}`;
      default:
        return `Finalizar venda • ${formattedTotal}`;
    }
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
    finishButton.textContent = hasItems ? getFinishButtonCopy(totalValue) : 'Finalizar venda';
  };

  const updateTotals = () => {
    const totals = getTotals();
    if (subtotalElement) subtotalElement.textContent = formatCurrency(totals.subtotal);
    if (totalDiscountElement) totalDiscountElement.textContent = formatCurrency(totals.totalDiscount);
    if (totalElement) totalElement.textContent = formatCurrency(totals.total);
    updateFinishButton(totals.total, getCartQuantity() > 0);
    updateCheckoutToggle(totals);
    syncCardGatewayTotal(totals.total);
    updatePixBox(totals);
  };

  const updatePaymentContext = () => {
    if (!paymentContextElement) return;
    const lines = {
      PIX: [
        'Compartilhe o QR Code ou o código copia e cola gerado abaixo.',
        'Finalize a venda somente após confirmar o pagamento no app do banco.',
      ],
      Dinheiro: ['Receba o valor em espécie e informe o troco se necessário.'],
      Cartão: ['Passe o cartão no POS e finalize quando a operadora confirmar a aprovação.'],
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
    if (method !== 'Cartão') {
      closeCardModal();
    }
    updatePixBox();
    updateFinishButton(getTotals().total, getCartQuantity() > 0);
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

    const items = Array.from(cart.values()).map((item) => ({ ...item }));
    const totals = getTotals();
    if (selectedPayment === 'PIX') {
      pixPaymentStatus = 'paid';
    }
    const customerSummary = selectedCustomer
      ? { id: selectedCustomer.id, name: selectedCustomer.name, phone: selectedCustomer.phoneLabel }
      : { id: null, name: 'Cliente Avulso', phone: null };
    const saleId = getSaleId();
    const saleStatus = (() => {
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
          Quantidade: item.quantity,
          'Valor unitário': formatCurrency(item.price),
          'Desconto item': formatCurrency(item.itemDiscount || 0),
          'Total linha': formatCurrency(item.price * item.quantity - (item.itemDiscount || 0)),
        }))
      );
      console.groupEnd();

      lastSaleSummary = {
        total: totals.total,
        customer: customerSummary.name,
        payment: selectedPayment,
        status: saleStatus,
        saleId,
        items: items.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        }))
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
      updateDiscountToggleLabel();
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

      showCatalogPanel();
      setDiscountPanelVisibility(false);

      if (mainShell) mainShell.hidden = true;
      if (successSection) successSection.hidden = false;
    }, 650);
  };

  const startNewSale = () => {
    lastSaleSummary = null;
    if (successSection) successSection.hidden = true;
    if (mainShell) mainShell.hidden = false;
    showCatalogPanel();
    setDiscountPanelVisibility(false);
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
    updateDiscountToggleLabel();
    renderProducts(searchInput?.value || '');
    updateTotals();
    updatePixStatusUI();
  };

  setDiscountPanelVisibility(false);
  updateDiscountToggleLabel();
  updateCheckoutToggle();

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
    discountInput.addEventListener('input', () => {
      updateTotals();
      updateDiscountToggleLabel();
    });
  }

  if (discountToggleButton) {
    discountToggleButton.addEventListener('click', () => {
      const isOpen = discountPanel && !discountPanel.hidden;
      setDiscountPanelVisibility(!isOpen);
    });
  }

  if (discountCloseButton) {
    discountCloseButton.addEventListener('click', () => setDiscountPanelVisibility(false));
  }

  if (discountClearButton) {
    discountClearButton.addEventListener('click', () => {
      if (discountInput) {
        discountInput.value = '0';
      }
      updateDiscountToggleLabel();
      updateTotals();
      setDiscountPanelVisibility(false);
    });
  }

  discountTypeButtons.forEach((button) => {
    button.addEventListener('click', () => setDiscountType(button.dataset.discountType || 'currency'));
  });

  cardTransactionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.cardTransaction || 'debit';
      cardGatewayState.transactionType = type;
      if (type !== 'credit') {
        cardGatewayState.installmentId = cardInstallmentOptions[0]?.id || 'credit-1';
      }
      resetCardGatewayMethods();
      updateCardGatewayUI();
    });
  });

  if (cardInstallmentsContainer) {
    cardInstallmentsContainer.addEventListener('click', (event) => {
      const target = event.target.closest('[data-card-installment]');
      if (!target) return;
      const installmentId = target.dataset.cardInstallment;
      if (!installmentId || installmentId === cardGatewayState.installmentId) return;
      cardGatewayState.installmentId = installmentId;
      updateCardGatewayUI();
    });
  }

  if (cardPassFeesToggle) {
    cardPassFeesToggle.addEventListener('change', () => {
      cardGatewayState.passFees = cardPassFeesToggle.checked;
      updateCardGatewayUI();
    });
  }

  cardMethodButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      const method = button.dataset.cardMethod;
      cardGatewayState.method = cardGatewayState.method === method ? null : method;
      if (cardGatewayState.method !== 'manual' && cardManualForm) {
        cardManualForm.reset();
      }
      if (cardManualStatusElement) cardManualStatusElement.textContent = '';
      updateCardMethodViews();
    });
  });

  if (cardManualForm) {
    cardManualForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (cardManualStatusElement) {
        cardManualStatusElement.textContent =
          'Pagamento enviado para processamento (simulação). Aguarde a aprovação antes de finalizar a venda.';
      }
    });
    cardManualForm.addEventListener('input', () => {
      if (cardManualStatusElement && cardManualStatusElement.textContent) {
        cardManualStatusElement.textContent = '';
      }
    });
  }

  if (cardModalCloseButton) {
    cardModalCloseButton.addEventListener('click', closeCardModal);
  }

  if (cardModal) {
    cardModal.addEventListener('click', (event) => {
      if (event.target === cardModal) {
        closeCardModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cardModal?.classList.contains('is-visible')) {
      closeCardModal();
    }
  });

  paymentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const method = button.dataset.payment || 'PIX';
      setPayment(method);
      if (method === 'Cartão') {
        openCardModal();
      }
    });
  });

  if (pixCopyButton) {
    pixCopyButton.addEventListener('click', copyPixCode);
  }

  if (checkoutToggleButton) {
    checkoutToggleButton.addEventListener('click', () => {
      if (cart.size === 0) return;
      showCheckoutPanel();
    });
  }

  if (checkoutBackButton) {
    checkoutBackButton.addEventListener('click', showCatalogPanel);
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

  if (successCloseButton) {
    successCloseButton.addEventListener('click', startNewSale);
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

// ========================================================
// GLOBAL SYSTEMS — Toast, Demo Badge, Favicon, Confetti
// ========================================================

// --- Toast notification system ---
const bipaToast = (() => {
  let container = document.querySelector('.bipa-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'bipa-toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const iconMap = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  const show = (title, message, variant = 'success', duration = 4200) => {
    const toast = document.createElement('div');
    toast.className = `bipa-toast bipa-toast--${variant}`;
    toast.innerHTML = `
      <span class="bipa-toast__icon">${iconMap[variant] || '●'}</span>
      <div class="bipa-toast__content">
        <div class="bipa-toast__title">${title}</div>
        ${message ? `<div class="bipa-toast__message">${message}</div>` : ''}
      </div>
      <button class="bipa-toast__close" type="button" aria-label="Fechar">×</button>
    `;

    const dismiss = () => {
      toast.classList.add('is-exiting');
      window.setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.bipa-toast__close').addEventListener('click', dismiss);
    container.appendChild(toast);

    if (duration > 0) {
      window.setTimeout(dismiss, duration);
    }
    return toast;
  };

  return { show, success: (t, m) => show(t, m, 'success'), error: (t, m) => show(t, m, 'error'), warning: (t, m) => show(t, m, 'warning'), info: (t, m) => show(t, m, 'info') };
})();

// --- Demo badge injection ---
(() => {
  if (document.querySelector('.demo-badge-fixed')) return;
  const badge = document.createElement('div');
  badge.className = 'demo-badge-fixed';
  badge.textContent = 'Modo Demo';
  badge.setAttribute('aria-hidden', 'true');
  document.body.appendChild(badge);
})();

// --- Favicon injection ---
(() => {
  if (document.querySelector('link[rel="icon"]')) return;
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" stop-color="%2332ffb4"/><stop offset="100%25" stop-color="%230fd68c"/></linearGradient></defs><rect x="3" y="3" width="58" height="58" rx="18" fill="url(%23g)"/><text x="32" y="44" font-family="system-ui" font-size="32" font-weight="bold" fill="%23052216" text-anchor="middle">B</text></svg>';
  document.head.appendChild(favicon);
})();

// --- Confetti system ---
const fireConfetti = () => {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#32ffb4', '#0fd68c', '#1ef39b', '#facc15', '#fb7185', '#60a5fa', '#c084fc'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1.5}s`;
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${6 + Math.random() * 8}px`;
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  window.setTimeout(() => container.remove(), 3500);
};

// --- localStorage persistence layer ---
const bipaStore = (() => {
  const KEY_SALES = 'bipa:sales';
  const KEY_PRODUCTS = 'bipa:extra-products';
  const KEY_CUSTOMERS = 'bipa:extra-customers';

  const get = (key, fallback = []) => {
    try { return JSON.parse(window.localStorage.getItem(key)) || fallback; } catch { return fallback; }
  };
  const set = (key, data) => {
    try { window.localStorage.setItem(key, JSON.stringify(data)); } catch { /* storage full */ }
  };

  return {
    getSales: () => get(KEY_SALES),
    addSale: (sale) => { const sales = get(KEY_SALES); sales.unshift(sale); set(KEY_SALES, sales); },
    getExtraProducts: () => get(KEY_PRODUCTS),
    addProduct: (p) => { const prods = get(KEY_PRODUCTS); prods.push(p); set(KEY_PRODUCTS, prods); },
    getExtraCustomers: () => get(KEY_CUSTOMERS),
    addCustomer: (c) => { const custs = get(KEY_CUSTOMERS); custs.push(c); set(KEY_CUSTOMERS, custs); },
  };
})();

// Load persisted extras into demo arrays
(() => {
  bipaStore.getExtraProducts().forEach((p) => {
    if (!demoProductsMap[normalizeProductCode(p.code)]) {
      demoProducts.push(p);
      demoProductsMap[normalizeProductCode(p.code)] = p;
    }
  });
  bipaStore.getExtraCustomers().forEach((c) => {
    if (!demoCustomersMap[c.id]) {
      demoCustomers.push(c);
      demoCustomersMap[c.id] = c;
    }
  });
})();


// ========================================================
// FASE 1 — Admin > Product Create handler
// ========================================================
if (page === 'admin-product-create') {
  const form = document.querySelector('.form-grid');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
      const getVal = (idx) => (inputs[idx]?.value || '').trim();

      const code = getVal(0) || `BR-${String(demoProducts.length + 1).padStart(4, '0')}`;
      const name = getVal(1) || 'Produto sem nome';
      const category = getVal(2) || 'Geral';
      const size = getVal(3) || 'M';
      const price = Number(getVal(4)) || 0;

      const newProduct = {
        code: code.toUpperCase(),
        name,
        category,
        size,
        price,
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60',
        status: 'available',
      };

      demoProducts.push(newProduct);
      demoProductsMap[normalizeProductCode(newProduct.code)] = newProduct;
      bipaStore.addProduct(newProduct);

      // Replace form with success message
      const formParent = form.parentElement;
      form.remove();
      const helpText = formParent.querySelector('.form-footer');
      if (helpText) helpText.remove();

      const successDiv = document.createElement('div');
      successDiv.className = 'form-success-overlay';
      successDiv.innerHTML = `
        <div class="form-success-overlay__icon">✓</div>
        <p class="form-success-overlay__title">Produto cadastrado com sucesso!</p>
        <p class="form-success-overlay__text">${newProduct.name} (${newProduct.code}) foi adicionado ao catálogo da demo.</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center">
          <a class="btn btn--primary" href="/app/admin/produtos/">Ver estoque</a>
          <a class="btn btn--surface" href="/app/admin/produtos/novo/">Cadastrar outro</a>
        </div>
      `;
      formParent.appendChild(successDiv);
      bipaToast.success('Produto salvo', `${newProduct.name} adicionado ao catálogo.`);
    });
  }
}


// ========================================================
// FASE 1 — Admin > Customer Create handler
// ========================================================
if (page === 'admin-customer-create') {
  const form = document.querySelector('.form-grid');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
      const getVal = (idx) => (inputs[idx]?.value || '').trim();

      const name = getVal(0) || 'Cliente sem nome';
      const whatsapp = getVal(1).replace(/\D/g, '') || '00000000000';
      const email = getVal(2) || '';
      const tag = getVal(3) || '';

      const newCustomer = {
        id: `cli-${String(demoCustomers.length + 1).padStart(4, '0')}`,
        name,
        whatsapp,
        phoneLabel: formatPhone(whatsapp),
        email,
        tag,
        tagClass: tag === 'VIP' ? 'chip--available' : tag === 'Fiado' ? 'chip--reserved' : '',
        lastPurchase: new Date().toISOString().slice(0, 10),
        totalSpent: 0,
        subtitle: tag ? `Cliente ${tag}` : 'Novo cliente',
        notes: '',
        history: [],
      };

      demoCustomers.push(newCustomer);
      demoCustomersMap[newCustomer.id] = newCustomer;
      bipaStore.addCustomer(newCustomer);

      const formParent = form.parentElement;
      form.remove();
      const helpText = formParent.querySelector('.form-footer');
      if (helpText) helpText.remove();

      const successDiv = document.createElement('div');
      successDiv.className = 'form-success-overlay';
      successDiv.innerHTML = `
        <div class="form-success-overlay__icon">✓</div>
        <p class="form-success-overlay__title">Cliente cadastrado!</p>
        <p class="form-success-overlay__text">${newCustomer.name} (${newCustomer.phoneLabel}) foi adicionado à sua base.</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center">
          <a class="btn btn--primary" href="/app/admin/clientes/">Ver clientes</a>
          <a class="btn btn--surface" href="/app/admin/clientes/novo/">Cadastrar outro</a>
        </div>
      `;
      formParent.appendChild(successDiv);
      bipaToast.success('Cliente salvo', `${newCustomer.name} adicionado à base.`);
    });
  }
}


// ========================================================
// FASE 1 — Admin > Settings handler
// ========================================================
if (page === 'admin-settings') {
  const form = document.querySelector('.form-grid');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      bipaToast.success('Configurações salvas', 'As alterações foram aplicadas nesta sessão demo.');
    });
  }
}


// ========================================================
// FASE 1 — Admin > Products — Functional Filters
// ========================================================
if (page === 'admin-products') {
  const filtersForm = document.querySelector('.filters-bar--inventory');
  const tableBody = document.querySelector('.table--inventory tbody');
  if (filtersForm && tableBody) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const selects = Array.from(filtersForm.querySelectorAll('select'));
    const searchInput = filtersForm.querySelector('input[type="search"]');

    const filterRows = () => {
      const statusFilter = (selects[0]?.value || 'Todos').toLowerCase();
      const categoryFilter = (selects[1]?.value || 'Todas').toLowerCase();
      const channelFilter = (selects[2]?.value || 'Todos').toLowerCase();
      const searchTerm = (searchInput?.value || '').trim().toLowerCase();

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const statusCell = row.querySelector('.inventory-status')?.textContent?.toLowerCase() || '';
        const channelCell = row.querySelector('.channel-list')?.textContent?.toLowerCase() || '';

        const matchesStatus = statusFilter === 'todos' || statusCell.includes(statusFilter.slice(0, 4));
        const matchesCategory = categoryFilter === 'todas' || text.includes(categoryFilter);
        const matchesChannel = channelFilter === 'todos' || channelCell.includes(channelFilter.slice(0, 3));
        const matchesSearch = !searchTerm || text.includes(searchTerm);

        row.style.display = matchesStatus && matchesCategory && matchesChannel && matchesSearch ? '' : 'none';
      });
    };

    selects.forEach((s) => s.addEventListener('change', filterRows));
    if (searchInput) searchInput.addEventListener('input', filterRows);
  }

  // Bulk action buttons
  const bulkButtons = document.querySelectorAll('[data-bulk-actions] .btn');
  bulkButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCount = document.querySelectorAll('[data-row-select]:checked').length;
      if (selectedCount === 0) {
        bipaToast.warning('Nenhum item selecionado', 'Selecione ao menos um produto para realizar esta ação.');
        return;
      }
      const action = btn.textContent.trim();
      bipaToast.success('Ação executada (demo)', `"${action}" aplicada a ${selectedCount} ${selectedCount === 1 ? 'produto' : 'produtos'}.`);
    });
  });
}


// ========================================================
// FASE 1 — Admin > Sales — Period Filter & Dynamic Data
// ========================================================
if (page === 'admin-sales') {
  const periodSelect = document.querySelector('.page-actions select');
  const tableBody = document.querySelector('.table tbody');

  // Inject persisted sales
  if (tableBody) {
    const persistedSales = bipaStore.getSales();
    persistedSales.forEach((sale) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${sale.date}</td>
        <td>${sale.id}</td>
        <td>${sale.customer}</td>
        <td>${sale.total}</td>
        <td>${sale.payment}</td>
      `;
      tableBody.prepend(row);
    });
  }

  if (periodSelect && tableBody) {
    periodSelect.addEventListener('change', () => {
      bipaToast.info('Filtro aplicado', `Exibindo vendas: ${periodSelect.value}`);
    });
  }
}


// ========================================================
// ========================================================
// FASE 1 & FASE 4 — Receipt Dynamic Rendering & Actions
// ========================================================
if (page === 'pdv-receipt') {
  const renderReceipt = () => {
    const elTitle = document.getElementById('receipt-title');
    const elMeta = document.getElementById('receipt-meta');
    const elTbody = document.getElementById('receipt-tbody');
    const elCustomer = document.getElementById('receipt-customer');
    const elMethod = document.getElementById('receipt-method');
    const elDiscount = document.getElementById('receipt-discount');
    const elTotal = document.getElementById('receipt-total');
    
    // Get last sale
    const salesStr = localStorage.getItem('bipa_sales');
    const sales = salesStr ? JSON.parse(salesStr) : [];
    const sale = sales.length > 0 ? sales[sales.length - 1] : null;

    if (!sale) {
      if (elTitle) elTitle.textContent = 'Venda não encontrada';
      if (elTbody) elTbody.innerHTML = '<tr><td colspan="4">Vá ao PDV e faça uma venda primeiro.</td></tr>';
      return;
    }

    if (elTitle) elTitle.textContent = `Venda concluída #${sale.id}`;
    if (elMeta) elMeta.textContent = `Emitido em ${sale.date}`;
    if (elCustomer) elCustomer.textContent = sale.customer || 'Cliente Avulso';
    if (elMethod) elMethod.textContent = sale.payment || 'Dinheiro';
    if (elDiscount) elDiscount.textContent = 'R$ 0,00'; // mock
    if (elTotal) elTotal.textContent = sale.total;
    
    if (elTbody && sale.items) {
      elTbody.innerHTML = '';
      sale.items.forEach(item => {
        elTbody.innerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>${item.qty || 1}</td>
            <td>${item.priceLabel || formatCurrency(item.price)}</td>
            <td>${item.totalLabel || formatCurrency(item.price * (item.qty || 1))}</td>
          </tr>
        `;
      });
    } else if (elTbody) {
      elTbody.innerHTML = `<tr><td colspan="4">Itens genéricos (Mock antigo sem detalhes de itens salvo)</td></tr>`;
    }
  };

  renderReceipt();

  const buttons = document.querySelectorAll('.receipt-card__footer .btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim().toLowerCase();
      if (text.includes('whatsapp')) {
        const message = encodeURIComponent('Aqui está seu recibo da compra BIPA! Obrigado pela preferência 🛍️');
        window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener');
        bipaToast.success('WhatsApp', 'Abrindo compartilhamento do recibo...');
      } else if (text.includes('imprimir')) {
        window.print();
      }
    });
  });
}


// ========================================================
// FASE 1 — Logout with state cleanup
// ========================================================
document.querySelectorAll('a[href="/"]').forEach((link) => {
  if (link.textContent.trim().toLowerCase() === 'sair') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      try { window.sessionStorage.clear(); } catch {}
      bipaToast.info('Sessão encerrada', 'Você foi desconectado da demo.');
      window.setTimeout(() => { window.location.href = '/'; }, 600);
    });
  }
});


// ========================================================
// PDV — Persist finalized sales & fire confetti
// ========================================================
if (page === 'pdv') {
  // Patch finishButton to also persist sale and fire confetti
  const origFinishButton = document.getElementById('pdv-finish');
  if (origFinishButton) {
    origFinishButton.addEventListener('click', () => {
      // Wait for the sale to finalize (after the existing 650ms timeout)
      window.setTimeout(() => {
        if (lastSaleSummary) {
          bipaStore.addSale({
            id: lastSaleSummary.saleId,
            date: new Date().toLocaleString('pt-BR'),
            customer: lastSaleSummary.customer,
            total: formatCurrency(lastSaleSummary.total),
            payment: lastSaleSummary.payment,
            items: lastSaleSummary.items
          });
          fireConfetti();
        }
      }, 700);
    }, { once: false });
  }

  // Enhance product list rendering to show thumbnails
  const origSearchInput = document.getElementById('pdv-search');
  const origProductList = document.getElementById('pdv-product-list');
  if (origSearchInput && origProductList) {
    const enhancedRender = () => {
      const query = origSearchInput.value.trim().toLowerCase();
      origProductList.innerHTML = '';

      const filtered = demoProducts.filter((p) => {
        if (p.status === 'sold') return false;
        if (!query) return true;
        return p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query);
      });

      if (filtered.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'pdv-empty';
        empty.textContent = 'Nenhum produto disponível.';
        origProductList.appendChild(empty);
        return;
      }

      filtered.forEach((product) => {
        const item = document.createElement('li');
        item.className = 'pdv-product';
        item.tabIndex = 0;
        item.innerHTML = `
          <img class="pdv-product__thumb" src="${product.image || ''}" alt="" loading="lazy" onerror="this.style.display='none'" />
          <div class="pdv-product__info">
            <span class="pdv-product__title">${product.name}</span>
            <span class="pdv-product__meta">${product.code} • Tam. ${product.size} • ${formatCurrency(product.price)}</span>
          </div>
        `;
        item.addEventListener('click', () => {
          addToCart(product);
          item.style.transition = 'background 200ms';
          item.style.background = 'rgba(30,243,155,0.15)';
          window.setTimeout(() => { item.style.background = ''; }, 400);
        });
        item.addEventListener('keypress', (e) => { if (e.key === 'Enter') addToCart(product); });
        origProductList.appendChild(item);
      });
    };

    // Override the search listener for enhanced rendering
    origSearchInput.removeEventListener('input', () => {});
    origSearchInput.addEventListener('input', enhancedRender);

    // Initial enhanced render (delayed to not conflict with original)
    window.setTimeout(enhancedRender, 50);
  }
}

// ========================================================
// FASE 2 — Mobile Hamburger Menu Toggle
// ========================================================
const mobileMenuToggles = document.querySelectorAll('.mobile-menu-toggle');
mobileMenuToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const header = toggle.closest('.site-header');
    if (header) {
      header.classList.toggle('menu-open');
      const isOpen = header.classList.contains('menu-open');
      toggle.setAttribute('aria-expanded', isOpen.toString());
    }
  });
});

// ========================================================
// FASE 3 — Dashboard Dinâmico & Gráfico CSS
// ========================================================
if (page === 'admin-dashboard') {
  const renderDashboard = () => {
    const salesStr = localStorage.getItem('bipa_sales');
    const sales = salesStr ? JSON.parse(salesStr) : [];
    
    // Parse values
    const parseCurrency = (str) => parseFloat(String(str).replace(/[^\d,-]/g, '').replace(',', '.'));
    
    // Metrics
    const today = new Date().toLocaleDateString('pt-BR');
    const todaySales = sales.filter(s => s.date.includes(today));
    
    const todayTotal = todaySales.reduce((acc, curr) => acc + parseCurrency(curr.total), 0);
    const overallTotal = sales.reduce((acc, curr) => acc + parseCurrency(curr.total), 0);
    const avgTicket = sales.length ? overallTotal / sales.length : 0;
    
    const elSalesTotal = document.getElementById('dash-sales-total');
    const elSalesCount = document.getElementById('dash-sales-count');
    const elItemsSold = document.getElementById('dash-items-sold');
    const elTicketAvg = document.getElementById('dash-ticket-avg');
    
    if (elSalesTotal) elSalesTotal.textContent = formatCurrency(todayTotal);
    if (elSalesCount) elSalesCount.textContent = `${todaySales.length} venda(s) registrada(s) hoje`;
    if (elItemsSold) elItemsSold.textContent = sales.length;
    if (elTicketAvg) elTicketAvg.textContent = formatCurrency(avgTicket);

    // CSS Chart
    const elChart = document.getElementById('dash-css-chart');
    if (elChart) {
      // Group by last 7 days
      const days = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days[d.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})] = 0;
      }
      
      sales.forEach(s => {
        const dStr = s.date.split(',')[0];
        const shortDate = dStr.substring(0, 5); // DD/MM
        if (days[shortDate] !== undefined) {
          days[shortDate] += parseCurrency(s.total);
        }
      });

      const maxVal = Math.max(...Object.values(days), 1); // fallback avoid /0
      
      elChart.innerHTML = '';
      Object.entries(days).forEach(([dateStr, total]) => {
        const percentage = Math.max(10, (total / maxVal) * 100);
        const bar = document.createElement('div');
        bar.className = 'css-chart-bar';
        bar.style.height = `${percentage}%`;
        
        bar.innerHTML = `
          <div class="css-chart-tooltip">${formatCurrency(total)}</div>
          <span class="css-chart-label">${dateStr}</span>
        `;
        elChart.appendChild(bar);
      });
    }

    // Transactions Table
    const elTbody = document.getElementById('dash-transactions-body');
    if (elTbody) {
      if (sales.length === 0) {
        elTbody.innerHTML = `<tr><td colspan="4" class="table-empty">Nenhum dado na demo... Realize uma venda no PDV!</td></tr>`;
      } else {
        elTbody.innerHTML = '';
        // Last 5 sales
        const latest = [...sales].reverse().slice(0, 5);
        latest.forEach(s => {
          elTbody.innerHTML += `
            <tr>
              <td>${s.date}</td>
              <td>${s.customer || 'Cliente Avulso'}</td>
              <td><span class="chip">${s.payment}</span></td>
              <td><strong>${s.total}</strong></td>
            </tr>
          `;
        });
      }
    }
  };
  
  // Render on load
  renderDashboard();
}

// ========================================================
// FASE 6 — Service Worker & Page Transitions
// ========================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed (ignore silently in demo)
    });
  });
}

// Page transition effect on links
document.querySelectorAll('a').forEach(link => {
  if (link.hostname === window.location.hostname && !link.hash && link.target !== '_blank') {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.add('page-transitioning-out');
      setTimeout(() => {
        window.location.href = link.href;
      }, 150);
    });
  }
});


