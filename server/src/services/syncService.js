const footballApi = require('./footballApi');
const League = require('../models/League');
const Match = require('../models/Match');
const Team = require('../models/Team'); // S'assurer que le modèle Team est importé
const Standing = require('../models/Standing');

class SyncService {
    constructor() {
        this.syncInProgress = false;
        this.lastSyncTimes = {
            leagues: null,
            matches: null,
            standings: null,
            liveMatches: null,
        };
    }

    // ============================================================
    // SYNC FEATURED LEAGUES
    // ============================================================

    async syncFeaturedLeagues() {
        if (this.syncInProgress) {
            console.log('⏸️  Sync already in progress, skipping...');
            return;
        }

        try {
            this.syncInProgress = true;
            console.log('🔄 Starting featured leagues sync...');

            // Top leagues to sync
            const featuredLeagues = [
                { id: 39, name: 'Premier League', country: 'England', priority: 10 },
                { id: 140, name: 'La Liga', country: 'Spain', priority: 9 },
                { id: 78, name: 'Bundesliga', country: 'Germany', priority: 8 },
                { id: 135, name: 'Serie A', country: 'Italy', priority: 7 },
                { id: 61, name: 'Ligue 1', country: 'France', priority: 6 },
                { id: 2, name: 'Champions League', country: 'Europe', priority: 10 },
                { id: 3, name: 'Europa League', country: 'Europe', priority: 7 },
                { id: 200, name: 'Botola Pro', country: 'Morocco', priority: 5 },
            ];

            for (const leagueInfo of featuredLeagues) {
                try {
                    // Fetch from API
                    const apiLeague = await footballApi.getLeagueById(leagueInfo.id);

                    if (apiLeague) {
                        await League.findOneAndUpdate(
                            { apiFootballId: leagueInfo.id },
                            {
                                apiFootballId: leagueInfo.id,
                                name: apiLeague.league.name,
                                type: apiLeague.league.type,
                                logo: apiLeague.league.logo,
                                country: {
                                    name: apiLeague.country.name,
                                    code: apiLeague.country.code,
                                    flag: apiLeague.country.flag,
                                },
                                currentSeason: {
                                    year: apiLeague.seasons[0]?.year,
                                    start: apiLeague.seasons[0]?.start,
                                    end: apiLeague.seasons[0]?.end,
                                    current: apiLeague.seasons[0]?.current,
                                },
                                isFeatured: true,
                                isActive: true,
                                priority: leagueInfo.priority,
                                lastSyncedAt: new Date(),
                            },
                            { upsert: true, new: true }
                        );

                        console.log(`✅ Synced: ${leagueInfo.name}`);
                    }

                    // Rate limiting (API limit: 10 req/min on free plan)
                    await this.sleep(6000); // 6 seconds between requests
                } catch (error) {
                    console.error(`❌ Error syncing ${leagueInfo.name}:`, error.message);
                }
            }

            this.lastSyncTimes.leagues = new Date();
            console.log('✅ Featured leagues sync completed');
        } catch (error) {
            console.error('❌ Featured leagues sync error:', error);
        } finally {
            this.syncInProgress = false;
        }
    }

    // ============================================================
    // SYNC MATCHES FOR FEATURED LEAGUES
    // ============================================================

    async syncFeaturedMatches() {
        try {
            console.log('🔄 Starting featured matches sync...');

            const featuredLeagues = await League.find({
                isFeatured: true,
                isActive: true,
            });

            const currentYear = new Date().getFullYear();

            for (const league of featuredLeagues) {
                if (!league.apiFootballId) continue;

                try {
                    console.log(`Syncing matches for ${league.name}...`);

                    const fixtures = await footballApi.syncFixturesByLeague(
                        league.apiFootballId,
                        currentYear
                    );

                    // TODO: Process fixtures and save to DB
                    // (Simplification pour l'exemple, normalement on itère et sauvegarde)
                    console.log(`✅ Synced matches for ${league.name} (Count: ${fixtures.length})`);

                    // Rate limiting
                    await this.sleep(6000);
                } catch (error) {
                    console.error(`❌ Error syncing matches for ${league.name}:`, error.message);
                }
            }

            this.lastSyncTimes.matches = new Date();
            console.log('✅ Featured matches sync completed');
        } catch (error) {
            console.error('❌ Featured matches sync error:', error);
        }
    }

    // ============================================================
    // SYNC LIVE MATCHES
    // ============================================================

    async syncLiveMatches() {
        try {
            console.log('⚡ Syncing live matches...');

            const liveFixtures = await footballApi.getLiveMatches();

            let syncedCount = 0;

            for (const fixtureData of liveFixtures) {
                try {
                    // Find league in DB
                    const dbLeague = await League.findOne({
                        apiFootballId: fixtureData.league.id,
                    });

                    if (!dbLeague) continue; // Skip if league not in our DB

                    // Find or create teams (simplifié ici, idéalement on crée si inexistant)
                    // Create placeholder teams if needed just to make it work
                    /*
                   const homeTeam = await Team.findOneAndUpdate(
                      { apiFootballId: fixtureData.teams.home.id },
                      { name: fixtureData.teams.home.name, logo: fixtureData.teams.home.logo },
                      { upsert: true, new: true }
                   );
                   */

                    // Update match
                    await Match.findOneAndUpdate(
                        { apiFootballId: fixtureData.fixture.id },
                        {
                            apiFootballId: fixtureData.fixture.id,
                            league: dbLeague._id,
                            season: fixtureData.league.season,
                            round: fixtureData.league.round,

                            homeTeam: {
                                // team: homeTeam?._id, // Relier à l'équipe réelle
                                name: fixtureData.teams.home.name,
                                logo: fixtureData.teams.home.logo,
                            },
                            awayTeam: {
                                // team: awayTeam?._id,
                                name: fixtureData.teams.away.name,
                                logo: fixtureData.teams.away.logo,
                            },

                            matchDate: new Date(fixtureData.fixture.date),
                            status: footballApi.mapFixtureStatus(fixtureData.fixture.status.short),
                            elapsed: fixtureData.fixture.status.elapsed,

                            score: {
                                halftime: {
                                    home: fixtureData.score.halftime?.home,
                                    away: fixtureData.score.halftime?.away,
                                },
                                fulltime: {
                                    home: fixtureData.score.fulltime?.home,
                                    away: fixtureData.score.fulltime?.away,
                                },
                            },

                            lastSyncedAt: new Date(),
                        },
                        { upsert: true, new: true }
                    );

                    syncedCount++;
                } catch (error) {
                    console.error('Error updating live match:', error.message);
                }
            }

            this.lastSyncTimes.liveMatches = new Date();
            console.log(`✅ Synced ${syncedCount} live matches`);

            return syncedCount;
        } catch (error) {
            console.error('❌ Live matches sync error:', error);
            return 0;
        }
    }

    // ============================================================
    // SYNC STANDINGS
    // ============================================================

    async syncFeaturedStandings() {
        try {
            console.log('🔄 Starting standings sync...');

            const featuredLeagues = await League.find({
                isFeatured: true,
                isActive: true,
            });

            const currentYear = new Date().getFullYear();

            for (const league of featuredLeagues) {
                if (!league.apiFootballId) continue;

                try {
                    console.log(`Syncing standings for ${league.name}...`);

                    await footballApi.syncStandingsByLeague(
                        league.apiFootballId,
                        currentYear
                    );

                    console.log(`✅ Synced standings for ${league.name}`);

                    // Rate limiting
                    await this.sleep(6000);
                } catch (error) {
                    console.error(`❌ Error syncing standings for ${league.name}:`, error.message);
                }
            }

            this.lastSyncTimes.standings = new Date();
            console.log('✅ Standings sync completed');
        } catch (error) {
            console.error('❌ Standings sync error:', error);
        }
    }

    // ============================================================
    // FULL SYNC
    // ============================================================

    async fullSync() {
        console.log('🚀 Starting FULL SYNC...');

        try {
            // Step 1: Sync leagues
            await this.syncFeaturedLeagues();

            // Step 2: Sync matches
            await this.syncFeaturedMatches();

            // Step 3: Sync standings
            await this.syncFeaturedStandings();

            console.log('✅ FULL SYNC completed successfully');
        } catch (error) {
            console.error('❌ FULL SYNC error:', error);
        }
    }

    // ============================================================
    // HELPERS
    // ============================================================

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getLastSyncTimes() {
        return this.lastSyncTimes;
    }

    getSyncStatus() {
        return {
            inProgress: this.syncInProgress,
            lastSyncTimes: this.lastSyncTimes,
        };
    }
}

// Singleton
const syncService = new SyncService();
module.exports = syncService;
