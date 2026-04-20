export type Nivel = 'facil' | 'medio' | 'dificil'

export interface Question {
  id: number
  nivel: Nivel
  pergunta: string
  opcoes: string[]
  resposta: number
  explicacao?: string
}

export interface Level {
  min: number
  max: number
  label: string
  icon: string
  color: string
}

export interface Badge {
  id: string
  label: string
  icon: string
  desc: string
}

// ============================================================
//  BANCO DE PERGUNTAS — edite aqui para adicionar/remover
//  nivel: "facil" | "medio" | "dificil"
//  resposta: índice da opção correta (0-based)
//  explicacao: (opcional) exibida após a resposta
// ============================================================

export const questions: Question[] = [
  // ── FÁCIL ──────────────────────────────────────────────────
  {
    id: 1,
    nivel: 'facil',
    pergunta: 'O que significa a sigla UI?',
    opcoes: ['User Interface', 'User Interaction', 'Unified Integration', 'Universal Input'],
    resposta: 0,
    explicacao: 'UI (User Interface) é a interface com a qual o usuário interage diretamente.',
  },
  {
    id: 2,
    nivel: 'facil',
    pergunta: 'O que significa a sigla UX?',
    opcoes: ['User Experience', 'User Execution', 'Unified Experience', 'Ultra Extension'],
    resposta: 0,
    explicacao: 'UX (User Experience) trata da experiência geral que o usuário tem ao interagir com um produto.',
  },
  {
    id: 3,
    nivel: 'facil',
    pergunta: 'Qual das cores a seguir é considerada uma cor primária no modelo de luz (RGB)?',
    opcoes: ['Amarelo', 'Verde', 'Roxo', 'Laranja'],
    resposta: 1,
    explicacao: 'No modelo RGB (luz), as cores primárias são Vermelho, Verde e Azul.',
  },
  {
    id: 4,
    nivel: 'facil',
    pergunta: 'O que é "whitespace" (espaço em branco) no design?',
    opcoes: [
      'Área da tela que não tem nada',
      'Espaço intencional entre elementos para melhorar legibilidade',
      'Cor de fundo branca obrigatória',
      'Margem padrão de 16px',
    ],
    resposta: 1,
    explicacao: 'Whitespace é espaço usado intencionalmente para dar respiro visual e organizar a hierarquia.',
  },
  {
    id: 5,
    nivel: 'facil',
    pergunta: 'Qual elemento de UI é mais adequado para o usuário selecionar UMA opção entre várias?',
    opcoes: ['Checkbox', 'Toggle', 'Radio button', 'Dropdown (múltiplo)'],
    resposta: 2,
    explicacao: 'Radio buttons garantem seleção exclusiva (apenas um item por vez).',
  },
  {
    id: 6,
    nivel: 'facil',
    pergunta: 'O que é tipografia?',
    opcoes: [
      'A ciência das cores em interfaces',
      'O estilo, arranjo e aparência do texto',
      'Um tipo de grid system',
      'Nomenclatura de fontes vetoriais',
    ],
    resposta: 1,
    explicacao: 'Tipografia é a arte e técnica de dispor o tipo para tornar a linguagem escrita legível e visualmente atraente.',
  },
  {
    id: 7,
    nivel: 'facil',
    pergunta: 'Qual é o propósito principal de um wireframe?',
    opcoes: [
      'Definir as cores finais do produto',
      'Esboçar a estrutura e layout sem detalhes visuais',
      'Criar animações para o protótipo',
      'Documentar o código front-end',
    ],
    resposta: 1,
    explicacao: 'Wireframes são esboços de baixa fidelidade que focam em estrutura e funcionalidade.',
  },

  // ── MÉDIO ──────────────────────────────────────────────────
  {
    id: 8,
    nivel: 'medio',
    pergunta: 'O que é "hierarquia visual" em UI Design?',
    opcoes: [
      'Organização do código CSS por prioridade',
      'Ordem de importância dos elementos que guia o olhar do usuário',
      'Sistema de pastas do projeto de design',
      'Ranking de componentes mais usados',
    ],
    resposta: 1,
    explicacao: 'Hierarquia visual direciona o olhar do usuário do elemento mais importante ao menos importante.',
  },
  {
    id: 9,
    nivel: 'medio',
    pergunta: 'Qual das leis de UX descreve que "usuários gastam mais tempo em outros sites"?',
    opcoes: ['Lei de Fitts', 'Lei de Jakob', 'Lei de Hick', 'Lei de Miller'],
    resposta: 1,
    explicacao: 'A Lei de Jakob diz que os usuários preferem que seu site funcione da mesma forma que outros sites que já conhecem.',
  },
  {
    id: 10,
    nivel: 'medio',
    pergunta: 'O que é "affordance" em design?',
    opcoes: [
      'A capacidade financeira do usuário',
      'Pista visual que indica como um elemento deve ser usado',
      'Tempo de carregamento aceitável',
      'Tamanho mínimo de fonte para acessibilidade',
    ],
    resposta: 1,
    explicacao: 'Affordance é a propriedade de um objeto que sugere como ele deve ser utilizado (ex: botão parece clicável).',
  },
  {
    id: 11,
    nivel: 'medio',
    pergunta: 'O que é contraste de cores no contexto de acessibilidade (WCAG)?',
    opcoes: [
      'Diferença entre cor primária e secundária',
      'Relação de luminosidade entre texto e fundo para garantir legibilidade',
      'Uso de no mínimo 3 cores no design',
      'Paleta de cores para daltônicos',
    ],
    resposta: 1,
    explicacao: 'WCAG define razões mínimas de contraste: 4.5:1 para texto normal e 3:1 para texto grande.',
  },
  {
    id: 12,
    nivel: 'medio',
    pergunta: 'Qual é a diferença entre protótipo de baixa e alta fidelidade?',
    opcoes: [
      'Baixa fidelidade é digital; alta fidelidade é papel',
      'Baixa fidelidade foca em estrutura; alta fidelidade inclui visual e interações reais',
      'Alta fidelidade usa mais cores; baixa fidelidade é preto e branco',
      'Não há diferença prática entre eles',
    ],
    resposta: 1,
    explicacao: 'Protótipos de baixa fidelidade (lo-fi) exploram estrutura; os de alta fidelidade (hi-fi) simulam o produto final.',
  },
  {
    id: 13,
    nivel: 'medio',
    pergunta: 'O que é um "Design System"?',
    opcoes: [
      'Software exclusivo da Adobe para designers',
      'Conjunto de componentes, padrões e diretrizes reutilizáveis de um produto',
      'Grade de 12 colunas padrão do Bootstrap',
      'Metodologia ágil para times de design',
    ],
    resposta: 1,
    explicacao: 'Um Design System é a fonte única de verdade que reúne componentes, tokens e documentação para times de produto.',
  },
  {
    id: 14,
    nivel: 'medio',
    pergunta: 'Quantas cores a roda cromática tradicional possui?',
    opcoes: ['6', '10', '12', '16'],
    resposta: 2,
    explicacao: 'A roda cromática tradicional possui 12 cores: 3 primárias, 3 secundárias e 6 terciárias.',
  },

  // ── DIFÍCIL ────────────────────────────────────────────────
  {
    id: 15,
    nivel: 'dificil',
    pergunta: 'A Lei de Fitts afirma que o tempo para atingir um alvo depende de:',
    opcoes: [
      'Cor e contraste do alvo',
      'Distância até o alvo e tamanho do alvo',
      'Número de opções disponíveis na tela',
      'Velocidade de conexão do usuário',
    ],
    resposta: 1,
    explicacao: 'A Lei de Fitts: T = a + b × log₂(2D/W). Alvos maiores e mais próximos são atingidos mais rapidamente.',
  },
  {
    id: 16,
    nivel: 'dificil',
    pergunta: 'O que é o "Efeito de Usabilidade Estética" (Aesthetic-Usability Effect)?',
    opcoes: [
      'Usuários preferem interfaces feias pois parecem mais funcionais',
      'Interfaces esteticamente agradáveis são percebidas como mais fáceis de usar',
      'A usabilidade melhora proporcionalmente ao número de animações',
      'Usuários ignoram erros em interfaces bem desenhadas',
    ],
    resposta: 1,
    explicacao: 'Interfaces bonitas criam uma percepção de maior usabilidade, mesmo quando a funcionalidade é igual.',
  },
  {
    id: 17,
    nivel: 'dificil',
    pergunta: 'Em tipografia, o que é "kerning"?',
    opcoes: [
      'Espaçamento entre linhas de texto',
      'Ajuste fino do espaço entre pares de caracteres específicos',
      'Peso da fonte (bold, regular)',
      'Tamanho mínimo de fonte legível',
    ],
    resposta: 1,
    explicacao: 'Kerning é o ajuste de espaço entre pares de letras específicos (ex: "AV") para equilíbrio visual.',
  },
  {
    id: 18,
    nivel: 'dificil',
    pergunta: 'O que é "progressive disclosure" (revelação progressiva) em UX?',
    opcoes: [
      'Mostrar todos os recursos de uma vez para o usuário avançado',
      'Exibir apenas informações relevantes para o contexto atual, revelando complexidade sob demanda',
      'Técnica de loading progressivo de imagens',
      'Método de teste A/B com grupos progressivos',
    ],
    resposta: 1,
    explicacao: 'Progressive disclosure reduz sobrecarga cognitiva mostrando apenas o necessário e revelando mais conforme o usuário precisa.',
  },
  {
    id: 19,
    nivel: 'dificil',
    pergunta: 'Qual padrão de navegação é mais adequado para aplicativos com 5 ou mais seções principais em mobile?',
    opcoes: [
      'Tab Bar (bottom navigation)',
      'Hamburger menu',
      'Tab Bar com overflow menu ("+") para itens extras',
      'Breadcrumbs',
    ],
    resposta: 2,
    explicacao: 'Tab bars comportam bem 3-5 itens. Para mais seções, o padrão tab + overflow menu mantém acessibilidade sem ocultar tudo.',
  },
  {
    id: 20,
    nivel: 'dificil',
    pergunta: 'O que é "cognitive load" (carga cognitiva) no contexto de UX Design?',
    opcoes: [
      'Velocidade de processamento do servidor',
      'Esforço mental necessário para o usuário usar uma interface',
      'Número total de cliques em um fluxo',
      'Taxa de abandono de formulários longos',
    ],
    resposta: 1,
    explicacao: 'Carga cognitiva é o esforço mental que o usuário precisa aplicar. Bom design a reduz ao mínimo.',
  },
]

export const LEVELS: Level[] = [
  { min: 0,    max: 99,       label: 'Novato', icon: '🌱', color: '#8888aa' },
  { min: 100,  max: 299,      label: 'Júnior', icon: '⚡', color: '#4ade80' },
  { min: 300,  max: 599,      label: 'Pleno',  icon: '🔥', color: '#fbbf24' },
  { min: 600,  max: 999,      label: 'Sênior', icon: '💎', color: '#7c6af7' },
  { min: 1000, max: Infinity, label: 'Expert', icon: '🏆', color: '#f7836a' },
]

export const BADGES: Badge[] = [
  { id: 'first_blood', label: 'Primeira Resposta', icon: '🎯', desc: 'Responda sua primeira pergunta' },
  { id: 'perfect',     label: 'Perfeccionista',    icon: '✨', desc: 'Acerte todas as perguntas do quiz' },
  { id: 'streak_3',    label: 'Em Chamas',         icon: '🔥', desc: 'Acerte 3 seguidas' },
  { id: 'streak_5',    label: 'Imparável',         icon: '⚡', desc: 'Acerte 5 seguidas' },
  { id: 'speedster',   label: 'Velocista',         icon: '🚀', desc: 'Responda em menos de 3s' },
  { id: 'hard_master', label: 'Mestre do Difícil', icon: '💎', desc: 'Acerte 3 perguntas difíceis' },
  { id: 'comeback',    label: 'Comeback',          icon: '💪', desc: 'Acerte após errar 3 seguidas' },
]

export const XP_TABLE: Record<Nivel, number> = { facil: 10, medio: 20, dificil: 35 }
export const SPEED_BONUS = { threshold: 5, xp: 8 } as const
export const STREAK_BONUS = { threshold: 3, multiplier: 1.5 } as const
