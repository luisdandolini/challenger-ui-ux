# Challenger 🎮

Plataforma de quiz gamificado em tempo real para uso em sala de aula. O professor cria quizzes reutilizáveis, abre salas ao vivo e os alunos entram pelo celular ou computador — sem cadastro.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-ffca28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)

## Funcionalidades

- **Quizzes reutilizáveis** — professor cria e salva quizzes, usa em várias turmas
- **Sala ao vivo** — professor controla o ritmo das rodadas em tempo real
- **Temporizador automático** — pergunta encerra sozinha ao acabar o tempo
- **Gamificação** — XP por acerto, bônus de velocidade e multiplicador de streak
- **Ranking ao vivo** — atualizado após cada rodada para todos os participantes
- **Gráfico de respostas** — professor vê a distribuição de respostas em tempo real
- **Sem cadastro para alunos** — basta o código da sala e um nome

## Tecnologias

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) — build tool
- [Tailwind CSS v4](https://tailwindcss.com) — estilização
- [React Router v6](https://reactrouter.com) — roteamento
- [Firebase](https://firebase.google.com) — autenticação e banco de dados em tempo real (Firestore)

## Estrutura do projeto

```
src/
├── features/
│   ├── admin/              # Área do professor
│   │   ├── components/     # AdminLogin, AdminRoom, QuizList, QuizEditor
│   │   ├── hooks/          # useAdmin, useAuth, useAdminRoom, useQuizzes
│   │   └── index.ts
│   └── room/               # Área do aluno
│       ├── components/     # PlayerRoom, JoinRoom
│       ├── hooks/          # useRoom
│       └── index.ts
├── lib/
│   ├── services/           # roomService, playerService, quizService
│   ├── firebase.ts         # Inicialização do Firebase
│   └── types.ts            # Tipos compartilhados
├── pages/                  # Uma página por rota
└── router.tsx
```

## Rotas

| Rota            | Descrição                                                 |
| --------------- | --------------------------------------------------------- |
| `/`             | Tela inicial                                              |
| `/admin`        | Área do professor — quizzes, salas e controle de partidas |
| `/join`         | Aluno entra com código da sala e nome                     |
| `/room/:roomId` | Sala ao vivo — perguntas, respostas e ranking             |

## Como rodar localmente

**Pré-requisitos:** Node.js 18+

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/challenger-ui-ux.git
cd challenger-ui-ux

# Instalar dependências
npm install

# Configurar variáveis de ambiente (ver seção abaixo)
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

### Configuração do Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Registre um app Web e copie as credenciais
3. Ative **Authentication → E-mail/senha**
4. Crie um banco **Firestore Database** (modo de teste)
5. Preencha o `.env` com suas credenciais:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

6. Crie o usuário admin em **Authentication → Users → Adicionar usuário**

## Fluxo de uso

### Professor

1. Acessa `/admin` e faz login
2. Cria um quiz com perguntas, opções, gabarito e dificuldade
3. Clica em **Iniciar sala** — recebe um código de 6 letras
4. Compartilha o código com os alunos e aguarda entrarem
5. Inicia as perguntas — o timer encerra automaticamente cada rodada
6. Acompanha o gráfico de respostas e o ranking em tempo real

### Aluno

1. Acessa `/join`, digita o código da sala e seu nome
2. Aguarda o professor iniciar
3. Responde cada pergunta dentro do tempo
4. Vê o ranking após cada rodada

## Sistema de XP

| Dificuldade | XP base | Bônus velocidade (< 5s) | Streak (3+) |
| ----------- | ------- | ----------------------- | ----------- |
| Fácil       | 10 XP   | +8 XP                   | ×1.5        |
| Médio       | 20 XP   | +8 XP                   | ×1.5        |
| Difícil     | 35 XP   | +8 XP                   | ×1.5        |

## Deploy

O projeto usa **Firebase Hosting** com deploy automático via GitHub Actions.

| Evento         | Resultado                          |
| -------------- | ---------------------------------- |
| Push na `main` | Deploy em produção automaticamente |
| Pull Request   | Preview channel com URL temporária |

### Configuração dos secrets no GitHub

Adicione as variáveis em **Settings → Secrets → Actions** do repositório antes do primeiro deploy:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Regras de segurança do Firestore

Após os 30 dias do modo de teste, atualize as regras em **Firestore → Regras**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /quizzes/{quizId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.adminId;
      allow create: if request.auth != null;
    }

    match /rooms/{roomId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.adminId;

      match /questions/{q} {
        allow read: if true;
        allow write: if request.auth != null;
      }
      match /players/{p} {
        allow read: if true;
        allow create: if true;
        allow update: if true;
      }
      match /answers/{a} {
        allow read: if request.auth != null;
        allow create: if true;
      }
    }
  }
}
```

## Licença

MIT
