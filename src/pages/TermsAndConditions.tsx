
const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this mental health support application, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Medical Disclaimer</h2>
          <p className="mb-3">
            This application is designed to provide supportive guidance and is NOT a substitute for professional medical advice, diagnosis, or treatment. 
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Always seek the advice of qualified health providers with any questions regarding mental health conditions</li>
            <li>Never disregard professional medical advice because of something you have read or experienced in this app</li>
            <li>If you are experiencing a mental health emergency, contact emergency services immediately</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. AI Model Configuration</h2>
          <p className="mb-3">
            This application supports multiple AI models for providing responses:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Gemini API:</strong> Cloud-based AI service provided by Google</li>
            <li><strong>Ollama:</strong> Local AI models that run on your device</li>
          </ul>
          <p className="mt-3">
            By configuring and using these AI models, you acknowledge that:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>AI responses are generated based on patterns in training data and may not always be accurate</li>
            <li>Local models (Ollama) process data on your device for enhanced privacy</li>
            <li>Cloud models may send data to third-party servers as per their privacy policies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Privacy and Data</h2>
          <p>
            We are committed to protecting your privacy. Your personal conversations and data are handled according to our privacy policy and the privacy policies of any third-party AI services you choose to use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Use the application responsibly and in accordance with its intended purpose</li>
            <li>Do not rely solely on the application for mental health support</li>
            <li>Seek professional help when needed</li>
            <li>Keep your account information secure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p>
            The application providers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Emergency Contacts</h2>
          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
            <p className="font-semibold text-red-700 dark:text-red-300 mb-2">If you are in crisis:</p>
            <ul className="space-y-1 text-red-600 dark:text-red-400">
              <li>🚨 Emergency: 911 (US) or your local emergency number</li>
              <li>📞 National Suicide Prevention Lifeline: 988 (US)</li>
              <li>💬 Crisis Text Line: Text HOME to 741741</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Updates to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of the application constitutes acceptance of any changes.
          </p>
        </section>

        <div className="border-t pt-6 mt-8">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
