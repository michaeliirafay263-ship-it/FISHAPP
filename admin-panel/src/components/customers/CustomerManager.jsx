import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { formatTZS } from '../../utils/formatters';
import { Users, Phone, MapPin, Building2, User, ShoppingBag } from 'lucide-react';

export function CustomerManager() {
  const { customers } = useAdminData();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          Customer & Business Client Directory
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Registered household buyers, restaurants, and hotel accounts in Dar es Salaam.
        </p>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
              <th style={{ padding: '12px 16px' }}>Client Name</th>
              <th style={{ padding: '12px 16px' }}>Type</th>
              <th style={{ padding: '12px 16px' }}>Phone Contact</th>
              <th style={{ padding: '12px 16px' }}>Primary Ward</th>
              <th style={{ padding: '12px 16px' }}>Orders</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Lifetime Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => (
              <tr
                key={cust.id}
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)'
                }}
              >
                <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--color-navy)' }}>
                  {cust.name}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={cust.userType === 'Restaurant' ? 'badge badge-primary' : 'badge badge-navy'}>
                    {cust.userType}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <a href={`tel:${cust.phone}`} style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                    {cust.phone}
                  </a>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                  {cust.ward}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                  {cust.ordersCount} orders
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '800', color: 'var(--color-navy)' }}>
                  {formatTZS(cust.totalSpent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
