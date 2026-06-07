// src/pages/Learn.tsx
import React from 'react';
import { Lightbulb, Palette, Camera, Type, Layers, Sparkles } from 'lucide-react';

export default function Learn() {
  const tips = [
    { 
      icon: Lightbulb, 
      title: 'Start with a Clear Vision', 
      description: 'Know your genre, mood, and target audience before generating. The more specific your inputs, the better the results.', 
      color: 'from-yellow-600 to-yellow-700' 
    },
    { 
      icon: Palette, 
      title: 'Choose the Right Mood', 
      description: 'Dark works for thrillers, Dreamy for romance, Vintage for period pieces. Match mood to genre for authentic results.', 
      color: 'from-purple-600 to-purple-700' 
    },
    { 
      icon: Camera, 
      title: 'Upload Reference Images', 
      description: 'Provide style references or inspiration images. The AI learns from your visual preferences for better accuracy.', 
      color: 'from-blue-600 to-blue-700' 
    },
    { 
      icon: Type, 
      title: 'Craft Compelling Taglines', 
      description: 'Short, punchy taglines work best. Think "One shot. One chance." rather than long descriptions.', 
      color: 'from-green-600 to-green-700' 
    },
    { 
      icon: Layers, 
      title: 'Experiment with Styles', 
      description: 'Try different presets: Photo-Real for realism, Illustrated for artistic, 3D-Cinematic for epic scale.', 
      color: 'from-red-600 to-red-700' 
    },
    { 
      icon: Sparkles, 
      title: 'Use Regeneration Wisely', 
      description: 'Adjust variation strength: lower values stay closer to original, higher values explore creative possibilities.', 
      color: 'from-pink-600 to-pink-700' 
    }
  ];

  return (
    <div className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">Learn & Tips</h1>
          <p className="text-gray-400 text-lg">Master the art of AI poster generation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${tip.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <tip.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">{tip.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-red-900/20 to-gray-900 border border-red-900/30 rounded-xl p-6">
          <h2 className="text-white text-2xl font-semibold mb-4">Best Practices for Tamil & Regional Cinema</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-white">Typography:</strong> When creating posters in Tamil or other regional languages, select "Tamil-Sans" font preference for optimal Unicode rendering.
            </p>
            <p>
              <strong className="text-white">Cultural Context:</strong> Reference classic regional cinema styles in your style reference field (e.g., "80s Tamil cinema poster", "Vintage Malayalam film aesthetic").
            </p>
            <p>
              <strong className="text-white">Taglines:</strong> Keep taglines short and impactful. Tamil taglines work best when they're 3-5 words maximum.
            </p>
            <p>
              <strong className="text-white">Color Schemes:</strong> Regional cinema often uses bold, vibrant colors. Don't be afraid to specify "vibrant red and gold" or "traditional South Indian colors" in style reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}