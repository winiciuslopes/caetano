// ✅ VERSÃO MIGRADA PARA SUPABASE SQL
// Este é um exemplo de como o AuthScreen deve ser após a migração

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Users, User as UserIcon, Sparkles, Leaf, Trophy, Recycle, Plus, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { Alert, AlertDescription } from './ui/alert';
import { supabaseClient, Perfil } from '../lib/supabaseClient';
import { toast } from 'sonner@2.0.3';

interface AuthScreenProps {
  onLogin: (token: string, perfil: Perfil) => void;
}

type Step = 'welcome' | 'create-family' | 'join-family' | 'select-player' | 'create-player';

export function AuthScreenNew({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [familyToken, setFamilyToken] = useState('');
  const [membros, setMembros] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const avatars = ['👨', '👩', '👦', '👧', '🧑', '👴', '👵', '🧒', '🧕', '👨‍🦰', '👩‍🦰', '👨‍🦱'];
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  // ==================== CRIAR FAMÍLIA ====================
  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      setError('Digite o nome da família');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Gerar token único de 6 caracteres
      const token = await supabaseClient.gerarTokenFamiliar();
      
      setFamilyToken(token);
      setStep('create-player');
      
      // Mostrar token para o usuário guardar
      toast.success(`Família criada! Código: ${token}`, {
        description: 'Guarde este código para que outros membros possam entrar',
        duration: 10000,
      });
      
    } catch (err) {
      console.error('Erro ao criar família:', err);
      setError('Erro ao criar família. Tente novamente.');
      toast.error('Erro ao criar família');
    } finally {
      setLoading(false);
    }
  };

  // ==================== ENTRAR EM FAMÍLIA ====================
  const handleJoinFamily = async () => {
    if (!familyCode.trim()) {
      setError('Digite o código da família');
      return;
    }
    
    const codigo = familyCode.trim().toUpperCase();
    
    // Validar formato (6 caracteres)
    if (codigo.length !== 6) {
      setError('O código deve ter exatamente 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Verificar se token existe
      const existe = await supabaseClient.tokenFamiliarExiste(codigo);
      
      if (!existe) {
        setError('Código inválido. Verifique e tente novamente.');
        toast.error('Código não encontrado');
        setLoading(false);
        return;
      }
      
      // Buscar membros da família
      const membros = await supabaseClient.obterMembrosFamilia(codigo);
      
      setFamilyToken(codigo);
      setMembros(membros);
      
      if (membros.length === 0) {
        // Primeira pessoa da família
        setStep('create-player');
        toast.success('Família encontrada! Crie seu perfil.');
      } else {
        // Já existem membros
        setStep('select-player');
        toast.success(`Família encontrada! ${membros.length} membro(s)`);
      }
      
    } catch (err) {
      console.error('Erro ao buscar família:', err);
      setError('Erro ao buscar família. Tente novamente.');
      toast.error('Erro ao buscar família');
    } finally {
      setLoading(false);
    }
  };

  // ==================== CRIAR JOGADOR ====================
  const handleCreatePlayer = async () => {
    if (!playerName.trim()) {
      setError('Digite o nome do jogador');
      return;
    }
    
    if (!familyToken) {
      setError('Token familiar não encontrado');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Criar perfil no banco
      const perfil = await supabaseClient.criarPerfil(
        playerName.trim(),
        selectedAvatar,
        familyToken
      );
      
      toast.success(`Bem-vindo, ${perfil.nome_integrante}!`);
      
      // Login automático
      onLogin(familyToken, perfil);
      
    } catch (err) {
      console.error('Erro ao criar jogador:', err);
      setError('Erro ao criar jogador. Tente novamente.');
      toast.error('Erro ao criar jogador');
    } finally {
      setLoading(false);
    }
  };

  // ==================== SELECIONAR JOGADOR ====================
  const handleSelectPlayer = (perfil: Perfil) => {
    toast.success(`Bem-vindo de volta, ${perfil.nome_integrante}!`);
    onLogin(familyToken, perfil);
  };

  // ==================== RENDERIZAÇÃO ====================

  // Tela de boas-vindas
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
                disabled={loading}
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Nova Família
              </Button>

              <Button
                onClick={() => setStep('join-family')}
                variant="outline"
                className="w-full border-2 border-green-400 text-green-700 hover:bg-green-50 text-base md:text-lg py-6"
                disabled={loading}
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

  // Tela de criar família
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
                Um código único será gerado para sua família
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="familyName">Nome da Família</Label>
                <Input
                  id="familyName"
                  placeholder="Ex: Família Silva"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFamily()}
                  disabled={loading}
                  className="border-2 border-green-200 focus:border-green-400"
                />
                <p className="text-xs text-green-600">
                  Este nome é apenas para identificação visual
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCreateFamily}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Código e Continuar
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setStep('welcome')}
                  variant="outline"
                  className="w-full border-2 border-gray-300"
                  disabled={loading}
                >
                  Voltar
                </Button>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700 text-center">
                  💡 O código gerado terá 6 caracteres (ex: ABC123)<br/>
                  Compartilhe com os membros da família para que possam entrar!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela de entrar em família
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
                Digite o código de 6 caracteres da sua família
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="familyCode">Código da Família</Label>
                <Input
                  id="familyCode"
                  placeholder="ABC123"
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinFamily()}
                  maxLength={6}
                  disabled={loading}
                  className="border-2 border-green-200 focus:border-green-400 text-center uppercase tracking-widest text-2xl"
                />
                <p className="text-xs text-green-600 text-center">
                  6 caracteres (letras e números)
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleJoinFamily}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  disabled={loading || familyCode.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Entrar
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setStep('welcome')}
                  variant="outline"
                  className="w-full border-2 border-gray-300"
                  disabled={loading}
                >
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela de selecionar jogador
  if (step === 'select-player') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Logo size="lg" showText={true} className="justify-center" />
            <div className="mt-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block border-2 border-green-300">
              <p className="text-sm text-green-700">
                Código: <span className="font-mono font-bold text-lg tracking-wider">{familyToken}</span>
              </p>
            </div>
          </div>

          <Card className="shadow-2xl border-4 border-green-300 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 text-xl md:text-2xl">Selecione seu Perfil</CardTitle>
              <CardDescription className="text-green-600">
                Quem está jogando hoje?
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {membros.map((perfil) => (
                <Button
                  key={perfil.id}
                  onClick={() => handleSelectPlayer(perfil)}
                  variant="outline"
                  className="w-full h-auto py-4 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-3xl">{perfil.avatar}</span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-green-800">{perfil.nome_integrante}</p>
                      <p className="text-xs text-green-600">
                        {perfil.pontos} pontos • {perfil.total_jogadas} jogadas • {perfil.precisao.toFixed(1)}% precisão
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-600" />
                  </div>
                </Button>
              ))}

              <div className="pt-2 space-y-2">
                <Button
                  onClick={() => setStep('create-player')}
                  variant="outline"
                  className="w-full border-2 border-dashed border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Novo Perfil
                </Button>

                <Button
                  onClick={() => {
                    setStep('welcome');
                    setFamilyToken('');
                    setMembros([]);
                  }}
                  variant="ghost"
                  className="w-full text-gray-600"
                >
                  Sair da Família
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela de criar jogador
  if (step === 'create-player') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Logo size="lg" showText={true} className="justify-center" />
            {familyToken && (
              <div className="mt-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block border-2 border-green-300">
                <p className="text-sm text-green-700">
                  Código: <span className="font-mono font-bold text-lg tracking-wider">{familyToken}</span>
                </p>
              </div>
            )}
          </div>

          <Card className="shadow-2xl border-4 border-green-300 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-green-800 text-xl md:text-2xl flex items-center justify-center gap-2">
                <UserIcon className="w-6 h-6" />
                Criar Perfil
              </CardTitle>
              <CardDescription className="text-green-600">
                Personalize seu jogador
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="playerName">Nome do Jogador</Label>
                <Input
                  id="playerName"
                  placeholder="Ex: João"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreatePlayer()}
                  disabled={loading}
                  className="border-2 border-green-200 focus:border-green-400"
                />
              </div>

              <div className="space-y-2">
                <Label>Escolha seu Avatar</Label>
                <div className="grid grid-cols-6 gap-2">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`
                        text-3xl p-3 rounded-lg border-2 transition-all
                        ${selectedAvatar === avatar 
                          ? 'border-green-500 bg-green-100 scale-110 shadow-lg' 
                          : 'border-green-200 hover:border-green-300 hover:bg-green-50'
                        }
                      `}
                      disabled={loading}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleCreatePlayer}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={loading}
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

                {membros.length > 0 && (
                  <Button
                    onClick={() => setStep('select-player')}
                    variant="outline"
                    className="w-full border-2 border-gray-300"
                    disabled={loading}
                  >
                    Voltar para Seleção
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
