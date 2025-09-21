import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNewsletter } from '@/hooks/useWordPress';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { subscribe, loading, error } = useNewsletter();
  const { toast } = useToast();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await subscribe(email);
      
      if (result.success) {
        setIsSubscribed(true);
        toast({
          title: "🎉 Successfully Subscribed!",
          description: "Welcome to DataEngineer Hub! You'll receive our latest articles and insights.",
        });
        
        setTimeout(() => {
          setIsSubscribed(false);
          setEmail('');
        }, 3000);
      } else {
        toast({
          title: "Subscription Failed",
          description: result.error || "Could not subscribe. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      // Fallback to local storage for development/demo
      try {
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        if (subscriptions.includes(email)) {
          toast({
            title: "Already Subscribed",
            description: "This email address is already on our list!",
          });
          return;
        }

        subscriptions.push(email);
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));

        setIsSubscribed(true);
        toast({
          title: "🎉 Successfully Subscribed!",
          description: "Welcome to DataEngineer Hub! You'll receive our latest articles and insights.",
        });
        
        setTimeout(() => {
          setIsSubscribed(false);
          setEmail('');
        }, 3000);

      } catch (localError) {
        console.error("Failed to save subscription:", localError);
        toast({
          title: "Subscription Failed",
          description: "Could not save your subscription. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-effect rounded-2xl p-6 md:p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
            >
              <Mail className="h-6 w-6 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              Stay Ahead of the <span className="gradient-text">Data Curve</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-sm text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed"
            >
              Join 10,000+ data professionals who get weekly insights, tutorials, and industry updates 
              delivered straight to their inbox. No spam, just pure data engineering gold.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  disabled={isSubscribed || loading}
                />
                {isSubscribed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </motion.div>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubscribed || loading}
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                  isSubscribed 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } text-white group`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Subscribing...
                  </>
                ) : isSubscribed ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mb-4"
              >
                Error: {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>Weekly insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No spam ever</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>Unsubscribe anytime</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
