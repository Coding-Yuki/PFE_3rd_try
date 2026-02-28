'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Calendar, Mail, BookOpen } from 'lucide-react';

interface ProfileProps {
  profile: {
    id: number;
    name: string;
    email: string;
    studentId: string;
    major: string;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
    posts: Array<{
      id: number;
      content: string;
      createdAt: string;
      likes: { userId: number }[];
      comments: { id: number }[];
    }>;
  };
  isOwnProfile: boolean;
}

export default function ProfileClient({ profile, isOwnProfile }: ProfileProps) {
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="max-w-4xl">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            <p className="text-lg text-blue-700 mb-4">{profile.major}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Student ID: {profile.studentId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>
            </div>
            
            {profile.bio && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-700">{profile.posts.length}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-700">
            {profile.posts.reduce((acc, post) => acc + post.likes.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Likes</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-700">
            {profile.posts.reduce((acc, post) => acc + post.comments.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isOwnProfile ? 'Your Posts' : `${profile.name}'s Posts`}
        </h2>
        
        {profile.posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">
              {isOwnProfile ? "You haven't posted anything yet." : `${profile.name} hasn't posted anything yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {profile.posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{formatDateTime(post.createdAt)}</p>
                  </div>
                </div>

                <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>

                <div className="flex items-center space-x-6 border-t pt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm">{post.likes.length}</span>
                  </div>
                  
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.comments.length}</span>
                  </button>
                </div>

                {showComments[post.id] && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-gray-500">Comments feature coming soon...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
