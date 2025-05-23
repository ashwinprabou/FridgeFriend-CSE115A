import React from 'react';
import { AlarmClockIcon } from 'lucide-react';
import { useInventory, FoodItem } from '../../contexts/InventoryContext';
import { Link } from 'react-router-dom';

const ExpirationSummary: React.FC = () => {
  const { items } = useInventory();

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const categorizeItems = () => {
    const expired: FoodItem[] = [];
    const expiringToday: FoodItem[] = [];
    const thisWeek: FoodItem[] = [];
    const later: FoodItem[] = [];

    items.forEach(item => {
      const expDate = new Date(item.expiration);

      if (expDate < today && expDate.toDateString() !== today.toDateString()) {
        expired.push(item);
      } else if (expDate.toDateString() === today.toDateString()) {
        expiringToday.push(item);
      } else if (expDate > today && expDate <= endOfWeek) {
        thisWeek.push(item);
      } else {
        later.push(item);
      }
    });

    return { expired, expiringToday, thisWeek, later };
  };

  const { expired, expiringToday, thisWeek, later } = categorizeItems();

  const sortByExpiration = (a: FoodItem, b: FoodItem) =>
    new Date(a.expiration).getTime() - new Date(b.expiration).getTime();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 bg-blue-500 text-white flex items-center">
        <AlarmClockIcon size={20} className="mr-2" />
        <h2 className="text-lg font-semibold">Expiration Summary</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <h3 className="text-red-700 font-medium">Expired</h3>
            <p className="text-2xl font-bold text-red-800">{expired.length}</p>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
            <h3 className="text-amber-700 font-medium">Expiring Today</h3>
            <p className="text-2xl font-bold text-amber-800">{expiringToday.length}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h3 className="text-blue-700 font-medium">This Week</h3>
            <p className="text-2xl font-bold text-blue-800">{thisWeek.length}</p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <h3 className="text-green-700 font-medium">Later</h3>
            <p className="text-2xl font-bold text-green-800">{later.length}</p>
          </div>
        </div>

        {(expired.length > 0 || expiringToday.length > 0) ? (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Attention Needed</h3>
            <ul className="space-y-2">
              {[...expired, ...expiringToday]
                .sort(sortByExpiration)
                .slice(0, 5)
                .map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className={`text-sm ${new Date(item.expiration) < today ? 'text-red-600' : 'text-amber-600'}`}>
                      {new Date(item.expiration) < today
                        ? 'Expired'
                        : 'Expires today'}
                    </span>
                  </li>
                ))}
            </ul>

            <div className="mt-4 text-center">
              <Link to="/inventory" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all items →
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">No items need immediate attention</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpirationSummary;
