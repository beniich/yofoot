import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  fixtureId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  leagueId: {
    type: Number,
    required: true,
    index: true
  },
  leagueName: String,
  leagueLogo: String,
  leagueCountry: String,
  season: {
    type: Number,
    required: true
  },
  round: String,
  
  homeTeam: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    logo: String
  },
  awayTeam: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    logo: String
  },
  
  score: {
    halftime: {
      home: { type: Number, default: null },
      away: { type: Number, default: null }
    },
    fulltime: {
      home: { type: Number, default: null },
      away: { type: Number, default: null }
    },
    extratime: {
      home: { type: Number, default: null },
      away: { type: Number, default: null }
    },
    penalty: {
      home: { type: Number, default: null },
      away: { type: Number, default: null }
    }
  },
  
  status: {
    type: String,
    enum: ['TBD', 'NS', '1H', 'HT', '2H', 'ET', 'P', 'FT', 'AET', 'PEN', 'BT', 'SUSP', 'INT', 'PST', 'CANC', 'ABD', 'AWD', 'WO', 'LIVE'],
    default: 'NS',
    required: true
  },
  
  statusLong: String,
  elapsed: Number, // Minutes écoulées
  
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  
  venue: {
    name: String,
    city: String
  },
  
  referee: String,
  
  // Statistiques du match
  statistics: {
    shotsOnGoal: {
      home: Number,
      away: Number
    },
    shotsOffGoal: {
      home: Number,
      away: Number
    },
    totalShots: {
      home: Number,
      away: Number
    },
    blockedShots: {
      home: Number,
      away: Number
    },
    shotsInsideBox: {
      home: Number,
      away: Number
    },
    shotsOutsideBox: {
      home: Number,
      away: Number
    },
    fouls: {
      home: Number,
      away: Number
    },
    cornerKicks: {
      home: Number,
      away: Number
    },
    offsides: {
      home: Number,
      away: Number
    },
    ballPossession: {
      home: String, // "65%"
      away: String
    },
    yellowCards: {
      home: Number,
      away: Number
    },
    redCards: {
      home: Number,
      away: Number
    },
    saves: {
      home: Number,
      away: Number
    },
    totalPasses: {
      home: Number,
      away: Number
    },
    accuratePasses: {
      home: Number,
      away: Number
    }
  },
  
  // Événements du match
  events: [{
    time: Number,
    team: String,
    player: String,
    assist: String,
    type: {
      type: String,
      enum: ['Goal', 'Card', 'subst', 'Var']
    },
    detail: String // 'Normal Goal', 'Yellow Card', etc.
  }],
  
  // Prédictions IA
  aiPrediction: {
    homeWinProbability: Number,
    drawProbability: Number,
    awayWinProbability: Number,
    predictedScore: {
      home: Number,
      away: Number
    },
    confidence: Number,
    lastUpdated: Date
  },
  
  // Métadonnées
  trending: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes composés pour requêtes complexes
matchSchema.index({ startTime: -1, status: 1 });
matchSchema.index({ leagueId: 1, season: 1 });
matchSchema.index({ 'homeTeam.id': 1 });
matchSchema.index({ 'awayTeam.id': 1 });
matchSchema.index({ status: 1, startTime: -1 });

// Virtual pour savoir si le match est en direct
matchSchema.virtual('isLive').get(function() {
  return ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(this.status);
});

// Virtual pour le résultat
matchSchema.virtual('result').get(function() {
  if (!this.score.fulltime.home === null) return null;
  
  if (this.score.fulltime.home > this.score.fulltime.away) return 'home';
  if (this.score.fulltime.home < this.score.fulltime.away) return 'away';
  return 'draw';
});

// Méthode pour incrémenter le compteur de vues
matchSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Méthode statique pour récupérer les matchs du jour
matchSchema.statics.getTodayMatches = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    startTime: {
      $gte: today,
      $lt: tomorrow
    }
  }).sort({ startTime: 1 });
};

// Méthode statique pour récupérer les matchs en direct
matchSchema.statics.getLiveMatches = function() {
  return this.find({
    status: { $in: ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'] }
  }).sort({ startTime: 1 });
};

// Méthode statique pour récupérer les matchs à venir
matchSchema.statics.getUpcomingMatches = function(limit = 10) {
  return this.find({
    startTime: { $gt: new Date() },
    status: { $in: ['TBD', 'NS'] }
  })
  .sort({ startTime: 1 })
  .limit(limit);
};

// Méthode statique pour matchs par équipe
matchSchema.statics.getTeamMatches = function(teamId, limit = 5) {
  return this.find({
    $or: [
      { 'homeTeam.id': teamId },
      { 'awayTeam.id': teamId }
    ]
  })
  .sort({ startTime: -1 })
  .limit(limit);
};

// Inclure les virtuals
matchSchema.set('toJSON', { virtuals: true });
matchSchema.set('toObject', { virtuals: true });

const Match = mongoose.model('Match', matchSchema);

export default Match;
