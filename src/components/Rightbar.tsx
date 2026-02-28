'use client';

import { Bell, Calendar, BookOpen, Award } from 'lucide-react';

const announcements = [
  {
    id: 1,
    title: 'Final Exam Schedule',
    content: 'Final exams will begin next week. Check your student portal for detailed schedules.',
    type: 'exam',
    date: '2024-02-15',
  },
  {
    id: 2,
    title: 'Library Hours Extended',
    content: 'Library will remain open until midnight during the exam period.',
    type: 'library',
    date: '2024-02-14',
  },
  {
    id: 3,
    title: 'Scholarship Applications',
    content: 'Applications for merit-based scholarships are now open. Deadline: March 1st.',
    type: 'scholarship',
    date: '2024-02-13',
  },
  {
    id: 4,
    title: 'Career Fair Next Month',
    content: 'Annual career fair will be held on March 15th. Over 50 companies participating.',
    type: 'career',
    date: '2024-02-12',
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'exam':
      return Calendar;
    case 'library':
      return BookOpen;
    case 'scholarship':
      return Award;
    case 'career':
      return Bell;
    default:
      return Bell;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export default function Rightbar() {
  return (
    <div className="w-80 pl-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 text-blue-700 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">University Announcements</h3>
        </div>
        
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const Icon = getIcon(announcement.type);
            return (
              <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start">
                  <Icon className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {announcement.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(announcement.date)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="space-y-2">
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Student Portal
          </a>
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Course Catalog
          </a>
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Academic Calendar
          </a>
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            IT Support
          </a>
        </div>
      </div>
    </div>
  );
}
