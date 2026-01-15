import { motion } from 'framer-motion';

function WaitingRoom({ sessionCode, players, currentPlayer, onReady }) {
  const isReady = players.find(p => p.id === currentPlayer?.id)?.ready;
  const otherPlayer = players.find(p => p.id !== currentPlayer?.id);
  const bothReady = players.length === 2 && players.every(p => p.ready);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-game-card rounded-2xl p-8 border border-white/5">
          {/* Code de session */}
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm mb-2">Code de la session</p>
            <div className="font-mono text-4xl font-bold text-game-accent tracking-wider">
              {sessionCode}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Partage ce code avec ton partenaire de jeu
            </p>
          </div>
          
          {/* Liste des joueurs */}
          <div className="space-y-4 mb-8">
            <h3 className="font-display font-semibold text-lg">Joueurs</h3>
            
            {/* Joueur actuel */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${
              isReady 
                ? 'bg-game-success/10 border-game-success/30' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPlayer?.role === 'assistant' ? 'bg-game-assistant' : 'bg-game-ingenieur'
                }`}>
                  {currentPlayer?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{currentPlayer?.name} <span className="text-gray-500">(toi)</span></p>
                  <p className="text-xs text-gray-400">
                    Rôle: {currentPlayer?.role === 'assistant' ? '🔧 Assistant Ingénieur' : '👔 Ingénieur Biomédical'}
                  </p>
                </div>
              </div>
              {isReady && <span className="text-game-success text-sm">✓ Prêt</span>}
            </div>
            
            {/* Autre joueur ou en attente */}
            {otherPlayer ? (
              <div className={`flex items-center justify-between p-4 rounded-xl border ${
                otherPlayer.ready 
                  ? 'bg-game-success/10 border-game-success/30' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    otherPlayer.role === 'assistant' ? 'bg-game-assistant' : 'bg-game-ingenieur'
                  }`}>
                    {otherPlayer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{otherPlayer.name}</p>
                    <p className="text-xs text-gray-400">
                      Rôle: {otherPlayer.role === 'assistant' ? '🔧 Assistant Ingénieur' : '👔 Ingénieur Biomédical'}
                    </p>
                  </div>
                </div>
                {otherPlayer.ready && <span className="text-game-success text-sm">✓ Prêt</span>}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                  </div>
                  <span>En attente d'un autre joueur...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Bouton Prêt */}
          {players.length === 2 && (
            <button
              onClick={onReady}
              disabled={isReady}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                isReady
                  ? 'bg-game-success/20 text-game-success cursor-not-allowed'
                  : 'bg-game-accent hover:bg-game-accent-light hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isReady ? '✓ Tu es prêt !' : 'Je suis prêt'}
            </button>
          )}
          
          {bothReady && (
            <motion.p 
              className="text-center text-game-success mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🚀 La partie va commencer...
            </motion.p>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-6 p-4 bg-game-accent/10 rounded-xl border border-game-accent/20">
          <h4 className="font-medium text-game-accent-light mb-2">📋 Comment ça marche ?</h4>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Chacun reçoit un briefing secret sur sa situation</li>
            <li>Vous jouez la scène en temps réel via le chat</li>
            <li>Vous débriefez individuellement puis ensemble</li>
            <li>Vous découvrez les apprentissages clés</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
}

export default WaitingRoom;
