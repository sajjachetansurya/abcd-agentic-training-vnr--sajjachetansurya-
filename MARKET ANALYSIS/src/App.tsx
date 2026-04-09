import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  Code,
  Download,
  Info,
  Workflow,
  Globe,
  File
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  User,
  Timestamp
} from './firebase';
import { 
  runResearchAgent, 
  runAnalystAgent, 
  runEditorAgent, 
  runMarketAnalysisOrchestrator,
  ResearchResult, 
  AnalysisResult, 
  FinalReport,
  ValidationResult
} from './services/geminiService';
import { triggerN8NWorkflow } from './services/n8nService';
import { cn } from './lib/utils';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { n8nWorkflowJSON } from './constants/n8nWorkflow';

type AgentStatus = 'idle' | 'researching' | 'analyzing' | 'editing' | 'completed' | 'error';
type ViewMode = 'dashboard' | 'n8n';
type ExecutionMode = 'local' | 'n8n';

const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'input', 
    data: { label: 'Webhook (Start)' }, 
    position: { x: 50, y: 100 },
    style: { background: '#f0f9ff', border: '2px solid #0ea5e9', borderRadius: '12px', padding: '10px', fontWeight: 'bold' }
  },
  { 
    id: '2', 
    data: { label: 'Researcher Agent (Gemini + Search)' }, 
    position: { x: 250, y: 100 },
    style: { background: '#fff', border: '2px solid #0ea5e9', borderRadius: '12px', padding: '10px' }
  },
  { 
    id: '3', 
    data: { label: 'Analyst Agent (SWOT & Trends)' }, 
    position: { x: 500, y: 100 },
    style: { background: '#fff', border: '2px solid #0ea5e9', borderRadius: '12px', padding: '10px' }
  },
  { 
    id: '4', 
    data: { label: 'Editor Agent (Final Report)' }, 
    position: { x: 750, y: 100 },
    style: { background: '#fff', border: '2px solid #0ea5e9', borderRadius: '12px', padding: '10px' }
  },
  { 
    id: '5', 
    type: 'output', 
    data: { label: 'HTTP Request (Callback)' }, 
    position: { x: 1000, y: 100 },
    style: { background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '12px', padding: '10px', fontWeight: 'bold' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [execMode, setExecMode] = useState<ExecutionMode>('local');
  const [n8nUrl, setN8nUrl] = useState(import.meta.env.VITE_N8N_WEBHOOK_URL || '');
  const [showSettings, setShowSettings] = useState(false);
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [research, setResearch] = useState<ResearchResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [report, setReport] = useState<FinalReport | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [orchestratorStatus, setOrchestratorStatus] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const q = query(
      collection(db, 'reports'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(docs);
    }, (err) => {
      console.error("Firestore Error:", err);
    });

    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const logout = () => auth.signOut();

  const saveReport = async (res: ResearchResult, ana: AnalysisResult, rep: FinalReport) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'reports'), {
        userId: user.uid,
        topic: res.topic,
        research: res,
        analysis: ana,
        report: rep,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to save report", err);
    }
  };

  const loadFromHistory = (item: any) => {
    setResearch(item.research);
    setAnalysis(item.analysis);
    setReport(item.report);
    setTopic(item.topic);
    setStatus('completed');
  };

  const startWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    if (!user) {
      setError("Please sign in to run the agents.");
      return;
    }

    setStatus('researching');
    setError(null);
    setResearch(null);
    setAnalysis(null);
    setReport(null);

    try {
      if (execMode === 'n8n') {
        if (!n8nUrl) {
          throw new Error('Please provide an n8n Webhook URL in settings.');
        }
        setOrchestratorStatus('Triggering n8n workflow...');
        const n8nData = await triggerN8NWorkflow(topic, n8nUrl);
        setResearch(n8nData.research);
        setAnalysis(n8nData.analysis);
        setReport(n8nData.report);
        await saveReport(n8nData.research, n8nData.analysis, n8nData.report);
      } else {
        // Local Execution with Orchestrator (Handoffs & Guardrails)
        const result = await runMarketAnalysisOrchestrator(topic, (s) => setOrchestratorStatus(s));
        setResearch(result.research);
        setAnalysis(result.analysis);
        setReport(result.report);
        setValidation(result.validation);
        await saveReport(result.research, result.analysis, result.report);
      }
      
      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during the agentic workflow.');
      setStatus('error');
    }
  };

  const copyN8NJson = async () => {
    const json = JSON.stringify(n8nWorkflowJSON, null, 2);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(json);
        alert('n8n Workflow JSON copied to clipboard!');
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      console.error('Clipboard copy failed', err);
      // Fallback: Select text in the pre tag
      const pre = document.getElementById('n8n-json-display');
      if (pre) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        alert('Clipboard API restricted. The JSON text has been selected below. Please press Ctrl+C (or Cmd+C) to copy.');
      }
    }
  };

  const downloadN8NJson = () => {
    const json = JSON.stringify(n8nWorkflowJSON, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market-mind-n8n-workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadReport = () => {
    if (!report) return;
    const content = `# ${report.title}\n\n## Executive Summary\n${report.executiveSummary}\n\n## Detailed Analysis\n${report.detailedAnalysis}\n\n## Strategic Recommendations\n${report.recommendations.map(r => `- ${r}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const swotData = analysis ? [
    { subject: 'Strengths', A: analysis.swot.strengths.length * 20, fullMark: 100 },
    { subject: 'Weaknesses', A: analysis.swot.weaknesses.length * 20, fullMark: 100 },
    { subject: 'Opportunities', A: analysis.swot.opportunities.length * 20, fullMark: 100 },
    { subject: 'Threats', A: analysis.swot.threats.length * 20, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Market Analysis</span>
          </div>
          
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('dashboard')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                viewMode === 'dashboard' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <BarChart3 className="w-4 h-4" /> Dashboard
            </button>
            <button 
              onClick={() => setViewMode('n8n')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                viewMode === 'n8n' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Workflow className="w-4 h-4" /> n8n Workflow
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                <button onClick={logout} className="text-xs hover:text-brand-600 transition-colors">Sign Out</button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="px-4 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-all"
              >
                Sign In
              </button>
            )}
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
              title="Settings"
            >
              <Code className="w-4 h-4" />
              <span className="text-xs">Config</span>
            </button>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Agentic AI</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-brand-600" />
                  Execution Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Execution Mode</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                      <button 
                        onClick={() => setExecMode('local')}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                          execMode === 'local' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500"
                        )}
                      >
                        Local Agents
                      </button>
                      <button 
                        onClick={() => setExecMode('n8n')}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                          execMode === 'n8n' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500"
                        )}
                      >
                        n8n Workflow
                      </button>
                    </div>
                  </div>
                  {execMode === 'n8n' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <label className="block text-sm font-medium text-slate-700 mb-2">n8n Webhook URL</label>
                      <input 
                        type="text" 
                        value={n8nUrl}
                        onChange={(e) => setN8nUrl(e.target.value)}
                        placeholder="https://your-n8n-instance.com/webhook/..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" /> 
                        Ensure your local n8n is exposed via ngrok or similar.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {viewMode === 'dashboard' ? (
          <>
            {/* Search Section */}
            <section className="mb-12">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Market Analysis
                </h1>
                <p className="text-lg text-slate-600">
                  Deploy a team of AI agents to research, analyze, and report on any market topic in real-time.
                </p>
                {status !== 'idle' && status !== 'completed' && status !== 'error' && (
                  <p className="mt-4 text-brand-600 font-medium animate-pulse flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {orchestratorStatus}
                  </p>
                )}
              </div>

              <form onSubmit={startWorkflow} className="max-w-2xl mx-auto relative">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a market topic (e.g., Electric Vehicle Market in 2026)"
                    className="block w-full pl-12 pr-32 py-4 border border-slate-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 transition-all"
                    disabled={status !== 'idle' && status !== 'completed' && status !== 'error'}
                  />
                  <div className="absolute inset-y-2 right-2">
                    <button
                      type="submit"
                      disabled={status !== 'idle' && status !== 'completed' && status !== 'error'}
                      className="h-full px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {status === 'idle' || status === 'completed' || status === 'error' ? (
                        <>Run Agents <ArrowRight className="w-4 h-4" /></>
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            {/* Workflow Progress */}
            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                  <AgentCard 
                    icon={<Search className="w-5 h-5" />}
                    name="Researcher Agent"
                    description="Gathering live market data and sources..."
                    active={status === 'researching'}
                    completed={!!research}
                  />
                  <AgentCard 
                    icon={<BarChart3 className="w-5 h-5" />}
                    name="Analyst Agent"
                    description="Performing SWOT and trend analysis..."
                    active={status === 'analyzing'}
                    completed={!!analysis}
                  />
                  <AgentCard 
                    icon={<FileText className="w-5 h-5" />}
                    name="Editor Agent"
                    description="Synthesizing final intelligence report..."
                    active={status === 'editing'}
                    completed={!!report}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error State */}
            {error && (
              <div className="max-w-2xl mx-auto mb-12 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Workflow Interrupted</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* Results Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* History Sidebar */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-600" />
                    Recent Reports
                  </h3>
                  {!user ? (
                    <p className="text-xs text-slate-500 italic">Sign in to see your history.</p>
                  ) : history.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No reports yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => loadFromHistory(item)}
                          className="w-full text-left p-3 rounded-xl border border-slate-50 hover:border-brand-100 hover:bg-brand-50 transition-all group"
                        >
                          <p className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-700">{item.topic}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {item.createdAt instanceof Timestamp ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Left Column: Report */}
              <div className="lg:col-span-6 space-y-8">
                {report && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-3xl font-bold text-slate-900">{report.title}</h2>
                          {validation && (
                            <span className={cn(
                              "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                              validation.score >= 8 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                              Quality Score: {validation.score}/10
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Market Intelligence Report</span>
                          <span>•</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button 
                        onClick={downloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Download Report
                      </button>
                    </div>
                    <div className="p-8">
                      <div className="markdown-body">
                        <h3>Executive Summary</h3>
                        <p>{report.executiveSummary}</p>
                        <Markdown>{report.detailedAnalysis}</Markdown>
                        <h3>Strategic Recommendations</h3>
                        <ul>
                          {report.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-3 space-y-8">
                {analysis && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-brand-600" />
                      SWOT Analysis
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={swotData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <Radar
                            name="Market"
                            dataKey="A"
                            stroke="#0ea5e9"
                            fill="#0ea5e9"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-green-50 text-green-700 rounded-lg font-medium">Strengths: {analysis.swot.strengths.length}</div>
                      <div className="p-2 bg-red-50 text-red-700 rounded-lg font-medium">Weaknesses: {analysis.swot.weaknesses.length}</div>
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-lg font-medium">Opportunities: {analysis.swot.opportunities.length}</div>
                      <div className="p-2 bg-orange-50 text-orange-700 rounded-lg font-medium">Threats: {analysis.swot.threats.length}</div>
                    </div>
                  </motion.div>
                )}

                {analysis && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-brand-600" />
                      Key Market Trends
                    </h3>
                    <ul className="space-y-3">
                      {analysis.marketTrends.map((trend, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {research && research.sources.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Search className="w-5 h-5 text-brand-600" />
                      Grounding Sources
                    </h3>
                    <div className="space-y-3">
                      {research.sources.map((source, i) => {
                        const isDoc = source.uri.toLowerCase().endsWith('.pdf') || source.uri.toLowerCase().endsWith('.doc') || source.uri.toLowerCase().endsWith('.docx');
                        return (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={source.uri}
                            className="group block p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50 transition-all"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                {isDoc ? (
                                  <File className="w-4 h-4 text-slate-400 group-hover:text-brand-500 flex-shrink-0" />
                                ) : (
                                  <Globe className="w-4 h-4 text-slate-400 group-hover:text-brand-500 flex-shrink-0" />
                                )}
                                <span className="text-sm font-medium text-slate-700 group-hover:text-brand-700 truncate">
                                  {source.title}
                                </span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-500 flex-shrink-0" />
                            </div>
                            <span className="text-[10px] text-slate-400 truncate block mt-1 ml-6">
                              {new URL(source.uri).hostname}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* n8n Workflow View */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">n8n Workflow Blueprint</h2>
                  <p className="text-slate-500 mt-1">Visual representation of the agentic orchestration in n8n.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={copyN8NJson}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all"
                  >
                    <Code className="w-4 h-4" /> Copy JSON
                  </button>
                  <button 
                    onClick={downloadN8NJson}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download .json
                  </button>
                </div>
              </div>
              
              <div className="h-[400px] w-full bg-slate-50 relative">
                <ReactFlow
                  nodes={initialNodes}
                  edges={initialEdges}
                  fitView
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                >
                  <Background color="#cbd5e1" gap={20} />
                  <Controls />
                </ReactFlow>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-brand-600" />
                  Workflow Steps Explained
                </h3>
                <div className="space-y-6">
                  <StepInfo 
                    number="1"
                    title="Webhook Entry"
                    detail="The workflow starts when a POST request is received with the 'topic' parameter. This allows integration with any external app."
                  />
                  <StepInfo 
                    number="2"
                    title="Researcher Node"
                    detail="Calls Gemini 1.5 Flash with the Google Search tool. It performs the heavy lifting of finding real-time data."
                  />
                  <StepInfo 
                    number="3"
                    title="Analyst Node"
                    detail="Processes the research data. It uses a structured prompt to extract SWOT and Trends into a JSON format."
                  />
                  <StepInfo 
                    number="4"
                    title="Editor Node"
                    detail="The final AI step. It takes all previous outputs and writes the professional report in Markdown."
                  />
                  <StepInfo 
                    number="5"
                    title="Callback Node"
                    detail="Sends the final report back to the original requester via an HTTP POST request."
                  />
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl shadow-sm p-8 overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-brand-400" />
                    n8n JSON Snippet
                  </h3>
                </div>
                <pre 
                  id="n8n-json-display"
                  className="text-xs text-brand-100 font-mono overflow-auto max-h-[400px] custom-scrollbar select-all"
                >
                  {JSON.stringify(n8nWorkflowJSON, null, 2)}
                </pre>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 Market Analysis. Powered by Gemini 3.1 Pro & Agentic Workflows.</p>
        </div>
      </footer>
    </div>
  );
}

function AgentCard({ icon, name, description, active, completed }: { 
  icon: React.ReactNode, 
  name: string, 
  description: string, 
  active: boolean, 
  completed: boolean 
}) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4",
      active ? "bg-brand-50 border-brand-200 shadow-md scale-105" : "bg-white border-slate-100",
      completed ? "border-green-100 bg-green-50/30" : ""
    )}>
      <div className={cn(
        "p-2.5 rounded-xl transition-colors",
        active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500",
        completed ? "bg-green-600 text-white" : ""
      )}>
        {completed ? <CheckCircle2 className="w-5 h-5" /> : icon}
      </div>
      <div>
        <h3 className={cn(
          "font-bold text-slate-900",
          completed ? "text-green-800" : ""
        )}>{name}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
        {active && (
          <div className="mt-3 flex gap-1">
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-1 w-8 bg-brand-600 rounded-full" 
            />
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="h-1 w-8 bg-brand-600 rounded-full" 
            />
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="h-1 w-8 bg-brand-600 rounded-full" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StepInfo({ number, title, detail }: { number: string, title: string, detail: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{detail}</p>
      </div>
    </div>
  );
}
