"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  Bell, 
  Lock, 
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  Activity,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Inline Label component
const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  >
    {children}
  </label>
);

// Inline Switch component
interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch = ({ checked = false, onCheckedChange, disabled = false, className }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      checked 
        ? "bg-blue-600 dark:bg-blue-500" 
        : "bg-gray-200 dark:bg-gray-700",
      className
    )}
    onClick={() => onCheckedChange?.(!checked)}
  >
    <span
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

interface ProfileDropdownProps {
  isDarkMode: boolean;
  className?: string;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  department: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  activityAlerts: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileDropdown({ isDarkMode, className }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'security' | 'notifications' | 'activity'>('overview');
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    department: ''
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    pushNotifications: true,
    activityAlerts: true
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        bio: (user as any).bio || '',
        department: (user as any).department || ''
      });
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to update profile. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage({ type: 'error', message: 'New passwords do not match.' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage({ type: 'success', message: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to change password. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage({ type: 'success', message: 'Security settings updated!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to update security settings.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const recentActivity = [
    { action: 'Logged in', time: '2 hours ago', ip: '192.168.1.1' },
    { action: 'Updated project verification', time: '4 hours ago', ip: '192.168.1.1' },
    { action: 'Changed password', time: '2 days ago', ip: '192.168.1.2' },
    { action: 'Enabled 2FA', time: '1 week ago', ip: '192.168.1.1' },
  ];

  const ProfileAvatar = () => (
    <div className="relative group">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-200",
        isDarkMode 
          ? "bg-gray-700 border-gray-600 hover:border-blue-400" 
          : "bg-gray-100 border-gray-300 hover:border-blue-500"
      )}>
        <User className={cn("w-5 h-5", 
          isDarkMode ? "text-blue-400" : "text-blue-600"
        )} />
      </div>
      <Badge className={cn("absolute -bottom-1 -right-1 text-xs px-1 py-0 h-5",
        isDarkMode ? "bg-blue-900 text-blue-300 border-gray-700" : "bg-blue-100 text-blue-800 border-white"
      )}>
        <Shield className="w-2 h-2 mr-0.5" />
        {user?.role || "Admin"}
      </Badge>
    </div>
  );

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Profile Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("h-auto p-2 space-x-2",
          isDarkMode 
            ? "hover:bg-gray-700 text-gray-300 hover:text-white" 
            : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        )}
      >
        <ProfileAvatar />
        <div className="hidden sm:block text-left">
          <p className={cn("text-sm font-medium", 
            isDarkMode ? "text-white" : "text-gray-900"
          )}>{user?.name || "Admin User"}</p>
          <p className={cn("text-xs", 
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>{user?.email || "admin@clorit.com"}</p>
        </div>
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn("absolute right-0 mt-2 rounded-xl shadow-xl border z-50",
              "w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-4rem)] overflow-hidden",
              isDarkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            )}
          >
            {/* Tabs */}
            <div className={cn("flex border-b overflow-x-auto",
              isDarkMode ? "border-gray-700" : "border-gray-200"
            )}>
              {[
                { id: 'overview', label: 'Profile', icon: User },
                { id: 'edit', label: 'Edit', icon: Settings },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'activity', label: 'Activity', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn("flex items-center justify-center space-x-1 py-3 px-3 text-xs font-medium transition-colors whitespace-nowrap min-w-0 flex-1",
                    activeTab === tab.id
                      ? isDarkMode 
                        ? "text-blue-400 border-b-2 border-blue-400 bg-gray-700/50" 
                        : "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : isDarkMode 
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <tab.icon className="w-3 h-3 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("mb-4 p-3 rounded-lg flex items-center space-x-2",
                    saveMessage.type === 'success' 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-red-100 text-red-800 border border-red-200"
                  )}
                >
                  {saveMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span className="text-sm">{saveMessage.message}</span>
                </motion.div>
              )}

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={cn("w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center",
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    )}>
                      <User className={cn("w-10 h-10", 
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      )} />
                    </div>
                    <h3 className={cn("font-semibold", 
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>{user?.name || "Admin User"}</h3>
                    <p className={cn("text-sm", 
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>{user?.email || "admin@clorit.com"}</p>
                    <Badge className={cn("mt-2",
                      isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800"
                    )}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user?.role || "Admin"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>Department</span>
                      <span className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                        {profileForm.department || "Administration"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>Phone</span>
                      <span className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                        {profileForm.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>2FA Status</span>
                      <Badge className={cn(
                        securitySettings.twoFactorEnabled 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      )}>
                        {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={logout}
                    variant="outline"
                    size="sm" 
                    className={cn("w-full justify-center space-x-2",
                      isDarkMode 
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" 
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              )}

              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Full Name
                      </Label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className={cn("mt-1", isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      />
                    </div>
                    <div>
                      <Label className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className={cn("mt-1", isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Phone
                      </Label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className={cn("mt-1", isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      />
                    </div>
                    <div>
                      <Label className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Department
                      </Label>
                      <Input
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                        className={cn("mt-1", isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                      Bio
                    </Label>
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      className={cn("mt-1 resize-none", isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  {/* Change Password */}
                  <div className="space-y-3">
                    <h4 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      Change Password
                    </h4>
                    
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className={cn(isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      >
                        {showPasswords.current ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>

                    <div className="relative">
                      <Input
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="New password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className={cn(isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      >
                        {showPasswords.new ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>

                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className={cn(isDarkMode ? "bg-gray-700 border-gray-600" : "")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>

                    <Button 
                      onClick={handleChangePassword}
                      disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Change Password
                    </Button>
                  </div>

                  {/* Security Settings */}
                  <div className={cn("pt-4 border-t space-y-3",
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  )}>
                    <h4 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      Security Settings
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                            Two-Factor Authentication
                          </p>
                          <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                            Add an extra layer of security
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorEnabled: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                            Email Notifications
                          </p>
                          <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                            Receive security alerts via email
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.emailNotifications}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, emailNotifications: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                            Activity Alerts
                          </p>
                          <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                            Get notified of suspicious activity
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.activityAlerts}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, activityAlerts: checked})}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSecuritySave}
                      disabled={isLoading}
                      className="w-full mt-4"
                    >
                      Save Security Settings
                    </Button>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <h4 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    Recent Activity
                  </h4>
                  
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={index}
                        className={cn("p-3 rounded-lg border",
                          isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                              {activity.action}
                            </p>
                            <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                              {activity.time} • IP: {activity.ip}
                            </p>
                          </div>
                          <Activity className={cn("w-4 h-4", isDarkMode ? "text-blue-400" : "text-blue-600")} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {/* Handle view all activity */}}
                  >
                    View All Activity
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
