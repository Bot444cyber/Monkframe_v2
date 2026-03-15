
export interface Stat {
    label: string;
    value: string;
    change: string;
    color?: string;
}

export interface GraphPoint {
    day: string;
    users: number;
    uis: number;
    volume: number;
}

export interface Activity {
    type: 'PAYMENT' | 'UPLOAD' | 'LIKE' | 'SYSTEM';
    uiTitle?: string;
    user: string;
    message: string;
    time: string;
}

export interface TrendingUI {
    id: string;
    title: string;
    imageSrc: string;
    downloads: number;
    likes: number;
}

export interface OverviewData {
    stats: Stat[];
    graphData: GraphPoint[];
    hourlyStats?: GraphPoint[]; // Intraday data
    paymentStatusDistribution: {
        completed: number;
        pending: number;
        canceled: number;
        failed: number;
    };
    formattedActivities: Activity[];
    trendingUIs: TrendingUI[];
    dailyStats?: {
        revenue: number;
        revenueGoal: number;
        users: number;
        usersGoal: number;
        uis: number;
        uisGoal: number;
    };
}
