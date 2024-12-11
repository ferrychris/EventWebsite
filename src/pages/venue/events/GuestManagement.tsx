import React, { useState } from 'react';
import { Plus, Upload, Download, Search, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import type { RootState } from '../../../store';
import type { Guest } from '../../../types';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import GuestTable from './components/GuestTable';

export default function GuestManagement() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  const eventId = searchParams.get('eventId');
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Guest['status'] | 'all'>('all');
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  const handleUpdateStatus = async (guestId: string, status: Guest['status']) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({ status })
        .eq('id', guestId)
        .select()
        .single();

      if (error) throw error;
      setGuests(guests.map(g => g.id === guestId ? data : g));
    } catch (err) {
      console.error('Error updating guest status:', err);
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      `${guest.firstname} ${guest.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    pending: guests.filter(g => g.status === 'pending').length,
    declined: guests.filter(g => g.status === 'declined').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div>
            <div className="text-sm text-gray-600">Total Guests</div>
            <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm text-gray-600">Confirmed</div>
            <div className="text-2xl font-semibold text-green-600">{stats.confirmed}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-semibold text-amber-600">{stats.pending}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm text-gray-600">Declined</div>
            <div className="text-2xl font-semibold text-red-600">{stats.declined}</div>
          </div>
        </Card>
      </div>

      {/* Guest List */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Guest List</h2>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={Upload}
            >
              Import
            </Button>
            <Button
              variant="outline"
              icon={Download}
            >
              Export
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              style={{ backgroundColor: primaryColor }}
            >
              Add Guest
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Guest['status'] | 'all')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent appearance-none bg-white"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <GuestTable 
          guests={filteredGuests}
          onUpdateStatus={handleUpdateStatus}
        />
      </Card>
    </div>
  );
}