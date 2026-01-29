import FantasyTeam from '../models/FantasyTeam.js';
import Player from '../models/Player.js';

class FantasyService {
    /**
     * Calculate player points based on match stats and position
     */
    calculatePlayerPoints(playerStats, position) {
        let points = 0;

        // Base points for playing
        if (playerStats.minutesPlayed >= 60) {
            points += 2;
        } else if (playerStats.minutesPlayed > 0) {
            points += 1;
        }

        // Goals
        if (position === 'FWD') {
            points += (playerStats.goals || 0) * 4;
        } else if (position === 'MID') {
            points += (playerStats.goals || 0) * 5;
        } else if (position === 'DEF' || position === 'GK') {
            points += (playerStats.goals || 0) * 6;
        }

        // Assists
        points += (playerStats.assists || 0) * 3;

        // Clean sheet (for defenders and goalkeepers)
        if ((position === 'DEF' || position === 'GK') && playerStats.cleanSheet) {
            points += 4;
        } else if (position === 'MID' && playerStats.cleanSheet) {
            points += 1;
        }

        // Saves (goalkeepers)
        if (position === 'GK') {
            points += Math.floor((playerStats.saves || 0) / 3); // 1 point per 3 saves
        }

        // Penalties
        if (playerStats.penaltySaved) points += 5;
        if (playerStats.penaltyMissed) points -= 2;

        // Cards
        if (playerStats.yellowCard) points -= 1;
        if (playerStats.redCard) points -= 3;

        // Own goal
        if (playerStats.ownGoal) points -= 2;

        // Goals conceded (for GK and DEF)
        if (position === 'GK' || position === 'DEF') {
            const goalsConceded = playerStats.goalsConceded || 0;
            points -= Math.floor(goalsConceded / 2); // -1 per 2 goals conceded
        }

        return Math.max(0, points);
    }

    /**
     * Update all fantasy teams for a specific gameweek
     */
    async updateGameweekPoints(gameweek, matchResults) {
        const fantasyTeams = await FantasyTeam.find({}).populate('startingEleven.player');

        for (const team of fantasyTeams) {
            let gameweekPoints = 0;

            for (const fantasyPlayer of team.startingEleven) {
                // Find player stats in matchResults
                const playerStats = matchResults.find(r => r.playerId.toString() === fantasyPlayer.player._id.toString());

                if (playerStats) {
                    let playerPoints = this.calculatePlayerPoints(playerStats, fantasyPlayer.position);
                    if (fantasyPlayer.isCaptain) playerPoints *= 2;
                    gameweekPoints += playerPoints;
                }
            }

            // Deduct points for extra transfers
            const extraTransfers = Math.max(0, team.transfersMade - team.freeTransfers);
            gameweekPoints -= extraTransfers * 4;

            // Update team
            team.gameweekPoints.push({
                gameweek,
                points: gameweekPoints,
                transfers: team.transfersMade,
            });
            team.totalPoints += gameweekPoints;
            team.transfersMade = 0;
            team.freeTransfers = 1;

            await team.save();
        }

        await this.updateRankings();
    }

    async updateRankings() {
        const teams = await FantasyTeam.find({}).sort({ totalPoints: -1 });
        for (let i = 0; i < teams.length; i++) {
            teams[i].globalRank = i + 1;
            await teams[i].save();
        }
    }
}

export default new FantasyService();
