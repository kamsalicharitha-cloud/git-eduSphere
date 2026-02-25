import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Languages,
  BookOpen,
  Lightbulb,
  Loader2
} from 'lucide-react';

export default function Lesson() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const lessonContent = {
    title: 'What is Algebra?',
    content: `Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations. 

The word "algebra" comes from the Arabic word "al-jabr," which means "reunion of broken parts."

**Key Concepts:**
- Variables: Letters like x, y, z that represent unknown values
- Constants: Fixed numbers that don't change
- Expressions: Combinations of variables, constants, and operations
- Equations: Mathematical statements showing two expressions are equal

**Why Learn Algebra?**
Algebra is the foundation of advanced mathematics. It helps you:
1. Solve real-world problems
2. Think logically and systematically
3. Prepare for careers in science, engineering, and technology

**Example:**
If you have 5 apples and someone gives you more, you can write: 5 + x = total apples
Here, 'x' is the variable representing how many apples you received.`
  };

  const askAI = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful educational tutor. The student is learning about "${lessonContent.title}". 
        
Lesson content: ${lessonContent.content}

Student's question: ${question}

Please provide a clear, helpful explanation in ${selectedLanguage}. Use simple language and examples where appropriate.`,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            examples: { type: "array", items: { type: "string" } },
            tip: { type: "string" }
          }
        }
      });
      
      let formattedResponse = response.answer;
      if (response.examples?.length > 0) {
        formattedResponse += '\n\n**Examples:**\n' + response.examples.map((e, i) => `${i + 1}. ${e}`).join('\n');
      }
      if (response.tip) {
        formattedResponse += '\n\n💡 **Tip:** ' + response.tip;
      }
      
      setAiResponse(formattedResponse);
    } catch (error) {
      setAiResponse('Sorry, I encountered an error. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to={createPageUrl('CourseDetail') + '?id=1'}>
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Course
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="Hindi">हिंदी</option>
            <option value="Arabic">العربية</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Placeholder */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-gray-900">
              <img
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800"
                alt="Lesson"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full gradient-primary"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>
              </div>
              
              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <span className="text-sm">0:00 / 15:00</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Lesson Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {lessonContent.title}
                </CardTitle>
                <Badge>Lesson 1 of 24</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {lessonContent.content.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 whitespace-pre-line">{para}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" disabled>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Lesson
            </Button>
            <Link to={createPageUrl('Lesson') + '?course=1&lesson=2'}>
              <Button>
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar - AI Tutor */}
        <div className="space-y-6">
          <Card className="gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                AI Tutor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Have questions about this lesson? Ask the AI tutor for help in your language!
              </p>
              
              <Textarea
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
              />
              
              <Button 
                className="w-full gradient-primary text-white"
                onClick={askAI}
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask AI Tutor
                  </>
                )}
              </Button>
              
              {aiResponse && (
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-sm whitespace-pre-line">{aiResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Quick Translate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select any text in the lesson and it will be translated to {selectedLanguage}.
              </p>
              <Link to={createPageUrl('Translate')}>
                <Button variant="outline" className="w-full">
                  Open Full Translator
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
