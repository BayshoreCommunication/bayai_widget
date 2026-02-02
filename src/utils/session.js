import { v4 as uuidv4 } from 'uuid';

const VISITOR_KEY = 'bayai_visitor_id';
const SESSION_KEY = 'bayai_session_id';

/**
 * Get or create a persistent Visitor ID.
 * This ID is stored in localStorage and persists across sessions.
 */
export const getVisitorId = () => {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
        visitorId = uuidv4();
        localStorage.setItem(VISITOR_KEY, visitorId);
    }
    return visitorId;
};

/**
 * Get or create a Session ID.
 * By default, this uses sessionStorage so it persists while the tab is open.
 * If forceNew is true, it explicitly generates a new one (e.g., on reset).
 */
export const getSessionId = (forceNew = false) => {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId || forceNew) {
        sessionId = uuidv4();
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
};

/**
 * Explicitly reset the current session.
 * Used when the user clicks the "Refresh" / "Clear Chat" button.
 */
export const resetSessionId = () => {
    return getSessionId(true);
};
