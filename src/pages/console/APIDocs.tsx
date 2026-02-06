import { Code, Book, AlertTriangle } from 'lucide-react';

export default function APIDocs() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">API Documentation</h1>
        <p className="text-lg text-slate-600">
          Complete reference for the Doubao API. Learn how to authenticate requests, manage resources, and handle responses.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Book className="w-6 h-6 text-blue-600" /> Authentication
        </h2>
        <div className="prose prose-slate max-w-none">
          <p>
            The Doubao API uses API keys for authentication. You can view and manage your API keys in the Dashboard.
          </p>
          <div className="bg-slate-900 rounded-lg p-4 my-4">
            <code className="text-green-400">Authorization: Bearer YOUR_API_KEY</code>
          </div>
          <p>
            All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Code className="w-6 h-6 text-purple-600" /> Chat Completions
        </h2>
        <p className="text-slate-600">
          Creates a model response for the given chat conversation.
        </p>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">POST</span>
            <code className="text-sm text-slate-600">https://ark.cn-beijing.volces.com/api/v3/chat/completions</code>
          </div>
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Request Body</h3>
            <div className="space-y-3">
              <div className="flex gap-4 border-b border-slate-100 pb-2">
                <code className="text-sm font-bold text-slate-900 w-32">model</code>
                <div className="flex-1 text-sm">
                  <span className="text-slate-500">string</span> <span className="text-red-500 text-xs ml-2">Required</span>
                  <p className="text-slate-600 mt-1">ID of the model to use (e.g., doubao-seed-1-8-251228).</p>
                </div>
              </div>
              <div className="flex gap-4 border-b border-slate-100 pb-2">
                <code className="text-sm font-bold text-slate-900 w-32">messages</code>
                <div className="flex-1 text-sm">
                  <span className="text-slate-500">array</span> <span className="text-red-500 text-xs ml-2">Required</span>
                  <p className="text-slate-600 mt-1">A list of messages comprising the conversation so far.</p>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mt-6">Example Request</h3>
            <div className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300 font-mono overflow-x-auto">
              <pre>{`curl https://ark.cn-beijing.volces.com/api/v3/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $DOUBAO_API_KEY" \\
  -d '{
    "model": "doubao-seed-1-8-251228",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'`}</pre>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" /> Errors
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-slate-200 rounded-lg">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr>
                <td className="px-6 py-4 font-mono">401</td>
                <td className="px-6 py-4">Invalid Authentication. Check your API key.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-mono">429</td>
                <td className="px-6 py-4">Rate limit reached for requests.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-mono">500</td>
                <td className="px-6 py-4">The server had an error while processing your request.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
