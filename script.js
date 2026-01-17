// ==================== JAPANESE POMODORO TIMER - GENZ EDITION ====================
// Created with 💖 for productivity weebs everywhere

// ==================== STATE MANAGEMENT ====================
const AppState = {
    // Timer state
    mode: 'focus', // 'focus', 'break', 'longBreak'
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    isRunning: false,
    isPaused: false,
    intervalId: null,
    lastTickTime: null, // For accurate timing

    // Settings
    settings: {
        focusDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        notifications: true
    },

    // Stats
    stats: {
        sessionsToday: 0,
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        lastSessionDate: null,
        badges: []
    }
};

// Cross-tab synchronization
const syncChannel = new BroadcastChannel('pomodoro-sync');

// ==================== DOM ELEMENTS ====================
const DOM = {
    // Theme
    themeToggle: document.getElementById('themeToggle'),

    // Timer elements
    timerDisplay: document.getElementById('timerDisplay'),
    timerLabel: document.getElementById('timerLabel'),
    timerRingProgress: document.getElementById('timerRingProgress'),
    modeBadge: document.getElementById('modeBadge'),

    // Controls
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),

    // Character
    chibiCharacter: document.getElementById('chibiCharacter'),
    chibiMessage: document.getElementById('chibiMessage'),

    // Stats
    sessionCount: document.getElementById('sessionCount'),
    totalMinutes: document.getElementById('totalMinutes'),
    badgeCount: document.getElementById('badgeCount'),
    streakCount: document.getElementById('streakCount'),

    // Settings
    focusSlider: document.getElementById('focusSlider'),
    breakSlider: document.getElementById('breakSlider'),
    longBreakSlider: document.getElementById('longBreakSlider'),
    focusValue: document.getElementById('focusValue'),
    breakValue: document.getElementById('breakValue'),
    longBreakValue: document.getElementById('longBreakValue'),
    notificationsToggle: document.getElementById('notificationsToggle'),

    // Badges
    badgesGrid: document.getElementById('badgesGrid'),

    // Share
    shareBtn: document.getElementById('shareBtn'),

    // Tips
    tipText: document.getElementById('tipText'),

    // Modal
    notificationModal: document.getElementById('notificationModal'),
    enableNotifications: document.getElementById('enableNotifications'),
    skipNotifications: document.getElementById('skipNotifications')
};

// ==================== MEME MESSAGES ====================
const MESSAGES = {
    focus: [
        "Let's gooo! Time to be productive! 🔥",
        "No cap, you got this! 💪",
        "Grinding like it's finals week! 📚",
    ],
    break: [
        "Touch grass time! 🌱",
        "Hydration check! Stay watered! 💧",
        "Snack break = best break! 🍱",
    ],
    sessionComplete: [
        "Slay! That was fire! 🔥",
        "Sheeeesh! You crushed it! 🎉",
        "Absolutely unhinged productivity! 💯",
        "That's how we do it! Let's goooo! 🚀",
    ],
    tips: [
        "Don't ghost your tasks like a bad date! 👻",
        "Hydrate or diedrate! Drink water bestie! 💧",
        "Touch grass after this session! 🌱",
        "Procrastination? We don't know her! 💅",
        "Grinding > Doom scrolling (facts!) 📱",
        "You're doing amazing sweetie! 💖",
        "Plot twist: you're actually productive! 🎬",
    ]
};

// ==================== BADGES CONFIGURATION ====================
const BADGES = [
    {
        id: 'ninja',
        emoji: '🥷',
        name: 'Ninja Focus',
        description: 'Complete 1 session',
        requirement: { type: 'sessions', count: 1 }
    },
    {
        id: 'sakura',
        emoji: '🌸',
        name: 'Sakura Starter',
        description: '3-day streak',
        requirement: { type: 'streak', count: 3 }
    },
    {
        id: 'fuji',
        emoji: '🗻',
        name: 'Mt. Fuji Climber',
        description: '7-day streak',
        requirement: { type: 'streak', count: 7 }
    },
    {
        id: 'otaku',
        emoji: '👾',
        name: 'Otaku Overachiever',
        description: 'Complete 10 sessions',
        requirement: { type: 'sessions', count: 10 }
    },
    {
        id: 'shogun',
        emoji: '🎌',
        name: 'Shogun of Focus',
        description: '30-day streak',
        requirement: { type: 'streak', count: 30 }
    },
    {
        id: 'protagonist',
        emoji: '⚡',
        name: 'Anime Protagonist',
        description: '100 total sessions',
        requirement: { type: 'totalSessions', count: 100 }
    }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('🌸 Japanese Pomo starting up...');

    // Load saved data
    loadFromLocalStorage();

    // Initialize UI
    // initializeSakuraPetals(); // Disabled - no falling flowers
    initializeTheme();
    updateAllUI();
    showRandomTip();

    // Check notification permission
    checkNotificationPermission();

    // Setup event listeners
    setupEventListeners();

    // Update streak
    updateStreak();

    // Setup cross-tab sync
    setupCrossTabSync();

    console.log('✨ App ready! Let\'s get productive!');
}

// ==================== CROSS-TAB SYNCHRONIZATION ====================
function setupCrossTabSync() {
    // Listen for messages from other tabs
    syncChannel.addEventListener('message', (event) => {
        const { type, data } = event.data;

        if (type === 'TIMER_UPDATE') {
            // Update timer from other tab
            AppState.mode = data.mode;
            AppState.timeLeft = data.timeLeft;
            AppState.totalTime = data.totalTime;
            AppState.isRunning = data.isRunning;
            AppState.isPaused = data.isPaused;

            // Update UI
            updateTimerDisplay();
            updateProgressRing();
            updateDocumentTitle();

            // Update button states
            DOM.startBtn.disabled = data.isRunning;
            DOM.pauseBtn.disabled = !data.isRunning;

            if (data.isRunning) {
                document.body.classList.add('timer-active');
                // Make sure we're ticking too
                if (!AppState.intervalId) {
                    AppState.intervalId = setInterval(() => {
                        tick();
                    }, 1000);
                }
            } else {
                document.body.classList.remove('timer-active');
                if (AppState.intervalId && !data.isRunning) {
                    clearInterval(AppState.intervalId);
                    AppState.intervalId = null;
                }
            }
        } else if (type === 'STATE_UPDATE') {
            // Full state sync
            AppState.stats = data.stats;
            updateStatsDisplay();
            renderBadges();
        } else if (type === 'STATE_REQUEST') {
            // Another tab is requesting current state
            if (AppState.isRunning) {
                broadcastTimerState();
            }
        }
    });

    // Request current state from other tabs on load
    setTimeout(() => {
        syncChannel.postMessage({ type: 'STATE_REQUEST' });
    }, 100);
}

function broadcastTimerState() {
    syncChannel.postMessage({
        type: 'TIMER_UPDATE',
        data: {
            mode: AppState.mode,
            timeLeft: AppState.timeLeft,
            totalTime: AppState.totalTime,
            isRunning: AppState.isRunning,
            isPaused: AppState.isPaused
        }
    });
}

function broadcastStateUpdate() {
    syncChannel.postMessage({
        type: 'STATE_UPDATE',
        data: {
            stats: AppState.stats
        }
    });
}

// ==================== SAKURA PETALS ANIMATION ====================
function initializeSakuraPetals() {
    const container = document.getElementById('sakuraContainer');
    const petalEmojis = ['🌸', '🌸', '🌸', '🌺', '💮', '🏵️'];
    const petalCount = 25;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 15 + 15) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(petal);
    }
}

// ==================== THEME MANAGEMENT ====================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = DOM.themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ==================== TIMER FUNCTIONS ====================
function startTimer() {
    if (AppState.isRunning) return;

    AppState.isRunning = true;
    AppState.isPaused = false;

    // Update UI
    DOM.startBtn.disabled = true;
    DOM.pauseBtn.disabled = false;
    document.body.classList.add('timer-active');

    // Start interval
    AppState.intervalId = setInterval(tick, 1000);

    // Broadcast to other tabs
    broadcastTimerState();
}

function pauseTimer() {
    if (!AppState.isRunning) return;

    AppState.isRunning = false;
    AppState.isPaused = true;

    // Update UI
    DOM.startBtn.disabled = false;
    DOM.pauseBtn.disabled = true;
    document.body.classList.remove('timer-active');

    // Clear interval
    clearInterval(AppState.intervalId);

    // Broadcast to other tabs
    broadcastTimerState();
}

function resetTimer() {
    // Stop timer
    pauseTimer();

    // Reset time based on current mode
    const duration = AppState.mode === 'focus'
        ? AppState.settings.focusDuration
        : AppState.mode === 'break'
            ? AppState.settings.breakDuration
            : AppState.settings.longBreakDuration;

    AppState.timeLeft = duration * 60;
    AppState.totalTime = duration * 60;

    // Update UI
    updateTimerDisplay();
    updateProgressRing();

    // Broadcast to other tabs
    broadcastTimerState();
}

function tick() {
    AppState.timeLeft--;

    // Update display
    updateTimerDisplay();
    updateProgressRing();
    updateDocumentTitle(); // Update tab title every second

    // Check if timer completed
    if (AppState.timeLeft <= 0) {
        completeTimer();
    }

    // Broadcast timer state every tick
    broadcastTimerState();
}

function completeTimer() {
    console.log('⏰ TIMER COMPLETE!');

    // Stop timer
    pauseTimer();

    // Play beep sound - with explicit call
    console.log('🔊 About to play beep...');
    playBeep();
    console.log('🔊 Beep function called');

    if (AppState.mode === 'focus') {
        // Focus session completed!
        handleFocusComplete();
    } else {
        // Break completed
        handleBreakComplete();
    }
}

function handleFocusComplete() {
    // Update stats
    AppState.stats.sessionsToday++;
    AppState.stats.totalSessions++;
    AppState.stats.totalMinutes += AppState.settings.focusDuration;

    // Save to localStorage
    saveToLocalStorage();

    // Update UI
    updateStatsDisplay();

    // Check badges
    checkAndUnlockBadges();

    // Broadcast state update
    broadcastStateUpdate();

    // Show notification
    const message = getRandomMessage('sessionComplete');
    showNotification('Focus Session Complete! 🎉', message);

    // Determine next mode
    if (AppState.stats.sessionsToday % 4 === 0) {
        switchMode('longBreak');
        showNotification('Time for a Long Break! 🍵', 'You earned it! Take a proper break.');
    } else {
        switchMode('break');
        showNotification('Break Time! ☕', 'Stretch, hydrate, touch grass!');
    }
}

function handleBreakComplete() {
    // Show notification
    showNotification('Break Over! ⚡', 'Time to lock in again!');

    // Switch back to focus
    switchMode('focus');
}

function switchMode(newMode) {
    AppState.mode = newMode;

    // Update time based on mode
    let duration;
    let icon, text;

    if (newMode === 'focus') {
        duration = AppState.settings.focusDuration;
        icon = '⚡';
        text = 'Focus Mode';
        document.body.classList.remove('timer-break');
    } else if (newMode === 'break') {
        duration = AppState.settings.breakDuration;
        icon = '☕';
        text = 'Short Break';
        document.body.classList.add('timer-break');
    } else {
        duration = AppState.settings.longBreakDuration;
        icon = '🍵';
        text = 'Long Break';
        document.body.classList.add('timer-break');
    }

    AppState.timeLeft = duration * 60;
    AppState.totalTime = duration * 60;

    // Update UI
    DOM.modeBadge.innerHTML = `<span class="mode-icon">${icon}</span><span class="mode-text">${text}</span>`;
    updateTimerDisplay();
    updateProgressRing();
}

// ==================== UI UPDATE FUNCTIONS ====================
function updateAllUI() {
    updateTimerDisplay();
    updateProgressRing();
    updateStatsDisplay();
    updateSettingsDisplay();
    renderBadges();
}

function updateTimerDisplay() {
    const minutes = Math.floor(AppState.timeLeft / 60);
    const seconds = AppState.timeLeft % 60;
    DOM.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    DOM.timerLabel.textContent = `${minutes === 0 ? 'seconds' : 'minutes'} left`;
}

function updateProgressRing() {
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const progress = AppState.timeLeft / AppState.totalTime;
    const offset = circumference * (1 - progress);

    DOM.timerRingProgress.style.strokeDasharray = `${circumference} ${circumference}`;
    DOM.timerRingProgress.style.strokeDashoffset = offset;
}

function updateStatsDisplay() {
    DOM.sessionCount.textContent = AppState.stats.sessionsToday;
    DOM.totalMinutes.textContent = AppState.stats.totalMinutes;
    DOM.badgeCount.textContent = AppState.stats.badges.length;
    DOM.streakCount.textContent = AppState.stats.currentStreak;
}

function updateSettingsDisplay() {
    DOM.focusValue.textContent = AppState.settings.focusDuration;
    DOM.breakValue.textContent = AppState.settings.breakDuration;
    DOM.longBreakValue.textContent = AppState.settings.longBreakDuration;

    DOM.focusSlider.value = AppState.settings.focusDuration;
    DOM.breakSlider.value = AppState.settings.breakDuration;
    DOM.longBreakSlider.value = AppState.settings.longBreakDuration;

    DOM.notificationsToggle.checked = AppState.settings.notifications;
}

function updateDocumentTitle() {
    const minutes = Math.floor(AppState.timeLeft / 60);
    const seconds = AppState.timeLeft % 60;
    const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const modeIcon = AppState.mode === 'focus' ? '🍅' : '☕';
    document.title = `${modeIcon} ${time} | Japanese Pomo`;
}

// ==================== BADGES SYSTEM ====================
function renderBadges() {
    DOM.badgesGrid.innerHTML = '';

    BADGES.forEach(badge => {
        const isUnlocked = AppState.stats.badges.includes(badge.id);
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        badgeEl.innerHTML = `
            <span class="badge-emoji">${badge.emoji}</span>
            <span class="badge-name">${badge.name}</span>
            <span class="badge-desc">${badge.description}</span>
        `;

        if (isUnlocked) {
            badgeEl.title = `Unlocked! ${badge.name}`;
        }

        DOM.badgesGrid.appendChild(badgeEl);
    });
}

function checkAndUnlockBadges() {
    let newBadges = false;

    BADGES.forEach(badge => {
        if (AppState.stats.badges.includes(badge.id)) return;

        let unlock = false;

        if (badge.requirement.type === 'sessions') {
            unlock = AppState.stats.totalSessions >= badge.requirement.count;
        } else if (badge.requirement.type === 'streak') {
            unlock = AppState.stats.currentStreak >= badge.requirement.count;
        } else if (badge.requirement.type === 'totalSessions') {
            unlock = AppState.stats.totalSessions >= badge.requirement.count;
        }

        if (unlock) {
            AppState.stats.badges.push(badge.id);
            newBadges = true;
            showNotification(`Badge Unlocked! ${badge.emoji}`, `You earned: ${badge.name}!`);
        }
    });

    if (newBadges) {
        renderBadges();
        updateStatsDisplay();
        saveToLocalStorage();
    }
}

// ==================== STREAK SYSTEM ====================
function updateStreak() {
    const today = new Date().toDateString();
    const lastSession = AppState.stats.lastSessionDate;

    if (!lastSession) {
        // First session ever
        AppState.stats.currentStreak = 1;
        AppState.stats.lastSessionDate = today;
    } else if (lastSession === today) {
        // Already worked today
        return;
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastSession === yesterdayStr) {
            // Streak continues!
            AppState.stats.currentStreak++;
        } else {
            // Streak broken 😢
            AppState.stats.currentStreak = 1;
        }

        AppState.stats.lastSessionDate = today;
    }

    saveToLocalStorage();
    updateStatsDisplay();
}

// ==================== NOTIFICATIONS ====================
function checkNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Browser doesn\'t support notifications');
        return;
    }

    if (Notification.permission === 'default') {
        // Show modal
        DOM.notificationModal.classList.add('active');
    }
}

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            showNotification('Notifications Enabled! 🔔', 'You\'ll get notified when sessions end!');
        }
    } catch (error) {
        console.error('Notification permission error:', error);
    }
}

function showNotification(title, body) {
    if (!AppState.settings.notifications) return;

    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🌸</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FF6B9D"/></svg>',
            tag: 'japanese-pomo',
            requireInteraction: false,
            vibrate: [200, 100, 200],
            silent: false
        });

        setTimeout(() => notification.close(), 5000);

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
}



// ==================== BEEP SOUND ====================
function playBeep() {
    console.log('🔊 PLAYING BEEP SOUND!');
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create 5 LOUD beeps
        const beepTimes = [0, 0.4, 0.8, 1.2, 1.6];

        beepTimes.forEach((startTime) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // VERY LOUD harsh beep - impossible to miss!
            oscillator.type = 'square'; // Harsh buzzer sound
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + startTime);

            // MAX VOLUME
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
            gainNode.gain.linearRampToValueAtTime(0.9, audioContext.currentTime + startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + 0.35);

            oscillator.start(audioContext.currentTime + startTime);
            oscillator.stop(audioContext.currentTime + startTime + 0.35);
        });

        console.log('✅ Beep played successfully!');
    } catch (error) {
        console.error('❌ Beep error:', error);
        // Fallback alert
        alert('⏰ TIMER COMPLETE!');
    }
}

// ==================== TWITTER/X SHARE ====================
function shareOnTwitter() {
    const messages = [
        `Just crushed ${AppState.stats.sessionsToday} Pomodoro sessions today! 🌸 On a ${AppState.stats.currentStreak}-day streak! #JapanesePomo #FocusMode`,
        `${AppState.stats.totalMinutes} minutes of pure focus today! 🔥 Built different fr fr #JapanesePomo #ProductivityVibes`,
        `${AppState.stats.currentStreak} day streak and counting! 💪 Grinding with my kawaii Pomodoro timer #JapanesePomo`,
        `Locked in with Japanese Pomo! ${AppState.stats.sessionsToday} sessions done! ⚡ No cap this app hits different #Productivity`
    ];

    const tweet = messages[Math.floor(Math.random() * messages.length)];

    // Use the custom domain
    const appUrl = 'https://pomodoro.nandanadileep.com';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(appUrl)}`;

    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

// ==================== TIPS SYSTEM ====================
function showRandomTip() {
    const randomTip = MESSAGES.tips[Math.floor(Math.random() * MESSAGES.tips.length)];
    DOM.tipText.textContent = randomTip;

    // Rotate tips every 30 seconds
    setInterval(() => {
        const newTip = MESSAGES.tips[Math.floor(Math.random() * MESSAGES.tips.length)];
        DOM.tipText.textContent = newTip;
    }, 30000);
}

// ==================== HELPER FUNCTIONS ====================
function getRandomMessage(category) {
    const messages = MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    const data = {
        settings: AppState.settings,
        stats: AppState.stats
    };
    localStorage.setItem('japanesePomo', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('japanesePomo');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            AppState.settings = { ...AppState.settings, ...data.settings };
            AppState.stats = { ...AppState.stats, ...data.stats };

            // Reset daily sessions if it's a new day
            const today = new Date().toDateString();
            if (AppState.stats.lastSessionDate !== today) {
                AppState.stats.sessionsToday = 0;
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Theme toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Timer controls
    DOM.startBtn.addEventListener('click', startTimer);
    DOM.pauseBtn.addEventListener('click', pauseTimer);
    DOM.resetBtn.addEventListener('click', resetTimer);

    // Settings sliders
    DOM.focusSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        AppState.settings.focusDuration = value;
        DOM.focusValue.textContent = value;
        if (AppState.mode === 'focus' && !AppState.isRunning) {
            resetTimer();
        }
        saveToLocalStorage();
    });

    DOM.breakSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        AppState.settings.breakDuration = value;
        DOM.breakValue.textContent = value;
        if (AppState.mode === 'break' && !AppState.isRunning) {
            resetTimer();
        }
        saveToLocalStorage();
    });

    DOM.longBreakSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        AppState.settings.longBreakDuration = value;
        DOM.longBreakValue.textContent = value;
        if (AppState.mode === 'longBreak' && !AppState.isRunning) {
            resetTimer();
        }
        saveToLocalStorage();
    });

    // Settings toggles
    DOM.notificationsToggle.addEventListener('change', (e) => {
        AppState.settings.notifications = e.target.checked;
        if (e.target.checked && Notification.permission === 'default') {
            requestNotificationPermission();
        }
        saveToLocalStorage();
    });

    // Share button
    DOM.shareBtn.addEventListener('click', shareOnTwitter);

    // Modal buttons
    DOM.enableNotifications.addEventListener('click', () => {
        requestNotificationPermission();
        DOM.notificationModal.classList.remove('active');
    });

    DOM.skipNotifications.addEventListener('click', () => {
        DOM.notificationModal.classList.remove('active');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;

        if (e.code === 'Space') {
            e.preventDefault();
            if (AppState.isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        } else if (e.code === 'KeyR') {
            e.preventDefault();
            resetTimer();
        }
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && AppState.isRunning) {
            AppState.hiddenTime = Date.now();
        } else if (!document.hidden && AppState.hiddenTime) {
            const elapsed = Math.floor((Date.now() - AppState.hiddenTime) / 1000);
            AppState.timeLeft = Math.max(0, AppState.timeLeft - elapsed);

            if (AppState.timeLeft <= 0) {
                completeTimer();
            }

            updateTimerDisplay();
            updateProgressRing();
            delete AppState.hiddenTime;
        }
    });
}

// ==================== CONSOLE EASTER EGGS ====================
console.log('%cJapanese Pomo', 'font-size: 20px; color: #FF6B9D; font-weight: 900;');
console.log('%cBuilt with 💖 for productivity weebs', 'font-size: 14px; color: #C06C84;');
console.log('%cKeyboard shortcuts: Space to start/pause, R to reset', 'font-size: 12px; color: #6D5D6E;');
console.log('%cNo cap, you\'re gonna be so productive! 🔥', 'font-size: 12px; font-style: italic;');
