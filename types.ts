export enum ExperienceLevel {
  Iniciante = 'Iniciante',
  Intermediario = 'Intermediário',
  Avancado = 'Avançado'
}

export enum FitnessGoal {
  Hipertrofia = 'Hipertrofia Muscular',
  PerdaGordura = 'Perda de Gordura',
  Forca = 'Ganho de Força',
  Resistencia = 'Resistência Muscular',
  Condicionamento = 'Condicionamento Físico'
}

export enum MuscleGroup {
  Peito = 'Peito',
  Costas = 'Costas',
  Pernas = 'Pernas',
  Ombros = 'Ombros',
  Biceps = 'Bíceps',
  Triceps = 'Tríceps',
  Abdomen = 'Abdômen',
  FullBody = 'Corpo Completo (Full Body)',
  UpperBody = 'Membros Superiores',
  LowerBody = 'Membros Inferiores'
}

export interface UserPreferences {
  level: ExperienceLevel | null;
  goal: FitnessGoal | null;
  muscleGroup: MuscleGroup | null;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string; // Tip on technique or intensity
  imageUrl?: string; // Generated image URL
}

export interface WorkoutPlan {
  title: string;
  description: string;
  estimatedDuration: string;
  frequencyRecommendation: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export enum AppStep {
  Intro = 0,
  SelectLevel = 1,
  SelectGoal = 2,
  SelectMuscle = 3,
  Loading = 4,
  Result = 5,
  Error = 6
}