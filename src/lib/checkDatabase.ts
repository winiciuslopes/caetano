import { supabase } from './supabaseClient';

export interface DatabaseStatus {
  configured: boolean;
  tables: {
    perfis: boolean;
    historico_jogadas: boolean;
    ranking_familia: boolean;
  };
  functions: {
    gerar_token_familiar: boolean;
    validar_token_familiar: boolean;
  };
  error?: string;
}

/**
 * Verifica se o banco de dados está configurado corretamente
 */
export async function checkDatabaseConfiguration(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    configured: false,
    tables: {
      perfis: false,
      historico_jogadas: false,
      ranking_familia: false,
    },
    functions: {
      gerar_token_familiar: false,
      validar_token_familiar: false,
    },
  };

  try {
    // Verificar tabela perfis
    const { error: perfisError } = await supabase
      .from('perfis')
      .select('id')
      .limit(1);
    
    status.tables.perfis = !perfisError || perfisError.code !== '42P01';

    // Verificar tabela historico_jogadas
    const { error: historicoError } = await supabase
      .from('historico_jogadas')
      .select('id')
      .limit(1);
    
    status.tables.historico_jogadas = !historicoError || historicoError.code !== '42P01';

    // Verificar tabela ranking_familia
    const { error: rankingError } = await supabase
      .from('ranking_familia')
      .select('id')
      .limit(1);
    
    status.tables.ranking_familia = !rankingError || rankingError.code !== '42P01';

    // Verificar função gerar_token_familiar
    try {
      const { error: gerarTokenError } = await supabase.rpc('gerar_token_familiar');
      status.functions.gerar_token_familiar = !gerarTokenError || gerarTokenError.code !== '42883';
    } catch {
      status.functions.gerar_token_familiar = false;
    }

    // Verificar função validar_token_familiar
    try {
      const { error: validarTokenError } = await supabase.rpc('validar_token_familiar', {
        p_token: 'TEST00'
      });
      status.functions.validar_token_familiar = !validarTokenError || validarTokenError.code !== '42883';
    } catch {
      status.functions.validar_token_familiar = false;
    }

    // Banco configurado se pelo menos a tabela perfis existir
    status.configured = status.tables.perfis;

  } catch (error: any) {
    status.error = error.message;
    status.configured = false;
  }

  return status;
}

/**
 * Verifica de forma simples se o banco está configurado
 */
export async function isDatabaseConfigured(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('perfis')
      .select('id')
      .limit(1);
    
    // Se não houver erro ou se o erro não for "tabela não existe"
    return !error || error.code !== '42P01';
  } catch {
    return false;
  }
}
