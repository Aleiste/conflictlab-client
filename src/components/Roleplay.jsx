import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Roleplay({ player, scenario, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  
  const role = player?.role;
  const steps = scenario?.steps?.[role] || [];
  const currentStepData = steps[currentStep];
  
  const roleColor = role === 'assistant' ? 'game-assistant' : 'game-ingenieur';
  const otherRole = role === 'assistant' ? 'ingenieur' : 'assistant';
  const otherRoleLabel = role === 'assistant' ? 'Morgan (Ingénieur)' : 'Alex (Assistant)';
  const myRoleLabel = role === 'assistant' ? 'Alex (Assistant)' : 'Morgan (Ingénieur)';
  
  const handleChoice = (choice) => {
    setSelectedChoices([...selectedChoices, {
      step: currentStep,
      choice: choice,
      score: choice.score
    }]);
    setTotalScore(prev => prev + choice.score);
    setShowFeedback(true);
  };
  
  const handleNext = () => {
    setShowFeedback(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Fin du scénario
      onComplete({
        choices: selectedChoices,
        totalScore,
        maxScore: steps.reduce((acc, step) => acc + Math.max(...step.choices.map(c => c.score)), 0)
      });
    }
  };
  
  const getScoreLabel = (score) => {
    if (score >= 3) return { label: 'Excellent', color: 'text-game-success', emoji: '🌟' };
    if (score >= 2) return { label: 'Bien', color: 'text-blue-400', emoji: '👍' };
    if (score >= 1) return { label: 'Moyen', color: 'text-game-warning', emoji: '😐' };
    return { label: 'À éviter', color: 'text-game-danger', emoji: '⚠️' };
  };
  
  const lastChoice = selectedChoices[selectedChoices.length - 1]?.choice;
  
  return (
    <div className="min-h-screen flex flex-col p-4 pt-20">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header avec progression */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Situation {currentStep + 1} / {steps.length}
            </span>
            <span className={`text-sm font-medium text-${roleColor}`}>
              {role === 'assistant' ? '🔧' : '👔'} Tu es {myRoleLabel}
            </span>
          </div>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i < currentStep ? 'bg-game-success' :
                  i === currentStep ? 'bg-game-accent' :
                  'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Zone de dialogue */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col"
              >
                {/* Message de l'autre */}
                {currentStepData?.otherMessage && (
                  <div className="mb-6">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                        otherRole === 'assistant' ? 'bg-game-assistant' : 'bg-game-ingenieur'
                      }`}>
                        {otherRole === 'assistant' ? '🔧' : '👔'}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">{otherRoleLabel}</p>
                        <div className={`p-4 rounded-2xl rounded-tl-md ${
                          otherRole === 'assistant' ? 'bg-game-assistant/20' : 'bg-game-ingenieur/20'
                        }`}>
                          <p className="text-gray-100">{currentStepData.otherMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contexte / narration */}
                {currentStepData?.context && (
                  <div className="mb-6 p-4 bg-white/5 rounded-xl border-l-4 border-game-accent">
                    <p className="text-sm text-gray-300 italic">{currentStepData.context}</p>
                  </div>
                )}
                
                {/* Question / situation */}
                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {currentStepData?.question || "Que réponds-tu ?"}
                  </h3>
                  {currentStepData?.hint && (
                    <p className="text-sm text-gray-400">{currentStepData.hint}</p>
                  )}
                </div>
                
                {/* Choix */}
                <div className="space-y-3">
                  {currentStepData?.choices?.map((choice, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleChoice(choice)}
                      className="w-full p-4 text-left rounded-xl border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] bg-game-card border-white/10 hover:border-game-accent/50 hover:bg-game-accent/10"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <p className="text-gray-100">{choice.text}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // Feedback après choix
              <motion.div
                key="feedback"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col"
              >
                {/* Ce que tu as dit */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 flex flex-col items-end">
                      <p className="text-xs text-gray-400 mb-1">{myRoleLabel} (toi)</p>
                      <div className={`p-4 rounded-2xl rounded-tr-md max-w-[90%] ${
                        role === 'assistant' ? 'bg-game-assistant' : 'bg-game-ingenieur'
                      }`}>
                        <p className="text-white">{lastChoice?.text}</p>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                      role === 'assistant' ? 'bg-game-assistant' : 'bg-game-ingenieur'
                    }`}>
                      {role === 'assistant' ? '🔧' : '👔'}
                    </div>
                  </div>
                </div>
                
                {/* Feedback */}
                <div className="bg-game-card rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{getScoreLabel(lastChoice?.score).emoji}</span>
                    <div>
                      <p className={`font-semibold ${getScoreLabel(lastChoice?.score).color}`}>
                        {getScoreLabel(lastChoice?.score).label}
                      </p>
                      <p className="text-sm text-gray-400">+{lastChoice?.score} point{lastChoice?.score > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{lastChoice?.feedback}</p>
                  
                  {lastChoice?.tip && (
                    <div className="p-3 bg-game-accent/10 rounded-lg border border-game-accent/20">
                      <p className="text-sm text-game-accent-light">
                        💡 <strong>Astuce :</strong> {lastChoice.tip}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Score actuel */}
                <div className="mt-6 flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Score actuel</span>
                  <span className="font-display font-bold text-xl text-game-accent">
                    {totalScore} pts
                  </span>
                </div>
                
                {/* Bouton continuer */}
                <button
                  onClick={handleNext}
                  className="mt-6 w-full py-4 bg-game-accent hover:bg-game-accent-light rounded-xl font-medium transition-all"
                >
                  {currentStep < steps.length - 1 ? 'Continuer →' : 'Voir les résultats →'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Roleplay;
