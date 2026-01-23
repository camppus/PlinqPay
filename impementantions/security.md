# 🛡 AngolaPay SaaS - Security Guidelines

Este documento define os **métodos de segurança essenciais** para o funcionamento seguro da plataforma SaaS de pagamentos angolanos.

---

## 1️⃣ Autenticação e Identidade

### 🔑 API Key Management

* `createApiKey()` - gera nova chave
* `rotateApiKey()` - rotaciona chave existente
* `revokeApiKey()` - revoga chave
* `listApiKeys()` - lista chaves ativas

**Boas práticas:**

* Hash de secrets no banco
* Escopos por chave
* Data de expiração
* IP allowlist

### 🧾 OAuth interno

* Tokens curtos e refresh tokens
* Rotação periódica

---

## 2️⃣ Autorização e Isolamento

### 🔐 Controle baseado em escopo (Scope)

* `payments:read`, `payments:write`
* `wallets:read`
* `withdrawals:write`
* `webhooks:manage`

### 🧱 Isolamento de Tenant

* Validação de `company_id + resource_id`
* Nenhuma empresa acessa dados de outra

---

## 3️⃣ Comunicação Segura

* HTTPS obrigatório
* TLS 1.2+
* Certificate pinning (para SDKs)

---

## 4️⃣ Segurança de Webhooks

* `verifyWebhookSignature()` usando HMAC + timestamp
* Proteção contra replay attacks (janela de 5 min)
* Retry controlado com backoff exponencial
* Dead-letter queue para falhas

---

## 5️⃣ Segurança Financeira

* Ledger imutável (`createLedgerEntry()`)
* Idempotência (`Idempotency-Key`)
* Double-entry accounting: débitos = créditos

---

## 6️⃣ Proteção contra Abusos

* Rate limiting (por API Key, IP, endpoint)
* Anomaly detection: picos, falhas, saques anormais

---

## 7️⃣ Segurança de Saques

* Fluxo de aprovação (manual ou automático)
* Limites diários
* Strong Customer Authentication (OTP, SMS, Email)

---

## 8️⃣ Proteção de Dados Sensíveis

* Criptografia em repouso (wallets, chaves, dados bancários)
* Data masking em logs e respostas

---

## 9️⃣ Auditoria e Compliance

* `logSecurityEvent()` - logs imutáveis e assinados
* Trilhas completas: quem, quando, de onde, o quê
* Princípios de PCI-DSS e separação de responsabilidades

---

## 🔟 Segurança de Infraestrutura

* Private VPC / Zero-trust
* WAF / Firewall (bloqueio por país/IP)
* Proteção DDoS

---

## 1️⃣1️⃣ Segurança de Código

* SAST / DAST / Dependency scanning
* Secrets Management com rotação automática

---

## 1️⃣2️⃣ Resiliência & Recuperação

* Backups criptografados e testados
* Kill switch para emergências (parar pagamentos/saques)

---

## ✅ Checklist Rápido

| Área                    | Status Necessário |
| ----------------------- | ----------------- |
| API Keys & Scopes       | ✅                 |
| HMAC Webhooks           | ✅                 |
| Ledger Imutável         | ✅                 |
| Idempotência            | ✅                 |
| Rate Limiting           | ✅                 |
| Auditoria               | ✅                 |
| Criptografia            | ✅                 |
| Isolamento Multi-tenant | ✅                 |
| Aprovação de Saques     | ✅                 |

---

> Este documento serve como **base para implementação, auditoria e compliance** da plataforma AngolaPay SaaS.
