import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import Button from '../components/common/Button';
import { Download, Copy, FileText, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProtocolPage() {
  const { id } = useParams<{ id: string }>();
  const [protocol, setProtocol] = useState<{ content: string; filename: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateProtocol = async () => {
      try {
        const data = await apiClient.post('/protocol/generate', { issueId: id });
        setProtocol({
          content: data.content,
          filename: `ONESMALLPR_TASK_${id}.md`
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) generateProtocol();
  }, [id]);

  const handleCopy = () => {
    if (protocol) {
      navigator.clipboard.writeText(protocol.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (protocol) {
      const element = document.createElement("a");
      const file = new Blob([protocol.content], {type: 'text/markdown'});
      element.href = URL.createObjectURL(file);
      element.download = protocol.filename;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  if (loading) return <div className="p-8 text-center">Generating Protocol...</div>;
  if (!protocol) return <div className="p-8 text-center">Failed to generate protocol.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" /> Task Protocol Generated
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy Content"}
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" /> Download .md File
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 prose max-w-none">
          <ReactMarkdown>{protocol.content}</ReactMarkdown>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Now, save this file to your local project directory and follow the instructions!
          </p>
          <Button href="/" variant="ghost">Return Home</Button>
        </div>
      </div>
    </div>
  );
}
