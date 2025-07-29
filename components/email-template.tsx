import React from 'react';

interface EmailTemplateProps {
  subject: string;
  content: string;
  fromEmail?: string;
  replyTo?: string;
}

export function EmailTemplate({ subject, content, fromEmail = "newsletter@manishtamang.com", replyTo }: EmailTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Email Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{subject}</h1>
            <p className="text-sm text-gray-500 mt-1">
              from {fromEmail}
              {replyTo && ` • reply to ${replyTo}`}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="p-6">
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Email Footer */}
      <div className="border-t border-gray-100 p-6 bg-gray-50">
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Newsletter App. All rights reserved.</p>
          <p className="mt-1">
            <a href="#" className="text-blue-600 hover:underline">
              Unsubscribe
            </a>{' '}
            •{' '}
            <a href="#" className="text-blue-600 hover:underline">
              View in browser
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function EmailPreview({ subject, content, fromEmail = "newsletter@yourdomain.com" }: EmailTemplateProps) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="border-b border-gray-100 p-4">
        <div className="font-medium text-gray-900">{subject || "Email Subject"}</div>
        <div className="text-gray-500 text-xs mt-1">from {fromEmail}</div>
      </div>
      <div className="p-4">
        {content ? (
          <div
            className="prose prose-sm max-w-none text-gray-900"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-gray-500 italic">Your email content will appear here...</p>
        )}
      </div>
    </div>
  );
}