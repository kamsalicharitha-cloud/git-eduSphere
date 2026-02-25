import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Lock,
  ChevronRight,
  Languages,
  Subtitles,
  Volume2,
  ArrowLeft
} from 'lucide-react';

// Sample course data
const courseData = {
  id: '1',
  title: 'Introduction to Algebra',
  description: 'Learn the fundamentals of algebraic expressions and equations. This comprehensive course covers everything from basic concepts to advanced problem-solving techniques. Perfect for students who want to build a strong foundation in mathematics.',
  category: 'mathematics',
  difficulty: 'beginner',
  language: 'English',
  duration_hours: 12,
  lessons_count: 24,
  enrolled_count: 1250,
  rating: 4.8,
  has_subtitles: true,
  has_audio_description: true,
  instructor_name: 'Dr. Sarah Johnson',
  thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800'
};

const lessons = [
  { id: 1, title: 'What is Algebra?', duration: '15 min', completed: true, free: true },
  { id: 2, title: 'Variables and Constants', duration: '20 min', completed: true, free: true },
  { id: 3, title: 'Basic Operations', duration: '25 min', completed: false, free: false },
  { id: 4, title: 'Simplifying Expressions', duration: '30 min', completed: false, free: false },
  { id: 5, title: 'Solving Linear Equations', duration: '35 min', completed: false, free: false },
  { id: 6, title: 'Word Problems', duration: '40 min', completed: false, free: false },
];

const availableLanguages = ['English', 'Spanish', 'French', 'Hindi', 'Arabic', 'Chinese'];

export default function CourseDetail() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const progress = Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to={createPageUrl('Courses')}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <img
              src={courseData.thumbnail_url}
              alt={courseData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button size="lg" className="gradient-primary text-white shadow-xl">
                <Play className="w-6 h-6 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{courseData.category}</Badge>
              <Badge className="bg-green-100 text-green-700">{courseData.difficulty}</Badge>
              {courseData.has_subtitles && (
                <Badge variant="secondary">
                  <Subtitles className="w-3 h-3 mr-1" />
                  Subtitles
                </Badge>
              )}
              {courseData.has_audio_description && (
                <Badge variant="secondary">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Audio Description
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">{courseData.title}</h1>
            <p className="text-muted-foreground">{courseData.description}</p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 p-6 bg-muted rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>{courseData.duration_hours} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>{courseData.lessons_count} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>{courseData.enrolled_count.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
              <span>{courseData.rating} rating</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {lessons.filter(l => l.completed).length} of {lessons.length} lessons completed
              </p>
              <Link to={createPageUrl('QuizPage') + `?course=${courseData.id}`}>
                <Button className="w-full">Take Quiz</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background"
              >
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <p className="text-sm text-muted-foreground mt-2">
                AI will translate content to your selected language
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructor</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {courseData.instructor_name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{courseData.instructor_name}</p>
                <p className="text-sm text-muted-foreground">Mathematics Expert</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={createPageUrl('Lesson') + `?course=${courseData.id}&lesson=${lesson.id}`}
              >
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    lesson.completed 
                      ? 'bg-green-100 text-green-600' 
                      : lesson.free 
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : lesson.free ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                  </div>
                  
                  {lesson.free && !lesson.completed && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Free
                    </Badge>
                  )}
                  
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
