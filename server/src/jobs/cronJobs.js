import cron from 'node-cron';
import syncService from '../services/syncService.js';
import Match from '../models/Match.js';

class CronJobs {
    constructor() {
        this.jobs = [];
    }

    initializeJobs() {
        console.log('⏰ Initializing CRON jobs...');

        // 1. LIVE MATCHES - Every 30 seconds
        this.jobs.push(
            cron.schedule('*/30 * * * * *', async () => {
                try {
                    const count = await syncService.syncLiveMatches();
                    if (count > 0) {
                        console.log(`⚡ Live update: ${count} matches`);
                    }
                } catch (error) {
                    console.error('Live matches CRON error:', error);
                }
            })
        );

        // 2. UPCOMING MATCHES - Every 15 minutes
        this.jobs.push(
            cron.schedule('*/15 * * * *', async () => {
                try {
                    console.log('🔄 Updating upcoming matches...');
                    await syncService.syncFeaturedMatches();
                } catch (error) {
                    console.error('Upcoming matches CRON error:', error);
                }
            })
        );

        // 3. STANDINGS - Daily at 2 AM
        this.jobs.push(
            cron.schedule('0 2 * * *', async () => {
                try {
                    console.log('📊 Daily standings update...');
                    await syncService.syncFeaturedStandings();
                } catch (error) {
                    console.error('Standings CRON error:', error);
                }
            })
        );

        // 4. LEAGUES REFRESH - Weekly on Monday at 3 AM
        this.jobs.push(
            cron.schedule('0 3 * * 1', async () => {
                try {
                    console.log('🔄 Weekly leagues refresh...');
                    await syncService.syncFeaturedLeagues();
                } catch (error) {
                    console.error('Leagues CRON error:', error);
                }
            })
        );

        // 5. FULL SYNC - Weekly on Sunday at 4 AM
        this.jobs.push(
            cron.schedule('0 4 * * 0', async () => {
                try {
                    console.log('🚀 Weekly full sync...');
                    await syncService.fullSync();
                } catch (error) {
                    console.error('Full sync CRON error:', error);
                }
            })
        );

        // 6. CLEANUP OLD MATCHES - Daily at 5 AM
        this.jobs.push(
            cron.schedule('0 5 * * *', async () => {
                try {
                    console.log('🗑️  Cleaning old matches...');
                    await this.cleanupOldMatches();
                } catch (error) {
                    console.error('Cleanup CRON error:', error);
                }
            })
        );

        console.log(`✅ ${this.jobs.length} CRON jobs initialized`);
    }

    async cleanupOldMatches() {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const result = await Match.deleteMany({
            matchDate: { $lt: ninetyDaysAgo },
            status: 'FINISHED',
        });

        console.log(`🗑️  Deleted ${result.deletedCount} old matches`);
    }

    stopAllJobs() {
        console.log('⏸️  Stopping all CRON jobs...');
        this.jobs.forEach((job) => job.stop());
        console.log('✅ All CRON jobs stopped');
    }

    getJobsStatus() {
        return {
            totalJobs: this.jobs.length,
            jobs: [
                { name: 'Live Matches', schedule: 'Every 30 seconds', active: true },
                { name: 'Upcoming Matches', schedule: 'Every 15 minutes', active: true },
                { name: 'Standings', schedule: 'Daily at 2 AM', active: true },
                { name: 'Leagues Refresh', schedule: 'Weekly Monday 3 AM', active: true },
                { name: 'Full Sync', schedule: 'Weekly Sunday 4 AM', active: true },
                { name: 'Cleanup', schedule: 'Daily at 5 AM', active: true },
            ],
        };
    }
}

export default new CronJobs();
