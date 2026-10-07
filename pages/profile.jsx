import Profile from "@/components/MenuProfile/MenuProfileSettings";

export default function ProfilePage() {
  
    return    
         {isProfileOpen && (
            <Profile
                user={user}
                userLoading={userLoading}
                userError={userError}
                onClose={() => setIsProfileOpen(false)}
            />
          )}
}