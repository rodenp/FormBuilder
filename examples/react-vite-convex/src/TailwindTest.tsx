export function TailwindTest() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Tailwind CSS Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Basic Colors Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Colors</h2>
          <div className="space-y-2">
            <div className="w-full h-4 bg-blue-500 rounded"></div>
            <div className="w-full h-4 bg-green-500 rounded"></div>
            <div className="w-full h-4 bg-red-500 rounded"></div>
            <div className="w-full h-4 bg-yellow-500 rounded"></div>
          </div>
        </div>

        {/* Typography Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Typography</h2>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Small text</p>
            <p className="text-base text-slate-700">Base text</p>
            <p className="text-lg text-slate-800">Large text</p>
            <p className="text-xl font-bold text-slate-900">Bold text</p>
          </div>
        </div>

        {/* Spacing Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Spacing</h2>
          <div className="space-y-4">
            <div className="bg-blue-100 p-2 rounded">Padding 2</div>
            <div className="bg-blue-100 p-4 rounded">Padding 4</div>
            <div className="bg-blue-100 p-6 rounded">Padding 6</div>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Interactive Elements</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Primary Button
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors">
            Secondary Button
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Success Button
          </button>
        </div>
      </div>

      {/* Custom Brand Colors */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Custom Brand Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-full h-16 bg-brand-50 rounded mb-2 border"></div>
            <span className="text-xs text-slate-600">brand-50</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-brand-100 rounded mb-2"></div>
            <span className="text-xs text-slate-600">brand-100</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-brand-500 rounded mb-2"></div>
            <span className="text-xs text-white">brand-500</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-brand-600 rounded mb-2"></div>
            <span className="text-xs text-white">brand-600</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-brand-700 rounded mb-2"></div>
            <span className="text-xs text-white">brand-700</span>
          </div>
        </div>
      </div>

      {/* Glass Effects */}
      <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Glass Effects</h2>
        <div className="space-y-4">
          <div className="glass p-4 rounded-lg">
            <p className="text-slate-800">Glass effect with backdrop blur</p>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <p className="text-slate-800">Glass card with stronger backdrop</p>
          </div>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Responsive Grid</h2>
        <div className="responsive-columns cols-3">
          <div className="bg-slate-100 p-4 rounded text-center">Column 1</div>
          <div className="bg-slate-200 p-4 rounded text-center">Column 2</div>
          <div className="bg-slate-300 p-4 rounded text-center">Column 3</div>
        </div>
      </div>
    </div>
  );
}