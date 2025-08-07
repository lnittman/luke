'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  GitBranch, 
  Settings2, 
  Plus, 
  Trash2, 
  Save,
  AlertCircle,
  CheckCircle,
  Code2,
  FileText,
  Target,
  Shield,
} from 'lucide-react';

interface Repository {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  analysisEnabled: boolean;
  analysisDepth: 'basic' | 'standard' | 'deep';
}

interface AnalysisRule {
  id: string;
  repositoryId: string;
  name: string;
  description: string | null;
  enabled: boolean;
  priority: number;
  ruleType: 'prompt' | 'pattern' | 'focus' | 'ignore';
  ruleContent: string;
  applyTo: {
    commits: boolean;
    pullRequests: boolean;
    issues: boolean;
    reviews: boolean;
  };
}

export default function LogsSettingsPage() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [rules, setRules] = useState<Record<string, AnalysisRule[]>>({});
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Global preferences
  const [preferences, setPreferences] = useState({
    defaultAnalysisDepth: 'deep' as 'basic' | 'standard' | 'deep',
    focusAreas: ['architecture', 'performance', 'security', 'code-quality'],
    aiVerbosity: 'detailed' as 'concise' | 'standard' | 'detailed',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/logs/settings');
      const data = await response.json();
      setRepositories(data.repositories || []);
      setRules(data.rules || {});
      setPreferences(data.preferences || preferences);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    }
  };

  const addRepository = async () => {
    if (!newRepoUrl) return;
    
    setLoading(true);
    try {
      // Parse GitHub URL
      const match = newRepoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL');
      }
      
      const [, owner, name] = match;
      
      const response = await fetch('/api/logs/settings/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, name: name.replace('.git', '') }),
      });
      
      if (!response.ok) throw new Error('Failed to add repository');
      
      const repo = await response.json();
      setRepositories([...repositories, repo]);
      setNewRepoUrl('');
      setMessage({ type: 'success', text: 'Repository added successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to add repository' });
    } finally {
      setLoading(false);
    }
  };

  const removeRepository = async (repoId: string) => {
    if (!confirm('Remove this repository and all its rules?')) return;
    
    try {
      const response = await fetch(`/api/logs/settings/repositories/${repoId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove repository');
      
      setRepositories(repositories.filter(r => r.id !== repoId));
      delete rules[repoId];
      setRules({ ...rules });
      setMessage({ type: 'success', text: 'Repository removed' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove repository' });
    }
  };

  const addRule = (repoId: string) => {
    const newRule: AnalysisRule = {
      id: `temp-${Date.now()}`,
      repositoryId: repoId,
      name: 'New Rule',
      description: null,
      enabled: true,
      priority: 0,
      ruleType: 'prompt',
      ruleContent: '',
      applyTo: {
        commits: true,
        pullRequests: true,
        issues: true,
        reviews: true,
      },
    };
    
    setRules({
      ...rules,
      [repoId]: [...(rules[repoId] || []), newRule],
    });
  };

  const updateRule = (repoId: string, ruleId: string, updates: Partial<AnalysisRule>) => {
    setRules({
      ...rules,
      [repoId]: rules[repoId].map(r => 
        r.id === ruleId ? { ...r, ...updates } : r
      ),
    });
  };

  const removeRule = (repoId: string, ruleId: string) => {
    setRules({
      ...rules,
      [repoId]: rules[repoId].filter(r => r.id !== ruleId),
    });
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/logs/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositories,
          rules,
          preferences,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      setMessage({ type: 'success', text: 'Settings saved successfully' });
      
      // Reload to get proper IDs for new items
      await loadSettings();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto py-12"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings2 className="w-8 h-8" />
            <h1 className="text-3xl font-mono font-bold">Activity Logs Settings</h1>
          </div>
          <button
            onClick={() => router.push('/logs')}
            className="brutalist-button px-4 py-2"
          >
            Back to Logs
          </button>
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 p-4 mb-6 rounded border-2 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-900' 
                : 'bg-red-50 border-red-500 text-red-900'
            }`}
          >
            {message.type === 'success' ? <CheckCircle /> : <AlertCircle />}
            <span className="font-mono">{message.text}</span>
          </motion.div>
        )}

        {/* Global Preferences */}
        <Section>
          <h2 className="text-xl font-mono font-bold mb-4">Global Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono mb-2">Default Analysis Depth</label>
              <select
                value={preferences.defaultAnalysisDepth}
                onChange={(e) => setPreferences({
                  ...preferences,
                  defaultAnalysisDepth: e.target.value as any,
                })}
                className="w-full p-2 font-mono border-2 border-foreground rounded"
              >
                <option value="basic">Basic - Quick summary</option>
                <option value="standard">Standard - Balanced analysis</option>
                <option value="deep">Deep - Comprehensive insights</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono mb-2">Focus Areas</label>
              <div className="flex flex-wrap gap-2">
                {['architecture', 'performance', 'security', 'code-quality', 'testing', 'documentation'].map(area => (
                  <button
                    key={area}
                    onClick={() => {
                      const areas = preferences.focusAreas.includes(area)
                        ? preferences.focusAreas.filter(a => a !== area)
                        : [...preferences.focusAreas, area];
                      setPreferences({ ...preferences, focusAreas: areas });
                    }}
                    className={`px-3 py-1 font-mono text-sm border-2 rounded transition-colors ${
                      preferences.focusAreas.includes(area)
                        ? 'bg-accent-1 text-white border-accent-1'
                        : 'border-foreground hover:bg-surface-1'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono mb-2">AI Report Verbosity</label>
              <select
                value={preferences.aiVerbosity}
                onChange={(e) => setPreferences({
                  ...preferences,
                  aiVerbosity: e.target.value as any,
                })}
                className="w-full p-2 font-mono border-2 border-foreground rounded"
              >
                <option value="concise">Concise - Just the facts</option>
                <option value="standard">Standard - Balanced detail</option>
                <option value="detailed">Detailed - Comprehensive analysis</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Repositories */}
        <Section>
          <h2 className="text-xl font-mono font-bold mb-4">Tracked Repositories</h2>
          
          {/* Add Repository */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newRepoUrl}
              onChange={(e) => setNewRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="flex-1 p-2 font-mono border-2 border-foreground rounded"
            />
            <button
              onClick={addRepository}
              disabled={loading || !newRepoUrl}
              className="brutalist-button px-4 py-2 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Repository
            </button>
          </div>

          {/* Repository List */}
          <div className="space-y-4">
            {repositories.map(repo => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-2 border-foreground rounded p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <GitBranch className="w-5 h-5 mt-1" />
                    <div>
                      <h3 className="font-mono font-bold">{repo.fullName}</h3>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                        {repo.language && (
                          <span className="px-2 py-1 bg-surface-1 rounded">{repo.language}</span>
                        )}
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={repo.analysisEnabled}
                            onChange={(e) => {
                              const updated = repositories.map(r =>
                                r.id === repo.id ? { ...r, analysisEnabled: e.target.checked } : r
                              );
                              setRepositories(updated);
                            }}
                          />
                          Enabled
                        </label>
                        <select
                          value={repo.analysisDepth}
                          onChange={(e) => {
                            const updated = repositories.map(r =>
                              r.id === repo.id ? { ...r, analysisDepth: e.target.value as any } : r
                            );
                            setRepositories(updated);
                          }}
                          className="px-2 py-1 border border-foreground rounded"
                        >
                          <option value="basic">Basic</option>
                          <option value="standard">Standard</option>
                          <option value="deep">Deep</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeRepository(repo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Repository Rules */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-mono text-sm font-bold">Analysis Rules</h4>
                    <button
                      onClick={() => {
                        setSelectedRepo(repo.id);
                        addRule(repo.id);
                      }}
                      className="text-xs font-mono px-2 py-1 border border-foreground rounded hover:bg-surface-1"
                    >
                      + Add Rule
                    </button>
                  </div>

                  {rules[repo.id]?.length > 0 ? (
                    <div className="space-y-2">
                      {rules[repo.id].map(rule => (
                        <div
                          key={rule.id}
                          className="p-3 bg-surface-1 rounded border"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <input
                              type="text"
                              value={rule.name}
                              onChange={(e) => updateRule(repo.id, rule.id, { name: e.target.value })}
                              className="font-mono font-bold bg-transparent border-b border-dashed"
                              placeholder="Rule name"
                            />
                            <button
                              onClick={() => removeRule(repo.id, rule.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                              <select
                                value={rule.ruleType}
                                onChange={(e) => updateRule(repo.id, rule.id, { 
                                  ruleType: e.target.value as any 
                                })}
                                className="px-2 py-1 font-mono border rounded"
                              >
                                <option value="prompt">Prompt</option>
                                <option value="pattern">Pattern</option>
                                <option value="focus">Focus</option>
                                <option value="ignore">Ignore</option>
                              </select>
                              
                              <input
                                type="number"
                                value={rule.priority}
                                onChange={(e) => updateRule(repo.id, rule.id, { 
                                  priority: parseInt(e.target.value) 
                                })}
                                className="w-20 px-2 py-1 font-mono border rounded"
                                placeholder="Priority"
                              />
                              
                              <label className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={rule.enabled}
                                  onChange={(e) => updateRule(repo.id, rule.id, { 
                                    enabled: e.target.checked 
                                  })}
                                />
                                <span className="font-mono">Enabled</span>
                              </label>
                            </div>

                            <textarea
                              value={rule.ruleContent}
                              onChange={(e) => updateRule(repo.id, rule.id, { 
                                ruleContent: e.target.value 
                              })}
                              className="w-full p-2 font-mono text-xs border rounded"
                              rows={3}
                              placeholder={
                                rule.ruleType === 'prompt' 
                                  ? 'Enter analysis instructions (e.g., "Focus on security implications of database queries")'
                                  : rule.ruleType === 'pattern'
                                  ? 'Enter regex pattern to match'
                                  : rule.ruleType === 'focus'
                                  ? 'Enter area to focus on (e.g., "performance optimizations")'
                                  : 'Enter pattern to ignore'
                              }
                            />

                            <div className="flex gap-4 text-xs">
                              <label className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={rule.applyTo.commits}
                                  onChange={(e) => updateRule(repo.id, rule.id, {
                                    applyTo: { ...rule.applyTo, commits: e.target.checked }
                                  })}
                                />
                                Commits
                              </label>
                              <label className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={rule.applyTo.pullRequests}
                                  onChange={(e) => updateRule(repo.id, rule.id, {
                                    applyTo: { ...rule.applyTo, pullRequests: e.target.checked }
                                  })}
                                />
                                PRs
                              </label>
                              <label className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={rule.applyTo.issues}
                                  onChange={(e) => updateRule(repo.id, rule.id, {
                                    applyTo: { ...rule.applyTo, issues: e.target.checked }
                                  })}
                                />
                                Issues
                              </label>
                              <label className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={rule.applyTo.reviews}
                                  onChange={(e) => updateRule(repo.id, rule.id, {
                                    applyTo: { ...rule.applyTo, reviews: e.target.checked }
                                  })}
                                />
                                Reviews
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-muted-foreground">
                      No rules configured. Add rules to customize analysis.
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {repositories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground font-mono">
                No repositories configured. Add a repository to get started.
              </div>
            )}
          </div>
        </Section>

        {/* Example Rules */}
        <Section>
          <h2 className="text-xl font-mono font-bold mb-4">Example Rules</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border-2 border-dashed border-muted-foreground rounded">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                <h3 className="font-mono font-bold text-sm">Security Focus</h3>
              </div>
              <p className="text-xs font-mono text-muted-foreground mb-2">
                Type: Prompt | Priority: 10
              </p>
              <code className="text-xs block p-2 bg-surface-1 rounded">
                Analyze all code for security vulnerabilities, especially authentication, 
                authorization, input validation, and data sanitization. Flag any potential 
                OWASP Top 10 issues.
              </code>
            </div>

            <div className="p-4 border-2 border-dashed border-muted-foreground rounded">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4" />
                <h3 className="font-mono font-bold text-sm">Performance Analysis</h3>
              </div>
              <p className="text-xs font-mono text-muted-foreground mb-2">
                Type: Focus | Priority: 8
              </p>
              <code className="text-xs block p-2 bg-surface-1 rounded">
                database query optimization, caching strategies, algorithm complexity, 
                memory usage patterns, async/await usage
              </code>
            </div>

            <div className="p-4 border-2 border-dashed border-muted-foreground rounded">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                <h3 className="font-mono font-bold text-sm">Documentation Check</h3>
              </div>
              <p className="text-xs font-mono text-muted-foreground mb-2">
                Type: Prompt | Priority: 5
              </p>
              <code className="text-xs block p-2 bg-surface-1 rounded">
                Verify that all public APIs have proper documentation. Check for missing 
                JSDoc comments, outdated README sections, and incomplete type definitions.
              </code>
            </div>

            <div className="p-4 border-2 border-dashed border-muted-foreground rounded">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                <h3 className="font-mono font-bold text-sm">Tech Debt Tracker</h3>
              </div>
              <p className="text-xs font-mono text-muted-foreground mb-2">
                Type: Pattern | Priority: 6
              </p>
              <code className="text-xs block p-2 bg-surface-1 rounded">
                (TODO|FIXME|HACK|XXX|OPTIMIZE|REFACTOR):\s*(.+)
              </code>
            </div>
          </div>
        </Section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="brutalist-button px-6 py-3 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </motion.div>
    </Container>
  );
}