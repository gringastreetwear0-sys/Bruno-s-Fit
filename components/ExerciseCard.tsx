import React, { useEffect, useState } from 'react';
import { Exercise } from '../types';
import { generateExerciseImage } from '../services/geminiService';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        const url = await generateExerciseImage(exercise.name);
        if (isMounted && url) {
          setImageUrl(url);
        }
      } catch (err) {
        console.error("Error loading image", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [exercise.name]);

  return (
    <div className="bg-surface rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col md:flex-row gap-6">
      {/* Exercise Details */}
      <div className="flex-1 order-2 md:order-1">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold flex-shrink-0">
            {index + 1}
          </div>
          <h4 className="text-xl font-semibold text-white">{exercise.name}</h4>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 bg-dark/50 p-3 rounded-lg">
          <div className="text-center border-r border-slate-700 last:border-0">
            <span className="block text-xs text-slate-500 uppercase">Séries</span>
            <span className="text-lg font-bold text-primary">{exercise.sets}</span>
          </div>
          <div className="text-center border-r border-slate-700 last:border-0">
            <span className="block text-xs text-slate-500 uppercase">Reps</span>
            <span className="text-lg font-bold text-white">{exercise.reps}</span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-slate-500 uppercase">Descanso</span>
            <span className="text-lg font-bold text-slate-300">{exercise.rest}</span>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg">
          <p className="text-sm text-blue-200 flex gap-2">
            <span className="font-bold">Dica:</span> {exercise.notes}
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-48 flex-shrink-0 order-1 md:order-2">
        <div className="aspect-square rounded-lg overflow-hidden bg-dark/50 border border-slate-700 flex items-center justify-center relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-500">Gerando visual...</span>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={exercise.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};