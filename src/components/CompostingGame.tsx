import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Trophy, Thermometer, Droplets, Wind } from 'lucide-react';
import { motion } from 'motion/react';
import { usePlayerSupabase } from './PlayerContextSupabase';
import { supabaseClient } from '../lib/supabaseClient';

interface CompostingGameProps {
  onBack: () => void;
  difficulty: number; // 1-10
}

interface CompostItem {
  id: number;
  name: string;
  type: 'verde' | 'marrom' | 'proibido';
  icon: string;
}

const compostItems: CompostItem[] = [
  // Verdes (nitrogênio)
  { id: 1, name: 'Cascas de Frutas', type: 'verde', icon: '🍎' },
  { id: 2, name: 'Restos de Vegetais', type: 'verde', icon: '🥬' },
  { id: 3, name: 'Borra de Café', type: 'verde', icon: '☕' },
  { id: 4, name: 'Grama Cortada', type: 'verde', icon: '🌱' },
  { id: 5, name: 'Cascas de Ovo', type: 'verde', icon: '🥚' },
  { id: 16, name: 'Restos de Salada', type: 'verde', icon: '🥗' },
  { id: 17, name: 'Cascas de Banana', type: 'verde', icon: '🍌' },
  { id: 18, name: 'Saquinhos de Chá', type: 'verde', icon: '🍵' },
  { id: 19, name: 'Ervas Frescas', type: 'verde', icon: '🌿' },
  { id: 20, name: 'Flores Murchas', type: 'verde', icon: '🌺' },
  
  // Marrons (carbono)
  { id: 6, name: 'Folhas Secas', type: 'marrom', icon: '🍂' },
  { id: 7, name: 'Serragem', type: 'marrom', icon: '🪵' },
  { id: 8, name: 'Papel Picado', type: 'marrom', icon: '📄' },
  { id: 9, name: 'Papelão', type: 'marrom', icon: '📦' },
  { id: 10, name: 'Palha', type: 'marrom', icon: '🌾' },
  { id: 21, name: 'Galhos Pequenos', type: 'marrom', icon: '🪵' },
  { id: 22, name: 'Jornal', type: 'marrom', icon: '📰' },
  { id: 23, name: 'Cascas de Árvore', type: 'marrom', icon: '🌳' },
  { id: 24, name: 'Feno', type: 'marrom', icon: '🌾' },
  { id: 25, name: 'Aparas de Lápis', type: 'marrom', icon: '✏️' },
  
  // Proibidos
  { id: 11, name: 'Carne', type: 'proibido', icon: '🥩' },
  { id: 12, name: 'Laticínios', type: 'proibido', icon: '🧀' },
  { id: 13, name: 'Óleo', type: 'proibido', icon: '🛢️' },
  { id: 14, name: 'Plástico', type: 'proibido', icon: '🧴' },
  { id: 15, name: 'Vidro', type: 'proibido', icon: '🫙' },
  { id: 26, name: 'Peixe', type: 'proibido', icon: '🐟' },
  { id: 27, name: 'Ossos', type: 'proibido', icon: '🦴' },
  { id: 28, name: 'Gordura', type: 'proibido', icon: '🧈' },
  { id: 29, name: 'Metal', type: 'proibido', icon: '🔩' },
  { id: 30, name: 'Fezes de Animais', type: 'proibido', icon: '💩' },
];

export function CompostingGame({ onBack, difficulty }: CompostingGameProps) {
  const { currentPlayer } = usePlayerSupabase();
  const [currentItem, setCurrentItem] = useState<CompostItem | null>(null);
  const [verdeLevel, setVerdeLevel] = useState(50);
  const [marromLevel, setMarromLevel] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [usedItems, setUsedItems] = useState<number[]>([]); // IDs dos itens já usados
  const [pendingMoves, setPendingMoves] = useState<Array<{
    acerto: boolean;
    tempo_resposta: number;
    pontuacao: number;
    dados_adicionais: Record<string, any>;
  }>>([]);

  const totalRounds = 10 + difficulty * 2;

  useEffect(() => {
    if (round < totalRounds && !gameOver) {
      selectRandomItem();
    } else if (round >= totalRounds) {
      setGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    // Atualizar temperatura e umidade baseado no equilíbrio
    const balance = Math.abs(verdeLevel - marromLevel);
    const idealTemp = balance < 20 ? 60 : 30;
    const idealHumid = balance < 20 ? 60 : 40;
    
    setTemperature(prev => Math.min(80, Math.max(20, prev + (Math.random() - 0.5) * 5)));
    setHumidity(prev => Math.min(80, Math.max(30, prev + (Math.random() - 0.5) * 5)));
  }, [verdeLevel, marromLevel]);

  const selectRandomItem = () => {
    // Filtrar itens que ainda não foram usados
    const availableItems = compostItems.filter(item => !usedItems.includes(item.id));
    
    // Se todos os itens foram usados, resetar a lista
    if (availableItems.length === 0) {
      setUsedItems([]);
      const randomItem = compostItems[Math.floor(Math.random() * compostItems.length)];
      setCurrentItem(randomItem);
      setUsedItems([randomItem.id]);
    } else {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      setCurrentItem(randomItem);
      setUsedItems([...usedItems, randomItem.id]);
    }
    
    setFeedback(null);
  };

  const handleChoice = async (choice: 'aceitar' | 'rejeitar') => {
    if (!currentItem) return;

    const shouldAccept = currentItem.type !== 'proibido';
    const correct = (choice === 'aceitar' && shouldAccept) || (choice === 'rejeitar' && !shouldAccept);

    if (correct) {
      setScore(score + 10);
      if (choice === 'aceitar') {
        if (currentItem.type === 'verde') {
          setVerdeLevel(Math.min(100, verdeLevel + 10));
          setFeedback('✅ Ótimo! Material verde (nitrogênio) adicionado!');
        } else if (currentItem.type === 'marrom') {
          setMarromLevel(Math.min(100, marromLevel + 10));
          setFeedback('✅ Perfeito! Material marrom (carbono) adicionado!');
        }
      } else {
        setFeedback('✅ Correto! Esse material não deve ir na composteira!');
      }

      // Armazenar acerto localmente (não salvar no banco ainda)
      setPendingMoves(prev => [...prev, {
        acerto: true,
        tempo_resposta: round + 1,
        pontuacao: 10,
        dados_adicionais: {
          itemName: currentItem.name,
          itemType: currentItem.type,
          choice: choice,
          verdeLevel: verdeLevel,
          marromLevel: marromLevel
        }
      }]);
    } else {
      setMistakes(mistakes + 1);
      if (choice === 'aceitar') {
        setFeedback(`❌ Erro! ${currentItem.name} não pode ir na composteira!`);
      } else {
        setFeedback(`❌ Erro! ${currentItem.name} pode ser compostado!`);
      }

      // Armazenar erro localmente (não salvar no banco ainda)
      setPendingMoves(prev => [...prev, {
        acerto: false,
        tempo_resposta: round + 1,
        pontuacao: 0,
        dados_adicionais: {
          itemName: currentItem.name,
          itemType: currentItem.type,
          choice: choice
        }
      }]);
    }

    setTimeout(() => {
      setRound(round + 1);
    }, 2000);
  };

  // Salvar todas as jogadas quando o jogo terminar
  useEffect(() => {
    if (gameOver && pendingMoves.length > 0) {
      const salvarJogadas = async () => {
        try {
          for (const move of pendingMoves) {
            await supabaseClient.registrarJogada({
              jogador_id: currentPlayer.id,
              jogo: 'composting',
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

  const getCompostQuality = () => {
    const balance = Math.abs(verdeLevel - marromLevel);
    const tempOk = temperature >= 50 && temperature <= 70;
    const humidOk = humidity >= 50 && humidity <= 70;

    if (balance < 15 && tempOk && humidOk) return { level: 'Excelente', color: 'green', emoji: '🏆' };
    if (balance < 30 && (tempOk || humidOk)) return { level: 'Bom', color: 'blue', emoji: '👍' };
    if (balance < 50) return { level: 'Regular', color: 'yellow', emoji: '⚠️' };
    return { level: 'Ruim', color: 'red', emoji: '❌' };
  };

  if (gameOver) {
    const quality = getCompostQuality();
    const accuracy = ((totalRounds - mistakes) / totalRounds) * 100;

    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-yellow-50">
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
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-yellow-500 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <CardTitle>Compostagem Concluída!</CardTitle>
                <CardDescription>Seu adubo está pronto!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-6xl mb-2">{quality.emoji}</div>
                  <p className={`text-2xl text-${quality.color}-600 mb-2`}>
                    Qualidade: {quality.level}
                  </p>
                  <p className="text-gray-600">Pontuação: {score * 10}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Precisão</p>
                    <p className="text-2xl text-green-600">{Math.round(accuracy)}%</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Equilíbrio</p>
                    <p className="text-2xl text-orange-600">
                      {Math.abs(verdeLevel - marromLevel) < 20 ? 'Ótimo' : 'Regular'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg text-left">
                  <h4 className="text-blue-800 mb-2">💡 Dica de Compostagem:</h4>
                  <p className="text-sm text-blue-700">
                    O equilíbrio ideal é 50% material verde (rico em nitrogênio) e 50% material marrom 
                    (rico em carbono). Mantenha a composteira úmida como esponja torcida e vire regularmente!
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => window.location.reload()} className="flex-1 bg-green-600 hover:bg-green-700">
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

  const quality = getCompostQuality();

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-green-600">Jogo de Compostagem</Badge>
            <Badge variant="outline">Nível {difficulty}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="text-xl">{score}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso</span>
            <span>{round}/{totalRounds}</span>
          </div>
          <Progress value={(round / totalRounds) * 100} />
        </div>

        {/* Compost Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Composição da Composteira</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-700">🌱 Material Verde</span>
                  <span>{verdeLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-green-500 transition-all"
                    style={{ width: `${verdeLevel}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-yellow-700">🍂 Material Marrom</span>
                  <span>{marromLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-yellow-600 transition-all"
                    style={{ width: `${marromLevel}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Condições Ambientais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="text-sm">Temperatura</span>
                </div>
                <span className={`${temperature >= 50 && temperature <= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                  {temperature.toFixed(0)}°C
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Umidade</span>
                </div>
                <span className={`${humidity >= 50 && humidity <= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                  {humidity.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Qualidade</span>
                </div>
                <span className={`text-${quality.color}-600`}>
                  {quality.emoji} {quality.level}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Item */}
        {currentItem && !feedback && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Este item pode ir na composteira?</CardTitle>
                <CardDescription>Escolha sabiamente para manter o equilíbrio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4">{currentItem.icon}</div>
                  <h3 className="text-2xl mb-4">{currentItem.name}</h3>
                  
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleChoice('aceitar')}
                      className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg"
                    >
                      ✓ Aceitar
                    </Button>
                    <Button
                      onClick={() => handleChoice('rejeitar')}
                      variant="destructive"
                      className="px-8 py-6 text-lg"
                    >
                      ✗ Rejeitar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`${feedback.includes('✅') ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} border-2`}>
              <CardContent className="pt-6">
                <p className={`text-center text-lg ${feedback.includes('✅') ? 'text-green-800' : 'text-red-800'}`}>
                  {feedback}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
          <h4 className="text-yellow-900 mb-2">📚 Guia Rápido de Compostagem:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-green-700">✓ Material Verde (Nitrogênio):</p>
              <p className="text-gray-700">Frutas, vegetais, grama, café</p>
            </div>
            <div>
              <p className="text-yellow-700">✓ Material Marrom (Carbono):</p>
              <p className="text-gray-700">Folhas secas, serragem, papel</p>
            </div>
            <div>
              <p className="text-red-700">✗ Não Compostar:</p>
              <p className="text-gray-700">Carne, laticínios, óleo, plástico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}