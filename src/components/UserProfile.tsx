
import React from 'react';
import { User, Calendar, Award, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UserData {
  id: number;
  name: string;
  email: string;
  codeforcesHandle: string;
  avatar: string;
  joinDate: string;
  achievements: string[];
  preferences: {
    theme: string;
    dashboard: string[];
  };
}

interface UserProfileProps {
  user: UserData;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 border animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-primary/20"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            {user.codeforcesHandle && (
              <Badge variant="secondary" className="mt-1">
                CF: {user.codeforcesHandle}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Member since {formatDate(user.joinDate)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="font-medium">{user.achievements.length} Achievements</span>
          </div>
        </div>
      </div>

      {user.achievements.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Recent Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {user.achievements.slice(0, 3).map((achievement, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {achievement}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
