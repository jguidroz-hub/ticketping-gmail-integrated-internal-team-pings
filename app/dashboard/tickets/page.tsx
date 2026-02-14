'use client';

import { useState } from 'react';
import Link from 'next/link';

type Ticket = {
  id: string;
  title: string;
  creator: string;
  assignee: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved';
  pings: number;
  lastPing: string;
  gmailThread: boolean;
  created: string;
};

const DEMO_TICKETS: Ticket[] = [
  { id: 'TP-001', title: 'Customer onboarding docs outdated', creator: 'Alex M.', assignee: 'Sarah K.', priority: 'high', status: 'in-progress', pings: 3, lastPing: '10 min ago', gmailThread: true, created: '2 hours ago' },
  { id: 'TP-002', title: 'API rate limits hitting during peak', creator: 'Mike D.', assignee: 'You', priority: 'urgent', status: 'open', pings: 5, lastPing: '2 min ago', gmailThread: true, created: '45 min ago' },
  { id: 'TP-003', title: 'New hire laptop setup — starting Monday', creator: 'HR Bot', assignee: 'James T.', priority: 'normal', status: 'waiting', pings: 1, lastPing: '1 hour ago', gmailThread: false, created: '1 day ago' },
  { id: 'TP-004', title: 'Quarterly report data discrepancy', creator: 'Lisa R.', assignee: 'You', priority: 'high', status: 'open', pings: 2, lastPing: '30 min ago', gmailThread: true, created: '3 hours ago' },
  { id: 'TP-005', title: 'SSL cert expiring in 7 days', creator: 'Monitor', assignee: 'DevOps', priority: 'normal', status: 'open', pings: 0, lastPing: '—', gmailThread: false, created: '5 hours ago' },
  { id: 'TP-006', title: 'Design review for v2.0 landing page', creator: 'You', assignee: 'Emma L.', priority: 'low', status: 'waiting', pings: 1, lastPing: '2 days ago', gmailThread: true, created: '3 days ago' },
  { id: 'TP-007', title: 'Payment processing timeout fix', creator: 'Support', assignee: 'Mike D.', priority: 'urgent', status: 'resolved', pings: 8, lastPing: '1 day ago', gmailThread: true, created: '2 days ago' },
];

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  normal: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-600',
};

const statusColors: Record<string, string> = {
  open: 'bg-green-50 text-green-700',
  'in-progress': 'bg-blue-50 text-blue-700',
  waiting: 'bg-yellow-50 text-yellow-700',
  resolved: 'bg-gray-50 text-gray-500',
};

export default function TicketsPage() {
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = filter === 'all' ? DEMO_TICKETS :
    filter === 'mine' ? DEMO_TICKETS.filter(t => t.assignee === 'You') :
    DEMO_TICKETS.filter(t => t.status === filter);

  const myCount = DEMO_TICKETS.filter(t => t.assignee === 'You' && t.status !== 'resolved').length;
  const urgentCount = DEMO_TICKETS.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <h1 className="font-bold text-lg">🏓 Tickets</h1>
          {urgentCount > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full animate-pulse">{urgentCount} urgent</span>}
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-black text-white text-sm rounded-lg">
          + New Ticket
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Open</p>
            <p className="text-2xl font-bold">{DEMO_TICKETS.filter(t => t.status !== 'resolved').length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Assigned to You</p>
            <p className="text-2xl font-bold text-blue-600">{myCount}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Total Pings Today</p>
            <p className="text-2xl font-bold">{DEMO_TICKETS.reduce((s, t) => s + t.pings, 0)}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-400 uppercase">Avg Resolution</p>
            <p className="text-2xl font-bold">4.2h</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'mine', 'open', 'in-progress', 'waiting', 'resolved'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize ${filter === s ? 'bg-black text-white' : 'bg-white border text-gray-600'}`}>
              {s === 'mine' ? '👤 My Tickets' : s}
            </button>
          ))}
        </div>

        {/* Tickets */}
        <div className="space-y-2">
          {filtered.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-xs font-mono text-gray-400 w-16">{ticket.id}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{ticket.title}</p>
                    {ticket.gmailThread && <span title="Gmail thread" className="text-xs">📧</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ticket.creator} → {ticket.assignee} · {ticket.created}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {ticket.pings > 0 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    🏓 {ticket.pings} <span className="text-gray-400">· {ticket.lastPing}</span>
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
