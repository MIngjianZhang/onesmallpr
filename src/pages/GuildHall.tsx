import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import { Scroll, Sword, Shield, Map, Star, User } from 'lucide-react';

export default function GuildHall() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showHandbook, setShowHandbook] = useState(false);

  // Scroll listener to reveal handbook
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowHandbook(true);
      } else {
        setShowHandbook(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-guild-parchment font-sans selection:bg-guild-gold selection:text-guild-wood">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2544&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-transparent to-background"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-heading text-guild-gold drop-shadow-lg tracking-wider">
            ONESMALLPR
          </h1>
          <p className="text-xl md:text-2xl text-guild-parchment-dark italic font-serif">
            "One small step for a coder, one giant leap for the AI Empire."
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
            {!user ? (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-guild-wood border-2 border-guild-bronze text-guild-gold hover:bg-guild-wood-light text-lg px-8 py-4 rounded-none clip-path-polygon"
              >
                <Shield className="w-5 h-5 mr-2" />
                Join the Guild
              </Button>
            ) : (
              <Button 
                onClick={() => document.getElementById('guild-counter')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-guild-green border-2 border-guild-gold text-white hover:bg-green-700 text-lg px-8 py-4 rounded-none"
              >
                <User className="w-5 h-5 mr-2" />
                Open Handbook
              </Button>
            )}
            
            <Button 
              onClick={() => navigate('/quest-board')}
              className="bg-guild-red border-2 border-guild-gold text-white hover:bg-red-800 text-lg px-8 py-4 rounded-none"
            >
              <Sword className="w-5 h-5 mr-2" />
              Start Adventure
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <p className="text-guild-bronze text-sm uppercase tracking-widest mb-2">Visit Counter</p>
          <div className="w-6 h-10 border-2 border-guild-bronze rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-guild-gold rounded-full animate-scroll-down"></div>
          </div>
        </div>
      </section>

      {/* Guild Counter Section */}
      <section id="guild-counter" className="min-h-screen py-20 px-4 md:px-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 h-full min-h-[600px] shadow-2xl border-4 border-guild-wood rounded-lg overflow-hidden bg-guild-wood">
          
          {/* Left: Guild Interior (Visual) */}
          <div className="relative hidden lg:block bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=2544&auto=format&fit=crop')] bg-cover bg-center min-h-[600px]">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-10 left-10 p-6 bg-black/60 border border-guild-bronze backdrop-blur-sm rounded max-w-md">
              <h3 className="text-guild-gold font-heading text-2xl mb-2">Guild Master Coda</h3>
              <p className="text-guild-parchment font-handwritten text-xl">
                "Welcome back, adventurer. The board is full of new requests from the Open Source realms. Ready to make a name for yourself?"
              </p>
            </div>
          </div>

          {/* Right: Adventurer's Handbook */}
          <div className="bg-guild-parchment text-guild-wood p-8 md:p-12 relative flex flex-col bg-[url('/assets/parchment.png')] bg-cover">
            {/* Binding Visuals */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent lg:hidden"></div>
            
            <div className="mb-8 border-b-2 border-guild-wood-light pb-4 flex justify-between items-center">
              <h2 className="text-3xl font-heading text-guild-wood uppercase tracking-widest">
                Adventurer's Handbook
              </h2>
              {user && (
                <span className="bg-guild-wood text-guild-gold px-3 py-1 text-sm font-bold rounded">
                  Rank E
                </span>
              )}
            </div>

            {user ? (
              // Member View
              <div className="flex-1 space-y-8">
                {/* Profile Summary */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-guild-wood rounded-full border-4 border-guild-gold flex items-center justify-center">
                    <span className="text-4xl">🧙‍♂️</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h3>
                    <div className="flex gap-2 text-sm text-guild-wood-light font-medium">
                      <span>XP: 0</span> | <span>Contribution: 0</span>
                    </div>
                  </div>
                </div>

                {/* Skill Tree (Constellation Mock) */}
                <div className="bg-white/50 p-6 rounded border border-guild-wood-light/30">
                  <h4 className="font-heading text-lg mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-guild-gold" /> Constellation (Skills)
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {['Python', 'JS', 'Git'].map(skill => (
                      <div key={skill} className="flex flex-col items-center opacity-50">
                        <div className="w-10 h-10 rounded-full bg-guild-wood text-white flex items-center justify-center mb-2">
                          ?
                        </div>
                        <span className="text-xs font-bold">{skill}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs mt-4 text-guild-wood-light italic">Complete quests to unlock stars.</p>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-8">
                  <Button 
                    onClick={() => navigate('/quest-board')}
                    className="w-full bg-guild-red text-white py-4 text-xl font-heading border-2 border-guild-gold hover:scale-[1.02] transition-transform shadow-lg"
                  >
                    Accept New Quest
                  </Button>
                </div>
              </div>
            ) : (
              // Guest View
              <div className="flex-1 flex flex-col justify-center text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-guild-wood-light/20 rounded-full flex items-center justify-center border-2 border-dashed border-guild-wood">
                  <User className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold">Unregistered Adventurer</h3>
                <p className="text-lg font-handwritten">
                  "I don't see your name in our ledger. You'll need to register before taking on any official commissions."
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-guild-wood text-guild-gold w-full py-3 mt-4"
                >
                  Sign the Ledger (Login)
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
