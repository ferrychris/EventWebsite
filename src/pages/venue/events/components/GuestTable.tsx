import React from 'react';
import { Users, Edit2 } from 'lucide-react';
import type { Guest } from '../../../../types';

interface GuestTableProps {
  guests: Guest[];
  onUpdateStatus: (guestId: string, status: Guest['status']) => void;
}

export default function GuestTable({ guests, onUpdateStatus }: GuestTableProps) {
  // Group guests by group_id
  const groupedGuests = guests.reduce((acc: { [key: string]: Guest[] }, guest) => {
    if (guest.group_id) {
      if (!acc[guest.group_id]) {
        acc[guest.group_id] = [];
      }
      acc[guest.group_id].push(guest);
    } else {
      // For guests without a group, create a "group" with just them
      acc[guest.id] = [guest];
    }
    return acc;
  }, {});

  // Sort guests within each group: adults first, then children
  Object.values(groupedGuests).forEach(group => {
    group.sort((a, b) => {
      if (a.group_role === 'adult' && b.group_role !== 'adult') return -1;
      if (a.group_role !== 'adult' && b.group_role === 'adult') return 1;
      return 0;
    });
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plus One
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.values(groupedGuests).map((group) => {
            const isFamily = group.length > 1;
            const familyName = group[0].lastname;

            return (
              <tr key={group[0].group_id || group[0].id}>
                <td colSpan={5} className="p-2">
                  <div 
                    className={`rounded-lg overflow-hidden ${
                      isFamily ? 'border border-gray-200 bg-gray-50' : ''
                    }`}
                  >
                    {/* Family Header - only show for groups */}
                    {isFamily && (
                      <div className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-700">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{familyName} Family</span>
                      </div>
                    )}

                    {/* Guest Rows */}
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200">
                        {group.map((guest) => {
                          const isChild = guest.group_role === 'child';

                          return (
                            <tr 
                              key={guest.id}
                              className={`${
                                isFamily ? 'hover:bg-white/50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`flex items-center ${isChild ? 'pl-8' : ''}`}>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {guest.firstname} {guest.lastname}
                                    </div>
                                    {isChild && (
                                      <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                                        Child
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {!isChild && (
                                  <>
                                    <div className="text-sm text-gray-900">{guest.email}</div>
                                    {guest.phone && (
                                      <div className="text-sm text-gray-500">{guest.phone}</div>
                                    )}
                                  </>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={guest.status}
                                  onChange={(e) => onUpdateStatus(guest.id, e.target.value as Guest['status'])}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer transition-all ${
                                    guest.status === 'confirmed' ? 'bg-green-100 text-green-800 focus:ring-green-500' : 
                                    guest.status === 'declined' ? 'bg-red-100 text-red-800 focus:ring-red-500' : 
                                    'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="declined">Declined</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {!isChild && (
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    guest.plus_one 
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {guest.plus_one ? 'Yes' : 'No'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {!isChild && (
                                  <button
                                    className="text-gray-400 hover:text-gray-500"
                                  >
                                    <Edit2 className="w-5 h-5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}