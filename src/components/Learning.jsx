import { useState } from 'react';
import { motion } from 'framer-motion';

function Learning({ learningPoints, onRestart }) {
  const [expandedPoint, setExpandedPoint] = useState(0);
  
  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-5xl mb-4 block">📚</span>
          <h2 className="font-display text-3xl font-bold mb-2">
            Ce qu'il faut retenir
          </h2>
          <p className="text-gray-400">
            Les concepts clés de gestion de conflit illustrés par votre expérience
          </p>
        </motion.div>
        
        {/* Learning points */}
        <div className="space-y-4 mb-12">
          {learningPoints?.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-game-card rounded-2xl border transition-all duration-300 ${
                expandedPoint === index 
                  ? 'border-game-accent/50 glow' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => setExpandedPoint(expandedPoint === index ? -1 : index)}
                className="w-full p-6 text-left flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                  expandedPoint === index 
                    ? 'bg-game-accent' 
                    : 'bg-white/10'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg">{point.title}</h3>
                </div>
                <span className={`text-2xl transition-transform duration-300 ${
                  expandedPoint === index ? 'rotate-180' : ''
                }`}>
                  ↓
                </span>
              </button>
              
              {expandedPoint === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="pl-16">
                    <p className="text-gray-300 leading-relaxed">
                      {point.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Ressources additionnelles */}
        <motion.div 
          className="bg-gradient-to-br from-game-accent/20 to-purple-500/20 rounded-2xl p-8 border border-game-accent/30 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="font-display font-semibold text-xl mb-4">
            📖 Pour aller plus loin
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="font-medium mb-1">Communication Non Violente</p>
              <p className="text-sm text-gray-400">Marshall Rosenberg</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="font-medium mb-1">Crucial Conversations</p>
              <p className="text-sm text-gray-400">Patterson, Grenny, McMillan</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="font-medium mb-1">Getting to Yes</p>
              <p className="text-sm text-gray-400">Fisher & Ury (Négociation Harvard)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="font-medium mb-1">Radical Candor</p>
              <p className="text-sm text-gray-400">Kim Scott</p>
            </div>
          </div>
        </motion.div>
        
        {/* Summary card */}
        <motion.div 
          className="bg-game-card rounded-2xl p-8 border border-white/5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <span className="text-4xl mb-4 block">🎉</span>
          <h3 className="font-display text-2xl font-bold mb-2">
            Bravo, tu as terminé !
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Tu as vécu un conflit des deux côtés et découvert les concepts clés. 
            La prochaine fois que tu seras dans une situation similaire, 
            tu auras ces outils en tête.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="px-8 py-4 bg-game-accent hover:bg-game-accent-light rounded-xl font-medium transition-all"
            >
              🔄 Rejouer
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all"
            >
              🏠 Retour à l'accueil
            </button>
          </div>
        </motion.div>
        
        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          ConflictLab — Master 2 GBM 2025-2026
          <br />
          <span className="text-gray-600">Lamrani Abderrahmane & Ferreira Estel</span>
        </p>
      </div>
    </div>
  );
}

export default Learning;
