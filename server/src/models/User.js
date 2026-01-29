import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Ne pas retourner le password par défaut
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'elite'],
    default: 'free'
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'past_due'],
    default: 'inactive'
  },
  avatar: {
    type: String,
    default: function () {
      return `https://ui-avatars.com/api/?background=135bec&color=fff&name=${this.username}`;
    }
  },
  favoriteTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  favoriteLeagues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  }],
  favoritePlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  pushToken: {
    type: String,
    default: null
  },
  notificationSettings: {
    matchStart: { type: Boolean, default: true },
    goals: { type: Boolean, default: true },
    matchResult: { type: Boolean, default: true },
    news: { type: Boolean, default: false }
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  fantasyTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FantasyTeam'
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      matchAlerts: { type: Boolean, default: true }
    },
    language: {
      type: String,
      default: 'fr',
      enum: ['fr', 'en', 'es', 'de', 'it']
    },
    timezone: {
      type: String,
      default: 'Europe/Paris'
    }
  },
  stats: {
    predictionsCount: { type: Number, default: 0 },
    correctPredictions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes pour performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ plan: 1 });
userSchema.index({ createdAt: -1 });

// Hash password avant sauvegarde
userSchema.pre('save', async function (next) {
  // Ne hash que si le password est modifié
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Méthode pour obtenir les infos publiques
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    plan: this.plan,
    avatar: this.avatar,
    subscriptionStatus: this.subscriptionStatus,
    favoriteTeams: this.favoriteTeams,
    favoriteLeagues: this.favoriteLeagues,
    stats: this.stats,
    createdAt: this.createdAt
  };
};

// Méthode pour vérifier si l'utilisateur a accès à une fonctionnalité
userSchema.methods.hasAccess = function (feature) {
  const features = {
    free: ['basic_predictions', 'live_scores', 'limited_chat'],
    pro: ['basic_predictions', 'live_scores', 'limited_chat', 'advanced_predictions', 'full_chat', 'analytics'],
    elite: ['basic_predictions', 'live_scores', 'limited_chat', 'advanced_predictions', 'full_chat', 'analytics', 'expert_tips', 'private_leagues', 'priority_support']
  };

  return features[this.plan]?.includes(feature) || false;
};

// Méthode pour mettre à jour la précision des prédictions
userSchema.methods.updatePredictionStats = function (isCorrect) {
  this.stats.predictionsCount += 1;
  if (isCorrect) {
    this.stats.correctPredictions += 1;
  }
  this.stats.accuracy = (this.stats.correctPredictions / this.stats.predictionsCount * 100).toFixed(2);
  return this.save();
};

// Méthode statique pour trouver les utilisateurs premium
userSchema.statics.findPremiumUsers = function () {
  return this.find({ plan: { $in: ['pro', 'elite'] }, isActive: true });
};

// Virtual pour calculer le niveau de l'utilisateur
userSchema.virtual('level').get(function () {
  if (this.stats.predictionsCount < 10) return 'Débutant';
  if (this.stats.predictionsCount < 50) return 'Intermédiaire';
  if (this.stats.predictionsCount < 100) return 'Avancé';
  return 'Expert';
});

// Inclure les virtuals dans JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
