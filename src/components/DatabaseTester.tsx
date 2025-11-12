import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Database, 
  Check, 
  X, 
  Loader2, 
  Trophy, 
  Download,
  Activity
} from 'lucide-react';
import testarConexaoSupabase, { TestResult } from '../lib/testSupabase';
import { supabaseClient } from '../lib/supabaseClient';

/**
 * Componente visual para testar o banco de dados Supabase
 * Útil para verificar se tudo está funcionando corretamente
 */
export function DatabaseTester() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [resultados, setResultados] = useState<TestResult[]>([]);
  const [stats, setStats] = useState<any>(null);

  const handleFullTest = async () => {
    setStatus('testing');
    setMessage('Executando 14 testes automatizados...');
    setResultados([]);
    
    try {
      const results = await testarConexaoSupabase();
      setResultados(results);
      
      const sucessos = results.filter(r => r.sucesso).length;
      const total = results.length;
      
      if (sucessos === total) {
        setStatus('success');
        setMessage(`🎉 Todos os ${total} testes passaram com sucesso!`);
      } else {
        setStatus('error');
        setMessage(`⚠️ ${sucessos}/${total} testes passaram. Verifique os erros abaixo.`);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Erro ao executar testes: ${error.message}`);
    }
  };

  const handleCheckStats = async () => {
    setStatus('testing');
    setMessage('Buscando estatísticas...');
    
    try {
      const estatisticas = await supabaseClient.obterEstatisticasGerais();
      setStats(estatisticas);
      setStatus('success');
      setMessage('📊 Estatísticas carregadas com sucesso!');
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Erro ao buscar estatísticas: ${error.message}`);
    }
  };

  const handleExportSample = async () => {
    if (resultados.length === 0) {
      setMessage('⚠️ Execute o teste completo primeiro');
      return;
    }

    setStatus('testing');
    setMessage('Gerando CSV de exemplo...');
    
    try {
      // Pegar o primeiro perfil criado nos testes
      const perfilTeste = resultados.find(r => r.nome === '3. Criar Perfil')?.dados;
      if (!perfilTeste?.id) {
        throw new Error('Perfil de teste não encontrado');
      }

      await supabaseClient.downloadHistorico(perfilTeste.id, 'csv');
      
      setStatus('success');
      setMessage('✅ CSV exportado com sucesso!');
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Erro na exportação: ${error.message}`);
    }
  };

  const sucessos = resultados.filter(r => r.sucesso).length;
  const total = resultados.length;
  const percentual = total > 0 ? Math.round((sucessos / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-4 border-green-400 bg-white shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Database className="w-10 h-10 text-green-600" />
              <CardTitle className="text-green-800">
                Testador do Banco de Dados
              </CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Verifique se o Supabase está funcionando corretamente
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Status */}
            {status !== 'idle' && (
              <Alert variant={status === 'error' ? 'destructive' : 'default'}>
                <AlertDescription className="flex items-center gap-2">
                  {status === 'testing' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {status === 'success' && <Check className="w-4 h-4" />}
                  {status === 'error' && <X className="w-4 h-4" />}
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleFullTest}
                disabled={status === 'testing'}
                className="bg-green-500 hover:bg-green-600"
              >
                {status === 'testing' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Teste Completo
              </Button>

              <Button
                onClick={handleCheckStats}
                disabled={status === 'testing'}
                variant="outline"
                className="border-purple-300"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Ver Estatísticas
              </Button>

              <Button
                onClick={handleExportSample}
                disabled={status === 'testing' || resultados.length === 0}
                variant="outline"
                className="border-orange-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Amostra
              </Button>
            </div>

            {/* Results */}
            {resultados.length > 0 && (
              <div className="space-y-4 mt-6">
                {/* Test Results */}
                <Card className="bg-blue-50 border-blue-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Resultados dos Testes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {resultados.map((resultado: TestResult) => (
                        <div key={resultado.nome} className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{resultado.sucesso ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}</span>
                            <div>
                              <p className="text-sm font-semibold">{resultado.nome}</p>
                              <p className="text-xs text-gray-500">{resultado.mensagem}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-600">{resultado.sucesso ? 'Sucesso' : 'Erro'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                {stats && (
                  <Card className="bg-purple-50 border-purple-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Estatísticas do Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{stats.total_familias}</p>
                          <p className="text-xs text-gray-600">Famílias</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{stats.total_jogadores}</p>
                          <p className="text-xs text-gray-600">Jogadores</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{stats.total_jogadas}</p>
                          <p className="text-xs text-gray-600">Jogadas</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">{Math.round(stats.pontuacao_media)}</p>
                          <p className="text-xs text-gray-600">Pontos Médios</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-teal-600">{Math.round(stats.precisao_media)}%</p>
                          <p className="text-xs text-gray-600">Precisão Média</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-pink-600">{stats.jogo_mais_popular || 'N/A'}</p>
                          <p className="text-xs text-gray-600">Jogo + Popular</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Instructions */}
            <Card className="bg-yellow-50 border-yellow-300 mt-6">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold mb-2">💡 Instruções:</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• <strong>Teste Completo:</strong> Cria família, jogadores e simula jogos (recomendado)</li>
                  <li>• <strong>Ver Estatísticas:</strong> Mostra dados gerais do sistema</li>
                  <li>• <strong>Exportar Amostra:</strong> Baixa CSV com métricas de teste</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-700 mb-3">
              📚 Para mais informações sobre o banco de dados, consulte:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-white">README.md</Badge>
              <Badge variant="outline" className="bg-white">SETUP_RAPIDO.md</Badge>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Ou abra o console (F12) e veja os resultados dos testes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}