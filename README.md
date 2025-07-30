# CFAnalytix 📊

**Advanced Codeforces Analytics Platform**

CFAnalytix is a comprehensive web application that provides in-depth analytics and insights for Codeforces competitive programmers. Track your progress, analyze your performance, and compare with other users through an intuitive and modern interface.

## ✨ Features

### 📈 Advanced Analytics
- **Real-time Statistics**: Problems solved, max rating, contest participation, and average attempts
- **ML-Powered Predictions**: AI-based rating predictions for upcoming contests
- **Performance Trends**: Comprehensive analysis of your coding journey
- **Streak Tracking**: Monitor your daily problem-solving consistency

### 🎯 Problem Analysis
- **Difficulty Distribution**: Visual breakdown of problems by rating ranges
- **Language Statistics**: Detailed analysis of programming languages used
- **Peak Difficulty Tracking**: Monitor your highest solved problem ratings over time
- **Submission History**: Complete timeline of your coding submissions

### 🔄 User Comparison
- **Side-by-Side Analysis**: Compare your stats with other Codeforces users
- **Performance Indicators**: Visual trending arrows showing relative performance
- **Multi-User Support**: Add multiple users for comprehensive comparisons

### 🏆 Achievement System
- **Progress Badges**: Unlock achievements based on problem-solving milestones
- **Rank Tracking**: Monitor your current and maximum Codeforces ranks
- **Contest Achievements**: Special badges for contest participation milestones

### 📄 Export & Reporting
- **PDF Reports**: Generate comprehensive performance reports
- **Data Export**: Download your complete analytics data
- **Professional Format**: Clean, printable reports for portfolios or interviews

### 🎨 User Experience
- **Dark/Light Themes**: Toggle between modern dark and light modes
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Interactive Charts**: Dynamic visualizations powered by Recharts
- **Real-time Updates**: Live data fetching with React Query caching
- **Virtual Scrolling**: Smooth performance even with thousands of submissions

## 🚀 Live Demo

**[Try CFAnalytix Now →](https://cfanalytix.vercel.app)**

Simply enter any Codeforces handle to explore the analytics dashboard!

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **Recharts** for interactive data visualizations
- **shadcn/ui** for consistent UI components

### Data & Performance
- **React Query** for efficient data fetching and caching
- **Virtual Scrolling** for handling large datasets
- **Codeforces API** integration for real-time data

### Additional Features
- **PDF Generation** for report exports
- **Theme System** with next-themes
- **Responsive Design** with mobile-first approach

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saurabhjha004/cfanalytix.git
   cd cfanalytix
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
cfanalytix/
├── src/
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Achievements.tsx    # Achievement system
│   │   ├── AdvancedAnalytics.tsx
│   │   ├── AnimatedStats.tsx   # Animated statistics
│   │   ├── AuthModal.tsx       # Authentication modal
│   │   ├── Dashboard.tsx       # Main analytics dashboard
│   │   ├── DashboardCustomizer.tsx
│   │   ├── ExportData.tsx      # Data export functionality
│   │   ├── ThemeToggle.tsx     # Dark/light theme toggle
│   │   ├── UnifiedChart.tsx    # Chart components
│   │   ├── UserComparison.tsx  # User comparison features
│   │   ├── UserProfile.tsx     # User profile display
│   │   └── VirtualSubmissionList.tsx
│   ├── data/                   # Static data and constants
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── pages/                  # Page components
│   ├── services/               # API integration services
│   ├── App.tsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.tsx                # Application entry point
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── package-lock.json           # Lock file
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # App-specific TS config
├── tsconfig.node.json         # Node-specific TS config
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
├── vite.config.ts             # Vite configuration
├── vite-env.d.ts              # Vite environment types
├── index.html                 # HTML template
└── README.md                  # Project documentation
```

## 🎯 Key Features Showcase

### Dashboard Overview
- **Problems Solved**: Accurate count of unique problems (fixes duplicate counting)
- **Rating Analytics**: Current rating, max rating, and prediction algorithms
- **Contest Statistics**: Participation history and performance metrics
- **Efficiency Metrics**: Average attempts per problem solved

### Advanced Insights
- **Current Streak**: Daily problem-solving streak tracking
- **Predicted Rating**: ML-based predictions for future contest performance
- **Peak Difficulty**: Highest problem rating solved with progression timeline
- **Language Distribution**: Comprehensive breakdown of programming languages used

### Visual Analytics
- **Interactive Charts**: Rating progression over time
- **Problem Distribution**: Pie charts and bar graphs for difficulty analysis
- **Submission Timeline**: Chronological view of coding activity
- **Achievement Progress**: Visual progress bars for milestones

### Customization
- **Theme Colors**: Modify `src/index.css` for custom color schemes
- **Analytics**: Extend `src/lib/utils.ts` for additional metrics
- **UI Components**: Customize `src/components/ui/` for design changes

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Other Platforms
- **Netlify**: `npm run build` → Deploy `dist` folder
- **GitHub Pages**: Use `gh-pages` for static deployment
- **Docker**: Containerize with the included Dockerfile

## 📊 Analytics Accuracy

> **Note**: Problem counts are calculated from Codeforces API submissions and may differ slightly from profile page numbers due to API limitations. Our algorithm ensures accurate unique problem counting by eliminating duplicate submissions.

## 🐛 Known Issues

- Minor discrepancies between API data and profile page statistics
- Rate limiting may occur with frequent API requests
- Some contest data may have slight delays

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Codeforces](https://codeforces.com) for providing the comprehensive API
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Recharts](https://recharts.org) for powerful data visualization
- The competitive programming community for inspiration and feedback

## 👨‍💻 Author

**Saurabh Jha**

- GitHub: [saurabhjha004](https://github.com/saurabhjha004)
- LinkedIn: [saurabhjha04](https://linkedin.com/in/saurabhjha04)
- Codeforces: [saurabhjha04](https://codeforces.com/profile/saurabhjha04)

---

<div align="center">
  <p>Made with ❤️ for the competitive programming community</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
