import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trophy, Star, TrendingUp, Award, Target, Download, Sparkles, Leaf, Zap } from 'lucide-react';
import { usePlayerSupabase } from './PlayerContextSupabase';
import { supabaseClient, HistoricoJogada } from '../lib/supabaseClient';

export function UserProfile() {
  const { currentPlayer } = usePlayerSupabase();
  const user = currentPlayer;
  const [metrics, setMetrics] = useState<HistoricoJogada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const historico = await supabaseClient.obterHistoricoJogador(user.id, 1000);
        setMetrics(historico);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadMetrics();
    }
  }, [user?.id]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const correctAnswers = metrics.filter(m => m.acerto).length;
  const totalAnswers = metrics.length;
  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
  const averageTime = totalAnswers > 0 
    ? metrics.reduce((sum, m) => sum + m.tempo_resposta, 0) / totalAnswers 
    : 0;

  // Analyze performance by difficulty based on Supabase data
  const performanceByDifficulty = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 }
  };

  metrics.forEach(m => {
    // Mapear pela coluna dificuldade ou pelo nivel
    let category: 'easy' | 'medium' | 'hard' = 'easy';
    
    if (m.dificuldade) {
      // Usar coluna dificuldade se disponível
      if (m.dificuldade === 'Fácil') category = 'easy';
      else if (m.dificuldade === 'Médio') category = 'medium';
      else if (m.dificuldade === 'Difícil') category = 'hard';
    } else {
      // Fallback: mapear por nível
      if (m.nivel >= 1 && m.nivel <= 3) category = 'easy';
      else if (m.nivel >= 4 && m.nivel <= 7) category = 'medium';
      else if (m.nivel >= 8 && m.nivel <= 10) category = 'hard';
    }
    
    performanceByDifficulty[category].total++;
    if (m.acerto) performanceByDifficulty[category].correct++;
  });

  // Funções de exportação adaptadas para Supabase
  const exportMetricsAsJSON = async () => {
    try {
      const json = await supabaseClient.exportarHistoricoJSON(user.id);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `metricas_${user.name}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      alert('Erro ao exportar dados. Verifique a conexão com o banco de dados.');
    }
  };

  const exportMetricsAsCSV = async () => {
    try {
      await supabaseClient.downloadHistorico(user.id, 'csv');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar dados. Verifique a conexão com o banco de dados.');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl border-0 overflow-hidden">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-2xl border-4 border-white">
                {user.avatar}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-white text-2xl md:text-3xl mb-1 md:mb-2 truncate">{user.name}</h2>
              <p className="text-green-100 mb-2 md:mb-3 text-sm md:text-base">ID: {user.id.substring(0, 12)}...</p>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-start">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs md:text-sm">
                  <Star className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Nível {user.level}
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs md:text-sm">
                  <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  {user.totalPoints} pts
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="shadow-md border-2 border-green-100">
          <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Pontos</p>
                <p className="text-xl md:text-2xl">{user.totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-2 border-green-100">
          <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Precisão</p>
                <p className="text-xl md:text-2xl">{Math.round(accuracy)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-2 border-green-100">
          <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Jogadas</p>
                <p className="text-xl md:text-2xl">{totalAnswers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-2 border-green-100">
          <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Tempo Médio</p>
                <p className="text-xl md:text-2xl">{averageTime.toFixed(1)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Difficulty */}
      <Card className="shadow-md border-2 border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Desempenho por Dificuldade</CardTitle>
          <CardDescription>Análise de acertos por nível</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Easy */}
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Fácil (Níveis 1-3)</Badge>
                  <span className="text-sm text-gray-600">
                    {performanceByDifficulty.easy.correct}/{performanceByDifficulty.easy.total}
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  {performanceByDifficulty.easy.total > 0
                    ? Math.round((performanceByDifficulty.easy.correct / performanceByDifficulty.easy.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                  style={{
                    width: `${performanceByDifficulty.easy.total > 0
                      ? (performanceByDifficulty.easy.correct / performanceByDifficulty.easy.total) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-600">Médio (Níveis 4-7)</Badge>
                  <span className="text-sm text-gray-600">
                    {performanceByDifficulty.medium.correct}/{performanceByDifficulty.medium.total}
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  {performanceByDifficulty.medium.total > 0
                    ? Math.round((performanceByDifficulty.medium.correct / performanceByDifficulty.medium.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all"
                  style={{
                    width: `${performanceByDifficulty.medium.total > 0
                      ? (performanceByDifficulty.medium.correct / performanceByDifficulty.medium.total) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-600">Difícil (Níveis 8-10)</Badge>
                  <span className="text-sm text-gray-600">
                    {performanceByDifficulty.hard.correct}/{performanceByDifficulty.hard.total}
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  {performanceByDifficulty.hard.total > 0
                    ? Math.round((performanceByDifficulty.hard.correct / performanceByDifficulty.hard.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all"
                  style={{
                    width: `${performanceByDifficulty.hard.total > 0
                      ? (performanceByDifficulty.hard.correct / performanceByDifficulty.hard.total) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges/Achievements */}
      <Card className="shadow-md border-2 border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Conquistas Pessoais</CardTitle>
          <CardDescription>Suas medalhas e conquistas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className={`p-3 md:p-4 rounded-lg border-2 text-center transition-all ${
              user.totalPoints >= 10 ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-gray-300 opacity-50'
            }`}>
              <Leaf className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 ${
                user.totalPoints >= 10 ? 'text-green-600' : 'text-gray-400'
              }`} />
              <p className="text-xs md:text-sm font-semibold mb-1">Primeiros Passos</p>
              <p className="text-xs text-gray-600">10 pontos</p>
            </div>

            <div className={`p-3 md:p-4 rounded-lg border-2 text-center transition-all ${
              user.totalPoints >= 50 ? 'bg-blue-50 border-blue-500' : 'bg-gray-100 border-gray-300 opacity-50'
            }`}>
              <Trophy className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 ${
                user.totalPoints >= 50 ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className="text-xs md:text-sm font-semibold mb-1">Reciclador</p>
              <p className="text-xs text-gray-600">50 pontos</p>
            </div>

            <div className={`p-3 md:p-4 rounded-lg border-2 text-center transition-all ${
              user.totalPoints >= 100 ? 'bg-purple-50 border-purple-500' : 'bg-gray-100 border-gray-300 opacity-50'
            }`}>
              <Sparkles className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 ${
                user.totalPoints >= 100 ? 'text-purple-600' : 'text-gray-400'
              }`} />
              <p className="text-xs md:text-sm font-semibold mb-1">Especialista</p>
              <p className="text-xs text-gray-600">100 pontos</p>
            </div>

            <div className={`p-3 md:p-4 rounded-lg border-2 text-center transition-all ${
              accuracy >= 90 ? 'bg-yellow-50 border-yellow-500' : 'bg-gray-100 border-gray-300 opacity-50'
            }`}>
              <Target className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 ${
                accuracy >= 90 ? 'text-yellow-600' : 'text-gray-400'
              }`} />
              <p className="text-xs md:text-sm font-semibold mb-1">Precisão</p>
              <p className="text-xs text-gray-600">90% acertos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="shadow-md border-2 border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Dashboard de Análise</CardTitle>
          <CardDescription>Exporte seus dados de desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={exportMetricsAsJSON}
              variant="outline"
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              disabled={metrics.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar JSON
            </Button>
            <Button
              onClick={exportMetricsAsCSV}
              variant="outline"
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              disabled={metrics.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
          {metrics.length === 0 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <Zap className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm text-amber-800">
                Jogue alguns minigames para gerar dados de análise
              </p>
            </div>
          )}
          {metrics.length > 0 && (
            <div className="mt-4 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-green-800">
                  <strong>{metrics.length}</strong> interações registradas para {user.name}. Os dados incluem: ID do usuário, 
                  perguntas respondidas, respostas fornecidas, resultado (acerto/erro), tempo de resposta e 
                  nível de dificuldade.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
