import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, GitFork, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

const GitHubShowcase = () => {
  const [usernameInput, setUsernameInput] = useState('facebook');
  const [username, setUsername] = useState('facebook');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=24`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('GitHub user not found. Please try another username.');
          }

          if (response.status === 403) {
            throw new Error('GitHub rate limit reached. Please try again later.');
          }

          throw new Error('Unable to fetch repositories right now.');
        }

        const data = (await response.json()) as GitHubRepo[];
        setRepos(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error occurred.';
        setError(message);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  const visibleRepos = useMemo(() => {
    return repos.filter((repo) => repo.name.toLowerCase().includes(search.toLowerCase().trim()));
  }, [repos, search]);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text glow-text mb-3">
            GitHub Repository Website
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore open-source repositories by any GitHub user. Search by username, then filter projects by
            repository name.
          </p>
        </motion.div>

        <div className="glass rounded-xl p-4 md:p-6 mb-8 grid gap-3 md:grid-cols-[1fr,auto]">
          <div className="flex items-center gap-2">
            <Github className="text-primary" size={18} />
            <Input
              value={usernameInput}
              onChange={(event) => setUsernameInput(event.target.value)}
              placeholder="Enter GitHub username (e.g. vercel)"
              aria-label="GitHub username"
            />
          </div>
          <Button
            variant="glow"
            onClick={() => setUsername(usernameInput.trim() || 'facebook')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Repositories'}
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Search className="text-muted-foreground" size={16} />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter repositories by name"
            aria-label="Filter repositories"
          />
        </div>

        {error && <p className="text-sm text-destructive mb-6">{error}</p>}

        {!error && !loading && visibleRepos.length === 0 && (
          <p className="text-muted-foreground text-sm">No repositories match your filters.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg break-all">{repo.name}</CardTitle>
                  <CardDescription>{repo.description || 'No description provided.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star size={14} /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={14} /> {repo.forks_count}
                    </span>
                    <span>{repo.language || 'Unknown language'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm"
                  >
                    View on GitHub <ExternalLink size={14} />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubShowcase;
