'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Star, 
  Download, 
  ArrowLeft, 
  Share2, 
  Flag,
  Check,
  Clock,
  Shield,
  Globe,
  Zap,
  User,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Skill {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  provider_name: string;
  provider_avatar: string;
  provider_id?: string;
  price: string;
  price_amount: number;
  rating: number;
  reviews_count: number;
  downloads_count: number;
  tags: string[];
  category_id: string;
  category_name?: string;
  version: string;
  last_updated: string;
  requirements?: string[];
  features?: string[];
  screenshots?: string[];
  documentation_url?: string;
  github_url?: string;
  website_url?: string;
  license: string;
  active: boolean;
  created_at: string;
}

interface Review {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  rating: number;
  content: string;
  created_at: string;
}

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.id as string;
  
  const [skill, setSkill] = useState<Skill | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (skillId) {
      fetchSkill();
      fetchReviews();
      checkPurchaseStatus();
    }
  }, [skillId]);

  const fetchSkill = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select(`
        *,
        category:skill_categories(name)
      `)
      .eq('id', skillId)
      .single();

    if (data) {
      setSkill({
        ...data,
        category_name: data.category?.name
      });
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('skill_reviews')
      .select(`
        *,
        user:users(username, avatar_url)
      `)
      .eq('skill_id', skillId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setReviews(data.map((r: any) => ({
        ...r,
        username: r.user?.username || 'Anonymous',
        avatar_url: r.user?.avatar_url
      })));
    }
  };

  const checkPurchaseStatus = async () => {
    // TODO: Check if current user has purchased this skill
    setIsPurchased(false);
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    // TODO: Implement actual purchase flow with Solana
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPurchased(true);
    setPurchasing(false);
  };

  const handleDownload = () => {
    // TODO: Implement download flow
    alert('Download starting...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Skill Not Found</h1>
          <p className="text-white/60 mb-6">The skill you're looking for doesn't exist.</p>
          <Link href="/en/marketplace">
            <Button variant="outline">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/en/marketplace" 
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div className="flex gap-6">
              <div className="text-6xl">{skill.provider_avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                    {skill.category_name || 'Uncategorized'}
                  </span>
                  <span className="text-white/40 text-sm">v{skill.version}</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
                <p className="text-white/60 mb-4">{skill.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{skill.rating}</span>
                    <span className="text-white/40">({skill.reviews_count})</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <Download className="w-4 h-4" />
                    <span>{skill.downloads_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>Updated {new Date(skill.last_updated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {skill.tags?.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold mb-4">About</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/70 leading-relaxed whitespace-pre-line">
                  {skill.long_description || skill.description}
                </p>
              </div>
            </section>

            {/* Features */}
            {skill.features && skill.features.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Features</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {skill.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Requirements */}
            {skill.requirements && skill.requirements.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {skill.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Reviews</h2>
                <Button variant="outline" size="sm">Write a Review</Button>
              </div>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-xl">
                  <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">No reviews yet</p>
                  <p className="text-white/40 text-sm">Be the first to review this skill</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            {review.avatar_url ? (
                              <img src={review.avatar_url} alt="" className="w-full h-full rounded-full" />
                            ) : (
                              <User className="w-5 h-5 text-white/60" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{review.username}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-white/60 text-sm mb-2">{review.content}</p>
                            <span className="text-white/40 text-xs">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="bg-white/5 border-white/10 sticky top-32">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-1 ${skill.price === 'Free' ? 'text-green-400' : 'text-white'}`}>
                    {skill.price}
                  </div>
                  {skill.price !== 'Free' && (
                    <p className="text-white/40 text-sm">One-time purchase</p>
                  )}
                </div>

                {isPurchased ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleDownload}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full mr-2" />
                    ) : skill.price === 'Free' ? (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Get Free
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Check className="w-4 h-4" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Globe className="w-4 h-4" />
                    <span>Works globally</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Card */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Provider</h3>
                <Link 
                  href={`/en/user/${skill.provider_name}`}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="text-3xl">{skill.provider_avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{skill.provider_name}</p>
                    <p className="text-white/40 text-sm">View Profile</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </Link>
              </CardContent>
            </Card>

            {/* Links */}
            {(skill.documentation_url || skill.github_url || skill.website_url) && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Resources</h3>
                  <div className="space-y-2">
                    {skill.documentation_url && (
                      <a 
                        href={skill.documentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Documentation
                      </a>
                    )}
                    {skill.github_url && (
                      <a 
                        href={skill.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {skill.website_url && (
                      <a 
                        href={skill.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* License */}
            <div className="text-center text-sm text-white/40">
              <p>License: {skill.license || 'Standard'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
