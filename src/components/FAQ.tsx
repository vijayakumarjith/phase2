import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "Who can participate in STARTUP SPARK 2025?",
      answer: "The challenge is open to students and young entrepreneurs with innovative startup ideas. Teams should consist of 2-4 members."
    },
    {
      question: "What kind of ideas can be submitted?",
      answer: "We welcome innovative ideas across all domains. The focus should be on solving real-world problems with scalable solutions."
    },
    {
      question: "How will the teams be evaluated?",
      answer: "Teams will be evaluated based on innovation, feasibility, market potential, and presentation quality. Detailed criteria will be shared with selected participants."
    },
    {
      question: "What support will be provided to selected teams?",
      answer: "Selected teams will receive mentorship, workspace access, and potential funding opportunities. Top teams will be recognized as pre-incubated startups."
    },
    {
      question: "Is there a registration fee?",
      answer: "Registration fee details once signin there payment can be done"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-900 to-black">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Find answers to common questions about STARTUP SPARK
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-purple-400" />
                ) : (
                  <Plus className="w-5 h-5 text-purple-400" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 text-gray-300">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
