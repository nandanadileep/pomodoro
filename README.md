# 🌸 Japanese Pomo - GenZ Edition

A vibrant, kawaii-themed Pomodoro timer tailored for GenZ productivity enthusiasts. Built with vanilla HTML, CSS, and JavaScript for maximum performance and shareability on X (Twitter).

![Japanese Pomo Banner](https://img.shields.io/badge/Made%20with-💖-FF6B9D?style=for-the-badge)
![GenZ Approved](https://img.shields.io/badge/GenZ-Approved-4ECDC4?style=for-the-badge)
![No Cap](https://img.shields.io/badge/No%20Cap-Just%20Facts-FFE66D?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality
- **Standard Pomodoro Cycles**: 25-minute focus sessions, 5-minute breaks
- **Long Breaks**: 15-30 minute breaks after every 4 focus sessions
- **Customizable Timers**: Adjust session lengths with smooth sliders (15-60 min focus, 3-15 min breaks)
- **Pause & Reset**: Full control over your sessions
- **Persistent Settings**: All preferences saved in localStorage (no sign-up needed!)

### 🌸 Japanese Aesthetic
- **Kawaii Chibi Character**: Animated character that reacts to timer states
  - Happy and energized during focus mode
  - Relaxed during breaks
  - Sparkles and float animations
- **Cherry Blossom Petals**: Beautiful falling sakura animations in the background
- **Pastel Color Palette**: Baby pink (#FFB3BA), soft gradients, and vibrant accents
- **Japanese Typography**: Noto Sans JP font for authentic vibes
- **Anime-Inspired UI**: Modern, playful, and utterly adorable

### 🔔 Smart Notifications
- **Browser Push Notifications**: Get notified even when the tab is inactive
- **Fun GenZ Messages**: "Timer's up! Time to stretch like a samurai! 🥷"
- **Permission Modal**: User-friendly notification permission request
- **Sound Effects**: Pleasant chimes using Web Audio API (toggle on/off)

### 🐦 X (Twitter) Integration
- **One-Click Sharing**: Tweet your progress instantly
- **Dynamic Messages**: Randomly generated viral-ready tweets
  - "Just crushed 5 Pomodoro sessions today! 🌸 On a 7-day streak!"
  - "Built different fr fr #JapanesePomo #ProductivityVibes"
- **Hashtags**: Auto-includes #JapanesePomo #GenZProductivity #FocusMode

### 🏆 Gamification
- **Daily Streak System**: Track consecutive days of productivity
- **6 Unlockable Badges**:
  - 🥷 Ninja Focus (Complete 1 session)
  - 🌸 Sakura Starter (3-day streak)
  - 🗻 Mt. Fuji Climber (7-day streak)
  - 👾 Otaku Overachiever (Complete 10 sessions)
  - 🎌 Shogun of Focus (30-day streak)
  - ⚡ Anime Protagonist (100 total sessions)
- **Session Stats**: Track daily sessions, total minutes, and badges earned

### 💡 GenZ Appeal
- **Meme-Inspired Tips**: Rotating motivational messages
  - "Don't ghost your tasks like a bad date! 👻"
  - "Procrastination? We don't know her! 💅"
- **Dark Mode**: Toggle between light and dark themes for late-night grinding
- **Keyboard Shortcuts**: 
  - `Space` - Start/Pause
  - `R` - Reset
- **Mobile Responsive**: Perfect on all devices
- **Fast Loading**: Vanilla JS, no frameworks, blazing fast

### ♿ Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast ratios
- Semantic HTML structure

## 🚀 Quick Start

### Option 1: Download and Run Locally
1. Download all files to a folder
2. Open `index.html` in your browser
3. Start crushing your tasks! 💪

### Option 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project folder
cd japanese-pomodoro

# Deploy
vercel
```

### Option 3: Deploy to GitHub Pages
1. Create a new GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repo-name`

## 📁 File Structure
```
japanese-pomodoro/
├── index.html          # Main HTML structure
├── style.css           # Kawaii styling & animations
├── script.js           # Timer logic & features
└── README.md           # You are here!
```

## 🎮 How to Use

1. **Set Your Preferences**
   - Adjust focus/break durations in Settings
   - Enable notifications and sound effects
   - Choose your theme (light/dark)

2. **Start a Session**
   - Click "Start" or press `Space`
   - Watch the cute chibi character cheer you on!
   - Stay focused until the timer completes

3. **Take Your Break**
   - Timer automatically switches to break mode
   - Get notified when break is over
   - Every 4 sessions = long break!

4. **Track Progress**
   - View daily sessions and total minutes
   - Build your streak 🔥
   - Unlock badges by hitting milestones

5. **Share Your Wins**
   - Click "Tweet Your Progress"
   - Flex on X with one click
   - Inspire your followers! ✨

## 🛠️ Technical Details

### Technologies
- **HTML5**: Semantic, accessible markup
- **CSS3**: Custom properties, animations, gradients, flexbox, grid
- **Vanilla JavaScript**: ES6+, no frameworks or dependencies
- **Web APIs Used**:
  - Notification API (push notifications)
  - Web Audio API (sound effects)
  - LocalStorage API (data persistence)
  - Visibility API (handle tab switching)

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- **Load Time**: < 1 second
- **No External Dependencies**: Zero npm packages
- **File Size**: ~50KB total (HTML + CSS + JS)
- **Optimized Animations**: 60fps smooth rendering

## 🎨 Customization

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --accent-primary: #FF6B9D;  /* Main pink */
    --accent-secondary: #C06C84; /* Darker pink */
    /* Customize all colors here! */
}
```

### Add More Badges
In `script.js`, add to the `BADGES` array:
```javascript
{
    id: 'your_badge',
    emoji: '🎯',
    name: 'Your Badge Name',
    description: 'Badge description',
    requirement: { type: 'sessions', count: 50 }
}
```

### Modify Messages
Update meme messages in the `MESSAGES` object in `script.js`

## 📝 License

MIT License - Feel free to use, modify, and share!

Made with 💖 by productivity weebs for productivity weebs.

## 🤝 Contributing

Found a bug? Have an idea? 
- Open an issue
- Submit a pull request
- Share your feedback!

## 🌟 Credits

- Font: [Google Fonts](https://fonts.google.com/) (Poppins, Noto Sans JP)
- Inspiration: Pomodoro Technique by Francesco Cirillo
- Vibes: The entire GenZ community on X

## 📱 Social

Share your productivity journey!
- Use hashtag **#JapanesePomo**
- Tag your streaks
- Inspire others to lock in! 🔥

---

**No cap, you're gonna be so productive! Let's gooooo! 🚀**

頑張って！(Ganbatte - Do your best!)
