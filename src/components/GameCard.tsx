import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LucideIcon, Lock, Play, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  level: number;
  maxLevel: number;
  progress: number;
  onPlay: () => void;
  locked?: boolean;
}

export function GameCard({
  title,
  description,
  icon: Icon,
  color,
  level,
  maxLevel,
  progress,
  onPlay,
  locked = false
}: GameCardProps) {
  return (
    <motion.div
      whileHover={locked ? {} : { scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`transition-all shadow-md hover:shadow-xl border-2 ${
        locked 
          ? 'opacity-60 border-gray-300 bg-gray-50' 
          : 'border-green-200 bg-gradient-to-br from-white to-green-50/30'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            {/* Icon */}
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-xl blur-md opacity-30"
                style={{ backgroundColor: color }}
              ></div>
              <div 
                className="relative w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: locked 
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                    : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` 
                }}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Level Badge */}
            <Badge 
              variant={locked ? 'secondary' : 'default'}
              className={`${locked ? 'bg-gray-400' : ''} shadow-sm`}
              style={{ backgroundColor: locked ? undefined : color }}
            >
              {locked && <Lock className="w-3 h-3 mr-1" />}
              Nível {level}
            </Badge>
          </div>

          <CardTitle className="text-green-900">{title}</CardTitle>
          <CardDescription className="text-green-700">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Progress */}
            {!locked && progress > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Star className="w-3 h-3" style={{ color }} />
                    Progresso
                  </span>
                  <span className="font-semibold" style={{ color }}>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Play Button */}
            <Button
              onClick={onPlay}
              disabled={locked}
              className={`w-full shadow-md transition-all ${
                locked 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'hover:shadow-lg'
              }`}
              style={{ 
                backgroundColor: locked ? undefined : color,
                borderColor: locked ? undefined : color
              }}
            >
              {locked ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Bloqueado
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Jogar Agora
                </>
              )}
            </Button>

            {/* Locked Message */}
            {locked && (
              <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Complete o nível anterior com 90%+
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
