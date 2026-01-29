import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  apiFootballId: {
    type: Number,
    unique: true,
    sparse: true,
  },

  // Competition
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true,
  },
  season: Number,
  round: String,

  // Teams
  homeTeam: {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    name: String,
    logo: String,
  },
  awayTeam: {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    name: String,
    logo: String,
  },

  // Date & Time
  matchDate: {
    type: Date,
    required: true,
  },
  timezone: String,

  // Venue
  venue: {
    name: String,
    city: String,
  },

  // Status
  status: {
    type: String,
    enum: ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'],
    default: 'SCHEDULED',
  },
  elapsed: Number,

  // Score
  score: {
    halftime: {
      home: Number,
      away: Number,
    },
    fulltime: {
      home: Number,
      away: Number,
    },
    extratime: {
      home: Number,
      away: Number,
    },
    penalty: {
      home: Number,
      away: Number,
    },
  },

  // Goals
  goals: [{
    team: String,
    player: String,
    minute: Number,
    type: {
      type: String,
      enum: ['Normal Goal', 'Own Goal', 'Penalty'],
    },
  }],

  // Stats
  statistics: {
    homeTeam: {
      shotsOnGoal: Number,
      shotsOffGoal: Number,
      possession: Number,
      corners: Number,
      yellowCards: Number,
      redCards: Number,
    },
    awayTeam: {
      shotsOnGoal: Number,
      shotsOffGoal: Number,
      possession: Number,
      corners: Number,
      yellowCards: Number,
      redCards: Number,
    },
  },

  lastSyncedAt: Date,
}, {
  timestamps: true,
});

matchSchema.index({ league: 1, matchDate: -1 });
matchSchema.index({ status: 1, matchDate: 1 });
matchSchema.index({ 'homeTeam.team': 1 });
matchSchema.index({ 'awayTeam.team': 1 });

const Match = mongoose.model('Match', matchSchema);
export default Match;
