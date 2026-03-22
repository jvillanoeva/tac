/**
 * Colectivo Auth — Supabase Auth client wrapper.
 * Include BEFORE other page scripts.
 *
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY to be set
 * in a <script> block or via config.js.
 */

const Auth = (() => {
  let supabase = null;

  function init(url, anonKey) {
    supabase = window.supabase.createClient(url, anonKey);
    return supabase;
  }

  function getClient() {
    if (!supabase) throw new Error('Auth not initialized. Call Auth.init() first.');
    return supabase;
  }

  async function getSession() {
    const { data: { session } } = await getClient().auth.getSession();
    return session;
  }

  async function getToken() {
    const session = await getSession();
    return session?.access_token || null;
  }

  async function getUser() {
    const session = await getSession();
    return session?.user || null;
  }

  async function signIn(email, password) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signUp(email, password) {
    const { data, error } = await getClient().auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await getClient().auth.signOut();
    window.location.href = '/login.html';
  }

  async function resetPassword(email) {
    const { error } = await getClient().auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html',
    });
    if (error) throw error;
  }

  /**
   * Protect a page — redirect to login if not authenticated.
   * Returns the session if authenticated.
   */
  async function requireSession() {
    const session = await getSession();
    if (!session) {
      window.location.href = '/login.html';
      throw new Error('Not authenticated');
    }
    return session;
  }

  /**
   * If user is already logged in, redirect away from login page.
   */
  async function redirectIfLoggedIn(to = '/dashboard.html') {
    const session = await getSession();
    if (session) window.location.href = to;
  }

  return {
    init,
    getClient,
    getSession,
    getToken,
    getUser,
    signIn,
    signUp,
    signOut,
    resetPassword,
    requireSession,
    redirectIfLoggedIn,
  };
})();
