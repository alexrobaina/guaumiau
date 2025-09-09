# Climbing Training App - Complete Feature & Screen Architecture

## 📱 Core Functionality List

### Authentication & Onboarding

- **User Registration/Login**
  - Email/password authentication
  - Social login (Google, Apple, Facebook)
  - Phone number verification (optional)
  - Password recovery flow

- **Onboarding Flow**
  - Climbing experience questionnaire
  - Current climbing grade (indoor/outdoor)
  - Goals setting (grade targets, competitions, general fitness)
  - Available equipment checklist
  - Training availability (days/week, hours/session)
  - Injury history & limitations
  - Preferred climbing style (boulder/sport/trad)

### Training Engine

- **AI Training Plan Generator**
  - Adaptive algorithm based on user profile
  - Progressive overload implementation
  - Auto-deload weeks (every 3-4 weeks)
  - Season/competition peaking options

- **Workout Management**
  - Pre-built workout library (100+ sessions)
  - Custom workout creator
  - Exercise video demonstrations
  - Rest timer with audio cues
  - Set/rep tracking
  - RPE (Rate of Perceived Exertion) logging
  - Session notes & conditions

- **Exercise Categories**
  - Fingerboard protocols (max hangs, repeaters, density)
  - Campus board routines
  - System board workouts
  - Strength training (pull-ups, core, antagonist)
  - Mobility & flexibility routines
  - Endurance circuits (4x4s, ARCing)
  - Power endurance protocols

### Progress Tracking

- **Performance Metrics**
  - Finger strength progression (MVC tracking)
  - Grade pyramid visualization
  - Volume analytics (weekly/monthly)
  - Training load monitoring
  - Recovery metrics
  - Personal records database

- **Climbing Log**
  - Indoor/outdoor sends
  - Project attempts & progress
  - Route difficulty & style
  - Session quality rating
  - Photo/video attachment
  - Location tagging

### Community Features

- **Social Interaction**
  - Follow/unfollow system
  - Activity feed with filters
  - Kudos/likes on activities
  - Comments on workouts & sends
  - Share workout summaries
  - Training partner finder

- **Routine Sharing**
  - Public routine library
  - Creator profiles & ratings
  - Fork & customize routines
  - Difficulty ratings
  - Equipment requirements tags

### Analytics

- **Training Analytics**
  - Weekly/monthly volume charts
  - Intensity distribution graphs
  - Progress curves by exercise
  - Consistency tracking
  - Injury risk indicators

- **Performance Analytics**
  - Grade progression timeline
  - Success rate by grade
  - Strengths/weaknesses radar chart
  - Comparison to similar climbers
  - Predictive grade forecasting

## 🖼️ Screen Architecture

### 1. Authentication Screens

```
├── SplashScreen
├── WelcomeScreen
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen
└── OnboardingFlow
    ├── ExperienceScreen
    ├── GoalsScreen
    ├── EquipmentScreen
    ├── AvailabilityScreen
    └── ProfileSetupScreen
```

### 2. Main Navigation (Tab Bar)

```
├── HomeTab
│   ├── DashboardScreen
│   ├── TodayWorkoutScreen
│   └── QuickStartScreen
├── TrainingTab
│   ├── MyPlansScreen
│   ├── WorkoutLibraryScreen
│   ├── CreateWorkoutScreen
│   └── ExerciseDetailScreen
├── LogbookTab
│   ├── ClimbingLogScreen
│   ├── AddClimbScreen
│   └── ProjectsScreen
├── CommunityTab
│   ├── FeedScreen
│   ├── DiscoverScreen
│   ├── RoutineMarketScreen
│   └── UserProfileScreen
└── ProfileTab
    ├── MyProfileScreen
    ├── AnalyticsScreen
    ├── SettingsScreen
    └── SubscriptionScreen
```

### 3. Detailed Screen Specifications

#### **DashboardScreen** (Home)

- Weekly training overview widget
- Today's workout card
- Recent achievements
- Training streak counter
- Quick actions (log climb, start workout)
- Motivational quote/tip of the day

#### **TodayWorkoutScreen**

- Workout overview (duration, exercises)
- Warm-up routine
- Main exercises with sets/reps
- Built-in timer component
- RPE selector after each exercise
- Complete/skip exercise buttons
- Session summary on completion

#### **WorkoutLibraryScreen**

- Filter by category/difficulty/duration
- Search functionality
- Workout preview cards
- Equipment requirement badges
- Difficulty indicators
- "Start Now" vs "Schedule" options

#### **CreateWorkoutScreen**

- Exercise picker with categories
- Drag-and-drop ordering
- Set/rep/duration configuration
- Rest period settings
- Save as template option
- Share publicly toggle

#### **ClimbingLogScreen**

- Calendar view with logged sessions
- List view with filters
- Quick log floating button
- Statistics summary header
- Export data option

#### **FeedScreen** (Community)

- Following/Global toggle
- Activity cards (workouts, sends, achievements)
- Like/comment interactions
- Share functionality
- Filter by activity type

#### **AnalyticsScreen**

- Tab navigation for different metrics
- Interactive charts (using Victory Native or React Native Charts)
- Time period selector
- Compare to previous period
- Export/share reports

## 💡 Community & Engagement Ideas

### Gamification Elements

- **Achievement System**
  - First V5/5.11a send
  - 30-day training streak
  - 100 logged climbs
  - Fingerboard warrior (50 hangboard sessions)
  - Community contributor (10 shared routines)

- **Seasonal Challenges**
  - "Winter Training Block" - 12 week program
  - "100 Boulder Challenge"
  - "Grade Pyramid Builder"
  - Monthly volume competitions
  - Virtual gym competitions

### Social Features

- **Climbing Partners**
  - Location-based partner matching
  - Skill level compatibility
  - Schedule coordination
  - Direct messaging
  - Group training sessions

- **Clubs & Teams**
  - Create/join local clubs
  - Team challenges
  - Shared training plans
  - Club leaderboards
  - Event organization

### Content & Education

- **Training Tips Feed**
  - Weekly technique videos
  - Pro climber guest posts
  - Injury prevention articles
  - Nutrition guides
  - Mental training content

- **Live Sessions**
  - Weekly Q&A with coaches
  - Group training sessions
  - Technique workshops
  - Community hangboard sessions

## 💰 Monetization Strategy

### Freemium Tiers

#### **Free Tier** (Forever Free)

- 3 basic training plans
- Manual workout logging
- Basic analytics (last 30 days)
- Follow 20 users
- View community routines
- 5 custom workouts saved

#### **Premium Tier** ($9.99/month or $79/year)

- Unlimited AI-generated plans
- Advanced analytics (all time)
- Unlimited follows
- Download community routines
- Unlimited custom workouts
- Video exercise library
- Priority support
- No ads

#### **Pro Tier** ($19.99/month or $159/year)

- Everything in Premium
- Coach dashboard access
- Sell training templates
- Advanced AI predictions
- Technique video analysis
- Custom club creation
- API access
- White-label options

### Additional Revenue Streams

- **Template Marketplace** (30% commission)
- **Sponsored Challenges** (brand partnerships)
- **Gym Partnerships** (B2B subscriptions)
- **Hardware Integration** (affiliate commissions)
- **Coaching Consultations** (booking fees)

## 🚀 MVP Features (Launch Priority)

### Phase 1 - Core MVP (Months 1-3)

**Must Have:**

1. User authentication & basic profile
2. Simplified onboarding (3 screens max)
3. 5 pre-built training plans (beginner to advanced)
4. Hangboard timer with common protocols
5. Basic workout logging
6. Simple progress charts
7. Follow users & activity feed
8. Push notifications for workouts

**Nice to Have:**

- Social login
- Custom workouts
- Photo uploads
- Advanced analytics

### Phase 2 - Enhanced MVP (Months 3-4)

1. AI plan generation (basic)
2. Routine sharing marketplace
3. Climbing logbook
4. Comments & interactions
5. Achievement badges
6. Premium subscription

### Phase 3 - Growth Features (Months 4-6)

1. Advanced analytics dashboard
2. Club/team features
3. Video exercise library
4. Partner matching
5. Seasonal challenges
6. Coach accounts

## 📊 Analytics Dashboard Design

### Main Analytics Categories

#### **Training Volume**

- Weekly/monthly/yearly views
- Breakdown by exercise type
- Time spent training
- Session frequency
- Rest day tracking

#### **Strength Metrics**

- Fingerboard progression curves
- Max hang improvements
- Pull-up max tracking
- Campus board levels
- Core strength tests

#### **Performance Metrics**

- Grade pyramid (attempts vs sends)
- Success rate by grade
- Project completion time
- Style preferences (overhang, slab, etc.)
- Indoor vs outdoor performance

#### **Health & Recovery**

- RPE trends
- Training load (acute:chronic ratio)
- Injury risk score
- Sleep quality correlation
- Recovery recommendations

### Visual Components

```javascript
// Example chart components needed
- LineChart: Progress over time
- BarChart: Volume distribution
- RadarChart: Strengths/weaknesses
- HeatMap: Training consistency calendar
- PieChart: Training type distribution
- ProgressRing: Goal completion
```

## 🛠️ Technical Considerations

### React Native Libraries

```json
{
  "core": {
    "react-navigation": "Tab & stack navigation",
    "react-native-async-storage": "Local data persistence",
    "react-native-firebase": "Auth, database, analytics",
    "react-query": "API state management"
  },
  "ui": {
    "react-native-elements": "UI components",
    "react-native-vector-icons": "Icon library",
    "react-native-reanimated": "Smooth animations",
    "react-native-gesture-handler": "Swipe gestures"
  },
  "features": {
    "react-native-charts-wrapper": "Analytics charts",
    "react-native-timer": "Workout timers",
    "react-native-push-notification": "Reminders",
    "react-native-share": "Social sharing",
    "react-native-camera": "Video recording"
  }
}
```

### Data Structure

```typescript
// Key models
interface User {
  id: string;
  profile: UserProfile;
  stats: UserStats;
  subscription: SubscriptionTier;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: Equipment[];
  creator: User;
}

interface ClimbingLog {
  id: string;
  userId: string;
  date: Date;
  type: 'boulder' | 'sport' | 'trad';
  grade: string;
  attempts: number;
  completed: boolean;
  notes: string;
  location: Location;
}
```

## 🎯 Success Metrics

### User Engagement KPIs

- **DAU/MAU ratio**: Target 40%+
- **Session length**: 15+ minutes average
- **Weekly workouts logged**: 3+ per active user
- **Social interactions**: 5+ per week per user
- **Routine completion rate**: 70%+

### Business KPIs

- **Free to paid conversion**: 15%
- **Monthly churn rate**: <5%
- **User acquisition cost**: <$10
- **Lifetime value**: >$150
- **App store rating**: 4.5+

### Feature Adoption

- **AI plans used**: 60% of premium users
- **Community routines downloaded**: 30% weekly active
- **Analytics viewed**: 50% weekly active
- **Social features used**: 40% daily active

This comprehensive breakdown should give you everything needed to start building your MVP. Focus on Phase 1 features first, iterate based on user feedback, and gradually expand functionality. Remember: a simple, well-executed MVP is better than a complex, buggy full-featured app!
