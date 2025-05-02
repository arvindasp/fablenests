export default function PrivacyPolicyPage() {
    return (
      <div className="min-h-screen bg-[#f5ecd7] text-gray-800 font-body px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-title mb-6 text-center">Privacy Policy</h1>
  
        <p className="mb-4">
          At Fablenests, your privacy is important to us. We are committed to protecting the personal
          information of every family who uses our service — especially the little dreamers we help
          fall asleep each night.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8 mb-2">What We Collect</h2>
        <p className="mb-4">
          We only collect the minimum data needed to provide and improve our services:
          <ul className="list-disc list-inside mt-2">
            <li>Email address (for login and account identification)</li>
            <li>Plan information (to provide the correct story access)</li>
            <li>Story preferences (like theme and language)</li>
          </ul>
        </p>
  
        <h2 className="text-2xl font-semibold mt-8 mb-2">How We Use Your Data</h2>
        <p className="mb-4">
          We use your data to generate personalized bedtime stories, manage your subscription, and
          improve our storytelling platform. We never sell or share your data with third parties for
          advertising or marketing purposes.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8 mb-2">Cookies</h2>
        <p className="mb-4">
          We may use cookies to enhance your experience, such as remembering your session or story
          settings. You can disable cookies in your browser settings at any time.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8 mb-2">Children's Privacy</h2>
        <p className="mb-4">
          Fablenests is made for parents. We do not knowingly collect personal information from
          children under 13. All accounts must be created and managed by adults.
        </p>
  
        <h2 className="text-2xl font-semibold mt-8 mb-2">Contact Us</h2>
        <p className="mb-4">
          If you have questions about this policy, reach out to us at{" "}
          <a
            href="mailto:fablenests@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            fablenests@gmail.com
          </a>
          .
        </p>
  
        <p className="text-sm text-gray-600 mt-8">Last updated: May 2, 2025</p>
      </div>
    );
  }
  