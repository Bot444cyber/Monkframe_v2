"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const helpers_1 = require("../utils/helpers");
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Total Revenue (Sum of COMPLETED payments)
        const [totalRevenueAgg] = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED'));
        const totalRevenue = parseFloat(totalRevenueAgg.amount || '0');
        // Calculate Revenue Change (This Month vs Last Month)
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const [thisMonthRevenueAgg] = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfThisMonth), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        const thisMonthRevenue = parseFloat(thisMonthRevenueAgg.amount || '0');
        const [lastMonthRevenueAgg] = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfLastMonth), (0, drizzle_orm_1.lte)(schema_1.payments.created_at, endOfLastMonth), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        const lastMonthRevenue = parseFloat(lastMonthRevenueAgg.amount || '0');
        let revenueChange = 0;
        if (lastMonthRevenue === 0) {
            revenueChange = thisMonthRevenue > 0 ? 100 : 0;
        }
        else {
            revenueChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        }
        const revenueChangeStr = (revenueChange >= 0 ? '+' : '') + revenueChange.toFixed(1) + '%';
        // 2. Active Users
        const [activeUsersRow] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.status, 'ACTIVE'));
        const activeUsers = activeUsersRow.value;
        // 3. Live UIs
        const [liveUisRow] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.uis);
        const liveUis = liveUisRow.value;
        // 4. Total Downloads
        const [totalDownloadsAgg] = yield db_1.db.select({ value: (0, drizzle_orm_1.sum)(schema_1.uis.downloads) }).from(schema_1.uis);
        const totalDownloads = parseInt(totalDownloadsAgg.value || '0');
        // 5. Engagement Rate
        // Logic: (Total Likes + Comments) / Total Downloads (approximate)
        const [totalLikesRow] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.likes);
        const totalLikes = totalLikesRow.value;
        const [totalCommentsRow] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.comments);
        const totalComments = totalCommentsRow.value;
        // Avoid division by zero
        const engagementRateValue = totalDownloads > 0
            ? ((totalLikes + totalComments) / totalDownloads * 100)
            : 0;
        const engagementRate = engagementRateValue.toFixed(1) + '%';
        // 6. Payment Status Distribution (For Financial Health)
        const paymentGroup = yield db_1.db.select({
            status: schema_1.payments.status,
            count: (0, drizzle_orm_1.count)()
        }).from(schema_1.payments).groupBy(schema_1.payments.status);
        const paymentStats = {
            completed: 0,
            pending: 0,
            failed: 0,
            canceled: 0
        };
        paymentGroup.forEach(p => {
            if (p.status === 'COMPLETED')
                paymentStats.completed = p.count;
            else if (p.status === 'PENDING')
                paymentStats.pending = p.count;
            else if (p.status === 'FAILED')
                paymentStats.failed = p.count;
            else if (p.status === 'REFUNDED')
                paymentStats.canceled = p.count;
        });
        // 7. Recent Activity (Notifications) — use leftJoin to avoid Drizzle broken sub-query
        const recentActivityRows = yield db_1.db
            .select({
            id: schema_1.notifications.id,
            type: schema_1.notifications.type,
            message: schema_1.notifications.message,
            created_at: schema_1.notifications.created_at,
            user_full_name: schema_1.users.full_name,
            ui_title: schema_1.uis.title,
        })
            .from(schema_1.notifications)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.user_id, schema_1.notifications.userId))
            .leftJoin(schema_1.uis, (0, drizzle_orm_1.eq)(schema_1.uis.id, schema_1.notifications.uiId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.created_at))
            .limit(10);
        const formattedActivities = recentActivityRows.map(act => ({
            id: act.id,
            type: act.type,
            message: act.message,
            time: act.created_at,
            user: act.user_full_name || 'System',
            uiTitle: act.ui_title
        }));
        // 8. Graph Data (Monthly Downloads based on COMPLETED Payments)
        // Taking last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Go back 5 months to include current month = 6 total
        sixMonthsAgo.setDate(1); // Start of that month
        sixMonthsAgo.setHours(0, 0, 0, 0);
        const monthlyPayments = yield db_1.db.query.payments.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, sixMonthsAgo), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')),
            columns: {
                created_at: true
            }
        });
        // Aggregate by month
        const graphMap = new Map();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // Helper: format date as local YYYY-MM-DD (avoids UTC timezone shift)
        const toLocalDateStr = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        // 9. Graph Data (Weekly Activity: Users, UIs & Revenue)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const graphData = [];
        // Generate last 7 days keys using LOCAL dates
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            graphData.push({
                day: days[d.getDay()],
                date: toLocalDateStr(d), // LOCAL date string to avoid UTC drift
                uis: 0,
                users: 0,
                volume: 0
            });
        }
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        // Fetch Metadata for last 7 days
        const recentUIs = yield db_1.db.query.uis.findMany({
            where: (0, drizzle_orm_1.gte)(schema_1.uis.created_at, sevenDaysAgo),
            columns: { created_at: true }
        });
        const recentUsers = yield db_1.db.query.users.findMany({
            where: (0, drizzle_orm_1.gte)(schema_1.users.created_at, sevenDaysAgo),
            columns: { created_at: true }
        });
        const recentPayments = yield db_1.db.query.payments.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, sevenDaysAgo), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')),
            columns: { created_at: true, amount: true }
        });
        // Map to graphData — use local date string to match keys
        recentUIs.forEach(item => {
            const dateStr = toLocalDateStr(new Date(item.created_at));
            const entry = graphData.find(g => g.date === dateStr);
            if (entry)
                entry.uis++;
        });
        recentUsers.forEach(item => {
            const dateStr = toLocalDateStr(new Date(item.created_at));
            const entry = graphData.find(g => g.date === dateStr);
            if (entry)
                entry.users++;
        });
        recentPayments.forEach(item => {
            const dateStr = toLocalDateStr(new Date(item.created_at));
            const entry = graphData.find(g => g.date === dateStr);
            if (entry)
                entry.volume += item.amount;
        });
        // Remove the 'date' field from final output if not needed, or keep it. Let's keep structure simple.
        const finalGraphData = graphData.map(({ day, uis, users, volume }) => ({ day, uis, users, volume }));
        // 10. Trending UIs
        const trendingUIs = yield db_1.db.query.uis.findMany({
            limit: 3,
            orderBy: [(0, drizzle_orm_1.desc)(schema_1.uis.likes)], // or downloads
            columns: {
                id: true,
                title: true,
                imageSrc: true,
                likes: true,
                downloads: true
            }
        });
        // 11. Daily Stats (Real-time for "Today")
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const [todayRevenueAgg] = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfToday), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        const todayRevenue = parseFloat(todayRevenueAgg.amount || '0');
        const [todayUsersRow] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.users).where((0, drizzle_orm_1.gte)(schema_1.users.created_at, startOfToday));
        const todayUsers = todayUsersRow.value;
        const [todayUIsRow] = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.uis).where((0, drizzle_orm_1.gte)(schema_1.uis.created_at, startOfToday));
        const todayUIs = todayUIsRow.value;
        const dailyStats = {
            revenue: todayRevenue,
            revenueGoal: 1000, // Hardcoded goal for demo
            users: todayUsers,
            usersGoal: 10,
            uis: todayUIs,
            uisGoal: 5
        };
        // 12. Intraday Graph Data (Hourly breakdown for today)
        const hourlyStats = [];
        // Fetch raw data for today to aggregate in memory (efficient for daily range)
        const todayPayments = yield db_1.db.query.payments.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfToday), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')),
            columns: { created_at: true, amount: true }
        });
        const todayUsersList = yield db_1.db.query.users.findMany({
            where: (0, drizzle_orm_1.gte)(schema_1.users.created_at, startOfToday),
            columns: { created_at: true }
        });
        const todayUIsList = yield db_1.db.query.uis.findMany({
            where: (0, drizzle_orm_1.gte)(schema_1.uis.created_at, startOfToday),
            columns: { created_at: true }
        });
        // Generate buckets for 00:00 to 23:00
        for (let i = 0; i < 24; i++) {
            const hourLabel = `${i.toString().padStart(2, '0')}:00`;
            // Filter counts for this hour
            const usersCount = todayUsersList.filter(u => new Date(u.created_at).getHours() === i).length;
            const uisCount = todayUIsList.filter(u => new Date(u.created_at).getHours() === i).length;
            const revenueSum = todayPayments
                .filter(p => new Date(p.created_at).getHours() === i)
                .reduce((acc, curr) => acc + curr.amount, 0);
            hourlyStats.push({
                day: hourLabel, // reusing 'day' key for XAxis compatibility with existing types/chart
                users: usersCount,
                uis: uisCount,
                volume: revenueSum
            });
        }
        res.status(200).json({
            status: true,
            data: {
                stats: [
                    { label: 'Total Revenue', value: totalRevenue.toLocaleString(), change: revenueChangeStr, color: 'emerald' },
                    { label: 'Active Users', value: activeUsers < 1000 ? activeUsers.toString() : (activeUsers / 1000).toFixed(1) + 'k', change: '+0', color: 'indigo' },
                    { label: 'Live UIs', value: liveUis.toString(), change: '+5.1%', color: 'amber' },
                    { label: 'Engagement Rate', value: engagementRate, change: '+1.2%', color: 'rose' },
                ],
                graphData: finalGraphData,
                hourlyStats,
                trendingUIs: trendingUIs.map(ui => (Object.assign(Object.assign({}, ui), { imageSrc: (0, helpers_1.transformToProxy)(ui.imageSrc, req) }))),
                dailyStats,
                paymentStatusDistribution: paymentStats,
                formattedActivities
            }
        });
    }
    catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});
exports.getStats = getStats;
