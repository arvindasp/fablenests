import UpgradeButton from "@/components/UpgradeButton";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fdf6e3] py-16 px-4 sm:px-6 lg:px-8 font-[Lora]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Nest</h2>
        <p className="text-lg text-gray-700 mb-12">Find the right plan for magical bedtime stories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Hatchling Plan */}
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Hatchling</h3>
          <p className="text-gray-700 mb-4">Perfect for casual dreamers. Always free.</p>
          <p className="text-3xl font-bold text-gray-900 mb-6">$0<span className="text-base font-normal text-gray-600">/month</span></p>
          <ul className="text-left space-y-2 text-gray-800">
            <li>✅ 1 story per day</li>
            <li>✅ Short story length</li>
            <li>🚫 No audio narration</li>
            <li>🚫 No custom illustrations</li>
            <li>🚫 Cannot save stories</li>
          </ul>
          <button className="mt-6 w-full bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl cursor-default">
            Current Plan
          </button>
        </div>

        {/* Nestling Plan */}
        <div className="border border-blue-600 rounded-2xl p-6 shadow-md bg-blue-50">
          <h3 className="text-2xl font-semibold text-blue-900 mb-2">Nestling</h3>
          <p className="text-blue-800 mb-4">For little dreamers who want more magic</p>
          <p className="text-3xl font-bold text-blue-900 mb-6">$6.99<span className="text-base font-normal text-blue-700">/month</span></p>
          <ul className="text-left space-y-2 text-blue-900">
            <li>✅ Longer stories</li>
            <li>✅ Up to 5 stories per week</li>
            <li>🕐 Audio narration (coming soon)</li>
            <li>🕐 Save your favorite stories (coming soon)</li>
            <li>🕐 Custom illustrations (coming soon)</li>
            <li>🕐 Personalize characters (coming soon)</li>
          </ul>

          {/* 🧙‍♂️ Here we use the real Upgrade Button */}
          <div className="mt-6 w-full">
            <UpgradeButton />
          </div>
        </div>
      </div>
    </div>
  );
}
