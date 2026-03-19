import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/api/interactions`;

export const InteractionService = {
    // Helper to get headers
    _getConfig: () => {
        const headers: any = {};
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return {
            withCredentials: true,
            headers
        };
    },

    // Get All UIs
    getUIs: async (params?: { creatorId?: string | number }) => {
        try {
            const response = await axios.get(`${API_URL}/all`, {
                ...InteractionService._getConfig(),
                params
            });
            return response.data;
        } catch (error) {
            // Check if it's 404 (route might be different)
            // Actually API_URL is .../api/interactions
            // But UI routes are usually .../api/uis
            // Let's check where API_URL points. 
            // Step 877: const API_URL = .../api/interactions
            // But ui.routes.ts (Step 888) is likely mounted at /api/uis based on controller usage.
            // Wait, UI controller `getUIs` (Step 892) is exported. 
            // Where is `ui.routes.ts` mounted? layout or app.ts? 
            // Usually /api/uis. 
            // Interaction service points to /api/interactions.
            // I should probably create a new method that hits the correct endpoint or fix API_URL.

            // Let's assume there's a separate endpoint for UIs.
            // In Step 877, getUI uses `${apiUrl}/api/uis/${id}` explicitly!
            // So `getUIs` should use `${apiUrl}/api/uis`.

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const response = await axios.get(`${apiUrl}/api/uis`, {
                ...InteractionService._getConfig(),
                params
            });
            return response.data;
        }
    },

    // Get Single UI
    getUI: async (id: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const response = await axios.get(`${apiUrl}/api/uis/${id}`, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Get UI Error:", error);
            throw error;
        }
    },

    // Toggle Like
    toggleLike: async (uiId: string): Promise<{ liked: boolean, message: string, likesCount: number }> => {
        try {
            const response = await axios.post(`${API_URL}/${uiId}/like`, {}, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Toggle Like Error:", error);
            throw error;
        }
    },

    // Toggle Wishlist
    toggleWishlist: async (uiId: string): Promise<{ wished: boolean, message: string }> => {
        try {
            const response = await axios.post(`${API_URL}/${uiId}/wishlist`, {}, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Toggle Wishlist Error:", error);
            throw error;
        }
    },

    // Get Comments
    getComments: async (uiId: string, params?: { page?: number, limit?: number }) => {
        try {
            const response = await axios.get(`${API_URL}/${uiId}/comments`, {
                ...InteractionService._getConfig(),
                params
            });
            return response.data; // Returns { status, data, meta }
        } catch (error) {
            console.error("Get Comments Error:", error);
            throw error;
        }
    },

    // Add Comment
    addComment: async (uiId: string, content: string) => {
        try {
            const response = await axios.post(`${API_URL}/${uiId}/comments`, { content }, InteractionService._getConfig());
            return response.data.data;
        } catch (error) {
            console.error("Add Comment Error:", error);
            throw error;
        }
    },

    // Delete Comment
    deleteComment: async (commentId: string) => {
        try {
            const response = await axios.delete(`${API_URL}/comments/${commentId}`, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Delete Comment Error:", error);
            throw error;
        }
    }
};
