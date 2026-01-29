import Match from '../models/Match.js';
import Team from '../models/Team.js';
import Prediction from '../models/Prediction.js';

class PredictionService {
    /**
     * Predict match outcome based on stats and H2H
     * @param {string} matchId 
     */
    async predictMatch(matchId) {
        try {
            const match = await Match.findById(matchId)
                .populate('homeTeam.team')
                .populate('awayTeam.team');

            if (!match) throw new Error('Match not found');

            // Get team stats
            const homeStats = await this.getTeamStats(match.homeTeam.team._id);
            const awayStats = await this.getTeamStats(match.awayTeam.team._id);

            // Get head-to-head
            const h2h = await this.getHeadToHead(
                match.homeTeam.team._id,
                match.awayTeam.team._id
            );

            // Calculate probabilities
            const predictions = this.calculateProbabilities(
                homeStats,
                awayStats,
                h2h,
                true // home advantage
            );

            // Save or update prediction
            const prediction = await Prediction.findOneAndUpdate(
                { match: matchId },
                {
                    match: matchId,
                    predictions,
                    confidence: predictions.confidence,
                    factors: {
                        headToHead: h2h,
                        recentForm: {
                            home: homeStats.form,
                            away: awayStats.form,
                        },
                        homeAdvantage: 0.1, // 10% boost
                        averageGoals: {
                            home: homeStats.avgGoalsScored,
                            away: awayStats.avgGoalsScored,
                        },
                    },
                },
                { upsert: true, new: true }
            );

            return prediction;
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    /**
     * Get team statistics for the last 5 matches
     * @param {string} teamId 
     */
    async getTeamStats(teamId) {
        const last5Matches = await Match.find({
            $or: [
                { 'homeTeam.team': teamId },
                { 'awayTeam.team': teamId },
            ],
            status: 'FINISHED',
        })
            .sort({ matchDate: -1 })
            .limit(5);

        if (last5Matches.length === 0) {
            return {
                form: 'N/A',
                points: 0,
                avgGoalsScored: 0,
                avgGoalsConceded: 0,
                wins: 0,
                draws: 0,
                losses: 0,
            };
        }

        let wins = 0;
        let draws = 0;
        let losses = 0;
        let goalsScored = 0;
        let goalsConceded = 0;

        last5Matches.forEach((match) => {
            const isHome = match.homeTeam.team.toString() === teamId.toString();
            const scored = isHome ? (match.score?.fulltime?.home || 0) : (match.score?.fulltime?.away || 0);
            const conceded = isHome ? (match.score?.fulltime?.away || 0) : (match.score?.fulltime?.home || 0);

            goalsScored += scored;
            goalsConceded += conceded;

            if (scored > conceded) wins++;
            else if (scored === conceded) draws++;
            else losses++;
        });

        return {
            form: `${wins}W ${draws}D ${losses}L`,
            points: wins * 3 + draws,
            avgGoalsScored: goalsScored / last5Matches.length,
            avgGoalsConceded: goalsConceded / last5Matches.length,
            wins,
            draws,
            losses,
        };
    }

    /**
     * Complex algorithmic calculation of probabilities
     */
    calculateProbabilities(homeStats, awayStats, h2h, homeAdvantage = true) {
        // Base probabilities
        let homeWin = 33.33;
        let draw = 33.33;
        let awayWin = 33.33;

        // Form factor
        const homeFormFactor = (homeStats.points / 15) * 20; // Max 20%
        const awayFormFactor = (awayStats.points / 15) * 20;

        homeWin += homeFormFactor;
        awayWin += awayFormFactor;

        // Home advantage
        if (homeAdvantage) {
            homeWin += 10;
            awayWin -= 5;
            draw -= 5;
        }

        // Head-to-head
        if (h2h.totalMatches > 0) {
            if (h2h.homeWins > h2h.awayWins) {
                homeWin += 5;
                awayWin -= 5;
            } else if (h2h.awayWins > h2h.homeWins) {
                awayWin += 5;
                homeWin -= 5;
            }
        }

        // Normalize to 100%
        const total = homeWin + draw + awayWin;
        homeWin = (homeWin / total) * 100;
        draw = (draw / total) * 100;
        awayWin = (awayWin / total) * 100;

        // Expected score
        const expectedHomeGoals = homeStats.avgGoalsScored * 1.1; // Home boost
        const expectedAwayGoals = awayStats.avgGoalsScored;

        // Over/Under 2.5
        const totalExpected = expectedHomeGoals + expectedAwayGoals;
        const over2_5 = totalExpected > 2.5 ? 60 : 40;

        // Both teams score
        const bothScore =
            homeStats.avgGoalsScored > 0.8 && awayStats.avgGoalsScored > 0.8
                ? 65
                : 35;

        // Confidence (0-100)
        const confidence = Math.min(
            100,
            Math.abs(homeWin - awayWin) + (homeStats.points + (awayStats.points || 0)) / 2
        );

        return {
            homeWin: Math.round(homeWin * 10) / 10,
            draw: Math.round(draw * 10) / 10,
            awayWin: Math.round(awayWin * 10) / 10,
            expectedScore: {
                home: Math.round(expectedHomeGoals * 10) / 10,
                away: Math.round(expectedAwayGoals * 10) / 10,
            },
            overUnder: {
                over2_5: Math.round(over2_5),
                under2_5: Math.round(100 - over2_5),
            },
            bothTeamsScore: {
                yes: Math.round(bothScore),
                no: Math.round(100 - bothScore),
            },
            confidence: Math.round(confidence),
        };
    }

    /**
     * Get H2H history between two teams
     */
    async getHeadToHead(homeTeamId, awayTeamId) {
        const matches = await Match.find({
            $or: [
                {
                    'homeTeam.team': homeTeamId,
                    'awayTeam.team': awayTeamId,
                },
                {
                    'homeTeam.team': awayTeamId,
                    'awayTeam.team': homeTeamId,
                },
            ],
            status: 'FINISHED',
        })
            .sort({ matchDate: -1 })
            .limit(10);

        let homeWins = 0;
        let draws = 0;
        let awayWins = 0;

        matches.forEach((match) => {
            const homeScore = match.score?.fulltime?.home || 0;
            const awayScore = match.score?.fulltime?.away || 0;

            const isHomeTeamMatchesHome = match.homeTeam.team.toString() === homeTeamId.toString();

            if (homeScore > awayScore) {
                if (isHomeTeamMatchesHome) homeWins++;
                else awayWins++;
            } else if (homeScore === awayScore) {
                draws++;
            } else {
                if (isHomeTeamMatchesHome) awayWins++;
                else homeWins++;
            }
        });

        return {
            totalMatches: matches.length,
            homeWins,
            draws,
            awayWins,
        };
    }
}

export default new PredictionService();
