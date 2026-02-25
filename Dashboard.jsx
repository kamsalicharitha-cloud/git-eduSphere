import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BookOpen,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Brain,
  Calendar,
  CheckCircle,
  ArrowRight,
  Flame
} from 'lucide-react';

const weeklyProgress = [
  { day: 'Mon', hours: 2.5, lessons: 4 },
  { day: 'Tue', hours: 1.5, lessons: 2 },
  { day: 'Wed', hours: 3.0, lessons: 5 },
  { day: 'Thu', hours: 2.0, lessons: 3 },
  { day: 'Fri', hours: 2.5, lessons: 4 },
  { day: 'Sat', hours: 4.0, lessons: 6 },
  { day: 'Sun', hours: 1.0, lessons: 2 },
];

const subjectPerformance = [
  { name: 'Algebra', score: 85, color: '#8b5cf6' },
  { name: 'Physics', score: 72, color: '#06b6d4' },
  { name: 'Spanish', score: 90, color: '#22c55e' },
  { name: 'History', score: 78, color: '#f59e0b' },
];

const recentActivities = [
  { type: 'lesson', title: 'Completed: Variables in Algebra', time: '2 hours ago', icon: CheckCircle },
  { type: 'quiz', title: 'Quiz Score: 85% in Physics', time: '4 hours ago', icon: Trophy },
  { type: 'lesson', title: 'Started: Spanish Basics', time: '1 day ago', icon: BookOpen },
  { type: 'achievement', title: 'Earned: 7-Day Streak Badge', time: '2 days ago', icon: Flame },
];

const recommendedCourses = [
  { title: 'Advanced Algebra', reason: 'Based on your progress', progress: 0 },
  { title: 'Physics: Energy', reason: 'Improve weak areas', progress: 0 },
  { title: 'Spanish Grammar', reason: 'Continue learning', progress: 35 },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.full_name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground">Track your progress and keep learning</p>
        </div>
        <Link to={createPageUrl('Courses')}>
          <Button className="gradient-primary text-white">
            Continue Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Courses Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">47h</p>
                <p className="text-sm text-muted-foreground">Total Learning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip />
                <Bar dataKey="hours" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{subject.name}</span>
                  <span className="font-medium">{subject.score}%</span>
                </div>
                <Progress value={subject.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-muted">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'achievement' ? 'bg-orange-100 text-orange-600' :
                  activity.type === 'quiz' ? 'bg-green-100 text-green-600' :
                  'bg-primary/10 text-primary'
                }`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedCourses.map((course, index) => (
              <div key={index} className="p-4 rounded-xl bg-background border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.reason}</p>
                  </div>
                  <Badge variant="outline">
                    {course.progress > 0 ? `${course.progress}%` : 'New'}
                  </Badge>
                </div>
                {course.progress > 0 && (
                  <Progress value={course.progress} className="h-1.5 mt-2" />
                )}
              </div>
            ))}
            <Link to={createPageUrl('Courses')}>
              <Button variant="outline" className="w-full">
                View All Recommendations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Learning Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-muted">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">16.5 / 20</p>
              <p className="text-muted-foreground">Hours this week</p>
              <Progress value={82} className="h-2 mt-4" />
            </div>

            <div className="text-center p-6 rounded-xl bg-muted">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">26 / 30</p>
              <p className="text-muted-foreground">Lessons completed</p>
              <Progress value={87} className="h-2 mt-4" />
            </div>

            <div className="text-center p-6 rounded-xl bg-muted">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">4 / 5</p>
              <p className="text-muted-foreground">Quizzes passed</p>
              <Progress value={80} className="h-2 mt-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
