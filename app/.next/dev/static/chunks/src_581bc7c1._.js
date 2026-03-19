(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/interaction.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InteractionService",
    ()=>InteractionService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = `${("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000'}/api/interactions`;
const InteractionService = {
    // Helper to get headers
    _getConfig: ()=>{
        const headers = {};
        if ("TURBOPACK compile-time truthy", 1) {
            const token = localStorage.getItem('auth_token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return {
            withCredentials: true,
            headers
        };
    },
    // Get All UIs
    getUIs: async (params)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/all`, {
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
            const apiUrl = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${apiUrl}/api/uis`, {
                ...InteractionService._getConfig(),
                params
            });
            return response.data;
        }
    },
    // Get Single UI
    getUI: async (id)=>{
        try {
            const apiUrl = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${apiUrl}/api/uis/${id}`, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Get UI Error:", error);
            throw error;
        }
    },
    // Toggle Like
    toggleLike: async (uiId)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/${uiId}/like`, {}, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Toggle Like Error:", error);
            throw error;
        }
    },
    // Toggle Wishlist
    toggleWishlist: async (uiId)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/${uiId}/wishlist`, {}, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Toggle Wishlist Error:", error);
            throw error;
        }
    },
    // Get Comments
    getComments: async (uiId, params)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/${uiId}/comments`, {
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
    addComment: async (uiId, content)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/${uiId}/comments`, {
                content
            }, InteractionService._getConfig());
            return response.data.data;
        } catch (error) {
            console.error("Add Comment Error:", error);
            throw error;
        }
    },
    // Delete Comment
    deleteComment: async (commentId)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`${API_URL}/comments/${commentId}`, InteractionService._getConfig());
            return response.data;
        } catch (error) {
            console.error("Delete Comment Error:", error);
            throw error;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Pagination.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
    if (totalPages <= 1) return null;
    const renderPageNumbers = ()=>{
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }
        if (start > 1) {
            pages.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onPageChange(1),
                className: `w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                        ${currentPage === 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'}`,
                children: "1"
            }, 1, false, {
                fileName: "[project]/src/components/Pagination.tsx",
                lineNumber: 24,
                columnNumber: 18
            }, this));
            if (start > 2) {
                pages.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "w-10 h-10 flex items-center justify-center text-zinc-600",
                    children: "..."
                }, "start-ellipsis", false, {
                    fileName: "[project]/src/components/Pagination.tsx",
                    lineNumber: 29,
                    columnNumber: 20
                }, this));
            }
        }
        for(let i = start; i <= end; i++){
            pages.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onPageChange(i),
                className: `w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                        ${currentPage === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'}`,
                children: i
            }, i, false, {
                fileName: "[project]/src/components/Pagination.tsx",
                lineNumber: 33,
                columnNumber: 18
            }, this));
        }
        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "w-10 h-10 flex items-center justify-center text-zinc-600",
                    children: "..."
                }, "end-ellipsis", false, {
                    fileName: "[project]/src/components/Pagination.tsx",
                    lineNumber: 40,
                    columnNumber: 20
                }, this));
            }
            pages.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onPageChange(totalPages),
                className: `w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                        ${currentPage === totalPages ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'}`,
                children: totalPages
            }, totalPages, false, {
                fileName: "[project]/src/components/Pagination.tsx",
                lineNumber: 42,
                columnNumber: 18
            }, this));
        }
        return pages;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center justify-center gap-2 mt-8 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onPageChange(currentPage - 1),
                disabled: currentPage === 1,
                className: "w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-400    hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "m15 18-6-6 6-6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Pagination.tsx",
                        lineNumber: 52,
                        columnNumber: 195
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Pagination.tsx",
                    lineNumber: 52,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Pagination.tsx",
                lineNumber: 50,
                columnNumber: 13
            }, this),
            renderPageNumbers(),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onPageChange(currentPage + 1),
                disabled: currentPage === totalPages,
                className: "w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-400    hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "m9 18 6-6-6-6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Pagination.tsx",
                        lineNumber: 59,
                        columnNumber: 195
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Pagination.tsx",
                    lineNumber: 59,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Pagination.tsx",
                lineNumber: 57,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Pagination.tsx",
        lineNumber: 49,
        columnNumber: 10
    }, this);
}
_c = Pagination;
var _c;
__turbopack_context__.k.register(_c, "Pagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CommentSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$interaction$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/interaction.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Pagination.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const CommentSection = ({ uiId, isOpen = false, onClose, variant = 'modal', onCommentsChange })=>{
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalItems, setTotalItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const { socket } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommentSection.useEffect": ()=>{
            setMounted(true);
        }
    }["CommentSection.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommentSection.useEffect": ()=>{
            if (!socket) return;
            socket.on("comment:added", {
                "CommentSection.useEffect": (data)=>{
                    if (data.uiId === uiId) {
                        // Deduplicate — avoid adding if already in list (e.g. from handleSubmit)
                        setComments({
                            "CommentSection.useEffect": (prev)=>{
                                if (prev.some({
                                    "CommentSection.useEffect": (c)=>c.id === data.comment.id
                                }["CommentSection.useEffect"])) return prev;
                                return [
                                    data.comment,
                                    ...prev
                                ];
                            }
                        }["CommentSection.useEffect"]);
                        setTotalItems({
                            "CommentSection.useEffect": (prev_0)=>prev_0 + 1
                        }["CommentSection.useEffect"]);
                    }
                }
            }["CommentSection.useEffect"]);
            return ({
                "CommentSection.useEffect": ()=>{
                    socket.off("comment:added");
                }
            })["CommentSection.useEffect"];
        }
    }["CommentSection.useEffect"], [
        socket,
        uiId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommentSection.useEffect": ()=>{
            if (onCommentsChange) {
                onCommentsChange(totalItems);
            }
        }
    }["CommentSection.useEffect"], [
        totalItems,
        onCommentsChange
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommentSection.useEffect": ()=>{
            if ((isOpen || variant === 'embedded') && uiId) {
                loadComments();
            }
        }
    }["CommentSection.useEffect"], [
        isOpen,
        uiId,
        variant,
        page
    ]);
    const loadComments = async ()=>{
        try {
            setLoading(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$interaction$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InteractionService"].getComments(uiId, {
                page,
                limit: 5
            });
            if (response.status) {
                setComments(response.data);
                setTotalPages(response.meta?.totalPages || 1);
                setTotalItems(response.meta?.total || 0);
            }
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to load comments");
        } finally{
            setLoading(false);
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!user) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Please login to comment");
            return;
        }
        if (!newComment.trim()) return;
        try {
            const addedComment = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$interaction$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InteractionService"].addComment(uiId, newComment);
            // Optimistically add to list; socket event will also fire but deduplicates by id
            setComments((prev_1)=>{
                if (prev_1.some((c_0)=>c_0.id === addedComment.id)) return prev_1;
                return [
                    addedComment,
                    ...prev_1
                ];
            });
            setTotalItems((prev_2)=>prev_2 + 1);
            setNewComment('');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Comment added");
        } catch (error_0) {
            console.error(error_0);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to post comment");
        }
    };
    const handleDelete = async (commentId)=>{
        if (!confirm('Delete this comment?')) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$interaction$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InteractionService"].deleteComment(commentId);
            setComments(comments.filter((c_1)=>c_1.id !== commentId));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Comment deleted");
        } catch (e_0) {
            console.error(e_0);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to delete comment");
        }
    };
    if (variant === 'modal' && (!isOpen || !mounted)) return null;
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col bg-zinc-900 border-white/10 ${variant === 'modal' ? 'w-full max-w-md h-full border-l shadow-2xl' : 'w-full rounded-3xl border bg-zinc-900/50'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 border-b border-white/5 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-white",
                        children: [
                            "Comments (",
                            totalItems,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CommentSection.tsx",
                        lineNumber: 134,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    variant === 'modal' && onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-5 h-5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CommentSection.tsx",
                                lineNumber: 136,
                                columnNumber: 104
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/CommentSection.tsx",
                            lineNumber: 136,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/CommentSection.tsx",
                        lineNumber: 135,
                        columnNumber: 52
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CommentSection.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-1 overflow-y-auto p-6 space-y-6 ${variant === 'embedded' ? 'max-h-[600px] min-h-[300px]' : ''}`,
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center text-gray-500 py-10",
                    children: "Loading comments..."
                }, void 0, false, {
                    fileName: "[project]/src/components/CommentSection.tsx",
                    lineNumber: 142,
                    columnNumber: 28
                }, ("TURBOPACK compile-time value", void 0)) : comments.length > 0 ? comments.map((comment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 group relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/10 shrink-0",
                                children: comment.user.full_name?.charAt(0) || '?'
                            }, void 0, false, {
                                fileName: "[project]/src/components/CommentSection.tsx",
                                lineNumber: 143,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-bold text-white",
                                                children: comment.user.full_name || 'Unknown User'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/CommentSection.tsx",
                                                lineNumber: 148,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-gray-500",
                                                        children: new Date(comment.created_at).toLocaleDateString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/CommentSection.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    user && String(user.user_id) === String(comment.user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDelete(comment.id),
                                                        className: "p-1 hover:bg-white/10 rounded-full text-gray-500 hover:text-red-500 transition-colors",
                                                        title: "Delete comment",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-3.5 h-3.5",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/CommentSection.tsx",
                                                                lineNumber: 152,
                                                                columnNumber: 132
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/CommentSection.tsx",
                                                            lineNumber: 152,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/CommentSection.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 102
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/CommentSection.tsx",
                                                lineNumber: 149,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/CommentSection.tsx",
                                        lineNumber: 147,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 leading-relaxed",
                                        children: comment.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CommentSection.tsx",
                                        lineNumber: 156,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CommentSection.tsx",
                                lineNumber: 146,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, comment.id, true, {
                        fileName: "[project]/src/components/CommentSection.tsx",
                        lineNumber: 142,
                        columnNumber: 151
                    }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center text-gray-500 py-10 flex flex-col items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-8 h-8 opacity-20",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CommentSection.tsx",
                                lineNumber: 159,
                                columnNumber: 115
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/CommentSection.tsx",
                            lineNumber: 159,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        "No comments yet. Be the first!"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CommentSection.tsx",
                    lineNumber: 158,
                    columnNumber: 35
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/CommentSection.tsx",
                lineNumber: 141,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-2 border-t border-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage
                }, void 0, false, {
                    fileName: "[project]/src/components/CommentSection.tsx",
                    lineNumber: 164,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/CommentSection.tsx",
                lineNumber: 163,
                columnNumber: 32
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-white/5 bg-black/20",
                children: user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: newComment,
                                onChange: (e_1)=>setNewComment(e_1.target.value),
                                placeholder: "Add a comment...",
                                className: "w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-600 pr-12 transition-all"
                            }, void 0, false, {
                                fileName: "[project]/src/components/CommentSection.tsx",
                                lineNumber: 171,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: !newComment.trim(),
                                className: "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 rounded-lg text-white disabled:opacity-50 disabled:bg-gray-600 transition-all hover:bg-indigo-600",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CommentSection.tsx",
                                        lineNumber: 173,
                                        columnNumber: 112
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CommentSection.tsx",
                                    lineNumber: 173,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/CommentSection.tsx",
                                lineNumber: 172,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CommentSection.tsx",
                        lineNumber: 170,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/CommentSection.tsx",
                    lineNumber: 169,
                    columnNumber: 25
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 mb-3",
                            children: "Please login to join the discussion"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CommentSection.tsx",
                            lineNumber: 177,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/login",
                            className: "inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors",
                            children: "Login"
                        }, void 0, false, {
                            fileName: "[project]/src/components/CommentSection.tsx",
                            lineNumber: 178,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CommentSection.tsx",
                    lineNumber: 176,
                    columnNumber: 31
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/CommentSection.tsx",
                lineNumber: 168,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CommentSection.tsx",
        lineNumber: 131,
        columnNumber: 19
    }, ("TURBOPACK compile-time value", void 0));
    if (variant === 'embedded') return content;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createPortal(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-100 flex justify-end",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 backdrop-blur-sm",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/components/CommentSection.tsx",
                lineNumber: 186,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-md h-full flex flex-col animate-in slide-in-from-right duration-300",
                children: content
            }, void 0, false, {
                fileName: "[project]/src/components/CommentSection.tsx",
                lineNumber: 187,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CommentSection.tsx",
        lineNumber: 185,
        columnNumber: 32
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
_s(CommentSection, "wgPaJlDbhwOJM5YwSHEculT5Zso=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = CommentSection;
const __TURBOPACK__default__export__ = CommentSection;
var _c;
__turbopack_context__.k.register(_c, "CommentSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/notification.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationService",
    ()=>NotificationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
;
;
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
const API_URL = `${BASE_URL}/api`;
let socket = null;
const NotificationService = {
    _getHeaders: ()=>{
        const headers = {};
        if ("TURBOPACK compile-time truthy", 1) {
            const token = localStorage.getItem('auth_token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },
    getNotifications: async (page = 1, limit = 10, scope)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/notifications/get-notifications`, {
                params: {
                    page,
                    limit,
                    scope
                },
                withCredentials: true,
                headers: NotificationService._getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },
    connectSocket: ()=>{
        if (!socket) {
            socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(("TURBOPACK compile-time value", "http://localhost:5000")?.replace('/api', '') || 'http://localhost:1000', {
                withCredentials: true,
                transports: [
                    'websocket'
                ]
            });
            socket.on('connect', ()=>{
                console.log('Connected to socket server');
            });
        }
        return socket;
    },
    getSocket: ()=>{
        if (!socket) {
            return NotificationService.connectSocket();
        }
        return socket;
    },
    disconnectSocket: ()=>{
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/NotificationTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/notification.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const NotificationTable = ()=>{
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [scope, setScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationTable.useEffect": ()=>{
            if (!user) return;
            const loadNotifications = {
                "NotificationTable.useEffect.loadNotifications": async ()=>{
                    setLoading(true);
                    try {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationService"].getNotifications(page, 10, scope);
                        // Check if response has data property (new structure) or is array (fallback)
                        const data = response.data || response;
                        setNotifications(Array.isArray(data) ? data : []);
                        if (response.meta) {
                            setTotalPages(response.meta.totalPages);
                        }
                    } catch (error) {
                        console.error("Failed to load notifications", error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to load notifications");
                    } finally{
                        setLoading(false);
                    }
                }
            }["NotificationTable.useEffect.loadNotifications"];
            loadNotifications();
        }
    }["NotificationTable.useEffect"], [
        user,
        page,
        scope
    ]);
    const { socket } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationTable.useEffect": ()=>{
            if (!socket) return;
            const handleNewNotification = {
                "NotificationTable.useEffect.handleNewNotification": (newNotification)=>{
                    // Only prepend if we are on the first page AND the notification matches current scope
                    // scope 'all' -> show everything
                    // scope 'me' -> show only if userId matches (assuming backend emits tailored events, which it does)
                    // For 'me' scope, we rely on the fact that 'new-notification' event is emitted to user's room.
                    // However, Admin also joins 'admin' room which receives ALL events.
                    // So we need clientside filtering for 'me' scope if the event comes from 'admin' room?
                    // Actually, `NotificationBell.tsx` logic suggests `new-notification` is specific to user or filtered there.
                    // Let's rely on simple reload or optimistic update if it matches logic.
                    // Simplified: If scope is 'me' and we receive a notif, check if it belongs to us?
                    // current User ID check might be needed if we want strict real-time filtering.
                    // For now, let's just append and let refresh handle strictness or assume socket routing is good.
                    if (page === 1) {
                        // If scope is me, we theoretically want to check if notif.userId === user.id
                        // But `newNotification` from socket might not have userId on top level depending on structure.
                        // Let's just add it. The user can refresh if it looks wrong.
                        // Better: Check scope.
                        if (scope === 'me' && newNotification.user?.email !== user?.email) {
                            return; // Skip if it's someone else's action and we are in 'me' mode
                        }
                        setNotifications({
                            "NotificationTable.useEffect.handleNewNotification": (prev)=>[
                                    {
                                        ...newNotification,
                                        id: `temp-${Date.now()}`,
                                        created_at: new Date().toISOString(),
                                        user: newNotification.user,
                                        ui: newNotification.ui
                                    },
                                    ...prev
                                ]
                        }["NotificationTable.useEffect.handleNewNotification"]);
                    }
                }
            }["NotificationTable.useEffect.handleNewNotification"];
            socket.on('new-notification', handleNewNotification);
            return ({
                "NotificationTable.useEffect": ()=>{
                    socket.off('new-notification', handleNewNotification);
                }
            })["NotificationTable.useEffect"];
        }
    }["NotificationTable.useEffect"], [
        socket,
        page,
        scope,
        user
    ]);
    if (loading && notifications.length === 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-white",
        children: "Loading notifications..."
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
        lineNumber: 95,
        columnNumber: 53
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mt-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 border-b border-white/10 flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-white",
                        children: "Notifications"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex bg-zinc-900/50 rounded-lg p-1 border border-white/5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setScope('all'),
                                    className: `px-3 py-1 text-xs font-medium rounded transition-colors ${scope === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`,
                                    children: "All System"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                    lineNumber: 102,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setScope('me'),
                                    className: `px-3 py-1 text-xs font-medium rounded transition-colors ${scope === 'me' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`,
                                    children: "My Activity"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                    lineNumber: 105,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                            lineNumber: 101,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                        lineNumber: 99,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                lineNumber: 97,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "bg-white/5 text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider",
                                        children: "Type"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                        lineNumber: 116,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider",
                                        children: "Message"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                        lineNumber: 117,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    user?.role === 'ADMIN' && scope === 'all' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider",
                                        children: "User"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                        lineNumber: 118,
                                        columnNumber: 75
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider",
                                        children: "Time"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                        lineNumber: 119,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                lineNumber: 115,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                            lineNumber: 114,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-white/5",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: scope === 'all' ? 4 : 3,
                                    className: "px-6 py-8 text-center text-gray-500",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 w-4 rounded-full border-2 border-white/20 border-t-blue-500 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                                lineNumber: 126,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Loading..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                                lineNumber: 127,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                        lineNumber: 125,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                    lineNumber: 124,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                lineNumber: 123,
                                columnNumber: 36
                            }, ("TURBOPACK compile-time value", void 0)) : notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: scope === 'all' ? 4 : 3,
                                    className: "px-6 py-8 text-center text-gray-500",
                                    children: "No recent activity"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                    lineNumber: 131,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                lineNumber: 130,
                                columnNumber: 66
                            }, ("TURBOPACK compile-time value", void 0)) : notifications.map((notif)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-white/5 transition-colors group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 text-xs rounded-full border ${notif.type === 'PAYMENT' ? 'bg-green-500/20 text-green-400 border-green-500/30' : notif.type === 'LIKE' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : notif.type === 'WISHLIST' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : notif.type === 'COMMENT' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`,
                                                children: notif.type
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                                lineNumber: 136,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                            lineNumber: 135,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors",
                                            children: notif.message
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                            lineNumber: 140,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        user?.role === 'ADMIN' && scope === 'all' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-sm text-gray-400",
                                            children: notif.user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: notif.user.full_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-500",
                                                        children: notif.user.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                                        lineNumber: 146,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                                lineNumber: 144,
                                                columnNumber: 59
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "italic",
                                                children: "Unknown"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                                lineNumber: 147,
                                                columnNumber: 58
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                            lineNumber: 143,
                                            columnNumber: 83
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-sm text-gray-500 whitespace-nowrap",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(notif.created_at), 'MMM d, h:mm a')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                            lineNumber: 149,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, notif.id, true, {
                                    fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                    lineNumber: 134,
                                    columnNumber: 64
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                            lineNumber: 122,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                    lineNumber: 113,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                lineNumber: 112,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-white/10 flex items-center justify-between bg-black/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500",
                        children: [
                            "Showing page ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-white",
                                children: page
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                lineNumber: 160,
                                columnNumber: 34
                            }, ("TURBOPACK compile-time value", void 0)),
                            " of ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-white",
                                children: totalPages
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                lineNumber: 160,
                                columnNumber: 92
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                        lineNumber: 159,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage((p)=>Math.max(1, p - 1)),
                                disabled: page === 1 || loading,
                                className: "flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: 1.5,
                                        stroke: "currentColor",
                                        className: "w-3 h-3 group-hover:-translate-x-0.5 transition-transform",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M15.75 19.5L8.25 12l7.5-7.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                            lineNumber: 165,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                        lineNumber: 164,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Previous"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                lineNumber: 163,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage((p_0)=>Math.min(totalPages, p_0 + 1)),
                                disabled: page === totalPages || loading,
                                className: "flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white group",
                                children: [
                                    "Next",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: 1.5,
                                        stroke: "currentColor",
                                        className: "w-3 h-3 group-hover:translate-x-0.5 transition-transform",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M8.25 4.5l7.5 7.5-7.5 7.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                            lineNumber: 172,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                        lineNumber: 171,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                                lineNumber: 169,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                        lineNumber: 162,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
                lineNumber: 158,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/NotificationTable.tsx",
        lineNumber: 96,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NotificationTable, "evpzN/kPkI8p51RmZmLxydg9Rwg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = NotificationTable;
const __TURBOPACK__default__export__ = NotificationTable;
var _c;
__turbopack_context__.k.register(_c, "NotificationTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/TradingChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/AreaChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Area.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
;
;
;
const CustomTooltip = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "9fe8f85013b6bc66469020f1825b445fcd94e1fb2455e9223e05399ca0bd6d09") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9fe8f85013b6bc66469020f1825b445fcd94e1fb2455e9223e05399ca0bd6d09";
    }
    const { active, payload, label } = t0;
    if (active && payload && payload.length) {
        let t1;
        if ($[1] !== label) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2",
                children: [
                    label,
                    " Report"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                lineNumber: 24,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
            $[1] = label;
            $[2] = t1;
        } else {
            t1 = $[2];
        }
        let t2;
        if ($[3] !== payload) {
            t2 = payload.map(_temp);
            $[3] = payload;
            $[4] = t2;
        } else {
            t2 = $[4];
        }
        let t3;
        if ($[5] !== t2) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: t2
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                lineNumber: 40,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
            $[5] = t2;
            $[6] = t3;
        } else {
            t3 = $[6];
        }
        let t4;
        if ($[7] !== t1 || $[8] !== t3) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#0c0c0e]/90 border border-white/10 backdrop-blur-xl p-4 rounded-xl shadow-2xl",
                children: [
                    t1,
                    t3
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                lineNumber: 48,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
            $[7] = t1;
            $[8] = t3;
            $[9] = t4;
        } else {
            t4 = $[9];
        }
        return t4;
    }
    return null;
};
_c = CustomTooltip;
const TradingChart = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "9fe8f85013b6bc66469020f1825b445fcd94e1fb2455e9223e05399ca0bd6d09") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9fe8f85013b6bc66469020f1825b445fcd94e1fb2455e9223e05399ca0bd6d09";
    }
    const { data } = t0;
    if (!data || data.length === 0) {
        return null;
    }
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
            id: "colorUsers",
            x1: "0",
            y1: "0",
            x2: "0",
            y2: "100%",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                    offset: "5%",
                    stopColor: "#6366f1",
                    stopOpacity: 0.3
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                    lineNumber: 87,
                    columnNumber: 73
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                    offset: "95%",
                    stopColor: "#6366f1",
                    stopOpacity: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                    lineNumber: 87,
                    columnNumber: 131
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    let t4;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
            children: [
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                    id: "colorUIs",
                    x1: "0",
                    y1: "0",
                    x2: "0",
                    y2: "100%",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "5%",
                            stopColor: "#10b981",
                            stopOpacity: 0.3
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                            lineNumber: 95,
                            columnNumber: 81
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "95%",
                            stopColor: "#10b981",
                            stopOpacity: 0
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                            lineNumber: 95,
                            columnNumber: 139
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                    lineNumber: 95,
                    columnNumber: 20
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 95,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
            vertical: false,
            strokeDasharray: "3 3",
            stroke: "#27272a",
            strokeOpacity: 0.1
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 96,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[3] = t3;
        $[4] = t4;
    } else {
        t3 = $[3];
        t4 = $[4];
    }
    let t5;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
            dataKey: "day",
            axisLine: false,
            tickLine: false,
            tick: {
                fill: "#52525b",
                fontSize: 10,
                fontWeight: 600
            },
            dy: 10
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 105,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    let t6;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
            axisLine: false,
            tickLine: false,
            tick: {
                fill: "#52525b",
                fontSize: 10,
                fontWeight: 600
            }
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 116,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    let t7;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomTooltip, {}, void 0, false, {
                fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                lineNumber: 127,
                columnNumber: 28
            }, void 0),
            cursor: {
                stroke: "#fff",
                strokeOpacity: 0.1,
                strokeWidth: 1
            }
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 127,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = t7;
    } else {
        t7 = $[7];
    }
    let t8;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
            name: "New Users",
            type: "monotone",
            dataKey: "users",
            stroke: "#6366f1",
            strokeWidth: 4,
            fillOpacity: 1,
            fill: "url(#colorUsers)",
            activeDot: {
                r: 6,
                stroke: "#6366f1",
                strokeWidth: 2,
                fill: "#09090b"
            },
            animationDuration: 1500
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 138,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[8] = t8;
    } else {
        t8 = $[8];
    }
    let t9;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
            name: "Live UIs",
            type: "monotone",
            dataKey: "uis",
            stroke: "#10b981",
            strokeWidth: 4,
            fillOpacity: 1,
            fill: "url(#colorUIs)",
            activeDot: {
                r: 6,
                stroke: "#10b981",
                strokeWidth: 2,
                fill: "#09090b"
            },
            animationDuration: 2000
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 150,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[9] = t9;
    } else {
        t9 = $[9];
    }
    let t10;
    if ($[10] !== data) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full min-h-[300px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                width: "100%",
                height: "100%",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaChart"], {
                    data: data,
                    margin: t1,
                    children: [
                        t3,
                        t4,
                        t5,
                        t6,
                        t7,
                        t8,
                        t9
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                    lineNumber: 162,
                    columnNumber: 104
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                lineNumber: 162,
                columnNumber: 56
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/TradingChart.tsx",
            lineNumber: 162,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[10] = data;
        $[11] = t10;
    } else {
        t10 = $[11];
    }
    return t10;
};
_c1 = TradingChart;
const __TURBOPACK__default__export__ = TradingChart;
function _temp(entry, index) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-1.5 h-1.5 rounded-full",
                        style: {
                            backgroundColor: entry.color
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                        lineNumber: 172,
                        columnNumber: 120
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium text-zinc-400",
                        children: entry.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                        lineNumber: 174,
                        columnNumber: 12
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                lineNumber: 172,
                columnNumber: 79
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-bold text-white tabular-nums",
                children: entry.value
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/TradingChart.tsx",
                lineNumber: 174,
                columnNumber: 89
            }, this)
        ]
    }, index, true, {
        fileName: "[project]/src/components/dashboard/TradingChart.tsx",
        lineNumber: 172,
        columnNumber: 10
    }, this);
}
var _c, _c1;
__turbopack_context__.k.register(_c, "CustomTooltip");
__turbopack_context__.k.register(_c1, "TradingChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/OverviewSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$TradingChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/TradingChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatDistanceToNow.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Icons = {
    Download: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 13,
            columnNumber: 19
        }, ("TURBOPACK compile-time value", void 0)),
    TrendingUp: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M23 6l-9.5 9.5-5-5L1 18"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 14,
            columnNumber: 21
        }, ("TURBOPACK compile-time value", void 0)),
    Zap: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 15,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0)),
    Layers: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 16,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    Bell: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 17,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
    Grid: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 18,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
    Dollar: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 19,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0))
};
const getColorStyles = (color)=>{
    switch(color){
        case 'emerald':
            return {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-400',
                border: 'border-emerald-500/20',
                glow: 'bg-emerald-500'
            };
        case 'indigo':
            return {
                bg: 'bg-indigo-500/10',
                text: 'text-indigo-400',
                border: 'border-indigo-500/20',
                glow: 'bg-indigo-500'
            };
        case 'amber':
            return {
                bg: 'bg-amber-500/10',
                text: 'text-amber-400',
                border: 'border-amber-500/20',
                glow: 'bg-amber-500'
            };
        case 'rose':
            return {
                bg: 'bg-rose-500/10',
                text: 'text-rose-400',
                border: 'border-rose-500/20',
                glow: 'bg-rose-500'
            };
        default:
            return {
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                border: 'border-blue-500/20',
                glow: 'bg-blue-500'
            };
    }
};
const OverviewSection = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(115);
    if ($[0] !== "245d62634b27e00be8933cd388b43df9058565eac351311a727232a8a1596778") {
        for(let $i = 0; $i < 115; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "245d62634b27e00be8933cd388b43df9058565eac351311a727232a8a1596778";
    }
    const { overviewData, handleLike } = t0;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState("7D");
    const payCompleted = overviewData?.paymentStatusDistribution?.completed || 0;
    const payPending = overviewData?.paymentStatusDistribution?.pending || 0;
    const payFailed = overviewData?.paymentStatusDistribution?.failed || 0;
    const payTotal = payCompleted + payPending + payFailed;
    let t1;
    if ($[1] !== overviewData.formattedActivities) {
        t1 = overviewData?.formattedActivities || [];
        $[1] = overviewData.formattedActivities;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const recentActivities = t1;
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    let trendingUIs;
    if ($[3] !== handleLike || $[4] !== overviewData.dailyStats || $[5] !== overviewData.graphData || $[6] !== overviewData.hourlyStats || $[7] !== overviewData.stats || $[8] !== overviewData.trendingUIs || $[9] !== payCompleted || $[10] !== payFailed || $[11] !== payPending || $[12] !== payTotal || $[13] !== recentActivities) {
        trendingUIs = overviewData?.trendingUIs || [];
        overviewData?.graphData || [];
        let displayStats;
        let t10;
        let t9;
        if ($[22] !== overviewData.stats) {
            const stats = overviewData?.stats || [];
            displayStats = stats.map(_temp);
            t6 = "space-y-8 pb-20";
            t9 = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
            t10 = displayStats.map(_temp2);
            $[22] = overviewData.stats;
            $[23] = displayStats;
            $[24] = t10;
            $[25] = t6;
            $[26] = t9;
        } else {
            displayStats = $[23];
            t10 = $[24];
            t6 = $[25];
            t9 = $[26];
        }
        let t11;
        if ($[27] !== displayStats.length) {
            t11 = displayStats.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "col-span-full p-8 text-center text-zinc-500 bg-[#0c0c0e] rounded-3xl border border-white/5",
                children: "No statistics available via API"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 119,
                columnNumber: 42
            }, ("TURBOPACK compile-time value", void 0));
            $[27] = displayStats.length;
            $[28] = t11;
        } else {
            t11 = $[28];
        }
        if ($[29] !== t10 || $[30] !== t11 || $[31] !== t9) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: t9,
                children: [
                    t10,
                    t11
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 126,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
            $[29] = t10;
            $[30] = t11;
            $[31] = t9;
            $[32] = t7;
        } else {
            t7 = $[32];
        }
        let t12;
        if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
            t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none -mr-16 -mt-16"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 136,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[33] = t12;
        } else {
            t12 = $[33];
        }
        let t13;
        if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-2xl font-bold text-white tracking-tight flex items-center gap-2",
                        children: [
                            "Ecosystem Growth",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "relative flex h-1.5 w-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                lineNumber: 143,
                                                columnNumber: 343
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                lineNumber: 143,
                                                columnNumber: 450
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                        lineNumber: 143,
                                        columnNumber: 299
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Live"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 143,
                                columnNumber: 119
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 143,
                        columnNumber: 18
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500 font-medium mt-1",
                        children: "7-day ecosystem performance"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 143,
                        columnNumber: 554
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 143,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[34] = t13;
        } else {
            t13 = $[34];
        }
        let t14;
        if ($[35] !== overviewData.dailyStats) {
            t14 = overviewData.dailyStats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 bg-zinc-900/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 border-r border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-zinc-500 uppercase font-bold",
                                children: "Today's Vol"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 150,
                                columnNumber: 197
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-bold text-white",
                                children: [
                                    "$",
                                    overviewData.dailyStats.revenue.toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 150,
                                columnNumber: 277
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 150,
                        columnNumber: 150
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] text-zinc-500 uppercase font-bold",
                                children: "Target"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 150,
                                columnNumber: 408
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-bold text-zinc-400",
                                children: [
                                    "$",
                                    overviewData.dailyStats.revenueGoal.toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 150,
                                columnNumber: 483
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 150,
                        columnNumber: 386
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 150,
                columnNumber: 40
            }, ("TURBOPACK compile-time value", void 0));
            $[35] = overviewData.dailyStats;
            $[36] = t14;
        } else {
            t14 = $[36];
        }
        let t15;
        if ($[37] !== t14) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative z-10",
                children: [
                    t13,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 158,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[37] = t14;
            $[38] = t15;
        } else {
            t15 = $[38];
        }
        let t16;
        if ($[39] !== overviewData.graphData || $[40] !== overviewData.hourlyStats) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 w-full min-h-[300px] relative z-10",
                children: overviewData.graphData && overviewData.graphData.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$TradingChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    data: overviewData.graphData
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 166,
                    columnNumber: 135
                }, ("TURBOPACK compile-time value", void 0)) : overviewData.hourlyStats && overviewData.hourlyStats.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$TradingChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    data: overviewData.hourlyStats
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 166,
                    columnNumber: 250
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-bold text-zinc-600 uppercase tracking-widest",
                        children: "Awaiting Market Data..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 166,
                        columnNumber: 425
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 166,
                    columnNumber: 301
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 166,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[39] = overviewData.graphData;
            $[40] = overviewData.hourlyStats;
            $[41] = t16;
        } else {
            t16 = $[41];
        }
        let t17;
        if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 175,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[42] = t17;
        } else {
            t17 = $[42];
        }
        let t18;
        if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] text-zinc-500 font-bold uppercase",
                children: "Users Acquisition"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 182,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[43] = t18;
        } else {
            t18 = $[43];
        }
        let t19;
        if ($[44] !== overviewData.dailyStats) {
            t19 = overviewData.dailyStats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-bold text-white tabular-nums",
                children: [
                    overviewData.dailyStats.users,
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-600 font-medium text-[10px]",
                        children: "Today"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 189,
                        columnNumber: 132
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 189,
                columnNumber: 40
            }, ("TURBOPACK compile-time value", void 0));
            $[44] = overviewData.dailyStats;
            $[45] = t19;
        } else {
            t19 = $[45];
        }
        let t20;
        if ($[46] !== t19) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    t17,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: [
                            t18,
                            t19
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 197,
                        columnNumber: 59
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 197,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[46] = t19;
            $[47] = t20;
        } else {
            t20 = $[47];
        }
        let t21;
        if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 205,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[48] = t21;
        } else {
            t21 = $[48];
        }
        let t22;
        if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
            t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] text-zinc-500 font-bold uppercase",
                children: "UIs Deployment"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 212,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[49] = t22;
        } else {
            t22 = $[49];
        }
        let t23;
        if ($[50] !== overviewData.dailyStats) {
            t23 = overviewData.dailyStats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-bold text-white tabular-nums",
                children: [
                    overviewData.dailyStats.uis,
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-zinc-600 font-medium text-[10px]",
                        children: "Today"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 219,
                        columnNumber: 130
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 219,
                columnNumber: 40
            }, ("TURBOPACK compile-time value", void 0));
            $[50] = overviewData.dailyStats;
            $[51] = t23;
        } else {
            t23 = $[51];
        }
        let t24;
        if ($[52] !== t23) {
            t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    t21,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: [
                            t22,
                            t23
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 227,
                        columnNumber: 59
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 227,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[52] = t23;
            $[53] = t24;
        } else {
            t24 = $[53];
        }
        let t25;
        if ($[54] !== t20 || $[55] !== t24) {
            t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-8",
                children: [
                    t20,
                    t24
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 235,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[54] = t20;
            $[55] = t24;
            $[56] = t25;
        } else {
            t25 = $[56];
        }
        let t26;
        if ($[57] === Symbol.for("react.memo_cache_sentinel")) {
            t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[10px] font-mono text-zinc-600",
                children: [
                    "UTC ",
                    new Date().toISOString().slice(11, 16),
                    " • MARKET OPEN"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 244,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[57] = t26;
        } else {
            t26 = $[57];
        }
        let t27;
        if ($[58] !== t25) {
            t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/5 pt-6 gap-4 relative z-10",
                children: [
                    t25,
                    t26
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 251,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[58] = t25;
            $[59] = t27;
        } else {
            t27 = $[59];
        }
        let t28;
        if ($[60] !== t15 || $[61] !== t16 || $[62] !== t27) {
            t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:col-span-8 bg-[#0c0c0e] border border-white/5 p-8 rounded-[2.5rem] flex flex-col min-h-[480px] relative shadow-2xl overflow-hidden",
                children: [
                    t12,
                    t15,
                    t16,
                    t27
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 259,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[60] = t15;
            $[61] = t16;
            $[62] = t27;
            $[63] = t28;
        } else {
            t28 = $[63];
        }
        let t29;
        if ($[64] === Symbol.for("react.memo_cache_sentinel")) {
            t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-bold text-white flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4 fill-current",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Bell, {}, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 269,
                                columnNumber: 231
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 269,
                            columnNumber: 173
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 269,
                        columnNumber: 82
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Terminal"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 269,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[64] = t29;
        } else {
            t29 = $[64];
        }
        let t30;
        if ($[65] === Symbol.for("react.memo_cache_sentinel")) {
            t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6 shrink-0",
                children: [
                    t29,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "relative flex h-2.5 w-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 276,
                                columnNumber: 127
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 276,
                                columnNumber: 234
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 276,
                        columnNumber: 83
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 276,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[65] = t30;
        } else {
            t30 = $[65];
        }
        let t31;
        if ($[66] !== recentActivities) {
            t31 = recentActivities.map(_temp3);
            $[66] = recentActivities;
            $[67] = t31;
        } else {
            t31 = $[67];
        }
        let t32;
        if ($[68] !== recentActivities.length) {
            t32 = recentActivities.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-zinc-600 text-[10px] uppercase font-bold py-10",
                children: "No recent activity"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 291,
                columnNumber: 46
            }, ("TURBOPACK compile-time value", void 0));
            $[68] = recentActivities.length;
            $[69] = t32;
        } else {
            t32 = $[69];
        }
        let t33;
        if ($[70] !== t31 || $[71] !== t32) {
            t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#0c0c0e] border border-white/5 p-8 rounded-[2.5rem] flex flex-col h-[400px] shadow-2xl relative overflow-hidden",
                children: [
                    t30,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1",
                        children: [
                            t31,
                            t32
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 299,
                        columnNumber: 151
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 299,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[70] = t31;
            $[71] = t32;
            $[72] = t33;
        } else {
            t33 = $[72];
        }
        let t34;
        if ($[73] === Symbol.for("react.memo_cache_sentinel")) {
            t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
                        children: "Revenue Status"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 308,
                        columnNumber: 69
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] font-bold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/10 uppercase tracking-wider",
                        children: "Healthy"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 308,
                        columnNumber: 162
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 308,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[73] = t34;
        } else {
            t34 = $[73];
        }
        let t35;
        if ($[74] !== payCompleted || $[75] !== payFailed || $[76] !== payPending || $[77] !== payTotal) {
            t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-8 ring-1 ring-white/5 p-0.5",
                children: payTotal > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-l-full bg-emerald-500 transition-all duration-1000",
                            style: {
                                width: `${payCompleted / payTotal * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 315,
                            columnNumber: 138
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-amber-500 transition-all duration-1000",
                            style: {
                                width: `${payPending / payTotal * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 317,
                            columnNumber: 16
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-r-full bg-rose-500 transition-all duration-1000 flex-1",
                            style: {
                                width: `${payFailed / payTotal * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 319,
                            columnNumber: 16
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full bg-zinc-800 rounded-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 321,
                    columnNumber: 22
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 315,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[74] = payCompleted;
            $[75] = payFailed;
            $[76] = payPending;
            $[77] = payTotal;
            $[78] = t35;
        } else {
            t35 = $[78];
        }
        let t36;
        if ($[79] === Symbol.for("react.memo_cache_sentinel")) {
            t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1 block",
                children: "Completed"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 332,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[79] = t36;
        } else {
            t36 = $[79];
        }
        let t37;
        if ($[80] !== payCompleted) {
            t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/2 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/4 transition-colors",
                children: [
                    t36,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl font-bold text-white tabular-nums",
                        children: payCompleted
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 339,
                        columnNumber: 131
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 339,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[80] = payCompleted;
            $[81] = t37;
        } else {
            t37 = $[81];
        }
        let t38;
        if ($[82] === Symbol.for("react.memo_cache_sentinel")) {
            t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1 block",
                children: "Pending"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 347,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[82] = t38;
        } else {
            t38 = $[82];
        }
        let t39;
        if ($[83] !== payPending) {
            t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/2 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/4 transition-colors",
                children: [
                    t38,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl font-bold text-white tabular-nums",
                        children: payPending
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 354,
                        columnNumber: 131
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 354,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[83] = payPending;
            $[84] = t39;
        } else {
            t39 = $[84];
        }
        let t40;
        if ($[85] !== t37 || $[86] !== t39) {
            t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                    t37,
                    t39
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 362,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[85] = t37;
            $[86] = t39;
            $[87] = t40;
        } else {
            t40 = $[87];
        }
        let t41;
        if ($[88] !== t35 || $[89] !== t40) {
            t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#0c0c0e] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl h-auto",
                children: [
                    t34,
                    t35,
                    t40
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 371,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[88] = t35;
            $[89] = t40;
            $[90] = t41;
        } else {
            t41 = $[90];
        }
        let t42;
        if ($[91] !== t33 || $[92] !== t41) {
            t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:col-span-4 space-y-8",
                children: [
                    t33,
                    t41
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 380,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
            $[91] = t33;
            $[92] = t41;
            $[93] = t42;
        } else {
            t42 = $[93];
        }
        if ($[94] !== t28 || $[95] !== t42) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
                children: [
                    t28,
                    t42
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 388,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
            $[94] = t28;
            $[95] = t42;
            $[96] = t8;
        } else {
            t8 = $[96];
        }
        t4 = "bg-[#0c0c0e] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl";
        if ($[97] === Symbol.for("react.memo_cache_sentinel")) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-8 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-white tracking-tight",
                        children: "Market Movers"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 397,
                        columnNumber: 73
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "text-[10px] font-bold text-zinc-400 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest hover:bg-white/10",
                        children: "Global Ranking"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 397,
                        columnNumber: 151
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 397,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0));
            $[97] = t5;
        } else {
            t5 = $[97];
        }
        t2 = "grid grid-cols-1 md:grid-cols-3 gap-6";
        let t43;
        if ($[98] !== handleLike) {
            t43 = (ui, idx_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-5 p-5 rounded-[2rem] bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group cursor-pointer hover:-translate-y-1 duration-300",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-20 w-24 bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 relative shrink-0 shadow-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: ui.imageSrc,
                                className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700",
                                alt: ui.title,
                                referrerPolicy: "no-referrer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 405,
                                columnNumber: 359
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 405,
                            columnNumber: 242
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "text-[13px] font-bold text-white truncate mb-3 group-hover:text-indigo-400 transition-colors",
                                    children: ui.title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 405,
                                    columnNumber: 561
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-3 h-3 text-emerald-500 fill-current",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Download, {}, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 912
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 837
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-bold text-emerald-400 tabular-nums",
                                                    children: ui.downloads
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 936
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                            lineNumber: 405,
                                            columnNumber: 726
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: (e)=>handleLike(e, ui.id),
                                            className: "flex items-center gap-1.5 group/btn",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4 text-zinc-600 group-hover/btn:text-rose-500 transition-colors fill-current",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 1245
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 1125
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-bold text-zinc-500 tabular-nums group-hover/btn:text-zinc-300",
                                                    children: ui.likes
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 1438
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                            lineNumber: 405,
                                            columnNumber: 1033
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 405,
                                    columnNumber: 685
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 405,
                            columnNumber: 529
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, idx_0, true, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 405,
                    columnNumber: 28
                }, ("TURBOPACK compile-time value", void 0));
            $[98] = handleLike;
            $[99] = t43;
        } else {
            t43 = $[99];
        }
        t3 = trendingUIs.slice(0, 3).map(t43);
        $[3] = handleLike;
        $[4] = overviewData.dailyStats;
        $[5] = overviewData.graphData;
        $[6] = overviewData.hourlyStats;
        $[7] = overviewData.stats;
        $[8] = overviewData.trendingUIs;
        $[9] = payCompleted;
        $[10] = payFailed;
        $[11] = payPending;
        $[12] = payTotal;
        $[13] = recentActivities;
        $[14] = t2;
        $[15] = t3;
        $[16] = t4;
        $[17] = t5;
        $[18] = t6;
        $[19] = t7;
        $[20] = t8;
        $[21] = trendingUIs;
    } else {
        t2 = $[14];
        t3 = $[15];
        t4 = $[16];
        t5 = $[17];
        t6 = $[18];
        t7 = $[19];
        t8 = $[20];
        trendingUIs = $[21];
    }
    let t9;
    if ($[100] !== trendingUIs.length) {
        t9 = trendingUIs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "col-span-full py-8 text-center text-zinc-600 font-bold uppercase text-[10px]",
            children: "No trending assets"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 443,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0));
        $[100] = trendingUIs.length;
        $[101] = t9;
    } else {
        t9 = $[101];
    }
    let t10;
    if ($[102] !== t2 || $[103] !== t3 || $[104] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            children: [
                t3,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 451,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[102] = t2;
        $[103] = t3;
        $[104] = t9;
        $[105] = t10;
    } else {
        t10 = $[105];
    }
    let t11;
    if ($[106] !== t10 || $[107] !== t4 || $[108] !== t5) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t4,
            children: [
                t5,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 461,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[106] = t10;
        $[107] = t4;
        $[108] = t5;
        $[109] = t11;
    } else {
        t11 = $[109];
    }
    let t12;
    if ($[110] !== t11 || $[111] !== t6 || $[112] !== t7 || $[113] !== t8) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: [
                t7,
                t8,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 471,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[110] = t11;
        $[111] = t6;
        $[112] = t7;
        $[113] = t8;
        $[114] = t12;
    } else {
        t12 = $[114];
    }
    return t12;
};
_s(OverviewSection, "kcjGHDrl+r2sIT+dnUS+mSjCJMo=");
_c = OverviewSection;
const __TURBOPACK__default__export__ = OverviewSection;
function _temp(stat) {
    let icon = Icons.TrendingUp;
    let colorKey = stat.color || "blue";
    const label = stat.label?.toLowerCase() || "";
    if (label.includes("download")) {
        icon = Icons.Download;
        colorKey = "emerald";
    } else {
        if (label.includes("active user")) {
            icon = Icons.TrendingUp;
            colorKey = "indigo";
        } else {
            if (label.includes("live ui")) {
                icon = Icons.Layers;
                colorKey = "amber";
            } else {
                if (label.includes("engagement")) {
                    icon = Icons.Zap;
                    colorKey = "rose";
                }
            }
        }
    }
    return {
        ...stat,
        icon,
        styles: getColorStyles(colorKey)
    };
}
function _temp2(stat_0, idx) {
    if (stat_0.label === "Total Revenue") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "group relative p-6 rounded-3xl bg-[#0c0c0e] border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-amber-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 514,
                    columnNumber: 203
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 flex flex-col justify-between h-full min-h-[140px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-start mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5 fill-none stroke-current stroke-[2.5]",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Dollar, {}, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                            lineNumber: 514,
                                            columnNumber: 671
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                        lineNumber: 514,
                                        columnNumber: 588
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 514,
                                    columnNumber: 497
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-500/20 text-amber-400 bg-amber-500/5",
                                    children: "+12.5%"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 514,
                                    columnNumber: 699
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 514,
                            columnNumber: 442
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1",
                                    children: "Total Revenue"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 514,
                                    columnNumber: 869
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-4xl font-medium text-white tracking-tight flex items-baseline gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-2xl text-zinc-500 font-bold",
                                            children: "$"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                            lineNumber: 514,
                                            columnNumber: 1058
                                        }, this),
                                        stat_0.value
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 514,
                                    columnNumber: 969
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 514,
                            columnNumber: 864
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "60",
                                height: "30",
                                viewBox: "0 0 60 30",
                                fill: "none",
                                className: "stroke-amber-500 stroke-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M0 25 L10 20 L20 22 L30 10 L40 15 L50 5 L60 8"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 514,
                                    columnNumber: 1336
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 514,
                                columnNumber: 1238
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                            lineNumber: 514,
                            columnNumber: 1142
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 514,
                    columnNumber: 360
                }, this)
            ]
        }, idx, true, {
            fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
            lineNumber: 514,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group relative p-6 rounded-3xl bg-[#0c0c0e] border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${stat_0.styles.glow}`
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 516,
                columnNumber: 201
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex flex-col justify-between h-full min-h-[140px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-3 rounded-2xl ${stat_0.styles.bg} ${stat_0.styles.text} border border-white/5`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5 fill-none stroke-current stroke-[2.5]",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(stat_0.icon, {}, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                        lineNumber: 516,
                                        columnNumber: 683
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                    lineNumber: 516,
                                    columnNumber: 600
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 516,
                                columnNumber: 501
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${stat_0.change.includes("+") ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" : "border-rose-500/20 text-rose-400 bg-rose-500/5"}`,
                                children: [
                                    stat_0.change.includes("+") ? "\u2191" : "\u2193",
                                    " ",
                                    stat_0.change.replace(/[+-]/g, "")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 516,
                                columnNumber: 710
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 516,
                        columnNumber: 451
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2",
                                children: stat_0.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 516,
                                columnNumber: 1056
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-4xl font-medium text-white tracking-tight",
                                children: stat_0.value
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 516,
                                columnNumber: 1157
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 516,
                        columnNumber: 1051
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 516,
                columnNumber: 369
            }, this)
        ]
    }, idx, true, {
        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
        lineNumber: 516,
        columnNumber: 10
    }, this);
}
function _temp3(activity, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-4 p-3.5 rounded-2xl bg-white/2 border border-white/5 hover:border-indigo-500/20 hover:bg-white/4 transition-all cursor-pointer group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `mt-0.5 min-w-[32px] h-8 rounded-lg flex items-center justify-center border ${activity.type === "PAYMENT" ? "bg-emerald-500/10 border-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 border-indigo-500/10 text-indigo-400"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 fill-none stroke-current stroke-[2]",
                    viewBox: "0 0 24 24",
                    children: activity.type === "PAYMENT" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Zap, {}, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 519,
                        columnNumber: 533
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.TrendingUp, {}, void 0, false, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 519,
                        columnNumber: 549
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                    lineNumber: 519,
                    columnNumber: 421
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 519,
                columnNumber: 177
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-baseline mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-bold text-white group-hover:text-indigo-400 transition-colors truncate",
                                children: activity.uiTitle || "System Event"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 519,
                                columnNumber: 672
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[9px] font-bold text-zinc-600 uppercase tabular-nums",
                                children: activity.time && !isNaN(new Date(activity.time).getTime()) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistanceToNow"])(new Date(activity.time), {
                                    addSuffix: true
                                }).replace("about ", "") : "\u2014"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 519,
                                columnNumber: 815
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 519,
                        columnNumber: 614
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] text-zinc-500 leading-snug font-mono",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-300 font-semibold",
                                children: activity.user
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                                lineNumber: 521,
                                columnNumber: 124
                            }, this),
                            " ",
                            activity.message
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                        lineNumber: 521,
                        columnNumber: 60
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
                lineNumber: 519,
                columnNumber: 582
            }, this)
        ]
    }, i, true, {
        fileName: "[project]/src/components/dashboard/OverviewSection.tsx",
        lineNumber: 519,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "OverviewSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/InventorySection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Pagination.tsx [app-client] (ecmascript)");
;
;
;
const InventorySection = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "cecf5c85535ef521525afced7a845f05a8b7bd9aa37cc376c85fcfe9872c4029") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cecf5c85535ef521525afced7a845f05a8b7bd9aa37cc376c85fcfe9872c4029";
    }
    const { isLoading, uis, uisPage, uisTotalPages, setUisPage, handleDelete, setCurrentUI, setIsEditOpen, setIsAddOpen } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-bold text-white tracking-tight mb-1",
                    children: "Inventory Management"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                    lineNumber: 37,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500",
                    children: "Manage and deploy digital assets to the marketplace"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                    lineNumber: 37,
                    columnNumber: 105
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== setCurrentUI || $[3] !== setIsAddOpen) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-5 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.01]",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        setCurrentUI({});
                        setIsAddOpen(true);
                    },
                    className: "px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 whitespace-nowrap hover:shadow-indigo-500/20",
                    children: "Deploy New UI"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                    lineNumber: 44,
                    columnNumber: 146
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
            lineNumber: 44,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = setCurrentUI;
        $[3] = setIsAddOpen;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== handleDelete || $[6] !== isLoading || $[7] !== setCurrentUI || $[8] !== setIsEditOpen || $[9] !== setUisPage || $[10] !== uis || $[11] !== uisPage || $[12] !== uisTotalPages) {
        t3 = isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-20 text-center text-gray-400 font-medium animate-pulse",
            children: "Accessing Database..."
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
            lineNumber: 56,
            columnNumber: 22
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "overflow-x-auto animate-fade-in-up delay-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-8 py-5 whitespace-nowrap",
                                        children: "Identity"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                        lineNumber: 56,
                                        columnNumber: 349
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-8 py-5 whitespace-nowrap",
                                        children: "Pricing"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                        lineNumber: 56,
                                        columnNumber: 406
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-8 py-5 whitespace-nowrap",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                        lineNumber: 56,
                                        columnNumber: 462
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-8 py-5 whitespace-nowrap",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                        lineNumber: 56,
                                        columnNumber: 519
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                lineNumber: 56,
                                columnNumber: 231
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                            lineNumber: 56,
                            columnNumber: 224
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-white/5",
                            children: uis.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "group hover:bg-white/[0.02] transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-8 py-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-5 min-w-[300px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-14 w-20 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 shrink-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: product.imageSrc,
                                                            referrerPolicy: "no-referrer",
                                                            className: "w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                            lineNumber: 56,
                                                            columnNumber: 909
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                        lineNumber: 56,
                                                        columnNumber: 811
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block font-medium text-white group-hover:text-indigo-400 transition-colors text-sm mb-0.5",
                                                                children: product.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                                lineNumber: 56,
                                                                columnNumber: 1072
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] font-bold uppercase text-gray-500 tracking-wider",
                                                                children: [
                                                                    "By ",
                                                                    product.author
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                                lineNumber: 56,
                                                                columnNumber: 1202
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                        lineNumber: 56,
                                                        columnNumber: 1067
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                lineNumber: 56,
                                                columnNumber: 756
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                            lineNumber: 56,
                                            columnNumber: 730
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-8 py-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${product.price === "Free" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-white border border-white/10"}`,
                                                children: product.price
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                lineNumber: 56,
                                                columnNumber: 1350
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                            lineNumber: 56,
                                            columnNumber: 1324
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-8 py-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-gray-400",
                                                children: product.category
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                lineNumber: 56,
                                                columnNumber: 1641
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                            lineNumber: 56,
                                            columnNumber: 1615
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-8 py-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setCurrentUI(product);
                                                            setIsEditOpen(true);
                                                        },
                                                        className: "px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-indigo-400 transition-colors",
                                                        children: "Edit"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                        lineNumber: 56,
                                                        columnNumber: 1777
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDelete(product.id),
                                                        className: "px-4 py-2 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-xs font-bold text-red-500 transition-colors",
                                                        children: "Delete"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                        lineNumber: 59,
                                                        columnNumber: 147
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                                lineNumber: 56,
                                                columnNumber: 1749
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                            lineNumber: 56,
                                            columnNumber: 1723
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, product.id, true, {
                                    fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                                    lineNumber: 56,
                                    columnNumber: 651
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                            lineNumber: 56,
                            columnNumber: 588
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                    lineNumber: 56,
                    columnNumber: 188
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    currentPage: uisPage,
                    totalPages: uisTotalPages,
                    onPageChange: setUisPage,
                    className: "pb-6"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/InventorySection.tsx",
                    lineNumber: 59,
                    columnNumber: 360
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
            lineNumber: 56,
            columnNumber: 126
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = handleDelete;
        $[6] = isLoading;
        $[7] = setCurrentUI;
        $[8] = setIsEditOpen;
        $[9] = setUisPage;
        $[10] = uis;
        $[11] = uisPage;
        $[12] = uisTotalPages;
        $[13] = t3;
    } else {
        t3 = $[13];
    }
    let t4;
    if ($[14] !== t2 || $[15] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden mb-20 relative animate-fade-in-up",
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/InventorySection.tsx",
            lineNumber: 74,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[14] = t2;
        $[15] = t3;
        $[16] = t4;
    } else {
        t4 = $[16];
    }
    return t4;
};
_c = InventorySection;
const __TURBOPACK__default__export__ = InventorySection;
var _c;
__turbopack_context__.k.register(_c, "InventorySection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/PaymentsSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Pagination.tsx [app-client] (ecmascript)");
;
;
;
const PaymentsSection = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "9d9107e2c0f2624238d25ccc919813e881aa061294b5c746594289665ee5ab0b") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9d9107e2c0f2624238d25ccc919813e881aa061294b5c746594289665ee5ab0b";
    }
    const { payments, paymentsPage, paymentsTotalPages, setPaymentsPage } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-5 sm:p-8 border-b border-white/5 bg-white/[0.01]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-bold text-white tracking-tight mb-1",
                    children: "Ledger Operations"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                    lineNumber: 26,
                    columnNumber: 78
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500",
                    children: "Real-time transaction monitoring and dispute management"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                    lineNumber: 26,
                    columnNumber: 165
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
            lineNumber: 26,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Trace ID"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                        lineNumber: 33,
                        columnNumber: 135
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Customer Identity"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                        lineNumber: 33,
                        columnNumber: 192
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Timestamp"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                        lineNumber: 33,
                        columnNumber: 258
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Amount"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                        lineNumber: 33,
                        columnNumber: 316
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Status"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                        lineNumber: 33,
                        columnNumber: 371
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                lineNumber: 33,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
            lineNumber: 33,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== payments) {
        t3 = payments.map(_temp);
        $[3] = payments;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "w-full text-left",
            children: [
                t2,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    className: "divide-y divide-white/5",
                    children: t3
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                    lineNumber: 48,
                    columnNumber: 50
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
            lineNumber: 48,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = t3;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== paymentsPage || $[8] !== paymentsTotalPages || $[9] !== setPaymentsPage) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            currentPage: paymentsPage,
            totalPages: paymentsTotalPages,
            onPageChange: setPaymentsPage,
            className: "pb-6"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
            lineNumber: 56,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = paymentsPage;
        $[8] = paymentsTotalPages;
        $[9] = setPaymentsPage;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    let t6;
    if ($[11] !== t4 || $[12] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden animate-fade-in mb-20",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: [
                        t4,
                        t5
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                    lineNumber: 66,
                    columnNumber: 121
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
            lineNumber: 66,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[11] = t4;
        $[12] = t5;
        $[13] = t6;
    } else {
        t6 = $[13];
    }
    return t6;
};
_c = PaymentsSection;
const __TURBOPACK__default__export__ = PaymentsSection;
function _temp(tx) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        className: "hover:bg-white/[0.02] transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6 font-mono text-xs text-gray-600",
                children: tx.id
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                lineNumber: 77,
                columnNumber: 78
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6 font-medium text-white text-sm",
                children: tx.customerName
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                lineNumber: 77,
                columnNumber: 148
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6 text-gray-500 text-xs font-medium",
                children: tx.date
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                lineNumber: 77,
                columnNumber: 227
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6 font-medium text-white text-lg",
                children: tx.amount
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                lineNumber: 77,
                columnNumber: 301
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${tx.status === "completed" ? "border-emerald-500/10 text-emerald-400 bg-emerald-500/5" : tx.status === "pending" ? "border-amber-500/10 text-amber-400 bg-amber-500/5" : "border-rose-500/10 text-rose-400 bg-rose-500/5"}`,
                    children: tx.status
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                    lineNumber: 77,
                    columnNumber: 400
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
                lineNumber: 77,
                columnNumber: 374
            }, this)
        ]
    }, tx.id, true, {
        fileName: "[project]/src/components/dashboard/PaymentsSection.tsx",
        lineNumber: 77,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "PaymentsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/UsersSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Pagination.tsx [app-client] (ecmascript)");
;
;
;
const UsersSection = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "1e435eca093d48da7ffc4664731b8a46978773e6a462bd1f80797e6d5fdaeeb9") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1e435eca093d48da7ffc4664731b8a46978773e6a462bd1f80797e6d5fdaeeb9";
    }
    const { users, usersPage, usersTotalPages, setUsersPage } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-bold text-white tracking-tight mb-1",
                    children: "Customer Ecosystem"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 26,
                    columnNumber: 15
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500",
                    children: "Relationship management and user engagement metrics"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 26,
                    columnNumber: 103
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 26,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[10px] font-bold text-gray-500 uppercase tracking-widest",
            children: "Total Users"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 33,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== users.length) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-5 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.01]",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right",
                        children: [
                            t2,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold text-white",
                                children: users.length
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                                lineNumber: 40,
                                columnNumber: 206
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                        lineNumber: 40,
                        columnNumber: 174
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 40,
                    columnNumber: 146
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[3] = users.length;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "User Identity"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                        lineNumber: 48,
                        columnNumber: 135
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Status"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                        lineNumber: 48,
                        columnNumber: 197
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Role"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                        lineNumber: 48,
                        columnNumber: 252
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap",
                        children: "Ingress Date"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                        lineNumber: 48,
                        columnNumber: 305
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-8 py-5 whitespace-nowrap text-right",
                        children: "Lifetime Value"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                        lineNumber: 48,
                        columnNumber: 366
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                lineNumber: 48,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 48,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== users) {
        t5 = users.map(_temp);
        $[6] = users;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    let t6;
    if ($[8] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "w-full text-left border-collapse",
            children: [
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    className: "divide-y divide-white/5",
                    children: t5
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 63,
                    columnNumber: 66
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 63,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[8] = t5;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    let t7;
    if ($[10] !== setUsersPage || $[11] !== usersPage || $[12] !== usersTotalPages) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            currentPage: usersPage,
            totalPages: usersTotalPages,
            onPageChange: setUsersPage,
            className: "pb-6"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 71,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[10] = setUsersPage;
        $[11] = usersPage;
        $[12] = usersTotalPages;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== t6 || $[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "overflow-x-auto",
            children: [
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 81,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[14] = t6;
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== t3 || $[18] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden animate-fade-in mb-20",
            children: [
                t3,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
            lineNumber: 90,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[17] = t3;
        $[18] = t8;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    return t9;
};
_c = UsersSection;
const __TURBOPACK__default__export__ = UsersSection;
function _temp(user, idx) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        className: "hover:bg-white/[0.02] transition-all group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-bold text-white text-sm group-hover:text-indigo-400 transition-colors",
                            children: user.name && user.name !== "Unknown" ? user.name : user.email
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                            lineNumber: 101,
                            columnNumber: 163
                        }, this),
                        user.name && user.name !== "Unknown" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5",
                            children: user.email
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                            lineNumber: 101,
                            columnNumber: 361
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 101,
                    columnNumber: 132
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                lineNumber: 101,
                columnNumber: 106
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "relative flex h-2 w-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                                    lineNumber: 101,
                                    columnNumber: 581
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                                    lineNumber: 101,
                                    columnNumber: 688
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                            lineNumber: 101,
                            columnNumber: 541
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] font-bold text-emerald-500 uppercase tracking-widest",
                            children: "Active"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                            lineNumber: 101,
                            columnNumber: 772
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 101,
                    columnNumber: 499
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                lineNumber: 101,
                columnNumber: 473
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${user.role === "ADMIN" ? "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]" : "text-blue-400 bg-blue-500/5 border-blue-500/20"}`,
                    children: user.role
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 101,
                    columnNumber: 906
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                lineNumber: 101,
                columnNumber: 880
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-wider font-mono",
                children: user.joinedDate
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                lineNumber: 101,
                columnNumber: 1201
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-8 py-6 text-right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-end",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-bold text-white",
                            children: [
                                user.purchases,
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-gray-600 font-bold ml-1 uppercase tracking-widest",
                                    children: "Orders"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                                    lineNumber: 101,
                                    columnNumber: 1458
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                            lineNumber: 101,
                            columnNumber: 1394
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5",
                            children: [
                                "LTV: $",
                                user.lifetimeValue || 0
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                            lineNumber: 101,
                            columnNumber: 1563
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                    lineNumber: 101,
                    columnNumber: 1353
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/UsersSection.tsx",
                lineNumber: 101,
                columnNumber: 1316
            }, this)
        ]
    }, user.user_id ?? user.id ?? idx, true, {
        fileName: "[project]/src/components/dashboard/UsersSection.tsx",
        lineNumber: 101,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "UsersSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/DashboardModals.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
;
;
const DashboardModals = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(141);
    if ($[0] !== "5fb6eb8baf8b72742111bfede943bd80ec2bc1f4ce0f6ee105c7c18aeee0b66c") {
        for(let $i = 0; $i < 141; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5fb6eb8baf8b72742111bfede943bd80ec2bc1f4ce0f6ee105c7c18aeee0b66c";
    }
    const { isAddOpen, isEditOpen, setIsAddOpen, setIsEditOpen, currentUI, setCurrentUI, handleSave, files, setFiles, previews, setPreviews } = t0;
    if (!isAddOpen && !isEditOpen) {
        return null;
    }
    const t1 = isAddOpen ? "Deploy New Asset" : "Update Asset";
    let t2;
    if ($[1] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-xl sm:text-2xl font-bold text-white tracking-tight",
            children: t1
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 58,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t1;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== setIsAddOpen || $[4] !== setIsEditOpen) {
        t3 = ()=>{
            setIsAddOpen(false);
            setIsEditOpen(false);
        };
        $[3] = setIsAddOpen;
        $[4] = setIsEditOpen;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 2,
            stroke: "currentColor",
            className: "w-5 h-5",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M6 18L18 6M6 6l12 12"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                lineNumber: 78,
                columnNumber: 140
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 78,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== t3) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t3,
            className: "p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors",
            children: t4
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 85,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = t3;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] !== t2 || $[10] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between mb-6",
            children: [
                t2,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 93,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[9] = t2;
        $[10] = t5;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    const t7 = currentUI.title || "";
    let t8;
    if ($[12] !== currentUI || $[13] !== setCurrentUI) {
        t8 = (e)=>setCurrentUI({
                ...currentUI,
                title: e.target.value
            });
        $[12] = currentUI;
        $[13] = setCurrentUI;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== t7 || $[16] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            placeholder: "Title",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none",
            value: t7,
            onChange: t8
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 115,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[15] = t7;
        $[16] = t8;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    const t10 = currentUI.price || "";
    let t11;
    if ($[18] !== currentUI || $[19] !== setCurrentUI) {
        t11 = (e_0)=>setCurrentUI({
                ...currentUI,
                price: e_0.target.value
            });
        $[18] = currentUI;
        $[19] = setCurrentUI;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    let t12;
    if ($[21] !== t10 || $[22] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            placeholder: "Price (e.g. $49)",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none",
            value: t10,
            onChange: t11
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 137,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[21] = t10;
        $[22] = t11;
        $[23] = t12;
    } else {
        t12 = $[23];
    }
    const t13 = currentUI.category || "";
    let t14;
    if ($[24] !== currentUI || $[25] !== setCurrentUI) {
        t14 = (e_1)=>setCurrentUI({
                ...currentUI,
                category: e_1.target.value
            });
        $[24] = currentUI;
        $[25] = setCurrentUI;
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] !== t13 || $[28] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            placeholder: "Category",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none",
            value: t13,
            onChange: t14
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 159,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[27] = t13;
        $[28] = t14;
        $[29] = t15;
    } else {
        t15 = $[29];
    }
    let t16;
    if ($[30] !== t12 || $[31] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-4",
            children: [
                t12,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 168,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[30] = t12;
        $[31] = t15;
        $[32] = t16;
    } else {
        t16 = $[32];
    }
    const t17 = currentUI.color || "";
    let t18;
    if ($[33] !== currentUI || $[34] !== setCurrentUI) {
        t18 = (e_2)=>setCurrentUI({
                ...currentUI,
                color: e_2.target.value
            });
        $[33] = currentUI;
        $[34] = setCurrentUI;
        $[35] = t18;
    } else {
        t18 = $[35];
    }
    let t19;
    if ($[36] !== t17 || $[37] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            placeholder: "Brand Color (e.g. #4F46E5)",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none",
            value: t17,
            onChange: t18
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 190,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[36] = t17;
        $[37] = t18;
        $[38] = t19;
    } else {
        t19 = $[38];
    }
    let t20;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "text-xs text-gray-400 font-bold uppercase tracking-widest pl-1",
            children: "Rating (0-5)"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 199,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[39] = t20;
    } else {
        t20 = $[39];
    }
    const t21 = currentUI.rating || "";
    let t22;
    if ($[40] !== currentUI || $[41] !== setCurrentUI) {
        t22 = (e_3)=>setCurrentUI({
                ...currentUI,
                rating: parseFloat(e_3.target.value)
            });
        $[40] = currentUI;
        $[41] = setCurrentUI;
        $[42] = t22;
    } else {
        t22 = $[42];
    }
    let t23;
    if ($[43] !== t21 || $[44] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-1",
            children: [
                t20,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    min: "0",
                    max: "5",
                    step: "0.1",
                    placeholder: "4.8",
                    className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none",
                    value: t21,
                    onChange: t22
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 219,
                    columnNumber: 43
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 219,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[43] = t21;
        $[44] = t22;
        $[45] = t23;
    } else {
        t23 = $[45];
    }
    let t24;
    if ($[46] !== isAddOpen || $[47] !== previews || $[48] !== setFiles || $[49] !== setPreviews) {
        t24 = isAddOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "text-xs text-gray-400 font-bold uppercase tracking-widest pl-1",
                    children: "Banner Image"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 228,
                    columnNumber: 51
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "file",
                            accept: "image/*",
                            className: "hidden",
                            id: "banner-upload",
                            onChange: (e_4)=>{
                                const file = e_4.target.files ? e_4.target.files[0] : null;
                                if (file) {
                                    setFiles((prev)=>({
                                            ...prev,
                                            banner: file
                                        }));
                                    setPreviews((prev_0)=>({
                                            ...prev_0,
                                            banner: URL.createObjectURL(file)
                                        }));
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 228,
                            columnNumber: 185
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "banner-upload",
                            className: `flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer ${previews.banner ? "border-indigo-500/50 bg-indigo-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`,
                            children: previews.banner ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-full h-full p-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: previews.banner,
                                        className: "w-full h-full object-cover rounded-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 240,
                                        columnNumber: 359
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-white uppercase tracking-widest",
                                            children: "Change Image"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                            lineNumber: 240,
                                            columnNumber: 581
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 240,
                                        columnNumber: 438
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                lineNumber: 240,
                                columnNumber: 315
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center gap-2 text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: 1.5,
                                        stroke: "currentColor",
                                        className: "w-8 h-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                            lineNumber: 240,
                                            columnNumber: 884
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 240,
                                        columnNumber: 752
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold uppercase tracking-wider",
                                        children: "Click to upload banner"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 240,
                                        columnNumber: 1245
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                lineNumber: 240,
                                columnNumber: 688
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 240,
                            columnNumber: 14
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 228,
                    columnNumber: 153
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 228,
            columnNumber: 24
        }, ("TURBOPACK compile-time value", void 0));
        $[46] = isAddOpen;
        $[47] = previews;
        $[48] = setFiles;
        $[49] = setPreviews;
        $[50] = t24;
    } else {
        t24 = $[50];
    }
    let t25;
    if ($[51] !== files || $[52] !== isAddOpen || $[53] !== setFiles) {
        t25 = isAddOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "text-xs text-gray-400 font-bold uppercase tracking-widest pl-1",
                    children: "UI Asset File"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 251,
                    columnNumber: 51
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "file",
                            accept: ".zip,.rar,.7z,.pdf",
                            className: "hidden",
                            id: "file-upload",
                            onChange: (e_5)=>setFiles((prev_1)=>({
                                        ...prev_1,
                                        uiFile: e_5.target.files ? e_5.target.files[0] : null
                                    }))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 251,
                            columnNumber: 180
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "file-upload",
                            className: `flex items-center gap-4 w-full p-4 rounded-xl border cursor-pointer transition-all ${files.uiFile ? "bg-amber-500/10 border-amber-500/50" : "bg-black/50 border-white/10 hover:bg-white/5 hover:border-white/20"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `p-3 rounded-lg ${files.uiFile ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-gray-500"}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: 1.5,
                                        stroke: "currentColor",
                                        className: "w-6 h-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                            lineNumber: 254,
                                            columnNumber: 515
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 254,
                                        columnNumber: 383
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                    lineNumber: 254,
                                    columnNumber: 269
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: files.uiFile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-white truncate max-w-[120px]",
                                                        children: files.uiFile.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 943
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-0.5 rounded bg-[#FF00FF] border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_#FF00FF]",
                                                        children: files.uiFile.name.split(".").pop()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 1033
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                lineNumber: 254,
                                                columnNumber: 902
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-amber-500 font-medium lowercase",
                                                children: [
                                                    (files.uiFile.size / 1024 / 1024).toFixed(2),
                                                    " MB"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                lineNumber: 254,
                                                columnNumber: 1242
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-400",
                                                children: "Upload Source File"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                lineNumber: 254,
                                                columnNumber: 1367
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-gray-600 font-bold uppercase tracking-wider",
                                                children: "ZIP, RAR, 7Z, PDF"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                lineNumber: 254,
                                                columnNumber: 1438
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                    lineNumber: 254,
                                    columnNumber: 852
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 py-2 bg-white/5 rounded-lg text-xs font-bold text-white uppercase tracking-wider",
                                    children: files.uiFile ? "Change" : "Browse"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                    lineNumber: 254,
                                    columnNumber: 1545
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 254,
                            columnNumber: 16
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 251,
                    columnNumber: 154
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 251,
            columnNumber: 24
        }, ("TURBOPACK compile-time value", void 0));
        $[51] = files;
        $[52] = isAddOpen;
        $[53] = setFiles;
        $[54] = t25;
    } else {
        t25 = $[54];
    }
    let t26;
    if ($[55] !== files || $[56] !== isAddOpen || $[57] !== previews || $[58] !== setFiles || $[59] !== setPreviews) {
        t26 = isAddOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "text-xs text-gray-400 font-bold uppercase tracking-widest pl-1",
                    children: "Showcase Images (Max 3)"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 264,
                    columnNumber: 51
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-3 gap-4",
                    children: [
                        0,
                        1,
                        2
                    ].map((idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative group aspect-square",
                            children: previews.showcase[idx] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full relative rounded-xl overflow-hidden border border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: previews.showcase[idx],
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 264,
                                        columnNumber: 398
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const newFiles = [
                                                    ...files.showcase
                                                ];
                                                const newPreviews = [
                                                    ...previews.showcase
                                                ];
                                                newFiles.splice(idx, 1);
                                                newPreviews.splice(idx, 1);
                                                setFiles((prev_2)=>({
                                                        ...prev_2,
                                                        showcase: newFiles
                                                    }));
                                                setPreviews((prev_3)=>({
                                                        ...prev_3,
                                                        showcase: newPreviews
                                                    }));
                                            },
                                            className: "p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                strokeWidth: 2,
                                                stroke: "currentColor",
                                                className: "w-4 h-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 254
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                lineNumber: 277,
                                                columnNumber: 124
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                            lineNumber: 264,
                                            columnNumber: 607
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 264,
                                        columnNumber: 473
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                lineNumber: 264,
                                columnNumber: 308
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        accept: "image/*",
                                        className: "hidden",
                                        id: `showcase-${idx}`,
                                        onChange: (e_6)=>{
                                            if (e_6.target.files && e_6.target.files[0]) {
                                                const file_0 = e_6.target.files[0];
                                                setFiles((prev_4)=>{
                                                    const newShowcase = [
                                                        ...prev_4.showcase
                                                    ];
                                                    newShowcase[idx] = file_0;
                                                    return {
                                                        ...prev_4,
                                                        showcase: newShowcase
                                                    };
                                                });
                                                setPreviews((prev_5)=>{
                                                    const newShowcase_0 = [
                                                        ...prev_5.showcase
                                                    ];
                                                    newShowcase_0[idx] = URL.createObjectURL(file_0);
                                                    return {
                                                        ...prev_5,
                                                        showcase: newShowcase_0
                                                    };
                                                });
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 277,
                                        columnNumber: 751
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: `showcase-${idx}`,
                                        className: "flex items-center justify-center w-full h-full rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: 2,
                                            stroke: "currentColor",
                                            className: "w-5 h-5 text-gray-500",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M12 4.5v15m7.5-7.5h-15"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                                lineNumber: 297,
                                                columnNumber: 359
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                            lineNumber: 297,
                                            columnNumber: 215
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                        lineNumber: 297,
                                        columnNumber: 18
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true)
                        }, idx, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 264,
                            columnNumber: 226
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 264,
                    columnNumber: 164
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 264,
            columnNumber: 24
        }, ("TURBOPACK compile-time value", void 0));
        $[55] = files;
        $[56] = isAddOpen;
        $[57] = previews;
        $[58] = setFiles;
        $[59] = setPreviews;
        $[60] = t26;
    } else {
        t26 = $[60];
    }
    const t27 = currentUI.author || "";
    let t28;
    if ($[61] !== currentUI || $[62] !== setCurrentUI) {
        t28 = (e_7)=>setCurrentUI({
                ...currentUI,
                author: e_7.target.value
            });
        $[61] = currentUI;
        $[62] = setCurrentUI;
        $[63] = t28;
    } else {
        t28 = $[63];
    }
    let t29;
    if ($[64] !== t27 || $[65] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            placeholder: "Author Name",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none",
            value: t27,
            onChange: t28
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 322,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[64] = t27;
        $[65] = t28;
        $[66] = t29;
    } else {
        t29 = $[66];
    }
    const t30 = currentUI.overview || "";
    let t31;
    if ($[67] !== currentUI || $[68] !== setCurrentUI) {
        t31 = (e_8)=>setCurrentUI({
                ...currentUI,
                overview: e_8.target.value
            });
        $[67] = currentUI;
        $[68] = setCurrentUI;
        $[69] = t31;
    } else {
        t31 = $[69];
    }
    let t32;
    if ($[70] !== t30 || $[71] !== t31) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
            placeholder: "Details Overview",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-zinc-500 outline-none h-32 resize-none",
            value: t30,
            onChange: t31
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 344,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[70] = t30;
        $[71] = t31;
        $[72] = t32;
    } else {
        t32 = $[72];
    }
    let t33;
    if ($[73] === Symbol.for("react.memo_cache_sentinel")) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "text-xs text-gray-400 font-bold uppercase tracking-widest pl-1",
            children: "Specifications"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 353,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[73] = t33;
    } else {
        t33 = $[73];
    }
    let t34;
    if ($[74] !== currentUI || $[75] !== setCurrentUI) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                t33,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        const defaultSpecs = [
                            {
                                label: "Total Screens",
                                value: "125+",
                                desc: "Mobile & iOS screens included"
                            },
                            {
                                label: "File Format",
                                value: "Figma",
                                desc: ".fig source file included"
                            },
                            {
                                label: "Vector",
                                value: "100%",
                                desc: "Fully scalable & editable"
                            },
                            {
                                label: "Updates",
                                value: "Lifetime",
                                desc: "Free future updates included"
                            }
                        ];
                        setCurrentUI({
                            ...currentUI,
                            specifications: defaultSpecs
                        });
                    },
                    className: "text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-lg transition-colors uppercase font-bold tracking-wider",
                    children: "Reset Defaults"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 360,
                    columnNumber: 67
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 360,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[74] = currentUI;
        $[75] = setCurrentUI;
        $[76] = t34;
    } else {
        t34 = $[76];
    }
    let t35;
    if ($[77] !== currentUI.specifications) {
        t35 = currentUI.specifications && Array.isArray(currentUI.specifications) ? currentUI.specifications : [];
        $[77] = currentUI.specifications;
        $[78] = t35;
    } else {
        t35 = $[78];
    }
    let t36;
    if ($[79] !== currentUI || $[80] !== setCurrentUI || $[81] !== t35) {
        let t37;
        if ($[83] !== currentUI || $[84] !== setCurrentUI) {
            t37 = (spec, idx_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2 p-3 rounded-xl bg-black/30 border border-white/5 relative group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    placeholder: "Label (e.g. Total Screens)",
                                    className: "bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none",
                                    value: spec.label,
                                    onChange: (e_9)=>{
                                        const newSpecs = [
                                            ...currentUI.specifications || []
                                        ];
                                        newSpecs[idx_0] = {
                                            ...spec,
                                            label: e_9.target.value
                                        };
                                        setCurrentUI({
                                            ...currentUI,
                                            specifications: newSpecs
                                        });
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                    lineNumber: 401,
                                    columnNumber: 183
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    placeholder: "Value (e.g. 100+)",
                                    className: "bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none",
                                    value: spec.value,
                                    onChange: (e_10)=>{
                                        const newSpecs_0 = [
                                            ...currentUI.specifications || []
                                        ];
                                        newSpecs_0[idx_0] = {
                                            ...spec,
                                            value: e_10.target.value
                                        };
                                        setCurrentUI({
                                            ...currentUI,
                                            specifications: newSpecs_0
                                        });
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                    lineNumber: 411,
                                    columnNumber: 16
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 401,
                            columnNumber: 143
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            placeholder: "Description",
                            className: "w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:border-indigo-500 outline-none",
                            value: spec.desc,
                            onChange: (e_11)=>{
                                const newSpecs_1 = [
                                    ...currentUI.specifications || []
                                ];
                                newSpecs_1[idx_0] = {
                                    ...spec,
                                    desc: e_11.target.value
                                };
                                setCurrentUI({
                                    ...currentUI,
                                    specifications: newSpecs_1
                                });
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 421,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                const newSpecs_2 = (currentUI.specifications || []).filter((_, i)=>i !== idx_0);
                                setCurrentUI({
                                    ...currentUI,
                                    specifications: newSpecs_2
                                });
                            },
                            className: "absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                strokeWidth: 2.5,
                                stroke: "currentColor",
                                className: "w-3 h-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    d: "M6 18L18 6M6 6l12 12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                    lineNumber: 437,
                                    columnNumber: 283
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                lineNumber: 437,
                                columnNumber: 151
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 431,
                            columnNumber: 14
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, idx_0, true, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 401,
                    columnNumber: 30
                }, ("TURBOPACK compile-time value", void 0));
            $[83] = currentUI;
            $[84] = setCurrentUI;
            $[85] = t37;
        } else {
            t37 = $[85];
        }
        t36 = t35.map(t37);
        $[79] = currentUI;
        $[80] = setCurrentUI;
        $[81] = t35;
        $[82] = t36;
    } else {
        t36 = $[82];
    }
    let t37;
    if ($[86] !== currentUI || $[87] !== setCurrentUI) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>{
                const newSpecs_3 = [
                    ...currentUI.specifications || [],
                    {
                        label: "",
                        value: "",
                        desc: ""
                    }
                ];
                setCurrentUI({
                    ...currentUI,
                    specifications: newSpecs_3
                });
            },
            className: "w-full py-2 border border-dashed border-white/10 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider",
            children: "+ Add Specification"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 454,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[86] = currentUI;
        $[87] = setCurrentUI;
        $[88] = t37;
    } else {
        t37 = $[88];
    }
    let t38;
    if ($[89] !== t36 || $[90] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                t36,
                t37
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 473,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[89] = t36;
        $[90] = t37;
        $[91] = t38;
    } else {
        t38 = $[91];
    }
    let t39;
    if ($[92] !== t34 || $[93] !== t38) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                t34,
                t38
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 482,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[92] = t34;
        $[93] = t38;
        $[94] = t39;
    } else {
        t39 = $[94];
    }
    let t40;
    if ($[95] === Symbol.for("react.memo_cache_sentinel")) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "text-xs text-gray-400 font-bold uppercase tracking-widest pl-1",
            children: "Highlights"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 491,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[95] = t40;
    } else {
        t40 = $[95];
    }
    let t41;
    if ($[96] !== currentUI || $[97] !== setCurrentUI) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                t40,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        const newHighlights = [
                            ...currentUI.highlights || [],
                            ""
                        ];
                        setCurrentUI({
                            ...currentUI,
                            highlights: newHighlights
                        });
                    },
                    className: "text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-colors uppercase font-bold tracking-wider",
                    children: "+ Add Item"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 498,
                    columnNumber: 67
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 498,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[96] = currentUI;
        $[97] = setCurrentUI;
        $[98] = t41;
    } else {
        t41 = $[98];
    }
    let t42;
    if ($[99] !== currentUI.highlights) {
        t42 = currentUI.highlights && Array.isArray(currentUI.highlights) ? currentUI.highlights : [];
        $[99] = currentUI.highlights;
        $[100] = t42;
    } else {
        t42 = $[100];
    }
    let t43;
    if ($[101] !== currentUI || $[102] !== setCurrentUI || $[103] !== t42) {
        let t44;
        if ($[105] !== currentUI || $[106] !== setCurrentUI) {
            t44 = (highlight, idx_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            placeholder: `Highlight #${idx_1 + 1}`,
                            className: "flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none",
                            value: highlight,
                            onChange: (e_12)=>{
                                const newHighlights_0 = [
                                    ...currentUI.highlights || []
                                ];
                                newHighlights_0[idx_1] = e_12.target.value;
                                setCurrentUI({
                                    ...currentUI,
                                    highlights: newHighlights_0
                                });
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 523,
                            columnNumber: 75
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                const newHighlights_1 = (currentUI.highlights || []).filter((__0, i_0)=>i_0 !== idx_1);
                                setCurrentUI({
                                    ...currentUI,
                                    highlights: newHighlights_1
                                });
                            },
                            className: "px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/10 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                strokeWidth: 2,
                                stroke: "currentColor",
                                className: "w-5 h-5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    d: "M6 18L18 6M6 6l12 12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                    lineNumber: 536,
                                    columnNumber: 260
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                                lineNumber: 536,
                                columnNumber: 130
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                            lineNumber: 530,
                            columnNumber: 14
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, idx_1, true, {
                    fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                    lineNumber: 523,
                    columnNumber: 35
                }, ("TURBOPACK compile-time value", void 0));
            $[105] = currentUI;
            $[106] = setCurrentUI;
            $[107] = t44;
        } else {
            t44 = $[107];
        }
        t43 = t42.map(t44);
        $[101] = currentUI;
        $[102] = setCurrentUI;
        $[103] = t42;
        $[104] = t43;
    } else {
        t43 = $[104];
    }
    let t44;
    if ($[108] !== currentUI.highlights) {
        t44 = (!currentUI.highlights || currentUI.highlights.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-4 border border-dashed border-white/10 rounded-xl text-gray-600 text-xs",
            children: 'No highlights added yet. Click "+ Add Item" to start.'
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 553,
            columnNumber: 75
        }, ("TURBOPACK compile-time value", void 0));
        $[108] = currentUI.highlights;
        $[109] = t44;
    } else {
        t44 = $[109];
    }
    let t45;
    if ($[110] !== t43 || $[111] !== t44) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t43,
                t44
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 561,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[110] = t43;
        $[111] = t44;
        $[112] = t45;
    } else {
        t45 = $[112];
    }
    let t46;
    if ($[113] !== t41 || $[114] !== t45) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t41,
                t45
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 570,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[113] = t41;
        $[114] = t45;
        $[115] = t46;
    } else {
        t46 = $[115];
    }
    let t47;
    if ($[116] !== t16 || $[117] !== t19 || $[118] !== t23 || $[119] !== t24 || $[120] !== t25 || $[121] !== t26 || $[122] !== t29 || $[123] !== t32 || $[124] !== t39 || $[125] !== t46 || $[126] !== t9) {
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t9,
                t16,
                t19,
                t23,
                t24,
                t25,
                t26,
                t29,
                t32,
                t39,
                t46
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 579,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[116] = t16;
        $[117] = t19;
        $[118] = t23;
        $[119] = t24;
        $[120] = t25;
        $[121] = t26;
        $[122] = t29;
        $[123] = t32;
        $[124] = t39;
        $[125] = t46;
        $[126] = t9;
        $[127] = t47;
    } else {
        t47 = $[127];
    }
    let t48;
    if ($[128] !== setIsAddOpen || $[129] !== setIsEditOpen) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>{
                setIsAddOpen(false);
                setIsEditOpen(false);
            },
            className: "px-6 py-2 text-gray-400 hover:text-white",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 597,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[128] = setIsAddOpen;
        $[129] = setIsEditOpen;
        $[130] = t48;
    } else {
        t48 = $[130];
    }
    const t49 = isAddOpen ? "Deploy System" : "Save Changes";
    let t50;
    if ($[131] !== handleSave || $[132] !== t49) {
        t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleSave,
            className: "px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20",
            children: t49
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 610,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[131] = handleSave;
        $[132] = t49;
        $[133] = t50;
    } else {
        t50 = $[133];
    }
    let t51;
    if ($[134] !== t48 || $[135] !== t50) {
        t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-end gap-3 mt-8",
            children: [
                t48,
                t50
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 619,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[134] = t48;
        $[135] = t50;
        $[136] = t51;
    } else {
        t51 = $[136];
    }
    let t52;
    if ($[137] !== t47 || $[138] !== t51 || $[139] !== t6) {
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-lg relative animate-in fade-in zoom-in-95 shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto",
                children: [
                    t6,
                    t47,
                    t51
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
                lineNumber: 628,
                columnNumber: 113
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/DashboardModals.tsx",
            lineNumber: 628,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[137] = t47;
        $[138] = t51;
        $[139] = t6;
        $[140] = t52;
    } else {
        t52 = $[140];
    }
    return t52;
};
_c = DashboardModals;
const __TURBOPACK__default__export__ = DashboardModals;
var _c;
__turbopack_context__.k.register(_c, "DashboardModals");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/ResetDataModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const ResetDataModal = ({ isOpen, onClose })=>{
    _s();
    const [confirmText, setConfirmText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [terminalLogs, setTerminalLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const logsEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [targets, setTargets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        uis: false,
        users: false,
        payments: false,
        social: false,
        notifications: false
    });
    // Auto-scroll terminal
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResetDataModal.useEffect": ()=>{
            if (logsEndRef.current) {
                logsEndRef.current.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    }["ResetDataModal.useEffect"], [
        terminalLogs
    ]);
    const isAllSelected = Object.values(targets).every((v)=>v);
    const toggleAll = ()=>{
        const newValue = !isAllSelected;
        setTargets({
            uis: newValue,
            users: newValue,
            payments: newValue,
            social: newValue,
            notifications: newValue
        });
    };
    const toggleTarget = (key)=>{
        setTargets((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    };
    if (!isOpen) return null;
    const addLog = (msg)=>{
        setTerminalLogs((prev_0)=>[
                ...prev_0,
                `> ${msg}`
            ]);
    };
    const handleReset = async ()=>{
        if (confirmText !== 'DELETE') return;
        if (!Object.values(targets).some((v_0)=>v_0)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Please select at least one data category to reset.");
            return;
        }
        setIsDeleting(true);
        setTerminalLogs([
            'INITIALIZING RESET...',
            'CONNECTING TO DATABASE...'
        ]);
        // Simulation of "work" before the actual API call
        await new Promise((r)=>setTimeout(r, 800));
        addLog('VERIFYING PERMISSIONS... [OK]');
        await new Promise((r_0)=>setTimeout(r_0, 600));
        if (targets.uis) {
            addLog('LOCATING LINKED DRIVE FILES...');
            await new Promise((r_1)=>setTimeout(r_1, 500));
        }
        addLog('STARTING DELETION PROCESS...');
        try {
            const apiUrl = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            // Actual call
            const res = await fetch(`${apiUrl}/api/admin/reset`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({
                    options: {
                        ...targets,
                        drive: targets.uis
                    }
                })
            });
            const data = await res.json();
            if (data.status) {
                addLog('DELETION COMPLETE.');
                addLog('SYSTEM CLEAN.');
                addLog('REFRESHING DASHBOARD...');
                setTimeout(()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Reset Successful");
                    onClose();
                    window.location.reload();
                }, 2000);
            } else {
                addLog(`ERROR: ${data.message || 'Operation Failed'}`);
                addLog('STOPPING...');
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(data.message || "Reset failed");
                setTimeout(()=>setIsDeleting(false), 2000);
            }
        } catch (error) {
            console.error("Reset error", error);
            addLog('FATAL: NETWORK ERROR.');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("An error occurred");
            setTimeout(()=>setIsDeleting(false), 2000);
        }
    };
    const categories = [
        {
            id: 'uis',
            label: 'Products & Inventory',
            desc: 'All products, files, and images.',
            icon: '📦'
        },
        {
            id: 'users',
            label: 'Users & Accounts',
            desc: 'Registered user profiles (exc. Admin).',
            icon: '👥'
        },
        {
            id: 'payments',
            label: 'Transactions',
            desc: 'Payments and order history.',
            icon: '💳'
        },
        {
            id: 'social',
            label: 'Community Data',
            desc: 'Comments, likes, and wishlists.',
            icon: '💬'
        },
        {
            id: 'notifications',
            label: 'Activity Logs',
            desc: 'System alerts and notifications.',
            icon: '🔔'
        }
    ];
    // TERMINAL VIEW
    if (isDeleting) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/95 font-mono",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-3xl p-8 border border-rose-900/30 bg-black rounded-lg shadow-[0_0_50px_rgba(225,29,72,0.1)] relative overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%] pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                        lineNumber: 144,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center border-b border-rose-900/50 pb-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-rose-500 font-bold tracking-widest animate-pulse",
                                children: "SYSTEM RESET IN PROGRESS"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                lineNumber: 147,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-3 h-3 rounded-full bg-rose-600 animate-ping"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 149,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                lineNumber: 148,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                        lineNumber: 146,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-64 overflow-y-auto space-y-2 font-bold text-sm custom-scrollbar relative z-10",
                        children: [
                            terminalLogs.map((log, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${log.includes('ERROR') || log.includes('FATAL') ? 'text-red-500' : 'text-rose-400/80'}`,
                                    children: log
                                }, i, false, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 154,
                                    columnNumber: 55
                                }, ("TURBOPACK compile-time value", void 0))),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: logsEndRef
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                lineNumber: 157,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-rose-500 animate-pulse",
                                children: "_"
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                lineNumber: 158,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                        lineNumber: 153,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                lineNumber: 142,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
            lineNumber: 141,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#050505] border border-zinc-800 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in relative flex flex-col max-h-[90vh] ring-1 ring-white/5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-2 overflow-hidden w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 w-[200%] h-full animate-[slide_3s_linear_infinite] bg-[repeating-linear-gradient(45deg,#000,#000_10px,#b91c1c_10px,#b91c1c_20px)] opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                        lineNumber: 168,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                    lineNumber: 167,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-8 py-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-2xl font-bold text-white flex items-center gap-3 tracking-tight",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-rose-500 text-3xl",
                                            children: "☢"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 175,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " FACTORY RESET"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 174,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-rose-500/80 mt-1 font-mono uppercase tracking-widest border border-rose-900/30 px-2 py-0.5 inline-block rounded bg-rose-950/20",
                                    children: "Admin Authorization Required"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 177,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                            lineNumber: 173,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-6 h-6",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                strokeWidth: 1.5,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    d: "M6 18L18 6M6 6l12 12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 181,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                lineNumber: 180,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                            lineNumber: 179,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                    lineNumber: 172,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 overflow-y-auto custom-scrollbar flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-8 p-5 rounded border border-rose-900/20 bg-rose-950/5 group hover:border-rose-900/40 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-bold text-rose-100 font-mono tracking-wide",
                                            children: "SELECT ALL DATA"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 192,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-rose-500/60 mt-1",
                                            children: "Selects all categories for deletion."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 193,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 191,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleAll,
                                    className: `w-6 h-6 border-2 flex items-center justify-center transition-all ${isAllSelected ? 'border-rose-500 bg-rose-500' : 'border-zinc-700 hover:border-rose-500/50'}`,
                                    children: isAllSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4 text-black font-bold",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        strokeWidth: 4,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M5 13l4 4L19 7"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 196,
                                            columnNumber: 163
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                        lineNumber: 196,
                                        columnNumber: 47
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 195,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                            lineNumber: 190,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8",
                            children: categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>toggleTarget(cat.id),
                                    className: `relative group p-4 border transition-all duration-200 cursor-pointer overflow-hidden ${targets[cat.id] ? 'bg-rose-950/10 border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.1)]' : 'bg-zinc-900/20 border-white/5 hover:border-white/10 hover:bg-zinc-900/40'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative z-10 flex items-start gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-10 h-10 flex items-center justify-center text-xl transition-colors ${targets[cat.id] ? 'text-rose-500' : 'text-zinc-600 grayscale'}`,
                                                    children: cat.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: `text-xs font-bold font-mono tracking-wider mb-1 ${targets[cat.id] ? 'text-rose-400' : 'text-zinc-400'}`,
                                                            children: cat.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                            lineNumber: 208,
                                                            columnNumber: 41
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-zinc-500 uppercase tracking-wide",
                                                            children: cat.desc
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 41
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        cat.id === 'uis' && targets.uis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mt-2 animate-pulse",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-px h-3 bg-zinc-700"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                                    lineNumber: 217,
                                                                    columnNumber: 49
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-mono text-cyan-500/80 flex items-center gap-1 border border-cyan-900/40 bg-cyan-950/20 px-1.5 rounded",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-cyan-400",
                                                                            children: "☁️"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                                            lineNumber: 219,
                                                                            columnNumber: 53
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        " Google Drive Files"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                                    lineNumber: 218,
                                                                    columnNumber: 49
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 77
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-3 h-3 border transition-colors ${targets[cat.id] ? 'bg-rose-500 border-rose-500' : 'border-zinc-700'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 203,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        targets[cat.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-rose-500 opacity-50"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 228,
                                            columnNumber: 77
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, cat.id, true, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 202,
                                    columnNumber: 48
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                            lineNumber: 201,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-white/5 pt-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-xs font-bold text-zinc-500 font-mono mb-3 flex items-center gap-2",
                                    children: [
                                        "CONFIRMATION CODE: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white bg-zinc-800 px-1 py-0.5 rounded",
                                            children: "DELETE"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 235,
                                            columnNumber: 48
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 234,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: confirmText,
                                    onChange: (e)=>setConfirmText(e.target.value),
                                    className: "w-full bg-black border border-white/10 px-6 py-4 text-white placeholder-zinc-800 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all font-mono text-lg tracking-widest text-center",
                                    placeholder: "Type DELETE to Unlock",
                                    autoComplete: "off"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 237,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                            lineNumber: 233,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                    lineNumber: 187,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-t border-white/5 bg-zinc-900/30 backdrop-blur-sm flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[10px] text-zinc-600 font-mono uppercase tracking-wider",
                            children: "Secure System / v4.2.0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                            lineNumber: 243,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "px-6 py-3 text-xs font-bold text-zinc-500 hover:text-white transition-colors font-mono tracking-wider",
                                    children: "CANCEL"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 247,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleReset,
                                    disabled: confirmText !== 'DELETE' || !Object.values(targets).some((v_1)=>v_1),
                                    className: `px-8 py-3 text-xs font-bold transition-all shadow-lg flex items-center gap-2 font-mono tracking-widest relative overflow-hidden group
                                ${confirmText === 'DELETE' && Object.values(targets).some((v_2)=>v_2) ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-900/30' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                            `,
                                    children: [
                                        confirmText === 'DELETE' && Object.values(targets).some((v_3)=>v_3) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] opacity-20 pointer-events-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 253,
                                            columnNumber: 101
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative z-10 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg",
                                                    children: "☢"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " DELETE DATA"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                            lineNumber: 254,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                                    lineNumber: 250,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                            lineNumber: 246,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
                    lineNumber: 242,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
            lineNumber: 164,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/ResetDataModal.tsx",
        lineNumber: 163,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ResetDataModal, "G1sjHaS0sS1BGzD4ywMK5trtEtA=");
_c = ResetDataModal;
const __TURBOPACK__default__export__ = ResetDataModal;
var _c;
__turbopack_context__.k.register(_c, "ResetDataModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/NotificationBell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotificationBell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/notification.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function NotificationBell({ disableToast = false, align = 'right' }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hasUnread, setHasUnread] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const bellRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])(); // Import useAuth
    const { socket } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const fetchNotifications = async ()=>{
        try {
            // Use the service we created
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationService"].getNotifications();
            // API returns { status: true, data: [...], meta: ... }
            const notifs = Array.isArray(result.data) ? result.data : [];
            setNotifications(notifs);
            if (notifs.length > 0) setHasUnread(true);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationBell.useEffect": ()=>{
            fetchNotifications();
            if (!socket) return;
            // Ensure we join the user's room (important for SPA transitions)
            if (user) {
                socket.emit("setup", user);
            }
            // Listen for the event name we emitted in backend (ensure consistency)
            // Backend: getIO().emit('new-notification', ...)
            socket.on("new-notification", {
                "NotificationBell.useEffect": (data)=>{
                    // console.log("🔔 New Notification:", data);
                    // Filter: Only show my own notifications in the Bell
                    if (String(data.userId) !== String(user?.user_id)) return;
                    // Construct a displayable notification object
                    const newNotif = {
                        ...data,
                        created_at: new Date().toISOString()
                    };
                    setNotifications({
                        "NotificationBell.useEffect": (prev)=>{
                            // Deduplicate based on ID if present
                            if (data.id && prev.some({
                                "NotificationBell.useEffect": (n)=>n.id === data.id
                            }["NotificationBell.useEffect"])) {
                                return prev;
                            }
                            return [
                                newNotif,
                                ...prev
                            ];
                        }
                    }["NotificationBell.useEffect"]);
                    setHasUnread(true);
                    if (!disableToast) {
                    // Toasts suppressed for everyone as per user request
                    // Admin can monitor via the list, users get UI feedback elsewhere
                    }
                }
            }["NotificationBell.useEffect"]);
            return ({
                "NotificationBell.useEffect": ()=>{
                    socket.off("new-notification");
                }
            })["NotificationBell.useEffect"];
        }
    }["NotificationBell.useEffect"], [
        socket,
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationBell.useEffect": ()=>{
            const handleClickOutside = {
                "NotificationBell.useEffect.handleClickOutside": (event)=>{
                    if (bellRef.current && !bellRef.current.contains(event.target)) {
                        setIsOpen(false);
                    }
                }
            }["NotificationBell.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "NotificationBell.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["NotificationBell.useEffect"];
        }
    }["NotificationBell.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: bellRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    setIsOpen(!isOpen);
                    setHasUnread(false);
                },
                className: `relative p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        strokeWidth: 1.5,
                        stroke: "currentColor",
                        className: "w-6 h-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/NotificationBell.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/NotificationBell.tsx",
                        lineNumber: 92,
                        columnNumber: 17
                    }, this),
                    hasUnread && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-black"
                    }, void 0, false, {
                        fileName: "[project]/src/components/NotificationBell.tsx",
                        lineNumber: 95,
                        columnNumber: 31
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NotificationBell.tsx",
                lineNumber: 88,
                columnNumber: 13
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    zIndex: 100
                },
                className: `fixed top-20 left-1/2 -translate-x-1/2 w-[90vw] sm:absolute sm:top-full sm:mt-3 sm:w-80 md:w-96 sm:translate-x-0 ${align === 'right' ? 'sm:right-0 sm:left-auto sm:origin-top-right' : 'sm:left-0 sm:right-auto sm:origin-top-left'} rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b border-white/5 bg-white/5 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-bold text-white text-sm",
                                children: "Notifications"
                            }, void 0, false, {
                                fileName: "[project]/src/components/NotificationBell.tsx",
                                lineNumber: 102,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded font-medium",
                                children: "Recent"
                            }, void 0, false, {
                                fileName: "[project]/src/components/NotificationBell.tsx",
                                lineNumber: 103,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/NotificationBell.tsx",
                        lineNumber: 101,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-[400px] overflow-y-auto",
                        children: notifications.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "divide-y divide-white/5",
                            children: notifications.map((notif, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 hover:bg-white/5 transition-colors flex gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `mt-1 h-2 w-2 rounded-full shrink-0 ${notif.type === 'PAYMENT' ? 'bg-emerald-500' : notif.type === 'LIKE' ? 'bg-pink-500' : 'bg-blue-500'}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/NotificationBell.tsx",
                                            lineNumber: 108,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-300 leading-relaxed mb-1",
                                                    children: notif.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NotificationBell.tsx",
                                                    lineNumber: 110,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-500 font-medium",
                                                    children: notif.created_at ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(notif.created_at), 'MMM d, h:mm a') : 'Just now'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/NotificationBell.tsx",
                                                    lineNumber: 111,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/NotificationBell.tsx",
                                            lineNumber: 109,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/src/components/NotificationBell.tsx",
                                    lineNumber: 107,
                                    columnNumber: 71
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/NotificationBell.tsx",
                            lineNumber: 106,
                            columnNumber: 53
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center text-gray-500 text-xs",
                            children: "No new notifications"
                        }, void 0, false, {
                            fileName: "[project]/src/components/NotificationBell.tsx",
                            lineNumber: 116,
                            columnNumber: 38
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/NotificationBell.tsx",
                        lineNumber: 105,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NotificationBell.tsx",
                lineNumber: 98,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/NotificationBell.tsx",
        lineNumber: 87,
        columnNumber: 10
    }, this);
}
_s(NotificationBell, "oFpEI0GVLqHSZs+bz/GcT83p8JU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = NotificationBell;
var _c;
__turbopack_context__.k.register(_c, "NotificationBell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$interaction$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/interaction.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CommentSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CommentSection.tsx [app-client] (ecmascript)");
// Imports from new components
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$NotificationTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/NotificationTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$OverviewSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/OverviewSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$InventorySection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/InventorySection.tsx [app-client] (ecmascript)"); // Renamed locally if needed, but exported as InventorySection
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$PaymentsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/PaymentsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/UsersSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$DashboardModals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/DashboardModals.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$ResetDataModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/ResetDataModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NotificationBell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function Dashboard() {
    _s();
    const { user, logout, isLoading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])(); // Get user
    const { socket } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('overview');
    const [isSidebarOpen, setIsSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uis, setUIs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [payments, setPayments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [overviewData, setOverviewData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        stats: [
            {
                label: 'Total Downloads',
                value: '0',
                change: '+0%',
                color: 'emerald'
            },
            {
                label: 'Active Users',
                value: '0',
                change: '+0%',
                color: 'indigo'
            },
            {
                label: 'Live UIs',
                value: '0',
                change: '+0%',
                color: 'amber'
            },
            {
                label: 'Engagement Rate',
                value: '0%',
                change: '0%',
                color: 'rose'
            }
        ],
        graphData: [],
        trendingUIs: [],
        paymentStatusDistribution: {
            completed: 0,
            pending: 0,
            canceled: 0,
            failed: 0
        },
        formattedActivities: []
    });
    // Pagination State
    const [uisPage, setUisPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [uisTotalPages, setUisTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [usersPage, setUsersPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [usersTotalPages, setUsersTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [paymentsPage, setPaymentsPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [paymentsTotalPages, setPaymentsTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAddOpen, setIsAddOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditOpen, setIsEditOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentUI, setCurrentUI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [files, setFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        banner: null,
        uiFile: null,
        showcase: []
    });
    const [previews, setPreviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        banner: null,
        showcase: []
    });
    const [openCommentsId, setOpenCommentsId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isResetOpen, setIsResetOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Interaction Handlers
    const handleLike = async (e, uiId)=>{
        e.stopPropagation();
        if (!user) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Please login to like assets");
            return;
        }
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$interaction$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InteractionService"].toggleLike(uiId);
            if (response.liked) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(response.message || "Liked!");
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(response.message || "Unliked");
            }
            fetchStats(); // Refresh stats 
        } catch (error) {
            console.error("Like error", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to like");
        }
    };
    const handleWishlist = async (e_0, uiId_0)=>{
        e_0.stopPropagation();
        if (!user) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Please login to wishlist assets");
            return;
        }
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$interaction$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InteractionService"].toggleWishlist(uiId_0);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Wishlist updated");
        } catch (error_0) {
            console.error("Wishlist error", error_0);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Failed to update wishlist");
        }
    };
    // Fetch UIs
    const fetchUIs = async ()=>{
        setIsLoading(true);
        try {
            const apiUrl = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(`${apiUrl}/api/uis?page=${uisPage}&limit=12`, {
                headers
            });
            const data = await res.json();
            if (data.status) {
                setUIs(data.data);
                setUisTotalPages(data.meta?.totalPages || 1);
            }
        } catch (error_1) {
            console.error("Fetch error", error_1);
        } finally{
            setIsLoading(false);
        }
    };
    const fetchUsers = async ()=>{
        setIsLoading(true);
        try {
            const apiUrl_0 = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const token_0 = localStorage.getItem('auth_token');
            const headers_0 = {};
            if (token_0) headers_0['Authorization'] = `Bearer ${token_0}`;
            const res_0 = await fetch(`${apiUrl_0}/api/admin/users?page=${usersPage}&limit=10`, {
                headers: headers_0
            });
            const data_0 = await res_0.json();
            if (data_0.status) {
                setUsers(data_0.data);
                setUsersTotalPages(data_0.meta?.totalPages || 1);
            }
        } catch (error_2) {
            console.error("Fetch users error", error_2);
        } finally{
            setIsLoading(false);
        }
    };
    const fetchPayments = async ()=>{
        setIsLoading(true);
        try {
            const apiUrl_1 = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const token_1 = localStorage.getItem('auth_token');
            const headers_1 = {};
            if (token_1) headers_1['Authorization'] = `Bearer ${token_1}`;
            const res_1 = await fetch(`${apiUrl_1}/api/admin/payments?page=${paymentsPage}&limit=10`, {
                headers: headers_1
            });
            const data_1 = await res_1.json();
            if (data_1.status) {
                setPayments(data_1.data);
                setPaymentsTotalPages(data_1.meta?.totalPages || 1);
            }
        } catch (error_3) {
            console.error("Fetch payments error", error_3);
        } finally{
            setIsLoading(false);
        }
    };
    const fetchStats = async ()=>{
        setIsLoading(true);
        try {
            const apiUrl_2 = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const token_2 = localStorage.getItem('auth_token');
            const headers_2 = {};
            if (token_2) headers_2['Authorization'] = `Bearer ${token_2}`;
            const res_2 = await fetch(`${apiUrl_2}/api/dashboard/stats`, {
                headers: headers_2
            });
            const data_2 = await res_2.json();
            if (data_2.status && data_2.data) {
                setOverviewData(data_2.data);
            }
        } catch (error_4) {
            console.error("Fetch stats error", error_4);
        } finally{
            setIsLoading(false);
        }
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Dashboard.useEffect": ()=>{
            if (!authLoading) {
                if (!user || user.role !== 'ADMIN') {
                    router.push('/');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Unauthorized access");
                }
            }
        }
    }["Dashboard.useEffect"], [
        user,
        authLoading,
        router
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Dashboard.useEffect": ()=>{
            if (activeTab === 'overview' && user?.role === 'ADMIN') fetchStats();
        }
    }["Dashboard.useEffect"], [
        activeTab,
        user
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Dashboard.useEffect": ()=>{
            if (activeTab === 'uis') fetchUIs();
        }
    }["Dashboard.useEffect"], [
        activeTab,
        uisPage
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Dashboard.useEffect": ()=>{
            if (activeTab === 'users') fetchUsers();
        }
    }["Dashboard.useEffect"], [
        activeTab,
        usersPage
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Dashboard.useEffect": ()=>{
            if (activeTab === 'payments') fetchPayments();
        }
    }["Dashboard.useEffect"], [
        activeTab,
        paymentsPage
    ]);
    // Real-time Listeners
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Dashboard.useEffect": ()=>{
            if (!socket) return;
            // Helper to update stats optimistically
            const updateStat = {
                "Dashboard.useEffect.updateStat": (label, increment = 1)=>{
                    setOverviewData({
                        "Dashboard.useEffect.updateStat": (prev)=>({
                                ...prev,
                                stats: prev.stats.map({
                                    "Dashboard.useEffect.updateStat": (s)=>s.label === label ? {
                                            ...s,
                                            value: (parseInt(s.value.replace(/[^0-9]/g, '')) + increment).toString()
                                        } : s
                                }["Dashboard.useEffect.updateStat"])
                            })
                    }["Dashboard.useEffect.updateStat"]);
                }
            }["Dashboard.useEffect.updateStat"];
            // UI Listeners
            const handleUINew = {
                "Dashboard.useEffect.handleUINew": (data_3)=>{
                    // Update List
                    setUIs({
                        "Dashboard.useEffect.handleUINew": (prev_0)=>{
                            const exists = prev_0.find({
                                "Dashboard.useEffect.handleUINew.exists": (p)=>p.id === data_3.ui.id
                            }["Dashboard.useEffect.handleUINew.exists"]);
                            if (exists) return prev_0;
                            return [
                                data_3.ui,
                                ...prev_0
                            ].slice(0, 12);
                        }
                    }["Dashboard.useEffect.handleUINew"]);
                    // Update Stats
                    updateStat('Live UIs', 1);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("New UI Deployed!", {
                        icon: "🚀"
                    });
                }
            }["Dashboard.useEffect.handleUINew"];
            const handleUIDeleted = {
                "Dashboard.useEffect.handleUIDeleted": (data_4)=>{
                    setUIs({
                        "Dashboard.useEffect.handleUIDeleted": (prev_1)=>prev_1.filter({
                                "Dashboard.useEffect.handleUIDeleted": (u)=>u.id !== data_4.id
                            }["Dashboard.useEffect.handleUIDeleted"])
                    }["Dashboard.useEffect.handleUIDeleted"]);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("UI Deleted", {
                        icon: "🗑️"
                    });
                }
            }["Dashboard.useEffect.handleUIDeleted"];
            const handleUIUpdated = {
                "Dashboard.useEffect.handleUIUpdated": (data_5)=>{
                    setUIs({
                        "Dashboard.useEffect.handleUIUpdated": (prev_2)=>prev_2.map({
                                "Dashboard.useEffect.handleUIUpdated": (u_0)=>u_0.id === data_5.ui.id ? {
                                        ...u_0,
                                        ...data_5.ui
                                    } : u_0
                            }["Dashboard.useEffect.handleUIUpdated"])
                    }["Dashboard.useEffect.handleUIUpdated"]);
                }
            }["Dashboard.useEffect.handleUIUpdated"];
            // User Listeners
            const handleUserNew = {
                "Dashboard.useEffect.handleUserNew": (data_6)=>{
                    // Update List
                    setUsers({
                        "Dashboard.useEffect.handleUserNew": (prev_3)=>{
                            if (prev_3.length === 0) return prev_3;
                            return [
                                data_6.user,
                                ...prev_3
                            ].slice(0, 10);
                        }
                    }["Dashboard.useEffect.handleUserNew"]);
                    // Update Stats
                    updateStat('Active Users', 1);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("New User Registered!", {
                        icon: "👤"
                    });
                }
            }["Dashboard.useEffect.handleUserNew"];
            // Payment Listeners
            const handlePaymentNew = {
                "Dashboard.useEffect.handlePaymentNew": (data_7)=>{
                    // Update Payments List
                    setPayments({
                        "Dashboard.useEffect.handlePaymentNew": (prev_4)=>{
                            if (prev_4.length === 0) return prev_4;
                            return [
                                data_7.payment,
                                ...prev_4
                            ].slice(0, 10);
                        }
                    }["Dashboard.useEffect.handlePaymentNew"]);
                    // Update Payment Distribution & Revenue (Simulated for real-time)
                    setOverviewData({
                        "Dashboard.useEffect.handlePaymentNew": (prev_5)=>{
                            const newDist = {
                                ...prev_5.paymentStatusDistribution || {
                                    completed: 0,
                                    pending: 0,
                                    canceled: 0,
                                    failed: 0
                                }
                            };
                            if (data_7.payment.status === 'COMPLETED') newDist.completed++;
                            else if (data_7.payment.status === 'PENDING') newDist.pending++;
                            return {
                                ...prev_5,
                                paymentStatusDistribution: newDist
                            };
                        }
                    }["Dashboard.useEffect.handlePaymentNew"]);
                    updateStat('Total Downloads', 1); // Assuming payment = download access
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("New Payment Received!", {
                        icon: "💰"
                    });
                }
            }["Dashboard.useEffect.handlePaymentNew"];
            const handlePaymentUpdated = {
                "Dashboard.useEffect.handlePaymentUpdated": (data_8)=>{
                    setPayments({
                        "Dashboard.useEffect.handlePaymentUpdated": (prev_6)=>prev_6.map({
                                "Dashboard.useEffect.handlePaymentUpdated": (p_0)=>p_0.stripePaymentIntentId === data_8.paymentIntentId ? {
                                        ...p_0,
                                        status: data_8.status
                                    } : p_0
                            }["Dashboard.useEffect.handlePaymentUpdated"])
                    }["Dashboard.useEffect.handlePaymentUpdated"]);
                }
            }["Dashboard.useEffect.handlePaymentUpdated"];
            const handleNewNotification = {
                "Dashboard.useEffect.handleNewNotification": (notification)=>{
                    setOverviewData({
                        "Dashboard.useEffect.handleNewNotification": (prev_7)=>({
                                ...prev_7,
                                formattedActivities: [
                                    {
                                        id: notification.id,
                                        type: notification.type,
                                        message: notification.message,
                                        time: notification.created_at,
                                        // Consider formatting date here if needed, or in component
                                        user: notification.user?.full_name || 'Unknown',
                                        uiTitle: notification.ui?.title
                                    },
                                    ...(prev_7.formattedActivities || []).slice(0, 9)
                                ]
                            })
                    }["Dashboard.useEffect.handleNewNotification"]);
                // toast("New Activity: " + notification.type, { icon: "🔔" }); // Suppressed as per request
                }
            }["Dashboard.useEffect.handleNewNotification"];
            socket.on('ui:new', handleUINew);
            socket.on('ui:updated', handleUIUpdated);
            socket.on('ui:deleted', handleUIDeleted);
            socket.on('user:new', handleUserNew);
            socket.on('payment:new', handlePaymentNew);
            socket.on('payment:updated', handlePaymentUpdated);
            socket.on('new-notification', handleNewNotification);
            return ({
                "Dashboard.useEffect": ()=>{
                    socket.off('ui:new', handleUINew);
                    socket.off('ui:updated', handleUIUpdated);
                    socket.off('ui:deleted', handleUIDeleted);
                    socket.off('user:new', handleUserNew);
                    socket.off('payment:new', handlePaymentNew);
                    socket.off('payment:updated', handlePaymentUpdated);
                    socket.off('new-notification', handleNewNotification);
                }
            })["Dashboard.useEffect"];
        }
    }["Dashboard.useEffect"], [
        socket
    ]); // Removed activeTab dependency to ensure background updates
    // Handlers
    const handleSave = async ()=>{
        const loadingToast = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading(isAddOpen ? "Deploying Asset..." : "Saving Changes...");
        const apiUrl_3 = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
        const method = isAddOpen ? 'POST' : 'PUT';
        const url = isAddOpen ? `${apiUrl_3}/api/uis` : `${apiUrl_3}/api/uis/${currentUI.id}`;
        try {
            const token_3 = localStorage.getItem('auth_token');
            const headers_3 = {};
            if (token_3) {
                headers_3['Authorization'] = `Bearer ${token_3}`;
            }
            let body;
            if (isAddOpen) {
                const formData = new FormData();
                formData.append('title', currentUI.title || '');
                formData.append('price', currentUI.price || '');
                formData.append('category', currentUI.category || '');
                formData.append('author', currentUI.author || '');
                formData.append('imageSrc', currentUI.imageSrc || '');
                formData.append('google_file_id', currentUI.google_file_id || '');
                formData.append('color', currentUI.color || '');
                formData.append('overview', currentUI.overview || '');
                formData.append('rating', currentUI.rating ? currentUI.rating.toString() : '4.8');
                formData.append('specifications', JSON.stringify(currentUI.specifications || []));
                formData.append('highlights', JSON.stringify((currentUI.highlights || []).filter((h)=>h && h.trim() !== '')));
                if (files.banner) formData.append('banner', files.banner);
                if (files.uiFile) formData.append('uiFile', files.uiFile);
                if (files.showcase && files.showcase.length > 0) {
                    files.showcase.forEach((file)=>{
                        formData.append('showcase', file);
                    });
                }
                body = formData;
            } else {
                headers_3['Content-Type'] = 'application/json';
                // Ensure highlights is an array
                const payload = {
                    ...currentUI,
                    highlights: (currentUI.highlights || []).filter((h_0)=>h_0 && h_0.trim() !== '')
                };
                body = JSON.stringify(payload);
            }
            const res_3 = await fetch(url, {
                method,
                headers: headers_3,
                body
            });
            const data_9 = await res_3.json();
            if (data_9.status) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(isAddOpen ? "Asset Deployed Successfully!" : "Asset Updated!", {
                    id: loadingToast
                });
                setIsAddOpen(false);
                setIsEditOpen(false);
                setFiles({
                    banner: null,
                    uiFile: null,
                    showcase: []
                });
                setPreviews({
                    banner: null,
                    showcase: []
                });
                fetchUIs();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(data_9.message || "Operation failed", {
                    id: loadingToast
                });
            }
        } catch (error_5) {
            console.error("Save error", error_5);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("An error occurred", {
                id: loadingToast
            });
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm("Are you sure you want to delete this UI?")) return;
        const loadingToast_0 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Deleting Asset...");
        const apiUrl_4 = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
        try {
            const token_4 = localStorage.getItem('auth_token');
            const headers_4 = {};
            if (token_4) {
                headers_4['Authorization'] = `Bearer ${token_4}`;
            }
            const res_4 = await fetch(`${apiUrl_4}/api/uis/${id}`, {
                method: 'DELETE',
                headers: headers_4
            });
            const data_10 = await res_4.json();
            if (data_10.status) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Asset Deleted", {
                    id: loadingToast_0
                });
                fetchUIs();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Delete failed", {
                    id: loadingToast_0
                });
            }
        } catch (error_6) {
            console.error("Delete error", error_6);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Delete failed", {
                id: loadingToast_0
            });
        }
    };
    const navItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                stroke: "currentColor",
                className: "w-5 h-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M3.75 6v7.5m6.75-7.5V15m6.75-10.5v15M21 6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V6z"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 494,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 493,
                columnNumber: 11
            }, this)
        },
        {
            id: 'uis',
            label: 'UI Assets',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                stroke: "currentColor",
                className: "w-5 h-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3c.235.083.487.128.75.128H10.5c-.263 0-.515-.045-.75-.128m12 0A2.25 2.25 0 0019.5 9v.878m-15 0a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25m-15 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 500,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 499,
                columnNumber: 11
            }, this)
        },
        {
            id: 'payments',
            label: 'Payments',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                stroke: "currentColor",
                className: "w-5 h-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 506,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 505,
                columnNumber: 11
            }, this)
        },
        {
            id: 'users',
            label: 'Customers',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                stroke: "currentColor",
                className: "w-5 h-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 512,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 511,
                columnNumber: 11
            }, this)
        },
        {
            id: 'activity',
            label: 'Notifications',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                stroke: "currentColor",
                className: "w-5 h-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 518,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 517,
                columnNumber: 11
            }, this)
        }
    ];
    const handleExport = async ()=>{
        // ... (Existing export logic could be moved to a util but for now keep here or just disable if not critical)
        // Leaving it here as it was in the original file
        const loadingToast_1 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Preparing data export...");
        try {
            // Fetch all data for export
            const apiUrl_5 = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:1000';
            const [usersRes, paymentsRes, uisRes] = await Promise.all([
                fetch(`${apiUrl_5}/api/admin/users`),
                fetch(`${apiUrl_5}/api/admin/payments`),
                fetch(`${apiUrl_5}/api/uis`)
            ]);
            const [usersData, paymentsData, uisData] = await Promise.all([
                usersRes.json(),
                paymentsRes.json(),
                uisRes.json()
            ]);
            // Create CSV Content
            const createCSV = (data_11, headers_5)=>{
                const headerRow = headers_5.join(',') + '\n';
                const rows = data_11.map((item)=>headers_5.map((header)=>{
                        const val = item[header] || '';
                        return `"${String(val).replace(/"/g, '""')}"`;
                    }).join(',')).join('\n');
                return headerRow + rows;
            };
            const usersCSV = createCSV(usersData.data, [
                'id',
                'name',
                'email',
                'role',
                'joinedDate',
                'purchases',
                'lifetimeValue'
            ]);
            const paymentsCSV = createCSV(paymentsData.data, [
                'id',
                'customerName',
                'email',
                'item',
                'amount',
                'status',
                'date'
            ]);
            const uisCSV = createCSV(uisData.data, [
                'id',
                'title',
                'price',
                'category',
                'author',
                'downloads',
                'likes',
                'rating'
            ]);
            // Simple Zip-like download (or just download 3 files, but let's do a single JSON for now or just one main CSV if simple. 
            // Better: Download Payments CSV as it's most critical, OR trigger 3 downloads.)
            // Let's trigger 3 downloads for full export "Pro" style
            const downloadFile = (content, filename)=>{
                const blob = new Blob([
                    content
                ], {
                    type: 'text/csv'
                });
                const url_0 = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url_0;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            downloadFile(usersCSV, 'lumina_users.csv');
            setTimeout(()=>downloadFile(paymentsCSV, 'lumina_payments.csv'), 500);
            setTimeout(()=>downloadFile(uisCSV, 'lumina_inventory.csv'), 1000);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Export successful!", {
                id: loadingToast_1
            });
        } catch (error_7) {
            console.error("Export failed", error_7);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Export failed", {
                id: loadingToast_1
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-black flex flex-col lg:flex-row",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex items-center justify-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 rounded-lg flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/svg/logo.svg",
                                        alt: "Monkframe Logo",
                                        className: "w-full h-full object-contain"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 579,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 578,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold tracking-tighter text-white relative z-10",
                                    children: "Monkframe"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 581,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 577,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 576,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 585,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsSidebarOpen(!isSidebarOpen),
                                className: "p-2 -mr-2 text-zinc-400 hover:text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-6 h-5 flex flex-col justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 588,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'opacity-0' : 'w-4 ml-auto'}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 589,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-3 ml-auto'}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 590,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 587,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 586,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 584,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 575,
                columnNumber: 13
            }, this),
            isSidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm",
                onClick: ()=>setIsSidebarOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 597,
                columnNumber: 31
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-20 flex items-center justify-between px-8 border-b border-white/5 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none -mr-16 -mt-16"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 603,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 relative z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-lg flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: "/svg/logo.svg",
                                            alt: "Monkframe Logo",
                                            className: "w-full h-full object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 606,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 605,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400",
                                        children: "Monkframe"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 608,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 604,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 602,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 flex-1 overflow-y-auto custom-scrollbar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 pl-4",
                                    children: "Main Menu"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 618,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-1",
                                    children: navItems.map((item_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setActiveTab(item_0.id);
                                                setIsSidebarOpen(false);
                                            },
                                            className: `w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item_0.id ? "bg-gradient-to-r from-white/10 to-transparent text-white shadow-[inset_1px_0_0_0_#6366f1]" : "bg-transparent text-zinc-500 hover:text-zinc-200 hover:bg-white/5"}`,
                                            children: [
                                                activeTab === item_0.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_12px_#6366f1]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 625,
                                                    columnNumber: 65
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `relative transition-colors duration-300 ${activeTab === item_0.id ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-300'}`,
                                                    children: item_0.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-sm font-medium tracking-wide transition-all ${activeTab === item_0.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`,
                                                    children: item_0.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 630,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, item_0.id, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 620,
                                            columnNumber: 53
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 619,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 617,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 616,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 border-t border-white/5 bg-black/20 backdrop-blur-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 pl-4",
                                children: "System"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 640,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "p-1 rounded-lg bg-zinc-900 group-hover:bg-indigo-500/20 text-zinc-500 group-hover:text-indigo-400 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    strokeWidth: 2,
                                                    stroke: "currentColor",
                                                    className: "w-4 h-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        d: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 645,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 643,
                                                columnNumber: 29
                                            }, this),
                                            "View Live Site"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 642,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsResetOpen(true),
                                        className: "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-sm font-medium group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "p-1 rounded-lg bg-zinc-900 group-hover:bg-rose-500/20 text-rose-500/70 group-hover:text-rose-400 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    strokeWidth: 2,
                                                    stroke: "currentColor",
                                                    className: "w-4 h-4 group-hover:rotate-12 transition-transform",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 654,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 653,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 652,
                                                columnNumber: 29
                                            }, this),
                                            "Reset System Data"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 651,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: logout,
                                        className: "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50 transition-all text-sm font-medium group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "p-1 rounded-lg bg-zinc-900 group-hover:bg-zinc-700 text-zinc-500 group-hover:text-zinc-300 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    strokeWidth: 2,
                                                    stroke: "currentColor",
                                                    className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        d: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 663,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 29
                                            }, this),
                                            "Sign Out"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 660,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 641,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 639,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 600,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 lg:ml-72 pt-20 lg:pt-8 px-6 lg:px-12 pb-12 overflow-x-hidden w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 animate-fade-in relative z-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-black text-white tracking-tight mb-2",
                                        children: "Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 676,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400",
                                        children: [
                                            "Welcome back, ",
                                            user?.full_name?.split(' ')[0] || 'Admin'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 677,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 675,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden lg:flex items-center gap-4 animate-fade-in-up [animation-delay:100ms]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4 text-indigo-500",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 1.5,
                                                    d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 683,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: new Date().toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 686,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 682,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 pl-4 border-l border-white/10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white/5 border border-white/10 rounded-full p-0.5 hover:bg-white/10 transition-all",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                align: "right"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 696,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 695,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 694,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 680,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 674,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            activeTab === 'overview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$OverviewSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    overviewData: overviewData,
                                    handleLike: handleLike,
                                    handleWishlist: handleWishlist,
                                    setOpenCommentsId: setOpenCommentsId
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 705,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 704,
                                columnNumber: 50
                            }, this),
                            activeTab === 'activity' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-white",
                                        children: "Notifications"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 708,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$NotificationTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 709,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 707,
                                columnNumber: 50
                            }, this),
                            activeTab === 'uis' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$InventorySection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                isLoading: isLoading,
                                uis: uis,
                                uisPage: uisPage,
                                uisTotalPages: uisTotalPages,
                                setUisPage: setUisPage,
                                handleDelete: handleDelete,
                                setCurrentUI: setCurrentUI,
                                setIsEditOpen: setIsEditOpen,
                                setIsAddOpen: setIsAddOpen
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 711,
                                columnNumber: 45
                            }, this),
                            activeTab === 'payments' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$PaymentsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                payments: payments,
                                paymentsPage: paymentsPage,
                                paymentsTotalPages: paymentsTotalPages,
                                setPaymentsPage: setPaymentsPage
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 712,
                                columnNumber: 50
                            }, this),
                            activeTab === 'users' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                users: users,
                                usersPage: usersPage,
                                usersTotalPages: usersTotalPages,
                                setUsersPage: setUsersPage
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 713,
                                columnNumber: 47
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 703,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 673,
                columnNumber: 13
            }, this),
            openCommentsId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CommentSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                uiId: openCommentsId,
                isOpen: !!openCommentsId,
                onClose: ()=>setOpenCommentsId(null)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 717,
                columnNumber: 32
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$DashboardModals$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isAddOpen: isAddOpen,
                isEditOpen: isEditOpen,
                setIsAddOpen: setIsAddOpen,
                setIsEditOpen: setIsEditOpen,
                currentUI: currentUI,
                setCurrentUI: setCurrentUI,
                handleSave: handleSave,
                files: files,
                setFiles: setFiles,
                previews: previews,
                setPreviews: setPreviews
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 719,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$ResetDataModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isResetOpen,
                onClose: ()=>setIsResetOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 721,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 573,
        columnNumber: 10
    }, this);
}
_s(Dashboard, "OHj3fbMjRM8JDlI5u3o0Z1jbwJs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_581bc7c1._.js.map