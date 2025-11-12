import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function DatabaseSetupAlert() {
  return (
    <Card className="border-4 border-orange-300 bg-orange-50/80 backdrop-blur-sm shadow-xl">
      <CardContent className="pt-6">
        <Alert variant="destructive" className="border-orange-500 bg-orange-100">
          <AlertTriangle className="h-5 w-5 text-orange-700" />
          <AlertTitle className="text-orange-900 text-lg">⚠️ Configuração Necessária</AlertTitle>
          <AlertDescription className="text-orange-800">
            <div className="space-y-4 mt-3">
              <div className="bg-orange-200/50 border-2 border-orange-400 rounded-lg p-3">
                <p className="font-bold text-orange-900 mb-2">
                  🔴 O banco de dados não está configurado!
                </p>
                <p className="text-sm">
                  Você não conseguirá criar perfis, jogar ou salvar progresso sem configurar o banco de dados Supabase primeiro.
                </p>
              </div>
              
              <div className="bg-white/80 p-4 rounded-lg border-2 border-orange-300 space-y-3">
                <p className="font-bold flex items-center gap-2 text-orange-900">
                  <Database className="w-5 h-5" />
                  Passo a Passo Rápido (5 minutos):
                </p>
                
                <ol className="list-decimal list-inside space-y-2.5 text-sm ml-2">
                  <li className="font-semibold">
                    Acesse <a 
                      href="https://supabase.com/dashboard/project/mnauxgnvtzgslgabxqos/sql/new" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                    >
                      Supabase SQL Editor
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Abra o arquivo <code className="bg-orange-200 px-2 py-0.5 rounded font-mono">supabase/schema.sql</code> deste projeto</li>
                  <li>Copie <strong className="text-orange-900">todo o conteúdo</strong> do arquivo</li>
                  <li>Cole no SQL Editor do Supabase</li>
                  <li>Clique em <strong className="text-green-700 bg-green-100 px-2 py-0.5 rounded">"Run"</strong> (ou pressione Ctrl+Enter)</li>
                  <li>Aguarde aparecer <strong className="text-green-700">"Success"</strong> no canto inferior direito</li>
                  <li>Volte aqui e clique em <strong className="text-blue-700">"Recarregar Página"</strong> abaixo</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
                <p className="text-sm text-blue-900 font-bold mb-1.5">
                  💡 Documentação Completa
                </p>
                <p className="text-sm text-blue-800 space-y-1">
                  <span className="block">• <code className="bg-blue-200 px-2 py-0.5 rounded font-mono">GUIA_RAPIDO_SUPABASE.md</code> - Guia visual passo a passo</span>
                  <span className="block">• <code className="bg-blue-200 px-2 py-0.5 rounded font-mono">INSTRUCOES_SUPABASE.md</code> - Instruções detalhadas com prints</span>
                </p>
              </div>
              
              <div className="flex gap-2 flex-col sm:flex-row">
                <Button
                  onClick={() => window.open('https://supabase.com/dashboard/project/mnauxgnvtzgslgabxqos/sql/new', '_blank')}
                  className="bg-orange-600 hover:bg-orange-700 flex-1 font-semibold"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Abrir Supabase SQL Editor
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-700 hover:bg-blue-100 font-semibold"
                >
                  Recarregar Página
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
