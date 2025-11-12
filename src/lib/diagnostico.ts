// Ferramenta de Diagnóstico Avançado para Supabase
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface ResultadoDiagnostico {
  etapa: string;
  status: 'ok' | 'aviso' | 'erro';
  mensagem: string;
  detalhes?: string;
  tempo?: number;
}

export async function executarDiagnosticoCompleto(): Promise<ResultadoDiagnostico[]> {
  const resultados: ResultadoDiagnostico[] = [];
  const supabaseUrl = `https://${projectId}.supabase.co`;

  console.log('🔬 INICIANDO DIAGNÓSTICO COMPLETO');
  console.log('================================================');

  // Etapa 1: Verificar credenciais
  console.log('\n📋 Etapa 1: Verificando credenciais...');
  const inicio1 = Date.now();
  
  if (!projectId || projectId === 'YOUR_PROJECT_ID') {
    resultados.push({
      etapa: '1. Credenciais',
      status: 'erro',
      mensagem: 'Project ID não configurado',
      detalhes: 'O Project ID está vazio ou com valor padrão',
      tempo: Date.now() - inicio1
    });
    console.error('❌ Project ID inválido');
  } else if (!publicAnonKey || publicAnonKey.length < 100) {
    resultados.push({
      etapa: '1. Credenciais',
      status: 'erro',
      mensagem: 'API Key suspeita',
      detalhes: 'A chave pública parece estar incompleta ou incorreta',
      tempo: Date.now() - inicio1
    });
    console.error('❌ API Key suspeita');
  } else {
    resultados.push({
      etapa: '1. Credenciais',
      status: 'ok',
      mensagem: 'Credenciais parecem válidas',
      detalhes: `Project: ${projectId}, Key: ${publicAnonKey.substring(0, 20)}...`,
      tempo: Date.now() - inicio1
    });
    console.log('✅ Credenciais OK');
  }

  // Etapa 2: Testar resolução DNS
  console.log('\n🌐 Etapa 2: Testando conectividade de rede...');
  const inicio2 = Date.now();
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'apikey': publicAnonKey
      }
    });
    
    clearTimeout(timeout);
    const tempo2 = Date.now() - inicio2;
    
    if (response.ok || response.status === 404 || response.status === 401) {
      resultados.push({
        etapa: '2. Conectividade',
        status: 'ok',
        mensagem: 'Servidor Supabase acessível',
        detalhes: `Status HTTP: ${response.status}, Tempo: ${tempo2}ms`,
        tempo: tempo2
      });
      console.log(`✅ Conectividade OK (${tempo2}ms)`);
    } else {
      resultados.push({
        etapa: '2. Conectividade',
        status: 'aviso',
        mensagem: 'Resposta inesperada do servidor',
        detalhes: `Status HTTP: ${response.status}`,
        tempo: tempo2
      });
      console.warn(`⚠️ Status inesperado: ${response.status}`);
    }
  } catch (err: any) {
    const tempo2 = Date.now() - inicio2;
    
    if (err.name === 'AbortError') {
      resultados.push({
        etapa: '2. Conectividade',
        status: 'erro',
        mensagem: 'Timeout de conexão',
        detalhes: 'Servidor não respondeu em 5 segundos',
        tempo: tempo2
      });
      console.error('❌ Timeout');
    } else {
      resultados.push({
        etapa: '2. Conectividade',
        status: 'erro',
        mensagem: 'Falha na conexão de rede',
        detalhes: err.message || String(err),
        tempo: tempo2
      });
      console.error('❌ Erro de rede:', err.message);
    }
  }

  // Etapa 3: Testar cliente Supabase
  console.log('\n🔧 Etapa 3: Testando cliente Supabase...');
  const inicio3 = Date.now();
  
  try {
    const supabase = createClient(supabaseUrl, publicAnonKey);
    resultados.push({
      etapa: '3. Cliente',
      status: 'ok',
      mensagem: 'Cliente Supabase inicializado',
      tempo: Date.now() - inicio3
    });
    console.log('✅ Cliente criado');
  } catch (err: any) {
    resultados.push({
      etapa: '3. Cliente',
      status: 'erro',
      mensagem: 'Erro ao criar cliente',
      detalhes: err.message || String(err),
      tempo: Date.now() - inicio3
    });
    console.error('❌ Erro ao criar cliente:', err);
  }

  // Etapa 4: Testar query no banco
  console.log('\n💾 Etapa 4: Testando query no banco de dados...');
  const inicio4 = Date.now();
  
  try {
    const supabase = createClient(supabaseUrl, publicAnonKey);
    const { data, error } = await supabase
      .from('perfis')
      .select('count')
      .limit(1);
    
    const tempo4 = Date.now() - inicio4;
    
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        resultados.push({
          etapa: '4. Banco de Dados',
          status: 'aviso',
          mensagem: 'Tabela "perfis" não existe',
          detalhes: 'Execute o schema.sql no SQL Editor',
          tempo: tempo4
        });
        console.warn('⚠️ Tabela não existe');
      } else if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
        resultados.push({
          etapa: '4. Banco de Dados',
          status: 'erro',
          mensagem: 'Erro de autenticação',
          detalhes: error.message,
          tempo: tempo4
        });
        console.error('❌ Erro de auth:', error.message);
      } else {
        resultados.push({
          etapa: '4. Banco de Dados',
          status: 'erro',
          mensagem: 'Erro ao consultar banco',
          detalhes: `${error.message} (Código: ${error.code})`,
          tempo: tempo4
        });
        console.error('❌ Erro de query:', error);
      }
    } else {
      resultados.push({
        etapa: '4. Banco de Dados',
        status: 'ok',
        mensagem: 'Query executada com sucesso!',
        detalhes: 'Tabela "perfis" existe e está acessível',
        tempo: tempo4
      });
      console.log('✅ Query OK');
    }
  } catch (err: any) {
    const tempo4 = Date.now() - inicio4;
    resultados.push({
      etapa: '4. Banco de Dados',
      status: 'erro',
      mensagem: 'Exceção ao consultar banco',
      detalhes: err.message || String(err),
      tempo: tempo4
    });
    console.error('❌ Exceção:', err);
  }

  console.log('\n================================================');
  console.log('🔬 DIAGNÓSTICO COMPLETO FINALIZADO');
  console.log(`   Total: ${resultados.length} testes`);
  console.log(`   OK: ${resultados.filter(r => r.status === 'ok').length}`);
  console.log(`   Avisos: ${resultados.filter(r => r.status === 'aviso').length}`);
  console.log(`   Erros: ${resultados.filter(r => r.status === 'erro').length}`);
  console.log('================================================\n');

  return resultados;
}

export function gerarRelatorioTexto(resultados: ResultadoDiagnostico[]): string {
  let relatorio = '🔬 RELATÓRIO DE DIAGNÓSTICO - Recycle Show\n';
  relatorio += '='.repeat(60) + '\n\n';
  relatorio += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
  relatorio += `Project ID: ${projectId}\n\n`;
  
  resultados.forEach((r, i) => {
    const icone = r.status === 'ok' ? '✅' : r.status === 'aviso' ? '⚠️' : '❌';
    relatorio += `${icone} ${r.etapa}\n`;
    relatorio += `   Status: ${r.status.toUpperCase()}\n`;
    relatorio += `   Mensagem: ${r.mensagem}\n`;
    if (r.detalhes) {
      relatorio += `   Detalhes: ${r.detalhes}\n`;
    }
    if (r.tempo !== undefined) {
      relatorio += `   Tempo: ${r.tempo}ms\n`;
    }
    relatorio += '\n';
  });
  
  relatorio += '='.repeat(60) + '\n';
  
  const totalOk = resultados.filter(r => r.status === 'ok').length;
  const totalAvisos = resultados.filter(r => r.status === 'aviso').length;
  const totalErros = resultados.filter(r => r.status === 'erro').length;
  
  relatorio += `Resumo: ${totalOk} OK | ${totalAvisos} Avisos | ${totalErros} Erros\n`;
  
  return relatorio;
}
