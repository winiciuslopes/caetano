import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { supabaseClient } from '../lib/supabaseClient';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export function TestTokenGeneration() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    token?: string;
    error?: string;
    details?: any;
  } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('Iniciando teste de geração de token...');
      
      // Teste 1: Gerar token
      const token = await supabaseClient.gerarTokenFamiliar();
      console.log('Token gerado:', token);

      // Teste 2: Validar token
      const isValid = await supabaseClient.validarTokenFamiliar(token);
      console.log('Token válido:', isValid);

      // Teste 3: Verificar se token existe
      const existe = await supabaseClient.tokenFamiliarExiste(token);
      console.log('Token existe:', existe);

      setResult({
        success: true,
        token,
        details: {
          tokenGerado: token,
          tokenValido: isValid,
          tokenExiste: existe,
        }
      });
    } catch (err: any) {
      console.error('Erro no teste:', err);
      setResult({
        success: false,
        error: err.message || 'Erro desconhecido',
        details: err
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Teste de Geração de Token
        </CardTitle>
        <CardDescription>
          Teste a geração e validação de tokens familiares
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleTest}
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Executar Teste
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription>
                  {result.success ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-green-800">✅ Teste bem-sucedido!</p>
                      <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                        <p className="text-sm text-green-800 mb-1">Token gerado:</p>
                        <p className="text-xl tracking-widest font-mono text-green-900">
                          {result.token}
                        </p>
                      </div>
                      {result.details && (
                        <div className="text-sm text-gray-700 space-y-1 mt-2">
                          <p>• Token válido: {result.details.tokenValido ? '✅ Sim' : '❌ Não'}</p>
                          <p>• Token existe no DB: {result.details.tokenExiste ? '✅ Sim' : '❌ Não'}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-semibold text-red-800">❌ Erro no teste</p>
                      <p className="text-sm">{result.error}</p>
                      {result.details && (
                        <pre className="text-xs bg-red-50 p-2 rounded mt-2 overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
          <p><strong>O que este teste faz:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Gera um token familiar de 6 caracteres (A-Z, 0-9)</li>
            <li>Valida o formato do token gerado</li>
            <li>Verifica se o token já existe no banco de dados</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
