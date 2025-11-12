import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, CheckCircle, XCircle, Database, ExternalLink, FileSearch, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { executarDiagnosticoCompleto, gerarRelatorioTexto, ResultadoDiagnostico } from '../lib/diagnostico';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface DatabaseStatusBannerProps {
  connected: boolean;
  tablesExist: boolean;
  message: string;
  details?: string;
}

export function DatabaseStatusBanner({ connected, tablesExist, message, details }: DatabaseStatusBannerProps) {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<ResultadoDiagnostico[]>([]);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const handleRunDiagnostic = async () => {
    setDiagnosticLoading(true);
    setShowDiagnostic(true);
    
    try {
      const results = await executarDiagnosticoCompleto();
      setDiagnosticResults(results);
    } catch (err) {
      console.error('Erro ao executar diagnóstico:', err);
    } finally {
      setDiagnosticLoading(false);
    }
  };

  const handleCopyReport = () => {
    const relatorio = gerarRelatorioTexto(diagnosticResults);
    navigator.clipboard.writeText(relatorio).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    });
  };

  if (tablesExist) {
    // Tudo OK - não mostrar nada ou mostrar sucesso discreto
    return null;
  }

  if (!connected) {
    // Sem conexão
    return (
      <div className="mb-4">
        <Alert variant="destructive" className="border-red-500 bg-red-50 border-2">
          <XCircle className="h-5 w-5" />
          <AlertTitle className="text-red-900">🔴 Problema de Conexão</AlertTitle>
          <AlertDescription className="text-red-800">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">{message}</p>
                {details && (
                  <p className="text-xs mt-1 bg-red-100 p-2 rounded border border-red-300">
                    <strong>Detalhes:</strong> {details}
                  </p>
                )}
              </div>
              
              <div className="bg-white/60 border border-red-300 rounded-lg p-3 space-y-2">
                <p className="text-sm font-semibold">🔍 Possíveis Causas:</p>
                <ul className="text-xs space-y-1.5 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 min-w-[16px]">•</span>
                    <span><strong>Internet:</strong> Sem conexão ou instável</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 min-w-[16px]">•</span>
                    <span><strong>Firewall:</strong> Bloqueando acesso a supabase.co</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 min-w-[16px]">•</span>
                    <span><strong>Bloqueadores:</strong> AdBlock ou extensões interferindo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 min-w-[16px]">•</span>
                    <span><strong>Credenciais:</strong> API Key incorreta ou expirada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 min-w-[16px]">•</span>
                    <span><strong>Timeout:</strong> Resposta demorou mais de 10 segundos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/60 border border-red-300 rounded-lg p-3 space-y-2">
                <p className="text-sm font-semibold">💡 Soluções:</p>
                <ol className="text-xs space-y-1.5 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">1.</span>
                    <span>Verifique se está conectado à internet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">2.</span>
                    <span>Desative temporariamente bloqueadores de anúncios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">3.</span>
                    <span>Abra o console do navegador (F12) e veja se há erros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">4.</span>
                    <span>Verifique se o projeto Supabase está ativo no dashboard</span>
                  </li>
                </ol>
              </div>
              
              <div className="flex gap-2 flex-col sm:flex-row">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
                  size="sm"
                >
                  🔄 Tentar Novamente
                </Button>
                <Button
                  onClick={handleRunDiagnostic}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-700 hover:bg-red-100 text-sm"
                >
                  <FileSearch className="w-3 h-3 mr-2" />
                  Diagnóstico
                </Button>
                <Button
                  onClick={() => window.open('https://supabase.com/dashboard/project/mnauxgnvtzgslgabxqos', '_blank')}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-700 hover:bg-red-100 text-sm"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Dialog de Diagnóstico */}
        <Dialog open={showDiagnostic} onOpenChange={setShowDiagnostic}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSearch className="w-5 h-5" />
                Diagnóstico de Conexão
              </DialogTitle>
              <DialogDescription>
                Análise detalhada de cada etapa da conexão com o Supabase
              </DialogDescription>
            </DialogHeader>

            {diagnosticLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <p className="mt-4 text-sm text-gray-600">Executando diagnóstico...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {diagnosticResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${
                      result.status === 'ok'
                        ? 'bg-green-50 border-green-300'
                        : result.status === 'aviso'
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.status === 'ok' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : result.status === 'aviso' ? (
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-semibold text-sm ${
                            result.status === 'ok'
                              ? 'text-green-900'
                              : result.status === 'aviso'
                              ? 'text-orange-900'
                              : 'text-red-900'
                          }`}>
                            {result.etapa}
                          </h4>
                          {result.tempo !== undefined && (
                            <span className="text-xs text-gray-600 whitespace-nowrap">
                              {result.tempo}ms
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          result.status === 'ok'
                            ? 'text-green-800'
                            : result.status === 'aviso'
                            ? 'text-orange-800'
                            : 'text-red-800'
                        }`}>
                          {result.mensagem}
                        </p>
                        {result.detalhes && (
                          <p className="text-xs mt-2 font-mono bg-white/50 p-2 rounded border break-all">
                            {result.detalhes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {diagnosticResults.length > 0 && (
                  <div className="pt-4 border-t flex gap-2">
                    <Button
                      onClick={handleCopyReport}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {copiedReport ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Relatório
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      🔄 Recarregar Página
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Conectado mas sem tabelas
  return (
    <div className="mb-4">
      <Alert variant="destructive" className="border-orange-500 bg-orange-50 border-2">
        <AlertCircle className="h-5 w-5 text-orange-700" />
        <AlertTitle className="text-orange-900">⚠️ Banco de Dados Não Configurado</AlertTitle>
        <AlertDescription className="text-orange-800">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="font-semibold text-sm">{message}</p>
              {details && <p className="text-xs">{details}</p>}
            </div>

            <div className="bg-white/60 border border-orange-300 rounded-lg p-3 space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Database className="w-4 h-4" />
                Para Começar a Usar:
              </p>
              <ol className="text-xs space-y-1.5 ml-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">1.</span>
                  <span>
                    Clique no botão abaixo para abrir o Supabase SQL Editor
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">2.</span>
                  <span>
                    Copie o conteúdo do arquivo <code className="bg-orange-200 px-1.5 py-0.5 rounded text-xs">supabase/schema.sql</code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">3.</span>
                  <span>
                    Cole no editor e clique em <strong className="text-green-700">"Run"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">4.</span>
                  <span>
                    Volte aqui e recarregue a página
                  </span>
                </li>
              </ol>
            </div>

            <div className="flex gap-2 flex-col sm:flex-row">
              <Button
                onClick={() => window.open('https://supabase.com/dashboard/project/mnauxgnvtzgslgabxqos/sql/new', '_blank')}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-sm"
                size="sm"
              >
                <Database className="w-4 h-4 mr-2" />
                Abrir SQL Editor
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-700 hover:bg-orange-100 text-sm"
              >
                Recarregar
              </Button>
            </div>

            <div className="text-xs text-orange-700 bg-orange-100/50 rounded p-2 border border-orange-200">
              💡 <strong>Ajuda:</strong> Veja o arquivo <code className="bg-orange-200 px-1 py-0.5 rounded">GUIA_RAPIDO_SUPABASE.md</code> para instruções detalhadas
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
