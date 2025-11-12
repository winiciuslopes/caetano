// Script de Teste Automatizado do Supabase
import { supabaseClient } from './supabaseClient';

export interface TestResult {
  nome: string;
  sucesso: boolean;
  mensagem: string;
  dados?: any;
}

export async function testarConexaoSupabase(): Promise<TestResult[]> {
  const resultados: TestResult[] = [];
  
  console.log('🧪 Iniciando testes do banco de dados Supabase...\n');
  
  // ===== TESTE 1: Gerar Token Familiar =====
  try {
    const token = await supabaseClient.gerarTokenFamiliar();
    resultados.push({
      nome: '1. Gerar Token Familiar',
      sucesso: true,
      mensagem: `Token gerado: ${token}`,
      dados: { token }
    });
    console.log('✅ Teste 1: Token gerado com sucesso:', token);
  } catch (error: any) {
    resultados.push({
      nome: '1. Gerar Token Familiar',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 1: Falhou', error);
    return resultados; // Se falhar aqui, não continua
  }
  
  // Usar o token gerado
  const tokenTeste = resultados[0].dados?.token;
  
  // ===== TESTE 2: Validar Token =====
  try {
    const valido = await supabaseClient.validarTokenFamiliar(tokenTeste);
    resultados.push({
      nome: '2. Validar Token',
      sucesso: valido,
      mensagem: valido ? 'Token válido' : 'Token inválido',
      dados: { tokenTeste, valido }
    });
    console.log('✅ Teste 2: Validação de token:', valido);
  } catch (error: any) {
    resultados.push({
      nome: '2. Validar Token',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 2: Falhou', error);
  }
  
  // ===== TESTE 3: Criar Perfil =====
  let perfilId: string = '';
  try {
    const perfil = await supabaseClient.criarPerfil(
      'João Teste',
      '👨',
      tokenTeste
    );
    perfilId = perfil.id;
    resultados.push({
      nome: '3. Criar Perfil',
      sucesso: true,
      mensagem: `Perfil criado: ${perfil.nome_integrante}`,
      dados: perfil
    });
    console.log('✅ Teste 3: Perfil criado:', perfil);
  } catch (error: any) {
    resultados.push({
      nome: '3. Criar Perfil',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 3: Falhou', error);
    return resultados;
  }
  
  // ===== TESTE 4: Buscar Perfil por ID =====
  try {
    const perfil = await supabaseClient.obterPerfil(perfilId);
    resultados.push({
      nome: '4. Buscar Perfil por ID',
      sucesso: perfil.id === perfilId,
      mensagem: `Perfil encontrado: ${perfil.nome_integrante}`,
      dados: perfil
    });
    console.log('✅ Teste 4: Perfil encontrado:', perfil);
  } catch (error: any) {
    resultados.push({
      nome: '4. Buscar Perfil por ID',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 4: Falhou', error);
  }
  
  // ===== TESTE 5: Registrar Jogada =====
  try {
    const jogada = await supabaseClient.registrarJogada({
      jogador_id: perfilId,
      jogo: 'quiz',
      nivel: 1,
      acerto: true,
      tempo_resposta: 5.5,
      pontuacao: 100,
      dificuldade: 'Fácil',
      dados_adicionais: { pergunta_id: 'q1' }
    });
    resultados.push({
      nome: '5. Registrar Jogada',
      sucesso: true,
      mensagem: 'Jogada registrada com sucesso',
      dados: jogada
    });
    console.log('✅ Teste 5: Jogada registrada:', jogada);
  } catch (error: any) {
    resultados.push({
      nome: '5. Registrar Jogada',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 5: Falhou', error);
  }
  
  // ===== TESTE 6: Verificar Atualização Automática de Estatísticas =====
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar trigger
    const perfil = await supabaseClient.obterPerfil(perfilId);
    const estatisticasOk = perfil.pontos === 100 && perfil.total_jogadas === 1;
    resultados.push({
      nome: '6. Atualização Automática de Stats',
      sucesso: estatisticasOk,
      mensagem: estatisticasOk 
        ? `Stats atualizadas: ${perfil.pontos} pontos, ${perfil.total_jogadas} jogada(s)`
        : 'Stats não foram atualizadas corretamente',
      dados: {
        pontos: perfil.pontos,
        total_jogadas: perfil.total_jogadas,
        precisao: perfil.precisao
      }
    });
    console.log('✅ Teste 6: Estatísticas atualizadas:', {
      pontos: perfil.pontos,
      precisao: perfil.precisao,
      total_jogadas: perfil.total_jogadas
    });
  } catch (error: any) {
    resultados.push({
      nome: '6. Atualização Automática de Stats',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 6: Falhou', error);
  }
  
  // ===== TESTE 7: Obter Histórico =====
  try {
    const historico = await supabaseClient.obterHistoricoJogador(perfilId);
    resultados.push({
      nome: '7. Obter Histórico',
      sucesso: historico.length > 0,
      mensagem: `${historico.length} jogada(s) no histórico`,
      dados: historico
    });
    console.log('✅ Teste 7: Histórico obtido:', historico.length, 'jogadas');
  } catch (error: any) {
    resultados.push({
      nome: '7. Obter Histórico',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 7: Falhou', error);
  }
  
  // ===== TESTE 8: Obter Ranking Familiar =====
  try {
    const ranking = await supabaseClient.obterRankingFamilia(tokenTeste);
    resultados.push({
      nome: '8. Obter Ranking Familiar',
      sucesso: ranking.length > 0,
      mensagem: `${ranking.length} membro(s) no ranking`,
      dados: ranking
    });
    console.log('✅ Teste 8: Ranking familiar:', ranking);
  } catch (error: any) {
    resultados.push({
      nome: '8. Obter Ranking Familiar',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 8: Falhou', error);
  }
  
  // ===== TESTE 9: Criar Mais Perfis na Mesma Família =====
  try {
    const perfil2 = await supabaseClient.criarPerfil(
      'Maria Teste',
      '👩',
      tokenTeste
    );
    const perfil3 = await supabaseClient.criarPerfil(
      'Pedro Teste',
      '👦',
      tokenTeste
    );
    
    // Registrar jogadas para criar ranking
    await supabaseClient.registrarJogada({
      jogador_id: perfil2.id,
      jogo: 'sorting',
      nivel: 1,
      acerto: true,
      tempo_resposta: 3.2,
      pontuacao: 150,
      dificuldade: 'Médio'
    });
    
    await supabaseClient.registrarJogada({
      jogador_id: perfil3.id,
      jogo: 'memory',
      nivel: 1,
      acerto: false,
      tempo_resposta: 8.1,
      pontuacao: 50,
      dificuldade: 'Fácil'
    });
    
    resultados.push({
      nome: '9. Criar Família Completa',
      sucesso: true,
      mensagem: `3 membros criados: João, Maria, Pedro`,
      dados: { perfil2, perfil3 }
    });
    console.log('✅ Teste 9: Família completa criada');
  } catch (error: any) {
    resultados.push({
      nome: '9. Criar Família Completa',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 9: Falhou', error);
  }
  
  // ===== TESTE 10: Obter Membros da Família =====
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar triggers
    const membros = await supabaseClient.obterMembrosFamilia(tokenTeste);
    resultados.push({
      nome: '10. Obter Membros da Família',
      sucesso: membros.length === 3,
      mensagem: `${membros.length} membros encontrados`,
      dados: membros
    });
    console.log('✅ Teste 10: Membros da família:', membros.map(m => ({
      nome: m.nome_integrante,
      pontos: m.pontos
    })));
  } catch (error: any) {
    resultados.push({
      nome: '10. Obter Membros da Família',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 10: Falhou', error);
  }
  
  // ===== TESTE 11: Ranking Global =====
  try {
    const ranking = await supabaseClient.obterRankingGlobal(10);
    resultados.push({
      nome: '11. Ranking Global',
      sucesso: ranking.length > 0,
      mensagem: `${ranking.length} jogadores no ranking global`,
      dados: ranking
    });
    console.log('✅ Teste 11: Ranking global:', ranking.slice(0, 3));
  } catch (error: any) {
    resultados.push({
      nome: '11. Ranking Global',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 11: Falhou', error);
  }
  
  // ===== TESTE 12: Estatísticas Gerais =====
  try {
    const stats = await supabaseClient.obterEstatisticasGerais();
    resultados.push({
      nome: '12. Estatísticas Gerais',
      sucesso: true,
      mensagem: `Total: ${stats.total_jogadores} jogadores, ${stats.total_jogadas} jogadas`,
      dados: stats
    });
    console.log('✅ Teste 12: Estatísticas gerais:', stats);
  } catch (error: any) {
    resultados.push({
      nome: '12. Estatísticas Gerais',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 12: Falhou', error);
  }
  
  // ===== TESTE 13: Exportar CSV =====
  try {
    const csv = await supabaseClient.exportarHistoricoCSV(perfilId);
    const csvOk = csv.includes('ID,Jogo,Nível');
    resultados.push({
      nome: '13. Exportar CSV',
      sucesso: csvOk,
      mensagem: csvOk ? 'CSV gerado com sucesso' : 'Formato CSV incorreto',
      dados: { preview: csv.substring(0, 100) + '...' }
    });
    console.log('✅ Teste 13: CSV exportado');
  } catch (error: any) {
    resultados.push({
      nome: '13. Exportar CSV',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 13: Falhou', error);
  }
  
  // ===== TESTE 14: Exportar JSON =====
  try {
    const json = await supabaseClient.exportarHistoricoJSON(perfilId);
    const jsonParsed = JSON.parse(json);
    resultados.push({
      nome: '14. Exportar JSON',
      sucesso: Array.isArray(jsonParsed),
      mensagem: `JSON válido com ${jsonParsed.length} jogadas`,
      dados: { total: jsonParsed.length }
    });
    console.log('✅ Teste 14: JSON exportado');
  } catch (error: any) {
    resultados.push({
      nome: '14. Exportar JSON',
      sucesso: false,
      mensagem: `Erro: ${error.message}`
    });
    console.error('❌ Teste 14: Falhou', error);
  }
  
  // Resumo final
  console.log('\n📊 RESUMO DOS TESTES:');
  const sucessos = resultados.filter(r => r.sucesso).length;
  const total = resultados.length;
  console.log(`✅ ${sucessos}/${total} testes passaram`);
  console.log(`❌ ${total - sucessos}/${total} testes falharam`);
  
  return resultados;
}

// Exportar função para ser usada em componentes
export default testarConexaoSupabase;
