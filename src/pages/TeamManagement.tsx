import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { useBackendApi } from '../hooks/useBackendApi';
import { TeamMember } from '../hooks/useTeam';
import toast from 'react-hot-toast';

const TeamManagement: React.FC = () => {
  const { get, post, put, del, loading } = useBackendApi();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    linkedin_url: '',
    github_url: '',
    email: '',
    phone: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Add a refresh button to manually reload data
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchTeamMembers();
  };

  const fetchTeamMembers = async () => {
    try {
      console.log('🔄 Fetching team members...');
      setIsLoading(true);
      const response = await get('/team/admin');
      console.log('📥 Team members response:', response);
      
      if (response.success) {
        console.log('✅ Team members fetched successfully:', response.data);
        console.log('🆔 Team member IDs from database:', response.data?.map((m: TeamMember) => ({ id: m.id, name: m.name })) || []);
        setTeamMembers(response.data || []);
        console.log('📊 Team members state updated:', response.data?.length || 0, 'members');
      } else {
        console.error('❌ Failed to fetch team members:', response.error);
        toast.error('Failed to fetch team members');
      }
    } catch (error) {
      console.error('💥 Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setIsLoading(false);
      console.log('🏁 Fetch team members completed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Form submitted:', {
      isEditing: !!editingMember,
      memberId: editingMember?.id,
      formData: formData
    });
    
    try {
      if (editingMember) {
        // Update existing member
        console.log('🔄 Updating team member:', editingMember.id);
        console.log('📤 Update data being sent:', formData);
        
        const response = await put(`/team/${editingMember.id}`, formData);
        console.log('📥 Update response:', response);
        
        if (response.success) {
          console.log('✅ Team member updated successfully');
          toast.success('Team member updated successfully');
          console.log('🔄 Refreshing team members list...');
          await fetchTeamMembers();
          console.log('✅ Modal closing...');
          closeModal();
        } else {
          console.error('❌ Update failed:', response.error);
          toast.error(response.error || 'Failed to update team member');
        }
      } else {
        // Create new member
        console.log('➕ Creating new team member');
        console.log('📤 Create data being sent:', formData);
        
        const response = await post('/team', formData);
        console.log('📥 Create response:', response);
        
        if (response.success) {
          console.log('✅ Team member created successfully');
          toast.success('Team member created successfully');
          console.log('🔄 Refreshing team members list...');
          await fetchTeamMembers();
          console.log('✅ Modal closing...');
          closeModal();
        } else {
          console.error('❌ Create failed:', response.error);
          toast.error(response.error || 'Failed to create team member');
        }
      }
    } catch (error) {
      console.error('💥 Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  const handleDelete = async (id: string) => {
    console.log('🗑️ Delete request for team member:', id);
    
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      console.log('❌ Delete cancelled by user');
      return;
    }
    
    try {
      console.log('🔄 Deleting team member:', id);
      const response = await del(`/team/${id}`);
      console.log('📥 Delete response:', response);
      
      if (response.success) {
        console.log('✅ Team member deleted successfully');
        toast.success('Team member deleted successfully');
        console.log('🔄 Refreshing team members list...');
        await fetchTeamMembers();
      } else {
        console.error('❌ Delete failed:', response.error);
        toast.error(response.error || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('💥 Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      console.log('🔄 Toggling active status for team member:', id);
      const response = await post(`/team/${id}/toggle`, {});
      console.log('📥 Toggle response:', response);
      
      if (response.success) {
        console.log('✅ Team member status updated successfully');
        toast.success(response.message || 'Team member status updated');
        console.log('🔄 Refreshing team members list...');
        await fetchTeamMembers();
      } else {
        console.error('❌ Toggle failed:', response.error);
        toast.error(response.error || 'Failed to update team member status');
      }
    } catch (error) {
      console.error('💥 Error toggling team member status:', error);
      toast.error('Failed to update team member status');
    }
  };

  const openModal = (member?: TeamMember) => {
    console.log('📝 Opening modal:', member ? 'Edit mode' : 'Create mode');
    
    if (member) {
      console.log('✏️ Editing member:', member);
      console.log('🆔 Member ID being edited:', member.id);
      console.log('📊 All team members in state:', teamMembers.map(m => ({ id: m.id, name: m.name })));
      setEditingMember(member);
      const formDataToSet = {
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        image_url: member.image_url || '',
        linkedin_url: member.linkedin_url || '',
        github_url: member.github_url || '',
        email: member.email || '',
        phone: member.phone || '',
        display_order: member.display_order || 0,
        is_active: member.is_active ?? true
      };
      console.log('📋 Form data set for editing:', formDataToSet);
      setFormData(formDataToSet);
    } else {
      console.log('➕ Creating new member');
      setEditingMember(null);
      const formDataToSet = {
        name: '',
        role: '',
        bio: '',
        image_url: '',
        linkedin_url: '',
        github_url: '',
        email: '',
        phone: '',
        display_order: teamMembers.length + 1,
        is_active: true
      };
      console.log('📋 Form data set for creation:', formDataToSet);
      setFormData(formDataToSet);
    }
    setShowModal(true);
    console.log('✅ Modal opened successfully');
  };

  const closeModal = () => {
    console.log('❌ Closing modal');
    setShowModal(false);
    setEditingMember(null);
    const resetFormData = {
      name: '',
      role: '',
      bio: '',
      image_url: '',
      linkedin_url: '',
      github_url: '',
      email: '',
      phone: '',
      display_order: 0,
      is_active: true
    };
    console.log('🔄 Resetting form data:', resetFormData);
    setFormData(resetFormData);
    console.log('✅ Modal closed and form reset');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text">Team Management</h2>
          <p className="text-muted">Manage your team members and their information</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => openModal()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={member.image_url || '/images/team/backup/member1.jpg'}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/team/backup/member1.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold text-text">{member.name}</h3>
                  <p className="text-sm text-muted">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(member.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    member.is_active
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={member.is_active ? 'Hide member' : 'Show member'}
                >
                  {member.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => openModal(member)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit member"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-muted mb-4 line-clamp-3">{member.bio}</p>
            
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Order: {member.display_order}</span>
              <span className={`px-2 py-1 rounded-full ${
                member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {member.is_active ? 'Active' : 'Hidden'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-surface rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order || 0}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-text">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-muted hover:text-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{editingMember ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
