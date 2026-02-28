'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';
import type { OurFileRouter } from '@/lib/uploadthing/core';

interface Post {
  id: number;
  content: string;
  fileUrl: string | null;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    major: string;
    studentId: string;
    avatarUrl?: string;
  };
  likes: { userId: number }[];
  comments: { id: number }[];
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    major: string;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');
      const searchUrl = query ? `/api/posts?q=${encodeURIComponent(query)}` : '/api/posts';
      
      const response = await fetch(searchUrl);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (postId: number) => {
  try {
    const response = await fetch(`/api/posts/${postId}/comments`);
    if (response.ok) {
      const data = await response.json();
      console.log(`Fetched comments for post ${postId}:`, data); // DEBUG LOG
      setComments(prev => ({ ...prev, [postId]: data }));
    } else {
      console.error("Failed to fetch comments");
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUserId(user.id);
        setCurrentUserName(user.name);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      setIsPosting(true);
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: newPostContent,
          fileUrl: fileUrl || null
        }),
      });

      if (response.ok) {
        setNewPostContent('');
        setFileUrl(null);
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!currentUserId) return;
    
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const { liked, count } = await response.json();
        
        // Optimistically update UI
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: liked 
                ? [...post.likes, { userId: currentUserId }] 
                : post.likes.filter(like => like.userId !== currentUserId)
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (postId: number) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, content }),
      });

      if (response.ok) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        setShowComments(prev => ({ ...prev, [postId]: true }));
        await fetchComments(postId);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const toggleComments = async (postId: number) => {
    const shouldShow = !showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: shouldShow }));
    
    if (shouldShow && !comments[postId]) {
      await fetchComments(postId);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  return (
    <div className="space-y-8">
      {/* POST CREATION CARD */}
      <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex space-x-6">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName || 'User')}`}
              alt="Current User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Partagez vos pensées avec la communauté..."
              className="w-full p-5 bg-gray-50/50 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500 text-base leading-relaxed shadow-sm hover:shadow-md"
              rows={4}
              disabled={isPosting}
            />
            
            {/* FILE UPLOAD SECTION */}
            <div className="mt-4">
              <UploadDropzone
                endpoint="postFile"
                onClientUploadComplete={(res) => {
                  setIsUploading(false);
                  if (res && res[0]) {
                    setFileUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false);
                  console.error('Upload error:', error);
                  alert(`Upload failed: ${error.message}`);
                  setFileUrl(null);
                }}
                onUploadBegin={() => setIsUploading(true)}
                config={{
                  mode: "auto",
                }}
                className="ut-label:text-xs ut-label:text-gray-500 ut-button:bg-indigo-50 ut-button:text-indigo-600 ut-button:border-0 ut-button:rounded-xl ut-button:hover:bg-indigo-100 ut-allowed-content:text-xs ut-allowed-content:text-gray-400"
              />
              
              {/* Show upload status */}
              {isUploading && (
                <div className="mt-2 text-sm text-indigo-600 font-medium animate-pulse">
                  Uploading file...
                </div>
              )}
              
              {/* Show uploaded file info */}
              {fileUrl && !isUploading && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  ✓ File uploaded successfully
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">{newPostContent.length}/500</span>
              </div>
              <button
                onClick={handlePost}
                disabled={!newPostContent.trim() || isPosting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isPosting ? <span>Publication...</span> : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Publier</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-6 text-gray-500 font-medium">Chargement du fil d'actualité...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-3">C'est bien vide ici !</p>
            <p className="text-gray-500">Soyez le premier à publier quelque chose.</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              
              {/* POST HEADER */}
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(post.author.name)}`}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl hover:text-indigo-600 cursor-pointer transition-colors">
                          {post.author.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{post.author.major}</p>
                      </div>
                      <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* POST CONTENT */}
                <div className="mt-6">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">{post.content}</p>
                  
                  {/* FILE DISPLAY */}
                  {post.fileUrl && (
                    <div className="mt-4">
                      {post.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <div className="relative group">
                          <img 
                            src={post.fileUrl} 
                            alt="Post attachment" 
                            className="w-full max-h-96 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                            onClick={() => post.fileUrl && window.open(post.fileUrl, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {post.fileUrl.split('/').pop() || 'Document'}
                              </p>
                              <p className="text-xs text-gray-500">Click to view document</p>
                            </div>
                            <div className="flex-shrink-0">
                              <a
                                href={post.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                              >
                                Open
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 border-t border-gray-100 flex items-center justify-between">
                <div className="flex space-x-8">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-3 text-gray-500 hover:text-red-500 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                      <Heart className={`h-5 w-5 ${post.likes.some(like => like.userId === currentUserId) ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500'}`} />
                    </div>
                    <span className="text-sm font-semibold">{post.likes.length}</span>
                  </button>
                  
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-3 text-gray-500 hover:text-indigo-600 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                      <MessageCircle className="h-5 w-5 group-hover:fill-indigo-100" />
                    </div>
                    <span className="text-sm font-semibold">{post.comments?.length || 0}</span>
                  </button>
                  
                </div>
              </div>

              {/* COMMENT SECTION */}
              {showComments[post.id] && (
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50/20 p-8 border-t border-gray-100">
                  {/* Comment Input */}
                  <div className="flex space-x-4 mb-8">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-md">
                      <img 
                         src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUserName || 'User')}`}
                         className="w-full h-full object-cover"
                         alt="Me"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                        placeholder="Écrire un commentaire..."
                        className="w-full px-5 py-3 bg-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments[post.id]?.length > 0 ? (
                      comments[post.id].map(comment => (
                        <div key={comment.id} className="flex space-x-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                            <img 
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.user?.name || 'User')}`}
                              alt={comment.user?.name || 'User'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm text-gray-900">{comment.user?.name || 'Utilisateur inconnu'}</span>
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Aucun commentaire pour le moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}