import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Users, 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  Shield,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useBackendApi } from '../hooks/useBackendApi';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  is_super_admin: boolean;
  created_at: string;
}

interface AdminKeyData {
  key: string;
  viewed_by: string;
  viewed_at: string;
}

const AdminManagement: React.FC = () => {
  const { get, post, del } = useBackendApi();
  
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentKey, setCurrentKey] = useState<AdminKeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAdmins(),
        loadCurrentKey()
      ]);
    } catch (error) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    setAdminsLoading(true);
    try {
      const response = await get('/admin/auth/admins');
      if (response.success) {
        setAdmins(response.data.admins);
      } else {
        setError(response.message || 'Failed to load admins');
      }
    } catch (error) {
      setError('Failed to load admins');
    } finally {
      setAdminsLoading(false);
    }
  };

  const loadCurrentKey = async () => {
    setKeyLoading(true);
    try {
      const response = await get('/admin/auth/current-key');
      if (response.success) {
        setCurrentKey(response.data);
      } else {
        setError(response.message || 'Failed to load current key');
      }
    } catch (error) {
      setError('Failed to load current key');
    } finally {
      setKeyLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (!confirm('Are you sure you want to generate a new admin registration key? The old key will become invalid.')) {
      return;
    }

    setKeyLoading(true);
    try {
      const response = await post('/admin/auth/generate-key', {});
      if (response.success) {
        setCurrentKey(response.data);
        setShowKey(true);
        alert('New admin registration key generated successfully!');
      } else {
        setError(response.message || 'Failed to generate new key');
      }
    } catch (error) {
      setError('Failed to generate new key');
    } finally {
      setKeyLoading(false);
    }
  };

  const copyKey = () => {
    if (currentKey?.key) {
      navigator.clipboard.writeText(currentKey.key);
      alert('Admin registration key copied to clipboard!');
    }
  };

  const removeAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to remove admin "${adminEmail}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await del(`/admin/auth/admins/${adminId}`);
      if (response.success) {
        await loadAdmins();
        alert('Admin removed successfully');
      } else {
        setError(response.message || 'Failed to remove admin');
      }
    } catch (error) {
      setError('Failed to remove admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
          <p className="text-gray-600">Manage admin accounts and registration keys</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-red-500">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Registration Key Management */}
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <Key className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Admin Registration Key</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Current Key</label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyKey}
                      disabled={!currentKey?.key}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {keyLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="font-mono text-sm bg-white p-3 rounded border">
                    {showKey ? (currentKey?.key || 'No key set') : '••••••••••••••••••••••••••••••••'}
                  </div>
                )}

                {currentKey && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last viewed: {new Date(currentKey.viewed_at).toLocaleString()}
                  </div>
                )}
              </div>

              <Button
                onClick={generateNewKey}
                disabled={keyLoading}
                loading={keyLoading}
                className="w-full"
              >
                Generate New Key
              </Button>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Important:</strong> When you generate a new key, the old key becomes invalid. 
                    Make sure to share the new key with team members who need to register as admin.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Admin List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold">Admin Accounts</h2>
              </div>
              <div className="text-sm text-gray-500">
                Total: {admins.length}
              </div>
            </div>

            {adminsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{admin.name}</span>
                          {admin.is_super_admin && (
                            <Shield className="h-4 w-4 text-yellow-600 ml-2" title="Super Admin" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{admin.email}</div>
                        <div className="text-xs text-gray-500">
                          Joined: {new Date(admin.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {!admin.is_super_admin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdmin(admin.id, admin.email)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {admins.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No admin accounts found
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">How to Add New Admins</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
              <div>
                <strong>Generate a new registration key</strong> using the button above
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
              <div>
                <strong>Share the key</strong> with the person who needs admin access
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
              <div>
                <strong>They register</strong> at <code className="bg-gray-100 px-2 py-1 rounded">/admin/register</code> using the key
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
              <div>
                <strong>Only whitelisted emails</strong> can register (configured in backend .env file)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminManagement;
