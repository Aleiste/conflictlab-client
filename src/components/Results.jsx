import { useState } from 'react';
import { motion } from 'framer-motion';

function Results({ player, allResults, allBriefings, onContinue }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const myResults = allResults?.[player?.id];
  const otherResults = Object.values(allResults || {}).find(r => r.playerRole !== player?.role);
  
  const getScoreGrade = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return { grade: 'A', label: 'Excellent', color: 'text-game-success', emoji: '🌟' };
    if (percentage >= 60) return { grade: 'B', label: 'Bien', color: 'text-blue-400', emoji: '👍' };
    if (percentage >= 40) return { grade: 'C', label: 'Correct', color: 'text-game-warning', emoji: '😐' };
    return { grade: 'D', label: 'À améliorer', color: 'text-game-danger', emoji: '📚' };
  };
  
  const myGrade = getScoreGrade(myResults?.totalScore || 0, myResults?.maxScore || 1);
  const otherGrade = getScoreGrade(otherResults?.totalScore || 0, otherResults?.maxScore || 1);
  
  const roleLabel = (role) => role === 'assistant' ? '🔧 Assistant (Alex)' : '👔 Ingénieur (Morgan)';
  const roleColor = (role) => role === 'assistant' ? 'game-assistant' : 'game-ingenieur';
  
  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-5xl mb-4 block">🏆</span>
          <h2 className="font-display text-3xl font-bold mb-2">Résultats</h2>
          <p className="text-gray-400">
            Voyons comment vous avez géré ce conflit !
          </p>
        </motion.div>
        
        {/* Score cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Mon score */}
          <motion.div 
            className={`bg-game-card rounded-2xl p-6 border-2 border-${roleColor(player?.role)}/50`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full bg-${roleColor(player?.role)} flex items-center justify-center text-xl`}>
                {player?.role === 'assistant' ? '🔧' : '👔'}
              </div>
              <div>
                <p className="text-sm text-gray-400">Toi</p>
                <p className="font-semibold">{myResults?.playerName}</p>
                <p className={`text-xs text-${roleColor(player?.role)}`}>{roleLabel(player?.role)}</p>
              </div>
            </div>
            
            <div className="text-center py-6">
              <div className={`text-6xl font-display font-bold ${myGrade.color}`}>
                {myResults?.totalScore}
              </div>
              <p className="text-gray-400 text-sm">/ {myResults?.maxScore} points</p>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-3xl">{myGrade.emoji}</span>
                <span className={`text-xl font-semibold ${myGrade.color}`}>
                  {myGrade.label}
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-${roleColor(player?.role)}`}
                initial={{ width: 0 }}
                animate={{ width: `${(myResults?.totalScore / myResults?.maxScore) * 100}%` }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </motion.div>
          
          {/* Score de l'autre */}
          <motion.div 
            className={`bg-game-card rounded-2xl p-6 border-2 border-${roleColor(otherResults?.playerRole)}/50`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full bg-${roleColor(otherResults?.playerRole)} flex items-center justify-center text-xl`}>
                {otherResults?.playerRole === 'assistant' ? '🔧' : '👔'}
              </div>
              <div>
                <p className="text-sm text-gray-400">Partenaire</p>
                <p className="font-semibold">{otherResults?.playerName}</p>
                <p className={`text-xs text-${roleColor(otherResults?.playerRole)}`}>{roleLabel(otherResults?.playerRole)}</p>
              </div>
            </div>
            
            <div className="text-center py-6">
              <div className={`text-6xl font-display font-bold ${otherGrade.color}`}>
                {otherResults?.totalScore}
              </div>
              <p className="text-gray-400 text-sm">/ {otherResults?.maxScore} points</p>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-3xl">{otherGrade.emoji}</span>
                <span className={`text-xl font-semibold ${otherGrade.color}`}>
                  {otherGrade.label}
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-${roleColor(otherResults?.playerRole)}`}
                initial={{ width: 0 }}
                animate={{ width: `${(otherResults?.totalScore / otherResults?.maxScore) * 100}%` }}
                transition={{ delay: 0.6, duration: 1 }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Révélation des briefings */}
        <motion.div 
          className="bg-game-card rounded-2xl p-6 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔓</span>
              <div className="text-left">
                <h3 className="font-display font-semibold text-lg">Révélation des briefings</h3>
                <p className="text-sm text-gray-400">Découvre ce que l'autre savait</p>
              </div>
            </div>
            <span className={`text-2xl transition-transform ${showDetails ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </button>
          
          {showDetails && (
            <motion.div 
              className="mt-6 grid md:grid-cols-2 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {Object.entries(allBriefings || {}).map(([role, briefing]) => (
                <div 
                  key={role}
                  className={`p-4 rounded-xl border ${
                    role === player?.role 
                      ? 'border-white/20 bg-white/5' 
                      : 'border-game-warning/30 bg-game-warning/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{role === 'assistant' ? '🔧' : '👔'}</span>
                    <span className="font-medium">{briefing.name} ({briefing.role})</span>
                    {role !== player?.role && (
                      <span className="text-xs bg-game-warning/20 text-game-warning px-2 py-0.5 rounded-full">
                        Nouveau !
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {briefing.situation}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
        
        {/* Insight */}
        <motion.div 
          className="bg-game-accent/10 border border-game-accent/30 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h4 className="font-display font-semibold text-lg mb-3 text-game-accent-light">
            💡 Ce que cette expérience révèle
          </h4>
          <p className="text-gray-300">
            Dans un vrai conflit, chacun agit selon <strong>sa propre réalité</strong> — 
            qui n'est qu'une partie de la situation complète. Alex ne savait pas que Morgan 
            était sous pression du directeur. Morgan ne savait pas qu'Alex avait passé 3h 
            sur le diagnostic. <br/><br/>
            <strong>La clé :</strong> avant de réagir, toujours se demander "Qu'est-ce que 
            je ne sais pas sur la situation de l'autre ?"
          </p>
        </motion.div>
        
        {/* Bouton continuer */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-game-success hover:bg-game-success/80 rounded-xl font-medium transition-all text-lg"
          >
            📚 Découvrir les apprentissages →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Results;
