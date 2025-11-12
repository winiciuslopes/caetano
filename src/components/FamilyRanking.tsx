import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Users, TrendingUp, Medal } from 'lucide-react';
import { motion } from 'motion/react';
import { usePlayerSupabase } from './PlayerContextSupabase';
import { supabaseClient, Perfil } from '../lib/supabaseClient';

export function FamilyRanking() {
  const { currentPlayer, tokenFamiliar } = usePlayerSupabase();
  const [members, setMembers] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamilyMembers();
  }, [tokenFamiliar]);

  const loadFamilyMembers = async () => {
    try {
      setLoading(true);
      const familyMembers = await supabaseClient.obterMembrosFamilia(tokenFamiliar);
      setMembers(familyMembers);
    } catch (error) {
      console.error('Erro ao carregar membros da família:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Carregando ranking...</div>;
  }

  if (members.length === 0) {
    return <div className="text-center p-8">Nenhum membro encontrado</div>;
  }
  
  // Sort members by points
  const sortedMembers = [...members].sort((a, b) => b.pontos - a.pontos);
  const totalPoints = sortedMembers.reduce((sum, p) => sum + p.pontos, 0);
  const averagePoints = sortedMembers.length > 0 ? Math.round(totalPoints / sortedMembers.length) : 0;

  const getMedalIcon = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `${position + 1}º`;
  };

  const getMedalColor = (position: number) => {
    if (position === 0) return 'from-yellow-400 to-yellow-600';
    if (position === 1) return 'from-gray-300 to-gray-500';
    if (position === 2) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className="space-y-6">
      {/* Family Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Membros da Família</p>
                <p className="text-3xl">{sortedMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Pontos Totais</p>
                <p className="text-3xl">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Média por Membro</p>
                <p className="text-3xl">{averagePoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Medal className="w-6 h-6 text-yellow-600" />
            <div>
              <CardTitle>Ranking Familiar</CardTitle>
              <CardDescription>Competição saudável entre membros da Família {tokenFamiliar}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden ${member.id === currentPlayer.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className={`h-2 bg-gradient-to-r ${getMedalColor(index)}`} />
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      {/* Position */}
                      <div className="text-3xl flex-shrink-0 w-16 text-center">
                        {getMedalIcon(index)}
                      </div>

                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl flex-shrink-0">
                        {member.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="truncate">{member.nome_integrante}</h3>
                          {member.id === currentPlayer.id && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Você</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Jogadas: {member.total_jogadas} | Precisão: {member.precisao.toFixed(0)}%
                        </p>
                      </div>

                      {/* Points */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-yellow-600" />
                          <span className="text-2xl">{member.pontos}</span>
                        </div>
                        <p className="text-xs text-gray-500">pontos</p>
                      </div>
                    </div>

                    {/* Progress stats */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Precisão</span>
                        <span>{member.precisao.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${getMedalColor(index)} transition-all`}
                          style={{ width: `${Math.min(100, member.precisao)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Conquistas Familiares</CardTitle>
          <CardDescription>Objetivos em grupo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
              sortedMembers.length > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-200 border-gray-400 opacity-50'
            }`}>
              <div className="text-3xl">🌱</div>
              <div>
                <h4 className={sortedMembers.length > 0 ? 'text-green-800' : 'text-gray-600'}>Iniciantes Eco</h4>
                <p className={`text-sm ${sortedMembers.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  Cada membro jogou pelo menos 1 vez
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
              totalPoints >= 100 ? 'bg-blue-50 border-blue-200' : 'bg-gray-200 border-dashed border-gray-400 opacity-50'
            }`}>
              <div className="text-3xl">♻️</div>
              <div>
                <h4 className={totalPoints >= 100 ? 'text-blue-800' : 'text-gray-600'}>Separadores Pro</h4>
                <p className={`text-sm ${totalPoints >= 100 ? 'text-blue-600' : 'text-gray-500'}`}>
                  {totalPoints >= 100 ? 'Família atingiu 100 pontos' : `Atingir 100 pontos - Faltam ${100 - totalPoints}`}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
              totalPoints >= 500 ? 'bg-purple-50 border-purple-200' : 'bg-gray-200 border-dashed border-gray-400 opacity-50'
            }`}>
              <div className="text-3xl">🏆</div>
              <div>
                <h4 className={totalPoints >= 500 ? 'text-purple-800' : 'text-gray-600'}>Campeões da Reciclagem</h4>
                <p className={`text-sm ${totalPoints >= 500 ? 'text-purple-600' : 'text-gray-500'}`}>
                  {totalPoints >= 500 ? 'Família atingiu 500 pontos' : `Atingir 500 pontos - Faltam ${500 - totalPoints}`}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
              sortedMembers.every(m => m.total_jogadas >= 10) && sortedMembers.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-200 border-dashed border-gray-400 opacity-50'
            }`}>
              <div className="text-3xl">⭐</div>
              <div>
                <h4 className={sortedMembers.every(m => m.total_jogadas >= 10) && sortedMembers.length > 0 ? 'text-yellow-800' : 'text-gray-600'}>
                  Mestres Ambientais
                </h4>
                <p className={`text-sm ${sortedMembers.every(m => m.total_jogadas >= 10) && sortedMembers.length > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                  Todos com 10+ jogadas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
