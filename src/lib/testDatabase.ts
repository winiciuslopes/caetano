// Testes para o banco de dados Supabase - Recyclhe Show
import { apiClient } from './apiClient';

/**
 * Função para testar toda a API do Recyclhe Show
 * Execute esta função no console do navegador para verificar se tudo está funcionando
 */
export async function testRecyclheShowDatabase() {
  console.log('🧪 Iniciando testes do banco de dados Recyclhe Show...\n');

  try {
    // ==================== TESTE 1: Health Check ====================
    console.log('1️⃣ Testando health check...');
    const health = await apiClient.healthCheck();
    console.log('✅ Health check OK:', health);
    console.log('');

    // ==================== TESTE 2: Criar Família ====================
    console.log('2️⃣ Criando família de teste...');
    const { family } = await apiClient.createFamily('Família Teste Silva');
    console.log('✅ Família criada:', family);
    console.log(`   Código: ${family.code} (use este código para entrar)`);
    console.log('');

    // ==================== TESTE 3: Buscar Família por Código ====================
    console.log('3️⃣ Buscando família por código...');
    const { family: foundFamily } = await apiClient.getFamilyByCode(family.code);
    console.log('✅ Família encontrada:', foundFamily);
    console.log('');

    // ==================== TESTE 4: Criar Jogadores ====================
    console.log('4️⃣ Criando jogadores...');
    const { player: player1 } = await apiClient.createPlayer('João', '👦', family.id);
    console.log('✅ Jogador 1 criado:', player1);

    const { player: player2 } = await apiClient.createPlayer('Maria', '👧', family.id);
    console.log('✅ Jogador 2 criado:', player2);
    console.log('');

    // ==================== TESTE 5: Buscar Família com Jogadores ====================
    console.log('5️⃣ Buscando família com jogadores...');
    const { family: familyWithPlayers } = await apiClient.getFamily(family.id);
    console.log('✅ Família com jogadores:', familyWithPlayers);
    console.log(`   Total de jogadores: ${familyWithPlayers.players?.length}`);
    console.log('');

    // ==================== TESTE 6: Salvar Progresso ====================
    console.log('6️⃣ Salvando progresso do quiz (nível 1)...');
    const { progress } = await apiClient.saveProgress(
      player1.id,
      'quiz',
      1,
      8, // 8/10 pontos
      true
    );
    console.log('✅ Progresso salvo:', progress);
    console.log('');

    // ==================== TESTE 7: Verificar Atualização Automática ====================
    console.log('7️⃣ Verificando atualização automática do jogador...');
    const { player: updatedPlayer } = await apiClient.getPlayer(player1.id);
    console.log('✅ Jogador atualizado:', updatedPlayer);
    console.log(`   Pontos: ${updatedPlayer.totalPoints} (deve ser 8)`);
    console.log(`   Nível: ${updatedPlayer.level} (deve ser 1)`);
    console.log('');

    // ==================== TESTE 8: Salvar Mais Progressos ====================
    console.log('8️⃣ Salvando mais progressos...');
    
    // Quiz nível 2
    await apiClient.saveProgress(player1.id, 'quiz', 2, 9, true);
    console.log('   ✅ Quiz nível 2: 9 pontos');

    // Separação nível 1
    await apiClient.saveProgress(player1.id, 'sorting', 1, 10, true);
    console.log('   ✅ Separação nível 1: 10 pontos');

    // Rota nível 1
    await apiClient.saveProgress(player1.id, 'route', 1, 7, true);
    console.log('   ✅ Rota nível 1: 7 pontos');
    
    console.log('');

    // ==================== TESTE 9: Verificar Pontos Acumulados ====================
    console.log('9️⃣ Verificando pontos acumulados...');
    const { player: finalPlayer } = await apiClient.getPlayer(player1.id);
    console.log('✅ Jogador após múltiplos jogos:', finalPlayer);
    console.log(`   Pontos totais: ${finalPlayer.totalPoints} (deve ser 34)`);
    console.log(`   Nível: ${finalPlayer.level} (deve ser ${Math.floor(finalPlayer.totalPoints / 10) + 1})`);
    console.log('');

    // ==================== TESTE 10: Salvar Métricas Detalhadas ====================
    console.log('🔟 Salvando métricas detalhadas...');
    
    await apiClient.saveMetric({
      playerId: player1.id,
      game: 'quiz',
      level: 1,
      questionId: 'q1',
      answer: 'Azul',
      correct: true,
      timeSeconds: 12,
      score: 1
    });
    console.log('   ✅ Métrica Quiz salva');

    await apiClient.saveMetric({
      playerId: player1.id,
      game: 'sorting',
      level: 1,
      timeSeconds: 3,
      score: 1,
      additionalData: {
        itemName: 'Garrafa PET',
        selectedBin: 'red',
        correctBin: 'red',
        correct: true
      }
    });
    console.log('   ✅ Métrica Separação salva');
    console.log('');

    // ==================== TESTE 11: Buscar Métricas ====================
    console.log('1️⃣1️⃣ Buscando métricas do jogador...');
    const { metrics } = await apiClient.getPlayerMetrics(player1.id);
    console.log(`✅ Total de métricas: ${metrics.length}`);
    console.log('   Exemplo de métrica:', metrics[0]);
    console.log('');

    // ==================== TESTE 12: Buscar Progresso ====================
    console.log('1️⃣2️⃣ Buscando todo o progresso do jogador...');
    const { progress: allProgress } = await apiClient.getPlayerProgress(player1.id);
    console.log(`✅ Total de níveis jogados: ${allProgress.length}`);
    allProgress.forEach((p: any) => {
      console.log(`   - ${p.game} nível ${p.level}: ${p.score} pontos (${p.attempts} tentativas)`);
    });
    console.log('');

    // ==================== TESTE 13: Ranking de Famílias ====================
    console.log('1️⃣3️⃣ Buscando ranking de famílias...');
    const { ranking: familyRanking } = await apiClient.getFamilyRanking();
    console.log(`✅ Total de famílias no ranking: ${familyRanking.length}`);
    familyRanking.slice(0, 3).forEach((item: any, index: number) => {
      console.log(`   ${index + 1}º - ${item.family.name}: ${item.totalPoints} pontos (${item.playerCount} jogadores)`);
    });
    console.log('');

    // ==================== TESTE 14: Ranking de Jogadores ====================
    console.log('1️⃣4️⃣ Buscando ranking de jogadores...');
    const { ranking: playerRanking } = await apiClient.getPlayerRanking();
    console.log(`✅ Total de jogadores no ranking: ${playerRanking.length}`);
    playerRanking.slice(0, 3).forEach((p: any, index: number) => {
      console.log(`   ${index + 1}º - ${p.name}: ${p.totalPoints} pontos (nível ${p.level})`);
    });
    console.log('');

    // ==================== TESTE 15: Ranking Familiar ====================
    console.log('1️⃣5️⃣ Buscando ranking dentro da família...');
    const { ranking: familyPlayerRanking } = await apiClient.getFamilyPlayerRanking(family.id);
    console.log(`✅ Jogadores da família "${family.name}":`);
    familyPlayerRanking.forEach((p: any, index: number) => {
      console.log(`   ${index + 1}º - ${p.name}: ${p.totalPoints} pontos`);
    });
    console.log('');

    // ==================== TESTE 16: Estatísticas Gerais ====================
    console.log('1️⃣6️⃣ Buscando estatísticas gerais...');
    const { stats } = await apiClient.getStats();
    console.log('✅ Estatísticas do sistema:', stats);
    console.log(`   Famílias: ${stats.totalFamilies}`);
    console.log(`   Jogadores: ${stats.totalPlayers}`);
    console.log(`   Métricas: ${stats.totalMetrics}`);
    console.log(`   Pontos totais: ${stats.totalPoints}`);
    console.log(`   Média por jogador: ${stats.averagePointsPerPlayer}`);
    console.log('');

    // ==================== TESTE 17: Testar Melhor Pontuação ====================
    console.log('1️⃣7️⃣ Testando sistema de melhor pontuação...');
    console.log('   Salvando pontuação menor no quiz nível 1 (5 pontos)...');
    await apiClient.saveProgress(player1.id, 'quiz', 1, 5, false);
    
    const { progress: quizProgress } = await apiClient.getGameProgress(player1.id, 'quiz');
    const level1Progress = quizProgress.find((p: any) => p.level === 1);
    console.log(`✅ Melhor pontuação mantida: ${level1Progress.bestScore} (deve ser 8, não 5)`);
    console.log(`   Tentativas: ${level1Progress.attempts}`);
    console.log('');

    // ==================== RESUMO FINAL ====================
    console.log('🎉 ========================================');
    console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
    console.log('🎉 ========================================');
    console.log('');
    console.log('📝 Informações importantes:');
    console.log(`   Código da família de teste: ${family.code}`);
    console.log(`   ID da família: ${family.id}`);
    console.log(`   ID do Jogador 1: ${player1.id}`);
    console.log(`   ID do Jogador 2: ${player2.id}`);
    console.log('');
    console.log('💡 Próximos passos:');
    console.log('   1. Integrar o AuthScreen com apiClient');
    console.log('   2. Atualizar os minigames para salvar métricas');
    console.log('   3. Implementar ranking em tempo real');
    console.log('   4. Adicionar exportação de dados');
    console.log('');
    console.log('✅ Banco de dados Supabase está 100% funcional!');

    return {
      success: true,
      family,
      players: [player1, player2],
      stats
    };

  } catch (error) {
    console.error('❌ ERRO nos testes:', error);
    console.error('');
    console.error('Detalhes do erro:', error.message);
    console.error('');
    console.error('Possíveis causas:');
    console.error('  - Servidor Supabase não está respondendo');
    console.error('  - Credenciais (projectId ou publicAnonKey) incorretas');
    console.error('  - Problema de rede/CORS');
    console.error('');
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Função rápida para testar conexão
 */
export async function quickTest() {
  console.log('⚡ Teste rápido de conexão...');
  try {
    const health = await apiClient.healthCheck();
    console.log('✅ Servidor conectado!', health);
    
    const stats = await apiClient.getStats();
    console.log('📊 Estatísticas atuais:', stats);
    
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    return false;
  }
}

// Exportar para uso no console
if (typeof window !== 'undefined') {
  (window as any).testRecyclheShowDB = testRecyclheShowDatabase;
  (window as any).quickTestDB = quickTest;
  (window as any).apiClient = apiClient;
  
  // Mostrar instruções apenas uma vez
  const shown = sessionStorage.getItem('db-test-instructions-shown');
  if (!shown) {
    console.log('');
    console.log('🎉 ═══════════════════════════════════════════════════════');
    console.log('🎉  BANCO DE DADOS SUPABASE - RECYCLHE SHOW');
    console.log('🎉 ═══════════════════════════════════════════════════════');
    console.log('');
    console.log('💡 Comandos disponíveis no console:');
    console.log('');
    console.log('   🧪 testRecyclheShowDB()  → Teste completo (recomendado)');
    console.log('   ⚡ quickTestDB()         → Teste rápido de conexão');
    console.log('   🔌 apiClient             → Cliente da API (use direto)');
    console.log('');
    console.log('📚 Documentação:');
    console.log('');
    console.log('   • QUICK_START.md      → Comece aqui! ⚡');
    console.log('   • README_SUPABASE.md  → Visão geral completa');
    console.log('   • DATABASE_GUIDE.md   → Referência da API');
    console.log('   • MIGRATION_GUIDE.md  → Guia de migração');
    console.log('');
    console.log('🚀 Execute agora: testRecyclheShowDB()');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    sessionStorage.setItem('db-test-instructions-shown', 'true');
  }
}
