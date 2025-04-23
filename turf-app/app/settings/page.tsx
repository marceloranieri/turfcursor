import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | Turf',
  description: 'Manage your Turf application settings',
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4">
              {/* Settings options will be added here */}
              <p className="text-gray-500 text-sm">Account settings coming soon...</p>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {/* Notification options will be added here */}
              <p className="text-gray-500 text-sm">Notification settings coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 