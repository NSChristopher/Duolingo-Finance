import api from './api';
import { LessonPath, Lesson, ProgressSummary } from '../types';

export const lessonApi = {
  // Get all lesson paths
  async getLessonPaths(): Promise<LessonPath[]> {
    const response = await api.get('/api/lessons/paths');
    return response.data;
  },

  // Get lesson path with user progress
  async getLessonPath(pathId: number): Promise<LessonPath> {
    const response = await api.get(`/api/lessons/paths/${pathId}`);
    return response.data;
  },

  // Get specific lesson
  async getLesson(lessonId: number): Promise<Lesson> {
    const response = await api.get(`/api/lessons/${lessonId}`);
    return response.data;
  },

  // Start lesson
  async startLesson(lessonId: number) {
    const response = await api.post(`/api/lessons/${lessonId}/start`);
    return response.data;
  },

  // Complete lesson
  async completeLesson(lessonId: number, score: number) {
    const response = await api.post(`/api/lessons/${lessonId}/complete`, { score });
    return response.data;
  },

  // Get progress summary
  async getProgressSummary(): Promise<ProgressSummary> {
    const response = await api.get('/api/lessons/progress/summary');
    return response.data;
  }
};