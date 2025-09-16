import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, Shield, Settings, Check, X, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminEmailManager: React.FC = () => {
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [exactMatch, setExactMatch] = useState(false);
  const [fallbackKeyword, setFallbackKeyword] = useState('admin');

  useEffect(() => {
    // Load current configuration
    const envEmails = import.meta.env.VITE_ADMIN_EMAILS || '';
    const emails = envEmails
      .split(',')
      .map((email: string) => email.trim())
      .filter((email: string) => email.length > 0);
    
    setAdminEmails(emails);
    setExactMatch(import.meta.env.VITE_ADMIN_REQUIRE_EXACT_MATCH === 'true');
    setFallbackKeyword(import.meta.env.VITE_ADMIN_FALLBACK_KEYWORD || 'admin');
  }, []);

  const addEmail = () => {
    if (!newEmail.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (adminEmails.includes(newEmail.trim())) {
      toast.error('Email already exists in admin list');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      toast.error('Please enter a valid email format');
      return;
    }

    setAdminEmails(prev => [...prev, newEmail.trim()]);
    setNewEmail('');
    toast.success('Admin email added successfully!');
  };

  const removeEmail = (emailToRemove: string) => {
    setAdminEmails(prev => prev.filter(email => email !== emailToRemove));
    toast.success('Admin email removed successfully!');
  };

  const generateEnvConfig = () => {
    const config = [
      '# Admin Configuration',
      '# Comma-separated list of admin email addresses',
      `VITE_ADMIN_EMAILS=${adminEmails.join(',')}`,
      '',
      '# Admin Settings', 
      `VITE_ADMIN_REQUIRE_EXACT_MATCH=${exactMatch}`,
      `VITE_ADMIN_FALLBACK_KEYWORD=${fallbackKeyword}`
    ].join('\n');

    navigator.clipboard.writeText(config);
    toast.success('Configuration copied to clipboard!');
  };

  const testEmail = (testEmailValue: string) => {
    if (!testEmailValue.trim()) {
      toast.error('Please enter an email to test');
      return;
    }

    const normalizedEmail = testEmailValue.toLowerCase();
    const normalizedAdminEmails = adminEmails.map(email => email.toLowerCase());
    
    let isAdmin = false;
    let reason = '';

    // Check exact match
    if (normalizedAdminEmails.includes(normalizedEmail)) {
      isAdmin = true;
      reason = 'Exact match in admin list';
    }
    // Check keyword fallback
    else if (!exactMatch && normalizedEmail.includes(fallbackKeyword)) {
      isAdmin = true;
      reason = `Contains keyword "${fallbackKeyword}"`;
    }
    else {
      reason = exactMatch 
        ? 'Not in admin list (exact match required)'
        : `Not in admin list and doesn't contain "${fallbackKeyword}"`;
    }

    toast[isAdmin ? 'success' : 'error'](
      `${testEmailValue}: ${isAdmin ? 'ADMIN' : 'NOT ADMIN'} - ${reason}`
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold text-white">Admin Email Manager</h3>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isEditing 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4 mr-2 inline" />
              Save Config
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2 inline" />
              Edit Config
            </>
          )}
        </button>
      </div>

      {/* Current Admin Emails */}
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Admin Emails ({adminEmails.length})
        </h4>
        
        {adminEmails.length === 0 ? (
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-400">No admin emails configured</p>
            <p className="text-gray-500 text-sm mt-1">Currently using keyword-based detection</p>
          </div>
        ) : (
          <div className="space-y-2">
            {adminEmails.map((email, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white">{email}</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeEmail(email)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Remove admin email"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Email */}
      {isEditing && (
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-white">Add New Admin Email</h4>
          <div className="flex space-x-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && addEmail()}
            />
            <button
              onClick={addEmail}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      )}

      {/* Configuration Settings */}
      {isEditing && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Configuration Settings</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exactMatch}
                onChange={(e) => setExactMatch(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-white font-medium">Require Exact Match</span>
                <p className="text-gray-400 text-sm">Only emails in the admin list will have admin access</p>
              </div>
            </label>

            <div className="space-y-2">
              <label className="block text-white font-medium">Fallback Keyword</label>
              <input
                type="text"
                value={fallbackKeyword}
                onChange={(e) => setFallbackKeyword(e.target.value)}
                placeholder="admin"
                disabled={exactMatch}
                className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  exactMatch ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <p className="text-gray-400 text-sm">
                {exactMatch 
                  ? 'Disabled when exact match is required'
                  : 'Emails containing this keyword will have admin access'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Tester */}
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-white">Test Email Access</h4>
        <div className="flex space-x-2">
          <input
            type="email"
            placeholder="test@example.com"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                testEmail((e.target as HTMLInputElement).value);
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              testEmail(input.value);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Test
          </button>
        </div>
      </div>

      {/* Generate Config */}
      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={generateEnvConfig}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Environment Configuration</span>
        </button>
        <p className="text-gray-400 text-sm mt-2 text-center">
          Click to copy the configuration for your .env file
        </p>
      </div>
    </div>
  );
};

export default AdminEmailManager;