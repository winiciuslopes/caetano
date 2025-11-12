import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Clock, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { quizQuestions, QuizQuestion } from '../lib/mockData';
import { motion } from 'motion/react';
import { usePlayerSupabase } from './PlayerContextSupabase';
import { supabaseClient } from '../lib/supabaseClient';

interface QuizGameProps {
  onBack: () => void;
  difficulty: number; // 1-10
}

export function QuizGame({ onBack, difficulty }: QuizGameProps) {
  const { currentPlayer } = usePlayerSupabase();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [pendingMoves, setPendingMoves] = useState<Array<{
    acerto: boolean;
    tempo_resposta: number;
    pontuacao: number;
    dados_adicionais: Record<string, any>;
  }>>([]);

  useEffect(() => {
    // Filter questions by difficulty level and shuffle properly
    const filtered = quizQuestions.filter(q => q.difficulty === difficulty);
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestions(shuffled.slice(0, 10));
  }, [difficulty]);

  useEffect(() => {
    if (questions.length === 0 || showFeedback || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, showFeedback, gameOver, currentIndex]);

  const handleAnswer = async (answerIndex: number | null) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    // Armazenar jogada localmente (não salvar no banco ainda)
    const pontuacao = isCorrect ? 10 : 0;
    
    setPendingMoves(prev => [...prev, {
      acerto: isCorrect,
      tempo_resposta: timeSpent,
      pontuacao: pontuacao,
      dados_adicionais: {
        questionId: currentQuestion.id,
        answer: answerIndex !== null ? currentQuestion.options[answerIndex] : 'Tempo esgotado',
        question: currentQuestion.question
      }
    }]);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);
      setStartTime(Date.now());
    } else {
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
              jogo: 'quiz',
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

  const handleRestart = () => {
    const filtered = quizQuestions.filter(q => q.difficulty === difficulty);
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setTimeLeft(30);
    setStartTime(Date.now());
    setGameOver(false);
    setPendingMoves([]);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (gameOver) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 90;

    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-green-50">
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
                <CardTitle>Quiz Concluído!</CardTitle>
                <CardDescription>Veja seu desempenho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-6xl mb-2">{Math.round(percentage)}%</div>
                  <p className="text-gray-600">
                    {score} de {questions.length} corretas
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {passed ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800">
                        Parabéns! Você desbloqueou o próximo nível!
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-orange-800">
                        Quase lá! Você precisa de 90% para avançar.
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleRestart} className="flex-1 bg-blue-600 hover:bg-blue-700">
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

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-3xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-600">
              Pergunta {currentIndex + 1}/{questions.length}
            </Badge>
            <Badge variant="outline">
              Nível {difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="w-5 h-5" />
            <span className="text-xl">{timeLeft}s</span>
          </div>
        </div>

        {/* Progress */}
        <Progress value={(currentIndex / questions.length) * 100} className="mb-6" />

        {/* Question Card */}
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{currentQuestion.question}</CardTitle>
              <CardDescription>Escolha a resposta correta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => !showFeedback && handleAnswer(index)}
                  disabled={showFeedback}
                  variant="outline"
                  className={`w-full justify-start text-left h-auto py-4 px-6 ${
                    showFeedback && index === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : showFeedback && index === selectedAnswer && !isCorrect
                      ? 'bg-red-100 border-red-500'
                      : ''
                  }`}
                >
                  <span className="mr-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {showFeedback && index === selectedAnswer && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </Button>
              ))}

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-orange-50'}`}
                >
                  <p className={`mb-2 ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                    {isCorrect ? '✅ Correto!' : '❌ Incorreto!'}
                  </p>
                  <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                </motion.div>
              )}

              {showFeedback && (
                <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
                  {currentIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Score */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Pontuação: <span className="text-blue-600">{score}/{questions.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}