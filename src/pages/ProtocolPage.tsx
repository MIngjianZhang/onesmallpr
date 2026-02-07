import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import Button from '../components/common/Button';
import { Download, Copy, FileText, Check, Scroll } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProtocolPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (loading) return <div className="min-h-screen bg-guild-wood flex items-center justify-center text-guild-parchment animate-pulse font-heading text-xl">Scribing the Artifact...</div>;
  if (!protocol) return <div className="min-h-screen bg-guild-wood flex items-center justify-center text-guild-red font-heading text-xl">Failed to forge the protocol.</div>;

  return (
    <div className="bg-guild-wood min-h-screen py-8 font-serif text-guild-wood">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b-2 border-guild-bronze pb-4">
          <h1 className="text-3xl font-heading font-bold text-guild-gold flex items-center gap-2 drop-shadow-md">
            <Scroll className="h-8 w-8" /> Artifact Forged
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="gap-2 border-guild-bronze text-guild-parchment hover:bg-guild-wood-light">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Inscribed" : "Copy Rune"}
            </Button>
            <Button onClick={handleDownload} className="gap-2 bg-guild-gold text-guild-wood border-2 border-guild-bronze hover:bg-yellow-400">
              <Download className="h-4 w-4" /> Claim Scroll (.md)
            </Button>
          </div>
        </div>

        <div className="bg-guild-parchment p-12 rounded shadow-2xl border-4 border-guild-wood-light relative overflow-hidden">
          {/* Scroll Texture Overlay (Optional, CSS only) */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/assets/parchment-texture.png')] mix-blend-multiply"></div>
          
          <div className="prose max-w-none prose-p:text-guild-wood prose-headings:text-guild-wood prose-headings:font-heading prose-code:bg-guild-wood/10 prose-code:text-guild-wood-light">
            <ReactMarkdown>{protocol.content}</ReactMarkdown>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-guild-parchment-dark mb-4 italic">
            "Take this scroll. It shall light your path in the dark dungeon of Code."
          </p>
          <Button onClick={() => navigate('/')} variant="ghost" className="text-guild-gold hover:text-white">Return to Guild Hall</Button>
        </div>
      </div>
    </div>
  );
}
