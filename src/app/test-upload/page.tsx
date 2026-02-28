'use client';

import { UploadButton } from '@/lib/uploadthing';

export default function TestUpload() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8">UploadThing Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="mb-4 text-gray-600">Test barebones UploadButton:</p>
          
          <UploadButton 
            endpoint="postFile"
            content="Upload File"
          />
        </div>
      </div>
    </div>
  );
}
