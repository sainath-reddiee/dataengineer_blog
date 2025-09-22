import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Newsletter = ({ compact = false }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate subscription
    setIsSubscribed(true);
    toast({
      title: "🎉 Welcome aboard!",
      description: "You've successfully subscribed to our newsletter.",
    });
    
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 3000);
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 text-center"
      >
        <h2 className="text-xl font-bold mb-2">Stay Updated</h2>
        <p className="text-gray-300 text-sm mb-4">
          Get the latest data engineering insights delivered to your inbox.
        </p>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6"
            >
              <Send className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-green-400 py-3">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Successfully subscribed!</span>
          </div>
        )}
      </motion.div>
    );
  }

  // Full newsletter component for dedicated newsletter page
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Stay Ahead of the <span className="gradient-text">Data Curve</span>
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Join thousands of data professionals who get our weekly newsletter with the latest trends, 
          tutorials, and insights in data engineering.
        </p>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
            />
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold h-12 px-8"
            >
              <Send className="mr-2 h-5 w-5" />
              Subscribe Now
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center space-x-3 text-green-400 py-4">
            <CheckCircle className="h-6 w-6" />
            <span className="text-xl font-semibold">Successfully subscribed!</span>
          </div>
        )}
        
        <p className="text-gray-400 text-sm mt-4">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </motion.div>
  );
};

export default Newsletter;