const Privacy = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Effective Date:</strong> January 2025<br />
            <strong>Last Updated:</strong> January 2025
          </p>

          <p className="mb-6">
            Socsargen Hospital ("we", "our", or "us") is committed to protecting your personal data and respecting your privacy in accordance with Republic Act No. 10173 or the Data Privacy Act of 2012.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect the following types of personal information:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, date of birth, gender, contact details (email, phone number, address)</li>
            <li><strong>Medical Information:</strong> Medical history, symptoms, diagnoses, treatments, and prescriptions</li>
            <li><strong>Account Information:</strong> Username, password (encrypted), and login activity</li>
            <li><strong>Technical Information:</strong> IP address, browser type, and device information for security purposes</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">Your information is used for:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Processing appointment bookings and managing your healthcare</li>
            <li>Communicating with you about your appointments and health services</li>
            <li>Improving our services and patient experience</li>
            <li>Complying with legal and regulatory requirements</li>
            <li>Sending health tips and updates (with your consent)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Protection Measures</h2>
          <p className="mb-4">We implement the following security measures:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>SSL/TLS encryption for all data transmission (HTTPS)</li>
            <li>Encrypted storage of sensitive data including passwords</li>
            <li>Role-based access control limiting data access to authorized personnel only</li>
            <li>Regular security audits and updates</li>
            <li>Secure backup systems with encrypted storage</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Your Rights Under the Data Privacy Act</h2>
          <p className="mb-4">As a data subject, you have the right to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Be Informed:</strong> Know how your personal data is being processed</li>
            <li><strong>Access:</strong> Request access to your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete personal data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal requirements)</li>
            <li><strong>Object:</strong> Object to certain types of processing</li>
            <li><strong>Data Portability:</strong> Obtain a copy of your data in a portable format</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Sharing</h2>
          <p className="mb-6">
            We do not sell your personal data. We may share your information only with:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Healthcare providers involved in your care</li>
            <li>Government agencies when required by law</li>
            <li>Third-party service providers who assist in our operations (under strict confidentiality agreements)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Retention</h2>
          <p className="mb-6">
            We retain your personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by law. Medical records are retained in accordance with Department of Health regulations.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Cookies and Tracking</h2>
          <p className="mb-6">
            Our website uses essential cookies for functionality and security. We do not use tracking cookies for advertising purposes.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Our Data Protection Officer</h2>
          <p className="mb-6">
            For questions, concerns, or to exercise your rights under the Data Privacy Act, contact our Data Protection Officer:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p><strong>Email:</strong> dpo@socsargen-hospital.com</p>
            <p><strong>Phone:</strong> (083) 123-4567</p>
            <p><strong>Address:</strong> Socsargen Hospital, General Santos City, Philippines</p>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes through our website or via email.
          </p>

          <div className="border-t pt-6 mt-8">
            <p className="text-gray-600 text-sm">
              This Privacy Policy is compliant with Republic Act No. 10173 (Data Privacy Act of 2012) and its Implementing Rules and Regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
