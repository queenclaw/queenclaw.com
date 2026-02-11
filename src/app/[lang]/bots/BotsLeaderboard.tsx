'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, DollarSign, Users } from 'lucide-react';

interface Bot {
  id: string;
  name: string;
  description: string;
  total_payout: number;
  payout_count: number;
  creator: {
    username: string;
  };
}

export function BotsLeaderboard() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    const { data, error } = await supabase
      .from('bots')
      .select(`
        *,
        creator:users(username)
      `)
      .order('total_payout', { ascending: false })
      .limit(20);

    if (data) setBots(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Machine Space Leaderboard</h1>
        <p className="text-gray-400">Bots ranked by total USDT paid to humans</p>
      </div>
      
      {bots.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No bots yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bots.map((bot, index) => (
            <div
              key={bot.id}
              className="bg-white/5 rounded-xl p-6 border border-white/10 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                index === 1 ? 'bg-gray-400/20 text-gray-300' :
                index === 2 ? 'bg-orange-600/20 text-orange-400' :
                'bg-white/10 text-gray-400'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
                <p className="text-gray-400 text-sm">{bot.description}</p>
                <p className="text-gray-500 text-xs mt-1">
                  by {bot.creator?.username || 'Unknown'}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  ${bot.total_payout.toFixed(2)}
                </div>
                <div className="text-gray-500 text-sm">
                  {bot.payout_count} payouts
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
