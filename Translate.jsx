import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  ArrowRight,
  RefreshCw,
  Brain,
  Target,
  Loader2
} from 'lucide-react';

const sampleQuiz = {
  title: 'Algebra Basics Quiz',
  questions: [
    {
      id: 1,
      question: 'What does a variable represent in algebra?',
      options: ['A fixed number', 'An unknown value', 'A mathematical operation', 'A constant'],
      correct: 1,
      topic: 'Variables'
    },
    {
      id: 2,
      question: 'Simplify: 3x + 2x',
      options: ['5x', '6x', '5', 'x5'],
      correct: 0,
      topic: 'Simplification'
    },
    {
      id: 3,
      question: 'What is the value of x in: x + 5 = 12?',
      options: ['5', '7', '17', '12'],
      correct: 1,
      topic: 'Equations'
    },
    {
      id: 4,
      question: 'Which is an algebraic expression?',
      options: ['5 + 3 = 8', '2x + 7', '15', 'x = 5'],
      correct: 1,
      topic: 'Expressions'
    },
    {
      id: 5,
      question: 'What is the coefficient in 4y?',
      options: ['y', '4y', '4', 'None'],
      correct: 2,
      topic: 'Coefficients'
    }
  ]
};

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const question = sampleQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuiz.questions.length) * 100;

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const getExplanation = async () => {
    setIsLoadingExplanation(true);
    setShowExplanation(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Explain why the correct answer to this question is option ${question.correct + 1}:

Question: ${question.question}
Options: ${question.options.map((o, i) => `${i + 1}. ${o}`).join(', ')}
Correct Answer: ${question.options[question.correct]}

Provide a brief, clear explanation suitable for a student learning algebra.`,
      });
      
      setExplanation(response);
    } catch (error) {
      setExplanation('Sorry, could not load explanation.');
    }
    
    setIsLoadingExplanation(false);
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, {
      questionId: question.id,
      selected: selectedAnswer,
      correct: selectedAnswer === question.correct
    }];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setExplanation('');

    if (currentQuestion < sampleQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setShowExplanation(false);
    setQuizStarted(false);
  };

  const score = answers.filter(a => a.correct).length;
  const percentage = Math.round((score / sampleQuiz.questions.length) * 100);

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center p-8">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">{sampleQuiz.title}</h1>
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="py-2 px-4">
              <Clock className="w-4 h-4 mr-2" />
              5 minutes
            </Badge>
            <Badge variant="outline" className="py-2 px-4">
              {sampleQuiz.questions.length} Questions
            </Badge>
          </div>
          <p className="text-muted-foreground mb-8">
            Test your knowledge of basic algebra concepts. You'll get instant feedback and AI-powered explanations!
          </p>
          <Button 
            size="lg" 
            className="gradient-primary text-white"
            onClick={() => setQuizStarted(true)}
          >
            Start Quiz
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              percentage >= 70 ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {percentage >= 70 ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <Target className="w-12 h-12 text-orange-600" />
              )}
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
          <p className="text-xl text-muted-foreground mb-6">
            You scored {score} out of {sampleQuiz.questions.length}
          </p>
          
          <div className="w-full max-w-xs mx-auto mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Score</span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="p-4 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </Card>
            <Card className="p-4 bg-red-50 dark:bg-red-900/20">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{sampleQuiz.questions.length - score}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={restartQuiz}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="gradient-primary text-white">
                View Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleQuiz.questions.map((q, idx) => (
              <div key={q.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted">
                {answers[idx]?.correct ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{q.question}</p>
                  <p className="text-sm text-muted-foreground">
                    Correct: {q.options[q.correct]}
                  </p>
                </div>
                <Badge variant="outline">{q.topic}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="py-2 px-4">
          Question {currentQuestion + 1} of {sampleQuiz.questions.length}
        </Badge>
        <Badge variant="outline" className="py-2 px-4">
          <Clock className="w-4 h-4 mr-2" />
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge>{question.topic}</Badge>
              </div>
              <CardTitle className="text-xl mt-4">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === index
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={getExplanation}
          disabled={selectedAnswer === null}
          className="flex-1"
        >
          <Brain className="w-4 h-4 mr-2" />
          Get AI Explanation
        </Button>
        <Button
          onClick={nextQuestion}
          disabled={selectedAnswer === null}
          className="flex-1 gradient-primary text-white"
        >
          {currentQuestion < sampleQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <Card className="gradient-card border-primary/20">
          <CardContent className="p-4">
            {isLoadingExplanation ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                <p className="font-medium text-primary mb-2">AI Explanation:</p>
                <p className="text-sm">{explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
