# BIPA

SaaS demo para brechos e pequenas lojas de roupa catalogarem produtos, montarem uma vitrine digital e simularem vendas com fluxo de pagamento.

## O que existe hoje

- Landing page publica com proposta, planos, depoimentos e chamadas para teste.
- Cadastro/login demonstrativo de loja.
- Painel administrativo com estoque, pedidos, clientes, relatorios e configuracoes.
- PDV para venda rapida, carrinho e simulacao de checkout.
- Marketplace/vitrine publica com busca e detalhes de produto.
- PWA basica com manifest e service worker.

## Stack real do repositorio

Este prototipo e uma aplicacao estatica em HTML, CSS e JavaScript puro. Os dados de demonstracao ficam no navegador, principalmente em `localStorage`.

Arquivos principais:

- `index.html` - landing page.
- `styles.css` - design system e estilos globais.
- `script.js` - comportamento da landing e fluxo inicial.
- `app/admin/` - painel do lojista.
- `app/pdv/` - ponto de venda.
- `marketplace/` - vitrine publica.
- `manifest.json` e `sw.js` - suporte PWA.

## Rodando localmente

```bash
npm install
npm run dev
```

O servidor local sobe em `http://localhost:3456`.

## Deploy

O projeto pode ser publicado como site estatico. Para GitHub Pages, Vercel, Netlify ou Cloudflare Pages, publique a raiz do repositorio.

Antes de apresentar:

- Abrir `index.html` e conferir a landing.
- Testar os fluxos em `app/admin/`, `app/pdv/` e `marketplace/`.
- Limpar dados locais do navegador se quiser uma demonstracao do zero.
- Deixar claro que pagamentos Stripe/Pix ainda sao simulados nesta versao.

## Limites atuais

- Nao ha backend real nem autenticacao persistente.
- Nao ha integracao real com Stripe, Pix ou PSP.
- Estoque, vendas e clientes sao dados locais de demonstracao.
- O marketplace ainda e uma vitrine demonstrativa, sem compra real ponta a ponta.

## Proximos passos

- Backend com contas de loja, usuarios e permissoes.
- Banco de dados real para produtos, pedidos, clientes e pagamentos.
- Checkout com Stripe/Pix homologado.
- Upload de imagens e gerenciamento de catalogo por loja.
- Publicacao de vitrines por slug/subdominio.
