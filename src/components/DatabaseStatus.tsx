import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Database, Check, X, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import { Button } from './ui/button';

/**
 * Componente para mostrar status da conexão com Supabase
 * Adicione no canto da tela para monitoramento
 */
export function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [stats, setStats] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const health = await apiClient.healthCheck();
      const statsData = await apiClient.getStats();
      
      if (health.status === 'ok') {
        setStatus('online');
        setStats(statsData.stats);
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error('Database connection check failed:', error);
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar a cada 60 segundos
    const interval = setInterval(checkConnection, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500 hover:bg-green-600';
      case 'offline': return 'bg-red-500 hover:bg-red-600';
      case 'checking': return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online': return <Check className="w-3 h-3" />;
      case 'offline': return <X className="w-3 h-3" />;
      case 'checking': return <Loader2 className="w-3 h-3 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'BD Online';
      case 'offline': return 'BD Offline';
      case 'checking': return 'Verificando...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className={`${getStatusColor()} text-white border-0 shadow-lg`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <Database className="w-3 h-3 mr-1" />
        {getStatusIcon()}
        <span className="ml-1 text-xs">{getStatusText()}</span>
      </Button>

      {showDetails && stats && status === 'online' && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-2xl p-4 border-2 border-green-300 min-w-[200px]">
          <h4 className="font-semibold text-sm text-green-800 mb-2 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Estatísticas do BD
          </h4>
          <div className="space-y-1 text-xs text-gray-700">
            <div className="flex justify-between">
              <span>Famílias:</span>
              <span className="font-semibold">{stats.totalFamilies}</span>
            </div>
            <div className="flex justify-between">
              <span>Jogadores:</span>
              <span className="font-semibold">{stats.totalPlayers}</span>
            </div>
            <div className="flex justify-between">
              <span>Métricas:</span>
              <span className="font-semibold">{stats.totalMetrics}</span>
            </div>
            <div className="flex justify-between">
              <span>Pontos Totais:</span>
              <span className="font-semibold">{stats.totalPoints}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-xs"
            onClick={checkConnection}
          >
            🔄 Atualizar
          </Button>
        </div>
      )}

      {showDetails && status === 'offline' && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-2xl p-4 border-2 border-red-300 min-w-[200px]">
          <h4 className="font-semibold text-sm text-red-800 mb-2">
            ⚠️ Banco Offline
          </h4>
          <p className="text-xs text-gray-700 mb-3">
            Não foi possível conectar ao Supabase.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={checkConnection}
          >
            🔄 Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Versão compacta - apenas ícone
 */
export function DatabaseStatusMini() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const health = await apiClient.healthCheck();
        setStatus(health.status === 'ok' ? 'online' : 'offline');
      } catch {
        setStatus('offline');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 60000);
    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'checking': return 'text-yellow-500';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'online': return <Check className="w-4 h-4" />;
      case 'offline': return <X className="w-4 h-4" />;
      case 'checking': return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  return (
    <div className={`${getColor()} flex items-center gap-1`} title={`Supabase: ${status}`}>
      <Database className="w-4 h-4" />
      {getIcon()}
    </div>
  );
}
