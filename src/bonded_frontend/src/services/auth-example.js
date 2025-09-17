// Example usage of NFID authentication with same-page flow for PWA
import { authWithNFID, handleAuthRedirect } from './nfid.js';

// Example 1: Using popup authentication (default behavior)
export const loginWithPopup = async () => {
    try {
        const result = await authWithNFID(false); // useSamePage = false
        if (result) {
            console.log('Authentication successful with popup');
            return result;
        }
    } catch (error) {
        console.error('Popup authentication failed:', error);
        throw error;
    }
};

// Example 2: Using same-page authentication (target="_self" equivalent)
export const loginWithSamePage = async () => {
    try {
        const result = await authWithNFID(true); // useSamePage = true
        // This will redirect the user to NFID, so we return null
        // The actual authentication result will be handled after redirect
        return null;
    } catch (error) {
        console.error('Same-page authentication failed:', error);
        throw error;
    }
};

// Example 3: Handle authentication after redirect (call this on page load)
export const checkAuthAfterRedirect = async () => {
    try {
        const result = await handleAuthRedirect();
        if (result) {
            console.log('User authenticated after redirect');
            return result;
        } else {
            console.log('User not authenticated');
            return null;
        }
    } catch (error) {
        console.error('Auth check after redirect failed:', error);
        throw error;
    }
};

// Example 4: Complete PWA authentication flow
export const completePWAAuthFlow = async () => {
    // Check if we're returning from authentication
    const urlParams = new URLSearchParams(window.location.search);
    const isAuthReturn = urlParams.has('auth') || window.location.hash.includes('auth');
    
    if (isAuthReturn) {
        // Handle post-authentication
        return await checkAuthAfterRedirect();
    } else {
        // Start authentication process
        return await loginWithSamePage();
    }
};

// Example 5: React component usage
export const usePWAAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authResult, setAuthResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const authenticate = async (useSamePage = false) => {
        setIsLoading(true);
        try {
            if (useSamePage) {
                // For same-page auth, we redirect
                await loginWithSamePage();
            } else {
                // For popup auth, we get immediate result
                const result = await loginWithPopup();
                if (result) {
                    setAuthResult(result);
                    setIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error('Authentication error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const result = await checkAuthAfterRedirect();
            if (result) {
                setAuthResult(result);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isAuthenticated,
        authResult,
        isLoading,
        authenticate,
        checkAuth
    };
};
