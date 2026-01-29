# 🔔 AngolaPay SaaS – Módulo de Integrações de Notificações Externas

Este documento descreve o **módulo de integrações externas de notificações** da plataforma AngolaPay SaaS, permitindo que clientes recebam alertas de eventos via apps de notificação como Pushcut, Pushover, OneSignal ou outros serviços similares.

---

## 1️⃣ Objetivo

Permitir que clientes recebam notificações em tempo real sobre eventos de transações e saques via **integrações externas**, de forma:

- Segura  
- Configurável  
- Rastreável  

> Este módulo serve como ponte enquanto não temos um sistema de push nativo na plataforma.

---

## 2️⃣ Estrutura da Integração

Cada integração conterá:

| Campo            | Descrição                                                      |
| ---------------- | -------------------------------------------------------------- |
| `title`          | Nome da integração fornecido pelo usuário                     |
| `service`        | Nome do serviço externo (Pushcut, Pushover, etc.)            |
| `callback_url`   | Endpoint do serviço externo que receberá notificações        |
| `method`         | Método HTTP que será usado (`POST`, `PUT`, etc.)             |
| `body_template`  | Modelo do payload enviado (JSON)                               |
| `headers`        | Cabeçalhos HTTP adicionais (ex: `Authorization`, `Content-Type`) |
| `events`         | Tipos de eventos que serão enviados (`payment`, `withdraw`) |
| `api_key`        | API Key usada para autenticação (quando necessário pelo serviço) |
| `enabled`        | Status da integração (ativa ou desativada)                    |

> Cada integração é registrada **somente no domínio da conta do cliente** e não pode ser compartilhada.

---

## 3️⃣ Criação de Integração

Ao criar uma integração, o usuário deve fornecer:

- `title` → Nome identificador  
- `service` → Nome do serviço externo  
- `callback_url` → Endpoint do serviço externo  
- `method` → Método HTTP a ser usado  
- `body_template` → Modelo do payload JSON enviado  
- `headers` → Cabeçalhos HTTP adicionais  
- `events[]` → Lista de eventos que deseja receber (`payment`, `withdraw`)  
- `api_key` → Opcional, caso o serviço externo exija autenticação  

### Regras para callback_url

- HTTPS obrigatório  
- Método configurável (POST, PUT, etc.)  
- Payload enviado deve seguir o modelo do `body_template`  

### Exemplo de payload (`body_template`)

```json
{
  "transaction_id": "{{transaction_id}}",
  "status": "{{status}}",
  "amount": "{{amount}}",
  "wallet_id": "{{wallet_id}}",
  "timestamp": "{{timestamp}}"
}
