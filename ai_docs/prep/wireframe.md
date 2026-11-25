## Wireframe Reference Doc

### ASCII / Markdown Mock-ups

```text
Main App Dashboard (Chat Interface) `/chat`
+----------------------------------------------------------+
| Sidebar         |  Chat Interface                        |
|-----------------|----------------------------------------|
| • Chat          |  [Model Selector Dropdown]             |
| • History       |  +----------------------------------+   |
| • Profile       |  | AI: [streaming response...]     |   |
|                 |  +----------------------------------+   |
|                 |  +----------------------------------+   |
|                 |  | User: [message with attachments]|   |
|                 |  +----------------------------------+   |
|                 |                                        |
|                 |  [Message Input Area]                 |
|                 |  [Attach Images/Docs] [Send Button]   |
|                 |                                        |
|                 |  [Usage Indicator: Tier Limits]       |
+-----------------+----------------------------------------+

Landing Page `/`
+---------------------------------------------+
|  [Hero: "One Chat Interface, Every AI Model"] |
|  [Live Model Switching Demo]                   |
|---------------------------------------------|
|  [Problem: "Stop wasting 2-4 hours weekly"]   |
|---------------------------------------------|
|  [Feature Showcase: Seamless switching]       |
|---------------------------------------------|
|  [Pricing Tiers: Free/Pro/Premium]           |
|  [CTA: "Start Chatting Free"]                |
+---------------------------------------------+

History Page `/history`
+----------------------------------------------------------+
| Sidebar         |  Conversation History                  |
|-----------------|----------------------------------------|
| • Chat          |  [Search & Filter Bar]                |
| • History       |  +----------------------------------+   |
| • Profile       |  | Conv 1 [GPT-4] "How to..."      |   |
|                 |  | Conv 2 [Claude] "Analyze..."     |   |
|                 |  | Conv 3 [Gemini] "Create..."      |   |
|                 |  +----------------------------------+   |
|                 |  [Export Options] [Restore Chat]      |
+-----------------+----------------------------------------+

Profile Page `/profile`
+----------------------------------------------------------+
| Sidebar         |  Profile & Account Management          |
|-----------------|----------------------------------------|
| • Chat          |  [Account Settings]                    |
| • History       |  [Name, Email, Preferences]           |
| • Profile       |                                        |
|                 |  [Subscription Management]             |
|                 |  [Current Tier: Pro]                  |
|                 |  [Usage Analytics & Limits]           |
|                 |                                        |
|                 |  [Billing History]                     |
|                 |  [Payment Methods]                     |
+-----------------+----------------------------------------+

Login Page `/auth/login`
+---------------------------------------------+
|             [App Logo]                      |
|---------------------------------------------|
|  [Email Input Field]                        |
|  [Password Input Field]                     |
|  [Login Button]                             |
|---------------------------------------------|
|  [OAuth: Login with Google/GitHub]          |
|  [Forgot Password Link]                     |
|  [Sign Up Link]                             |
+---------------------------------------------+

Sign Up Page `/auth/sign-up`
+---------------------------------------------+
|             [App Logo]                      |
|---------------------------------------------|
|  [Name Input Field]                         |
|  [Email Input Field]                        |
|  [Password Input Field]                     |
|  [Confirm Password Field]                   |
|  [Sign Up Button]                           |
|---------------------------------------------|
|  [OAuth: Sign up with Google/GitHub]        |
|  [Login Link]                               |
+---------------------------------------------+
```

### Navigation Flow Map

```
Landing → Sign Up → /chat ||
           ↘︎ Login → /chat

/chat → History → Specific Conversation → Back to /chat
      → Profile → Billing Management
                → Account Settings
      → Model Switch (within chat)

/chat/[[...conversationId]] → Continue with any model
                            → Back to History
                            → Back to /chat

Auth Flow:
/auth/login → /chat
/auth/sign-up → /auth/sign-up-success → /chat
/auth/forgot-password → /auth/update-password → /chat

Legal Pages:
Landing → /privacy || /terms || /cookies (footer links)

API Routes (backend):
/chat → /api/chat → Model APIs (OpenAI, Anthropic, Google)
/profile → /api/webhooks/stripe → Subscription management
```
