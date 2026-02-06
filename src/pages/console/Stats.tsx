import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar } from 'lucide-react';

const data = [
  { name: 'Mon', calls: 4000, cost: 2400 },
  { name: 'Tue', calls: 3000, cost: 1398 },
  { name: 'Wed', calls: 2000, cost: 9800 },
  { name: 'Thu', calls: 2780, cost: 3908 },
  { name: 'Fri', calls: 1890, cost: 4800 },
  { name: 'Sat', calls: 2390, cost: 3800 },
  { name: 'Sun', calls: 3490, cost: 4300 },
];

export default function Stats() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usage Statistics</h1>
          <p className="text-slate-500">Monitor your API usage and costs over time.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Calendar className="w-4 h-4" />
          Last 7 Days
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calls Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">API Calls</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Cost Estimation ($)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Usage Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Model</th>
                <th className="px-6 py-3 font-medium">Requests</th>
                <th className="px-6 py-3 font-medium">Input Tokens</th>
                <th className="px-6 py-3 font-medium">Output Tokens</th>
                <th className="px-6 py-3 font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">doubao-pro-4k</td>
                <td className="px-6 py-4">12,453</td>
                <td className="px-6 py-4">45.2M</td>
                <td className="px-6 py-4">12.1M</td>
                <td className="px-6 py-4 text-right">$145.20</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">doubao-lite-32k</td>
                <td className="px-6 py-4">8,231</td>
                <td className="px-6 py-4">128.5M</td>
                <td className="px-6 py-4">45.2M</td>
                <td className="px-6 py-4 text-right">$89.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
