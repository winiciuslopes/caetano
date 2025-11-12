// Cliente Supabase SQL para Recyclhe Show
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Criar cliente Supabase
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

// Log de inicialização
console.log('🔌 Supabase Client inicializado');
console.log('   URL:', supabaseUrl);
console.log('   Project ID:', projectId);

// ==================== INTERFACES ====================

export interface Perfil {
  id: string;
  nome_integrante: string;
  avatar: string;
  token_familiar: string;
  pontos: number;
  precisao: number;
  tempo_resposta_medio: number;
  total_jogadas: number;
  desempenho_por_dificuldade: {
    facil: { jogadas: number; acertos: number; precisao: number };
    medio: { jogadas: number; acertos: number; precisao: number };
    dificil: { jogadas: number; acertos: number; precisao: number };
  };
  created_at: string;
  updated_at: string;
}

export interface HistoricoJogada {
  id: string;
  jogador_id: string;
  jogo: string;
  nivel: number;
  acerto: boolean;
  tempo_resposta: number;
  pontuacao: number;
  dificuldade: string;
  dados_adicionais?: Record<string, any>;
  timestamp: string;
}

export interface RankingFamilia {
  id: string;
  token_familiar: string;
  nome_familia: string;
  integrante_id: string;
  pontuacao_total: number;
  ultima_jogada: string;
  created_at: string;
}

export interface RankingFamiliaDetalhado {
  posicao: number;
  nome_integrante: string;
  avatar: string;
  pontos: number;
  precisao: number;
  ultima_jogada: string;
}

export interface RankingGlobal {
  posicao: number;
  nome_integrante: string;
  avatar: string;
  token_familiar: string;
  pontos: number;
  precisao: number;
}

export interface EstatisticasGerais {
  total_jogadores: number;
  total_familias: number;
  total_jogadas: number;
  pontuacao_media: number;
  precisao_media: number;
  jogo_mais_popular: string;
}

// ==================== API CLIENT ====================

class SupabaseClient {
  
  // ==================== VERIFICAÇÃO DE CONEXÃO ====================
  
  /**
   * Verificar se consegue conectar ao Supabase e se as tabelas existem
   */
  async verificarConexao(): Promise<{
    conectado: boolean;
    tabelasExistem: boolean;
    mensagem: string;
    detalhes?: string;
  }> {
    try {
      console.log('🔍 Verificando conexão com o Supabase...');
      console.log('   URL:', supabaseUrl);
      console.log('   Key presente:', publicAnonKey ? '✓' : '✗');
      
      // Passo 1: Verificar conectividade básica com timeout
      console.log('📡 Passo 1: Testando conectividade básica...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: Não foi possível conectar ao Supabase em 10 segundos')), 10000)
      );
      
      const queryPromise = supabase
        .from('perfis')
        .select('count')
        .limit(1);
      
      try {
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
        
        if (error) {
          console.log('🔍 Erro detectado:', error);
          console.log('   Código:', error.code);
          console.log('   Mensagem:', error.message);
          console.log('   Detalhes:', error.details);
          console.log('   Hint:', error.hint);
          
          // Erro: Tabela não existe (banco configurado mas sem schema)
          if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
            console.warn('⚠️ Tabelas não existem no banco de dados');
            return {
              conectado: true,
              tabelasExistem: false,
              mensagem: 'Conectado ao Supabase, mas as tabelas ainda não foram criadas',
              detalhes: 'Execute o arquivo schema.sql no Supabase SQL Editor'
            };
          }
          
          // Erro: Problema de autenticação
          if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
            console.error('❌ Problema de autenticação');
            return {
              conectado: false,
              tabelasExistem: false,
              mensagem: 'Erro de autenticação com o Supabase',
              detalhes: 'A chave de API pode estar incorreta ou expirada'
            };
          }
          
          // Erro: Problema de rede
          if (error.message?.includes('Failed to fetch') || 
              error.message?.includes('Network') || 
              error.message?.includes('fetch')) {
            console.error('❌ Problema de rede');
            return {
              conectado: false,
              tabelasExistem: false,
              mensagem: 'Não foi possível conectar ao Supabase',
              detalhes: 'Verifique sua conexão com a internet ou se há bloqueios de firewall'
            };
          }
          
          // Erro genérico
          console.error('❌ Erro desconhecido:', error);
          return {
            conectado: false,
            tabelasExistem: false,
            mensagem: 'Erro ao conectar com o banco de dados',
            detalhes: `${error.message || 'Erro desconhecido'} (Código: ${error.code || 'N/A'})`
          };
        }
        
        // Sucesso!
        console.log('✅ Conexão OK! Tabelas existem!');
        console.log('   Dados retornados:', data);
        return {
          conectado: true,
          tabelasExistem: true,
          mensagem: 'Tudo funcionando corretamente!'
        };
        
      } catch (timeoutError: any) {
        if (timeoutError.message?.includes('Timeout')) {
          console.error('⏱️ Timeout ao conectar');
          return {
            conectado: false,
            tabelasExistem: false,
            mensagem: 'Timeout ao conectar ao Supabase',
            detalhes: 'A conexão demorou muito. Verifique sua internet ou tente novamente'
          };
        }
        throw timeoutError;
      }
      
    } catch (err: any) {
      console.error('❌ Exceção ao verificar conexão:', err);
      console.error('   Tipo:', err.name);
      console.error('   Stack:', err.stack);
      
      return {
        conectado: false,
        tabelasExistem: false,
        mensagem: 'Erro inesperado ao verificar conexão',
        detalhes: err.message || String(err)
      };
    }
  }
  
  // ==================== FAMÍLIA ====================
  
  /**
   * Gerar token familiar único de 6 caracteres
   */
  async gerarTokenFamiliar(): Promise<string> {
    // Tentar usar a função SQL primeiro (silenciosamente)
    try {
      const { data, error } = await supabase.rpc('gerar_token_familiar');
      
      // Se a função SQL funcionar, retornar o token
      if (!error && data) {
        console.log('✅ Token gerado via SQL:', data);
        return data as string;
      }
    } catch (sqlError: any) {
      // Silenciar erros, vamos usar fallback
    }
    
    // Fallback: gerar token no frontend se a função SQL não existir
    console.log('🔧 Gerando token no frontend');
    
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tentativas = 0;
    const maxTentativas = 50;
    
    while (tentativas < maxTentativas) {
      let token = '';
      
      // Gerar 6 caracteres aleatórios
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        token += caracteres[randomIndex];
      }
      
      // Verificar se o token já existe
      const existe = await this.tokenFamiliarExiste(token);
      
      if (!existe) {
        console.log('✅ Token único gerado:', token);
        return token;
      }
      
      tentativas++;
    }
    
    const errorMsg = 'Não foi possível gerar um token único após várias tentativas';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }
  
  /**
   * Validar se token familiar é válido
   */
  async validarTokenFamiliar(token: string): Promise<boolean> {
    // Validação no frontend primeiro
    const regex = /^[A-Z0-9]{6}$/;
    if (!regex.test(token)) {
      return false;
    }
    
    // Tentar validar no backend (silenciosamente)
    try {
      const { data, error } = await supabase.rpc('validar_token_familiar', {
        p_token: token
      });
      
      // Se a função SQL existir e funcionar, usar resultado
      if (!error) {
        return data as boolean;
      }
    } catch (err) {
      // Silenciar erros
    }
    
    // Fallback: usar validação do frontend
    return regex.test(token);
  }
  
  /**
   * Verificar se token familiar existe
   */
  async tokenFamiliarExiste(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('id')
        .eq('token_familiar', token)
        .limit(1);
      
      if (error) {
        // Se a tabela não existir, considerar que o token não existe
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.warn('⚠️ Tabela "perfis" não existe ainda. Execute o schema.sql no Supabase.');
          return false;
        }
        // Não logar erros de rede
        if (!error.message?.includes('Failed to fetch')) {
          console.error('❌ Erro ao verificar token:', error.message);
        }
        return false;
      }
      
      return data && data.length > 0;
    } catch (err: any) {
      // Silenciar completamente erros de rede
      if (!err.message?.includes('Failed to fetch')) {
        console.error('❌ Exceção ao verificar token:', err.message || String(err));
      }
      return false;
    }
  }
  
  /**
   * Obter todos os membros de uma família
   */
  async obterMembrosFamilia(token: string): Promise<Perfil[]> {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('token_familiar', token)
        .order('pontos', { ascending: false });
      
      if (error) {
        // Não logar erros de rede
        if (!error.message?.includes('Failed to fetch')) {
          console.error('❌ Erro ao buscar membros:', error.message);
        }
        
        if (error.code === '42P01') {
          throw new Error('Tabela de perfis não encontrada. Execute o schema.sql no Supabase.');
        }
        
        if (error.message?.includes('Failed to fetch')) {
          throw new Error('Erro de conexão com o banco de dados. Verifique sua internet e se o banco está configurado.');
        }
        
        throw new Error(`Erro ao buscar membros: ${error.message}`);
      }
      
      return (data as Perfil[]) || [];
    } catch (err: any) {
      // Tratamento especial para erros de rede
      if (err.message && err.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão com o banco de dados. Verifique sua internet e se o banco está configurado.');
      }
      
      // Se já é erro conhecido, apenas repassa
      if (err.message && (
        err.message.includes('Tabela de perfis') ||
        err.message.includes('Erro de conexão')
      )) {
        throw err;
      }
      
      console.error('❌ Exceção ao buscar membros:', err.message || String(err));
      throw err;
    }
  }
  
  // ==================== PERFIL (JOGADOR) ====================
  
  /**
   * Criar novo perfil de jogador
   */
  async criarPerfil(
    nome: string,
    avatar: string,
    tokenFamiliar: string
  ): Promise<Perfil> {
    console.log('🔄 Criando perfil:', { nome, avatar, tokenFamiliar });
    
    // Validar token
    const tokenValido = await this.validarTokenFamiliar(tokenFamiliar);
    if (!tokenValido) {
      const errorMsg = 'Token familiar inválido. Deve ter 6 caracteres (A-Z e 0-9)';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('✅ Token validado');
    
    try {
      const { data, error } = await supabase
        .from('perfis')
        .insert({
          nome_integrante: nome,
          avatar: avatar,
          token_familiar: tokenFamiliar.toUpperCase()
        })
        .select()
        .single();
      
      if (error) {
        // Não logar detalhes de erros de rede
        if (!error.message?.includes('Failed to fetch')) {
          console.error('❌ Erro ao criar perfil no Supabase:', error);
          console.error('   Código do erro:', error.code);
          console.error('   Mensagem:', error.message);
        }
        
        // Mensagens de erro mais amigáveis e específicas
        if (error.code === '42P01') {
          console.error('⚠️ A tabela "perfis" não existe no banco de dados.');
          throw new Error('As tabelas do banco de dados ainda não foram criadas. Por favor, execute o arquivo schema.sql no Supabase SQL Editor.');
        }
        
        if (error.code === '23505') {
          throw new Error('Já existe um perfil com este nome nesta família. Escolha outro nome.');
        }
        
        if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
          throw new Error('Erro de autenticação com o banco de dados. Verifique se as credenciais do Supabase estão corretas.');
        }
        
        // Erro de rede
        if (error.message?.includes('Failed to fetch')) {
          throw new Error('Não foi possível conectar ao banco de dados. Verifique: 1) sua conexão com a internet, 2) se o banco foi configurado corretamente.');
        }
        
        // Erro genérico com mais detalhes
        throw new Error(`Erro ao criar perfil no banco de dados: ${error.message} (Código: ${error.code || 'desconhecido'})`);
      }
      
      if (!data) {
        throw new Error('Nenhum dado foi retornado ao criar o perfil. Verifique a configuração do banco de dados.');
      }
      
      console.log('✅ Perfil criado com sucesso:', data);
      return data as Perfil;
    } catch (err: any) {
      // Tratamento especial para erros de rede - não logar stack trace
      if (err.message && err.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar ao banco de dados. Verifique: 1) sua conexão com a internet, 2) se o banco foi configurado corretamente.');
      }
      
      // Se já é um erro conhecido/tratado, apenas repassa
      if (err.message && (
        err.message.includes('tabelas do banco') || 
        err.message.includes('Já existe um perfil') ||
        err.message.includes('Erro de autenticação') ||
        err.message.includes('Não foi possível conectar') ||
        err.message.includes('Nenhum dado foi retornado')
      )) {
        throw err;
      }
      
      // Outros erros - logar apenas a mensagem
      console.error('❌ Exceção inesperada ao criar perfil:', err.message || String(err));
      throw new Error(`Erro inesperado ao criar perfil: ${err.message || 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Obter perfil por ID
   */
  async obterPerfil(id: string): Promise<Perfil> {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Erro ao buscar perfil: ${error.message}`);
    }
    
    return data as Perfil;
  }
  
  /**
   * Buscar perfil por nome e token
   */
  async buscarPerfilPorNome(nome: string, token: string): Promise<Perfil | null> {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('token_familiar', token.toUpperCase())
      .eq('nome_integrante', nome)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Não encontrado
      }
      throw new Error(`Erro ao buscar perfil: ${error.message}`);
    }
    
    return data as Perfil;
  }
  
  /**
   * Atualizar perfil
   */
  async atualizarPerfil(id: string, updates: Partial<Perfil>): Promise<Perfil> {
    const { data, error } = await supabase
      .from('perfis')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }
    
    return data as Perfil;
  }
  
  // ==================== HISTÓRICO DE JOGADAS ====================
  
  /**
   * Registrar uma jogada
   * 
   * IMPORTANTE: Isso automaticamente atualiza:
   * - Estatísticas do perfil (triggers)
   * - Ranking familiar (triggers)
   */
  async registrarJogada(jogada: {
    jogador_id: string;
    jogo: string;
    nivel: number;
    acerto: boolean;
    tempo_resposta: number;
    pontuacao: number;
    dificuldade?: string;
    dados_adicionais?: Record<string, any>;
  }): Promise<HistoricoJogada> {
    const { data, error } = await supabase
      .from('historico_jogadas')
      .insert({
        jogador_id: jogada.jogador_id,
        jogo: jogada.jogo,
        nivel: jogada.nivel,
        acerto: jogada.acerto,
        tempo_resposta: jogada.tempo_resposta,
        pontuacao: jogada.pontuacao,
        dificuldade: jogada.dificuldade || 'Médio',
        dados_adicionais: jogada.dados_adicionais || {}
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao registrar jogada: ${error.message}`);
    }
    
    return data as HistoricoJogada;
  }
  
  /**
   * Obter histórico de um jogador
   */
  async obterHistoricoJogador(
    jogadorId: string,
    limite: number = 50
  ): Promise<HistoricoJogada[]> {
    const { data, error } = await supabase
      .from('historico_jogadas')
      .select('*')
      .eq('jogador_id', jogadorId)
      .order('timestamp', { ascending: false })
      .limit(limite);
    
    if (error) {
      throw new Error(`Erro ao buscar histórico: ${error.message}`);
    }
    
    return data as HistoricoJogada[];
  }
  
  /**
   * Obter histórico de um jogo específico
   */
  async obterHistoricoJogo(
    jogadorId: string,
    jogo: string
  ): Promise<HistoricoJogada[]> {
    const { data, error } = await supabase
      .from('historico_jogadas')
      .select('*')
      .eq('jogador_id', jogadorId)
      .eq('jogo', jogo)
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao buscar histórico do jogo: ${error.message}`);
    }
    
    return data as HistoricoJogada[];
  }
  
  /**
   * Obter estatísticas de um jogo para um jogador
   */
  async obterEstatisticasJogo(jogadorId: string, jogo: string) {
    const historico = await this.obterHistoricoJogo(jogadorId, jogo);
    
    if (historico.length === 0) {
      return {
        total_jogadas: 0,
        acertos: 0,
        erros: 0,
        precisao: 0,
        tempo_medio: 0,
        pontuacao_total: 0,
        melhor_nivel: 0
      };
    }
    
    const acertos = historico.filter(h => h.acerto).length;
    const pontuacaoTotal = historico.reduce((sum, h) => sum + h.pontuacao, 0);
    const tempoMedio = historico.reduce((sum, h) => sum + h.tempo_resposta, 0) / historico.length;
    const melhorNivel = Math.max(...historico.map(h => h.nivel));
    
    return {
      total_jogadas: historico.length,
      acertos,
      erros: historico.length - acertos,
      precisao: (acertos / historico.length) * 100,
      tempo_medio: tempoMedio,
      pontuacao_total: pontuacaoTotal,
      melhor_nivel: melhorNivel
    };
  }
  
  // ==================== RANKINGS ====================
  
  /**
   * Obter ranking de uma família específica
   */
  async obterRankingFamilia(token: string): Promise<RankingFamiliaDetalhado[]> {
    const { data, error } = await supabase.rpc('obter_ranking_familia', {
      p_token_familiar: token.toUpperCase()
    });
    
    if (error) {
      throw new Error(`Erro ao buscar ranking familiar: ${error.message}`);
    }
    
    return data as RankingFamiliaDetalhado[];
  }
  
  /**
   * Obter ranking global de jogadores
   */
  async obterRankingGlobal(limite: number = 100): Promise<RankingGlobal[]> {
    const { data, error } = await supabase.rpc('obter_ranking_global', {
      limite
    });
    
    if (error) {
      throw new Error(`Erro ao buscar ranking global: ${error.message}`);
    }
    
    return data as RankingGlobal[];
  }
  
  /**
   * Obter ranking de famílias (soma de pontos)
   */
  async obterRankingFamilias(limite: number = 50): Promise<Array<{
    posicao: number;
    token_familiar: string;
    nome_familia: string;
    pontuacao_total: number;
    total_membros: number;
  }>> {
    const { data, error } = await supabase
      .from('ranking_familia')
      .select(`
        token_familiar,
        nome_familia,
        pontuacao_total
      `)
      .order('pontuacao_total', { ascending: false })
      .limit(limite);
    
    if (error) {
      throw new Error(`Erro ao buscar ranking de famílias: ${error.message}`);
    }
    
    // Agrupar por família e somar pontos
    const familias = new Map<string, {
      token: string;
      nome: string;
      pontos: number;
      membros: number;
    }>();
    
    data.forEach((item: any) => {
      const key = item.token_familiar;
      if (familias.has(key)) {
        const familia = familias.get(key)!;
        familia.pontos += item.pontuacao_total;
        familia.membros += 1;
      } else {
        familias.set(key, {
          token: item.token_familiar,
          nome: item.nome_familia,
          pontos: item.pontuacao_total,
          membros: 1
        });
      }
    });
    
    // Converter para array e ordenar
    const ranking = Array.from(familias.values())
      .sort((a, b) => b.pontos - a.pontos)
      .map((f, index) => ({
        posicao: index + 1,
        token_familiar: f.token,
        nome_familia: f.nome,
        pontuacao_total: f.pontos,
        total_membros: f.membros
      }));
    
    return ranking;
  }
  
  // ==================== ESTATÍSTICAS ====================
  
  /**
   * Obter estatísticas gerais do sistema
   */
  async obterEstatisticasGerais(): Promise<EstatisticasGerais> {
    const { data, error } = await supabase.rpc('obter_estatisticas_gerais');
    
    if (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }
    
    return data as EstatisticasGerais;
  }
  
  // ==================== EXPORTAÇÃO ====================
  
  /**
   * Exportar histórico de jogadas em formato CSV
   */
  async exportarHistoricoCSV(jogadorId: string): Promise<string> {
    const historico = await this.obterHistoricoJogador(jogadorId, 10000);
    
    if (historico.length === 0) {
      return 'Nenhuma jogada encontrada';
    }
    
    // Cabeçalho CSV
    let csv = 'ID,Jogo,Nível,Acerto,Tempo (s),Pontuação,Dificuldade,Data/Hora\n';
    
    // Linhas de dados
    historico.forEach(h => {
      csv += `${h.id},${h.jogo},${h.nivel},${h.acerto ? 'Sim' : 'Não'},${h.tempo_resposta},${h.pontuacao},${h.dificuldade},${h.timestamp}\n`;
    });
    
    return csv;
  }
  
  /**
   * Exportar histórico de jogadas em formato JSON
   */
  async exportarHistoricoJSON(jogadorId: string): Promise<string> {
    const historico = await this.obterHistoricoJogador(jogadorId, 10000);
    return JSON.stringify(historico, null, 2);
  }
  
  /**
   * Download de histórico
   */
  async downloadHistorico(jogadorId: string, formato: 'csv' | 'json' = 'csv') {
    let conteudo: string;
    let tipo: string;
    let extensao: string;
    
    if (formato === 'csv') {
      conteudo = await this.exportarHistoricoCSV(jogadorId);
      tipo = 'text/csv;charset=utf-8;';
      extensao = 'csv';
    } else {
      conteudo = await this.exportarHistoricoJSON(jogadorId);
      tipo = 'application/json;charset=utf-8;';
      extensao = 'json';
    }
    
    // Criar blob e fazer download
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historico_${jogadorId}_${Date.now()}.${extensao}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ==================== PROGRESSO E DESBLOQUEIO ====================

  /**
   * Obter progresso do jogador em um jogo específico
   * Retorna um objeto com nível -> porcentagem de acertos
   */
  async obterProgressoJogo(
    jogadorId: string,
    jogo: string
  ): Promise<Record<number, number>> {
    const historico = await this.obterHistoricoJogo(jogadorId, jogo);
    
    if (historico.length === 0) {
      return {};
    }
    
    // Agrupar por nível e calcular porcentagem
    const niveis: Record<number, { acertos: number; total: number }> = {};
    
    historico.forEach(h => {
      if (!niveis[h.nivel]) {
        niveis[h.nivel] = { acertos: 0, total: 0 };
      }
      niveis[h.nivel].total++;
      if (h.acerto) {
        niveis[h.nivel].acertos++;
      }
    });
    
    // Converter para porcentagem
    const progresso: Record<number, number> = {};
    Object.keys(niveis).forEach(nivel => {
      const n = parseInt(nivel);
      const stats = niveis[n];
      progresso[n] = (stats.acertos / stats.total) * 100;
    });
    
    return progresso;
  }

  /**
   * Verificar se um nível está desbloqueado
   * Critério: precisa ter 90% ou mais no nível anterior
   */
  async verificarNivelDesbloqueado(
    jogadorId: string,
    jogo: string,
    nivel: number
  ): Promise<boolean> {
    // Nível 1 sempre desbloqueado
    if (nivel === 1) return true;
    
    // Buscar progresso do nível anterior
    const progresso = await this.obterProgressoJogo(jogadorId, jogo);
    const porcentagemAnterior = progresso[nivel - 1] || 0;
    
    return porcentagemAnterior >= 90;
  }

  /**
   * Obter todo o progresso do jogador (todos os jogos)
   */
  async obterProgressoCompleto(jogadorId: string): Promise<{
    quiz: Record<number, number>;
    sorting: Record<number, number>;
    route: Record<number, number>;
    memory: Record<number, number>;
    composting: Record<number, number>;
  }> {
    const jogos = ['quiz', 'sorting', 'route', 'memory', 'composting'];
    const resultado: any = {};
    
    for (const jogo of jogos) {
      resultado[jogo] = await this.obterProgressoJogo(jogadorId, jogo);
    }
    
    return resultado;
  }
}

// Exportar instância singleton
export const supabaseClient = new SupabaseClient();

// Exportar cliente Supabase direto (para casos avançados)
export { supabase };