// Elements
const welcomeScreen = document.getElementById('welcome-screen');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const profileScreen = document.getElementById('profileScreen');

const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');

const backToWelcomeFromSignIn = document.getElementById('backToWelcomeFromSignIn');
const backToWelcomeFromSignUp = document.getElementById('backToWelcomeFromSignUp');

const signInMessage = document.getElementById('signInMessage');
const signUpMessage = document.getElementById('signUpMessage');

const userFullName = document.getElementById('userFullName');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const logoutBtn = document.getElementById('logoutBtn');

function showScreen(screen) {
  [welcomeScreen, signInForm, signUpForm, profileScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// Navigation
signInBtn.addEventListener('click', () => {
  signInMessage.textContent = '';
  signInForm.reset();
  showScreen(signInForm);
});

signUpBtn.addEventListener('click', () => {
  signUpMessage.textContent = '';
  signUpForm.reset();
  showScreen(signUpForm);
});

backToWelcomeFromSignIn.addEventListener('click', e => {
  e.preventDefault();
  showScreen(welcomeScreen);
});

backToWelcomeFromSignUp.addEventListener('click', e => {
  e.preventDefault();
  showScreen(welcomeScreen);
});

// LocalStorage helpers
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Sign Up
signUpForm.addEventListener('submit', e => {
  e.preventDefault();
  signUpMessage.style.color = 'red';
  signUpMessage.textContent = '';

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('signUpEmail').value.trim().toLowerCase();
  const password = document.getElementById('signUpPassword').value;

  if (!firstName || !lastName || !email || !password) {
    signUpMessage.textContent = 'Please fill all fields.';
    return;
  }

  const users = getUsers();
  if (users[email]) {
    signUpMessage.textContent = 'Account already exists.';
    return;
  }

  users[email] = { firstName, lastName, email, password };
  saveUsers(users);

  signUpMessage.style.color = 'green';
  signUpMessage.textContent = 'Account created! You can now sign in.';
  signUpForm.reset();
});

// Sign In
signInForm.addEventListener('submit', e => {
  e.preventDefault();
  signInMessage.style.color = 'red';
  signInMessage.textContent = '';

  const email = document.getElementById('signInEmail').value.trim().toLowerCase();
  const password = document.getElementById('signInPassword').value;

  if (!email || !password) {
    signInMessage.textContent = 'Please fill all fields.';
    return;
  }

  const users = getUsers();

  if (!users[email]) {
    signInMessage.textContent = 'No account found.';
    return;
  }

  if (users[email].password !== password) {
    signInMessage.textContent = 'Incorrect password.';
    return;
  }

  userFullName.textContent = users[email].firstName + ' ' + users[email].lastName;
  userEmailDisplay.textContent = users[email].email;

  showScreen(profileScreen);
});

// Logout
logoutBtn.addEventListener('click', () => {
  showScreen(welcomeScreen);
});

// Google Sign-In (using your Google OAuth Client ID)
const GOOGLE_CLIENT_ID = '967513176540-fkfpbpm5mscb0mu1jbj95djiu0udna03.apps.googleusercontent.com';

document.getElementById('googleSignIn').addEventListener('click', () => {
  const redirect_uri = 'http://127.0.0.1:5501'; // This must match your Google Cloud Console redirect URI exactly
  const oauthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&response_type=token` +
    `&scope=openid%20email%20profile` +
    `&prompt=select_account`;

  window.open(oauthUrl, '_blank');
});
