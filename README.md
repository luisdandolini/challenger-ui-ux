# Challenger 🎮

Plataforma de quiz gamificado em tempo real. O professor cria salas com perguntas personalizadas sobre qualquer tema, gera um código de acesso e os alunos entram pelo celular ou computador — sem cadastro.

## Funcionalidades

- **Sala ao vivo** — professor controla o ritmo das rodadas em tempo real
- **Gamificação** — XP por acerto, bônus de velocidade, multiplicador de streak
- **Ranking ao vivo** — atualizado após cada rodada para todos os participantes
- **Sem cadastro para alunos** — basta o código da sala e um nome
- **Perguntas customizadas** — professor cria as perguntas direto na plataforma

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
│   ├── admin/          # Login, criação de sala e controle de rodadas
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── room/           # Entrada na sala, respostas e ranking do jogador
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── pages/              # Uma página por rota
│   ├── HomePage.tsx    # /
│   ├── AdminPage.tsx   # /admin
│   ├── JoinPage.tsx    # /join
│   └── RoomPage.tsx    # /room/:roomId
├── lib/
│   ├── firebase.ts     # Inicialização do Firebase
│   └── types.ts        # Tipos compartilhados
├── router.tsx          # Definição das rotas
└── styles/
    └── index.css
```

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Tela inicial — escolher entre entrar em sala ou área do professor |
| `/admin` | Login do professor, criação de sala e controle das rodadas |
| `/join` | Aluno digita o código da sala e seu nome |
| `/room/:roomId` | Sala ao vivo — perguntas, respostas e ranking |

## Como rodar localmente

**Pré-requisitos:** Node.js 18+

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Configuração do Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Registre um app Web e copie as credenciais
3. Ative **Authentication → E-mail/senha**
4. Crie um banco **Firestore Database** (modo de teste)
5. Crie um arquivo `.env` na raiz do projeto:

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
2. Cria uma sala adicionando perguntas (enunciado, 4 opções, resposta correta, dificuldade)
3. Recebe um **código de 6 letras** para compartilhar com os alunos
4. Aguarda os alunos entrarem e clica em **Iniciar pergunta**
5. Ao encerrar cada pergunta, clica em **Mostrar ranking**
6. Avança para a próxima pergunta até o fim da partida

### Aluno
1. Acessa `/join`, digita o código da sala e seu nome
2. Aguarda o professor iniciar
3. Responde cada pergunta dentro do tempo
4. Vê o ranking após cada rodada

## Sistema de XP

| Dificuldade | XP base | Bônus velocidade (< 5s) | Streak (3+) |
|---|---|---|---|
| Fácil | 10 XP | +8 XP | ×1.5 |
| Médio | 20 XP | +8 XP | ×1.5 |
| Difícil | 35 XP | +8 XP | ×1.5 |

## Deploy

O projeto usa **Firebase Hosting** com deploy automático via GitHub Actions.

| Evento | Resultado |
|---|---|
| Push na `main` | Deploy em produção automaticamente |
| Pull Request | Preview channel gerado com URL temporária |

### Configuração dos secrets no GitHub

Antes do primeiro deploy, adicione as variáveis do Firebase em **Settings → Secrets → Actions** do repositório:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```
