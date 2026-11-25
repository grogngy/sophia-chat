# Navigation Structure & Routes - Sophia by Identia Lab

*Updated: October 13, 2025 | App: Sophia - Educational Gen-AI Chatbot*

---

## 📋 **APP SUMMARY**

**App Name:** Sophia by Identia Lab  
**Purpose:** Educational AI chatbot for Colombian/LATAM micro-businesses  
**Core Function:** Teach Gen-AI capabilities through hands-on interaction  
**Target Users:** Business owners with limited AI knowledge  
**Navigation Philosophy:** Simple, guided, Spanish-first experience

---

## 🗺️ **COMPLETE ROUTE MAP**

### **📍 Public Routes (No Authentication Required)**

| Route | Page Name | Purpose | Key Features |
|-------|-----------|---------|--------------|
| `/` | Landing Page | Convert visitors to users | Hero, Features, CTA |
| `/privacy` | Privacy Policy | Legal compliance | LATAM-specific privacy laws |
| `/terms` | Terms of Service | Legal protection | Usage terms, limitations |
| `/cookies` | Cookie Policy | GDPR/compliance | Cookie usage disclosure |

---

### **🔐 Authentication Routes**

| Route | Page Name | Purpose | User Action |
|-------|-----------|---------|-------------|
| `/auth/sign-up` | Registration | Create account | Email + password signup |
| `/auth/sign-up-success` | Welcome Message | Confirm registration | Email verification prompt |
| `/auth/login` | Login | Access account | Existing user login |
| `/auth/confirm` | Email Verification | Verify email | Supabase confirmation handler |
| `/auth/forgot-password` | Password Reset Request | Recover access | Send reset email |
| `/auth/reset-password/confirm` | Password Reset Complete | Set new password | Update password via email link |
| `/auth/error` | Auth Error | Handle failures | Display auth errors gracefully |

---

### **🛡️ Protected Routes (Authentication Required)**

| Route | Page Name | Access Level | Purpose |
|-------|-----------|--------------|---------|
| `/chat` | Chat Interface | All users | Primary Sophia interaction |
| `/history` | Conversation History | All users | View past conversations |
| `/profile` | User Profile | All users | Account settings, usage stats |
| `/admin/dashboard` | Admin Overview | Admins only | System health monitoring |
| `/admin/models` | Model Management | Admins only | Activate/deactivate AI models |

---

### **🚫 Error Pages**

| Route | Page Name | When Shown |
|-------|-----------|------------|
| `/not-found` (404) | Page Not Found | Invalid URL |
| `/error` (500) | Server Error | System failure |
| `/unauthorized` (403) | Access Denied | Non-admin accessing admin routes |

---

### **🔌 API Routes (Backend)**

| Route | Method | Purpose | Access |
|-------|--------|---------|--------|
| `/api/chat` | POST | Stream AI responses | Authenticated users |
| `/api/models` | GET | List available models | Authenticated users |
| `/api/models/[id]` | PUT/DELETE | Manage models | Admin only |

---

## 🎯 **PRIMARY USER FLOWS**

### **Flow 1: New User Journey (First-Time Visitor)**
```
Landing Page (/)
    ↓
Reads about Sophia's capabilities
    ↓
Clicks "Comienza Ahora" CTA
    ↓
Sign Up (/auth/sign-up)
    ↓
Email Verification (/auth/sign-up-success)
    ↓
Confirms email (/auth/confirm)
    ↓
Auto-redirects to Chat (/chat)
    ↓
Starts conversation with Sophia
```

### **Flow 2: Returning User Journey**
```
Landing Page (/)
    ↓
Clicks "Login" in header
    ↓
Login Page (/auth/login)
    ↓
Authenticates
    ↓
Chat Interface (/chat)
    ↓
[Last conversation auto-loads]
```

### **Flow 3: Chat Interaction Flow**
```
Chat Interface (/chat)
    ↓
User asks question
    ↓
Sophia responds (streams via /api/chat)
    ↓
[Optional] User uploads logo for analysis
    ↓
Sophia provides feedback
    ↓
[Optional] User hits session limit
    ↓
Sophia prompts: Register or Contact Identia Lab
```

### **Flow 4: Admin Workflow (Post-Deployment)**
```
Admin logs in
    ↓
Chat Interface (/chat)
    ↓
Clicks Profile → Admin Panel
    ↓
Admin Dashboard (/admin/dashboard)
    ↓
Views model statistics
    ↓
Clicks "Manage Models"
    ↓
Model Management (/admin/models)
    ↓
Deactivates expensive models:
  • gemini-2.5-pro
  • gpt-5, gpt-5-mini
  • claude-sonnet-4, grok-4
    ↓
Verifies only 3 active models:
  • Gemini 2.5 Flash
  • Gemini 2.5 Flash Lite
  • GPT-4o Mini
```

---

## 🧭 **NAVIGATION PATTERNS**

### **Primary Navigation (Authenticated Users)**

**Desktop Sidebar:**
```
┌─────────────────┐
│ [Logo] Sophia   │
├─────────────────┤
│ 💬 Chat         │ ← Primary (always visible)
│ 📜 History      │ ← Secondary
│ 👤 Profile      │ ← Tertiary
│                 │
│ [Admin Panel]   │ ← Only for admins
└─────────────────┘
```

**Mobile Bottom Navigation:**
```
┌─────────────────────────────────┐
│  💬       📜       👤          │
│ Chat   History  Profile        │
└─────────────────────────────────┘
```

### **Secondary Navigation Elements**

**Chat Interface:**
- Model selector dropdown (top-right)
- Image upload button (message input)
- Clear conversation (top-right menu)

**History Page:**
- Date filter dropdown
- Search bar
- Delete conversation buttons

**Profile Page:**
- Account info tabs
- Usage statistics display
- Admin panel link (admins only)

---

## 🔒 **ROUTE PROTECTION & ACCESS CONTROL**

### **Access Matrix**

| Route Type | Anonymous | Registered User | Admin |
|------------|-----------|-----------------|-------|
| **Public Routes** | ✅ | ✅ | ✅ |
| **Auth Routes** | ✅ | ➡️ Redirect to /chat | ➡️ Redirect to /chat |
| **/chat** | ❌ Redirect to /auth/login | ✅ | ✅ |
| **/history** | ❌ Redirect to /auth/login | ✅ | ✅ |
| **/profile** | ❌ Redirect to /auth/login | ✅ (limited) | ✅ (full) |
| **/admin/*** | ❌ Redirect to /unauthorized | ❌ Redirect to /unauthorized | ✅ |

### **Middleware Logic**

```typescript
// app/middleware.ts (conceptual)
if (route.startsWith('/admin')) {
  requireRole('admin')
}

if (protectedRoutes.includes(route)) {
  requireAuth()
}

if (authRoutes.includes(route) && isAuthenticated) {
  redirect('/chat') // Already logged in
}
```

---

## 📱 **RESPONSIVE NAVIGATION BEHAVIOR**

### **Mobile (<768px)**
- ✅ Bottom tab navigation (Chat, History, Profile)
- ✅ Collapsible sidebar (swipe from left)
- ✅ Full-screen chat interface
- ✅ Minimal header (logo + hamburger menu)

### **Tablet (768px - 1024px)**
- ✅ Permanent sidebar (collapsed by default)
- ✅ Expandable sidebar on hover
- ✅ Two-column layout (sidebar + content)

### **Desktop (>1024px)**
- ✅ Permanent expanded sidebar
- ✅ Three-column layout (sidebar + chat + info panel)
- ✅ Keyboard shortcuts enabled

---

## 🎨 **NAVIGATION DESIGN TOKENS**

### **Identia Lab Branding in Navigation**

**Colors:**
```css
--nav-bg: #FFFFFF (light mode) | #12112E (dark mode)
--nav-active: #FF51A6 (Identia Pink)
--nav-hover: rgba(255, 81, 166, 0.1)
--nav-text: #12112E (light mode) | #FFFFFF (dark mode)
--nav-border: #E5E7EB
```

**Typography:**
```css
--nav-font: 'Poppins', sans-serif
--nav-item-size: 16px (mobile) | 18px (desktop)
--nav-weight-normal: 400
--nav-weight-active: 600
```

**Spacing:**
```css
--nav-padding: 12px (mobile) | 16px (desktop)
--nav-item-gap: 8px
--nav-icon-size: 20px (mobile) | 24px (desktop)
```

---

## 🔄 **STATE PERSISTENCE ACROSS NAVIGATION**

### **What Persists:**
1. ✅ **Selected AI Model** - User's last model choice
2. ✅ **Chat Context** - Current conversation (not lost on navigation)
3. ✅ **User Preferences** - Language, theme, display settings
4. ✅ **Session Limits** - Message count, logo analysis count

### **What Resets:**
1. ❌ **Form Inputs** - Auth forms clear on navigation
2. ❌ **Temporary UI State** - Dropdown menus, modals close
3. ❌ **Error Messages** - Cleared when navigating away

---

## 🚀 **NAVIGATION PERFORMANCE OPTIMIZATION**

### **Next.js App Router Features:**
- ✅ **Automatic Prefetching** - Hovering link prefetches page
- ✅ **Instant Navigation** - Client-side transitions
- ✅ **Partial Rendering** - Only changed components re-render
- ✅ **Streaming SSR** - Progressive page loading

### **Route Caching Strategy:**
```typescript
// Static pages (cached indefinitely)
export const revalidate = false; // Landing, legal pages

// Dynamic pages (cache for 1 hour)
export const revalidate = 3600; // History, profile

// Real-time pages (no cache)
export const revalidate = 0; // Chat interface
```

---

## 📊 **NAVIGATION ANALYTICS (Future Phase 2)**

### **Metrics to Track:**
- User flow drop-off points
- Most visited pages after landing
- Time spent in chat vs other pages
- Admin panel usage frequency
- Mobile vs desktop navigation patterns

---

## ✅ **NAVIGATION IMPLEMENTATION CHECKLIST**

**Phase 1 (MVP):**
- [x] Landing page route
- [x] Complete auth flow routes
- [x] Chat interface route
- [x] History page route
- [x] Profile page route
- [x] Admin dashboard route
- [x] Admin model management route
- [x] Error pages (404, 500, 403)
- [x] API routes for chat and models
- [x] Route protection middleware
- [x] Mobile-responsive navigation
- [x] Breadcrumb context preservation

**Phase 2 (Future):**
- [ ] Advanced search in history
- [ ] Conversation export routes
- [ ] Lead management dashboard
- [ ] Analytics dashboard
- [ ] Custom model configuration UI

---

## 🎯 **NAVIGATION SUCCESS METRICS**

**User Experience Goals:**
- ✅ Users can reach chat in <3 clicks from landing
- ✅ 90% of users stay in chat interface (minimal navigation needed)
- ✅ <2 second navigation transitions (perceived performance)
- ✅ Zero navigation-related error reports
- ✅ 100% mobile navigation accessibility (touch targets >44px)

---

## 📝 **NEXT STEPS**

1. ✅ Navigation structure defined
2. ⏭️ **Next:** Create wireframes for each route (ShipKit Step 3)
3. ⏭️ **Then:** Define data schema for routes (ShipKit Step 4)

---

*This navigation structure ensures Sophia provides a seamless, intuitive experience for Colombian micro-businesses learning about Gen-AI capabilities.*
