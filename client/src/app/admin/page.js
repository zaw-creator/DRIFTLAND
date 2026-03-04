'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

const cards = [
  {
    icon: '📋',
    title: 'Registrations',
    desc: 'View and manage all driver registrations',
    href: '/admin/registrations',
  },
  {
    icon: '🏁',
    title: 'Events',
    desc: 'Create and manage upcoming events',
    href: '/admin/events',
  },
  {
    icon: '🛡️',
    title: 'Safety Requirements',
    desc: 'Edit safety and equipment requirements',
    href: '/admin/safety-requirements',
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) router.push('/admin/login');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <div className="logo">
          <div>
            <span className="accent">Drift</span>
            <span className="brand">Land</span>
          </div>
          <p className="subtitle">Admin Portal</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <h1 className="dashboard-heading">Dashboard</h1>
        <p className="dashboard-subheading">Manage your DriftLand platform</p>

        <div className="dashboard-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="dashboard-card"
              onClick={() => router.push(card.href)}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-title">{card.title}</div>
              <div className="card-desc">{card.desc}</div>
              <span className="card-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}