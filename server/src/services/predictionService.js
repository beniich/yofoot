import Match from '../models/Match.js';
import Team from '../models/Team.js';
import Prediction from '../models/Prediction.js';

class PredictionService {
    // ============================================================
    // PREDICT MATCH OUTCOME
    // ============================================================

    async predictMatch(matchId) {
        try {
            const match = await Match.findById(matchId)
                .populate('homeTeam.team')
                .populate('awayTeam.team');

            if (!match) {
                throw new Error('Match not found');
            }

            // Get team stats
            const homeStats = await this.getTeamStats(match.homeTeam.team);
            const awayStats = await this.getTeamStats(match.awayTeam.team);

            // Get head-to-head
            const h2h = await this.getHeadToHead(
                match.homeTeam.team,
                match.awayTeam.team
            );

            // Calculate probabilities
            const predictions = this.calculateProbabilities(
                homeStats,
                awayStats,
                h2h,
                true // home advantage
            );

            // Save prediction
            const prediction = await Prediction.create({
                match: matchId,
                predictions,
                confidence: predictions.confidence,
                factors: {
                    headToHead: h2h,
                    recentForm: {
                        home: homeStats.form,
                        away: awayStats.form,
                    },
                    homeAdvantage: 0.1,
                    averageGoals: {
                        home: homeStats.avgGoalsScored,
                        away: awayStats.avgGoalsScored,
                    },
                },
            });

            return prediction;
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    // ============================================================
    // GET TEAM STATS
    // ============================================================

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

        let wins = 0;
        let draws = 0;
        let losses = 0;
        let goalsScored = 0;
        let goalsConceded = 0;

        last5Matches.forEach((match) => {
            const isHome = match.homeTeam.team?.toString() === teamId.toString();
            const scored = isHome
                ? match.score.fulltime.home
                : match.score.fulltime.away;
            const conceded = isHome
                ? match.score.fulltime.away
                : match.score.fulltime.home;

            if (scored !== undefined && conceded !== undefined) {
                goalsScored += scored;
                goalsConceded += conceded;

                if (scored > conceded) wins++;
                else if (scored === conceded) draws++;
                else losses++;
            }
        });

        return {
            form: `${wins}W ${draws}D ${losses}L`,
            points: wins * 3 + draws,
            avgGoalsScored: last5Matches.length > 0 ? goalsScored / last5Matches.length : 0,
            avgGoalsConceded: last5Matches.length > 0 ? goalsConceded / last5Matches.length : 0,
            wins,
            draws,
            losses,
        };
    }

    // ============================================================
    // CALCULATE PROBABILITIES
    // ============================================================

    calculateProbabilities(homeStats, awayStats, h2h, homeAdvantage = true) {
        // Base probabilities
        let homeWin = 33.33;
        let draw = 33.33;
        let awayWin = 33.33;

        // Form factor (max 20%)
        const homeFormFactor = (homeStats.points / 15) * 20;
        const awayFormFactor = (awayStats.points / 15) * 20;

        homeWin += homeFormFactor;
        awayWin += awayFormFactor;

        // Home advantage (10%)
        if (homeAdvantage) {
            homeWin += 10;
            awayWin -= 5;
            draw -= 5;
        }

        // Head-to-head
        if (h2h.homeWins > h2h.awayWins) {
            homeWin += 5;
            awayWin -= 5;
        } else if (h2h.awayWins > h2h.homeWins) {
            awayWin += 5;
            homeWin -= 5;
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
            Math.abs(homeWin - awayWin) + (homeStats.points + awayStats.points) / 2
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

    // ============================================================
    // HEAD TO HEAD
    // ============================================================

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
            const homeScore = match.score.fulltime.home;
            const awayScore = match.score.fulltime.away;

            if (homeScore !== undefined && awayScore !== undefined) {
                if (homeScore > awayScore) {
                    if (match.homeTeam.team?.toString() === homeTeamId.toString()) {
                        homeWins++;
                    } else {
                        awayWins++;
                    }
                } else if (homeScore === awayScore) {
                    draws++;
                } else {
                    if (match.awayTeam.team?.toString() === homeTeamId.toString()) {
                        homeWins++;
                    } else {
                        awayWins++;
                    }
                }
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
