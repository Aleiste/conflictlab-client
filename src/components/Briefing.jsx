import { useState } from 'react';
import { motion } from 'framer-motion';

function Briefing({ briefing, scenario, onFinish }) {
  const [hasRead, setHasRead] = useState(false);
  
  const roleColor = briefing?.role?.includes('Assistant') ? 'game-assistant' : 'game-ingenieur';
  const roleEmoji = briefing?.role?.includes('Assistant') ? '🔧' : '👔';
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-20">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Titre du scénario */}
        {scenario && (
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold gradient-text">{scenario.title}</h2>
            <p className="text-gray-400 text-sm mt-2">{scenario.context}</p>
          </div>
        )}
        {/* Header */}
        <div className={`bg-${roleColor}/20 border border-${roleColor}/30 rounded-2xl p-6 mb-6`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full bg-${roleColor} flex items-center justify-center text-3xl`}>
              {roleEmoji}
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tu joues le rôle de</p>
              <h2 className="font-display text-2xl font-bold">{briefing?.name}</h2>
              <p className={`text-${roleColor}`}>{briefing?.role}</p>
            </div>
          </div>
        </div>
        
        {/* Briefing content */}
        <div className="bg-game-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔒</span>
            <h3 className="font-display font-semibold text-lg">Briefing confidentiel</h3>
            <span className="text-xs bg-game-warning/20 text-game-warning px-2 py-1 rounded-full">
              Secret
            </span>
          </div>
          
          <div className="prose prose-invert prose-sm max-w-none">
            <div 
              className="whitespace-pre-wrap text-gray-300 leading-relaxed"
              style={{ fontSize: '0.95rem' }}
            >
              {briefing?.situation}
            </div>
          </div>
          
          {/* Hidden info teaser */}
          <div className="mt-6 p-4 bg-game-danger/10 border border-game-danger/20 rounded-xl">
            <p className="text-sm text-gray-400">
              <span className="text-game-danger font-medium">⚠️ Important :</span> L'autre joueur a reçu un briefing 
              différent. Vous ne voyez pas la situation de la même façon.
            </p>
          </div>
        </div>
        
        {/* Checkbox + Bouton */}
        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-game-accent"
            />
            <span className="text-gray-300">
              J'ai bien lu et compris mon briefing
            </span>
          </label>
          
          <button
            onClick={onFinish}
            disabled={!hasRead}
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
              hasRead
                ? 'bg-game-accent hover:bg-game-accent-light hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            {hasRead ? '🎬 Commencer la scène' : 'Lis d\'abord ton briefing'}
          </button>
        </div>
        
        {/* Tips */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl">
          <h4 className="font-medium text-sm mb-2">💡 Conseils pour bien jouer</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Mets-toi vraiment dans la peau de ton personnage</li>
            <li>• Ressens les émotions décrites dans le briefing</li>
            <li>• N'hésite pas à exprimer ta frustration (c'est le but !)</li>
            <li>• Essaie quand même de trouver une solution ensemble</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default Briefing;
