"use client";

import { useHeartbeat } from '@/hooks/useHeartbeat';

export default function PresenceHandler() {
    // This component purely exists to run the presence logic globally
    useHeartbeat();
    return null;
}
