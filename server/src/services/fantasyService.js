import FantasyTeam from '../models/FantasyTeam.js';

class FantasyService {
    // ============================================================
    // CALCULATE PLAYER POINTS
    // ============================================================

    calculatePlayerPoints(playerStats, position) {
        let points = 0;

        // Base points for playing
        if (playerStats.minutesPlayed >= 60) points += 2;
        else if (playerStats.minutesPlayed > 0) points += 1;

        // Goals
        if (position === 'FWD') points += playerStats.goals * 4;
        else if (position === 'MID') points += playerStats.goals * 5;
        else if (position === 'DEF' || position === 'GK') points += playerStats.goals * 6;

        // Assists
        points += playerStats.assists * 3;

        // Clean sheet
        if ((position === 'DEF' || position === 'GK') && playerStats.cleanSheet) {
            points += 4;
        }

        // Yellow card
        if (playerStats.yellowCard) points -= 1;

        // Red card
        if (playerStats.redCard) points -= 3;

        return Math.max(0, points);
    }

    // ============================================================
    // UPDATE RANKINGS
    // ============================================================

    async updateRankings() {
        const teams = await FantasyTeam.find({})
            .sort({ totalPoints: -1 })
            .populate('user', 'country');

        // Global rankings
        teams.forEach((team, index) => {
            team.globalRank = index + 1;
        });

        await Promise.all(teams.map((team) => team.save()));
    }
}

export default new FantasyService();
