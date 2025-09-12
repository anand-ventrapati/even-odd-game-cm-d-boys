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
            About
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
                    With advice from <span className="text-blue-400">Rishi</span>{' '}
                    <span className="text-yellow-300">💡</span>
                  </p>
                  <div className="mt-2 text-sm text-white/80">
                    <p>📌 Pin: <code className="bg-black/30 px-2 py-1 rounded text-yellow-300">24093-CM-244</code></p>
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
                        href="https://www.linkedin.com/in/anand-ventrapati-a3a7423"
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
                    Assisted by <span className="text-purple-400">Sanjay</span>{' '}
                    <span className="text-orange-300">🛠️</span>
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-white/80">
                    <p className="flex items-center gap-2">
                      📸 Instagram:{' '}
                      <a
                        href="https://instagram.com/mr_dodge_max"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        @mr_dodge_max
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      🔗 LinkedIn:{' '}
                      <a
                        href="https://linkedin.com/in/sanjay-tammu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        Sanjay Tammu
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
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
                    💻 The whole website was <span className="font-bold text-yellow-400">developed with AI</span>.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🚀 <span className="font-bold text-pink-400">Lovable</span> was used for the frontend.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🗄️ <span className="font-bold text-green-400">Supabase</span> was used for the backend.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🔗 Project connected to <span className="font-bold text-gray-300">GitHub</span> and opened in{' '}
                    <span className="font-bold text-blue-300">Cursor</span> for editing.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm">
                    🌍 Hosted on <span className="font-bold text-black bg-white px-2 py-1 rounded">Vercel</span>.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm font-semibold text-center">
                    🎮 This is the story of how our game came alive!
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
