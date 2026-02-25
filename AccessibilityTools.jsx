import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Volume2,
  Mic,
  Eye,
  Type,
  Palette,
  Accessibility,
  Play,
  Pause,
  StopCircle,
  Settings,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function AccessibilityTools() {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRate, setSpeechRate] = useState([1]);
  const [fontSize, setFontSize] = useState([16]);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  const recognitionRef = useRef(null);

  const speakText = () => {
    if (!text) return;
    
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate[0];
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceTranscript(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Mathematics is the language of the universe.",
    "Photosynthesis is the process by which plants make food.",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <Accessibility className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Accessibility Tools</h1>
        <p className="text-muted-foreground">
          Tools designed to make learning accessible for everyone
        </p>
      </div>

      <Tabs defaultValue="tts" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto">
          <TabsTrigger value="tts">
            <Volume2 className="w-4 h-4 mr-2" />
            Text-to-Speech
          </TabsTrigger>
          <TabsTrigger value="stt">
            <Mic className="w-4 h-4 mr-2" />
            Voice Input
          </TabsTrigger>
          <TabsTrigger value="visual">
            <Eye className="w-4 h-4 mr-2" />
            Visual Aids
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Text-to-Speech */}
        <TabsContent value="tts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Text-to-Speech
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(sample)}
                  >
                    Sample {index + 1}
                  </Button>
                ))}
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter or paste text to be read aloud..."
                className="min-h-[150px]"
                style={{ fontSize: `${fontSize[0]}px` }}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Speech Speed</Label>
                  <span className="text-sm text-muted-foreground">{speechRate[0]}x</span>
                </div>
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  min={0.5}
                  max={2}
                  step={0.25}
                  className="w-full"
                />
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={speakText}
                  disabled={!text}
                  className="gradient-primary text-white"
                >
                  {isSpeaking ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Read Aloud
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Speech-to-Text */}
        <TabsContent value="stt">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Speak to convert your voice to text. Great for students who prefer speaking over typing.
              </p>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  className={`w-24 h-24 rounded-full ${
                    isListening ? 'bg-red-500 hover:bg-red-600' : 'gradient-primary'
                  }`}
                >
                  {isListening ? (
                    <StopCircle className="w-10 h-10" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </Button>
              </div>

              {isListening && (
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  Listening...
                </div>
              )}

              <div className="p-6 bg-muted rounded-xl min-h-[150px]">
                {voiceTranscript ? (
                  <p className="text-lg">{voiceTranscript}</p>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Click the microphone and start speaking...
                  </p>
                )}
              </div>

              {voiceTranscript && (
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setText(voiceTranscript)}>
                    Send to Text-to-Speech
                  </Button>
                  <Button variant="outline" onClick={() => setVoiceTranscript('')}>
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Aids */}
        <TabsContent value="visual">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Font Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Size</Label>
                  <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                </div>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={12}
                  max={32}
                  step={2}
                  className="w-full"
                />
                <div 
                  className="p-4 bg-muted rounded-xl"
                  style={{ fontSize: `${fontSize[0]}px` }}
                >
                  This is a preview of the selected font size. Adjust the slider to find a comfortable reading size.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">Increases color contrast</p>
                  </div>
                  <Switch
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dyslexia-Friendly Font</Label>
                    <p className="text-sm text-muted-foreground">Easier to read font style</p>
                  </div>
                  <Switch
                    checked={dyslexiaFont}
                    onCheckedChange={setDyslexiaFont}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Accessibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Audio Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Auto-read content</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Sound effects</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Audio descriptions</span>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Visual Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Reduced motion</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Focus indicators</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Screen reader support</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Volume2 className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Text-to-Speech</h3>
            <p className="text-sm text-muted-foreground">
              Listen to content read aloud
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Mic className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Voice Input</h3>
            <p className="text-sm text-muted-foreground">
              Speak instead of typing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Visual Aids</h3>
            <p className="text-sm text-muted-foreground">
              Customize display settings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Type className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Dyslexia Support</h3>
            <p className="text-sm text-muted-foreground">
              Friendly fonts & spacing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
