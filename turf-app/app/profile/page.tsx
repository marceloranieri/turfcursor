import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Turf',
  description: 'Manage your Turf profile and preferences',
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <p className="mt-1 text-sm text-gray-500">Update your personal details and profile settings.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Profile form will be added here */}
              <p className="text-gray-500 text-sm">Profile settings coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 