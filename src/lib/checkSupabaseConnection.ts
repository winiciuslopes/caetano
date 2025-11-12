// Verificar conexão com o Supabase e se o banco está configurado
import { supabase } from './supabaseClient';

export interface DatabaseStatus {
  isConnected: boolean;
  tablesExist: boolean;
  error?: string;
}

/**
 * Verifica se o Supabase está conectado e as tabelas estão criadas
 */
export async function checkSupabaseConnection(): Promise<DatabaseStatus> {
  try {
    // Tentar fazer uma query simples na tabela perfis
    const { data, error } = await supabase
      .from('perfis')
      .select('id')
      .limit(1);
    
    if (error) {
      // Se a tabela não existe
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          isConnected: true,
          tablesExist: false,
          error: 'Tabelas não criadas. Execute o schema.sql no Supabase.'
        };
      }
      
      // Outros erros
      return {
        isConnected: false,
        tablesExist: false,
        error: error.message
      };
    }
    
    // Tudo OK
    return {
      isConnected: true,
      tablesExist: true
    };
  } catch (err: any) {
    // Erro de rede
    if (err.message && err.message.includes('Failed to fetch')) {
      return {
        isConnected: false,
        tablesExist: false,
        error: 'Erro de conexão com o Supabase'
      };
    }
    
    return {
      isConnected: false,
      tablesExist: false,
      error: err.message || 'Erro desconhecido'
    };
  }
}

/**
 * Verifica se uma função SQL específica existe
 */
export async function checkSQLFunction(functionName: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc(functionName as any, {});
    
    // Se não houver erro ou se o erro for de parâmetros (significa que a função existe)
    if (!error || error.code !== '42883') {
      return true;
    }
    
    return false;
  } catch (err) {
    return false;
  }
}
