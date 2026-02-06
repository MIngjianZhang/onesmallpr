import { useState } from 'react';
import { Send, Play, Save, Trash2, Plus } from 'lucide-react';
import { DoubaoClient } from '../../lib/doubao';

export default function TestTool() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('doubao-seed-1-8-251228');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, what can you do?' }
  ]);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAddMessage = () => {
    setMessages([...messages, { role: 'user', content: '' }]);
  };

  const handleMessageChange = (index: number, content: string) => {
    const newMessages = [...messages];
    newMessages[index].content = content;
    setMessages(newMessages);
  };

  const handleRoleChange = (index: number, role: 'user' | 'assistant' | 'system') => {
    const newMessages = [...messages];
    newMessages[index].role = role;
    setMessages(newMessages);
  };

  const handleDeleteMessage = (index: number) => {
    const newMessages = messages.filter((_, i) => i !== index);
    setMessages(newMessages);
  };

  const handleTest = async () => {
    if (!apiKey) {
      alert('Please enter an API Key');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const client = new DoubaoClient({ apiKey, model });
      const res = await client.generateResponse(messages);
      
      const content = res.choices[0]?.message?.content || 'No response';
      setResponse(content);
    } catch (error: any) {
      setResponse(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Configuration & Input */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-700">Request Configuration</h2>
          <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Save Request">
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Model ID</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-500">Messages</label>
            {messages.map((msg, index) => (
              <div key={index} className="flex gap-2 items-start group">
                <select
                  value={msg.role}
                  onChange={(e) => handleRoleChange(index, e.target.value as any)}
                  className="w-24 text-xs border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="system">System</option>
                  <option value="user">User</option>
                  <option value="assistant">Assistant</option>
                </select>
                <textarea
                  value={msg.content}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                  rows={2}
                  className="flex-1 text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none font-mono"
                  placeholder="Content..."
                />
                <button 
                  onClick={() => handleDeleteMessage(index)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddMessage}
              className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Message
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                <Play className="w-4 h-4" /> Send Request
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Preview */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-slate-300">Response</h2>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-900/50">200 OK</span>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
            {response || <span className="text-slate-600 italic">// Response will appear here...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
