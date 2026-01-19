# 📝 AngolaPay SaaS - Validação KYC/KYB

Este documento descreve o processo de **validação de identidade (KYC) e de negócios (KYB)** para usuários e empresas na plataforma AngolaPay SaaS.

---

## 🎯 Objetivo

Garantir que apenas usuários e empresas **autênticos e verificados** possam operar na plataforma, prevenindo fraudes e garantindo compliance com regulamentações financeiras.

---

## 1️⃣ Estados da Conta

| Estado                 | Descrição                              | Operações Permitidas                                                           |
| ---------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| `pending_verification` | Usuário criado, aguardando verificação | Criação de conta, upload de documentos (nenhuma operação financeira permitida) |
| `under_review`         | Documentos enviados, em análise        | Nenhuma operação financeira                                                    |
| `active`               | Conta validada com sucesso             | Todas as operações: pagamentos, saques, criação de wallets, webhooks           |
| `rejected`             | Documentos inválidos ou insuficientes  | Conta bloqueada, sem operações                                                 |

---

## 2️⃣ Processo de Validação KYC/KYB

1. **Coleta de Dados do Usuário/Empresa**

   * Nome completo / Razão social
   * Documento de identificação válido (BI, passaporte, NIF)
   * Endereço físico
   * Telefone / email

2. **Upload de Documentos**

   * Imagem ou PDF do documento
   * Comprovante de residência ou endereço da empresa

3. **Verificação Automática / Manual**

   * Conferência dos dados com bancos de dados governamentais ou parceiros de verificação
   * Validação de autenticidade de documentos
   * Checagem de restrições ou histórico de fraude

4. **Aprovação ou Rejeição**

   * `active` → usuário aprovado, pode operar normalmente
   * `rejected` → conta bloqueada, feedback enviado

---

## 3️⃣ Integração com a Plataforma

* Usuário **não pode criar API Key** nem iniciar operações financeiras enquanto não estiver `active`
* Pagamentos recebidos podem ser **permitidos com limite mínimo**, mas saques sempre bloqueados até validação
* Webhooks e callbacks **aguardam ativação da conta**

---

## 4️⃣ Boas Práticas de Segurança

* Criptografar documentos enviados em repouso
* Logs de upload e validação para auditoria
* Alertas de tentativa de fraude ou documentos suspeitos
* Retenção mínima de dados sensíveis para compliance

---

## 5️⃣ Checklist de Implementação

* [ ] Criação de estados da conta (`pending_verification`, `under_review`, `active`, `rejected`)
* [ ] API para upload de documentos
* [ ] Verificação automatizada/manual
* [ ] Bloqueio de operações financeiras até conta ativa
* [ ] Logs e auditoria de KYC/KYB
* [ ] Feedback para usuário sobre status

---

> Este documento serve como guia para implementar **validação de identidade e compliance** no AngolaPay SaaS, garantindo operações seguras e reguladas.
