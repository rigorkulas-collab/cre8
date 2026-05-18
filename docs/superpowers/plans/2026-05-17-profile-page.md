# Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern, responsive, zero-redundancy profile management page (`/profile`) allowing users to edit account details, configure notification preferences, simulate guest mode, and log out.

**Architecture:** A unified state container at `app/profile/page.tsx` manages mock user data and passes callbacks down to highly modular presentation components (`ProfileHeader`, `UserInformationCard`, `PreferencesCard`, `SupportSection`, `LogoutDialog`). The bottom navigation bar (`BottomNavbar.tsx`) is updated to link directly to `/profile`.

**Tech Stack:** Next.js 15 Client Components (`"use client"`), Radix UI (`@radix-ui/react-switch`, `@radix-ui/react-dialog`, `@radix-ui/react-label`), Lucide React icons, Tailwind CSS.

---

### Task 1: Install Radix Switch & Label Primitives

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install dependencies**
```bash
npm install @radix-ui/react-switch @radix-ui/react-label
```

### Task 2: Create UI Primitives (`switch.tsx` & `label.tsx`)

**Files:**
- Create: `components/ui/switch.tsx`
- Create: `components/ui/label.tsx`

- [ ] **Step 1: Create `components/ui/switch.tsx`**
```tsx
"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-200 ${className || ""}`}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
```

- [ ] **Step 2: Create `components/ui/label.tsx`**
```tsx
"use client";

import * as React from "react";
import * as LabelPrimitives from "@radix-ui/react-label";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitives.Root
    ref={ref}
    className={`text-sm font-semibold leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
    {...props}
  />
));
Label.displayName = LabelPrimitives.Root.displayName;

export { Label };
```

### Task 3: Create `ProfileHeader.tsx`

**Files:**
- Create: `components/profile/ProfileHeader.tsx`

- [ ] **Step 1: Create `components/profile/ProfileHeader.tsx`**
```tsx
"use client";

import * as React from "react";
import { Camera, ShieldCheck, User } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl: string;
  onUpdateAvatar: () => void;
}

export default function ProfileHeader({ name, email, avatarUrl, onUpdateAvatar }: ProfileHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D1BFA7]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      {/* Avatar Container */}
      <div className="relative group shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 overflow-hidden bg-gray-800 flex items-center justify-center text-gray-400 relative z-10 shadow-inner">
          <User className="w-12 h-12" />
        </div>
        <button
          type="button"
          onClick={onUpdateAvatar}
          className="absolute bottom-0 right-0 z-20 bg-white text-gray-900 rounded-full p-2.5 shadow-lg border border-border hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
          title="Change Avatar"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* User Information */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 flex-1 z-10 pt-1 sm:pt-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{name}</h1>
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" title="Verified Member" />
        </div>
        <p className="text-sm text-gray-300 font-medium">{email}</p>
        <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 text-[#D1BFA7] border border-white/10">
          VIP Member • Since May 2026
        </span>
      </div>

      <div className="z-10 w-full sm:w-auto pt-2 sm:pt-4">
        <Button
          variant="outline"
          onClick={onUpdateAvatar}
          className="w-full sm:w-auto h-11 px-5 rounded-xl font-bold bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
```

### Task 4: Create `UserInformationCard.tsx`

**Files:**
- Create: `components/profile/UserInformationCard.tsx`

- [ ] **Step 1: Create `components/profile/UserInformationCard.tsx`**
```tsx
"use client";

import * as React from "react";
import { CheckCircle2, UserCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface UserInformationCardProps {
  userInfo: UserInfo;
  onSaveInfo: (newInfo: UserInfo) => void;
}

export default function UserInformationCard({ userInfo, onSaveInfo }: UserInformationCardProps) {
  const [form, setForm] = React.useState<UserInfo>(userInfo);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInfo(form);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="p-6 sm:p-8 flex flex-col gap-6 rounded-3xl border border-border bg-white shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <UserCheck className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-black text-gray-900 tracking-tight">Personal Details</h2>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile details saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Full Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Email Address</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Phone Number</label>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">Residential Address (Optional)</label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. BGC Taguig, Metro Manila"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="h-12 px-8 rounded-xl font-bold bg-gray-900 hover:bg-black text-white shadow-md">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

### Task 5: Create `PreferencesCard.tsx`

**Files:**
- Create: `components/profile/PreferencesCard.tsx`

- [ ] **Step 1: Create `components/profile/PreferencesCard.tsx`**
```tsx
"use client";

import * as React from "react";
import { Bell, Lock, Mail, MessageSquare, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Preferences {
  emailNotif: boolean;
  smsReminders: boolean;
  appUpdates: boolean;
  promos: boolean;
}

interface PreferencesCardProps {
  preferences: Preferences;
  onTogglePreference: (key: keyof Preferences) => void;
}

export default function PreferencesCard({ preferences, onTogglePreference }: PreferencesCardProps) {
  return (
    <Card className="p-6 sm:p-8 flex flex-col gap-6 rounded-3xl border border-border bg-white shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Bell className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-black text-gray-900 tracking-tight">Notification & Account Settings</h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 p-2">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 border border-gray-100 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="pref-email" className="text-sm font-bold text-gray-900 cursor-pointer">Email Notifications</Label>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Receive booking confirmations, calendar invites, and digital receipts.</p>
            </div>
          </div>
          <Switch
            id="pref-email"
            checked={preferences.emailNotif}
            onCheckedChange={() => onTogglePreference("emailNotif")}
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-2">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 border border-gray-100 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="pref-sms" className="text-sm font-bold text-gray-900 cursor-pointer">SMS Reminders</Label>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Get timely text reminders 2 hours prior to your scheduled appointments.</p>
            </div>
          </div>
          <Switch
            id="pref-sms"
            checked={preferences.smsReminders}
            onCheckedChange={() => onTogglePreference("smsReminders")}
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-2">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 border border-gray-100 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="pref-promos" className="text-sm font-bold text-gray-900 cursor-pointer">Promotional Offers & VIP Perks</Label>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Receive exclusive member-only salon packages and seasonal discounts.</p>
            </div>
          </div>
          <Switch
            id="pref-promos"
            checked={preferences.promos}
            onCheckedChange={() => onTogglePreference("promos")}
          />
        </div>
      </div>
    </Card>
  );
}
```

### Task 6: Create Support & Logout Components

**Files:**
- Create: `components/profile/SupportSection.tsx`
- Create: `components/profile/LogoutDialog.tsx`

- [ ] **Step 1: Create `components/profile/SupportSection.tsx`**
```tsx
"use client";

import * as React from "react";
import { ChevronRight, HelpCircle, FileText, Info, PhoneCall } from "lucide-react";
import Card from "@/components/ui/Card";

const ITEMS = [
  { icon: HelpCircle, title: "Help Center & FAQs", description: "Answers to common salon booking and rescheduling questions" },
  { icon: PhoneCall, title: "Contact Concierge Support", description: "Direct hotline and WhatsApp support with our flagship studio" },
  { icon: Info, title: "About CRE8 App", description: "Version 1.0.0 (High-Fidelity Production Build)" },
  { icon: FileText, title: "Terms of Service & Privacy", description: "Data protection and cancellation policies" },
];

export default function SupportSection() {
  return (
    <Card className="p-6 sm:p-8 flex flex-col gap-6 rounded-3xl border border-border bg-white shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <HelpCircle className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-black text-gray-900 tracking-tight">Support & Legal</h2>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => alert(`Redirecting to ${item.title}...`)}
              className="py-4 flex items-center justify-between text-left group hover:px-2 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-gray-900">{item.title}</span>
                  <span className="text-xs text-gray-500 font-medium">{item.description}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Create `components/profile/LogoutDialog.tsx`**
```tsx
"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";

interface LogoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLogout: () => void;
}

export default function LogoutDialog({ isOpen, onOpenChange, onConfirmLogout }: LogoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8 flex flex-col items-center text-center gap-6 border-border rounded-3xl">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center shadow-inner">
          <LogOut className="w-8 h-8" />
        </div>

        <DialogHeader className="flex flex-col items-center gap-1.5">
          <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
            Log Out of Account
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
            Are you sure you want to disconnect? You will be returned to guest browsing mode.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col gap-3 pt-2">
          <Button
            onClick={onConfirmLogout}
            className="w-full h-12 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg"
          >
            Yes, Log Me Out
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full h-11 rounded-xl text-gray-600 hover:text-gray-900 border-border"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Task 7: Create `/profile` Page Container & Link Navigation

**Files:**
- Create: `app/profile/page.tsx`
- Modify: `components/dashboard/BottomNavbar.tsx`

- [ ] **Step 1: Create `app/profile/page.tsx`**
```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BottomNavbar from "@/components/dashboard/BottomNavbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserInformationCard from "@/components/profile/UserInformationCard";
import PreferencesCard from "@/components/profile/PreferencesCard";
import SupportSection from "@/components/profile/SupportSection";
import LogoutDialog from "@/components/profile/LogoutDialog";

export default function ProfilePage() {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);
  const [avatarToast, setAvatarToast] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Zachary Crest",
    email: "zachary@cre8salon.ph",
    phone: "+63 917 888 1234",
    address: "BGC Taguig, Metro Manila",
  });

  const [preferences, setPreferences] = useState({
    emailNotif: true,
    smsReminders: true,
    appUpdates: true,
    promos: false,
  });

  const handleUpdateAvatar = () => {
    setAvatarToast(true);
    setTimeout(() => setAvatarToast(false), 3000);
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setIsGuest(true);
  };

  return (
    <div className="min-h-screen bg-white pb-32 flex flex-col antialiased selection:bg-gray-900 selection:text-white">
      {/* Toast Notification */}
      {avatarToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-bounce">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Profile avatar simulated update successful!</span>
        </div>
      )}

      {/* Top Banner Toggle for Simulation */}
      <div className="bg-gray-50 border-b border-border py-3 px-6 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-600">Simulating View Mode:</span>
        <button
          type="button"
          onClick={() => setIsGuest(!isGuest)}
          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
            isGuest ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {isGuest ? "Guest Mode (Unauthenticated)" : "Client Mode (Authenticated)"}
        </button>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <SectionHeader
          title="Account Profile"
          subtitle="View and manage your personal information and notification preferences"
        />

        {isGuest ? (
          <Card className="p-8 sm:p-12 flex flex-col items-center text-center gap-6 rounded-3xl border border-border bg-white shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-inner">
              <UserCheck className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-1.5 max-w-md">
              <h2 className="text-2xl font-black text-gray-900">Sign in to manage your profile</h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Unlock full access to your booking history, customized appointment reminders, and VIP member perks.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="h-12 px-10 rounded-xl font-bold bg-gray-900 hover:bg-black text-white shadow-md"
            >
              Sign In / Register
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col gap-8">
            <ProfileHeader
              name={userInfo.name}
              email={userInfo.email}
              avatarUrl="/avatar-placeholder.png"
              onUpdateAvatar={handleUpdateAvatar}
            />

            <UserInformationCard
              userInfo={userInfo}
              onSaveInfo={setUserInfo}
            />

            <PreferencesCard
              preferences={preferences}
              onTogglePreference={handleTogglePreference}
            />

            <SupportSection />

            {/* Logout Action Card */}
            <Card className="p-6 rounded-3xl border border-red-100 bg-red-50/50 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-red-900">Disconnect Account</span>
                <span className="text-xs text-red-700 font-medium">Log out of this device and return to guest browsing</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(true)}
                className="h-11 px-6 rounded-xl font-bold border-red-200 hover:bg-red-100 text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </Button>
            </Card>
          </div>
        )}
      </main>

      <LogoutDialog
        isOpen={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirmLogout={handleConfirmLogout}
      />

      <BottomNavbar activeTab="profile" />
    </div>
  );
}
```

- [ ] **Step 2: Connect Navigation in `components/dashboard/BottomNavbar.tsx`**
```tsx
// Replace the Profile button onClick handler to route to "/profile"
<button
  type="button"
  onClick={() => handleNavigation("/profile", "profile")}
  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
    activeTab === "profile"
      ? "text-gray-900 scale-110 font-bold"
      : "text-gray-400 hover:text-gray-600 font-medium"
  }`}
>
```

---
