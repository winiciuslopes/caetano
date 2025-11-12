import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle, Loader2, Play } from 'lucide-react';
import testarConexaoSupabase, { TestResult } from '../lib/testSupabase';

export function TesteDoBanco() {
  const [testando, setTestando] = useState(false);
  const [resultados, setResultados] = useState<TestResult[]>([]);
  const [concluido, setConcluido] = useState(false);

  const executarTestes = async () => {
    setTestando(true);
    setConcluido(false);
    setResultados([]);

    try {
      const results = await testarConexaoSupabase();
      setResultados(results);
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setTestando(false);
      setConcluido(true);
    }
  };

  const sucessos = resultados.filter(r => r.sucesso).length;
  const total = resultados.length;
  const percentual = total > 0 ? Math.round((sucessos / total) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Teste do Banco de Dados
          </CardTitle>
          <CardDescription>
            Execute testes automatizados para verificar se o Supabase está configurado corretamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={executarTestes} 
            disabled={testando}
            className="w-full"
          >
            {testando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando testes...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Executar Testes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {concluido && (
        <Alert className={percentual === 100 ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-lg">
                {percentual === 100 ? '✅' : '⚠️'} {sucessos}/{total} testes passaram ({percentual}%)
              </span>
              {percentual === 100 && (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  Banco OK!
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {resultados.length > 0 && (
        <div className="space-y-3">
          {resultados.map((resultado, index) => (
            <Card 
              key={index}
              className={resultado.sucesso ? 'border-green-200' : 'border-red-200'}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {resultado.sucesso ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1" />
                    )}
                    <div>
                      <CardTitle className="text-base">{resultado.nome}</CardTitle>
                      <CardDescription className="mt-1">
                        {resultado.mensagem}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={resultado.sucesso ? "default" : "destructive"}>
                    {resultado.sucesso ? 'OK' : 'FALHOU'}
                  </Badge>
                </div>
              </CardHeader>
              {resultado.dados && (
                <CardContent className="pt-0">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                      Ver detalhes
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(resultado.dados, null, 2)}
                    </pre>
                  </details>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {!testando && resultados.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-gray-500">
            Clique no botão acima para executar os testes do banco de dados.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
