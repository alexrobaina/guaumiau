# 🧗‍♂️ CruxClimb - Business Logic Analysis & Design Specification

> **For Design Teams:** Comprehensive guide to CruxClimb's features, user flows, and UI/UX requirements

---

## 📋 **Executive Summary**

**CruxClimb** is an AI-powered climbing training app that creates personalized workout plans based on user profiles. The app combines advanced AI algorithms with comprehensive tracking, progress analytics, and social features to help climbers improve their performance systematically.

**Core Value Proposition:** Transform climbing training from generic programs to personalized, data-driven plans that adapt to individual goals, equipment, and constraints.

---

## 🎯 **Target Users & User Personas**

### **Primary Users**

1. **Beginner Climbers** (0-6 months experience)
   - Need structured guidance and safe progression
   - Focus on basic strength building and technique
   - Often gym-based training

2. **Intermediate Climbers** (6 months - 2 years)
   - Looking to break through plateaus
   - Want variety in training methods
   - Mix of gym and outdoor climbing

3. **Advanced Climbers** (2+ years)
   - Seeking optimization and specialization
   - Competition preparation needs
   - Equipment-rich training setups

4. **Elite Climbers** (Professional level)
   - Need competition peaking strategies
   - Precise periodization requirements
   - Complex training variables

---

## 🏗️ **App Architecture & Navigation**

### **Navigation Structure**

```
CruxClimb App
├── 🚀 Entry Point (index.tsx)
│   ├── Authentication Check
│   ├── Onboarding Status
│   └── Routing Decision
│
├── 📝 Onboarding Flow (First-time users)
│   ├── Experience Level
│   ├── Current Grades (Boulder/French)
│   ├── Goals Selection
│   ├── Equipment Available
│   ├── Training Availability
│   ├── Injuries/Limitations
│   ├── Preferred Style
│   └── Profile Summary & Completion
│
├── 🏠 Main App - Tab Navigation
│   ├── Home (Dashboard)
│   ├── Training (Active Plan)
│   ├── Progress (Analytics)
│   ├── History (Past Plans)
│   └── Profile (Settings)
│
└── 🎛️ Side Navigation (Hamburger Menu)
    ├── Dashboard Overview
    ├── Training Plan Management
    ├── Progress Tracking
    ├── Workout History
    ├── Community Features
    ├── Tools (Timer, Calculator, Equipment)
    └── Settings & Profile
```

### **Authentication Flow**

- **Unauthenticated**: Complete onboarding → Login/Register
- **Authenticated + Incomplete Onboarding**: Resume onboarding
- **Authenticated + Complete**: Direct to main app

---

## 🎨 **Screen-by-Screen Breakdown**

### **1. Entry Screen (Loading/Splash)**

**File:** `src/app/index.tsx`
**Purpose:** App initialization and routing logic

**UI Requirements:**

- Brand colors (Primary: `#FF6B35` orange)
- Loading spinner
- Clean, minimal design
- No user interaction required

**Business Logic:**

- Check authentication status
- Verify onboarding completion
- Route to appropriate screen based on state
- Handle edge cases gracefully

---

### **2. Onboarding Flow**

**Location:** `src/app/(onboarding)/`
**Purpose:** Collect user profile data for AI personalization

#### **2.1 Experience Level Screen**

**File:** `experience.tsx`

**UI Elements:**

- Progress indicator (Step X of 8)
- Large selectable cards with:
  - **Beginner**: "New to climbing or less than 6 months experience"
  - **Intermediate**: "6 months to 2 years of regular climbing"
  - **Advanced**: "2+ years with consistent training"
  - **Elite**: "Competitive level or professional climber"

**Design Notes:**

- Single selection only
- Cards should have clear visual feedback for selection
- Progress should be visible at all times
- "Next" button enabled only when selection made

#### **2.2 Grade Assessment Screen**

**File:** `grade.tsx`

**UI Elements:**

- Grade selectors for both systems:
  - **Boulder grades**: V0-V17+
  - **French grades**: 4a-9c+
- Grade conversion helper
- "I don't know" option for beginners

**Design Notes:**

- Two-column layout or tabbed interface
- Grade progression visualization
- Contextual help for grade systems

#### **2.3 Goals Selection Screen**

**File:** `goals.tsx`

**UI Elements:**

- Multi-select chips/cards for goals:
  - Strength Building
  - Power Development
  - Endurance Training
  - Technique Improvement
  - Competition Preparation
  - Injury Recovery
  - General Fitness

**Design Notes:**

- Allow multiple selections
- Visual limit indicator (recommend 2-4 goals)
- Brief descriptions for each goal

#### **2.4 Equipment Assessment Screen**

**File:** `equipment.tsx`

**UI Elements:**

- Checklist-style interface for equipment:
  - Fingerboard/Hangboard
  - Campus Board
  - System Board
  - Pull-up Bar
  - Gymnastic Rings
  - Resistance Bands
  - Dumbbells/Weights
  - Kettlebells
  - Basic bodyweight (always available)

**Design Notes:**

- Grouped by training type
- Equipment images/icons helpful
- "None" option for bodyweight-only training

#### **2.5 Training Availability Screen**

**File:** `availability.tsx`

**UI Elements:**

- Days per week slider/selector (1-7)
- Hours per session slider (0.5-4 hours)
- Schedule preferences (morning/evening/flexible)

**Design Notes:**

- Interactive sliders with visual feedback
- Time commitment visualization
- Realistic expectations messaging

#### **2.6 Injuries & Limitations Screen**

**File:** `injuries.tsx`

**UI Elements:**

- Common injury checklist:
  - Finger/Pulley injuries
  - Elbow problems (tennis/golfer's elbow)
  - Shoulder impingement
  - Lower back issues
  - Knee problems
  - None/Other option

**Design Notes:**

- Sensitive topic - supportive tone
- Option to add custom notes
- Clear "affects exercise selection" messaging

#### **2.7 Preferred Style Screen**

**File:** `style.tsx`

**UI Elements:**

- Style preference cards:
  - **Boulder**: Short, powerful problems
  - **Sport**: Endurance-focused route climbing
  - **Traditional**: Gear placement climbing
  - **All Styles**: Balanced approach

**Design Notes:**

- Visual representations of each style
- Impact on training plan explanation

#### **2.8 Completion Screen**

**File:** `complete.tsx`

**UI Elements:**

- Profile summary card showing:
  - Experience level
  - Current grades
  - Primary goals (first 3)
  - Training schedule
  - Equipment count
  - Preferred style
- "What's Next?" preview with features:
  - 🤖 AI-generated personalized plan
  - 📅 Weekly workouts with progressive overload
  - 📈 Progress tracking with RPE logging
  - 🏆 Competition planning with peaking

**Design Notes:**

- Celebratory tone and imagery
- Profile summary should be scannable
- Clear next steps explanation
- Prominent "Create Your Plan" CTA

---

### **3. Main App - Tab Navigation**

#### **3.1 Home Tab (Dashboard)**

**File:** `src/app/(tabs)/index.tsx`
**Purpose:** Central hub showing current status and quick actions

**UI Sections:**

**3.1.1 Header**

- User greeting with name/email
- Current date and motivation
- Quick stats (streak, total workouts)

**3.1.2 Active Plan Overview Card**

- Plan name and type (AI Generated/Custom)
- Progress bar (Week X of Y, Z% complete)
- Next workout preview
- Quick actions (View Details, Start Workout)

**3.1.3 Today's Workout Card** (if applicable)

- Workout name and estimated duration
- Exercise preview (first 2-3 exercises)
- Difficulty indicator
- Start button with timer integration

**3.1.4 Quick Stats Row**

- Current week number
- Next deload week
- Days per week training
- Current streak

**3.1.5 Recent Activity Feed**

- Last workout completion
- Progress milestones achieved
- Grade improvements
- Equipment recommendations

**Design Notes:**

- Card-based layout for scannability
- Consistent visual hierarchy
- Action-oriented design
- Motivational elements without being overwhelming

#### **3.2 Training Tab**

**File:** `src/app/(tabs)/two.tsx` → `TrainingDashboard`
**Purpose:** Detailed view of active training plan

**UI Sections:**

**3.2.1 Plan Overview Header**

- Plan name with edit option
- Algorithm version indicator
- Creation date ("X days ago")
- Plan type badge (AI Generated)

**3.2.2 Progress Overview**

- Visual progress bar with weekly markers
- Completed weeks vs total
- Current week highlight
- Next deload week indicator

**3.2.3 Current Week Detailed View**

- Week number with deload badge if applicable
- Intensity multiplier (e.g., "100% intensity")
- Individual workout cards showing:
  - Workout name and type
  - Estimated duration
  - Exercise count
  - Completion status
  - Start/Resume buttons

**3.2.4 Upcoming Weeks Preview**

- Next 2-3 weeks overview
- Deload week indicators
- Intensity variations
- General workout themes

**3.2.5 Plan Actions**

- Mark week complete
- View detailed week breakdown
- Adjust plan parameters
- Generate new plan

**States to Design:**

- **No Active Plan**: Motivational CTA to generate first plan
- **Plan Generating**: Progress indicator with stages
- **Active Plan**: Full functionality as described
- **Plan Complete**: Celebration + new plan options

#### **3.3 Progress Tab**

**File:** `src/app/(tabs)/progress.tsx` → `ProgressTrackingDashboard`
**Purpose:** Analytics and progress visualization

**UI Sections:**

**3.3.1 Overview Metrics**

- Total workouts completed
- Current streak
- Average session duration
- Consistency percentage

**3.3.2 Performance Charts**

- Grade progression over time
- RPE trends by workout type
- Volume progression (sets, reps, duration)
- Strength metrics improvement

**3.3.3 Achievement Badges**

- Milestone achievements
- Consistency awards
- Personal records
- Goal completions

**3.3.4 Detailed Analytics**

- Workout type distribution
- Equipment usage statistics
- Injury-free periods
- Training load analysis

**3.3.5 Goal Tracking**

- Progress toward stated goals
- Timeline projections
- Adjustment recommendations

**Design Notes:**

- Heavy use of charts and data visualization
- Color-coded progress indicators
- Filterable time ranges
- Export capabilities for data sharing

#### **3.4 History Tab**

**File:** `src/app/(tabs)/history.tsx`
**Purpose:** Past training plans and sessions management

**UI Sections:**

**3.4.1 Search & Filter Bar**

- Text search for plan names
- Filter buttons: All, AI Generated, Custom, Completed
- Sort options (recent, duration, completion rate)

**3.4.2 Training Plan Cards**

- Plan name and type badge
- Duration and completion stats
- Creation and last update dates
- Progress percentage
- Status indicator (Active/Paused/Completed)

**3.4.3 Plan Actions Menu**

- View detailed plan
- Resume/Activate plan
- Duplicate plan as template
- Delete plan
- Share plan

**3.4.4 Empty States**

- No plans found
- No search results
- Motivational CTAs to create first plan

**Design Notes:**

- Searchable and filterable list
- Clear visual distinction between plan types
- Batch operations for plan management
- Archive vs delete options

#### **3.5 Profile Tab**

**File:** Profile screen (not implemented yet)
**Purpose:** User settings and account management

**Expected UI Sections:**

**3.5.1 User Info Card**

- Profile photo/avatar
- Name and email
- Account creation date
- Subscription status

**3.5.2 Training Profile**

- Current experience level
- Current grades (editable)
- Primary goals
- Equipment list
- Training availability

**3.5.3 App Settings**

- Notifications preferences
- Units (metric/imperial)
- Theme (light/dark/auto)
- Data sync settings

**3.5.4 Account Actions**

- Edit profile information
- Change password
- Export data
- Delete account
- Sign out

---

### **4. Modal Screens & Overlays**

#### **4.1 Plan Generation Screen**

**File:** `src/app/plan-generation.tsx` → `PlanGeneration`
**Purpose:** Configure and generate new AI training plans

**UI Sections:**

**4.1.1 Header**

- "Generate Training Plan" title
- Subtitle explaining AI personalization

**4.1.2 Plan Configuration Card**

**Duration Selection**

- Button group: 8w, 12w, 16w, 20w
- Visual timeline representation

**Focus Areas**

- Multi-select chips for:
  - Strength (Build maximum pulling power)
  - Power (Explosive dynamic movements)
  - Endurance (Sustained climbing performance)
  - Technique (Movement quality and efficiency)
  - Mobility (Flexibility and injury prevention)

**Training Intensity**

- Three-option selector:
  - Conservative (Steady & safe)
  - Moderate (Balanced approach)
  - Aggressive (Fast progression)

**Competition Planning**

- Toggle switch for peaking phases
- Date picker for competition (if enabled)

**4.1.3 Plan Preview Card**

- Estimated total sessions
- Sessions per week
- Minutes per session
- Selected focus areas count
- Personalization summary

**4.1.4 Generation Progress** (when generating)

- Progress bar with percentage
- Current stage description
- Estimated time remaining
- Stage-specific messages

**4.1.5 Actions**

- Cancel (back to previous screen)
- Generate Plan (primary CTA)

**Design Notes:**

- Modal presentation style
- Form validation and feedback
- Progressive disclosure of options
- Clear preview of what will be generated

#### **4.2 Sidebar Navigation**

**File:** `src/components/organisms/SidebarNavigation/`
**Purpose:** Extended navigation and settings

**UI Sections:**

**4.2.1 User Header**

- Avatar with user initials
- Username (from email)
- Current plan quick info
- Close button

**4.2.2 Navigation Menu**

- **NAVIGATION** section:
  - Dashboard (Overview and quick actions)
  - Training Plan (Your personalized program)
  - Progress Tracking (Analytics and metrics)
  - Workout History (Past sessions and achievements)
  - Community (Connect with other climbers)

**4.2.3 Tools Section**

- **TOOLS** section:
  - Workout Timer (Interval and rest timers)
  - Grade Calculator (Convert between systems)
  - Equipment Check (Manage climbing gear)

**4.2.4 Settings Section**

- Dark mode toggle
- Profile Settings
- Notifications
- Privacy & Data
- Help & Support

**4.2.5 Footer**

- Sign out button
- App version number

**Design Notes:**

- Slide-in from left
- Backdrop overlay
- Consistent with Material Design patterns
- Active state indicators

---

## 🤖 **AI Training Plan System**

### **Core AI Features**

#### **1. Plan Generation Algorithm**

**File:** `src/lib/ai/trainingPlanGenerator.ts`

**Input Parameters:**

- User profile (experience, grades, goals, equipment, availability, injuries)
- Plan duration (4-52 weeks)
- Focus areas (strength, power, endurance, technique, mobility)
- Intensity preference (conservative, moderate, aggressive)
- Competition planning (peaking phases)

**AI Processing Pipeline:**

1. **Profile Analysis** (10%): Analyze user data and requirements
2. **Template Selection** (25%): Choose optimal workout templates
3. **Week Generation** (50%): Create weekly schedules with progression
4. **Plan Adaptation** (75%): Adapt for constraints and injuries
5. **Finalization** (100%): Generate final plan structure

**Generated Plan Structure:**

- **Plan Metadata**: Name, type, duration, algorithm version
- **Personalized Factors**: User-specific adaptations
- **Progressive Overload**: Intensity progression over time
- **Deload Scheduling**: Recovery weeks based on experience
- **Weekly Structure**: Exercise selection and periodization

#### **2. Adaptive Intelligence**

- **Equipment Adaptation**: Substitute exercises based on available equipment
- **Injury Accommodation**: Modify exercises for injury limitations
- **Progress Tracking**: Adjust intensity based on performance feedback
- **Auto-deload**: Intelligent recovery week scheduling

#### **3. DeepSeek AI Integration**

**Primary AI**: Advanced language model for plan generation
**Fallback**: Rule-based algorithm for reliability
**Error Handling**: Graceful degradation with user notification

### **Plan Types & Templates**

#### **Workout Categories**

- **Fingerboard Training**: Hangboard exercises, grip strength
- **Campus Board**: Dynamic power movement training
- **System Training**: Structured climbing movement patterns
- **Strength Training**: Pull-ups, core, antagonist training
- **Mobility & Recovery**: Stretching, injury prevention
- **Endurance Training**: Volume-based climbing exercises
- **Power Training**: Explosive movement patterns

#### **Difficulty Adaptation**

- **Beginner**: Focus on basic strength, longer rest periods
- **Intermediate**: Balanced approach, moderate intensity
- **Advanced**: High intensity, complex movement patterns
- **Elite**: Competition-specific, peaking strategies

---

## 📊 **Data Architecture & Storage**

### **Local Storage (AsyncStorage)**

**Purpose:** App state, UI preferences, offline functionality

**Stored Data:**

```typescript
{
  auth: { ... },           // Login state
  ui: { ... },            // UI preferences
  workout: { ... },       // Current workout state
  theme: { ... },         // Dark/light mode
  onboarding: { ... },    // Onboarding progress
  trainingPlan: { ... }   // AI training plan state
}
```

### **Cloud Storage (Firebase Firestore)**

**Purpose:** User profiles, training plans, shared data

**Collections Structure:**

- `users/` - User profiles and onboarding data
- `training_plans/` - AI-generated and custom plans
- `workout_templates/` - Exercise templates and variations
- `workout_sessions/` - Completed workout logging
- `posts/` - Community features (future)

### **Data Sync Strategy**

- **Immediate**: Critical user data (profiles, active plans)
- **Batched**: Progress data, workout completions
- **Offline-first**: Local state with cloud synchronization
- **Conflict Resolution**: Last-write-wins with user notification

---

## 🎨 **Design System Requirements**

### **Color Palette**

**Primary Colors:**

- Primary: `#FF6B35` (CruxClimb Orange)
- Secondary: TBD by design team
- Background: Dynamic (light/dark theme support)

**Functional Colors:**

- Success: Green tones for completions
- Warning: Amber for attention items
- Error: Red for failures and critical issues
- Info: Blue for informational content

### **Typography**

**Hierarchy Needed:**

- **H1**: Main screen titles
- **H2**: Section headers
- **H3**: Card titles
- **Body**: General content text
- **Caption**: Secondary information
- **Button**: Action text

### **Component Architecture**

**Atomic Design Pattern:**

**Atoms** (`src/components/atoms/`):

- Button variations
- Text components
- Input fields
- Progress indicators
- Icons and badges

**Molecules** (`src/components/molecules/`):

- SelectableCard (onboarding)
- FormField (inputs with labels)
- WorkoutCard (exercise display)
- ProgressChart (data visualization)

**Organisms** (`src/components/organisms/`):

- OnboardingScreen (step wrapper)
- SidebarNavigation (menu system)
- TrainingDashboard (complex layouts)

**Screen Components** (`src/components/screens/`):

- Full screen implementations
- Complex user flows
- Integration points

### **Animation Requirements**

**Essential Animations:**

- Page transitions (slide, fade)
- Card interactions (tap feedback)
- Progress indicators (loading states)
- Success celebrations (plan completion)
- Gesture feedback (swipe actions)

**Performance Considerations:**

- 60fps target for all animations
- Reduced motion accessibility support
- Battery-conscious animation strategies

---

## 📱 **User Experience Flows**

### **Critical User Journeys**

#### **1. First-Time User (Happy Path)**

```
App Launch → Onboarding Flow (8 steps) → Plan Generation → Dashboard → First Workout
```

**Design Priorities:**

- Minimal cognitive load per step
- Clear progress indication
- Encouraging and supportive tone
- Quick wins and motivation

#### **2. Returning User (Daily Usage)**

```
App Launch → Dashboard → Today's Workout → Exercise Execution → Progress Logging → Completion Celebration
```

**Design Priorities:**

- Fast app startup
- Quick access to current workout
- Minimal friction for logging
- Consistent motivation

#### **3. Plan Completion (Milestone)**

```
Complete Final Week → Celebration Screen → Progress Summary → New Plan Options → Plan Generation
```

**Design Priorities:**

- Achievement celebration
- Progress visualization
- Clear next steps
- Continued engagement

### **Error Handling & Edge Cases**

#### **Technical Errors**

- **AI Generation Fails**: Clear error message, fallback to rule-based generation
- **Network Issues**: Offline mode with sync retry
- **Authentication Problems**: Clear path to re-authentication
- **Data Corruption**: Recovery options with user control

#### **User Experience Edges**

- **No Equipment Selected**: Bodyweight-only plan generation
- **Serious Injuries**: Modified exercise recommendations
- **Time Constraints**: Shorter workout adaptations
- **Goal Conflicts**: AI prioritization with user override

---

## 🚀 **Future Features & Scalability**

### **Phase 2 Features** (Design Consideration)

- **Community Features**: Social comparison, shared workouts
- **Video Integration**: Exercise demonstrations, form checking
- **Wearable Integration**: Heart rate, recovery metrics
- **Competition Mode**: Event-specific peaking programs
- **Coaching Tools**: Trainer dashboard, client management

### **Responsive Design Requirements**

- **Phone Primary**: iOS/Android mobile-first design
- **Tablet Support**: Larger screen layouts for charts/analytics
- **Web Version**: Future browser-based access
- **Watch Integration**: Basic workout tracking

### **Accessibility Requirements**

- **Screen Reader Support**: Full VoiceOver/TalkBack compatibility
- **High Contrast Mode**: Visual accessibility options
- **Large Text Support**: Dynamic type scaling
- **Motor Accessibility**: Large touch targets, gesture alternatives
- **Cognitive Accessibility**: Clear language, consistent patterns

---

## 🎯 **Key Design Challenges**

### **1. Information Density**

**Challenge**: Display complex training data without overwhelming users
**Approach**: Progressive disclosure, dashboard prioritization, contextual details

### **2. Motivation & Engagement**

**Challenge**: Maintain long-term user engagement in training
**Approach**: Gamification elements, progress visualization, achievement system

### **3. Flexibility vs Simplicity**

**Challenge**: Accommodate diverse user needs while keeping interface simple
**Approach**: Smart defaults with advanced customization options

### **4. Trust in AI Recommendations**

**Challenge**: Users need confidence in AI-generated plans
**Approach**: Transparent algorithm explanation, customization options, fallback choices

### **5. Cross-Platform Consistency**

**Challenge**: Maintain consistent experience across devices and platforms
**Approach**: Design system adherence, shared component library, platform-specific adaptations

---

## 📏 **Success Metrics & Design Validation**

### **User Engagement Metrics**

- **Onboarding Completion Rate**: Target >80%
- **Plan Generation Success**: Target >95%
- **Weekly Workout Completion**: Target >70%
- **App Retention**: 30-day retention >50%

### **User Experience Metrics**

- **Task Completion Time**: Benchmark current, improve by 20%
- **User Error Rate**: <5% on critical flows
- **Help/Support Usage**: <10% of active users
- **User Satisfaction**: Target 4.5+ app store rating

### **Technical Performance**

- **App Launch Time**: <2 seconds to usable state
- **Plan Generation Time**: <30 seconds average
- **Crash Rate**: <0.1% of sessions
- **Offline Functionality**: Core features work without connection

---

## 🛠️ **Implementation Guidelines**

### **Development Priorities**

1. **Core User Flow**: Onboarding → Plan Generation → Workout Execution
2. **Data Reliability**: Robust error handling and offline support
3. **Performance**: Fast, responsive interactions
4. **Accessibility**: Full accessibility compliance from day one

### **Design Handoff Requirements**

- **Component Specifications**: Detailed states, dimensions, interactions
- **Animation Specifications**: Timing, easing, trigger conditions
- **Responsive Breakpoints**: Phone, tablet, landscape orientations
- **Asset Requirements**: Icons, images, illustrations at multiple resolutions

### **Quality Assurance**

- **User Testing**: Validate critical flows with target users
- **Accessibility Audit**: Comprehensive accessibility testing
- **Performance Testing**: Real-device performance validation
- **Cross-platform Testing**: Consistent experience across devices

---

## 📞 **Design Team Next Steps**

### **Immediate Actions**

1. **Visual Design System**: Establish comprehensive design system
2. **User Flow Mockups**: Create detailed wireframes for each screen
3. **Prototype Critical Flows**: Interactive prototypes for key user journeys
4. **Component Library**: Build reusable component specifications

### **Research & Validation**

1. **User Interview**: Validate assumptions with target climbers
2. **Competitive Analysis**: Analyze other fitness/climbing apps
3. **Accessibility Review**: Ensure inclusive design practices
4. **Technical Feasibility**: Confirm design feasibility with development team

### **Design Deliverables**

1. **High-Fidelity Mockups**: Complete visual designs for all screens
2. **Interactive Prototype**: Clickable prototype for user testing
3. **Design System Documentation**: Comprehensive design guidelines
4. **Animation Specifications**: Detailed motion design requirements

---

## 📚 **Appendix**

### **Technical Stack Reference**

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **UI Components**: React Native Paper (Material Design)
- **Backend**: Firebase (Authentication, Firestore, Analytics)
- **AI Integration**: DeepSeek AI with rule-based fallback

### **File Structure Key Locations**

- **Screens**: `src/app/` (file-based routing)
- **Components**: `src/components/` (atomic design structure)
- **Business Logic**: `src/lib/` (services, AI, utilities)
- **State Management**: `src/store/` (Zustand slices)
- **Types**: `src/types/` (TypeScript definitions)

### **Key Configuration Files**

- **App Config**: `app.json` (Expo configuration)
- **Environment**: `.env` (Firebase keys, API endpoints)
- **Documentation**: `CLAUDE.md` (development guidelines)
- **Data Storage**: `docs/DATA-STORAGE-LOCATIONS.md` (data architecture)

---

**Document Version**: 1.0  
**Last Updated**: 2025-09-12  
**Next Review**: After design system completion

_This document serves as the foundation for all design decisions in CruxClimb. It should be updated as features evolve and user feedback is incorporated._
