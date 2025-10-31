# BIPA Demo Architecture Decisions

## Visão Geral
Este documento descreve as principais decisões de arquitetura para a versão DEMO do ponto de venda BIPA. A solução é uma PWA construída com Next.js (App Router), TypeScript e Tailwind CSS, priorizando experiência mobile-first para operação de PDV e catálogo público.

## Stack e Padrões
- **Framework:** Next.js utilizando o App Router para segmentar rotas públicas e do lojista.
- **Linguagem:** TypeScript em toda a base para tipagem estática.
- **Estilo:** Tailwind CSS com design tokens compartilhados.
- **PWA:** suporte offline com Service Worker e manifest personalizados.
- **Estado:** Zustand para estado global síncrono e React Query para sincronização e cache de dados assíncronos, ambos com `storage-persist`.
- **Componentização:** UI compartilhada em `/apps/web/components` com atomic design simplificado (buttons, lists, sheets, scanner, QR etc.).

## Persistência e Dados
- **IndexedDB:** camada `lib/db` baseada em Dexie/IDB para coleções locais de produtos, clientes, vendas e pagamentos.
- **LocalStorage:** flags e preferências leves (p. ex. habilitação de self-checkout).
- **Seeds:** primeira execução (ou ação "Reset DEMO") carrega JSONs de produtos, clientes e vendas localizados em `lib/mock`.
- **RLS Fake:** organização atual armazenada no estado global; filtros por `orgId` aplicados no cliente para simular multitenancy.

## Modelos de Dados (TypeScript)
Tipos estáveis que sustentam o domínio da DEMO e preparam a evolução para um backend real:

```ts
type Role = 'owner' | 'manager' | 'clerk';
type ProductStatus = 'available' | 'reserved' | 'sold' | 'returned';
type PaymentMethod = 'pix' | 'cash' | 'card' | 'other';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

interface Org {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  email: string;
  role: Role;
  orgId: string;
}

interface Product {
  id: string;
  orgId: string;
  code: string;
  name: string;
  category?: string;
  size?: string;
  color?: string;
  gender?: string;
  condition?: string;
  price: number;
  costPrice?: number;
  quantity: number;
  status: ProductStatus;
  photoUrl?: string;
  createdAt: string;
}

interface Customer {
  id: string;
  orgId: string;
  name: string;
  phone?: string;
  cpf?: string;
  tag?: string;
  createdAt: string;
}

interface Sale {
  id: string;
  orgId: string;
  customerId?: string;
  status: 'pending' | 'paid' | 'canceled' | 'refunded';
  channel: 'in_store' | 'whatsapp' | 'link';
  subtotal: number;
  discountValue: number;
  total: number;
  createdBy: string;
  createdAt: string;
}

interface SaleItem {
  id: string;
  orgId: string;
  saleId: string;
  productId: string;
  unitPrice: number;
}

interface Payment {
  id: string;
  orgId: string;
  saleId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  provider?: 'demo';
  copyPaste?: string;
  qrDataUrl?: string;
  expiresAt?: string;
  createdAt: string;
}
```

## QR / PIX Simulado
- **Geração:** `lib/pix` contém utilitários para gerar strings EMV fake e QR Codes via biblioteca `qrcode`.
- **Pagamento:** botão "Simular confirmação PSP" atualiza `payment.status` para `"paid"` sem integrar com PSP real.
- **Copia-e-cola:** string EMV exibida para fins de demonstração, sem validade real.

## Scanner de Códigos
- **API Nativa:** utiliza `BarcodeDetector` quando suportado pelo navegador.
- **Fallback:** componente HTML5 implementado com `html5-qrcode` para ambientes sem suporte nativo.

## Serviços Mockados
Camada fake que replica a futura API, simplificando a troca por um backend real:

- `lib/mock/productsRepo.ts`: CRUD em IndexedDB, gera códigos sequenciais (`BR-00001…`).
- `lib/mock/salesRepo.ts`: abre vendas, adiciona itens, recalcula totais, aplica descontos e encerra pedidos.
- `lib/mock/paymentsRepo.ts`: cria pagamentos, gera QR fake e simula webhook de confirmação.
- `lib/mock/stock.ts`: aplica regras de status e registra "movimentos" usados pelos relatórios em memória.
- Adapter `lib/repository.ts`: camada de orquestração que expõe as mesmas assinaturas planejadas para o backend futuro.

## Estrutura de Pastas
```
/apps/web
  /app
    /(public)      # catálogo público
    /(app)         # app lojista
    /demo          # ferramentas DEMO (seed, reset, simuladores)
  /components      # UI compartilhada (buttons, sheets, lists, scanner, QR)
  /features
    /sell          # PDV mobile (carrinho, pagamento)
    /stock         # catálogo interno, editor, etiqueta QR
    /customers     # CRM leve
    /reports       # KPIs & gráficos client-side
    /catalog       # páginas /loja e /p/{code}
  /lib
    /db            # adapters IndexedDB (Dexie/Idb)
    /mock          # seeds e repositórios fake
    /pix           # geradores EMV/QR fake + webhook simulado
    /rules         # regras de negócio (status, descontos, locks)
    /flags         # feature flags locais (selfCheckout, consignado etc.)
```

## Limitações Conhecidas
- Todos os dados são fictícios — badge fixo "MODO DEMO" visível em todas as telas.
- Sem emissão de NF-e e sem integração com PSP real; PIX apenas simulado.
- Sem multiusuário real: troca de organização ocorre somente localmente.
- Operações críticas (estoque, relatórios) executadas client-side, sem backend.

## Self-Checkout (Cliente) — MVP DEMO
- **Contexto compartilhado:** mesma PWA com dois modos (Lojista e Cliente). O QR da loja (`/loja/{storeSlug}?mode=cliente`) define organização, logotipo e termos de uso.
- **Cadastro mínimo:** nome e WhatsApp (CPF opcional). No modo DEMO os campos já vêm preenchidos com dados fictícios.
- **Sacola e reserva:** cada item escaneado gera reserva local de 10 minutos; ao cancelar/expirar volta para `available`.
- **Pagamento:** PIX fake com botão "Simular pagamento". Webhook simulado marca `payments.status='paid'`, define `paid_at` e atualiza `sales.status='paid'`.
- **Passe de saída:** QR fake 1-uso com HMAC/nonce. Expira em 2 minutos, muda para `used_at` ao validar em `/api/exits/validate`.
- **Fallback:** se o pagamento não for confirmado, o passe não aparece e o lojista deve concluir manualmente.

### Incrementos de dados
- `organizations`: colunas `store_slug` (único), `public_urls_enabled` (toggle) e `timezone` (default `America/Manaus`).
- `sales`: campo obrigatório `channel` (`in_store | whatsapp | link | self_checkout`) e `exited_at` para logar liberação da saída.
- `payments`: coluna `paid_at` para auditoria de confirmações do PSP.
- `checkout_sessions`: tabela efêmera para jornadas do cliente (`status = active | expired | converted`).
- `exit_passes`: tokens com TTL curto, atrelados a vendas pagas e invalidados após 1 uso.

### Endpoints públicos e internos
- `GET /api/public/loja/{slug}` — dados públicos da loja e políticas do self-checkout.
- `GET /api/public/p/{slug}/{code}` — ficha pública do produto se `status='available'`.
- `POST /api/public/checkout/start` — cria `checkout_session` e reserva item(s).
- `POST /api/public/checkout/pay` — abre `sale`, cria `payment` PIX e retorna QR EMV/copia-e-cola.
- `POST /api/webhooks/psp` — confirma pagamento (`payments.status='paid'`, `sales.status='paid'`) e gera `exit_pass`.
- `POST /api/exits/validate` — lojista valida passe (1 uso, marca `exit_pass.used_at` e `sales.exited_at`).

### Regras de negócio chave
- Passe somente aparece após confirmação do servidor (regra de ouro) e expira rápido para evitar reuso.
- Reservas e passes expiram automaticamente e liberam estoque/fluxo.
- RLS permanece restrito: clientes só veem seus checkouts e dados públicos.
- Logs de auditoria registram criação de venda, confirmação de pagamento e validação de saída.

## Experiência Demo
- Página `/demo` oferece ferramentas para carregar seeds, resetar estado e acionar simuladores de pagamento.
- App prioriza funcionamento offline-first, com sincronização manual na DEMO.
- UI deixa claras as limitações através de badges e tooltips.

## Próximos Passos Possíveis
- Adicionar camada de sincronização opcional com backend real.
- Implementar autenticação multiusuário e RLS de verdade.
- Integrar com PSP homologado para pagamentos PIX reais.
- Suportar geração de documentos fiscais quando fora do modo DEMO.
