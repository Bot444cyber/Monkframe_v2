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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        // 1. Total Revenue (Sum of COMPLETED payments)
        const totalRevenueAgg = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED'));
        const totalRevenue = parseFloat(((_a = totalRevenueAgg[0]) === null || _a === void 0 ? void 0 : _a.amount) || '0');
        // Calculate Revenue Change (This Month vs Last Month)
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const thisMonthRevenueAgg = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfThisMonth), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        const thisMonthRevenue = parseFloat(((_b = thisMonthRevenueAgg[0]) === null || _b === void 0 ? void 0 : _b.amount) || '0');
        const lastMonthRevenueAgg = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfLastMonth), (0, drizzle_orm_1.lte)(schema_1.payments.created_at, endOfLastMonth), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        const lastMonthRevenue = parseFloat(((_c = lastMonthRevenueAgg[0]) === null || _c === void 0 ? void 0 : _c.amount) || '0');
        let revenueChange = 0;
        if (lastMonthRevenue === 0) {
            revenueChange = thisMonthRevenue > 0 ? 100 : 0;
        }
        else {
            revenueChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        }
        const revenueChangeStr = (revenueChange >= 0 ? '+' : '') + revenueChange.toFixed(1) + '%';
        // 2. Active Users
        const activeUsersRow = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.status, 'ACTIVE'));
        const activeUsers = ((_d = activeUsersRow[0]) === null || _d === void 0 ? void 0 : _d.value) || 0;
        // 3. Live UIs
        const liveUisRow = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.uis);
        const liveUis = ((_e = liveUisRow[0]) === null || _e === void 0 ? void 0 : _e.value) || 0;
        // 4. Total Downloads
        const totalDownloadsAgg = yield db_1.db.select({ value: (0, drizzle_orm_1.sum)(schema_1.uis.downloads) }).from(schema_1.uis);
        const totalDownloads = parseInt(((_f = totalDownloadsAgg[0]) === null || _f === void 0 ? void 0 : _f.value) || '0');
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
        const monthlyPayments = yield db_1.db.select({ created_at: schema_1.payments.created_at })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, sixMonthsAgo), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
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
                volume: 0,
                downloads: 0
            });
        }
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        // Fetch Metadata for last 7 days
        const recentUIs = yield db_1.db.select({ created_at: schema_1.uis.created_at })
            .from(schema_1.uis)
            .where((0, drizzle_orm_1.gte)(schema_1.uis.created_at, sevenDaysAgo));
        const recentUsers = yield db_1.db.select({ created_at: schema_1.users.created_at })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.gte)(schema_1.users.created_at, sevenDaysAgo));
        const recentPayments = yield db_1.db.select({ created_at: schema_1.payments.created_at, amount: schema_1.payments.amount })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, sevenDaysAgo), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        // Real download events: fetch UIs that were downloaded (updated_at updated by download route)
        // updated_at is refreshed via onUpdateNow() every time a download increments uis.downloads
        const recentDownloadedUIs = yield db_1.db.select({ updated_at: schema_1.uis.updated_at, downloads: schema_1.uis.downloads })
            .from(schema_1.uis)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.uis.updated_at, sevenDaysAgo), (0, drizzle_orm_1.sql) `${schema_1.uis.downloads} > 0`));
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
            if (entry) {
                entry.volume += item.amount;
            }
        });
        // Count actual downloads per day using updated_at as the event timestamp
        recentDownloadedUIs.forEach(item => {
            const dateStr = toLocalDateStr(new Date(item.updated_at));
            const entry = graphData.find(g => g.date === dateStr);
            if (entry)
                entry.downloads += item.downloads;
        });
        // Remove the 'date' field from final output
        const finalGraphData = graphData.map(({ day, uis, users, volume, downloads }) => ({ day, uis, users, volume, downloads }));
        // 10. Trending UIs
        const trendingUIs = yield db_1.db.select({
            id: schema_1.uis.id,
            title: schema_1.uis.title,
            imageSrc: schema_1.uis.imageSrc,
            likes: schema_1.uis.likes,
            downloads: schema_1.uis.downloads
        }).from(schema_1.uis).orderBy((0, drizzle_orm_1.desc)(schema_1.uis.likes)).limit(3);
        // 11. Daily Stats (Real-time for "Today")
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todayRevenueAgg = yield db_1.db.select({ amount: (0, drizzle_orm_1.sum)(schema_1.payments.amount) })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfToday), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        const todayRevenue = parseFloat(((_g = todayRevenueAgg[0]) === null || _g === void 0 ? void 0 : _g.amount) || '0');
        const todayUsersRow = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.users).where((0, drizzle_orm_1.gte)(schema_1.users.created_at, startOfToday));
        const todayUsers = ((_h = todayUsersRow[0]) === null || _h === void 0 ? void 0 : _h.value) || 0;
        const todayUIsRow = yield db_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.uis).where((0, drizzle_orm_1.gte)(schema_1.uis.created_at, startOfToday));
        const todayUIs = ((_j = todayUIsRow[0]) === null || _j === void 0 ? void 0 : _j.value) || 0;
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
        const todayPayments = yield db_1.db.select({ created_at: schema_1.payments.created_at, amount: schema_1.payments.amount })
            .from(schema_1.payments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.payments.created_at, startOfToday), (0, drizzle_orm_1.eq)(schema_1.payments.status, 'COMPLETED')));
        const todayUsersList = yield db_1.db.select({ created_at: schema_1.users.created_at })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.gte)(schema_1.users.created_at, startOfToday));
        const todayUIsList = yield db_1.db.select({ created_at: schema_1.uis.created_at })
            .from(schema_1.uis)
            .where((0, drizzle_orm_1.gte)(schema_1.uis.created_at, startOfToday));
        // Real intraday downloads: UIs whose updated_at is today (download triggered update)
        const todayDownloadedUIs = yield db_1.db.select({ updated_at: schema_1.uis.updated_at, downloads: schema_1.uis.downloads })
            .from(schema_1.uis)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.uis.updated_at, startOfToday), (0, drizzle_orm_1.sql) `${schema_1.uis.downloads} > 0`));
        // Generate buckets for 00:00 to 23:00
        for (let i = 0; i < 24; i++) {
            const hourLabel = `${i.toString().padStart(2, '0')}:00`;
            // Filter counts for this hour
            const usersCount = todayUsersList.filter(u => new Date(u.created_at).getHours() === i).length;
            const uisCount = todayUIsList.filter(u => new Date(u.created_at).getHours() === i).length;
            const hourPayments = todayPayments.filter(p => new Date(p.created_at).getHours() === i);
            const revenueSum = hourPayments.reduce((acc, curr) => acc + curr.amount, 0);
            // Real download count: sum downloads of UIs updated in this hour
            const downloadsCount = todayDownloadedUIs
                .filter(u => new Date(u.updated_at).getHours() === i)
                .reduce((acc, u) => acc + u.downloads, 0);
            hourlyStats.push({
                day: hourLabel, // reusing 'day' key for XAxis compatibility with existing types/chart
                users: usersCount,
                uis: uisCount,
                volume: revenueSum,
                downloads: downloadsCount
            });
        }
        res.status(200).json({
            status: true,
            data: {
                stats: [
                    { label: 'Total Revenue', value: totalRevenue.toLocaleString(), change: revenueChangeStr, color: 'emerald' },
                    { label: 'Active Users', value: activeUsers < 1000 ? activeUsers.toString() : (activeUsers / 1000).toFixed(1) + 'k', change: '+0', color: 'indigo' },
                    { label: 'Live UIs', value: liveUis.toString(), change: '+5.1%', color: 'amber' },
                    { label: 'Total Downloads', value: totalDownloads < 1000 ? totalDownloads.toString() : (totalDownloads / 1000).toFixed(1) + 'k', change: '+0%', color: 'teal' },
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
