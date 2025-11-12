import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Users, User as UserIcon, Sparkles, Trophy, Recycle, Plus, LogIn, ArrowRight, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { supabaseClient, Perfil } from '../lib/supabaseClient';
import { DatabaseSetupAlert } from './DatabaseSetupAlert';
import { DatabaseStatusBanner } from './DatabaseStatusBanner';

interface AuthScreenProps {
  onLogin: (tokenFamiliar: string, perfil: Perfil, membros: Perfil[]) => void;
}

type Step = 'welcome' | 'create-family' | 'join-family' | 'select-player' | 'create-player';

export function AuthScreenSupabase({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [tokenFamiliar, setTokenFamiliar] = useState('');
  const [membros, setMembros] = useState<Perfil[]>([]);
  
  // Form states
  const [nomeFamilia, setNomeFamilia] = useState('');
  const [codigoFamilia, setCodigoFamilia] = useState('');
  const [nomeJogador, setNomeJogador] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenCopiado, setTokenCopiado] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showDatabaseAlert, setShowDatabaseAlert] = useState(false);

  const avatars = ['👨', '👩', '👦', '👧', '🧑', '👴', '👵', '🧒', '🧕', '👨‍🦰', '👩‍🦰', '👨‍🦱'];
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  
  // Estado de conexão
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean;
    connected: boolean;
    tablesExist: boolean;
    message: string;
    details?: string;
  }>({
    checked: false,
    connected: false,
    tablesExist: false,
    message: ''
  });

  // Verificar conexão ao montar o componente
  useEffect(() => {
    const checkConnection = async () => {
      console.log('🔄 Verificando status do banco de dados...');
      const status = await supabaseClient.verificarConexao();
      setConnectionStatus({
        checked: true,
        connected: status.conectado,
        tablesExist: status.tabelasExistem,
        message: status.mensagem,
        details: status.detalhes
      });
      
      // Se as tabelas não existem, mostrar alerta automaticamente
      if (status.conectado && !status.tabelasExistem) {
        console.warn('⚠️ Tabelas não existem. Usuário precisa executar schema.sql');
        setShowDatabaseAlert(true);
      }
    };
    
    checkConnection();
  }, []);

  // Copiar token para clipboard
  const handleCopyToken = async () => {
    if (tokenFamiliar) {
      try {
        await navigator.clipboard.writeText(tokenFamiliar);
        setTokenCopiado(true);
        setTimeout(() => setTokenCopiado(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar token:', err);
      }
    }
  };

  // Criar nova família
  const handleCreateFamily = async () => {
    if (!nomeFamilia.trim()) {
      setError('Digite o nome da família');
      return;
    }
    
    setLoading(true);
    setError('');
    setShowDatabaseAlert(false);
    setLoadingMessage('Gerando código da família...');
    
    try {
      console.log('🏠 Criando nova família:', nomeFamilia);
      console.log('⏳ Gerando token familiar único...');
      
      // Gerar token familiar único
      const token = await supabaseClient.gerarTokenFamiliar();
      
      console.log('✅ Token gerado com sucesso:', token);
      setLoadingMessage('Código gerado com sucesso!');
      
      setTokenFamiliar(token);
      setMembros([]);
      setStep('create-player');
    } catch (err: any) {
      console.error('Erro ao gerar token:', err);
      const errorMessage = err.message || 'Erro ao criar família. Por favor, tente novamente.';
      setError(errorMessage);
      
      // Mostrar alerta de banco de dados se for erro de conexão
      if (errorMessage.includes('banco de dados') || errorMessage.includes('conexão')) {
        setShowDatabaseAlert(true);
      }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Entrar em família existente
  const handleJoinFamily = async () => {
    if (!codigoFamilia.trim()) {
      setError('Digite o código da família');
      return;
    }
    
    if (codigoFamilia.length !== 6) {
      setError('O código deve ter 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    setShowDatabaseAlert(false);
    
    try {
      const codigo = codigoFamilia.toUpperCase();
      
      // Verificar se o token existe
      const existe = await supabaseClient.tokenFamiliarExiste(codigo);
      
      if (!existe) {
        setError('Código inválido. Verifique e tente novamente.');
        setLoading(false);
        return;
      }
      
      // Buscar membros da família
      const membrosData = await supabaseClient.obterMembrosFamilia(codigo);
      
      setTokenFamiliar(codigo);
      setMembros(membrosData);
      
      if (membrosData.length === 0) {
        setStep('create-player');
      } else {
        setStep('select-player');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar família';
      setError(errorMessage);
      
      // Mostrar alerta de banco de dados se for erro de conexão
      if (errorMessage.includes('banco de dados') || errorMessage.includes('conexão')) {
        setShowDatabaseAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Criar novo jogador
  const handleCreatePlayer = async () => {
    if (!nomeJogador.trim()) {
      setError('Digite o nome do jogador');
      return;
    }
    
    if (!tokenFamiliar) {
      setError('Token familiar não encontrado');
      return;
    }
    
    setLoading(true);
    setError('');
    setShowDatabaseAlert(false);
    setLoadingMessage('Criando seu perfil...');
    
    try {
      console.log('📝 Tentando criar perfil...', { nome: nomeJogador, token: tokenFamiliar });
      
      const novoPerfil = await supabaseClient.criarPerfil(
        nomeJogador.trim(),
        selectedAvatar,
        tokenFamiliar
      );
      
      console.log('✅ Perfil criado com sucesso!', novoPerfil);
      setLoadingMessage('Carregando membros da família...');
      
      // Buscar todos os membros atualizados
      const membrosAtualizados = await supabaseClient.obterMembrosFamilia(tokenFamiliar);
      
      console.log('✅ Login bem-sucedido!');
      onLogin(tokenFamiliar, novoPerfil, membrosAtualizados);
    } catch (err: any) {
      console.error('❌ Erro ao criar perfil:', err);
      const errorMessage = err.message || 'Erro ao criar jogador';
      setError(errorMessage);
      
      // Mostrar alerta de banco de dados para qualquer erro relacionado ao banco
      const isDatabaseError = errorMessage.includes('banco de dados') || 
          errorMessage.includes('banco') ||
          errorMessage.includes('conexão') || 
          errorMessage.includes('Tabela') ||
          errorMessage.includes('tabelas') ||
          errorMessage.includes('não encontrada') ||
          errorMessage.includes('schema.sql') ||
          errorMessage.includes('Não foi possível conectar') ||
          errorMessage.includes('autenticação');
      
      if (isDatabaseError) {
        console.warn('⚠️ Detectado erro de banco de dados. Mostrando alerta de configuração.');
        setShowDatabaseAlert(true);
      }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Selecionar jogador existente
  const handleSelectPlayer = async (perfil: Perfil) => {
    onLogin(tokenFamiliar, perfil, membros);
  };

  // Renderizar tela de boas-vindas
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Header */}
          <div className="text-center mb-6 md:mb-8">
            <Logo size="xl" showText={true} className="justify-center" />
            <p className="text-green-700 mt-3 md:mt-4 text-base md:text-lg px-4">
              Transforme reciclagem em diversão em família!
            </p>
          </div>

          {/* Status do Banco de Dados */}
          {connectionStatus.checked && (
            <DatabaseStatusBanner
              connected={connectionStatus.connected}
              tablesExist={connectionStatus.tablesExist}
              message={connectionStatus.message}
              details={connectionStatus.details}
            />
          )}

          <Card className="shadow-2xl border-4 border-green-300 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-green-800 text-xl md:text-2xl">Bem-vindo ao Recycle Show!</CardTitle>
              <CardDescription className="text-green-600">
                Crie ou entre em uma família para começar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                onClick={() => setStep('create-family')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg text-base md:text-lg py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Nova Família
              </Button>

              <Button
                onClick={() => setStep('join-family')}
                variant="outline"
                className="w-full border-2 border-green-400 text-green-700 hover:bg-green-50 text-base md:text-lg py-6"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Entrar em Família Existente
              </Button>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200 border-2">
              <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4 text-center">
                <Recycle className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-green-600" />
                <p className="text-xs md:text-sm text-green-800 font-semibold">5 Jogos</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200 border-2">
              <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4 text-center">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-yellow-600" />
                <p className="text-xs md:text-sm text-green-800 font-semibold">10 Níveis</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200 border-2">
              <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4 text-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-blue-600" />
                <p className="text-xs md:text-sm text-green-800 font-semibold">Família</p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Info */}
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs md:text-sm text-green-700 px-4">
              Criado para jovens (12-18 anos) e suas famílias
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar tela de criar família
  if (step === 'create-family') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Logo size="lg" showText={true} className="justify-center" />
          </div>

          <Card className="shadow-2xl border-4 border-green-300 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 text-xl md:text-2xl flex items-center justify-center gap-2">
                <Users className="w-6 h-6" />
                Criar Nova Família
              </CardTitle>
              <CardDescription className="text-green-600">
                Escolha um nome para sua família
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {showDatabaseAlert && (
                <div className="mb-4">
                  <DatabaseSetupAlert />
                </div>
              )}

              {error && !showDatabaseAlert && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold">❌ Erro ao criar família</div>
                      <div className="text-sm">{error}</div>
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs space-y-2">
                        <div className="font-semibold">💡 Possíveis soluções:</div>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Verifique sua conexão com a internet</li>
                          <li>Recarregue a página (F5)</li>
                          <li>Verifique se o banco de dados está configurado (consulte INSTRUCOES_SUPABASE.md)</li>
                          <li>Tente novamente em alguns segundos</li>
                        </ol>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="familyName" className="flex items-center gap-2 text-green-800">
                  <Users className="w-4 h-4" />
                  Nome da Família
                </Label>
                <Input
                  id="familyName"
                  placeholder="Ex: Família Silva"
                  value={nomeFamilia}
                  onChange={(e) => setNomeFamilia(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleCreateFamily()}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('welcome')}
                  variant="outline"
                  className="flex-1 border-gray-300"
                  disabled={loading}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleCreateFamily}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={!nomeFamilia.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {loadingMessage || 'Criando...'}
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar tela de entrar em família
  if (step === 'join-family') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Logo size="lg" showText={true} className="justify-center" />
          </div>

          <Card className="shadow-2xl border-4 border-green-300 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 text-xl md:text-2xl flex items-center justify-center gap-2">
                <LogIn className="w-6 h-6" />
                Entrar em Família
              </CardTitle>
              <CardDescription className="text-green-600">
                Digite o código de 6 caracteres da família
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {showDatabaseAlert && (
                <div className="mb-4">
                  <DatabaseSetupAlert />
                </div>
              )}

              {error && !showDatabaseAlert && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="familyCode" className="flex items-center gap-2 text-green-800">
                  <Users className="w-4 h-4" />
                  Código da Família
                </Label>
                <Input
                  id="familyCode"
                  placeholder="Ex: ABC123"
                  value={codigoFamilia}
                  onChange={(e) => setCodigoFamilia(e.target.value.toUpperCase())}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500 text-center uppercase tracking-wider text-xl"
                  maxLength={6}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleJoinFamily()}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('welcome')}
                  variant="outline"
                  className="flex-1 border-gray-300"
                  disabled={loading}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleJoinFamily}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={!codigoFamilia.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar tela de criar jogador
  if (step === 'create-player') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Logo size="lg" showText={true} className="justify-center" />
          </div>

          <Card className="shadow-2xl border-4 border-green-300 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 text-xl md:text-2xl flex items-center justify-center gap-2">
                <UserIcon className="w-6 h-6" />
                Criar Jogador
              </CardTitle>
              <div className="text-green-600 space-y-2">
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 mt-2">
                  <p className="text-xs text-green-700 mb-1">Código da Família</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-2xl tracking-widest text-green-900">{tokenFamiliar}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyToken}
                      className="h-8 w-8 p-0 hover:bg-green-200"
                    >
                      {tokenCopiado ? (
                        <Check className="w-4 h-4 text-green-700" />
                      ) : (
                        <Copy className="w-4 h-4 text-green-700" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Guarde este código para outros membros entrarem!</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {showDatabaseAlert && (
                <div className="mb-4">
                  <DatabaseSetupAlert />
                </div>
              )}

              {error && !showDatabaseAlert && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="playerName" className="flex items-center gap-2 text-green-800">
                  <UserIcon className="w-4 h-4" />
                  Nome do Jogador
                </Label>
                <Input
                  id="playerName"
                  placeholder="Digite seu nome"
                  value={nomeJogador}
                  onChange={(e) => setNomeJogador(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleCreatePlayer()}
                  disabled={loading}
                />
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <Label className="text-green-800">Escolha seu Avatar</Label>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      disabled={loading}
                      className={`p-3 md:p-4 text-2xl md:text-3xl rounded-xl border-2 transition-all ${
                        selectedAvatar === avatar
                          ? 'border-green-500 bg-green-100 scale-110 shadow-lg'
                          : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {membros.length > 0 && (
                  <Button
                    onClick={() => setStep('select-player')}
                    variant="outline"
                    className="flex-1 border-gray-300"
                    disabled={loading}
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleCreatePlayer}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={!nomeJogador.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Começar a Jogar!
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar tela de selecionar jogador
  if (step === 'select-player') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Logo size="lg" showText={true} className="justify-center" />
          </div>

          <Card className="shadow-2xl border-4 border-green-300 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 text-xl md:text-2xl">
                Quem está jogando?
              </CardTitle>
              <CardDescription className="text-green-600">
                Código da Família: <strong className="text-green-800">{tokenFamiliar}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Lista de jogadores */}
              <div className="space-y-2">
                {membros.map((membro) => (
                  <Button
                    key={membro.id}
                    onClick={() => handleSelectPlayer(membro)}
                    variant="outline"
                    className="w-full h-auto p-4 border-2 border-green-300 hover:bg-green-50 hover:border-green-500 transition-all"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="text-3xl">{membro.avatar}</div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-green-800">{membro.nome_integrante}</p>
                        <p className="text-sm text-green-600">
                          {membro.pontos} pontos • {membro.precisao.toFixed(0)}% precisão
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-green-600" />
                    </div>
                  </Button>
                ))}
              </div>

              {/* Adicionar novo jogador */}
              <Button
                onClick={() => setStep('create-player')}
                variant="outline"
                className="w-full border-2 border-dashed border-green-400 text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Novo Jogador
              </Button>

              <Button
                onClick={() => setStep('welcome')}
                variant="ghost"
                className="w-full text-gray-600"
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
