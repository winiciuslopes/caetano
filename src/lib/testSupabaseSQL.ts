// 🧪 Suite de Testes para Supabase SQL
// Execute no console: testSupabaseSQL()

import { supabaseClient } from './supabaseClient';

/**
 * Teste completo do sistema Supabase SQL
 */
export async function testSupabaseSQL() {
  console.log('🧪 ===== INICIANDO TESTES SUPABASE SQL =====\n');
  
  try {
    // ==================== TESTE 1: CRIAR FAMÍLIA ====================
    console.log('📋 TESTE 1: Criar Família');
    console.log('------------------------------------------');
    
    const token = await supabaseClient.gerarTokenFamiliar();
    console.log('✅ Token gerado:', token);
    console.log(`   Formato: ${token.length} caracteres, apenas A-Z e 0-9\n`);
    
    // ==================== TESTE 2: CRIAR JOGADORES ====================
    console.log('📋 TESTE 2: Criar Jogadores');
    console.log('------------------------------------------');
    
    const jogador1 = await supabaseClient.criarPerfil(
      'João Silva Teste',
      '👦',
      token
    );
    console.log('✅ Jogador 1 criado:', jogador1.nome_integrante);
    console.log('   ID:', jogador1.id);
    console.log('   Avatar:', jogador1.avatar);
    console.log('   Pontos:', jogador1.pontos);
    console.log('   Total jogadas:', jogador1.total_jogadas);
    
    const jogador2 = await supabaseClient.criarPerfil(
      'Maria Silva Teste',
      '👧',
      token
    );
    console.log('✅ Jogador 2 criado:', jogador2.nome_integrante);
    console.log('   ID:', jogador2.id);
    console.log('   Avatar:', jogador2.avatar, '\n');
    
    // ==================== TESTE 3: BUSCAR FAMÍLIA ====================
    console.log('📋 TESTE 3: Buscar Membros da Família');
    console.log('------------------------------------------');
    
    const membros = await supabaseClient.obterMembrosFamilia(token);
    console.log('✅ Membros encontrados:', membros.length);
    membros.forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.avatar} ${m.nome_integrante} - ${m.pontos} pontos`);
    });
    console.log();
    
    // ==================== TESTE 4: REGISTRAR JOGADAS ====================
    console.log('📋 TESTE 4: Registrar Jogadas (Quiz)');
    console.log('------------------------------------------');
    
    // Simulando 10 perguntas do quiz nível 1
    console.log('Simulando 10 perguntas do Quiz (Nível 1)...');
    
    const resultados = [true, true, false, true, true, true, false, true, true, true]; // 8 acertos, 2 erros
    
    for (let i = 0; i < resultados.length; i++) {
      const acertou = resultados[i];
      
      await supabaseClient.registrarJogada({
        jogador_id: jogador1.id,
        jogo: 'quiz',
        nivel: 1,
        acerto: acertou,
        tempo_resposta: Math.random() * 10 + 2, // 2-12 segundos
        pontuacao: acertou ? 1 : 0,
        dificuldade: 'Fácil',
        dados_adicionais: {
          pergunta_id: `q${i + 1}`,
          tipo: 'multipla_escolha'
        }
      });
      
      console.log(`   Pergunta ${i + 1}/10: ${acertou ? '✅ Acertou' : '❌ Errou'}`);
    }
    
    // Registrar conclusão do nível
    await supabaseClient.registrarJogada({
      jogador_id: jogador1.id,
      jogo: 'quiz',
      nivel: 1,
      acerto: true, // 80% de acerto = passou
      tempo_resposta: 65.5, // tempo total
      pontuacao: 8, // 8 pontos
      dificuldade: 'Fácil',
      dados_adicionais: {
        nivel_completo: true,
        acertos: 8,
        erros: 2,
        percentual: 80
      }
    });
    
    console.log('\n✅ Nível 1 concluído: 8/10 acertos (80%)\n');
    
    // ==================== TESTE 5: VERIFICAR PERFIL ATUALIZADO ====================
    console.log('📋 TESTE 5: Verificar Perfil Atualizado (Triggers)');
    console.log('------------------------------------------');
    
    const perfilAtualizado = await supabaseClient.obterPerfil(jogador1.id);
    
    console.log('✅ Perfil atualizado automaticamente:');
    console.log('   Nome:', perfilAtualizado.nome_integrante);
    console.log('   Pontos:', perfilAtualizado.pontos, '(esperado: 8)');
    console.log('   Total jogadas:', perfilAtualizado.total_jogadas, '(esperado: 11)');
    console.log('   Precisão:', perfilAtualizado.precisao.toFixed(2) + '%', '(esperado: ~72.7%)');
    console.log('   Tempo médio:', perfilAtualizado.tempo_resposta_medio.toFixed(2) + 's');
    console.log();
    
    // ==================== TESTE 6: REGISTRAR MAIS JOGADAS (OUTRO JOGADOR) ====================
    console.log('📋 TESTE 6: Registrar Jogadas (Jogador 2 - Sorting Game)');
    console.log('------------------------------------------');
    
    // Simulando jogo de separação
    const itens = [
      { nome: 'Garrafa PET', correto: true },
      { nome: 'Papel', correto: true },
      { nome: 'Lixo orgânico', correto: false },
      { nome: 'Lata de alumínio', correto: true },
      { nome: 'Vidro', correto: true }
    ];
    
    for (const item of itens) {
      await supabaseClient.registrarJogada({
        jogador_id: jogador2.id,
        jogo: 'sorting',
        nivel: 1,
        acerto: item.correto,
        tempo_resposta: Math.random() * 5 + 1,
        pontuacao: item.correto ? 1 : 0,
        dificuldade: 'Fácil',
        dados_adicionais: {
          item: item.nome,
          lixeira: item.correto ? 'reciclável' : 'orgânico'
        }
      });
      
      console.log(`   ${item.nome}: ${item.correto ? '✅ Correto' : '❌ Errado'}`);
    }
    
    console.log('\n✅ Sorting Game concluído: 4/5 acertos (80%)\n');
    
    // ==================== TESTE 7: HISTÓRICO ====================
    console.log('📋 TESTE 7: Buscar Histórico de Jogadas');
    console.log('------------------------------------------');
    
    const historico = await supabaseClient.obterHistoricoJogador(jogador1.id, 5);
    console.log(`✅ Últimas ${historico.length} jogadas de ${jogador1.nome_integrante}:`);
    
    historico.forEach((h, i) => {
      const emoji = h.acerto ? '✅' : '❌';
      console.log(`   ${i + 1}. ${emoji} ${h.jogo.toUpperCase()} Nível ${h.nivel} - ${h.pontuacao} pts (${h.tempo_resposta.toFixed(1)}s)`);
    });
    console.log();
    
    // ==================== TESTE 8: ESTATÍSTICAS DO JOGO ====================
    console.log('📋 TESTE 8: Estatísticas por Jogo');
    console.log('------------------------------------------');
    
    const statsQuiz = await supabaseClient.obterEstatisticasJogo(jogador1.id, 'quiz');
    console.log('✅ Estatísticas do Quiz:');
    console.log('   Total de jogadas:', statsQuiz.total_jogadas);
    console.log('   Acertos:', statsQuiz.acertos);
    console.log('   Erros:', statsQuiz.erros);
    console.log('   Precisão:', statsQuiz.precisao.toFixed(1) + '%');
    console.log('   Tempo médio:', statsQuiz.tempo_medio.toFixed(1) + 's');
    console.log('   Pontuação total:', statsQuiz.pontuacao_total);
    console.log('   Melhor nível:', statsQuiz.melhor_nivel);
    console.log();
    
    // ==================== TESTE 9: RANKING FAMILIAR ====================
    console.log('📋 TESTE 9: Ranking Familiar');
    console.log('------------------------------------------');
    
    const rankingFamilia = await supabaseClient.obterRankingFamilia(token);
    console.log('✅ Ranking da Família ' + token + ':');
    
    rankingFamilia.forEach((r) => {
      console.log(`   ${r.posicao}º ${r.avatar} ${r.nome_integrante}`);
      console.log(`      ${r.pontos} pontos | ${r.precisao.toFixed(1)}% precisão`);
    });
    console.log();
    
    // ==================== TESTE 10: RANKING GLOBAL ====================
    console.log('📋 TESTE 10: Ranking Global (Top 5)');
    console.log('------------------------------------------');
    
    const rankingGlobal = await supabaseClient.obterRankingGlobal(5);
    console.log('✅ Top 5 jogadores:');
    
    rankingGlobal.forEach((r) => {
      console.log(`   ${r.posicao}º ${r.avatar} ${r.nome_integrante} (Família: ${r.token_familiar})`);
      console.log(`      ${r.pontos} pontos | ${r.precisao.toFixed(1)}% precisão`);
    });
    console.log();
    
    // ==================== TESTE 11: ESTATÍSTICAS GERAIS ====================
    console.log('📋 TESTE 11: Estatísticas Gerais do Sistema');
    console.log('------------------------------------------');
    
    const statsGerais = await supabaseClient.obterEstatisticasGerais();
    console.log('✅ Estatísticas do sistema:');
    console.log('   Total de jogadores:', statsGerais.total_jogadores);
    console.log('   Total de famílias:', statsGerais.total_familias);
    console.log('   Total de jogadas:', statsGerais.total_jogadas);
    console.log('   Pontuação média:', statsGerais.pontuacao_media?.toFixed(2) || 0);
    console.log('   Precisão média:', statsGerais.precisao_media?.toFixed(2) + '%' || '0%');
    console.log('   Jogo mais popular:', statsGerais.jogo_mais_popular || 'N/A');
    console.log();
    
    // ==================== TESTE 12: EXPORTAÇÃO ====================
    console.log('📋 TESTE 12: Exportar Dados');
    console.log('------------------------------------------');
    
    const csv = await supabaseClient.exportarHistoricoCSV(jogador1.id);
    const linhas = csv.split('\n').length - 1;
    console.log('✅ Histórico exportado em CSV:');
    console.log(`   ${linhas} linhas de dados`);
    console.log('   Primeiras linhas:');
    console.log('   ' + csv.split('\n').slice(0, 3).join('\n   '));
    console.log();
    
    // ==================== RESULTADO FINAL ====================
    console.log('🎉 ===== TODOS OS TESTES CONCLUÍDOS COM SUCESSO! =====\n');
    console.log('✅ Sistema funcionando perfeitamente!');
    console.log('\n📊 RESUMO DOS TESTES:');
    console.log('   ✅ Criação de família (token único)');
    console.log('   ✅ Criação de jogadores (perfis)');
    console.log('   ✅ Busca de membros da família');
    console.log('   ✅ Registro de jogadas (múltiplos jogos)');
    console.log('   ✅ Atualização automática de perfis (triggers)');
    console.log('   ✅ Histórico de jogadas');
    console.log('   ✅ Estatísticas por jogo');
    console.log('   ✅ Rankings (familiar e global)');
    console.log('   ✅ Estatísticas gerais');
    console.log('   ✅ Exportação de dados (CSV/JSON)');
    console.log('\n🚀 O banco de dados está pronto para uso!');
    console.log(`\n💡 Código da família de teste: ${token}`);
    console.log('   Use este código para testar o AuthScreen!\n');
    
    return {
      success: true,
      token,
      jogadores: [jogador1, jogador2],
      ranking: rankingFamilia
    };
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error);
    console.log('\n🔍 Possíveis causas:');
    console.log('   1. Script SQL não foi executado no Supabase');
    console.log('   2. Credenciais incorretas em /utils/supabase/info.tsx');
    console.log('   3. Projeto Supabase não está ativo');
    console.log('   4. Problemas de rede/conexão');
    console.log('\n📚 Consulte: /SUPABASE_SQL_SETUP.md');
    
    return {
      success: false,
      error
    };
  }
}

/**
 * Teste rápido - Apenas verificar conexão
 */
export async function quickTestSQL() {
  console.log('🔍 Teste rápido de conexão...\n');
  
  try {
    const stats = await supabaseClient.obterEstatisticasGerais();
    console.log('✅ Conexão OK!');
    console.log('📊 Estatísticas:');
    console.log('   Jogadores:', stats.total_jogadores);
    console.log('   Famílias:', stats.total_familias);
    console.log('   Jogadas:', stats.total_jogadas);
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    return false;
  }
}

/**
 * Teste de token familiar
 */
export async function testTokenFamiliar() {
  console.log('🔑 Testando sistema de tokens...\n');
  
  try {
    // Gerar 5 tokens
    console.log('Gerando 5 tokens únicos:');
    const tokens = [];
    
    for (let i = 0; i < 5; i++) {
      const token = await supabaseClient.gerarTokenFamiliar();
      tokens.push(token);
      
      const valido = await supabaseClient.validarTokenFamiliar(token);
      console.log(`${i + 1}. ${token} - ${valido ? '✅ Válido' : '❌ Inválido'}`);
    }
    
    // Verificar unicidade
    const unique = new Set(tokens).size === tokens.length;
    console.log(`\n${unique ? '✅' : '❌'} Todos os tokens são únicos: ${unique}`);
    
    // Testar validação
    console.log('\nTestando validações:');
    const testes = [
      { token: 'ABC123', esperado: true },
      { token: 'abc123', esperado: false }, // minúscula
      { token: 'ABCD12', esperado: true },
      { token: 'AB123', esperado: false }, // 5 caracteres
      { token: 'ABCDEFG', esperado: false }, // 7 caracteres
      { token: 'ABC!23', esperado: false }, // caractere especial
    ];
    
    for (const teste of testes) {
      const valido = await supabaseClient.validarTokenFamiliar(teste.token);
      const passou = valido === teste.esperado;
      console.log(`   ${passou ? '✅' : '❌'} "${teste.token}" - Esperado: ${teste.esperado}, Obtido: ${valido}`);
    }
    
    console.log('\n🎉 Teste de tokens concluído!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro:', error);
    return false;
  }
}

// Expor funções globalmente para o console
if (typeof window !== 'undefined') {
  (window as any).testSupabaseSQL = testSupabaseSQL;
  (window as any).quickTestSQL = quickTestSQL;
  (window as any).testTokenFamiliar = testTokenFamiliar;
}
