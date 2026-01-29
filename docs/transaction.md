# 💳 AngolaPay SaaS - Módulo de Transações

Este documento descreve o **módulo de transações** da plataforma AngolaPay SaaS, incluindo métodos de pagamento, dados necessários, fluxo, segurança e boas práticas.

---

## 1️⃣ Objetivo

Garantir que todas as transações sejam processadas de forma segura, rastreável e conforme o compliance financeiro, permitindo integração via API para clientes e parceiros.

---

## 2️⃣ Métodos de Pagamento

A plataforma suporta atualmente dois métodos de pagamento:

| Método      | Descrição                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| `reference` | Pagamento via referência única gerada pelo sistema, podendo ser pago em múltiplos pontos físicos ou digitais. |
| `paypay`    | Pagamento instantâneo via QR code ou link digital, similar a transferências rápidas.                          |

> Cada método possui regras próprias de processamento e tempo de confirmação.

---

## 3️⃣ Dados da Transação

### Dados obrigatórios

* `amount` (valor da transação)
* `payment_method` (`reference` ou `paypay`)
* `extern_id` (Id que o cliente poderá manipular)
* `transaction_reference` (ID único da transação)
* `idempotency_key` (evita duplicação de transações)
* `description` (opcional, para auditoria)

### Dados do comprador

* `customer_name`
* `customer_email`

### Dados do que foi comprado

* `items` (lista de produtos ou serviços)
  * `id`
  * `name`
  * `quantity`
  * `price`
> Estes dados auxiliam auditoria, suporte e relatórios, mas não afetam o valor financeiro.

---

## 4️⃣ Fluxo da Transação

1. Cliente cria pagamento com dados obrigatórios e opcionais.
2. Sistema valida:
   * Conta ativa (KYC/KYB)
   * Wallet válida
   * Método de pagamento válido
   * Saldo / limites permitidos
3. Criação da transação com `pending` status e `idempotency_key`.
4. Envio para gateway específico (`reference` ou `paypay`).
5. Recebimento de webhook do gateway:
   * Status atualizado: `paid` ou `failed`
6. Registro final da transação no **ledger imutável**.
7. Notificação ao usuário.

**Resumo do fluxo**:

```
Iniciação -> Validação -> Criação -> Gateway -> Webhook -> Ledger -> Notificação
```

---

## 5️⃣ Métodos de Segurança

### Autenticação & Autorização

* API Key com escopo específico (`payments:write`)
* Rotação periódica de keys
* Controle de acesso baseado em tenant / multi-empresa

### Integridade e idempotência

* `idempotency_key` obrigatório
* Transações duplicadas não são processadas

### Webhooks

* Assinatura HMAC para validar origem
* Timestamp para evitar replay attacks
* Validação do body completo

### Criptografia

* TLS obrigatório para todas as requisições
* Criptografia em repouso de dados sensíveis

### Anti-fraude e limites

* Limite de valor por transação e diário
* Análise de comportamento: IP, frequência, valores incomuns
* MFA em transações de alto valor (opcional)

### Auditoria

* Ledger imutável registrando:

  * Dados da transação
  * Origem, IP, timestamp
  * Alterações de status
* Logs detalhados para KYC/KYB e transações

### Boas práticas adicionais

* Associar transações a dispositivos/sessões
* Alertas automáticos para transações suspeitas
* Rate limiting por API Key e endpoint
* Metadata para integrar com sistemas externos sem comprometer dados sensíveis

---

## 6️⃣ Checklist de Implementação

* [ ] Suporte a métodos `reference` e `paypay`
* [ ] Campos obrigatórios e opcionais definidos
* [ ] Validação de conta ativa e wallet
* [ ] Criação de transação com status e idempotency_key
* [ ] Envio para gateway e recebimento de webhook
* [ ] Registro no ledger e auditoria completa
* [ ] Notificação ao usuário final
* [ ] Segurança: API Key, HMAC, TLS, MFA, rate limiting, análise de risco

---

> Este documento serve como guia completo para o **módulo de transações da AngolaPay SaaS**, garantindo segurança, rastreabilidade e integridade financeira.
