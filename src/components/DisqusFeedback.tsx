import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export const DisqusFeedback: React.FC = () => {
  useEffect(() => {
    // Standard Disqus Embed Initialization
    const scriptId = 'disqus-embed-script';
    const existingScript = document.getElementById(scriptId);

    if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = 'rainrouter-sg-landing';
            this.page.url = window.location.href;
            this.page.title = 'RainRouter SG - Community Feedback & Discussion';
          }
        });
      } catch (e) {
        console.warn('Disqus reset error:', e);
      }
    } else if (!existingScript) {
      const d = document;
      const s = d.createElement('script');
      s.id = scriptId;
      s.src = 'https://rainrouter.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      (d.head || d.body).appendChild(s);
    }
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-[#c3c6d4]/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#003178]/10 text-[#003178] flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#003178]">
              Feedback & Discussion
            </h3>
            <p className="text-xs sm:text-sm text-[#434652]">
              Join the conversation: suggest new sheltered walkway links, report rain sensor conditions, or share commute feedback.
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-6"></div>

        {/* Disqus Embed Container */}
        <div id="disqus_thread" className="min-h-[280px]"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-[#003178] underline" rel="noreferrer" target="_blank">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
