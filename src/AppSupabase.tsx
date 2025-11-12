import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Gamepad2, Trophy, User, BookOpen, LogOut, Download, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { AuthScreenSupabase } from './components/AuthScreenSupabase';
import { Minigames } from './components/Minigames';
import { FamilyRanking } from './components/FamilyRanking';
import { UserProfile } from './components/UserProfile';
import { RecyclingGuide } from './components/RecyclingGuide';
import { Logo } from './components/Logo';
import { PlayerProviderSupabase } from './components/PlayerContextSupabase';
import { supabaseClient, Perfil } from './lib/supabaseClient';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';
import { toast } from 'sonner@2.0.3';

export default function AppSupabase() {
  const [tokenFamiliar, setTokenFamiliar] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Perfil | null>(null);
  const [membros, setMembros] = useState<Perfil[]>([]);
  const [activeTab, setActiveTab] = useState('games');
  const [loading, setLoading] = useState(true);
  
  // Estado para adicionar novo membro
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('👨');
  const [addingMember, setAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  const avatars = ['👨', '👩', '👦', '👧', '🧑', '👴', '👵', '🧒', '🧕', '👨‍🦰', '👩‍🦰', '👨‍🦱'];

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const loadSavedSession = async () => {
      const savedToken = localStorage.getItem('recycle_token_familiar');
      const savedPlayerId = localStorage.getItem('recycle_current_player_id');
      
      if (savedToken && savedPlayerId) {
        try {
          // Verificar se o token ainda existe
          const existe = await supabaseClient.tokenFamiliarExiste(savedToken);
          
          if (existe) {
            // Buscar membros
            const membrosData = await supabaseClient.obterMembrosFamilia(savedToken);
            
            // Buscar jogador atual
            const playerAtual = membrosData.find(m => m.id === savedPlayerId);
            
            if (playerAtual) {
              setTokenFamiliar(savedToken);
              setMembros(membrosData);
              setCurrentPlayer(playerAtual);
            } else {
              // Jogador não encontrado, limpar
              localStorage.removeItem('recycle_token_familiar');
              localStorage.removeItem('recycle_current_player_id');
            }
          } else {
            // Token não existe mais, limpar
            localStorage.removeItem('recycle_token_familiar');
            localStorage.removeItem('recycle_current_player_id');
          }
        } catch (error) {
          console.error('Erro ao carregar sessão:', error);
          localStorage.removeItem('recycle_token_familiar');
          localStorage.removeItem('recycle_current_player_id');
        }
      }
      
      setLoading(false);
    };
    
    loadSavedSession();
  }, []);

  const handleLogin = (token: string, perfil: Perfil, todosMembros: Perfil[]) => {
    setTokenFamiliar(token);
    setCurrentPlayer(perfil);
    setMembros(todosMembros);
    
    // Salvar no localStorage
    localStorage.setItem('recycle_token_familiar', token);
    localStorage.setItem('recycle_current_player_id', perfil.id);
  };

  const handleSwitchPlayer = async (perfil: Perfil) => {
    setCurrentPlayer(perfil);
    localStorage.setItem('recycle_current_player_id', perfil.id);
    
    // Recarregar dados do jogador
    try {
      const perfilAtualizado = await supabaseClient.obterPerfil(perfil.id);
      setCurrentPlayer(perfilAtualizado);
      
      // Atualizar lista de membros
      if (tokenFamiliar) {
        const membrosAtualizados = await supabaseClient.obterMembrosFamilia(tokenFamiliar);
        setMembros(membrosAtualizados);
      }
    } catch (error) {
      console.error('Erro ao trocar jogador:', error);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) {
      setAddMemberError('Digite o nome do novo membro');
      return;
    }
    
    if (!tokenFamiliar) {
      setAddMemberError('Token familiar não encontrado');
      return;
    }
    
    setAddingMember(true);
    setAddMemberError('');
    
    try {
      const novoPerfil = await supabaseClient.criarPerfil(
        newMemberName.trim(),
        newMemberAvatar,
        tokenFamiliar
      );
      
      // Buscar todos os membros atualizados
      const membrosAtualizados = await supabaseClient.obterMembrosFamilia(tokenFamiliar);
      setMembros(membrosAtualizados);
      
      // Resetar formulário
      setNewMemberName('');
      setNewMemberAvatar('👨');
      setAddMemberDialogOpen(false);
      
      toast.success(`${novoPerfil.nome_integrante} foi adicionado à família!`);
    } catch (err: any) {
      setAddMemberError(err.message || 'Erro ao adicionar membro');
    } finally {
      setAddingMember(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recycle_token_familiar');
    localStorage.removeItem('recycle_current_player_id');
    setTokenFamiliar(null);
    setCurrentPlayer(null);
    setMembros([]);
  };

  const handleExportMetrics = async (format: 'json' | 'csv') => {
    if (!currentPlayer) return;
    
    try {
      await supabaseClient.downloadHistorico(currentPlayer.id, format);
      toast.success(`Métricas exportadas em ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error('Erro ao exportar métricas');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-green-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!tokenFamiliar || !currentPlayer) {
    return <AuthScreenSupabase onLogin={handleLogin} />;
  }

  return (
    <PlayerProviderSupabase player={currentPlayer} tokenFamiliar={tokenFamiliar}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header */}
        <header className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-green-500">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="hidden md:block">
                <Logo size="md" showText={true} />
              </div>
              <div className="md:hidden">
                <Logo size="sm" showText={true} />
              </div>

              {/* User Info & Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Player Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-green-300 hover:bg-green-50 gap-2">
                      <div className="text-xl">{currentPlayer.avatar}</div>
                      <div className="text-left hidden sm:block">
                        <p className="text-xs text-green-600 leading-tight">Jogador</p>
                        <p className="font-semibold text-green-800 text-sm leading-tight">{currentPlayer.nome_integrante}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-green-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      Família {tokenFamiliar}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {membros.map((membro) => (
                      <DropdownMenuItem
                        key={membro.id}
                        onClick={() => handleSwitchPlayer(membro)}
                        className={membro.id === currentPlayer.id ? 'bg-green-50' : ''}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-xl">{membro.avatar}</span>
                          <div className="flex-1">
                            <p className="font-semibold">{membro.nome_integrante}</p>
                            <p className="text-xs text-gray-500">{membro.pontos} pts • {membro.precisao.toFixed(0)}%</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <div className="flex items-center gap-2 w-full text-green-700">
                            <Plus className="w-4 h-4" />
                            <span>Adicionar Membro</span>
                          </div>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Adicionar Novo Membro</DialogTitle>
                          <DialogDescription>
                            Adicione um novo membro à família {tokenFamiliar}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {addMemberError && (
                            <Alert variant="destructive">
                              <AlertDescription>{addMemberError}</AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="space-y-2">
                            <Label htmlFor="newMemberName">Nome do Membro</Label>
                            <Input
                              id="newMemberName"
                              placeholder="Digite o nome"
                              value={newMemberName}
                              onChange={(e) => setNewMemberName(e.target.value)}
                              disabled={addingMember}
                              onKeyDown={(e) => e.key === 'Enter' && !addingMember && handleAddMember()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Escolha o Avatar</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {avatars.map((avatar) => (
                                <button
                                  key={avatar}
                                  onClick={() => setNewMemberAvatar(avatar)}
                                  disabled={addingMember}
                                  className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                                    newMemberAvatar === avatar
                                      ? 'border-green-500 bg-green-100 scale-110'
                                      : 'border-gray-300 hover:border-green-300'
                                  } ${addingMember ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {avatar}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAddMemberDialogOpen(false);
                              setNewMemberName('');
                              setNewMemberAvatar('👨');
                              setAddMemberError('');
                            }}
                            disabled={addingMember}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleAddMember}
                            disabled={!newMemberName.trim() || addingMember}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {addingMember ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adicionando...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout */}
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-1 hidden lg:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto bg-white/80 backdrop-blur-sm shadow-lg border-2 border-green-200">
              <TabsTrigger 
                value="games" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="hidden sm:inline">Minigames</span>
                <span className="sm:hidden">Jogos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ranking" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Trophy className="w-5 h-5" />
                <span className="hidden sm:inline">Ranking</span>
                <span className="sm:hidden">Rank</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="guide" 
                className="flex items-center gap-2 py-4 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Guia</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games" className="mt-0">
              <Minigames />
            </TabsContent>

            <TabsContent value="ranking" className="mt-0">
              <FamilyRanking />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <UserProfile />
            </TabsContent>

            <TabsContent value="guide" className="mt-0">
              <RecyclingGuide />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t-4 border-green-500 mt-12 shadow-lg">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Logo & Description */}
              <div className="space-y-3">
                <Logo size="sm" showText={true} />
                <p className="text-sm text-gray-600">
                  Educação ambiental gamificada para jovens e famílias. Aprenda sobre reciclagem de forma divertida!
                </p>
              </div>

              {/* Color Legend */}
              <div>
                <h4 className="text-green-800 mb-3">Cores da Reciclagem</h4>
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-green-600 shadow-lg"></div>
                    <span className="text-xs text-gray-600">Verde</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-blue-600 shadow-lg"></div>
                    <span className="text-xs text-gray-600">Azul</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 shadow-lg"></div>
                    <span className="text-xs text-gray-600">Amarelo</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-red-600 shadow-lg"></div>
                    <span className="text-xs text-gray-600">Vermelho</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-gray-600 shadow-lg"></div>
                    <span className="text-xs text-gray-600">Cinza</span>
                  </div>
                </div>
              </div>

              {/* Export Data */}
              <div>
                <h4 className="text-green-800 mb-3">Exportar Dados</h4>
                <div className="space-y-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Métricas
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExportMetrics('json')}>
                        Exportar como JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportMetrics('csv')}>
                        Exportar como CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <p className="text-xs text-gray-500">
                    Baixe todas as métricas coletadas durante os jogos para análise posterior.
                  </p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 pt-6 border-t border-green-200 text-center">
              <p className="text-sm text-gray-600">
                © 2025 Recycle Show - Todos os direitos reservados | Desenvolvido com 💚 para o meio ambiente
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PlayerProviderSupabase>
  );
}
