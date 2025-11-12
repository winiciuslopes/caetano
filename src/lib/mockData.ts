// Mock Data para o Sistema de Reciclagem - VERSÃO EXPANDIDA

export interface Player {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  level: number;
  createdAt: string;
}

export interface Family {
  id: string;
  name: string;
  code: string; // Código único para compartilhar
  createdAt: string;
  players: Player[];
}

// Interfaces antigas mantidas para compatibilidade
export interface User {
  id: string;
  name: string;
  email: string;
  familyId: string;
  avatar: string;
  totalPoints: number;
  level: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number; // 1-10
  category: string;
  explanation: string;
}

export interface WasteItem {
  id: string;
  name: string;
  correctBin: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  difficulty: number; // 1-10
}

export interface GameMetric {
  userId: string;
  questionId: string;
  answer: string;
  correct: boolean;
  timeSeconds: number;
  difficulty: string;
  timestamp: Date;
}

export interface RecyclingGuideItem {
  id: string;
  name: string;
  category: string;
  bin: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  description: string;
  tips: string[];
}

export interface Curiosity {
  id: string;
  title: string;
  content: string;
  icon: string;
  category: string;
}

// QUIZ QUESTIONS - 100+ perguntas em 10 níveis
export const quizQuestions: QuizQuestion[] = [
  // NÍVEL 1 (1-10)
  { id: 'q1', question: 'Qual é a cor da lixeira para papel e papelão?', options: ['Verde', 'Azul', 'Amarelo', 'Vermelho'], correctAnswer: 1, difficulty: 1, category: 'Cores das Lixeiras', explanation: 'A lixeira azul é destinada ao papel e papelão.' },
  { id: 'q2', question: 'Em qual lixeira devemos jogar garrafas PET?', options: ['Azul', 'Verde', 'Vermelho', 'Amarelo'], correctAnswer: 2, difficulty: 1, category: 'Plástico', explanation: 'Garrafas PET são plásticos e vão na lixeira vermelha.' },
  { id: 'q3', question: 'Qual lixeira é usada para resíduos orgânicos?', options: ['Amarela', 'Verde', 'Cinza', 'Azul'], correctAnswer: 1, difficulty: 1, category: 'Orgânicos', explanation: 'A lixeira verde é para resíduos orgânicos como restos de comida.' },
  { id: 'q4', question: 'Latas de alumínio devem ser descartadas na lixeira:', options: ['Azul', 'Amarela', 'Verde', 'Vermelha'], correctAnswer: 1, difficulty: 1, category: 'Metais', explanation: 'Latas de alumínio são metais e vão na lixeira amarela.' },
  { id: 'q5', question: 'A reciclagem ajuda a:', options: ['Aumentar o lixo', 'Preservar recursos naturais', 'Poluir mais', 'Gastar mais energia'], correctAnswer: 1, difficulty: 1, category: 'Consciência Ambiental', explanation: 'A reciclagem preserva recursos naturais e reduz a extração de matéria-prima.' },
  { id: 'q6', question: 'Garrafas de vidro vão na lixeira:', options: ['Azul', 'Verde', 'Amarela', 'Vermelha'], correctAnswer: 1, difficulty: 1, category: 'Vidro', explanation: 'O vidro vai na lixeira verde.' },
  { id: 'q7', question: 'O que significa reciclar?', options: ['Jogar no lixo', 'Transformar em novo produto', 'Queimar', 'Enterrar'], correctAnswer: 1, difficulty: 1, category: 'Conceitos Básicos', explanation: 'Reciclar é transformar resíduos em novos produtos.' },
  { id: 'q8', question: 'Qual dessas ações ajuda o meio ambiente?', options: ['Jogar lixo na rua', 'Separar o lixo', 'Desperdiçar água', 'Deixar luzes acesas'], correctAnswer: 1, difficulty: 1, category: 'Consciência Ambiental', explanation: 'Separar o lixo facilita a reciclagem e ajuda o meio ambiente.' },
  { id: 'q9', question: 'Jornais e revistas vão na lixeira:', options: ['Vermelha', 'Azul', 'Amarela', 'Cinza'], correctAnswer: 1, difficulty: 1, category: 'Papel', explanation: 'Papel vai na lixeira azul.' },
  { id: 'q10', question: 'Cascas de frutas são:', options: ['Lixo orgânico', 'Lixo plástico', 'Lixo de metal', 'Lixo de papel'], correctAnswer: 0, difficulty: 1, category: 'Orgânicos', explanation: 'Cascas de frutas são resíduos orgânicos.' },

  // NÍVEL 2 (11-20)
  { id: 'q11', question: 'Qual destes itens NÃO pode ser reciclado no papel comum?', options: ['Jornal', 'Papel higiênico usado', 'Caixa de papelão', 'Revista'], correctAnswer: 1, difficulty: 2, category: 'Papel', explanation: 'Papel higiênico usado é contaminado e não pode ser reciclado.' },
  { id: 'q12', question: 'Quanto tempo leva para uma garrafa PET se decompor?', options: ['1 ano', '10 anos', '100 anos', 'Mais de 400 anos'], correctAnswer: 3, difficulty: 2, category: 'Impacto Ambiental', explanation: 'Garrafas PET podem levar mais de 400 anos para se decompor.' },
  { id: 'q13', question: 'Pilhas e baterias devem ser:', options: ['Jogadas no lixo comum', 'Devolvidas em pontos de coleta', 'Queimadas', 'Enterradas'], correctAnswer: 1, difficulty: 2, category: 'Resíduos Perigosos', explanation: 'Pilhas contêm metais pesados e devem ir para pontos especializados.' },
  { id: 'q14', question: 'Qual porcentagem de alumínio é reciclada no Brasil?', options: ['20%', '50%', '70%', 'Mais de 95%'], correctAnswer: 3, difficulty: 2, category: 'Reciclagem', explanation: 'O Brasil recicla mais de 95% das latas de alumínio.' },
  { id: 'q15', question: 'Caixas de pizza sujas podem ser recicladas?', options: ['Sim, sempre', 'Não, a gordura contamina', 'Apenas se lavadas', 'Apenas as partes limpas'], correctAnswer: 3, difficulty: 2, category: 'Papel', explanation: 'Apenas as partes limpas podem ser recicladas.' },
  { id: 'q16', question: 'Embalagens de salgadinho (metalizada) vão para:', options: ['Lixeira amarela', 'Lixeira vermelha', 'Lixeira cinza', 'Lixeira azul'], correctAnswer: 2, difficulty: 2, category: 'Resíduos Especiais', explanation: 'Embalagens metalizadas geralmente não são recicláveis.' },
  { id: 'q17', question: 'O que é coleta seletiva?', options: ['Coletar qualquer lixo', 'Separar por tipo de material', 'Coletar apenas plástico', 'Jogar tudo junto'], correctAnswer: 1, difficulty: 2, category: 'Conceitos', explanation: 'Coleta seletiva é separar resíduos por tipo de material.' },
  { id: 'q18', question: 'Tampinhas de garrafa são feitas de:', options: ['Papel', 'Plástico', 'Vidro', 'Alumínio'], correctAnswer: 1, difficulty: 2, category: 'Plástico', explanation: 'Tampinhas são de plástico e devem ir na lixeira vermelha.' },
  { id: 'q19', question: 'Quanto tempo leva para vidro se decompor?', options: ['100 anos', '500 anos', '1000 anos', 'Mais de 4000 anos'], correctAnswer: 3, difficulty: 2, category: 'Impacto Ambiental', explanation: 'O vidro pode levar mais de 4000 anos para se decompor.' },
  { id: 'q20', question: 'Sacolas plásticas vão na lixeira:', options: ['Azul', 'Vermelha', 'Verde', 'Amarela'], correctAnswer: 1, difficulty: 2, category: 'Plástico', explanation: 'Sacolas plásticas vão na lixeira vermelha.' },

  // NÍVEL 3 (21-30)
  { id: 'q21', question: 'O que é compostagem?', options: ['Queimar lixo', 'Transformar orgânicos em adubo', 'Enterrar lixo', 'Reciclar plástico'], correctAnswer: 1, difficulty: 3, category: 'Compostagem', explanation: 'Compostagem transforma matéria orgânica em adubo.' },
  { id: 'q22', question: 'Qual é a embalagem mais difícil de reciclar?', options: ['Garrafa de vidro', 'Lata de alumínio', 'Tetra Pak', 'Jornal'], correctAnswer: 2, difficulty: 3, category: 'Reciclagem Avançada', explanation: 'Tetra Pak tem camadas de papel, plástico e alumínio.' },
  { id: 'q23', question: 'O número 5 no símbolo de reciclagem indica:', options: ['PET', 'PVC', 'Polipropileno (PP)', 'Poliestireno (PS)'], correctAnswer: 2, difficulty: 3, category: 'Identificação Plásticos', explanation: 'Número 5 = Polipropileno (PP).' },
  { id: 'q24', question: 'Diferença entre lixo orgânico e inorgânico:', options: ['Cor', 'Origem biológica', 'Tamanho', 'Peso'], correctAnswer: 1, difficulty: 3, category: 'Conceitos', explanation: 'Orgânico tem origem biológica; inorgânico não.' },
  { id: 'q25', question: 'Quantos litros de água economiza reciclar 1kg de papel?', options: ['10L', '30L', '50L', 'Mais de 100L'], correctAnswer: 2, difficulty: 3, category: 'Economia de Recursos', explanation: 'Reciclar 1kg de papel economiza cerca de 50L de água.' },
  { id: 'q26', question: 'Isopor é reciclável?', options: ['Sim, facilmente', 'Sim, mas é difícil', 'Não', 'Apenas se limpo'], correctAnswer: 1, difficulty: 3, category: 'Plástico Especial', explanation: 'Isopor é reciclável mas poucos locais aceitam.' },
  { id: 'q27', question: 'Espelhos e vidros planos podem ser reciclados no vidro comum?', options: ['Sim, sempre', 'Não, composição diferente', 'Apenas quebrados', 'Apenas inteiros'], correctAnswer: 1, difficulty: 3, category: 'Vidro', explanation: 'Espelhos têm composição química diferente.' },
  { id: 'q28', question: 'O que é logística reversa?', options: ['Coletar lixo de trás pra frente', 'Fabricante recebe produto de volta', 'Separar lixo', 'Reciclar metal'], correctAnswer: 1, difficulty: 3, category: 'Conceitos Avançados', explanation: 'Logística reversa: fabricante recebe produto usado de volta.' },
  { id: 'q29', question: 'Lâmpadas fluorescentes contêm:', options: ['Apenas vidro', 'Mercúrio (tóxico)', 'Papel', 'Plástico'], correctAnswer: 1, difficulty: 3, category: 'Resíduos Perigosos', explanation: 'Lâmpadas fluorescentes contêm mercúrio e são perigosas.' },
  { id: 'q30', question: 'Quantas vezes o vidro pode ser reciclado?', options: ['1 vez', '5 vezes', '10 vezes', 'Infinitas vezes'], correctAnswer: 3, difficulty: 3, category: 'Reciclagem', explanation: 'O vidro pode ser reciclado infinitas vezes sem perder qualidade.' },

  // NÍVEL 4 (31-40)
  { id: 'q31', question: 'PET significa:', options: ['Plastic Eco Trash', 'Polietileno Tereftalato', 'Paper Eco Type', 'Plastic Environment Type'], correctAnswer: 1, difficulty: 4, category: 'Química', explanation: 'PET = Polietileno Tereftalato.' },
  { id: 'q32', question: 'Quanto de energia economiza reciclar alumínio vs produzir novo?', options: ['20%', '50%', '75%', '95%'], correctAnswer: 3, difficulty: 4, category: 'Economia Energética', explanation: 'Reciclar alumínio economiza 95% de energia.' },
  { id: 'q33', question: 'Óleo de cozinha usado deve:', options: ['Ir no ralo', 'Lixo comum', 'Pontos de coleta especial', 'Lixeira verde'], correctAnswer: 2, difficulty: 4, category: 'Resíduos Especiais', explanation: '1L de óleo contamina 1 milhão de litros de água.' },
  { id: 'q34', question: 'O que são aterros sanitários?', options: ['Lixões a céu aberto', 'Locais com tratamento adequado', 'Incineradores', 'Recicladores'], correctAnswer: 1, difficulty: 4, category: 'Gestão de Resíduos', explanation: 'Aterros sanitários têm tratamento e impermeabilização.' },
  { id: 'q35', question: 'Bioplásticos são:', options: ['Plásticos biodegradáveis', 'Plásticos recicláveis', 'Plásticos tóxicos', 'Plásticos duros'], correctAnswer: 0, difficulty: 4, category: 'Inovação', explanation: 'Bioplásticos são feitos de fontes renováveis e biodegradáveis.' },
  { id: 'q36', question: 'Qual país recicla mais lixo no mundo?', options: ['Brasil', 'EUA', 'Alemanha', 'Japão'], correctAnswer: 2, difficulty: 4, category: 'Mundial', explanation: 'Alemanha recicla cerca de 65% de seus resíduos.' },
  { id: 'q37', question: 'Resíduos eletrônicos contêm:', options: ['Apenas plástico', 'Metais preciosos', 'Apenas vidro', 'Apenas papel'], correctAnswer: 1, difficulty: 4, category: 'E-lixo', explanation: 'E-lixo contém ouro, prata, cobre e outros metais valiosos.' },
  { id: 'q38', question: 'O que é downcycling?', options: ['Reciclar pra baixo', 'Material perde qualidade', 'Não reciclar', 'Reciclar metal'], correctAnswer: 1, difficulty: 4, category: 'Conceitos Avançados', explanation: 'Downcycling: material reciclado tem qualidade inferior.' },
  { id: 'q39', question: 'Embalagens cartonadas (tipo longa vida) são feitas de:', options: ['Apenas papel', 'Papel, plástico e alumínio', 'Apenas plástico', 'Apenas alumínio'], correctAnswer: 1, difficulty: 4, category: 'Materiais Compostos', explanation: 'São multicamadas: 75% papel, 20% plástico, 5% alumínio.' },
  { id: 'q40', question: 'Quanto tempo uma lata de alumínio leva para se decompor?', options: ['10 anos', '50 anos', '100 anos', '200-500 anos'], correctAnswer: 3, difficulty: 4, category: 'Decomposição', explanation: 'Latas de alumínio levam de 200 a 500 anos.' },

  // NÍVEL 5 (41-50)
  { id: 'q41', question: 'O que é economia circular?', options: ['Comprar em círculos', 'Reduzir, reutilizar, reciclar', 'Vender usado', 'Gastar menos'], correctAnswer: 1, difficulty: 5, category: 'Economia Sustentável', explanation: 'Economia circular minimiza desperdício e maximiza reutilização.' },
  { id: 'q42', question: 'Microplásticos são:', options: ['Plásticos pequenos', 'Partículas < 5mm', 'Plásticos finos', 'Tampinhas'], correctAnswer: 1, difficulty: 5, category: 'Poluição', explanation: 'Microplásticos têm menos de 5mm e poluem oceanos.' },
  { id: 'q43', question: 'Quantas toneladas de lixo o Brasil produz por dia?', options: ['50 mil', '100 mil', '150 mil', '200 mil'], correctAnswer: 3, difficulty: 5, category: 'Dados Brasil', explanation: 'Brasil produz cerca de 200 mil toneladas de lixo/dia.' },
  { id: 'q44', question: 'O que é upcycling?', options: ['Reciclar pra cima', 'Criar produto de maior valor', 'Não reciclar', 'Downcycling'], correctAnswer: 1, difficulty: 5, category: 'Conceitos', explanation: 'Upcycling transforma resíduo em produto de maior valor.' },
  { id: 'q45', question: 'Quanto do lixo brasileiro é reciclado?', options: ['50%', '30%', '10%', 'Menos de 4%'], correctAnswer: 3, difficulty: 5, category: 'Dados Brasil', explanation: 'Brasil recicla menos de 4% do lixo total.' },
  { id: 'q46', question: 'O que são REEs (Resíduos Elétricos/Eletrônicos)?', options: ['Lixo comum', 'E-lixo com metais pesados', 'Lixo orgânico', 'Papel'], correctAnswer: 1, difficulty: 5, category: 'Resíduos Especiais', explanation: 'REEs contêm substâncias tóxicas como chumbo e mercúrio.' },
  { id: 'q47', question: 'Papel pode ser reciclado quantas vezes?', options: ['1-2 vezes', '3-4 vezes', '5-7 vezes', '10+ vezes'], correctAnswer: 2, difficulty: 5, category: 'Reciclagem', explanation: 'Papel pode ser reciclado de 5 a 7 vezes.' },
  { id: 'q48', question: 'O que é lixo zero (zero waste)?', options: ['Não produzir lixo nenhum', 'Reduzir ao máximo', 'Reciclar tudo', 'Compostar tudo'], correctAnswer: 1, difficulty: 5, category: 'Movimento', explanation: 'Zero waste busca reduzir produção de resíduos ao máximo.' },
  { id: 'q49', question: 'Qual setor gera mais lixo no Brasil?', options: ['Doméstico', 'Industrial', 'Construção civil', 'Hospitalar'], correctAnswer: 2, difficulty: 5, category: 'Gestão', explanation: 'Construção civil gera mais de 50% dos resíduos sólidos.' },
  { id: 'q50', question: 'O que é incineração de resíduos?', options: ['Enterrar', 'Queimar controladamente', 'Reciclar', 'Compostar'], correctAnswer: 1, difficulty: 5, category: 'Tratamento', explanation: 'Incineração é queima controlada que gera energia.' },

  // NÍVEIS 6-10 (51-100) - Mais 50 perguntas
  { id: 'q51', question: 'Porcelana e cerâmica podem ir com vidro?', options: ['Sim', 'Não', 'Apenas porcelana', 'Apenas cerâmica'], correctAnswer: 1, difficulty: 6, category: 'Vidro', explanation: 'Porcelana e cerâmica têm composição diferente do vidro.' },
  { id: 'q52', question: 'Adesivos e etiquetas devem ser removidos antes de reciclar?', options: ['Sim, sempre', 'Não precisa', 'Apenas adesivos grandes', 'Apenas de plástico'], correctAnswer: 1, difficulty: 6, category: 'Preparação', explanation: 'Adesivos podem contaminar o processo de reciclagem.' },
  { id: 'q53', question: 'Fraldas descartáveis são:', options: ['Recicláveis', 'Orgânicas', 'Não recicláveis', 'Compostáveis'], correctAnswer: 2, difficulty: 6, category: 'Não Reciclável', explanation: 'Fraldas têm múltiplos materiais e contaminantes.' },
  { id: 'q54', question: 'Qual o principal gás de efeito estufa produzido em aterros?', options: ['CO2', 'Metano', 'Ozônio', 'Nitrogênio'], correctAnswer: 1, difficulty: 6, category: 'Impacto Ambiental', explanation: 'Decomposição orgânica produz metano (CH4).' },
  { id: 'q55', question: 'Plástico número 7 significa:', options: ['PET', 'PEAD', 'Outros/Misto', 'PVC'], correctAnswer: 2, difficulty: 6, category: 'Plásticos', explanation: 'Número 7 = outros plásticos ou mistos.' },
  { id: 'q56', question: 'Papéis metalizados (presentes) são recicláveis?', options: ['Sim', 'Não', 'Apenas o papel', 'Apenas o metalizado'], correctAnswer: 1, difficulty: 6, category: 'Papel', explanation: 'Papel metalizado não é reciclável devido ao revestimento.' },
  { id: 'q57', question: 'Quanto uma família brasileira produz de lixo por dia?', options: ['500g', '1kg', '2-3kg', '5kg'], correctAnswer: 2, difficulty: 6, category: 'Dados', explanation: 'Média brasileira: 2-3kg de lixo por família/dia.' },
  { id: 'q58', question: 'Bitucas de cigarro levam quanto tempo para se decompor?', options: ['6 meses', '1 ano', '5 anos', '10-20 anos'], correctAnswer: 3, difficulty: 6, category: 'Decomposição', explanation: 'Bitucas levam de 10 a 20 anos para se decompor.' },
  { id: 'q59', question: 'O que é composteira doméstica?', options: ['Lixeira comum', 'Sistema para fazer adubo', 'Reciclador', 'Triturador'], correctAnswer: 1, difficulty: 6, category: 'Compostagem', explanation: 'Composteira transforma orgânicos em adubo em casa.' },
  { id: 'q60', question: 'Carvão e cinzas de churrasco são:', options: ['Orgânicos', 'Recicláveis', 'Rejeitos', 'Metais'], correctAnswer: 2, difficulty: 6, category: 'Classificação', explanation: 'Carvão e cinzas vão para rejeitos (lixo comum).' },
  { id: 'q61', question: 'Quantos litros de água 1L de óleo contamina?', options: ['1.000L', '10.000L', '100.000L', '1.000.000L'], correctAnswer: 3, difficulty: 7, category: 'Poluição', explanation: '1L de óleo contamina até 1 milhão de litros de água.' },
  { id: 'q62', question: 'O que é chorume?', options: ['Líquido de aterro', 'Tipo de lixo', 'Adubo', 'Plástico'], correctAnswer: 0, difficulty: 7, category: 'Aterros', explanation: 'Chorume é líquido poluente gerado em aterros.' },
  { id: 'q63', question: 'Pneus devem ir para:', options: ['Lixo comum', 'Reciclagem', 'Fabricantes/ecopontos', 'Enterrar'], correctAnswer: 2, difficulty: 7, category: 'Logística Reversa', explanation: 'Pneus têm logística reversa obrigatória.' },
  { id: 'q64', question: 'Quanto tempo leva para degradar uma fralda descartável?', options: ['1 ano', '10 anos', '100 anos', '450 anos'], correctAnswer: 3, difficulty: 7, category: 'Decomposição', explanation: 'Fraldas levam cerca de 450 anos.' },
  { id: 'q65', question: 'O que é pirólise?', options: ['Queima com oxigênio', 'Decomposição térmica sem O2', 'Reciclagem', 'Compostagem'], correctAnswer: 1, difficulty: 7, category: 'Tecnologia', explanation: 'Pirólise decompõe material por calor sem oxigênio.' },
  { id: 'q66', question: 'Embalagens de produtos de limpeza devem:', options: ['Ir sujas', 'Ser enxaguadas', 'Lixo comum', 'Não reciclar'], correctAnswer: 1, difficulty: 7, category: 'Preparação', explanation: 'Enxaguar remove resíduos químicos.' },
  { id: 'q67', question: 'Qual metal é mais reciclado no mundo?', options: ['Ferro', 'Alumínio', 'Cobre', 'Ouro'], correctAnswer: 1, difficulty: 7, category: 'Reciclagem Mundial', explanation: 'Alumínio é o metal mais reciclado globalmente.' },
  { id: 'q68', question: 'Quantas árvores economiza reciclar 1 tonelada de papel?', options: ['5', '10', '17', '30'], correctAnswer: 2, difficulty: 7, category: 'Impacto', explanation: '1 tonelada de papel reciclado = 17 árvores poupadas.' },
  { id: 'q69', question: 'O que são catadores de materiais recicláveis?', options: ['Empresas', 'Trabalhadores essenciais', 'Voluntários', 'Máquinas'], correctAnswer: 1, difficulty: 7, category: 'Social', explanation: 'Catadores são essenciais para reciclagem no Brasil.' },
  { id: 'q70', question: 'Plástico oxibiodegradável é:', options: ['Totalmente biodegradável', 'Fragmenta em microplásticos', 'Reciclável', 'Compostável'], correctAnswer: 1, difficulty: 7, category: 'Polêmica', explanation: 'Oxibiodegradável apenas fragmenta, não degrada.' },
  { id: 'q71', question: 'PNRS significa:', options: ['Plano Nacional Resíduos Sólidos', 'Programa Natural Reciclagem', 'Política Nacional Sustentável', 'Plano Novo Reciclagem'], correctAnswer: 0, difficulty: 8, category: 'Legislação', explanation: 'PNRS = Política Nacional de Resíduos Sólidos (2010).' },
  { id: 'q72', question: 'Acordo setorial é:', options: ['Contrato de limpeza', 'Logística reversa obrigatória', 'Reciclagem voluntária', 'Taxa de lixo'], correctAnswer: 1, difficulty: 8, category: 'Legislação', explanation: 'Acordo setorial implementa logística reversa.' },
  { id: 'q73', question: 'Qual porcentagem de PET é reciclada no Brasil?', options: ['30%', '45%', '55%', '65%'], correctAnswer: 2, difficulty: 8, category: 'Brasil', explanation: 'Brasil recicla cerca de 55% do PET.' },
  { id: 'q74', question: 'Reciclagem mecânica é:', options: ['Manual', 'Trituração e derretimento', 'Química', 'Compostagem'], correctAnswer: 1, difficulty: 8, category: 'Processos', explanation: 'Reciclagem mecânica tritura e derrete plástico.' },
  { id: 'q75', question: 'Reciclagem química de plástico:', options: ['Derrete', 'Quebra moléculas', 'Tritura', 'Queima'], correctAnswer: 1, difficulty: 8, category: 'Processos', explanation: 'Reciclagem química quebra polímeros em monômeros.' },
  { id: 'q76', question: 'Oceanos têm quantas toneladas de plástico?', options: ['1 milhão', '5 milhões', '50 milhões', '150 milhões'], correctAnswer: 3, difficulty: 8, category: 'Poluição Global', explanation: 'Estimativa: 150 milhões de toneladas de plástico nos oceanos.' },
  { id: 'q77', question: 'Grande Ilha de Lixo do Pacífico tem tamanho de:', options: ['São Paulo', 'França', 'Brasil', 'Austrália'], correctAnswer: 1, difficulty: 8, category: 'Poluição', explanation: 'Tem mais de 1,6 milhão km² (3x França).' },
  { id: 'q78', question: 'Quanto custa NÃO reciclar para o Brasil (anual)?', options: ['R$ 1 bi', 'R$ 5 bi', 'R$ 8 bi', 'R$ 15 bi'], correctAnswer: 2, difficulty: 8, category: 'Economia', explanation: 'Estima-se perda de R$ 8 bilhões/ano.' },
  { id: 'q79', question: 'Cooperativas de reciclagem são:', options: ['Empresas privadas', 'Associações de catadores', 'ONGs', 'Governamentais'], correctAnswer: 1, difficulty: 8, category: 'Social', explanation: 'Cooperativas organizam catadores para reciclagem.' },
  { id: 'q80', question: 'Resíduo de saúde classe A é:', options: ['Infectante', 'Químico', 'Radioativo', 'Comum'], correctAnswer: 0, difficulty: 8, category: 'Resíduos Hospitalares', explanation: 'Classe A = potencialmente infectante.' },
  { id: 'q81', question: 'Consumo consciente significa:', options: ['Comprar barato', 'Comprar necessário', 'Comprar orgânico', 'Não comprar'], correctAnswer: 1, difficulty: 9, category: 'Filosofia', explanation: 'Consumir consciente = comprar apenas necessário.' },
  { id: 'q82', question: 'Obsolescência programada é:', options: ['Produto com prazo curto', 'Produto duradouro', 'Reciclagem', 'Sustentabilidade'], correctAnswer: 0, difficulty: 9, category: 'Crítica', explanation: 'Obsolescência programada reduz vida útil propositalmente.' },
  { id: 'q83', question: 'Pegada ecológica mede:', options: ['Tamanho do pé', 'Impacto ambiental', 'Distância andada', 'Lixo produzido'], correctAnswer: 1, difficulty: 9, category: 'Indicadores', explanation: 'Pegada ecológica quantifica impacto no planeta.' },
  { id: 'q84', question: 'Terracycle é:', options: ['Tipo de lixo', 'Empresa de reciclagem difícil', 'ONG', 'Cooperativa'], correctAnswer: 1, difficulty: 9, category: 'Empresas', explanation: 'TerraCycle recicla materiais considerados não recicláveis.' },
  { id: 'q85', question: 'Rotulagem ambiental tipo I é:', options: ['Obrigatória', 'Certificação terceira parte', 'Autodeclaração', 'Informal'], correctAnswer: 1, difficulty: 9, category: 'Certificações', explanation: 'Tipo I = certificação por organismo independente.' },
  { id: 'q86', question: 'ACV (Análise Ciclo de Vida) avalia:', options: ['Preço', 'Impacto total do produto', 'Qualidade', 'Durabilidade'], correctAnswer: 1, difficulty: 9, category: 'Metodologia', explanation: 'ACV analisa impacto desde extração até descarte.' },
  { id: 'q87', question: 'Princípio poluidor-pagador significa:', options: ['Taxa de lixo', 'Quem polui paga custo', 'Multa ambiental', 'Imposto verde'], correctAnswer: 1, difficulty: 9, category: 'Economia Ambiental', explanation: 'Poluidor deve arcar com custos da poluição.' },
  { id: 'q88', question: 'Simbiose industrial é:', options: ['Empresas compartilham resíduos', 'Reciclagem industrial', 'Poluição', 'Produção'], correctAnswer: 0, difficulty: 9, category: 'Inovação', explanation: 'Resíduo de uma empresa vira matéria-prima de outra.' },
  { id: 'q89', question: 'Cradle to Cradle significa:', options: ['Berço ao túmulo', 'Berço ao berço', 'Ciclo produtivo', 'Reciclagem'], correctAnswer: 1, difficulty: 9, category: 'Design', explanation: 'Do berço ao berço: produto vira novo produto infinitamente.' },
  { id: 'q90', question: 'Resíduo Classe I (ABNT) é:', options: ['Inerte', 'Perigoso', 'Não inerte', 'Orgânico'], correctAnswer: 1, difficulty: 9, category: 'Classificação Técnica', explanation: 'Classe I = perigoso (tóxico, inflamável, etc).' },
  { id: 'q91', question: 'Quanto tempo resíduo nuclear radioativo permanece perigoso?', options: ['100 anos', '1.000 anos', '10.000 anos', '100.000+ anos'], correctAnswer: 3, difficulty: 10, category: 'Resíduos Extremos', explanation: 'Alguns resíduos nucleares levam mais de 100 mil anos.' },
  { id: 'q92', question: 'Dessalinização produz como resíduo:', options: ['Água doce', 'Salmoura hipersalina', 'Plástico', 'Metal'], correctAnswer: 1, difficulty: 10, category: 'Processos Industriais', explanation: 'Dessalinização gera salmoura concentrada poluente.' },
  { id: 'q93', question: 'Nanoplásticos são:', options: ['< 1 micrômetro', '< 5mm', '< 1mm', 'Plástico fino'], correctAnswer: 0, difficulty: 10, category: 'Poluição Avançada', explanation: 'Nanoplásticos < 1µm penetram células.' },
  { id: 'q94', question: 'Pirolise de pneus gera:', options: ['Lixo', 'Óleo combustível', 'Água', 'Vidro'], correctAnswer: 1, difficulty: 10, category: 'Tecnologia Avançada', explanation: 'Pirólise de pneus produz óleo, gás e negro de fumo.' },
  { id: 'q95', question: 'Gasificação de resíduos produz:', options: ['Cinzas', 'Gás de síntese', 'Água', 'Plástico'], correctAnswer: 1, difficulty: 10, category: 'Waste-to-Energy', explanation: 'Gasificação gera syngas (H2 + CO) para energia.' },
  { id: 'q96', question: 'Teoria dos 5 Rs é:', options: ['Recusar, Reduzir, Reutilizar, Reciclar, Repensar', 'Apenas Reciclar', 'Rejeitar, Reusar, Reciclar', '3 Rs'], correctAnswer: 0, difficulty: 10, category: 'Hierarquia', explanation: '5 Rs: Recusar, Reduzir, Reutilizar, Reciclar, Repensar.' },
  { id: 'q97', question: 'Coleta pneumática de lixo usa:', options: ['Caminhões', 'Tubos a vácuo', 'Esteiras', 'Drones'], correctAnswer: 1, difficulty: 10, category: 'Tecnologia Urbana', explanation: 'Sistema pneumático suga lixo por tubos subterrâneos.' },
  { id: 'q98', question: 'Ilha de calor urbana é agravada por:', options: ['Árvores', 'Lixões e aterros', 'Rios', 'Ventos'], correctAnswer: 1, difficulty: 10, category: 'Impacto Urbano', explanation: 'Lixões/aterros aumentam temperatura local.' },
  { id: 'q99', question: 'Blockchain na reciclagem serve para:', options: ['Decoração', 'Rastreabilidade', 'Pesar lixo', 'Queimar'], correctAnswer: 1, difficulty: 10, category: 'Inovação Digital', explanation: 'Blockchain rastreia cadeia de reciclagem com transparência.' },
  { id: 'q100', question: 'Meta global de redução de plástico até 2030:', options: ['10%', '30%', '50%', '80%'], correctAnswer: 2, difficulty: 10, category: 'Acordos Internacionais', explanation: 'ONU propõe reduzir 50% do plástico descartável até 2030.' },
];

// WASTE ITEMS - 100 itens em 10 níveis
export const wasteItems: WasteItem[] = [
  // Nível 1 (10 itens)
  { id: 'w1', name: 'Garrafa PET', correctBin: 'red', difficulty: 1 },
  { id: 'w2', name: 'Jornal', correctBin: 'blue', difficulty: 1 },
  { id: 'w3', name: 'Lata de Refrigerante', correctBin: 'yellow', difficulty: 1 },
  { id: 'w4', name: 'Casca de Banana', correctBin: 'green', difficulty: 1 },
  { id: 'w5', name: 'Garrafa de Vidro', correctBin: 'green', difficulty: 1 },
  { id: 'w6', name: 'Revista', correctBin: 'blue', difficulty: 1 },
  { id: 'w7', name: 'Copo Plástico', correctBin: 'red', difficulty: 1 },
  { id: 'w8', name: 'Lata de Atum', correctBin: 'yellow', difficulty: 1 },
  { id: 'w9', name: 'Casca de Laranja', correctBin: 'green', difficulty: 1 },
  { id: 'w10', name: 'Caixa de Papelão', correctBin: 'blue', difficulty: 1 },

  // Nível 2 (10 itens)
  { id: 'w11', name: 'Pote de Iogurte', correctBin: 'red', difficulty: 2 },
  { id: 'w12', name: 'Envelope', correctBin: 'blue', difficulty: 2 },
  { id: 'w13', name: 'Tampa de Metal', correctBin: 'yellow', difficulty: 2 },
  { id: 'w14', name: 'Resto de Comida', correctBin: 'green', difficulty: 2 },
  { id: 'w15', name: 'Pote de Vidro', correctBin: 'green', difficulty: 2 },
  { id: 'w16', name: 'Sacola Plástica', correctBin: 'red', difficulty: 2 },
  { id: 'w17', name: 'Papel de Escritório', correctBin: 'blue', difficulty: 2 },
  { id: 'w18', name: 'Arame', correctBin: 'yellow', difficulty: 2 },
  { id: 'w19', name: 'Borra de Café', correctBin: 'green', difficulty: 2 },
  { id: 'w20', name: 'Caixa de Cereal', correctBin: 'blue', difficulty: 2 },

  // Nível 3 (10 itens)
  { id: 'w21', name: 'Embalagem de Salgadinho', correctBin: 'gray', difficulty: 3 },
  { id: 'w22', name: 'Caixa de Pizza Limpa', correctBin: 'blue', difficulty: 3 },
  { id: 'w23', name: 'Papel Alumínio', correctBin: 'yellow', difficulty: 3 },
  { id: 'w24', name: 'Guardanapo Usado', correctBin: 'gray', difficulty: 3 },
  { id: 'w25', name: 'Frasco de Perfume', correctBin: 'green', difficulty: 3 },
  { id: 'w26', name: 'Embalagem de Marmita', correctBin: 'red', difficulty: 3 },
  { id: 'w27', name: 'Fotocópia', correctBin: 'blue', difficulty: 3 },
  { id: 'w28', name: 'Clips de Papel', correctBin: 'yellow', difficulty: 3 },
  { id: 'w29', name: 'Casca de Ovo', correctBin: 'green', difficulty: 3 },
  { id: 'w30', name: 'Papel Toalha Usado', correctBin: 'gray', difficulty: 3 },

  // Nível 4 (10 itens)
  { id: 'w31', name: 'Embalagem Tetra Pak', correctBin: 'blue', difficulty: 4 },
  { id: 'w32', name: 'Isopor', correctBin: 'gray', difficulty: 4 },
  { id: 'w33', name: 'Esponja de Cozinha', correctBin: 'gray', difficulty: 4 },
  { id: 'w34', name: 'CD/DVD', correctBin: 'gray', difficulty: 4 },
  { id: 'w35', name: 'Frasco de Remédio (vidro)', correctBin: 'green', difficulty: 4 },
  { id: 'w36', name: 'Embalagem de Biscoito', correctBin: 'red', difficulty: 4 },
  { id: 'w37', name: 'Papel Carbono', correctBin: 'gray', difficulty: 4 },
  { id: 'w38', name: 'Grampo de Metal', correctBin: 'yellow', difficulty: 4 },
  { id: 'w39', name: 'Saquinho de Chá', correctBin: 'green', difficulty: 4 },
  { id: 'w40', name: 'Caixa de Pizza Suja', correctBin: 'gray', difficulty: 4 },

  // Nível 5 (10 itens)
  { id: 'w41', name: 'Espelho Quebrado', correctBin: 'gray', difficulty: 5 },
  { id: 'w42', name: 'Papel Fotografico', correctBin: 'gray', difficulty: 5 },
  { id: 'w43', name: 'Fio de Cobre', correctBin: 'yellow', difficulty: 5 },
  { id: 'w44', name: 'Osso de Frango', correctBin: 'green', difficulty: 5 },
  { id: 'w45', name: 'Pote de Sorvete (plástico)', correctBin: 'red', difficulty: 5 },
  { id: 'w46', name: 'Papel Celofane', correctBin: 'gray', difficulty: 5 },
  { id: 'w47', name: 'Lata de Tinta Vazia', correctBin: 'gray', difficulty: 5 },
  { id: 'w48', name: 'Vidro de Conserva', correctBin: 'green', difficulty: 5 },
  { id: 'w49', name: 'Embalagem de Macarrão', correctBin: 'red', difficulty: 5 },
  { id: 'w50', name: 'Folhas de Árvore', correctBin: 'green', difficulty: 5 },

  // Nível 6 (10 itens)
  { id: 'w51', name: 'Cerâmica Quebrada', correctBin: 'gray', difficulty: 6 },
  { id: 'w52', name: 'Papel Metalizado', correctBin: 'gray', difficulty: 6 },
  { id: 'w53', name: 'Panela de Alumínio', correctBin: 'yellow', difficulty: 6 },
  { id: 'w54', name: 'Serragem', correctBin: 'green', difficulty: 6 },
  { id: 'w55', name: 'Blister de Remédio', correctBin: 'gray', difficulty: 6 },
  { id: 'w56', name: 'Papel Parafinado', correctBin: 'gray', difficulty: 6 },
  { id: 'w57', name: 'Mola de Caderno', correctBin: 'yellow', difficulty: 6 },
  { id: 'w58', name: 'Vidro Temperado', correctBin: 'gray', difficulty: 6 },
  { id: 'w59', name: 'Tampa Plástica', correctBin: 'red', difficulty: 6 },
  { id: 'w60', name: 'Grama Cortada', correctBin: 'green', difficulty: 6 },

  // Nível 7 (10 itens)
  { id: 'w61', name: 'Porcelana', correctBin: 'gray', difficulty: 7 },
  { id: 'w62', name: 'Etiqueta Adesiva', correctBin: 'gray', difficulty: 7 },
  { id: 'w63', name: 'Radiografia', correctBin: 'gray', difficulty: 7 },
  { id: 'w64', name: 'Esmalte de Unha', correctBin: 'gray', difficulty: 7 },
  { id: 'w65', name: 'Pote de Margarina', correctBin: 'red', difficulty: 7 },
  { id: 'w66', name: 'Papel com Cola', correctBin: 'gray', difficulty: 7 },
  { id: 'w67', name: 'Alfinete', correctBin: 'yellow', difficulty: 7 },
  { id: 'w68', name: 'Cristal', correctBin: 'gray', difficulty: 7 },
  { id: 'w69', name: 'Garrafa de Óleo (limpa)', correctBin: 'red', difficulty: 7 },
  { id: 'w70', name: 'Palito de Dente', correctBin: 'gray', difficulty: 7 },

  // Nível 8 (10 itens)
  { id: 'w71', name: 'Fita Adesiva', correctBin: 'gray', difficulty: 8 },
  { id: 'w72', name: 'Papel Plastificado', correctBin: 'gray', difficulty: 8 },
  { id: 'w73', name: 'Esponja de Aço', correctBin: 'yellow', difficulty: 8 },
  { id: 'w74', name: 'Tecido/Roupa Velha', correctBin: 'gray', difficulty: 8 },
  { id: 'w75', name: 'Embalagem de Congelado', correctBin: 'gray', difficulty: 8 },
  { id: 'w76', name: 'Papel Higiênico (usado)', correctBin: 'gray', difficulty: 8 },
  { id: 'w77', name: 'Tampa de Panela (metal)', correctBin: 'yellow', difficulty: 8 },
  { id: 'w78', name: 'Vidro de Remédio', correctBin: 'gray', difficulty: 8 },
  { id: 'w79', name: 'Canudo Plástico', correctBin: 'red', difficulty: 8 },
  { id: 'w80', name: 'Serragem de Madeira Tratada', correctBin: 'gray', difficulty: 8 },

  // Nível 9 (10 itens)
  { id: 'w81', name: 'Fralda Descartável', correctBin: 'gray', difficulty: 9 },
  { id: 'w82', name: 'Absorvente', correctBin: 'gray', difficulty: 9 },
  { id: 'w83', name: 'Cabo de Vassoura', correctBin: 'gray', difficulty: 9 },
  { id: 'w84', name: 'Vela Usada', correctBin: 'gray', difficulty: 9 },
  { id: 'w85', name: 'Forro de Pizza Congelada', correctBin: 'gray', difficulty: 9 },
  { id: 'w86', name: 'Durex/Fita Crepe', correctBin: 'gray', difficulty: 9 },
  { id: 'w87', name: 'Corrente de Metal', correctBin: 'yellow', difficulty: 9 },
  { id: 'w88', name: 'Lâmpada Incandescente', correctBin: 'gray', difficulty: 9 },
  { id: 'w89', name: 'Embalagem de Ração', correctBin: 'gray', difficulty: 9 },
  { id: 'w90', name: 'Palha de Aço', correctBin: 'yellow', difficulty: 9 },

  // Nível 10 (10 itens)
  { id: 'w91', name: 'Acrílico', correctBin: 'gray', difficulty: 10 },
  { id: 'w92', name: 'Silicone', correctBin: 'gray', difficulty: 10 },
  { id: 'w93', name: 'Filtro de Café Usado', correctBin: 'green', difficulty: 10 },
  { id: 'w94', name: 'Chip Eletrônico', correctBin: 'gray', difficulty: 10 },
  { id: 'w95', name: 'Plástico Biodegradável', correctBin: 'gray', difficulty: 10 },
  { id: 'w96', name: 'Papel Autocopiativo', correctBin: 'gray', difficulty: 10 },
  { id: 'w97', name: 'Bronze/Latão', correctBin: 'yellow', difficulty: 10 },
  { id: 'w98', name: 'Papel Vegetal', correctBin: 'gray', difficulty: 10 },
  { id: 'w99', name: 'Embalagem Cartonada Suja', correctBin: 'gray', difficulty: 10 },
  { id: 'w100', name: 'Feltro', correctBin: 'gray', difficulty: 10 },
];

// RECYCLING GUIDE - Expandido
export const recyclingGuide: RecyclingGuideItem[] = [
  {
    id: 'rg1',
    name: 'Papel e Papelão',
    category: 'Papel',
    bin: 'blue',
    description: 'Jornais, revistas, caixas de papelão, papel de escritório.',
    tips: ['Remova fitas adesivas e grampos', 'Não amasse o papel', 'Papéis sujos de gordura não são recicláveis', 'Dobre caixas para economizar espaço']
  },
  {
    id: 'rg2',
    name: 'Plásticos',
    category: 'Plástico',
    bin: 'red',
    description: 'Garrafas PET, potes, sacolas plásticas, embalagens.',
    tips: ['Enxágue as embalagens', 'Retire rótulos quando possível', 'Amasse garrafas para economizar espaço', 'Verifique o número no símbolo de reciclagem']
  },
  {
    id: 'rg3',
    name: 'Metais',
    category: 'Metal',
    bin: 'yellow',
    description: 'Latas de alumínio, de aço, tampas metálicas.',
    tips: ['Lave as latas', 'Amasse para reduzir volume', 'Alumínio é 100% reciclável', 'Economiza 95% de energia na reciclagem']
  },
  {
    id: 'rg4',
    name: 'Vidro',
    category: 'Vidro',
    bin: 'green',
    description: 'Garrafas, potes, frascos de vidro.',
    tips: ['Retire tampas e rótulos', 'Não misture com cerâmica ou porcelana', 'Cuidado com vidros quebrados', 'Vidro pode ser reciclado infinitas vezes']
  },
  {
    id: 'rg5',
    name: 'Orgânicos',
    category: 'Orgânico',
    bin: 'green',
    description: 'Restos de alimentos, cascas de frutas e vegetais.',
    tips: ['Ideal para compostagem', 'Não misture com lixo comum', 'Gera adubo natural', 'Reduz emissão de metano em aterros']
  },
  {
    id: 'rg6',
    name: 'Pilhas e Baterias',
    category: 'Perigoso',
    bin: 'gray',
    description: 'Pilhas, baterias de celular, baterias recarregáveis.',
    tips: ['NUNCA no lixo comum', 'Leve a pontos de coleta especiais', 'Contêm metais pesados tóxicos', 'Farmácias e supermercados costumam aceitar']
  },
  {
    id: 'rg7',
    name: 'Eletrônicos',
    category: 'Perigoso',
    bin: 'gray',
    description: 'Celulares, computadores, TVs, eletrodomésticos.',
    tips: ['Leve a pontos de coleta de e-lixo', 'Muitas peças podem ser reutilizadas', 'Remova dados pessoais antes', 'Fabricantes têm programas de logística reversa']
  },
  {
    id: 'rg8',
    name: 'Embalagem Tetra Pak',
    category: 'Papel',
    bin: 'blue',
    description: 'Caixas de leite, suco, molhos.',
    tips: ['Lave e seque antes de descartar', 'Pode ser reciclada apesar das camadas mistas', 'Amasse para economizar espaço', '75% papel, 20% plástico, 5% alumínio']
  },
  {
    id: 'rg9',
    name: 'Lâmpadas',
    category: 'Perigoso',
    bin: 'gray',
    description: 'Fluorescentes, LED, incandescentes.',
    tips: ['Fluorescentes contêm mercúrio', 'Leve a pontos especiais', 'Embrulhe com cuidado para não quebrar', 'LEDs são menos tóxicas']
  },
  {
    id: 'rg10',
    name: 'Óleo de Cozinha',
    category: 'Especial',
    bin: 'gray',
    description: 'Óleo usado de fritura.',
    tips: ['NUNCA jogue no ralo', '1L contamina 1 milhão de litros de água', 'Armazene em garrafa PET', 'Leve a pontos de coleta para fazer sabão/biodiesel']
  },
  {
    id: 'rg11',
    name: 'Pneus',
    category: 'Logística Reversa',
    bin: 'gray',
    description: 'Pneus de carro, moto, bicicleta.',
    tips: ['Fabricantes são obrigados a receber de volta', 'Podem virar asfalto, solado de sapato', 'NUNCA queime', 'Podem acumular água e criar focos de dengue']
  },
  {
    id: 'rg12',
    name: 'Medicamentos Vencidos',
    category: 'Perigoso',
    bin: 'gray',
    description: 'Comprimidos, xaropes, pomadas vencidas.',
    tips: ['Leve a farmácias com programa de coleta', 'NUNCA no lixo comum ou esgoto', 'Contaminam água e solo', 'Mantenha na embalagem original']
  },
  {
    id: 'rg13',
    name: 'Isopor',
    category: 'Plástico Especial',
    bin: 'gray',
    description: 'Embalagens de isopor (EPS).',
    tips: ['Tecnicamente reciclável, mas poucos locais aceitam', 'Ocupa muito espaço', 'Procure ecopontos especializados', 'Prefira embalagens alternativas']
  },
  {
    id: 'rg14',
    name: 'Roupas e Têxteis',
    category: 'Reutilização',
    bin: 'gray',
    description: 'Roupas velhas, toalhas, lençóis.',
    tips: ['Doe se estiver em bom estado', 'Pode virar pano de limpeza', 'Algumas marcas têm programas de reciclagem', 'Não misture com lixo reciclável comum']
  },
  {
    id: 'rg15',
    name: 'Embalagens Metalizadas',
    category: 'Não Reciclável',
    bin: 'gray',
    description: 'Salgadinhos, biscoitos, barras de cereal.',
    tips: ['Maioria não é reciclável', 'Mistura de plástico e alumínio dificulta', 'Algumas empresas fazem coleta especial', 'Prefira embalagens simples']
  },
];

// CURIOSIDADES - NOVO
export const curiosities: Curiosity[] = [
  {
    id: 'c1',
    title: 'Brasil é campeão em reciclagem de latas',
    content: 'O Brasil recicla mais de 97% das latas de alumínio, sendo o maior reciclador mundial desse material! Isso economiza energia equivalente a 1,5 milhão de residências por ano.',
    icon: '🏆',
    category: 'Brasil'
  },
  {
    id: 'c2',
    title: 'Quanto tempo leva para se decompor?',
    content: 'Papel: 3-6 meses | Chiclete: 5 anos | Lata: 200-500 anos | Plástico: 450+ anos | Vidro: 4.000+ anos | Fralda: 450 anos',
    icon: '⏱️',
    category: 'Decomposição'
  },
  {
    id: 'c3',
    title: 'Ilha de lixo no Pacífico',
    content: 'Existe uma "ilha" de lixo plástico no Oceano Pacífico que tem 3 vezes o tamanho da França! São mais de 1,8 trilhão de pedaços de plástico flutuando.',
    icon: '🌊',
    category: 'Poluição'
  },
  {
    id: 'c4',
    title: 'Reciclar papel salva árvores',
    content: 'Cada tonelada de papel reciclado salva 17 árvores adultas, economiza 26.000 litros de água e evita a emissão de 2,5 toneladas de CO2.',
    icon: '🌳',
    category: 'Economia'
  },
  {
    id: 'c5',
    title: 'Catadores são essenciais',
    content: 'No Brasil, existem mais de 800 mil catadores de materiais recicláveis que são responsáveis por 90% de tudo que é reciclado no país!',
    icon: '👷',
    category: 'Social'
  },
  {
    id: 'c6',
    title: 'Reciclagem economiza energia',
    content: 'Reciclar alumínio economiza 95% da energia, vidro 30%, papel 70% e plástico 70% em comparação com a produção de novos materiais.',
    icon: '⚡',
    category: 'Energia'
  },
  {
    id: 'c7',
    title: 'Microplásticos em todo lugar',
    content: 'Microplásticos já foram encontrados no sal marinho, água potável, cerveja, mel e até no ar que respiramos. Ingerimos cerca de 5g de plástico por semana (peso de um cartão de crédito)!',
    icon: '🔬',
    category: 'Saúde'
  },
  {
    id: 'c8',
    title: 'Compostagem reduz 50% do lixo',
    content: 'Cerca de 50% do lixo doméstico é orgânico! Se todos compostassem, reduziríamos pela metade o volume nos aterros e ainda ganharíamos adubo grátis.',
    icon: '🌱',
    category: 'Compostagem'
  },
  {
    id: 'c9',
    title: 'Óleo de cozinha contamina água',
    content: 'Um único litro de óleo de cozinha jogado no ralo pode contaminar até 1 MILHÃO de litros de água! Sempre guarde em garrafa e leve para reciclagem.',
    icon: '💧',
    category: 'Água'
  },
  {
    id: 'c10',
    title: 'Plástico nunca desaparece',
    content: 'TODO plástico já produzido ainda existe em algum lugar! Ele não se decompõe, apenas se fragmenta em pedaços cada vez menores (microplásticos).',
    icon: '♾️',
    category: 'Plástico'
  },
];

// Mock Users and Families
export const mockUsers: User[] = [
  { id: 'u1', name: 'Ana Silva', email: 'ana@email.com', familyId: 'f1', avatar: '👩', totalPoints: 1250, level: 3 },
  { id: 'u2', name: 'Pedro Silva', email: 'pedro@email.com', familyId: 'f1', avatar: '👨', totalPoints: 980, level: 2 },
  { id: 'u3', name: 'Maria Silva', email: 'maria@email.com', familyId: 'f1', avatar: '👧', totalPoints: 1580, level: 4 },
];

export const mockFamilies: Family[] = [
  { id: 'f1', name: 'Família Silva', members: mockUsers, totalPoints: 3810 }
];

// Local Storage Keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'ecoGame_currentUser',
  METRICS: 'ecoGame_metrics',
  QUIZ_PROGRESS: 'ecoGame_quizProgress',
  SORTING_PROGRESS: 'ecoGame_sortingProgress',
  ROUTE_PROGRESS: 'ecoGame_routeProgress',
  MEMORY_PROGRESS: 'ecoGame_memoryProgress',
  COMPOSTING_PROGRESS: 'ecoGame_compostingProgress',
};

// Helper Functions
export const saveMetric = (metric: GameMetric) => {
  const metrics = JSON.parse(localStorage.getItem(STORAGE_KEYS.METRICS) || '[]');
  metrics.push({ ...metric, timestamp: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
};

export const getMetrics = (): GameMetric[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.METRICS) || '[]');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const updateUserPoints = (userId: string, points: number) => {
  const user = getCurrentUser();
  if (user && user.id === userId) {
    user.totalPoints += points;
    user.level = Math.floor(user.totalPoints / 500) + 1;
    setCurrentUser(user);
  }
};

// Update progress for each game type
export const updateGameProgress = (
  gameType: 'quiz' | 'sorting' | 'route' | 'memory' | 'composting',
  level: number,
  score: number
) => {
  const storageKey = {
    quiz: STORAGE_KEYS.QUIZ_PROGRESS,
    sorting: STORAGE_KEYS.SORTING_PROGRESS,
    route: STORAGE_KEYS.ROUTE_PROGRESS,
    memory: STORAGE_KEYS.MEMORY_PROGRESS,
    composting: STORAGE_KEYS.COMPOSTING_PROGRESS
  }[gameType];

  const progress = JSON.parse(localStorage.getItem(storageKey) || '{}');
  
  // Update progress only if score is better
  if (!progress[level] || score > progress[level]) {
    progress[level] = score;
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }
};

// Check if a level is unlocked
export const isLevelUnlocked = (
  gameType: 'quiz' | 'sorting' | 'route' | 'memory' | 'composting',
  level: number
): boolean => {
  if (level === 1) return true; // First level always unlocked
  
  const storageKey = {
    quiz: STORAGE_KEYS.QUIZ_PROGRESS,
    sorting: STORAGE_KEYS.SORTING_PROGRESS,
    route: STORAGE_KEYS.ROUTE_PROGRESS,
    memory: STORAGE_KEYS.MEMORY_PROGRESS,
    composting: STORAGE_KEYS.COMPOSTING_PROGRESS
  }[gameType];

  const progress = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const previousLevelScore = progress[level - 1] || 0;
  
  return previousLevelScore >= 90; // Need 90% or more to unlock next level
};

export const exportMetricsAsJSON = () => {
  const metrics = getMetrics();
  const dataStr = JSON.stringify(metrics, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'eco-game-metrics.json';
  link.click();
};

export const exportMetricsAsCSV = () => {
  const metrics = getMetrics();
  if (metrics.length === 0) return;
  
  const headers = ['userId', 'questionId', 'answer', 'correct', 'timeSeconds', 'difficulty', 'timestamp'];
  const csv = [
    headers.join(','),
    ...metrics.map(m => [m.userId, m.questionId, m.answer, m.correct, m.timeSeconds, m.difficulty, m.timestamp].join(','))
  ].join('\n');
  
  const dataBlob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'eco-game-metrics.csv';
  link.click();
};

// ==================== SISTEMA DE FAMÍLIAS E JOGADORES ====================

const FAMILY_STORAGE_KEY = 'recyclhe_families';
const CURRENT_FAMILY_KEY = 'recyclhe_current_family';
const CURRENT_PLAYER_KEY = 'recyclhe_current_player';

// Gera um código único de 6 caracteres para a família
const generateFamilyCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Criar nova família
export const createFamily = (familyName: string): Family => {
  const families = getAllFamilies();
  const newFamily: Family = {
    id: `fam_${Date.now()}`,
    name: familyName,
    code: generateFamilyCode(),
    createdAt: new Date().toISOString(),
    players: []
  };
  
  families.push(newFamily);
  localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(families));
  localStorage.setItem(CURRENT_FAMILY_KEY, newFamily.id);
  
  return newFamily;
};

// Buscar família por código
export const findFamilyByCode = (code: string): Family | null => {
  const families = getAllFamilies();
  return families.find(f => f.code.toUpperCase() === code.toUpperCase()) || null;
};

// Obter todas as famílias
export const getAllFamilies = (): Family[] => {
  const stored = localStorage.getItem(FAMILY_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Obter família atual
export const getCurrentFamily = (): Family | null => {
  const familyId = localStorage.getItem(CURRENT_FAMILY_KEY);
  if (!familyId) return null;
  
  const families = getAllFamilies();
  return families.find(f => f.id === familyId) || null;
};

// Definir família atual
export const setCurrentFamily = (familyId: string): void => {
  localStorage.setItem(CURRENT_FAMILY_KEY, familyId);
};

// Adicionar jogador à família
export const addPlayerToFamily = (familyId: string, name: string, avatar: string): Player => {
  const families = getAllFamilies();
  const family = families.find(f => f.id === familyId);
  
  if (!family) throw new Error('Família não encontrada');
  
  const newPlayer: Player = {
    id: `player_${Date.now()}`,
    name,
    avatar,
    totalPoints: 0,
    level: 1,
    createdAt: new Date().toISOString()
  };
  
  family.players.push(newPlayer);
  localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(families));
  
  return newPlayer;
};

// Obter jogador atual
export const getCurrentPlayer = (): Player | null => {
  const playerId = localStorage.getItem(CURRENT_PLAYER_KEY);
  if (!playerId) return null;
  
  const family = getCurrentFamily();
  if (!family) return null;
  
  return family.players.find(p => p.id === playerId) || null;
};

// Definir jogador atual
export const setCurrentPlayer = (playerId: string): void => {
  localStorage.setItem(CURRENT_PLAYER_KEY, playerId);
};

// Obter progresso específico do jogador
export const getPlayerProgress = (
  playerId: string,
  gameType: 'quiz' | 'sorting' | 'route' | 'memory' | 'composting'
): Record<number, number> => {
  const key = `player_${playerId}_${gameType}_progress`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
};

// Salvar progresso do jogador
export const savePlayerProgress = (
  playerId: string,
  gameType: 'quiz' | 'sorting' | 'route' | 'memory' | 'composting',
  level: number,
  score: number
): void => {
  const key = `player_${playerId}_${gameType}_progress`;
  const progress = getPlayerProgress(playerId, gameType);
  
  // Atualizar apenas se for um score melhor
  if (!progress[level] || score > progress[level]) {
    progress[level] = score;
    localStorage.setItem(key, JSON.stringify(progress));
    
    // Atualizar pontuação total do jogador
    updatePlayerTotalPoints(playerId);
  }
};

// Verificar se um nível está desbloqueado para um jogador específico
export const isPlayerLevelUnlocked = (
  playerId: string,
  gameType: 'quiz' | 'sorting' | 'route' | 'memory' | 'composting',
  level: number
): boolean => {
  if (level === 1) return true; // Primeiro nível sempre desbloqueado
  
  const progress = getPlayerProgress(playerId, gameType);
  const previousLevelScore = progress[level - 1] || 0;
  
  return previousLevelScore >= 90; // Necessário 90% ou mais
};

// Atualizar pontuação total do jogador
const updatePlayerTotalPoints = (playerId: string): void => {
  const families = getAllFamilies();
  
  for (const family of families) {
    const player = family.players.find(p => p.id === playerId);
    if (player) {
      let totalPoints = 0;
      
      // Somar pontos de todos os jogos
      const games: Array<'quiz' | 'sorting' | 'route' | 'memory' | 'composting'> = 
        ['quiz', 'sorting', 'route', 'memory', 'composting'];
      
      for (const game of games) {
        const progress = getPlayerProgress(playerId, game);
        // Dividir por 10 para ter pontos menores (100% = 10 pontos)
        totalPoints += Object.values(progress).reduce((sum, score) => sum + Math.round(score / 10), 0);
      }
      
      player.totalPoints = totalPoints;
      player.level = Math.floor(totalPoints / 10) + 1;
      
      localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(families));
      break;
    }
  }
};

// Obter ranking de jogadores da família
export const getFamilyPlayersRanking = (familyId: string): Player[] => {
  const families = getAllFamilies();
  const family = families.find(f => f.id === familyId);
  
  if (!family) return [];
  
  return [...family.players].sort((a, b) => b.totalPoints - a.totalPoints);
};

// Obter ranking de todas as famílias
export const getFamiliesRanking = (): Array<Family & { totalFamilyPoints: number }> => {
  const families = getAllFamilies();
  
  return families.map(family => {
    const totalFamilyPoints = family.players.reduce((sum, player) => sum + player.totalPoints, 0);
    return { ...family, totalFamilyPoints };
  }).sort((a, b) => b.totalFamilyPoints - a.totalFamilyPoints);
};

// Remover jogador
export const removePlayer = (familyId: string, playerId: string): void => {
  const families = getAllFamilies();
  const family = families.find(f => f.id === familyId);
  
  if (family) {
    family.players = family.players.filter(p => p.id !== playerId);
    localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(families));
    
    // Se era o jogador atual, limpar
    if (localStorage.getItem(CURRENT_PLAYER_KEY) === playerId) {
      localStorage.removeItem(CURRENT_PLAYER_KEY);
    }
  }
};

// Converter User antigo para sistema de Player (compatibilidade)
export const convertUserToPlayer = (user: User): void => {
  const families = getAllFamilies();
  let family = families.find(f => f.id === user.familyId);
  
  if (!family) {
    family = {
      id: user.familyId,
      name: 'Minha Família',
      code: generateFamilyCode(),
      createdAt: new Date().toISOString(),
      players: []
    };
    families.push(family);
  }
  
  const existingPlayer = family.players.find(p => p.id === user.id);
  if (!existingPlayer) {
    family.players.push({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      totalPoints: user.totalPoints,
      level: user.level,
      createdAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(families));
  setCurrentFamily(family.id);
  setCurrentPlayer(user.id);
};
