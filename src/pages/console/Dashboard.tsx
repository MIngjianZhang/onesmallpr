import { useState } from 'react';
import { Plus, Copy, Trash2, Eye, EyeOff, Activity, CreditCard, Server } from 'lucide-react';

export default function Dashboard() {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Development', key: 'sk-doubao-xxxxxxxxxxxxxxxx', created: '2023-10-01', status: 'active' },
    { id: '2', name: 'Production', key: 'sk-doubao-yyyyyyyyyyyyyyyy', created: '2023-09-15', status: 'active' },
  ]);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const toggleKey = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // Could add toast notification here
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Console Dashboard</h1>
        <p className="text-slate-500">Manage your API keys and monitor usage.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Today's Calls</p>
              <h3 className="text-2xl font-bold text-slate-900">1,234</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>↑ 12% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Current Cost</p>
              <h3 className="text-2xl font-bold text-slate-900">$4.50</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-400">
            <span>Billing cycle resets in 12 days</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">API Status</p>
              <h3 className="text-2xl font-bold text-slate-900">Operational</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">API Keys</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create New Key
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Name</th>
                <th className="text-left px-6 py-4 font-medium">Secret Key</th>
                <th className="text-left px-6 py-4 font-medium">Created</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{key.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>{showKey[key.id] ? key.key : 'sk-doubao-••••••••••••'}</span>
                      <button onClick={() => toggleKey(key.id)} className="text-slate-400 hover:text-slate-600">
                        {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{key.created}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => copyKey(key.key)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-slate-900 text-slate-300 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Start</h2>
        <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <p className="text-slate-500 mb-2"># Install the SDK</p>
          <p className="mb-4"><span className="text-blue-400">npm</span> install openai</p>
          
          <p className="text-slate-500 mb-2"># Initialize Client</p>
          <pre className="whitespace-pre-wrap">
{`import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});`}
          </pre>
        </div>
      </div>
    </div>
  );
}
