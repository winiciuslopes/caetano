/**
 * Data Adapter - Camada de compatibilidade entre mockData.ts e apiClient
 * 
 * Este arquivo permite migração gradual do sistema antigo (mockData) para o novo (Supabase)
 * Mantenha as mesmas interfaces para não quebrar o código existente
 */

import { apiClient, Player, Family } from './apiClient';
import * as mockData from './mockData';

// Flag para alternar entre mock e API real
// Defina como true quando estiver pronto para usar Supabase
const USE_SUPABASE = false;

/**
 * Wrapper para criar família
 * Compatível com a função antiga createFamily() do mockData.ts
 */
export async function createFamily(name: string): Promise<Family> {
  if (USE_SUPABASE) {
    try {
      const { family } = await apiClient.createFamily(name);
      return {
        ...family,
        players: [] // Compatibilidade com interface antiga
      };
    } catch (error) {
      console.error('Erro ao criar família no Supabase, usando mock:', error);
      return mockData.createFamily(name);
    }
  }
  
  return mockData.createFamily(name);
}

/**
 * Wrapper para buscar família por código
 */
export async function findFamilyByCode(code: string): Promise<Family | undefined> {
  if (USE_SUPABASE) {
    try {
      const { family } = await apiClient.getFamilyByCode(code);
      return family;
    } catch (error) {
      console.error('Erro ao buscar família no Supabase, usando mock:', error);
      return mockData.findFamilyByCode(code);
    }
  }
  
  return mockData.findFamilyByCode(code);
}

/**
 * Wrapper para adicionar jogador à família
 */
export async function addPlayerToFamily(
  familyId: string,
  name: string,
  avatar: string
): Promise<Player> {
  if (USE_SUPABASE) {
    try {
      const { player } = await apiClient.createPlayer(name, avatar, familyId);
      return player;
    } catch (error) {
      console.error('Erro ao criar jogador no Supabase, usando mock:', error);
      return mockData.addPlayerToFamily(familyId, name, avatar);
    }
  }
  
  return mockData.addPlayerToFamily(familyId, name, avatar);
}

/**
 * Wrapper para salvar progresso do jogo
 */
export async function savePlayerProgress(
  playerId: string,
  game: string,
  level: number,
  score: number,
  completed: boolean = false
): Promise<void> {
  if (USE_SUPABASE) {
    try {
      await apiClient.saveProgress(playerId, game, level, score, completed);
    } catch (error) {
      console.error('Erro ao salvar progresso no Supabase:', error);
      // Fallback para mock se necessário
      mockData.savePlayerProgress(playerId, game, level, score);
    }
  } else {
    mockData.savePlayerProgress(playerId, game, level, score);
  }
}

/**
 * Wrapper para salvar métrica
 */
export async function saveMetric(metric: mockData.GameMetric): Promise<void> {
  if (USE_SUPABASE) {
    try {
      await apiClient.saveMetric({
        playerId: metric.userId, // mockData usa userId, API usa playerId
        game: metric.difficulty.includes('quiz') ? 'quiz' : 
              metric.difficulty.includes('sorting') ? 'sorting' :
              metric.difficulty.includes('route') ? 'route' :
              metric.difficulty.includes('memory') ? 'memory' :
              'composting',
        level: parseInt(metric.difficulty.split('_')[1]) || 1,
        questionId: metric.questionId,
        answer: metric.answer,
        correct: metric.correct,
        timeSeconds: metric.timeSeconds,
        score: metric.correct ? 1 : 0,
      });
    } catch (error) {
      console.error('Erro ao salvar métrica no Supabase:', error);
      mockData.saveMetric(metric);
    }
  } else {
    mockData.saveMetric(metric);
  }
}

/**
 * Wrapper para buscar jogador
 */
export async function getPlayer(playerId: string): Promise<Player | null> {
  if (USE_SUPABASE) {
    try {
      const { player } = await apiClient.getPlayer(playerId);
      return player;
    } catch (error) {
      console.error('Erro ao buscar jogador no Supabase:', error);
      return null;
    }
  }
  
  // Mock não tem função getPlayer, mas podemos buscar em todas as famílias
  return null;
}

/**
 * Wrapper para atualizar jogador
 */
export async function updatePlayer(
  playerId: string,
  updates: Partial<Player>
): Promise<Player | null> {
  if (USE_SUPABASE) {
    try {
      const { player } = await apiClient.updatePlayer(playerId, updates);
      return player;
    } catch (error) {
      console.error('Erro ao atualizar jogador no Supabase:', error);
      return null;
    }
  }
  
  // Mock não tem atualização, retorna null
  return null;
}

/**
 * Wrapper para buscar ranking de famílias
 */
export async function getFamilyRanking(): Promise<any[]> {
  if (USE_SUPABASE) {
    try {
      const { ranking } = await apiClient.getFamilyRanking();
      return ranking;
    } catch (error) {
      console.error('Erro ao buscar ranking no Supabase:', error);
      return [];
    }
  }
  
  // Mock: calcular ranking das famílias
  return [];
}

/**
 * Wrapper para exportar métricas
 */
export async function exportPlayerMetrics(
  playerId: string,
  format: 'json' | 'csv' = 'json'
): Promise<any> {
  if (USE_SUPABASE) {
    try {
      return await apiClient.exportMetrics(playerId, format);
    } catch (error) {
      console.error('Erro ao exportar métricas do Supabase:', error);
      // Fallback: retornar métricas do mock
      if (format === 'json') {
        return { metrics: mockData.mockMetrics };
      }
      // Converter para CSV
      return convertMetricsToCSV(mockData.mockMetrics);
    }
  }
  
  if (format === 'json') {
    return { metrics: mockData.mockMetrics };
  }
  return convertMetricsToCSV(mockData.mockMetrics);
}

/**
 * Helper para converter métricas em CSV
 */
function convertMetricsToCSV(metrics: mockData.GameMetric[]): string {
  if (metrics.length === 0) return 'Nenhum dado disponível';
  
  const headers = ['userId', 'questionId', 'answer', 'correct', 'timeSeconds', 'difficulty', 'timestamp'];
  const rows = [headers.join(',')];
  
  metrics.forEach(metric => {
    const values = headers.map(header => {
      const value = metric[header as keyof mockData.GameMetric];
      return typeof value === 'object' ? JSON.stringify(value) : value;
    });
    rows.push(values.join(','));
  });
  
  return rows.join('\n');
}

/**
 * Função para ativar/desativar o uso do Supabase
 * Execute no console: enableSupabase(true)
 */
export function enableSupabase(enabled: boolean) {
  (USE_SUPABASE as any) = enabled;
  console.log(`Supabase ${enabled ? 'ATIVADO' : 'DESATIVADO'}`);
  console.log('⚠️ ATENÇÃO: Para persistir esta mudança, edite USE_SUPABASE em dataAdapter.ts');
}

// Exportar para uso no console
if (typeof window !== 'undefined') {
  (window as any).enableSupabase = enableSupabase;
  (window as any).USE_SUPABASE = USE_SUPABASE;
}

// Re-exportar tipos e dados do mockData para compatibilidade
export * from './mockData';
export { USE_SUPABASE };
