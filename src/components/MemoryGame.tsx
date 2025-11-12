import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Trophy, Timer, Star, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { usePlayerSupabase } from './PlayerContextSupabase';
import { supabaseClient } from '../lib/supabaseClient';

interface MemoryGameProps {
  onBack: () => void;
  difficulty: number; // 1-10
}

interface MemoryCard {
  id: number;
  icon: string;
  matched: boolean;
  flipped: boolean;
}

const ecoIcons = ['♻️', '🌱', '🗑️', '🌍', '💧', '⚡', '🌳', '🏭', '🔋', '📦', '🍃', '☀️', '🌊', '🦋', '🐝', '🌺', '🍎', '🥤', '📰', '🧴'];

export function MemoryGame({ onBack, difficulty }: MemoryGameProps) {
  const { currentPlayer } = usePlayerSupabase();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [pendingMoves, setPendingMoves] = useState<Array<{
    acerto: boolean;
    tempo_resposta: number;
    pontuacao: number;
    dados_adicionais: Record<string, any>;
  }>>([]);

  const pairCount = Math.min(4 + difficulty, 12); // 5-12 pares

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

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

  useEffect(() => {
    if (matches === pairCount && matches > 0) {
      setGameOver(true);
    }
  }, [matches, pairCount]);

  useEffect(() => {
    if (gameOver && pendingMoves.length > 0) {
      const salvarJogadas = async () => {
        try {
          for (const move of pendingMoves) {
            await supabaseClient.registrarJogada({
              jogador_id: currentPlayer.id,
              jogo: 'memory',
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

  const initializeGame = () => {
    const selectedIcons = ecoIcons.slice(0, pairCount);
    const cardPairs = [...selectedIcons, ...selectedIcons];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5).map((icon, index) => ({
      id: index,
      icon,
      matched: false,
      flipped: false
    }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(60 + (difficulty * 5));
    setGameStarted(false);
    setGameOver(false);
    setStartTime(Date.now());
    setPendingMoves([]);
  };

  const handleCardClick = async (id: number) => {
    if (!gameStarted) setGameStarted(true);
    if (flippedCards.length === 2 || cards[id].matched || cards[id].flipped) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const isMatch = cards[first].icon === cards[second].icon;
      
      if (isMatch) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          matchedCards[first].flipped = false;
          matchedCards[second].flipped = false;
          setCards(matchedCards);
          setMatches(matches + 1);
          setFlippedCards([]);
        }, 500);

        // Armazenar acerto localmente (não salvar no banco ainda)
        setPendingMoves(prev => [...prev, {
          acerto: true,
          tempo_resposta: Math.floor((Date.now() - startTime) / 1000),
          pontuacao: 15,
          dados_adicionais: {
            moves: moves + 1,
            icon: cards[first].icon
          }
        }]);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);

        // Armazenar erro localmente (não salvar no banco ainda)
        setPendingMoves(prev => [...prev, {
          acerto: false,
          tempo_resposta: Math.floor((Date.now() - startTime) / 1000),
          pontuacao: 0,
          dados_adicionais: {
            moves: moves + 1
          }
        }]);
      }
    }
  };

  if (gameOver) {
    const won = matches === pairCount;
    const score = won ? Math.floor((pairCount * 20) + (timeLeft * 2) - (moves * 5)) : 0;
    const percentage = (matches / pairCount) * 100;
    const passed = percentage >= 90;

    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="text-center">
              <CardHeader>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <CardTitle>{won ? 'Parabéns!' : 'Tempo Esgotado'}</CardTitle>
                <CardDescription>Jogo da Memória Concluído</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-6xl mb-2">{Math.round(percentage)}%</div>
                  <p className="text-gray-600">
                    {matches} de {pairCount} pares encontrados
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {passed ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800">
                        Excelente memória! Você desbloqueou o próximo nível!
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-orange-800">
                        Continue praticando! Você precisa de 90% para avançar.
                      </p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pares</p>
                    <p className="text-2xl text-purple-600">{matches}/{pairCount}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Movimentos</p>
                    <p className="text-2xl text-blue-600">{moves}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Tempo</p>
                    <p className="text-2xl text-green-600">{timeLeft}s</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={initializeGame} className="flex-1 bg-purple-600 hover:bg-purple-700">
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
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-purple-600">Jogo da Memória</Badge>
            <Badge variant="outline">Nível {difficulty}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-600">
              <Timer className="w-5 h-5" />
              <span className="text-xl">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Star className="w-5 h-5" />
              <span className="text-xl">{matches}/{pairCount}</span>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-sm text-gray-600">Movimentos</p>
                <p className="text-2xl text-purple-600">{moves}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pares Encontrados</p>
                <p className="text-2xl text-green-600">{matches}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Restantes</p>
                <p className="text-2xl text-orange-600">{pairCount - matches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Grid */}
        <div 
          className="grid gap-4 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${Math.min(pairCount, 6)}, 1fr)`,
            maxWidth: '600px'
          }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-lg cursor-pointer transition-all ${
                  card.flipped || card.matched
                    ? 'bg-white'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                } ${card.matched ? 'opacity-50 ring-4 ring-green-500' : ''}`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {card.flipped || card.matched ? (
                    <span className="text-4xl">{card.icon}</span>
                  ) : (
                    <span className="text-4xl text-white">♻️</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        {!gameStarted && (
          <div className="mt-6 p-4 bg-purple-100 rounded-lg text-center">
            <p className="text-purple-800">
              💡 Encontre todos os pares de ícones ecológicos! Clique em duas cartas para virá-las.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}