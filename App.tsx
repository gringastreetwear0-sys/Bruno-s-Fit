import React, { useState, useEffect } from 'react';
import { AppStep, ExperienceLevel, FitnessGoal, MuscleGroup, UserPreferences, WorkoutPlan } from './types';
import { generateWorkoutPlan } from './services/geminiService';
import { Button } from './components/Button';
import { SelectionCard } from './components/SelectionCard';
import { ProgressBar } from './components/ProgressBar';
import { ExerciseCard } from './components/ExerciseCard';

// Icons
const DumbbellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
);

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Intro);
  const [prefs, setPrefs] = useState<UserPreferences>({
    level: null,
    goal: null,
    muscleGroup: null
  });
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (step === AppStep.Intro) setStep(AppStep.SelectLevel);
    else if (step === AppStep.SelectLevel && prefs.level) setStep(AppStep.SelectGoal);
    else if (step === AppStep.SelectGoal && prefs.goal) setStep(AppStep.SelectMuscle);
    else if (step === AppStep.SelectMuscle && prefs.muscleGroup) {
      generate();
    }
  };

  const handleBack = () => {
    if (step > AppStep.Intro && step <= AppStep.SelectMuscle) {
      setStep(step - 1);
    } else if (step === AppStep.Result) {
      setStep(AppStep.Intro);
      setPrefs({ level: null, goal: null, muscleGroup: null });
      setWorkout(null);
    }
  };

  const generate = async () => {
    setStep(AppStep.Loading);
    setError(null);
    try {
      const result = await generateWorkoutPlan(prefs);
      setWorkout(result);
      setStep(AppStep.Result);
    } catch (e) {
      setError("Falha ao gerar o treino. Por favor, tente novamente.");
      setStep(AppStep.Error);
    }
  };

  // --- Render Views ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-fade-in">
      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/10">
        <div className="text-primary">
          <DumbbellIcon />
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400">
        Bruno's Fit
      </h1>
      <p className="text-slate-400 text-lg max-w-md">
        Seu Personal Trainer Inteligente. Treinos personalizados baseados em ciência para atingir seus objetivos mais rápido.
      </p>
      <Button onClick={handleNext} className="mt-8 text-lg px-8">
        Começar Agora
      </Button>
    </div>
  );

  const renderSelection = (
    title: string,
    options: string[],
    selected: string | null,
    onSelect: (val: any) => void
  ) => (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map((opt) => (
            <SelectionCard
              key={opt}
              label={opt}
              selected={selected === opt}
              onClick={() => onSelect(opt)}
            />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 left-0 w-full p-4 bg-dark/90 backdrop-blur-sm border-t border-slate-800 mt-8 flex justify-between">
        <Button variant="secondary" onClick={handleBack}>Voltar</Button>
        <Button disabled={!selected} onClick={handleNext}>
          {step === AppStep.SelectMuscle ? 'Gerar Treino' : 'Próximo'}
        </Button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-pulse">
      <div className="relative w-20 h-20">
         <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
         <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-2xl font-semibold text-white">Criando seu treino...</h2>
      <p className="text-slate-400">Analisando biomecânica, volume e intensidade ideal.</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="text-red-500 text-6xl">⚠️</div>
      <h2 className="text-2xl font-bold text-white">Ops, algo deu errado</h2>
      <p className="text-slate-400">{error}</p>
      <Button onClick={() => setStep(AppStep.SelectMuscle)}>Tentar Novamente</Button>
    </div>
  );

  const renderResult = () => {
    if (!workout) return null;
    return (
      <div className="animate-fade-in pb-20">
        {/* Header Summary */}
        <div className="bg-surface rounded-2xl p-6 mb-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-3xl font-bold text-white">{workout.title}</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30">
                {workout.estimatedDuration}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold border border-blue-500/30">
                {workout.frequencyRecommendation}
              </span>
            </div>
          </div>
          <p className="text-slate-300 italic mb-4">{workout.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-dark/50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Aquecimento</h3>
                <ul className="list-disc list-inside text-slate-200 text-sm space-y-1">
                  {workout.warmup.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
             </div>
             <div className="bg-dark/50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Resfriamento</h3>
                <ul className="list-disc list-inside text-slate-200 text-sm space-y-1">
                  {workout.cooldown.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
             </div>
          </div>
        </div>

        {/* Exercises */}
        <h3 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-primary">Treino Principal</h3>
        <div className="space-y-4">
          {workout.exercises.map((exercise, idx) => (
            <ExerciseCard key={idx} exercise={exercise} index={idx} />
          ))}
        </div>

        <div className="mt-12 text-center">
            <Button variant="outline" onClick={handleBack} fullWidth>
              Criar Novo Treino
            </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-slate-200 font-sans selection:bg-primary/30">
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header (hidden on intro) */}
        {step > AppStep.Intro && (
          <div className="mb-6 flex items-center justify-between">
             <h1 className="text-xl font-bold text-white flex items-center gap-2">
               <span className="text-primary"><DumbbellIcon/></span> Bruno's Fit
             </h1>
          </div>
        )}

        {/* Progress Bar */}
        {step > AppStep.Intro && step < AppStep.Loading && (
          <ProgressBar currentStep={step} totalSteps={3} />
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          {step === AppStep.Intro && renderIntro()}
          
          {step === AppStep.SelectLevel && renderSelection(
            "Qual seu nível de experiência?",
            Object.values(ExperienceLevel),
            prefs.level,
            (val) => setPrefs(prev => ({ ...prev, level: val }))
          )}

          {step === AppStep.SelectGoal && renderSelection(
            "Qual seu objetivo principal?",
            Object.values(FitnessGoal),
            prefs.goal,
            (val) => setPrefs(prev => ({ ...prev, goal: val }))
          )}

          {step === AppStep.SelectMuscle && renderSelection(
            "Qual grupo muscular vamos treinar hoje?",
            Object.values(MuscleGroup),
            prefs.muscleGroup,
            (val) => setPrefs(prev => ({ ...prev, muscleGroup: val }))
          )}

          {step === AppStep.Loading && renderLoading()}
          {step === AppStep.Error && renderError()}
          {step === AppStep.Result && renderResult()}
        </div>
      </div>
    </div>
  );
};

export default App;