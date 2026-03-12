# 🔐 Audit System

> Sistema de auditoria empresarial com interceptação automática de eventos, dashboard em tempo real, exportação com integridade criptográfica e WebSocket para logs ao vivo.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![Django](https://img.shields.io/badge/Django-5.0-green?logo=django)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [API Reference](#api-reference)
- [Funcionalidades](#funcionalidades)
- [Segurança](#segurança)

---

## Visão Geral

O **Audit System** é uma solução de auditoria cross-cutting que resolve um problema universal em empresas reguladas: **saber quem fez o quê e quando**. Toda alteração em qualquer model Django é interceptada automaticamente via signals, registrada com contexto completo (usuário, IP, user-agent, diff antes/depois) e disponibilizada via API REST e dashboard interativo.

### Casos de uso

- Compliance com LGPD e regulamentações setoriais
- Auditorias internas e externas
- Rastreabilidade em fintechs, healthtechs e empresas jurídicas
- Investigação de incidentes e análise forense de dados

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│   Dashboard │ Timeline │ DiffViewer │ Filters │ Export   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST + WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                    Backend (Django)                       │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Middleware  │  │   Signals    │  │    Channels    │  │
│  │ (IP + User) │  │ (intercepta  │  │  (WebSocket    │  │
│  │             │  │  todo model) │  │   real-time)   │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                │                   │            │
│  ┌──────▼────────────────▼───────────────────▼────────┐  │
│  │                   AuditLog Model                    │  │
│  │    user │ content_type │ action │ changes (JSON)   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌───────────────┐  ┌──────────────────────────────┐    │
│  │  REST API     │  │     Export Module             │    │
│  │  (DRF + JWT)  │  │  CSV + PDF + SHA-256          │    │
│  └───────────────┘  └──────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────┘
                               │
              ┌────────────────┴──────────────┐
              │                               │
     ┌────────▼────────┐           ┌──────────▼──────┐
     │   PostgreSQL 16  │           │    Redis 7       │
     │   (dados)        │           │  (channels +     │
     └──────────────────┘           │   cache)         │
                                    └─────────────────┘
```

---

## Stack Tecnológica

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Python | 3.11+ | Runtime |
| Django | 5.0.4 | Framework principal |
| Django REST Framework | 3.15.1 | API REST |
| djangorestframework-simplejwt | 5.3.1 | Autenticação JWT |
| Django Channels | 4.1.0 | WebSocket (logs em tempo real) |
| channels-redis | 4.2.0 | Channel layer via Redis |
| psycopg | 3.2.13 | Driver PostgreSQL |
| celery | 5.3.6 | Tarefas assíncronas |
| redis | 5.0.4 | Broker/cache |
| python-decouple | 3.8 | Variáveis de ambiente |
| reportlab | 4.1.0 | Geração de PDF |
| django-filter | 24.2 | Filtros avançados na API |
| django-cors-headers | 4.3.1 | CORS para o frontend |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | Framework UI |
| Vite | 7 | Build tool |
| React Router | 6 | Roteamento |
| TanStack Query | 5 | Cache e estado servidor |
| Axios | 1 | HTTP client |
| Day.js | 1 | Formatação de datas |

### Infraestrutura
| Serviço | Versão | Uso |
|---|---|---|
| PostgreSQL | 16-alpine | Banco principal |
| Redis | 7-alpine | Channel layer + cache |
| Docker Compose | 2+ | Orquestração local |

---

## Estrutura do Projeto

```
audit-system/
├── config/                        # Configurações Django
│   ├── settings/
│   │   ├── base.py                # Settings compartilhados
│   │   ├── development.py         # Settings de desenvolvimento
│   │   └── production.py          # Settings de produção
│   ├── asgi.py                    # ASGI + Django Channels
│   └── urls.py                    # URLs raiz
│
├── audit/                         # App principal de auditoria
│   ├── middleware/
│   │   └── audit_middleware.py    # Captura request por thread local
│   ├── signals/
│   │   └── handlers.py            # Intercepta create/update/delete
│   ├── consumers/
│   │   ├── audit_consumer.py      # WebSocket consumer
│   │   └── routing.py             # Rotas WebSocket
│   ├── models.py                  # Model AuditLog
│   ├── serializers.py             # Serializers DRF + JWT customizado
│   ├── views.py                   # ViewSet com contagem por ação
│   └── urls.py                    # Rotas da API de auditoria
│
├── exports/                       # Módulo de exportação
│   ├── generators/
│   │   ├── csv_generator.py       # Geração de CSV com SHA-256
│   │   └── pdf_generator.py       # Geração de PDF com ReportLab
│   ├── integrity/
│   │   └── __init__.py            # Funções de hash SHA-256
│   ├── views.py                   # Views de export
│   └── urls.py                    # Rotas de export
│
├── core/                          # Utilitários compartilhados
│   └── utils/
│
├── frontend/                      # Aplicação React
│   └── src/
│       ├── components/
│       │   ├── Timeline/          # Timeline interativa de eventos
│       │   ├── DiffViewer/        # Diff visual antes/depois
│       │   ├── Filters/           # Filtros avançados
│       │   └── ExportPanel/       # Botões de exportação
│       ├── pages/
│       │   ├── Dashboard/         # Página principal
│       │   ├── EventDetail/       # Detalhe de um evento
│       │   └── Login/             # Tela de autenticação
│       ├── hooks/
│       │   ├── useAuditLogs.js    # Hook para logs com cache
│       │   └── useAuth.js         # Hook de autenticação
│       └── services/
│           ├── api.js             # Axios + interceptors JWT
│           ├── auth.js            # Login/logout/token
│           └── auditService.js    # Chamadas à API de auditoria
│
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
│
├── docker/
│   └── Dockerfile.backend
├── docker-compose.yml
└── .env.example
```

---

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- Docker e Docker Compose
- Git

---

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/fabiojnrdev/audit-system.git
cd audit-system
```

### 2. Configure o ambiente Python

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

pip install -r requirements/development.txt
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 4. Suba os serviços com Docker

```bash
docker compose up -d db redis
```

### 5. Execute as migrations

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 6. Inicie o backend

```bash
python manage.py runserver
```

### 7. Instale e inicie o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:8000/api
- **Admin Django:** http://localhost:8000/admin

---

## Variáveis de Ambiente

```env
SECRET_KEY=your-secret-key
DEBUG=True
DJANGO_SETTINGS_MODULE=config.settings.development

DB_NAME=audit_db
DB_USER=audit_user
DB_PASSWORD=audit_pass
DB_HOST=localhost
DB_PORT=5433

REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## API Reference

### Autenticação

```http
POST /api/auth/token/
Content-Type: application/json

{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

**Response:**
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "username": "fabioadm",
    "email": "admin@email.com",
    "is_staff": true
  }
}
```

```http
POST /api/auth/token/refresh/
Content-Type: application/json

{ "refresh": "eyJ..." }
```

---

### Logs de Auditoria

```http
GET /api/audit/logs/
Authorization: Bearer {access_token}
```

**Query params:**
| Param | Tipo | Descrição |
|---|---|---|
| `action` | string | `CREATE`, `UPDATE` ou `DELETE` |
| `user` | integer | ID do usuário |
| `search` | string | Busca em object_repr e username |
| `page` | integer | Paginação (50 por página) |

**Response:**
```json
{
  "count": 42,
  "count_by_action": {
    "CREATE": 30,
    "UPDATE": 10,
    "DELETE": 2
  },
  "results": [
    {
      "id": 1,
      "user": "fabioadm",
      "content_type": "auth | user",
      "object_id": "3",
      "object_repr": "joao",
      "action": "CREATE",
      "action_display": "Criação",
      "changes": {
        "username": { "before": null, "after": "joao" },
        "email": { "before": null, "after": "joao@email.com" }
      },
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0...",
      "timestamp": "2026-03-11T14:30:00Z"
    }
  ]
}
```

---

### Exportação

```http
GET /api/exports/csv/
GET /api/exports/pdf/
Authorization: Bearer {access_token}
```

**Query params:** mesmos filtros dos logs (`action`, `user`)

**Response headers:**
```
Content-Disposition: attachment; filename="audit_log.csv"
X-Content-SHA256: a3f5c8d2e1b4...  ← hash de integridade
```

---

## Funcionalidades

### Interceptação automática via Signals

O sistema usa `pre_save`, `post_save` e `post_delete` do Django para capturar qualquer alteração em qualquer model, sem necessidade de modificar os models existentes.

```python
# Qualquer save em qualquer model é automaticamente auditado
user = User.objects.create(username='joao')
# → AuditLog criado: action=CREATE, changes={todos os campos}

user.email = 'joao@email.com'
user.save()
# → AuditLog criado: action=UPDATE, changes={email: {before: '', after: 'joao@...'}}

user.delete()
# → AuditLog criado: action=DELETE, changes={todos os campos}
```

### Middleware de contexto

Um middleware captura o `request` atual via `threading.local()`, permitindo que os signals saibam quem está fazendo a ação sem receber o request explicitamente.

### Integridade criptográfica

Todos os exports (CSV e PDF) incluem um hash SHA-256 no header `X-Content-SHA256`. Isso permite verificar que o arquivo não foi alterado após a exportação.

```python
import hashlib

with open('audit_log.csv', 'rb') as f:
    content = f.read()
    hash_calculado = hashlib.sha256(content).hexdigest()
    # Compare com o header X-Content-SHA256
```

---

## Segurança

- Autenticação JWT com access token de 8h e refresh de 7 dias
- Renovação automática de token via interceptor Axios
- API 100% protegida por `IsAuthenticated`
- CORS configurado apenas para origens permitidas
- Models excluídos da auditoria para evitar loops: `AuditLog`, `LogEntry`, `Session`, `Migration`
- Try/except em toda a lógica de auditoria — nunca quebra a operação principal

---

## Licença

MIT License — sinta-se livre para usar, modificar e distribuir.

---

Desenvolvido por **Fábio Jr** — [GitHub](https://github.com/fabiojnrdev)
