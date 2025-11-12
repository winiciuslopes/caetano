// API Client for Recyclhe Show Backend
import { projectId, publicAnonKey } from '../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-880f6dab`;

interface Player {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  level: number;
  createdAt: string;
}

interface Family {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  playerIds?: string[];
  players?: Player[];
}

interface GameProgress {
  playerId: string;
  game: string;
  level: number;
  completed: boolean;
  score: number;
  bestScore: number;
  completedAt?: string;
  attempts: number;
}

interface GameMetric {
  id?: string;
  playerId: string;
  playerName?: string;
  familyId?: string;
  game: string;
  level: number;
  questionId?: string;
  answer?: string;
  correct?: boolean;
  timeSeconds: number;
  score: number;
  timestamp?: string;
  additionalData?: any;
}

class APIClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed (${endpoint}):`, error);
      throw error;
    }
  }

  // ==================== FAMILY METHODS ====================

  async createFamily(name: string): Promise<{ family: Family }> {
    return this.request('/families', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getFamily(familyId: string): Promise<{ family: Family }> {
    return this.request(`/families/${familyId}`);
  }

  async getFamilyByCode(code: string): Promise<{ family: Family }> {
    return this.request(`/families/code/${code}`);
  }

  // ==================== PLAYER METHODS ====================

  async createPlayer(name: string, avatar: string, familyId: string): Promise<{ player: Player }> {
    return this.request('/players', {
      method: 'POST',
      body: JSON.stringify({ name, avatar, familyId }),
    });
  }

  async getPlayer(playerId: string): Promise<{ player: Player; familyId: string }> {
    return this.request(`/players/${playerId}`);
  }

  async updatePlayer(playerId: string, updates: Partial<Player>): Promise<{ player: Player }> {
    return this.request(`/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // ==================== PROGRESS METHODS ====================

  async saveProgress(
    playerId: string,
    game: string,
    level: number,
    score: number,
    completed: boolean = false
  ): Promise<{ progress: GameProgress }> {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify({ playerId, game, level, score, completed }),
    });
  }

  async getPlayerProgress(playerId: string): Promise<{ progress: GameProgress[] }> {
    return this.request(`/progress/${playerId}`);
  }

  async getGameProgress(playerId: string, game: string): Promise<{ progress: GameProgress[] }> {
    return this.request(`/progress/${playerId}/${game}`);
  }

  // ==================== METRICS METHODS ====================

  async saveMetric(metric: GameMetric): Promise<{ metric: GameMetric }> {
    return this.request('/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  }

  async getPlayerMetrics(playerId: string): Promise<{ metrics: GameMetric[] }> {
    return this.request(`/metrics/${playerId}`);
  }

  async getGameMetrics(playerId: string, game: string): Promise<{ metrics: GameMetric[] }> {
    return this.request(`/metrics/${playerId}/${game}`);
  }

  async exportMetrics(playerId: string, format: 'json' | 'csv' = 'json'): Promise<any> {
    const url = `${BASE_URL}/metrics/${playerId}/export?format=${format}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export metrics');
    }

    if (format === 'csv') {
      return await response.text();
    }

    return await response.json();
  }

  // ==================== RANKING METHODS ====================

  async getFamilyRanking(): Promise<{ ranking: any[] }> {
    return this.request('/ranking/families');
  }

  async getPlayerRanking(): Promise<{ ranking: Player[] }> {
    return this.request('/ranking/players');
  }

  async getFamilyPlayerRanking(familyId: string): Promise<{ ranking: Player[] }> {
    return this.request(`/ranking/family/${familyId}`);
  }

  // ==================== STATISTICS ====================

  async getStats(): Promise<{
    stats: {
      totalFamilies: number;
      totalPlayers: number;
      totalMetrics: number;
      totalPoints: number;
      averagePointsPerPlayer: number;
    }
  }> {
    return this.request('/stats');
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export types
export type { Player, Family, GameProgress, GameMetric };
