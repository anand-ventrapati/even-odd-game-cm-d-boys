import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const About = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 w-full">
      <div className="flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            className="text-gray-800 font-semibold bg-transparent border-none shadow-none hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 flex items-center gap-2"
          >
            👉 Click here to know The Story Behind the Game
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 w-full">
          <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-4">
          {/* About the Team */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                🧑‍🤝‍🧑 About the Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-white font-bold text-lg">
                  <span className="text-yellow-400">🎮</span> Game by CM-D Boys{' '}
                  <span className="text-red-500">🔥</span>
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white font-semibold">
                    Invented by <span className="text-yellow-400">Sohail</span>{' '}
                    <span className="text-yellow-300">✨</span>
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-white/80">
                    <p>📌 Pin: <code className="bg-black/30 px-2 py-1 rounded text-yellow-300">24093-CM-201</code></p>
                    <p className="flex items-center gap-2">
                      📸 Instagram:{' '}
                      <a
                        href="https://instagram.com/_big_fan_of_muhammad_saw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        @_big_fan_of_muhammad_saw
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white font-semibold">
                    Developed by <span className="text-green-400">Anand</span>{' '}
                    <span className="text-blue-300">👨‍💻</span>
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-white/80">
                    <p>📌 Pin: <code className="bg-black/30 px-2 py-1 rounded text-yellow-300">24093-CM-243</code></p>
                    <p className="flex items-center gap-2">
                      📸 Instagram:{' '}
                      <a
                        href="https://instagram.com/anand_ventrapati"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        @anand_ventrapati
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      🔗 LinkedIn:{' '}
                      <a
                        href="https://www.linkedin.com/in/anand-ventrapati-a3a74237a"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        Anand Ventrapati
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white font-semibold">
                    Supported by <span className="text-purple-400">Sanjay</span> and <span className="text-orange-400">Rishi</span>{' '}
                    <span className="text-pink-300">💡</span>
                  </p>
                  <div className="mt-2 space-y-2 text-sm text-white/80">
                    <div className="space-y-1">
                      <p className="text-white font-medium">Sanjay:</p>
                      <p>📌 Pin: <code className="bg-black/30 px-2 py-1 rounded text-yellow-300">24093-CM-216</code></p>
                      <p className="flex items-center gap-2">
                        📸 Instagram:{' '}
                        <a
                          href="https://instagram.com/mr_dodge_max"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                          Sanjay
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        🔗 LinkedIn:{' '}
                        <a
                          href="https://www.linkedin.com/in/sanjay-tammu-4b887337a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                          Sanjay Tammu
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white font-medium">Rishi:</p>
                      <p>📌 Pin: <code className="bg-black/30 px-2 py-1 rounded text-yellow-300">24093-CM-244</code></p>
                      <p className="flex items-center gap-2">
                        📸 Instagram:{' '}
                        <a
                          href="https://instagram.com/rishi_naga_ganesh123"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                          @rishi_naga_ganesh123
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About How We Built the Project */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                ⚙️ About How We Built the Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    💻 The entire game-website was crafted with AI power – built from scratch at zero cost.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🎨 <span className="font-bold text-pink-400">Frontend (UI/UX):</span> We jumpstarted the design using Lovable, giving us a sleek and modern UI. Then we customized it — removed the Lovable badge manually, refined layouts, and added our own creative touch.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🗄️ <span className="font-bold text-green-400">Backend & Multiplayer Magic:</span> With Supabase, we enabled two mobiles to connect in real-time. Every guess and message instantly syncs between players, making the game feel alive and interactive.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🔗 <span className="font-bold text-gray-300">Version Control & Collaboration:</span> The whole codebase lives on GitHub, where we tracked changes, synced updates, and collaborated seamlessly.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    ⌨️ <span className="font-bold text-blue-400">AI Co-pilots:</span> For complex logic — like handling turns, sharing messages between players, and syncing game state — we leaned on ChatGPT + Claude as coding copilots.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🖼️ <span className="font-bold text-purple-400">Personal Branding:</span> We swapped out the Lovable default favicon ❤️ with our own custom logo, giving the game a professional identity.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🛠️ <span className="font-bold text-orange-400">Editing Environment:</span> Using Cursor + Command Prompt, we tested, refined, and ran the project locally until it was perfect.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🌍 <span className="font-bold text-cyan-400">Deployment:</span> With a single push to GitHub, Vercel hosted our project instantly. From localhost to a shareable web link in minutes!
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🎮 <span className="font-bold text-yellow-400">End Result:</span> A fully functional multiplayer game with real-time interaction, customized branding, clean UI, and zero hosting costs.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm font-semibold text-center">
                    ✨ Proof that with AI + free tools + creativity, you don't just build projects — you bring them to life!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
