# Portfolio Dashboard - Complete CRUD Implementation

A comprehensive portfolio management dashboard built with Next.js 15, TypeScript, Prisma, and Tailwind CSS. This dashboard provides full CRUD (Create, Read, Update, Delete) operations for managing all aspects of your portfolio website.

## 🚀 Features Overview

### ✅ Complete CRUD Modules Implemented

1. **Profile Management** - Personal information and bio
2. **Projects Portfolio** - Showcase your work and projects  
3. **Work Experience** - Professional experience history
4. **Technical Skills** - Skills with proficiency levels
5. **Contact Information** - Contact details and message handling

### 🔧 Core Features

- **Authentication System** - Secure login/logout with NextAuth
- **Responsive Design** - Mobile-first, works on all devices
- **Real-time Updates** - Instant UI updates after operations
- **Search & Filtering** - Find content quickly across all modules
- **Bulk Operations** - Select and manage multiple items
- **Data Validation** - Comprehensive form validation with Zod
- **Loading States** - Skeleton loaders for better UX
- **Toast Notifications** - Success/error feedback
- **Dark/Light Theme** - Theme switching support

## 📁 Project Structure

```
portfolio/
├── src/app/
│   ├── dashboard/
│   │   ├── contact/page.tsx         # Contact info & messages management
│   │   ├── experience/page.tsx      # Work experience CRUD
│   │   ├── profile/page.tsx         # Profile management
│   │   ├── projects/page.tsx        # Projects portfolio CRUD
│   │   ├── skills/page.tsx          # Skills management with proficiency
│   │   ├── layout.tsx               # Dashboard layout with sidebar
│   │   └── page.tsx                 # Dashboard overview
│   └── api/
│       └── dashboard/
│           └── stats/route.ts       # Dashboard statistics API
├── src/components/
│   ├── dashboard/
│   │   ├── sidebar.tsx              # Navigation sidebar
│   │   ├── header.tsx               # Dashboard header
│   │   └── breadcrumb.tsx           # Navigation breadcrumbs
│   └── ui/                          # Reusable UI components
├── src/lib/
│   └── actions/                     # Server actions for each module
│       ├── contact.ts               # Contact CRUD operations
│       ├── experience.ts            # Experience CRUD operations
│       ├── profile.ts               # Profile CRUD operations
│       ├── projects.ts              # Projects CRUD operations
│       └── skills.ts                # Skills CRUD operations
└── prisma/
    └── schema.prisma                # Database schema
```

## 🗄️ Database Schema

### Core Tables

```prisma
// Authentication
model User {
  id            String   @id @default(cuid())
  username      String   @unique
  password_hash String
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
}

// Profile Module
model Profile {
  id            String   @id @default(cuid())
  name          String
  about         String
  profile_image String?
  location      String?
  headline      String?
  availability  String?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
}

// Projects Module
model Project {
  id            String        @id @default(cuid())
  title         String
  description   String
  status        ProjectStatus // completed, ongoing, draft
  tech_stack    String        // JSON array
  github_link   String
  deployed_link String?
  created_at    DateTime      @default(now())
  updated_at    DateTime      @updatedAt
}

// Experience Module
model Experience {
  id               String   @id @default(cuid())
  company_name     String
  role             String
  duration         String
  role_description String
  achievements     String   // JSON array
  challenges_faced String
  learnings        String
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt
}

// Skills Module
model Skill {
  id               String        @id @default(cuid())
  name             String
  category         SkillCategory // frontend, backend, devops, etc.
  proficiency_level Int?         @default(5) // 1-5 scale
  created_at       DateTime      @default(now())
  updated_at       DateTime      @updatedAt
}

// Contact Module
model ContactInfo {
  id         String   @id @default(cuid())
  email      String   @unique
  phone      String?
  linkedin   String?
  github     String?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}

model ContactMessage {
  id         String   @id @default(cuid())
  name       String
  email      String
  subject    String
  message    String
  is_read    Boolean  @default(false)
  created_at DateTime @default(now())
}
```

## 🔧 Module Details

### 1. Profile Management (`/dashboard/profile`)

**Features:**
- ✅ Create/Update personal profile
- ✅ Image upload support
- ✅ Real-time preview
- ✅ Profile completion tracking
- ✅ Delete profile option

**CRUD Operations:**
- `getProfile()` - Fetch current profile
- `createOrUpdateProfile(data)` - Create or update profile
- `deleteProfile()` - Delete profile
- `uploadProfileImage(formData)` - Handle image uploads

### 2. Projects Portfolio (`/dashboard/projects`)

**Features:**
- ✅ Full CRUD for projects
- ✅ Project status management (completed, ongoing, draft)
- ✅ Tech stack tagging
- ✅ GitHub and live demo links
- ✅ Search and filter by status
- ✅ Duplicate projects
- ✅ Bulk operations

**CRUD Operations:**
- `getProjects()` - Fetch all projects
- `getProject(id)` - Fetch single project
- `createProject(data)` - Create new project
- `updateProject(id, data)` - Update project
- `deleteProject(id)` - Delete project
- `duplicateProject(id)` - Clone project

### 3. Work Experience (`/dashboard/experience`)

**Features:**
- ✅ Complete work history management
- ✅ Rich experience details (role, achievements, challenges, learnings)
- ✅ Dynamic achievements list
- ✅ Search functionality
- ✅ Duplicate experiences
- ✅ Chronological ordering

**CRUD Operations:**
- `getExperiences()` - Fetch all experiences
- `getExperience(id)` - Fetch single experience
- `createExperience(data)` - Create new experience
- `updateExperience(id, data)` - Update experience
- `deleteExperience(id)` - Delete experience
- `duplicateExperience(id)` - Clone experience

### 4. Technical Skills (`/dashboard/skills`)

**Features:**
- ✅ Skills with proficiency levels (1-5 scale)
- ✅ Category-based organization (Frontend, Backend, DevOps, etc.)
- ✅ Interactive proficiency adjustment
- ✅ Bulk selection and operations
- ✅ Search and filter by category
- ✅ Visual progress indicators

**CRUD Operations:**
- `getSkills()` - Fetch all skills
- `getSkillsByCategory()` - Fetch skills grouped by category
- `createSkill(data)` - Create new skill
- `updateSkill(id, data)` - Update skill
- `deleteSkill(id)` - Delete skill
- `updateSkillProficiency(id, level)` - Quick proficiency update
- `bulkDeleteSkills(ids)` - Delete multiple skills

### 5. Contact & Messages (`/dashboard/contact`)

**Features:**
- ✅ Contact information management
- ✅ Contact form message handling
- ✅ Read/unread message tracking
- ✅ Message search and filtering
- ✅ Bulk message operations
- ✅ Social media profile links

**CRUD Operations:**
- `getContactInfo()` - Fetch contact information
- `createOrUpdateContactInfo(data)` - Update contact details
- `getContactMessages()` - Fetch all messages
- `markMessageAsRead(id)` - Mark message as read
- `deleteContactMessage(id)` - Delete message
- `bulkDeleteMessages(ids)` - Delete multiple messages

## 🎨 UI Components

### Custom Components Created
- `Slider` - For proficiency level adjustment
- `Checkbox` - For bulk selections
- `AlertDialog` - For confirmation dialogs
- Enhanced cards with hover effects
- Loading skeletons for all modules
- Responsive navigation sidebar

### Features
- **Responsive Design** - Mobile-first approach
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Optimized with Next.js 15 features
- **Type Safety** - Full TypeScript coverage

## 🔐 Authentication

- **NextAuth.js** integration
- **Session-based** authentication
- **Route Protection** - All dashboard routes protected
- **Automatic redirects** for unauthenticated users

## 📊 Dashboard Overview

The main dashboard (`/dashboard`) provides:
- **Statistics Cards** - Quick overview of all modules
- **Recent Activity** - Latest projects and messages
- **Quick Actions** - Direct links to all modules
- **Profile Summary** - Current profile status
- **Skills Overview** - Top skills display

## 🚀 Getting Started

1. **Installation**
```bash
npm install
```

2. **Database Setup**
```bash
npx prisma generate
npx prisma db push
```

3. **Environment Variables**
```bash
# Copy .env.example to .env and fill in your values
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Access Dashboard**
- Navigate to `/auth/login`
- Create an account or login
- Access dashboard at `/dashboard`

## 🔄 Data Flow

1. **Client Actions** → Server Actions (`/lib/actions/`)
2. **Validation** → Zod schema validation
3. **Database** → Prisma ORM operations
4. **Revalidation** → Next.js cache revalidation
5. **UI Updates** → Optimistic updates with loading states

## 🎯 Key Features Implemented

### Data Management
- ✅ Full CRUD operations for all modules
- ✅ Data validation with Zod
- ✅ Optimistic UI updates
- ✅ Error handling and recovery

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states and skeletons
- ✅ Toast notifications
- ✅ Search and filtering
- ✅ Bulk operations
- ✅ Keyboard shortcuts

### Performance
- ✅ Server-side rendering
- ✅ Incremental static regeneration
- ✅ Optimized database queries
- ✅ Code splitting

### Security
- ✅ Authentication required
- ✅ CSRF protection
- ✅ Input validation
- ✅ SQL injection prevention

## 📝 Usage Examples

### Adding a New Project
1. Navigate to `/dashboard/projects`
2. Click "Add Project" button
3. Fill in project details (title, description, tech stack, links)
4. Select project status
5. Save to database

### Managing Skills
1. Go to `/dashboard/skills`
2. Add skills with categories
3. Adjust proficiency levels with slider
4. Use bulk operations to manage multiple skills
5. Filter by category or search

### Viewing Messages
1. Access `/dashboard/contact`
2. Set up contact information
3. View incoming messages
4. Mark as read/unread
5. Delete or bulk manage messages

## 🔧 Customization

### Adding New Modules
1. Create new database model in `schema.prisma`
2. Add server actions in `/lib/actions/`
3. Create dashboard page in `/app/dashboard/`
4. Update sidebar navigation
5. Add to dashboard overview

### Styling
- All styles use Tailwind CSS
- Custom components in `/components/ui/`
- Dark/light theme support
- Fully customizable design system

## 📚 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Prisma ORM with SQLite (production-ready for any DB)
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **State Management**: React Server Components + Server Actions
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🎉 Complete Implementation Status

✅ **Profile Module** - 100% Complete  
✅ **Projects Module** - 100% Complete  
✅ **Experience Module** - 100% Complete  
✅ **Skills Module** - 100% Complete  
✅ **Contact Module** - 100% Complete  
✅ **Authentication** - 100% Complete  
✅ **Dashboard Overview** - 100% Complete  
✅ **Responsive Design** - 100% Complete  
✅ **CRUD Operations** - 100% Complete  

Your portfolio dashboard is now fully functional with complete CRUD capabilities for all modules! 🎊