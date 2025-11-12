import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Truck, MapPin, Clock, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { usePlayerSupabase } from './PlayerContextSupabase';
import { supabaseClient } from '../lib/supabaseClient';

interface RouteGameProps {
  onBack: () => void;
  difficulty: number; // 1-10
}

interface CollectionPoint {
  id: number;
  x: number;
  y: number;
  volume: number;
  collected: boolean;
}

export function RouteGame({ onBack, difficulty }: RouteGameProps) {
  const { currentPlayer } = usePlayerSupabase();
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [route, setRoute] = useState<number[]>([]);
  const [truckPosition, setTruckPosition] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(60 + (difficulty * 5));
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pendingMoves, setPendingMoves] = useState<Array<{
    acerto: boolean;
    tempo_resposta: number;
    pontuacao: number;
    dados_adicionais: Record<string, any>;
  }>>([]);

  // Generate collection points based on difficulty
  useEffect(() => {
    const pointCount = 3 + difficulty; // 4-13 pontos
    const newPoints: CollectionPoint[] = [];

    for (let i = 0; i < pointCount; i++) {
      newPoints.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        volume: Math.floor(Math.random() * 8) + 2, // Valores menores: 2-10
        collected: false
      });
    }

    setPoints(newPoints);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const handlePointClick = async (pointId: number) => {
    if (!gameStarted || gameOver) return;

    const point = points.find(p => p.id === pointId);
    if (!point || point.collected) return;

    // Calculate distance from current truck position
    const distance = Math.sqrt(
      Math.pow(point.x - truckPosition.x, 2) + Math.pow(point.y - truckPosition.y, 2)
    );

    // Update truck position
    setTruckPosition({ x: point.x, y: point.y });

    // Mark point as collected
    setPoints(prev => prev.map(p => 
      p.id === pointId ? { ...p, collected: true } : p
    ));

    // Add to route
    setRoute(prev => [...prev, pointId]);

    // Calculate score (bonus for efficiency) - valores menores
    const efficiency = Math.max(0, Math.round((100 - distance) / 10));
    const pointScore = Math.round(point.volume / 10) + efficiency;
    setScore(prev => prev + pointScore);

    // Armazenar jogada localmente (não salvar no banco ainda)
    setPendingMoves(prev => [...prev, {
      acerto: true,
      tempo_resposta: timeLeft,
      pontuacao: pointScore,
      dados_adicionais: {
        pointId: pointId,
        distance: distance,
        efficiency: efficiency,
        volume: point.volume
      }
    }]);

    // Check if all points collected
    if (points.filter(p => !p.collected).length === 1) {
      setGameOver(true);
    }
  };

  // Salvar todas as jogadas quando o jogo terminar
  useEffect(() => {
    if (gameOver && pendingMoves.length > 0) {
      const salvarJogadas = async () => {
        try {
          for (const move of pendingMoves) {
            await supabaseClient.registrarJogada({
              jogador_id: currentPlayer.id,
              jogo: 'route',
              nivel: difficulty,
              acerto: move.acerto,
              tempo_resposta: move.tempo_resposta,
              pontuacao: move.pontuacao,
              dificuldade: difficulty <= 3 ? 'Fácil' : difficulty <= 7 ? 'Médio' : 'Difícil',
              dados_adicionais: move.dados_adicionais
            });
          }
          console.log('✅ Todas as jogadas salvas com sucesso!');
        } catch (error) {
          console.error('❌ Erro ao salvar jogadas:', error);
        }
      };
      
      salvarJogadas();
    }
  }, [gameOver, pendingMoves, currentPlayer.id, difficulty]);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleRestart = () => {
    const pointCount = 3 + difficulty;
    const newPoints: CollectionPoint[] = [];

    for (let i = 0; i < pointCount; i++) {
      newPoints.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        volume: Math.floor(Math.random() * 50) + 20,
        collected: false
      });
    }

    setPoints(newPoints);
    setRoute([]);
    setTruckPosition({ x: 50, y: 50 });
    setTimeLeft(60 + (difficulty * 5));
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
    setPendingMoves([]);
  };

  if (gameOver) {
    const collectedCount = points.filter(p => p.collected).length;
    const totalPoints = points.length;
    const percentage = (collectedCount / totalPoints) * 100;

    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="text-center">
              <CardHeader>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <CardTitle>Rota Concluída!</CardTitle>
                <CardDescription>Confira seu desempenho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-6xl mb-2">{score}</div>
                  <p className="text-gray-600">Pontos de Eficiência</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pontos Coletados</p>
                    <p className="text-2xl text-blue-600">{collectedCount}/{totalPoints}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl text-green-600">{Math.round(percentage)}%</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleRestart} className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Jogar Novamente
                  </Button>
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-orange-600">
              Rota de Coleta
            </Badge>
            <Badge variant="outline">
              Nível {difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="w-5 h-5" />
              <span className="text-xl">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <Trophy className="w-5 h-5" />
              <span className="text-xl">{score}</span>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Planeje a Rota Mais Eficiente</CardTitle>
            <CardDescription>
              Clique nos pontos de coleta para criar a rota. Minimize a distância para maximizar a eficiência!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="relative w-full rounded-lg border-4 border-green-600 overflow-hidden"
              style={{ 
                height: '500px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1698948233640-fe50ca4ce8c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwc3RyZWV0cyUyMGFlcmlhbHxlbnwxfHx8fDE3NjE3MTgxODd8MA&ixlib=rb-4.1.0&q=80&w=1080)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay semi-transparente para melhorar visibilidade */}
              <div className="absolute inset-0 bg-white/40" />
              
              {/* Collection Points */}
              {points.map((point, index) => (
                <motion.div
                  key={point.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: point.collected ? 0.7 : 1 }}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                    point.collected ? 'opacity-40' : ''
                  }`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  onClick={() => handlePointClick(point.id)}
                >
                  <div className={`relative ${point.collected ? '' : 'animate-pulse'}`}>
                    <MapPin 
                      className={`w-10 h-10 ${point.collected ? 'text-gray-400' : 'text-red-600'}`}
                      fill={point.collected ? '#9ca3af' : '#dc2626'}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs">
                      {point.volume}kg
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Truck */}
              {gameStarted && (
                <motion.div
                  animate={{ left: `${truckPosition.x}%`, top: `${truckPosition.y}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Truck className="w-12 h-12 text-blue-600" />
                </motion.div>
              )}

              {/* Route Lines */}
              {route.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {route.map((pointId, index) => {
                    if (index === 0) return null;
                    const prevPoint = points.find(p => p.id === route[index - 1]);
                    const currentPoint = points.find(p => p.id === pointId);
                    if (!prevPoint || !currentPoint) return null;

                    return (
                      <line
                        key={`${prevPoint.id}-${currentPoint.id}`}
                        x1={`${prevPoint.x}%`}
                        y1={`${prevPoint.y}%`}
                        x2={`${currentPoint.x}%`}
                        y2={`${currentPoint.y}%`}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                    );
                  })}
                </svg>
              )}

              {/* Start Screen */}
              {!gameStarted && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Button
                      onClick={handleStart}
                      className="bg-orange-600 hover:bg-orange-700 text-xl px-8 py-6"
                    >
                      Iniciar Coleta
                    </Button>
                    <p className="text-white mt-4">
                      Colete todos os pontos no menor tempo possível!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Pontos Restantes</p>
                  <p className="text-2xl">{points.filter(p => !p.collected).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Rota Atual</p>
                  <p className="text-2xl">{route.length} paradas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Volume Coletado</p>
                  <p className="text-2xl">
                    {points.filter(p => p.collected).reduce((sum, p) => sum + p.volume, 0)}kg
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}