'use client';

import { useState, useEffect } from 'react';
import { Users, Bell } from 'lucide-react';

interface User {
  id: number;
  name: string;
  major: string;
  studentId: string;
  avatarUrl?: string;
}

export default function RightPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          
          // Initialize following states
          const initialStates: { [key: number]: boolean } = {};
          data.forEach((user: User) => {
            initialStates[user.id] = false;
          });
          setFollowingStates(initialStates);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const { following } = await response.json();
        setFollowingStates(prev => ({
          ...prev,
          [userId]: following,
        }));
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const getAvatarUrl = (user: User) => {
    if (user.avatarUrl) {
      return user.avatarUrl;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* ABOUT WIDGET */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-indigo-100 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          À propos d'UniSocial
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Bienvenue sur le réseau social de votre université ! Connectez-vous avec vos camarades, partagez des idées et restez informé de la vie étudiante.
        </p>
        <button className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contacter l'administration
        </button>
      </div>

      {/* Who to Follow */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Suggestions</h3>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-xs text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={getAvatarUrl(user)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.major}</p>
                </div>
                <button 
                  onClick={() => handleFollow(user.id)}
                  className={`${
                    followingStates[user.id] 
                      ? 'bg-gray-500 hover:bg-gray-600' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0`}
                >
                  {followingStates[user.id] ? 'Abonné' : 'Suivre'}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Aucune suggestion pour le moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <span className="text-xs text-gray-500">Voir tout</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-xl">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              !
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nouveau message</p>
              <p className="text-xs text-gray-500">Il y a 2 minutes</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              📚
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nouveau cours publié</p>
              <p className="text-xs text-gray-500">Physique Quantique</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
