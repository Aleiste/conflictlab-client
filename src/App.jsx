import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import Briefing from './components/Briefing';
import Roleplay from './components/Roleplay';
import Results from './components/Results';
import Learning from './components/Learning';

// URL du serveur - à modifier selon ton déploiement
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState({
    phase: 'lobby', // lobby, waiting, briefing, roleplay, results, learning
    sessionCode: null,
    player: null,
    players: [],
    briefing: null,
    scenario: null,
    allResults: null,
    allBriefings: null,
    learningPoints: null,
    otherPlayerFinished: false
  });
  
  // Connexion Socket.io
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    
    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur');
      setConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur');
      setConnected(false);
    });
    
    newSocket.on('player-joined', (player) => {
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, player]
      }));
    });
    
    newSocket.on('player-ready-update', (players) => {
      setGameState(prev => ({ ...prev, players }));
    });
    
    newSocket.on('phase-change', (data) => {
      console.log('🎮 Changement de phase:', data);
      setGameState(prev => ({
        ...prev,
        phase: data.phase,
        briefing: data.briefing || prev.briefing,
        scenario: data.scenario || prev.scenario,
        allResults: data.allResults || prev.allResults,
        allBriefings: data.allBriefings || prev.allBriefings,
        learningPoints: data.learningPoints || prev.learningPoints,
        otherPlayerFinished: false
      }));
    });
    
    newSocket.on('player-finished', ({ playerId, playerName }) => {
      setGameState(prev => ({
        ...prev,
        otherPlayerFinished: playerId !== prev.player?.id
      }));
    });
    
    newSocket.on('player-disconnected', (playerName) => {
      alert(`${playerName} s'est déconnecté. La partie est terminée.`);
      setGameState({
        phase: 'lobby',
        sessionCode: null,
        player: null,
        players: [],
        briefing: null,
        scenario: null,
        allResults: null,
        allBriefings: null,
        learningPoints: null,
        otherPlayerFinished: false
      });
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);
  
  // Créer une session
  const createSession = (playerName) => {
    socket.emit('create-session', playerName, (result) => {
      if (result.success) {
        setGameState(prev => ({
          ...prev,
          phase: 'waiting',
          sessionCode: result.session.code,
          player: result.player,
          players: result.session.players
        }));
      } else {
        alert(result.error);
      }
    });
  };
  
  // Rejoindre une session
  const joinSession = (sessionCode, playerName) => {
    socket.emit('join-session', sessionCode, playerName, (result) => {
      if (result.success) {
        setGameState(prev => ({
          ...prev,
          phase: 'waiting',
          sessionCode: result.session.code,
          player: result.player,
          players: result.session.players
        }));
      } else {
        alert(result.error);
      }
    });
  };
  
  // Se déclarer prêt
  const setReady = () => {
    socket.emit('player-ready');
  };
  
  // Terminer le briefing
  const finishBriefing = () => {
    socket.emit('briefing-done');
  };
  
  // Terminer le roleplay
  const completeRoleplay = (results) => {
    socket.emit('roleplay-complete', results);
  };
  
  // Aller aux apprentissages
  const goToLearning = () => {
    socket.emit('go-to-learning');
  };
  
  // Rendu selon la phase
  const renderPhase = () => {
    switch (gameState.phase) {
      case 'lobby':
        return (
          <Lobby 
            onCreateSession={createSession}
            onJoinSession={joinSession}
            connected={connected}
          />
        );
      
      case 'waiting':
        return (
          <WaitingRoom
            sessionCode={gameState.sessionCode}
            players={gameState.players}
            currentPlayer={gameState.player}
            onReady={setReady}
          />
        );
      
      case 'briefing':
        return (
          <Briefing
            briefing={gameState.briefing}
            scenario={gameState.scenario}
            onFinish={finishBriefing}
          />
        );
      
      case 'roleplay':
        return (
          <Roleplay
            player={gameState.player}
            scenario={gameState.scenario}
            onComplete={completeRoleplay}
          />
        );
      
      case 'results':
        return (
          <Results
            player={gameState.player}
            allResults={gameState.allResults}
            allBriefings={gameState.allBriefings}
            onContinue={goToLearning}
          />
        );
      
      case 'learning':
        return (
          <Learning
            learningPoints={gameState.learningPoints}
            onRestart={() => setGameState(prev => ({ ...prev, phase: 'lobby' }))}
          />
        );
      
      default:
        return <div>Phase inconnue: {gameState.phase}</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-game-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-game-bg/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display font-bold text-xl gradient-text">
            ConflictLab
          </h1>
          
          <div className="flex items-center gap-4">
            {gameState.sessionCode && (
              <span className="text-sm text-gray-400">
                Session: <span className="font-mono text-game-accent">{gameState.sessionCode}</span>
              </span>
            )}
            
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-game-success' : 'bg-game-danger'}`} />
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
