import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  Filter,
  Subtitles,
  Volume2
} from 'lucide-react';

const categories = [
  { value: 'all', label: 'All Courses' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'language', label: 'Language' },
  { value: 'technology', label: 'Technology' },
  { value: 'arts', label: 'Arts' },
  { value: 'history', label: 'History' }
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
};

// Sample courses for demonstration
const sampleCourses = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    description: 'Learn the fundamentals of algebraic expressions and equations',
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
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    description: 'Understand the basic principles of physics and motion',
    category: 'science',
    difficulty: 'intermediate',
    language: 'English',
    duration_hours: 20,
    lessons_count: 32,
    enrolled_count: 890,
    rating: 4.6,
    has_subtitles: true,
    has_audio_description: false,
    instructor_name: 'Prof. Michael Chen',
    thumbnail_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400'
  },
  {
    id: '3',
    title: 'Spanish for Beginners',
    description: 'Start your journey to fluency in Spanish',
    category: 'language',
    difficulty: 'beginner',
    language: 'Spanish',
    duration_hours: 15,
    lessons_count: 30,
    enrolled_count: 2100,
    rating: 4.9,
    has_subtitles: true,
    has_audio_description: true,
    instructor_name: 'Maria Garcia',
    thumbnail_url: 'https://images.unsplash.com/photo-1489945052260-4f21c52571e7?w=400'
  },
  {
    id: '4',
    title: 'Web Development Bootcamp',
    description: 'Build modern websites from scratch',
    category: 'technology',
    difficulty: 'intermediate',
    language: 'English',
    duration_hours: 40,
    lessons_count: 60,
    enrolled_count: 3500,
    rating: 4.7,
    has_subtitles: true,
    has_audio_description: false,
    instructor_name: 'Alex Thompson',
    thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'
  },
  {
    id: '5',
    title: 'World History: Ancient Civilizations',
    description: 'Explore the great civilizations of the ancient world',
    category: 'history',
    difficulty: 'beginner',
    language: 'English',
    duration_hours: 18,
    lessons_count: 28,
    enrolled_count: 780,
    rating: 4.5,
    has_subtitles: true,
    has_audio_description: true,
    instructor_name: 'Dr. Emily Roberts',
    thumbnail_url: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=400'
  },
  {
    id: '6',
    title: 'Digital Art & Design',
    description: 'Master digital illustration and graphic design',
    category: 'arts',
    difficulty: 'intermediate',
    language: 'English',
    duration_hours: 25,
    lessons_count: 40,
    enrolled_count: 1450,
    rating: 4.8,
    has_subtitles: true,
    has_audio_description: false,
    instructor_name: 'Jessica Lee',
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'
  }
];

export default function Courses() {
  const [courses, setCourses] = useState(sampleCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Explore Courses</h1>
        <p className="text-muted-foreground">
          Find the perfect course for your learning journey
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full lg:w-auto">
          <TabsList className="flex-wrap h-auto gap-1">
            {categories.map(cat => (
              <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={createPageUrl('CourseDetail') + `?id=${course.id}`}>
              <Card className="group h-full hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {course.has_subtitles && (
                      <Badge variant="secondary" className="bg-white/90 text-black text-xs">
                        <Subtitles className="w-3 h-3 mr-1" />
                        CC
                      </Badge>
                    )}
                    {course.has_audio_description && (
                      <Badge variant="secondary" className="bg-white/90 text-black text-xs">
                        <Volume2 className="w-3 h-3 mr-1" />
                        AD
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={difficultyColors[course.difficulty]}>
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{course.language}</span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration_hours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessons_count}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {course.instructor_name}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.enrolled_count.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
