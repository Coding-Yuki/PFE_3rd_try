'use client';

import Link from 'next/link';

interface User {
  id: number;
  name: string;
  major: string;
  studentId: string;
  createdAt: string;
}

interface ClassmatesClientProps {
  users: User[];
  currentUserId?: number;
}

export default function ClassmatesClient({ users, currentUserId }: ClassmatesClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="max-w-2xl mx-auto border-x border-gray-200">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">Camarades</h1>
        <p className="text-sm text-gray-500 mt-1">{users.length} étudiants inscrits</p>
      </div>

      {/* Users List */}
      <div className="p-4">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun camarade trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.major}</p>
                        <p className="text-xs text-gray-400">ID: {user.studentId}</p>
                      </div>
                      
                      <Link
                        href={`/profile/${user.id}`}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Voir profil
                      </Link>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Inscrit le {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
