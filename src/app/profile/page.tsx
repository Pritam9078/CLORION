"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  Shield, 
  Wallet,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Link as LinkIcon,
  Key,
  Smartphone,
  CreditCard,
  Activity,
  Zap,
  Award,
  Target,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBlockchainData, useWalletBalance } from "@/hooks/useBlockchain";
import { mockUser as baseUser } from "@/data/mockUser";

// Extended mock user data for profile page
const mockUser = {
  ...baseUser,
  id: "user_123",
  avatar: null,
  phone: "+1 (555) 123-4567",
  company: "CLORION Administration",
  location: "Global Operations",
  bio: "Platform administrator with expertise in blue carbon registry management and blockchain-based carbon credit verification.",
  joinedDate: "2024-01-15",
  verified: true,
  kycStatus: "APPROVED",
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
      trading: true,
      projects: true,
      verification: false,
      marketing: false
    },
    privacy: {
      profilePublic: true,
      showActivity: true,
      showWallet: false,
      showStats: true
    },
    trading: {
      autoApprove: false,
      maxTransactionAmount: 50000,
      preferredCurrency: "USD",
      gasSettings: "STANDARD"
    },
    ui: {
      theme: "LIGHT",
      language: "EN",
      timezone: "PST",
      dashboardLayout: "GRID"
    }
  },
  stats: {
    totalTrades: 156,
    totalVolume: 45000,
    totalValue: 1485000,
    successRate: 98.7,
    averageTradeSize: 288,
    favoriteEcosystem: "MANGROVE"
  },
  walletConnections: [
    { type: "MetaMask", address: "0x742d35Cc6634C0532925a3b8D1B1C93C7aAf3b", connected: true },
    { type: "WalletConnect", address: null, connected: false }
  ],
  securitySettings: {
    twoFactorEnabled: true,
    lastPasswordChange: "2024-08-15",
    loginAttempts: [],
    trustedDevices: 3
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company,
    location: user.location,
    bio: user.bio
  });

  // Blockchain integration with Alchemy
  const { 
    isConnected, 
    gasPrice, 
    currentBlock,
    formatAddress 
  } = useBlockchainData();
  
  const { 
    balance: ethBalance, 
    loading: balanceLoading 
  } = useWalletBalance(user.walletAddress);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "preferences", label: "Preferences", icon: Settings }
  ];

  const handleSave = () => {
    setUser({ ...user, ...formData });
    setIsEditing(false);
    // Here you would typically save to backend
    console.log("Profile updated:", formData);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        notifications: {
          ...user.preferences.notifications,
          [key]: value
        }
      }
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        privacy: {
          ...user.preferences.privacy,
          [key]: value
        }
      }
    });
  };

  const formatWalletAddress = (address: string) => {
    return showWalletAddress ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-700">
            Manage your account settings, wallet connections, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information and professional details
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="flex items-center space-x-2">
                          {isEditing ? (
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 py-2">{user.email}</p>
                          )}
                          {user.verified && (
                            <Badge variant="success">Verified</Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.company}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.location}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <div className="flex items-center space-x-2 py-2">
                          <Badge className="capitalize">{user.role.replace('_', ' ')}</Badge>
                          {user.kycStatus === "APPROVED" && (
                            <Badge variant="success">KYC Verified</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.bio}</p>
                      )}
                    </div>

                    {/* Trading Stats */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Trading Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Activity className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-blue-600">{user.stats.totalTrades}</p>
                          <p className="text-sm text-gray-600">Total Trades</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-green-600">{user.stats.totalVolume.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Credits Traded</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <Target className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-yellow-600">{user.stats.successRate}%</p>
                          <p className="text-sm text-gray-600">Success Rate</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-purple-600">${user.stats.totalValue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Total Value</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "wallet" && (
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Management</CardTitle>
                  <CardDescription>
                    Manage your cryptocurrency wallets and blockchain connections powered by Alchemy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Wallet Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Wallet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-blue-600">
                          {balanceLoading ? "..." : ethBalance ? `${parseFloat(ethBalance).toFixed(4)}` : "0.0000"}
                        </p>
                        <p className="text-sm text-gray-600">ETH Balance</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <LinkIcon className={`w-8 h-8 mx-auto mb-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
                        <p className={`text-lg font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                          {isConnected ? "Connected" : "Disconnected"}
                        </p>
                        <p className="text-sm text-gray-600">Network Status</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-orange-600">
                          {gasPrice ? `${parseFloat(gasPrice).toFixed(6)}` : "..."}
                        </p>
                        <p className="text-sm text-gray-600">Gas Price (ETH)</p>
                      </div>
                    </div>

                    {/* Wallet Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Wallet Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={formatWalletAddress(user.walletAddress)}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setShowWalletAddress(!showWalletAddress)}
                        >
                          {showWalletAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline">
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Wallet Connections */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Connected Wallets</h4>
                      <div className="space-y-3">
                        {user.walletConnections.map((wallet, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Wallet className="w-5 h-5 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">{wallet.type}</p>
                                <p className="text-sm text-gray-500">
                                  {wallet.address ? formatWalletAddress(wallet.address) : "Not connected"}
                                </p>
                              </div>
                            </div>
                            <Badge variant={wallet.connected ? "success" : "secondary"}>
                              {wallet.connected ? "Connected" : "Disconnected"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Blockchain Network Info */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Network Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Network</span>
                          <span className="font-medium text-gray-900">Ethereum Sepolia Testnet</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Block</span>
                          <span className="font-medium text-gray-900">
                            {currentBlock ? `#${currentBlock.number?.toString()}` : "Loading..."}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chain ID</span>
                          <span className="font-medium text-gray-900">11155111</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how and when you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Notification Methods */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Methods</h4>
                      <div className="space-y-4">
                        {Object.entries(user.preferences.notifications).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {key === "email" && <Mail className="w-5 h-5 text-gray-600" />}
                              {key === "push" && <Bell className="w-5 h-5 text-gray-600" />}
                              {key === "sms" && <Smartphone className="w-5 h-5 text-gray-600" />}
                              <div>
                                <p className="font-medium text-gray-900 capitalize">{key} Notifications</p>
                                <p className="text-sm text-gray-500">
                                  {key === "email" && "Receive notifications via email"}
                                  {key === "push" && "Browser and app push notifications"}
                                  {key === "sms" && "Text message notifications"}
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleNotificationChange(key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification Types */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h4>
                      <div className="space-y-4">
                        {Object.entries(user.preferences.notifications).slice(3).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 capitalize">{key} Updates</p>
                              <p className="text-sm text-gray-500">
                                {key === "trading" && "Trading activity and market updates"}
                                {key === "projects" && "Project status and verification updates"}
                                {key === "verification" && "MRV system notifications"}
                                {key === "marketing" && "Product updates and promotional content"}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleNotificationChange(key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">
                            {user.securitySettings.twoFactorEnabled ? "Enabled via authenticator app" : "Not enabled"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.securitySettings.twoFactorEnabled ? "success" : "secondary"}>
                          {user.securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {user.securitySettings.twoFactorEnabled ? "Manage" : "Enable"}
                        </Button>
                      </div>
                    </div>

                    {/* Password Settings */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Password</p>
                          <p className="text-sm text-gray-500">
                            Last changed on {new Date(user.securitySettings.lastPasswordChange).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>

                    {/* Trusted Devices */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Trusted Devices</h4>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Active Devices</p>
                            <p className="text-sm text-gray-500">
                              {user.securitySettings.trustedDevices} trusted devices
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage Devices
                        </Button>
                      </div>
                    </div>

                    {/* Session Management */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Session Management</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Lock className="w-4 h-4 mr-2" />
                          Sign out all other sessions
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Activity className="w-4 h-4 mr-2" />
                          View login activity
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(user.preferences.privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {key === "profilePublic" && "Public Profile"}
                            {key === "showActivity" && "Show Trading Activity"}
                            {key === "showWallet" && "Show Wallet Address"}
                            {key === "showStats" && "Show Trading Statistics"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === "profilePublic" && "Allow others to view your basic profile information"}
                            {key === "showActivity" && "Display your recent trading activity to other users"}
                            {key === "showWallet" && "Make your wallet address visible on your profile"}
                            {key === "showStats" && "Share your trading performance statistics"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "preferences" && (
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>
                    Customize your app experience and trading settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* UI Preferences */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Interface</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Theme
                          </label>
                          <select 
                            value={user.preferences.ui.theme}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="LIGHT">Light</option>
                            <option value="DARK">Dark</option>
                            <option value="AUTO">Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select 
                            value={user.preferences.ui.language}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="EN">English</option>
                            <option value="ES">Spanish</option>
                            <option value="FR">French</option>
                            <option value="DE">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                          </label>
                          <select 
                            value={user.preferences.ui.timezone}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="PST">Pacific (PST)</option>
                            <option value="EST">Eastern (EST)</option>
                            <option value="UTC">UTC</option>
                            <option value="CET">Central European (CET)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dashboard Layout
                          </label>
                          <select 
                            value={user.preferences.ui.dashboardLayout}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="GRID">Grid</option>
                            <option value="LIST">List</option>
                            <option value="COMPACT">Compact</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Trading Preferences */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Trading</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Currency
                          </label>
                          <select 
                            value={user.preferences.trading.preferredCurrency}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="ETH">ETH</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gas Settings
                          </label>
                          <select 
                            value={user.preferences.trading.gasSettings}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="SLOW">Slow (Lower fees)</option>
                            <option value="STANDARD">Standard</option>
                            <option value="FAST">Fast (Higher fees)</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Transaction Amount ($)
                          </label>
                          <input
                            type="number"
                            value={user.preferences.trading.maxTransactionAmount}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
