/* Frontend-only Login / Sign Up feature for InkSpace. */
(function () {
  const USERS_KEY = 'inkspace_auth_users';
  const SESSION_KEY = 'inkspace_auth_session';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function currentUser() { return read(SESSION_KEY, null); }
  function isLoginPage() { return location.pathname.toLowerCase().endsWith('/login.html'); }
  function showMessage(form, message, success) {
    const el = form.querySelector('.auth-message');
    el.textContent = message;
    el.classList.toggle('success', Boolean(success));
  }
  function clearMessage(form) { showMessage(form, '', false); }
  function setFieldError(input, message) {
    const field = input.closest('.field');
    field.classList.add('error');
    field.querySelector('.error-msg').textContent = message;
  }
  function clearErrors(form) {
    form.querySelectorAll('.field').forEach(field => field.classList.remove('error'));
    clearMessage(form);
  }
  function updateTrigger() {
    const user = currentUser();
    document.querySelectorAll('.auth-link').forEach(trigger => {
      trigger.textContent = user ? `Logout (${user.name.split(' ')[0]})` : 'Login';
      trigger.setAttribute('aria-label', user ? `Logout ${user.name}` : 'Login or sign up');
      trigger.title = user ? `Logged in as ${user.name}. Click to log out.` : 'Login or sign up';
    });
  }
  function closeModal() {
    const modal = document.querySelector('.auth-modal-overlay');
    if (modal) modal.classList.remove('open');
  }
  function showForm(name) {
    const modal = document.querySelector('.auth-modal-overlay');
    modal.querySelector('#authLoginForm').hidden = name !== 'login';
    modal.querySelector('#authSignupForm').hidden = name !== 'signup';
    modal.querySelector('#authTitle').textContent = name === 'login' ? 'Welcome back' : 'Create your account';
    modal.querySelector('#authIntro').textContent = name === 'login' ? 'Log in to continue to InkSpace.' : 'Join InkSpace and start sharing ideas.';
    modal.querySelectorAll('form').forEach(clearErrors);
    modal.querySelector(name === 'login' ? '#authLoginEmail' : '#authSignupName').focus();
  }
  function openModal() {
    const modal = document.querySelector('.auth-modal-overlay');
    modal.classList.add('open');
    showForm('login');
  }
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal-overlay';
    modal.innerHTML = `
      <section class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <div class="auth-modal-head">
          <div><h2 id="authTitle">Welcome back</h2><p id="authIntro">Log in to continue to InkSpace.</p></div>
          <button type="button" class="auth-close" aria-label="Close login">&times;</button>
        </div>
        <form id="authLoginForm" class="auth-form" novalidate>
          <div class="field"><label for="authLoginEmail">Email / Username</label><input id="authLoginEmail" class="input" autocomplete="username" required><span class="error-msg"></span></div>
          <div class="field"><label for="authLoginPassword">Password</label><input id="authLoginPassword" class="input" type="password" autocomplete="current-password" required><span class="error-msg"></span></div>
          <div class="auth-message" role="alert" aria-live="polite"></div>
          <button type="button" class="auth-forgot">Forgot Password?</button>
          <button class="btn btn-primary btn-block" type="submit">Login</button>
          <p class="auth-switch">Don't have an account? <button type="button" data-auth-form="signup">Sign Up</button></p>
        </form>
        <form id="authSignupForm" class="auth-form" hidden novalidate>
          <div class="field"><label for="authSignupName">Full Name</label><input id="authSignupName" class="input" autocomplete="name" required><span class="error-msg"></span></div>
          <div class="field"><label for="authSignupEmail">Email</label><input id="authSignupEmail" class="input" type="email" autocomplete="email" required><span class="error-msg"></span></div>
          <div class="field"><label for="authSignupPassword">Password</label><input id="authSignupPassword" class="input" type="password" autocomplete="new-password" required><span class="error-msg"></span></div>
          <div class="field"><label for="authSignupConfirm">Confirm Password</label><input id="authSignupConfirm" class="input" type="password" autocomplete="new-password" required><span class="error-msg"></span></div>
          <div class="auth-message" role="alert" aria-live="polite"></div>
          <button class="btn btn-primary btn-block" type="submit">Sign Up</button>
          <p class="auth-switch">Already have an account? <button type="button" data-auth-form="login">Login</button></p>
        </form>
      </section>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    modal.querySelector('.auth-close').addEventListener('click', closeModal);
    modal.querySelectorAll('[data-auth-form]').forEach(button => button.addEventListener('click', () => showForm(button.dataset.authForm)));
    modal.querySelector('.auth-forgot').addEventListener('click', () => showMessage(modal.querySelector('#authLoginForm'), 'Password recovery is not available in this frontend demo.'));
    modal.querySelector('#authLoginForm').addEventListener('submit', login);
    modal.querySelector('#authSignupForm').addEventListener('submit', signup);
  }
  function login(event) {
    event.preventDefault();
    const form = event.currentTarget;
    clearErrors(form);
    const identifier = form.querySelector('#authLoginEmail');
    const password = form.querySelector('#authLoginPassword');
    let valid = true;
    if (!identifier.value.trim()) { setFieldError(identifier, 'Enter your email or username.'); valid = false; }
    else if (identifier.value.includes('@') && !emailPattern.test(identifier.value.trim())) { setFieldError(identifier, 'Enter a valid email address.'); valid = false; }
    if (!password.value) { setFieldError(password, 'Enter your password.'); valid = false; }
    if (!valid) return;
    const value = identifier.value.trim().toLowerCase();
    const user = read(USERS_KEY, []).find(item => item.email === value || item.username === value);
    if (!user || user.password !== password.value) { showMessage(form, 'Email/username or password is incorrect.'); return; }
    write(SESSION_KEY, { name: user.name, email: user.email, username: user.username });
    updateTrigger();
    closeModal();
    if (isLoginPage()) { window.location.replace('index.html'); return; }
    if (typeof showToast === 'function') showToast(`Logged in as ${user.name}`, 'success');
  }
  function signup(event) {
    event.preventDefault();
    const form = event.currentTarget;
    clearErrors(form);
    const name = form.querySelector('#authSignupName');
    const email = form.querySelector('#authSignupEmail');
    const password = form.querySelector('#authSignupPassword');
    const confirm = form.querySelector('#authSignupConfirm');
    let valid = true;
    if (!name.value.trim()) { setFieldError(name, 'Enter your full name.'); valid = false; }
    if (!email.value.trim()) { setFieldError(email, 'Enter your email address.'); valid = false; }
    else if (!emailPattern.test(email.value.trim())) { setFieldError(email, 'Enter a valid email address.'); valid = false; }
    if (!password.value) { setFieldError(password, 'Enter a password.'); valid = false; }
    if (!confirm.value) { setFieldError(confirm, 'Confirm your password.'); valid = false; }
    else if (password.value !== confirm.value) { setFieldError(confirm, 'Passwords do not match.'); valid = false; }
    if (!valid) return;
    const normalizedEmail = email.value.trim().toLowerCase();
    const users = read(USERS_KEY, []);
    if (users.some(user => user.email === normalizedEmail)) { setFieldError(email, 'An account with this email already exists.'); return; }
    const user = { name: name.value.trim(), email: normalizedEmail, username: normalizedEmail.split('@')[0], password: password.value };
    users.push(user);
    write(USERS_KEY, users);
    write(SESSION_KEY, { name: user.name, email: user.email, username: user.username });
    updateTrigger();
    closeModal();
    if (isLoginPage()) { window.location.replace('index.html'); return; }
    if (typeof showToast === 'function') showToast(`Welcome to InkSpace, ${user.name}!`, 'success');
  }
  function initAuth() {
    if (!isLoginPage() && !currentUser()) {
      window.location.replace('login.html');
      return;
    }
    if (isLoginPage()) {
      if (currentUser()) { window.location.replace('index.html'); return; }
      createModal();
      openModal();
      document.addEventListener('keydown', event => { if (event.key === 'Escape') openModal(); });
      return;
    }
    document.querySelectorAll('.auth-link').forEach(link => link.addEventListener('click', event => {
      if (!currentUser()) return;
      event.preventDefault();
      localStorage.removeItem(SESSION_KEY);
      updateTrigger();
      window.location.replace('login.html');
    }));
    updateTrigger();
  }
  document.addEventListener('DOMContentLoaded', initAuth);
}());

