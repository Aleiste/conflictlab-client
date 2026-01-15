import { useState } from 'react';
import { motion } from 'framer-motion';

function Lobby({ onCreateSession, onJoinSession, connected }) {
  const [mode, setMode] = useState(null); // null, 'create', 'join'
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      alert('Entre ton prénom !');
      return;
    }
    
    if (mode === 'create') {
      onCreateSession(playerName);
    } else if (mode === 'join') {
      if (!sessionCode.trim()) {
        alert('Entre le code de la session !');
        return;
      }
      onJoinSession(sessionCode, playerName);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hero */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Apprends à gérer</span>
          <br />
          <span className="text-white">les conflits</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Un jeu de rôle immersif pour comprendre les dynamiques de conflit 
          et développer tes compétences en communication.
        </p>
      </motion.div>
      
      {/* Carte principale */}
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-game-card rounded-2xl p-8 border border-white/5 glow">
          {!mode ? (
            // Choix du mode
            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold text-center mb-6">
                Comment veux-tu jouer ?
              </h3>
              
              <button
                onClick={() => setMode('create')}
                className="w-full py-4 px-6 bg-game-accent hover:bg-game-accent-light rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={!connected}
              >
                🎮 Créer une partie
              </button>
              
              <button
                onClick={() => setMode('join')}
                className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={!connected}
              >
                🔗 Rejoindre une partie
              </button>
              
              {!connected && (
                <p className="text-game-warning text-sm text-center mt-4">
                  ⏳ Connexion au serveur...
                </p>
              )}
            </div>
          ) : (
            // Formulaire
            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Retour
              </button>
              
              <h3 className="font-display text-xl font-semibold">
                {mode === 'create' ? '🎮 Créer une partie' : '🔗 Rejoindre une partie'}
              </h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ton prénom
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ex: Alex"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-game-accent transition-colors"
                  maxLength={20}
                />
              </div>
              
              {mode === 'join' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Code de la session
                  </label>
                  <input
                    type="text"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    placeholder="Ex: ABC123"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-game-accent transition-colors font-mono uppercase"
                    maxLength={6}
                  />
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-4 px-6 bg-game-accent hover:bg-game-accent-light rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {mode === 'create' ? 'Créer la partie' : 'Rejoindre'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
      
      {/* Features */}
      <motion.div 
        className="grid grid-cols-3 gap-8 mt-16 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { icon: '🎭', title: 'Jeu de rôle', desc: 'Vis la situation des deux côtés' },
          { icon: '💡', title: 'Métacognition', desc: 'Réfléchis à tes réactions' },
          { icon: '📚', title: 'Apprentissage', desc: 'Concepts clés de gestion de conflit' }
        ].map((feature, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h4 className="font-medium text-sm">{feature.title}</h4>
            <p className="text-xs text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Lobby;
