import React from 'react';
import MetaTags from '@/components/SEO/MetaTags';

const PrivacyPolicyPage = () => {
  return (
    <>
      <MetaTags
        title="Privacy Policy"
        description="Privacy Policy for dataengineerhub.blog"
      />
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert max-w-none text-gray-300">
          <p className="text-gray-400">Last Updated: September 24, 2025</p>

          <p>
            Welcome to DataEngineer Hub ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">1. WHAT INFORMATION DO WE COLLECT?</h2>
          <p>
            <strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us when you subscribe to our newsletter, contact us, or comment on our articles. This information may include your name and email address.
          </p>
          <p>
            <strong>Information automatically collected:</strong> We automatically collect certain information when you visit, use or navigate the website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information. This information is primarily needed to maintain the security and operation of our website, and for our internal analytics and reporting purposes.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">2. HOW DO WE USE YOUR INFORMATION?</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes, including to send you marketing and promotional communications, to manage user accounts, and to deliver and facilitate delivery of services to the user.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, or Legal Obligations.
          </p>
          
          <h2 className="text-xl font-bold text-white mt-8">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">5. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">6. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p>
            In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
          </p>
          
          <h2 className="text-xl font-bold text-white mt-8">Advertising Privacy Statement</h2>
          {/* Ezoic's script will automatically find this span and insert the required privacy policy content. */}
          <span id="ezoic-privacy-policy-embed"></span>

          <h2 className="text-xl font-bold text-white mt-8">7. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>
            If you have questions or comments about this notice, you may contact us through the contact form on our website or by emailing [Your Contact Email Address].
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;