import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==================== INTERFACES ====================

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
  playerIds: string[]; // Store only IDs to avoid duplication
}

interface GameProgress {
  playerId: string;
  game: string; // 'quiz' | 'sorting' | 'route' | 'memory' | 'composting'
  level: number; // 1-10
  completed: boolean;
  score: number;
  bestScore: number;
  completedAt?: string;
  attempts: number;
}

interface GameMetric {
  id: string;
  playerId: string;
  playerName: string;
  familyId: string;
  game: string;
  level: number;
  questionId?: string;
  answer?: string;
  correct?: boolean;
  timeSeconds: number;
  score: number;
  timestamp: string;
  additionalData?: any; // For game-specific metrics
}

// ==================== UTILITY FUNCTIONS ====================

function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function ensureUniqueCode(): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateCode();
    const existing = await kv.get(`family:code:${code}`);
    if (!existing) {
      return code;
    }
    attempts++;
  }
  throw new Error('Failed to generate unique family code');
}

// ==================== FAMILY ENDPOINTS ====================

// Create a new family
app.post("/make-server-880f6dab/families", async (c) => {
  try {
    const { name } = await c.req.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return c.json({ error: 'Family name is required' }, 400);
    }

    const familyId = generateId();
    const code = await ensureUniqueCode();
    
    const family: Family = {
      id: familyId,
      name: name.trim(),
      code,
      createdAt: new Date().toISOString(),
      playerIds: []
    };

    await kv.set(`family:${familyId}`, family);
    await kv.set(`family:code:${code}`, familyId);

    console.log(`Family created: ${familyId} (${code})`);
    
    return c.json({ family }, 201);
  } catch (error) {
    console.error('Error creating family:', error);
    return c.json({ error: 'Failed to create family', details: error.message }, 500);
  }
});

// Get family by ID
app.get("/make-server-880f6dab/families/:id", async (c) => {
  try {
    const familyId = c.req.param('id');
    const family = await kv.get(`family:${familyId}`);
    
    if (!family) {
      return c.json({ error: 'Family not found' }, 404);
    }

    // Get all players for this family
    const players = await Promise.all(
      family.playerIds.map(async (playerId: string) => {
        return await kv.get(`player:${playerId}`);
      })
    );

    return c.json({ 
      family: {
        ...family,
        players: players.filter(p => p !== null)
      }
    });
  } catch (error) {
    console.error('Error getting family:', error);
    return c.json({ error: 'Failed to get family', details: error.message }, 500);
  }
});

// Get family by code
app.get("/make-server-880f6dab/families/code/:code", async (c) => {
  try {
    const code = c.req.param('code').toUpperCase();
    const familyId = await kv.get(`family:code:${code}`);
    
    if (!familyId) {
      return c.json({ error: 'Family not found with this code' }, 404);
    }

    const family = await kv.get(`family:${familyId}`);
    
    if (!family) {
      return c.json({ error: 'Family data corrupted' }, 500);
    }

    // Get all players for this family
    const players = await Promise.all(
      family.playerIds.map(async (playerId: string) => {
        return await kv.get(`player:${playerId}`);
      })
    );

    return c.json({ 
      family: {
        ...family,
        players: players.filter(p => p !== null)
      }
    });
  } catch (error) {
    console.error('Error getting family by code:', error);
    return c.json({ error: 'Failed to get family', details: error.message }, 500);
  }
});

// ==================== PLAYER ENDPOINTS ====================

// Create a new player
app.post("/make-server-880f6dab/players", async (c) => {
  try {
    const { name, avatar, familyId } = await c.req.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return c.json({ error: 'Player name is required' }, 400);
    }
    
    if (!familyId) {
      return c.json({ error: 'Family ID is required' }, 400);
    }

    // Verify family exists
    const family = await kv.get(`family:${familyId}`);
    if (!family) {
      return c.json({ error: 'Family not found' }, 404);
    }

    const playerId = generateId();
    
    const player: Player = {
      id: playerId,
      name: name.trim(),
      avatar: avatar || '👤',
      totalPoints: 0,
      level: 1,
      createdAt: new Date().toISOString()
    };

    // Save player
    await kv.set(`player:${playerId}`, player);
    
    // Add player to family
    family.playerIds.push(playerId);
    await kv.set(`family:${familyId}`, family);

    // Link player to family
    await kv.set(`player:${playerId}:family`, familyId);

    console.log(`Player created: ${playerId} in family ${familyId}`);
    
    return c.json({ player }, 201);
  } catch (error) {
    console.error('Error creating player:', error);
    return c.json({ error: 'Failed to create player', details: error.message }, 500);
  }
});

// Get player by ID
app.get("/make-server-880f6dab/players/:id", async (c) => {
  try {
    const playerId = c.req.param('id');
    const player = await kv.get(`player:${playerId}`);
    
    if (!player) {
      return c.json({ error: 'Player not found' }, 404);
    }

    const familyId = await kv.get(`player:${playerId}:family`);
    
    return c.json({ player, familyId });
  } catch (error) {
    console.error('Error getting player:', error);
    return c.json({ error: 'Failed to get player', details: error.message }, 500);
  }
});

// Update player stats (points, level)
app.put("/make-server-880f6dab/players/:id", async (c) => {
  try {
    const playerId = c.req.param('id');
    const updates = await c.req.json();
    
    const player = await kv.get(`player:${playerId}`);
    
    if (!player) {
      return c.json({ error: 'Player not found' }, 404);
    }

    const updatedPlayer = {
      ...player,
      ...updates,
      id: playerId, // Ensure ID cannot be changed
      createdAt: player.createdAt // Ensure createdAt cannot be changed
    };

    await kv.set(`player:${playerId}`, updatedPlayer);

    console.log(`Player updated: ${playerId}`);
    
    return c.json({ player: updatedPlayer });
  } catch (error) {
    console.error('Error updating player:', error);
    return c.json({ error: 'Failed to update player', details: error.message }, 500);
  }
});

// ==================== GAME PROGRESS ENDPOINTS ====================

// Save or update game progress
app.post("/make-server-880f6dab/progress", async (c) => {
  try {
    const { playerId, game, level, score, completed } = await c.req.json();
    
    if (!playerId || !game || !level) {
      return c.json({ error: 'playerId, game, and level are required' }, 400);
    }

    const progressKey = `progress:${playerId}:${game}:${level}`;
    const existingProgress = await kv.get(progressKey) || {};

    const progress: GameProgress = {
      playerId,
      game,
      level,
      completed: completed || existingProgress.completed || false,
      score: score || 0,
      bestScore: Math.max(score || 0, existingProgress.bestScore || 0),
      attempts: (existingProgress.attempts || 0) + 1,
      completedAt: completed ? new Date().toISOString() : existingProgress.completedAt
    };

    await kv.set(progressKey, progress);

    // Update player's total points if score improved
    if (score && score > (existingProgress.bestScore || 0)) {
      const player = await kv.get(`player:${playerId}`);
      if (player) {
        const pointsGained = score - (existingProgress.bestScore || 0);
        player.totalPoints += pointsGained;
        
        // Update level based on total points (10 points per level)
        player.level = Math.floor(player.totalPoints / 10) + 1;
        
        await kv.set(`player:${playerId}`, player);
      }
    }

    console.log(`Progress saved: ${playerId} - ${game} level ${level}`);
    
    return c.json({ progress });
  } catch (error) {
    console.error('Error saving progress:', error);
    return c.json({ error: 'Failed to save progress', details: error.message }, 500);
  }
});

// Get all progress for a player
app.get("/make-server-880f6dab/progress/:playerId", async (c) => {
  try {
    const playerId = c.req.param('playerId');
    
    // Get all progress entries for this player
    const allProgress = await kv.getByPrefix(`progress:${playerId}:`);
    
    return c.json({ progress: allProgress });
  } catch (error) {
    console.error('Error getting progress:', error);
    return c.json({ error: 'Failed to get progress', details: error.message }, 500);
  }
});

// Get progress for specific game
app.get("/make-server-880f6dab/progress/:playerId/:game", async (c) => {
  try {
    const playerId = c.req.param('playerId');
    const game = c.req.param('game');
    
    const allProgress = await kv.getByPrefix(`progress:${playerId}:${game}:`);
    
    return c.json({ progress: allProgress });
  } catch (error) {
    console.error('Error getting game progress:', error);
    return c.json({ error: 'Failed to get game progress', details: error.message }, 500);
  }
});

// ==================== METRICS ENDPOINTS ====================

// Save game metric
app.post("/make-server-880f6dab/metrics", async (c) => {
  try {
    const metricData = await c.req.json();
    
    const { playerId, game } = metricData;
    
    if (!playerId || !game) {
      return c.json({ error: 'playerId and game are required' }, 400);
    }

    // Get player and family info
    const player = await kv.get(`player:${playerId}`);
    const familyId = await kv.get(`player:${playerId}:family`);

    const metricId = generateId();
    const metric: GameMetric = {
      id: metricId,
      playerId,
      playerName: player?.name || 'Unknown',
      familyId: familyId || 'unknown',
      timestamp: new Date().toISOString(),
      ...metricData
    };

    const metricKey = `metric:${playerId}:${game}:${metricId}`;
    await kv.set(metricKey, metric);

    console.log(`Metric saved: ${metricKey}`);
    
    return c.json({ metric }, 201);
  } catch (error) {
    console.error('Error saving metric:', error);
    return c.json({ error: 'Failed to save metric', details: error.message }, 500);
  }
});

// Get all metrics for a player
app.get("/make-server-880f6dab/metrics/:playerId", async (c) => {
  try {
    const playerId = c.req.param('playerId');
    
    const metrics = await kv.getByPrefix(`metric:${playerId}:`);
    
    return c.json({ metrics });
  } catch (error) {
    console.error('Error getting metrics:', error);
    return c.json({ error: 'Failed to get metrics', details: error.message }, 500);
  }
});

// Get metrics for a specific game
app.get("/make-server-880f6dab/metrics/:playerId/:game", async (c) => {
  try {
    const playerId = c.req.param('playerId');
    const game = c.req.param('game');
    
    const metrics = await kv.getByPrefix(`metric:${playerId}:${game}:`);
    
    return c.json({ metrics });
  } catch (error) {
    console.error('Error getting game metrics:', error);
    return c.json({ error: 'Failed to get game metrics', details: error.message }, 500);
  }
});

// Export all metrics for a player (for CSV/JSON download)
app.get("/make-server-880f6dab/metrics/:playerId/export", async (c) => {
  try {
    const playerId = c.req.param('playerId');
    const format = c.req.query('format') || 'json'; // json or csv
    
    const metrics = await kv.getByPrefix(`metric:${playerId}:`);
    
    if (format === 'csv') {
      // Convert to CSV
      if (metrics.length === 0) {
        return c.text('No data available');
      }

      const headers = Object.keys(metrics[0]);
      const csvRows = [headers.join(',')];
      
      for (const metric of metrics) {
        const values = headers.map(header => {
          const value = metric[header];
          return typeof value === 'object' ? JSON.stringify(value) : value;
        });
        csvRows.push(values.join(','));
      }
      
      return c.text(csvRows.join('\n'), 200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="metrics-${playerId}.csv"`
      });
    }
    
    // Default: JSON
    return c.json({ metrics }, 200, {
      'Content-Disposition': `attachment; filename="metrics-${playerId}.json"`
    });
  } catch (error) {
    console.error('Error exporting metrics:', error);
    return c.json({ error: 'Failed to export metrics', details: error.message }, 500);
  }
});

// ==================== RANKING ENDPOINTS ====================

// Get family ranking
app.get("/make-server-880f6dab/ranking/families", async (c) => {
  try {
    // Get all families
    const allFamilies = await kv.getByPrefix('family:');
    
    // Filter out code mappings (those that are just strings, not objects)
    const families = allFamilies.filter((f: any) => typeof f === 'object' && f.id);
    
    // Calculate total points for each family
    const familyScores = await Promise.all(
      families.map(async (family: Family) => {
        let totalPoints = 0;
        
        // Get all players in the family
        const players = await Promise.all(
          family.playerIds.map(async (playerId: string) => {
            return await kv.get(`player:${playerId}`);
          })
        );
        
        // Sum up points
        for (const player of players) {
          if (player) {
            totalPoints += player.totalPoints || 0;
          }
        }
        
        return {
          family,
          totalPoints,
          playerCount: players.filter(p => p !== null).length
        };
      })
    );
    
    // Sort by total points
    familyScores.sort((a, b) => b.totalPoints - a.totalPoints);
    
    return c.json({ ranking: familyScores });
  } catch (error) {
    console.error('Error getting family ranking:', error);
    return c.json({ error: 'Failed to get family ranking', details: error.message }, 500);
  }
});

// Get player ranking (all players)
app.get("/make-server-880f6dab/ranking/players", async (c) => {
  try {
    // Get all players
    const allPlayers = await kv.getByPrefix('player:');
    
    // Filter out family links (those that are just strings, not objects)
    const players = allPlayers.filter((p: any) => typeof p === 'object' && p.id);
    
    // Sort by total points
    players.sort((a: Player, b: Player) => b.totalPoints - a.totalPoints);
    
    return c.json({ ranking: players });
  } catch (error) {
    console.error('Error getting player ranking:', error);
    return c.json({ error: 'Failed to get player ranking', details: error.message }, 500);
  }
});

// Get player ranking within a family
app.get("/make-server-880f6dab/ranking/family/:familyId", async (c) => {
  try {
    const familyId = c.req.param('familyId');
    
    const family = await kv.get(`family:${familyId}`);
    
    if (!family) {
      return c.json({ error: 'Family not found' }, 404);
    }
    
    // Get all players in the family
    const players = await Promise.all(
      family.playerIds.map(async (playerId: string) => {
        return await kv.get(`player:${playerId}`);
      })
    );
    
    // Filter out nulls and sort by points
    const validPlayers = players.filter(p => p !== null);
    validPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
    
    return c.json({ ranking: validPlayers });
  } catch (error) {
    console.error('Error getting family player ranking:', error);
    return c.json({ error: 'Failed to get family player ranking', details: error.message }, 500);
  }
});

// ==================== HEALTH CHECK ====================

app.get("/make-server-880f6dab/health", (c) => {
  return c.json({ status: "ok", service: "Recyclhe Show API" });
});

// ==================== STATISTICS ====================

// Get overall statistics
app.get("/make-server-880f6dab/stats", async (c) => {
  try {
    const allFamilies = await kv.getByPrefix('family:');
    const families = allFamilies.filter((f: any) => typeof f === 'object' && f.id);
    
    const allPlayers = await kv.getByPrefix('player:');
    const players = allPlayers.filter((p: any) => typeof p === 'object' && p.id);
    
    const allMetrics = await kv.getByPrefix('metric:');
    
    let totalPoints = 0;
    for (const player of players) {
      totalPoints += player.totalPoints || 0;
    }
    
    return c.json({
      stats: {
        totalFamilies: families.length,
        totalPlayers: players.length,
        totalMetrics: allMetrics.length,
        totalPoints,
        averagePointsPerPlayer: players.length > 0 ? Math.round(totalPoints / players.length) : 0
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return c.json({ error: 'Failed to get stats', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);
