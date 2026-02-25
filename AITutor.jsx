import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Brain,
  Loader2,
  Sparkles,
  BookOpen,
  Lightbulb,
  Target,
  RefreshCw
} from 'lucide-react';

const suggestedTopics = [
  { label: 'Algebra Basics', prompt: 'Explain the basics of algebra with simple examples' },
  { label: 'Photosynthesis', prompt: 'How does photosynthesis work? Explain for a beginner' },
  { label: 'Grammar Rules', prompt: 'What are the basic English grammar rules?' },
  { label: 'World War II', prompt: 'Give me a brief overview of World War II' },
];

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI tutor. I can help you understand any topic, explain concepts in simple terms, and answer your questions. What would you like to learn today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [difficulty, setDifficulty] = useState('beginner');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a friendly and helpful AI educational tutor. Your goal is to explain concepts clearly and make learning enjoyable.

Student's difficulty level: ${difficulty}
Response language: ${selectedLanguage}

Important guidelines:
- Use simple, clear language appropriate for the difficulty level
- Provide examples when helpful
- Break down complex topics into smaller parts
- Be encouraging and supportive
- If the question is unclear, ask for clarification

Student's question: ${text}

Provide a helpful, educational response.`,
        response_json_schema: {
          type: "object",
          properties: {
            explanation: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            example: { type: "string" },
            follow_up_question: { type: "string" }
          }
        }
      });

      let formattedResponse = response.explanation;
      
      if (response.key_points?.length > 0) {
        formattedResponse += '\n\n📌 **Key Points:**\n' + response.key_points.map(p => `• ${p}`).join('\n');
      }
      
      if (response.example) {
        formattedResponse += '\n\n💡 **Example:**\n' + response.example;
      }
      
      if (response.follow_up_question) {
        formattedResponse += '\n\n🤔 ' + response.follow_up_question;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: formattedResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I encountered an error. Please try asking your question again." 
      }]);
    }

    setIsLoading(false);
  };

  const handleSuggestedTopic = (topic) => {
    sendMessage(topic.prompt);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Tutor</h1>
        <p className="text-muted-foreground">
          Your personal AI learning assistant - ask anything!
        </p>
      </div>

      {/* Settings */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Language:</span>
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
                <option value="Chinese">中文</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Level:</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="p-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Topics */}
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestedTopics.map((topic) => (
          <Button
            key={topic.label}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestedTopic(topic)}
            className="gap-2"
          >
            <Sparkles className="w-3 h-3" />
            {topic.label}
          </Button>
        ))}
      </div>

      {/* Chat Area */}
      <Card className="min-h-[500px] flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto max-h-[500px] space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-line text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-4 rounded-2xl">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="gradient-primary text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => sendMessage("Give me a practice problem to solve")}>
          <CardContent className="p-4 flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Practice Problem</p>
              <p className="text-sm text-muted-foreground">Get a problem to solve</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => sendMessage("Explain the last concept in a different way")}>
          <CardContent className="p-4 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Explain Differently</p>
              <p className="text-sm text-muted-foreground">Try another approach</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => sendMessage("Give me a real-world example of this concept")}>
          <CardContent className="p-4 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Real Example</p>
              <p className="text-sm text-muted-foreground">See practical use</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
