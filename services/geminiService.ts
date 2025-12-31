import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, WorkoutPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const workoutSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy title for the workout session.",
    },
    description: {
      type: Type.STRING,
      description: "A brief overview of the workout focus and intensity.",
    },
    estimatedDuration: {
      type: Type.STRING,
      description: "Estimated time to complete the workout (e.g., '45-60 min').",
    },
    frequencyRecommendation: {
      type: Type.STRING,
      description: "How many times per week this specific workout should be done.",
    },
    warmup: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of warm-up activities.",
    },
    exercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          sets: { type: Type.STRING, description: "Number of sets (e.g., '3-4')." },
          reps: { type: Type.STRING, description: "Repetition range (e.g., '8-12' or 'Até a falha')." },
          rest: { type: Type.STRING, description: "Rest time between sets (e.g., '60-90s')." },
          notes: { type: Type.STRING, description: "Technique tip or intensity instruction (e.g., 'Focus on the eccentric phase')." },
        },
        required: ["name", "sets", "reps", "rest", "notes"],
      },
    },
    cooldown: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of cool-down or stretching activities.",
    },
  },
  required: ["title", "description", "estimatedDuration", "frequencyRecommendation", "warmup", "exercises", "cooldown"],
};

export const generateWorkoutPlan = async (prefs: UserPreferences): Promise<WorkoutPlan> => {
  const prompt = `
    Crie um plano de treino de musculação completo e detalhado.
    
    Perfil do Usuário:
    - Nível de Experiência: ${prefs.level}
    - Objetivo Principal: ${prefs.goal}
    - Grupo Muscular do Dia: ${prefs.muscleGroup}
    
    Diretrizes:
    1. O treino deve seguir princípios profissionais de educação física.
    2. Priorize segurança e biomecânica correta, especialmente se for iniciante.
    3. Para "Hipertrofia", foque em volume e tensão mecânica.
    4. Para "Força", foque em cargas altas e repetições baixas.
    5. Para "Perda de Gordura", sugira intensidade alta ou bi-sets se apropriado.
    6. A linguagem deve ser motivadora, clara e em PORTUGUÊS (PT-BR).
    7. As "notes" (observações) de cada exercício devem ser dicas práticas de execução.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workoutSchema,
        systemInstruction: "Você é um personal trainer de elite mundial. Você cria treinos altamente eficazes, seguros e baseados em ciência. Responda sempre em JSON válido.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as WorkoutPlan;
  } catch (error) {
    console.error("Error generating workout:", error);
    throw error;
  }
};

export const generateExerciseImage = async (exerciseName: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a clean, professional, fitness illustration (technical drawing style or realistic 3D render) of a person performing the exercise: "${exerciseName}". 
            The background must be plain white or very light gray. 
            Focus on correct form and posture. 
            Full body view.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.warn(`Failed to generate image for ${exerciseName}:`, error);
    return null;
  }
};