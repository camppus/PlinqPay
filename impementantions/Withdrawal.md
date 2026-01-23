# 💸 AngolaPay SaaS - Saques com Código Referencial

Este documento descreve o processo de **saques com validação de identidade via código referencial** na plataforma AngolaPay SaaS.

---

## 🎯 Objetivo

Garantir que apenas usuários verificados possam realizar saques, prevenindo fraudes e garantindo compliance.

---

## 1️⃣ Estados do Saque

| Estado               | Descrição                                                            |
| -------------------- | -------------------------------------------------------------------- |
| `initiated`          | Usuário iniciou o saque, aguardando validação                        |
| `waitForConfirmation` | Sistema enviou código referencial, aguardando confirmação do usuário |
| `verified`           | Código confirmado, saque autorizado                                  |
| `processing`         | Saque sendo processado no gateway real                               |
| `completed`          | Saque concluído com sucesso                                          |
| `failed`             | Saque falhou (código errado, saldo insuficiente, erro gateway)       |

---

## 2️⃣ Passo a Passo do Fluxo

1. **Solicitação de Saque**

   - Usuário informa valor e carteira de destino
   - Sistema cria saque com status `initiated`

2. **Envio do Código Referencial**

   - Sistema gera código único e temporário (ex: 6 dígitos ou UUID)
   - Código enviado via:

     - SMS
     - Email
     - App Push

   - Status do saque atualizado para `waitForPaymentData`

3. **Confirmação do Código**

   - Usuário envia código de volta
   - Sistema valida:

     - Código correto
     - Código dentro do tempo de validade

   - Se válido → status muda para `verified`
   - Se inválido → usuário recebe aviso, tentativas limitadas

4. **Processamento do Saque**

   - Após verificação, saque é enviado para o gateway real
   - Status `processing`
   - Registro de evento no ledger para auditoria

5. **Conclusão**

   - Sucesso → `completed`
   - Falha → `failed` com notificação ao usuário

---

## 3️⃣ Segurança Adicional

- Código único e expira rapidamente (ex: 5–10 minutos)
- Limite de tentativas (ex: 3 tentativas)
- Auditoria de cada evento:

  - Quem solicitou
  - Quando
  - Código enviado/confirmado

- Rate limiting por usuário para prevenir ataques de força bruta

---

## 4️⃣ Boas Práticas

- Não enviar código por canais inseguros
- Não expor código em logs públicos
- Bloquear saque se KYC/KYB não estiver aprovado
- Registrar cada alteração de status no ledger
- Garantir comunicação criptografada para códigos e notificações

---

> Este documento serve como guia para implementar **saques seguros com validação de identidade via código referencial** na plataforma A
