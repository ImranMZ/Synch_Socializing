"use client";

import { useState, useCallback } from "react";
import { api, UserProfile, MatchProfile } from "@/lib/api";

interface UseGroqAIOptions {
  onQuizComplete?: (psychographic: any) => void;
}

export function useGroqAI(options: UseGroqAIOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [psychographicProfile, setPsychographicProfile] = useState<any>(null);

  const submitQuiz = useCallback(async (profile: UserProfile, quizAnswers: { question_id: string; answer: string }[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.submitQuiz(profile, quizAnswers);
      if (result.psychographic_profile) {
        setPsychographicProfile(result.psychographic_profile);
        options.onQuizComplete?.(result.psychographic_profile);
      }
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to submit quiz");
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const getMatchExplanation = useCallback(async (userProfile: UserProfile, matchProfile: MatchProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getMatchExplanation(userProfile, matchProfile);
    } catch (err: any) {
      setError(err.message || "Failed to get explanation");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getIcebreakers = useCallback(async (userProfile: UserProfile, matchProfile: MatchProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getIcebreakers(userProfile, matchProfile);
    } catch (err: any) {
      setError(err.message || "Failed to get icebreakers");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWavelength = useCallback(async (userProfile: UserProfile, matchProfile: MatchProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getWavelength(userProfile, matchProfile);
    } catch (err: any) {
      setError(err.message || "Failed to get wavelength");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPersona = useCallback(async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getPersona(profile, psychographicProfile ? Object.entries(psychographicProfile).map(([key, value]) => ({ dimension: key, score: value })) : undefined);
    } catch (err: any) {
      setError(err.message || "Failed to get persona");
      return null;
    } finally {
      setLoading(false);
    }
  }, [psychographicProfile]);

  const getBioGenerator = useCallback(async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getBioGenerator(profile);
    } catch (err: any) {
      setError(err.message || "Failed to generate bio");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPrediction = useCallback(async (userProfile: UserProfile, matchProfile: MatchProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getPrediction(userProfile, matchProfile);
    } catch (err: any) {
      setError(err.message || "Failed to get prediction");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDealbreakers = useCallback(async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getDealbreakers(profile);
    } catch (err: any) {
      setError(err.message || "Failed to analyze dealbreakers");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDiscovery = useCallback(async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getDiscovery(profile);
    } catch (err: any) {
      setError(err.message || "Failed to get discovery");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    psychographicProfile,
    submitQuiz,
    getMatchExplanation,
    getIcebreakers,
    getWavelength,
    getPersona,
    getBioGenerator,
    getPrediction,
    getDealbreakers,
    getDiscovery,
  };
}