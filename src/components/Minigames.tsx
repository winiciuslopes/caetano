import { useState, useEffect } from 'react';
import { Brain, Trash2, Truck, Sparkles, Leaf, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { GameCard } from './GameCard';
import { QuizGame } from './QuizGame';
import { SortingGame } from './SortingGame';
import { RouteGame } from './RouteGame';
import { MemoryGame } from './MemoryGame';
import { CompostingGame } from './CompostingGame';
import { usePlayerSupabase } from './PlayerContextSupabase';
import { supabaseClient } from '../lib/supabaseClient';

export function Minigames() {
  const { currentPlayer } = usePlayerSupabase();
  
  const [selectedGame, setSelectedGame] = useState<{
    type: 'quiz' | 'sorting' | 'route' | 'memory' | 'composting' | null;
    difficulty: number;
  }>({ type: null, difficulty: 1 });

  const [expandedGames, setExpandedGames] = useState<{
    quiz: boolean;
    sorting: boolean;
    route: boolean;
    memory: boolean;
    composting: boolean;
  }>({
    quiz: false,
    sorting: false,
    route: false,
    memory: false,
    composting: false
  });

  // Estado para armazenar o progresso carregado do Supabase
  const [progress, setProgress] = useState<{
    quiz: Record<number, number>;
    sorting: Record<number, number>;
    route: Record<number, number>;
    memory: Record<number, number>;
    composting: Record<number, number>;
  }>({
    quiz: {},
    sorting: {},
    route: {},
    memory: {},
    composting: {}
  });

  const [lockedLevels, setLockedLevels] = useState<{
    quiz: Set<number>;
    sorting: Set<number>;
    route: Set<number>;
    memory: Set<number>;
    composting: Set<number>;
  }>({
    quiz: new Set(),
    sorting: new Set(),
    route: new Set(),
    memory: new Set(),
    composting: new Set()
  });

  const [loading, setLoading] = useState(true);

  // Carregar progresso do Supabase quando o componente montar ou jogador mudar
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const progressData = await supabaseClient.obterProgressoCompleto(currentPlayer.id);
        setProgress(progressData);

        // Calcular níveis bloqueados para cada jogo
        const newLockedLevels: any = {
          quiz: new Set(),
          sorting: new Set(),
          route: new Set(),
          memory: new Set(),
          composting: new Set()
        };

        const games: ('quiz' | 'sorting' | 'route' | 'memory' | 'composting')[] = ['quiz', 'sorting', 'route', 'memory', 'composting'];
        
        for (const game of games) {
          for (let level = 1; level <= 10; level++) {
            const isUnlocked = await supabaseClient.verificarNivelDesbloqueado(
              currentPlayer.id,
              game,
              level
            );
            if (!isUnlocked) {
              newLockedLevels[game].add(level);
            }
          }
        }

        setLockedLevels(newLockedLevels);
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [currentPlayer.id]);

  // Get progress from loaded state
  const quizProgress = progress.quiz;
  const sortingProgress = progress.sorting;
  const routeProgress = progress.route;
  const memoryProgress = progress.memory;
  const compostingProgress = progress.composting;

  const toggleExpand = (game: keyof typeof expandedGames) => {
    setExpandedGames(prev => ({
      ...prev,
      [game]: !prev[game]
    }));
  };

  // Função para recarregar o progresso após completar um jogo
  const handleGameComplete = async () => {
    setSelectedGame({ type: null, difficulty: 1 });
    // Recarregar progresso
    try {
      const progressData = await supabaseClient.obterProgressoCompleto(currentPlayer.id);
      setProgress(progressData);

      // Recalcular níveis bloqueados
      const newLockedLevels: any = {
        quiz: new Set(),
        sorting: new Set(),
        route: new Set(),
        memory: new Set(),
        composting: new Set()
      };

      const games: ('quiz' | 'sorting' | 'route' | 'memory' | 'composting')[] = ['quiz', 'sorting', 'route', 'memory', 'composting'];
      
      for (const game of games) {
        for (let level = 1; level <= 10; level++) {
          const isUnlocked = await supabaseClient.verificarNivelDesbloqueado(
            currentPlayer.id,
            game,
            level
          );
          if (!isUnlocked) {
            newLockedLevels[game].add(level);
          }
        }
      }

      setLockedLevels(newLockedLevels);
    } catch (error) {
      console.error('Erro ao recarregar progresso:', error);
    }
  };

  // Render selected game
  if (selectedGame.type === 'quiz') {
    return <QuizGame onBack={handleGameComplete} difficulty={selectedGame.difficulty} />;
  }

  if (selectedGame.type === 'sorting') {
    return <SortingGame onBack={handleGameComplete} difficulty={selectedGame.difficulty} />;
  }

  if (selectedGame.type === 'route') {
    return <RouteGame onBack={handleGameComplete} difficulty={selectedGame.difficulty} />;
  }

  if (selectedGame.type === 'memory') {
    return <MemoryGame onBack={handleGameComplete} difficulty={selectedGame.difficulty} />;
  }

  if (selectedGame.type === 'composting') {
    return <CompostingGame onBack={handleGameComplete} difficulty={selectedGame.difficulty} />;
  }

  // Mostrar loading enquanto carrega o progresso
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando progresso...</p>
        </div>
      </div>
    );
  }

  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Quiz Games */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-green-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex-shrink-0">
              <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-green-900 text-lg md:text-2xl truncate">Quiz de Conhecimento</h2>
              <p className="text-xs md:text-sm text-green-700">Teste seus conhecimentos</p>
            </div>
          </div>
          <Button
            onClick={() => toggleExpand('quiz')}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:bg-green-100 w-full sm:w-auto"
          >
            {expandedGames.quiz ? (
              <>
                <ChevronUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Mais
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {allLevels.slice(0, expandedGames.quiz ? 10 : 3).map(level => (
            <GameCard
              key={`quiz-${level}`}
              title={`Nível ${level}`}
              description={`Quiz ${level === 1 ? 'Básico' : level <= 3 ? 'Fácil' : level <= 5 ? 'Médio' : level <= 7 ? 'Difícil' : 'Expert'}`}
              icon={Brain}
              color={level <= 3 ? '#22c55e' : level <= 6 ? '#eab308' : '#ef4444'}
              level={level}
              maxLevel={10}
              progress={quizProgress[level] || 0}
              onPlay={() => setSelectedGame({ type: 'quiz', difficulty: level })}
              locked={lockedLevels.quiz.has(level)}
            />
          ))}
        </div>
      </div>

      {/* Sorting Games */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-green-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg flex-shrink-0">
              <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-green-900 text-lg md:text-2xl truncate">Separação de Resíduos</h2>
              <p className="text-xs md:text-sm text-green-700">Aprenda a separar corretamente os resíduos</p>
            </div>
          </div>
          <Button
            onClick={() => toggleExpand('sorting')}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:bg-green-100 w-full sm:w-auto"
          >
            {expandedGames.sorting ? (
              <>
                <ChevronUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Mais
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {allLevels.slice(0, expandedGames.sorting ? 10 : 3).map(level => (
            <GameCard
              key={`sorting-${level}`}
              title={`Nível ${level}`}
              description={`Separação ${level <= 3 ? 'Simples' : level <= 6 ? 'Moderada' : 'Complexa'}`}
              icon={Trash2}
              color={level <= 3 ? '#3b82f6' : level <= 6 ? '#eab308' : '#ef4444'}
              level={level}
              maxLevel={10}
              progress={sortingProgress[level] || 0}
              onPlay={() => setSelectedGame({ type: 'sorting', difficulty: level })}
              locked={lockedLevels.sorting.has(level)}
            />
          ))}
        </div>
      </div>

      {/* Route Games */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-green-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg flex-shrink-0">
              <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-green-900 text-lg md:text-2xl truncate">Rota de Coleta</h2>
              <p className="text-xs md:text-sm text-green-700">Otimize rotas de coleta seletiva</p>
            </div>
          </div>
          <Button
            onClick={() => toggleExpand('route')}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:bg-green-100 w-full sm:w-auto"
          >
            {expandedGames.route ? (
              <>
                <ChevronUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Mais
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {allLevels.slice(0, expandedGames.route ? 10 : 3).map(level => (
            <GameCard
              key={`route-${level}`}
              title={`Nível ${level}`}
              description={`${level <= 3 ? 'Poucos pontos' : level <= 6 ? 'Médio' : 'Muitos pontos'}`}
              icon={Truck}
              color={level <= 3 ? '#f97316' : level <= 6 ? '#eab308' : '#ef4444'}
              level={level}
              maxLevel={10}
              progress={routeProgress[level] || 0}
              onPlay={() => setSelectedGame({ type: 'route', difficulty: level })}
              locked={lockedLevels.route.has(level)}
            />
          ))}
        </div>
      </div>

      {/* Memory Games */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-green-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-green-900 text-lg md:text-2xl truncate">Jogo da Memória Ecológica</h2>
              <p className="text-xs md:text-sm text-green-700">Encontre os pares de ícones ambientais</p>
            </div>
          </div>
          <Button
            onClick={() => toggleExpand('memory')}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:bg-green-100 w-full sm:w-auto"
          >
            {expandedGames.memory ? (
              <>
                <ChevronUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Mais
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {allLevels.slice(0, expandedGames.memory ? 10 : 3).map(level => (
            <GameCard
              key={`memory-${level}`}
              title={`Nível ${level}`}
              description={`${level + 4} pares de cartas`}
              icon={Sparkles}
              color={level <= 3 ? '#a855f7' : level <= 6 ? '#ec4899' : '#ef4444'}
              level={level}
              maxLevel={10}
              progress={memoryProgress[level] || 0}
              onPlay={() => setSelectedGame({ type: 'memory', difficulty: level })}
              locked={lockedLevels.memory.has(level)}
            />
          ))}
        </div>
      </div>

      {/* Composting Games */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-green-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg flex-shrink-0">
              <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-green-900 text-lg md:text-2xl truncate">Compostagem Inteligente</h2>
              <p className="text-xs md:text-sm text-green-700">Aprenda sobre compostagem orgânica</p>
            </div>
          </div>
          <Button
            onClick={() => toggleExpand('composting')}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:bg-green-100 w-full sm:w-auto"
          >
            {expandedGames.composting ? (
              <>
                <ChevronUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Mais
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {allLevels.slice(0, expandedGames.composting ? 10 : 3).map(level => (
            <GameCard
              key={`composting-${level}`}
              title={`Nível ${level}`}
              description={`${10 + level * 2} rodadas`}
              icon={Leaf}
              color={level <= 3 ? '#22c55e' : level <= 6 ? '#84cc16' : '#eab308'}
              level={level}
              maxLevel={10}
              progress={compostingProgress[level] || 0}
              onPlay={() => setSelectedGame({ type: 'composting', difficulty: level })}
              locked={lockedLevels.composting.has(level)}
            />
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">Sistema de Progressão</h3>
            <p className="text-green-50 text-sm mb-4">
              Cada minigame possui 10 níveis de dificuldade crescente. Para desbloquear o próximo nível, 
              você precisa atingir pelo menos 90% de acerto no nível anterior. Boa sorte!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
                <span className="text-green-200">●</span> Níveis 1-3: Iniciante
              </div>
              <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
                <span className="text-yellow-200">●</span> Níveis 4-6: Intermediário
              </div>
              <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
                <span className="text-orange-200">●</span> Níveis 7-8: Avançado
              </div>
              <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
                <span className="text-red-200">●</span> Níveis 9-10: Expert
              </div>
              <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
                <span className="text-purple-200">●</span> 5 Minigames
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}