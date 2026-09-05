import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquareCode, Send, Sparkles, Cpu, Bot, User, BookOpen,
  Plus, Trash2, ChevronRight, MessageSquare, RefreshCw, AlertCircle, Menu, X, ArrowUpRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { MentorMessage, MentorConversation } from '../types';
import { CopyButton } from '../components/UI/CopyButton';

export const MentorPage: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<MentorConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [provider, setProvider] = useState('gemini');
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial Load: Fetch conversations & greeting
  useEffect(() => {
    loadInitialData();
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadInitialData = async () => {
    setInitialLoading(true);
    try {
      // 1. Load context-aware greeting & quick prompts
      const greetingData = await apiService.getMentorGreeting(1);
      setQuickPrompts(greetingData.quick_prompts || []);

      // 2. Load conversations
      const convList = await apiService.getMentorConversations(1);
      setConversations(convList);

      if (convList.length > 0) {
        const firstConvId = convList[0].id;
        setActiveConvId(firstConvId);

        // Fetch messages for first conversation
        const details = await apiService.getMentorConversationDetails(1, firstConvId);
        if (details.messages && details.messages.length > 0) {
          setMessages(details.messages);
        } else {
          // Provide automatic initial greeting message if conversation is empty
          setMessages([
            {
              id: Date.now(),
              sender: 'ai',
              content: greetingData.greeting_text,
              provider_used: 'gemini',
              grounded_sources: ['Project Blueprint', 'Student Profile'],
              timestamp: new Date().toISOString()
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to load mentor data:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const selectConversation = async (convId: number) => {
    setActiveConvId(convId);
    setSidebarOpen(false);
    setErrorMsg(null);
    try {
      const details = await apiService.getMentorConversationDetails(1, convId);
      if (details.messages && details.messages.length > 0) {
        setMessages(details.messages);
      } else {
        const greetingData = await apiService.getMentorGreeting(1);
        setMessages([
          {
            id: Date.now(),
            sender: 'ai',
            content: greetingData.greeting_text,
            provider_used: 'gemini',
            grounded_sources: ['Project Blueprint'],
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load conversation details:', err);
    }
  };

  const handleNewChat = async () => {
    try {
      const newConv = await apiService.createMentorConversation(1, 'New Conversation');
      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      setErrorMsg(null);

      const greetingData = await apiService.getMentorGreeting(1);
      setMessages([
        {
          id: Date.now(),
          sender: 'ai',
          content: greetingData.greeting_text,
          provider_used: 'gemini',
          grounded_sources: ['Project Context'],
          timestamp: new Date().toISOString()
        }
      ]);
      setSidebarOpen(false);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, convId: number) => {
    e.stopPropagation();
    try {
      await apiService.deleteMentorConversation(1, convId);
      const updated = conversations.filter(c => c.id !== convId);
      setConversations(updated);

      if (activeConvId === convId) {
        if (updated.length > 0) {
          selectConversation(updated[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    setInput('');
    setErrorMsg(null);

    const userMsg: MentorMessage = {
      id: Date.now(),
      sender: 'user',
      content: messageText,
      provider_used: provider,
      grounded_sources: [],
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await apiService.sendMentorMessage(1, messageText, activeConvId || undefined, provider);
      
      if (res.conversation_id && res.conversation_id !== activeConvId) {
        setActiveConvId(res.conversation_id);
      }

      if (res.conversation_title) {
        setConversations(prev =>
          prev.map(c => c.id === (res.conversation_id || activeConvId) ? { ...c, title: res.conversation_title! } : c)
        );
      }

      setMessages(prev => [...prev, res.message]);
    } catch (err) {
      console.error('Mentor chat error:', err);
      setErrorMsg('I encountered an issue generating a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to parse Action Links like [Open Code Review →](/code-review)
  const renderMessageContent = (content: string) => {
    const actionLinkRegex = /\[(.*?)\]\((.*?)\)/g;

    return content.split('```').map((chunk, idx) => {
      if (idx % 2 === 1) {
        // Code Block
        const lines = chunk.trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const codeText = lang ? lines.slice(1).join('\n') : chunk;

        return (
          <div key={idx} className="my-3 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 p-3.5 font-mono text-[11px] text-slate-200 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="uppercase font-bold tracking-wider">{lang || 'code'}</span>
              <CopyButton text={codeText.trim()} label="Copy Snippet" />
            </div>
            <pre className="overflow-x-auto text-slate-100 leading-relaxed font-mono">{codeText.trim()}</pre>
          </div>
        );
      }

      // Regular Paragraphs with Action Link parsing
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = actionLinkRegex.exec(chunk)) !== null) {
        if (match.index > lastIndex) {
          parts.push(chunk.substring(lastIndex, match.index));
        }

        const linkText = match[1];
        const linkPath = match[2];

        parts.push(
          <button
            key={match.index}
            onClick={() => {
              if (linkPath.includes('/code-review')) navigate('/review?tab=review');
              else if (linkPath.includes('/reality-check')) navigate('/review?tab=reality');
              else if (linkPath.includes('/health')) navigate('/review?tab=health');
              else if (linkPath.includes('/improvements')) navigate('/review?tab=improvements');
              else if (linkPath.includes('/feasibility')) navigate('/project?tab=feasibility');
              else if (linkPath.includes('/blueprint')) navigate('/project?tab=blueprint');
              else if (linkPath.includes('/roadmap')) navigate('/project?tab=roadmap');
              else navigate(linkPath);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 my-1 rounded-lg text-xs font-bold bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 hover:bg-brand-600/20 transition cursor-pointer"
          >
            <span>{linkText}</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < chunk.length) {
        parts.push(chunk.substring(lastIndex));
      }

      return (
        <div key={idx} className="whitespace-pre-wrap leading-relaxed font-sans">
          {parts}
        </div>
      );
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-4.5rem)] flex gap-6 animate-fadeIn">
      {/* 1. Conversations Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-900 border-r md:border border-slate-200 dark:border-slate-800 md:rounded-3xl flex flex-col justify-between p-4 transition-all duration-300 shadow-2xl md:shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareCode className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight">AI Mentor Chats</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">Recent Conversations</span>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`group flex items-center justify-between p-3 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  activeConvId === conv.id
                    ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                  <span className="truncate">{conv.title}</span>
                </div>

                <button
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>ProjectReady Context RAG</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
          </span>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 md:hidden"
        />
      )}

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between min-w-0 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-sm space-y-4">
        {/* Header Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">ProjectReady AI Mentor</h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Project-Aware
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">AI Clinical Decision Support for Diabetic Retinopathy</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="gemini" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Gemini 1.5 Pro</option>
                <option value="openai" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">OpenAI GPT-4o</option>
                <option value="nvidia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">NVIDIA Llama 3.1</option>
                <option value="ollama" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Ollama (Local Privacy)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-0">
          {initialLoading ? (
            <div className="p-8 text-center text-xs text-brand-600 dark:text-brand-400 font-medium animate-pulse flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading AI Mentor project context...
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white font-medium rounded-tr-none shadow-lg shadow-brand-600/15'
                      : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none backdrop-blur-md shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 dark:border-slate-800/60 pb-1.5">
                    <span className="font-bold text-[10px] opacity-80">{m.sender === 'user' ? 'You' : 'ProjectReady AI Mentor'}</span>
                    {m.sender === 'ai' && (
                      <CopyButton text={m.content} label="Copy Answer" />
                    )}
                  </div>

                  <div className="space-y-2">
                    {renderMessageContent(m.content)}
                  </div>

                  {m.sender === 'ai' && m.grounded_sources && m.grounded_sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <BookOpen className="w-3 h-3 text-brand-500 dark:text-brand-400" />
                      <span>Context: </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{m.grounded_sources.join(', ')}</span>
                      <span className="ml-auto font-mono text-[9px] text-brand-600 dark:text-brand-400 uppercase font-bold">[{m.provider_used}]</span>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-slate-200 font-bold text-xs shrink-0">
                    AR
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-brand-600 dark:text-brand-400 font-semibold animate-pulse p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 max-w-sm">
              <Bot className="w-4 h-4 animate-spin" /> AI Mentor evaluating project context & code review...
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
              <button
                onClick={() => handleSendMessage()}
                className="ml-auto underline font-bold"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Contextual Quick Prompts */}
        {quickPrompts.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 text-[11px] custom-scrollbar shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 shrink-0" />
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500/40 hover:text-slate-900 dark:hover:text-white transition whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-end gap-2 shrink-0">
          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI Mentor about implementation, architecture, or score fixes... (Press Enter to send)"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
