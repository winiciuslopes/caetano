import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Users, User as UserIcon, Sparkles, Leaf, Trophy, Recycle, Plus, LogIn, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { 
  Family, 
  Player, 
  createFamily, 
  findFamilyByCode, 
  addPlayerToFamily, 
  setCurrentFamily,
  setCurrentPlayer 
} from '../lib/mockData';
import { Alert, AlertDescription } from './ui/alert';

interface AuthScreenProps {
  onLogin: (family: Family, player: Player) => void;
}

type Step = 'welcome' | 'create-family' | 'join-family' | 'select-player' | 'create-player';

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [currentFamily, setCurrentFamilyState] = useState<Family | null>(null);
  
  // Form states
  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const avatars = ['👨', '👩', '👦', '👧', '🧑', '👴', '👵', '🧒', '🧕', '👨‍🦰', '👩‍🦰', '👨‍🦱'];
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  // Criar nova família
  const handleCreateFamily = () => {
    if (!familyName.trim()) {
      setError('Digite o nome da família');
      return;
    }
    
    const newFamily = createFamily(familyName.trim());
    setCurrentFamilyState(newFamily);
    setStep('create-player');
    setError('');
  };

  // Entrar em família existente
  const handleJoinFamily = () => {
    if (!familyCode.trim()) {
      setError('Digite o código da família');
      return;
    }
    
    const family = findFamilyByCode(familyCode.trim());
    
    if (!family) {
      setError('Código inválido. Verifique e tente novamente.');
      return;
    }
    
    setCurrentFamilyState(family);
    setCurrentFamily(family.id);
    
    if (family.players.length === 0) {
      setStep('create-player');
    } else {
      setStep('select-player');
    }
    setError('');
  };

  // Criar novo jogador
  const handleCreatePlayer = () => {
    if (!playerName.trim()) {
      setError('Digite o nome do jogador');
      return;
    }
    
    if (!currentFamily) return;
    
    const newPlayer = addPlayerToFamily(currentFamily.id, playerName.trim(), selectedAvatar);
    setCurrentPlayer(newPlayer.id);
    
    // Atualizar família com novo jogador
    const updatedFamily = { ...currentFamily };
    updatedFamily.players.push(newPlayer);
    
    onLogin(updatedFamily, newPlayer);
    setError('');
  };

  // Selecionar jogador existente
  const handleSelectPlayer = (player: Player) => {
    if (!currentFamily) return;
    
    setCurrentPlayer(player.id);
    onLogin(currentFamily, player);
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
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
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
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFamily()}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('welcome')}
                  variant="outline"
                  className="flex-1 border-gray-300"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleCreateFamily}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={!familyName.trim()}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
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
              {error && (
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
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500 text-center uppercase tracking-wider"
                  maxLength={6}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinFamily()}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('welcome')}
                  variant="outline"
                  className="flex-1 border-gray-300"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleJoinFamily}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={!familyCode.trim()}
                >
                  Entrar
                  <ArrowRight className="w-4 h-4 ml-2" />
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
              <CardDescription className="text-green-600">
                {currentFamily && (
                  <span>Família: <strong>{currentFamily.name}</strong> • Código: <strong>{currentFamily.code}</strong></span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
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
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePlayer()}
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
                      className={`p-3 md:p-4 text-2xl md:text-3xl rounded-xl border-2 transition-all ${
                        selectedAvatar === avatar
                          ? 'border-green-500 bg-green-100 scale-110 shadow-lg'
                          : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {currentFamily && currentFamily.players.length > 0 && (
                  <Button
                    onClick={() => setStep('select-player')}
                    variant="outline"
                    className="flex-1 border-gray-300"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleCreatePlayer}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={!playerName.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Começar a Jogar!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizar tela de selecionar jogador
  if (step === 'select-player' && currentFamily) {
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
                Família: <strong>{currentFamily.name}</strong> • Código: <strong>{currentFamily.code}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Lista de jogadores */}
              <div className="space-y-2">
                {currentFamily.players.map((player) => (
                  <Button
                    key={player.id}
                    onClick={() => handleSelectPlayer(player)}
                    variant="outline"
                    className="w-full h-auto p-4 border-2 border-green-300 hover:bg-green-50 hover:border-green-500 transition-all"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="text-3xl">{player.avatar}</div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-green-800">{player.name}</p>
                        <p className="text-sm text-green-600">
                          Nível {player.level} • {player.totalPoints} pontos
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
