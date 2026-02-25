import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Languages,
  Accessibility,
  BarChart3,
  Play,
  Sparkles,
  Users,
  Globe,
  Mic,
  Volume2,
  Eye
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Tutoring",
    description: "Get personalized explanations in your language with adaptive difficulty",
    page: "AITutor",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Languages,
    title: "Real-time Translation",
    description: "Learn in 50+ languages with instant text and audio translation",
    page: "Translate",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Accessibility,
    title: "Accessibility Tools",
    description: "Text-to-speech, screen readers, and adaptive interfaces for all",
    page: "AccessibilityTools",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Track progress, identify gaps, and get AI-recommended study plans",
    page: "Dashboard",
    color: "from-orange-500 to-amber-500"
  }
];

const stats = [
  { value: "50+", label: "Languages Supported", icon: Globe },
  { value: "10K+", label: "Active Learners", icon: Users },
  { value: "98%", label: "Accessibility Score", icon: Eye },
  { value: "24/7", label: "AI Tutor Available", icon: Brain }
];

const accessibilityFeatures = [
  { icon: Mic, label: "Voice Commands" },
  { icon: Volume2, label: "Text-to-Speech" },
  { icon: Eye, label: "Screen Reader" },
  { icon: Languages, label: "Multi-language" }
];

export default function Home() {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl gradient-primary p-8 lg:p-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Inclusive Education</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Education Without
              <br />
              <span className="text-white/80">Barriers</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl">
              Breaking down language, accessibility, and learning barriers with AI. 
              Personalized education for every student, everywhere.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl('Courses')}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Link to={createPageUrl('AITutor')}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Brain className="w-5 h-5 mr-2" />
                  Try AI Tutor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Powerful AI Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with inclusive design to make quality education accessible to everyone.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(feature.page)}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Accessibility Highlight */}
      <section className="bg-card rounded-3xl p-8 lg:p-12 border border-border">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Built for Everyone
            </h2>
            <p className="text-muted-foreground mb-8">
              Our platform is designed from the ground up with accessibility in mind. 
              Whether you have visual, hearing, or motor impairments, or simply learn better 
              in your native language, we've got you covered.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {accessibilityFeatures.map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-3xl gradient-primary opacity-10 absolute inset-0" />
            <div className="relative p-8">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
                alt="Students learning together"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card className="p-12 gradient-card border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who are already learning smarter with AI-powered personalization.
          </p>
          <Link to={createPageUrl('Courses')}>
            <Button size="lg" className="gradient-primary text-white shadow-xl">
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Courses
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
