"use client";

export function TypographyGuide() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-h1 mb-4">Typography System Guide</h1>
        <p className="text-body-large">
          Comprehensive font size and typography system for CLORIT
        </p>
      </div>

      {/* Headings */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Heading Hierarchy</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-h1">Heading 1 - Display Title</h1>
            <p className="text-caption text-gray-500 mt-1">text-h1 • 3rem (48px) • Bold • Tight leading</p>
          </div>
          <div>
            <h2 className="text-h2">Heading 2 - Section Title</h2>
            <p className="text-caption text-gray-500 mt-1">text-h2 • 2.25rem (36px) • Bold • Tight leading</p>
          </div>
          <div>
            <h3 className="text-h3">Heading 3 - Subsection</h3>
            <p className="text-caption text-gray-500 mt-1">text-h3 • 1.875rem (30px) • Semibold • Snug leading</p>
          </div>
          <div>
            <h4 className="text-h4">Heading 4 - Card Title</h4>
            <p className="text-caption text-gray-500 mt-1">text-h4 • 1.5rem (24px) • Semibold • Snug leading</p>
          </div>
          <div>
            <h5 className="text-h5">Heading 5 - Component Title</h5>
            <p className="text-caption text-gray-500 mt-1">text-h5 • 1.25rem (20px) • Medium • Snug leading</p>
          </div>
          <div>
            <h6 className="text-h6">Heading 6 - Small Title</h6>
            <p className="text-caption text-gray-500 mt-1">text-h6 • 1.125rem (18px) • Medium • Snug leading</p>
          </div>
        </div>
      </section>

      {/* Body Text */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Body Text Styles</h2>
        <div className="space-y-4">
          <div>
            <p className="text-body-large">
              Large body text - Used for hero descriptions and important content that needs emphasis.
            </p>
            <p className="text-caption text-gray-500 mt-1">text-body-large • 1.125rem (18px) • Normal • Relaxed leading</p>
          </div>
          <div>
            <p className="text-body">
              Regular body text - The standard text size for most content, paragraphs, and descriptions.
              This should be comfortable to read for extended periods.
            </p>
            <p className="text-caption text-gray-500 mt-1">text-body • 1rem (16px) • Normal • Relaxed leading</p>
          </div>
          <div>
            <p className="text-body-small">
              Small body text - Used for secondary information, captions, and supplementary content.
            </p>
            <p className="text-caption text-gray-500 mt-1">text-body-small • 0.875rem (14px) • Normal • Normal leading</p>
          </div>
          <div>
            <p className="text-caption">
              Caption text - For metadata, timestamps, and very small supporting text.
            </p>
            <p className="text-caption text-gray-500 mt-1">text-caption • 0.75rem (12px) • Normal • Normal leading</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Button Typography</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button className="btn-text-large bg-blue-600 text-white px-6 py-3 rounded-lg">
              Large Button
            </button>
            <button className="btn-text-base bg-blue-600 text-white px-4 py-2 rounded-lg">
              Base Button
            </button>
            <button className="btn-text-small bg-blue-600 text-white px-3 py-1.5 rounded-lg">
              Small Button
            </button>
          </div>
          <div className="space-y-2 text-caption text-gray-500">
            <p>btn-text-large • 1.125rem (18px) • Semibold • Wide letter spacing</p>
            <p>btn-text-base • 1rem (16px) • Semibold • Normal letter spacing</p>
            <p>btn-text-small • 0.875rem (14px) • Medium • Normal letter spacing</p>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Form Typography</h2>
        <div className="space-y-4">
          <div className="max-w-md">
            <label className="form-label block mb-1">Form Label</label>
            <input 
              type="text" 
              className="form-input w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="Form input text"
            />
            <p className="form-helper mt-1">Helper text for additional guidance</p>
          </div>
          <div className="space-y-2 text-caption text-gray-500">
            <p>form-label • 0.875rem (14px) • Medium</p>
            <p>form-input • 1rem (16px) • Normal</p>
            <p>form-helper • 0.75rem (12px) • Normal</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Navigation Typography</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-8">
            <span className="nav-brand">CLORIT</span>
            <nav className="flex gap-6">
              <a href="#" className="nav-link">Features</a>
              <a href="#" className="nav-link">Pricing</a>
              <a href="#" className="nav-link">About</a>
            </nav>
          </div>
          <div className="space-y-2 text-caption text-gray-500">
            <p>nav-brand • 1.5rem (24px) • Bold • Tight letter spacing</p>
            <p>nav-link • 1rem (16px) • Medium • Normal letter spacing</p>
          </div>
        </div>
      </section>

      {/* Cards and Components */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Card Typography</h2>
        <div className="space-y-4">
          <div className="max-w-sm bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="card-title mb-2">Card Title</h3>
            <p className="card-description mb-4">
              Card description with supporting information about the content.
            </p>
            <p className="text-body">Regular content in the card body.</p>
          </div>
          <div className="space-y-2 text-caption text-gray-500">
            <p>card-title • 1.25rem (20px) • Semibold • Snug leading</p>
            <p>card-description • 0.875rem (14px) • Normal • Normal leading</p>
          </div>
        </div>
      </section>

      {/* Stats Display */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Stats Typography</h2>
        <div className="space-y-4">
          <div className="text-center">
            <div className="stat-number">1,234</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="space-y-2 text-caption text-gray-500">
            <p>stat-number • 1.875rem (30px) • Bold • None leading</p>
            <p>stat-label • 0.875rem (14px) • Medium</p>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Badge Typography</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="badge-text bg-blue-100 text-blue-800 px-2 py-1 rounded">Status</span>
            <span className="badge-text bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
          </div>
          <div className="text-caption text-gray-500">
            <p>badge-text • 0.75rem (12px) • Medium • Wide letter spacing</p>
          </div>
        </div>
      </section>

      {/* Responsive Behavior */}
      <section className="space-y-6">
        <h2 className="text-h2 border-b border-gray-200 pb-2">Responsive Typography</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-h4 mb-2">Responsive Scaling</h3>
            <div className="space-y-2 text-body-small">
              <p><strong>Mobile (≤640px):</strong> Font sizes scale down by ~12.5%</p>
              <p><strong>Tablet (641px-1023px):</strong> Base font sizes maintained</p>
              <p><strong>Desktop (≥1024px):</strong> Larger headings scale up for impact</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-h4 mb-2">Accessibility</h3>
            <div className="space-y-2 text-body-small">
              <p><strong>Minimum Size:</strong> 14px body text on mobile for readability</p>
              <p><strong>Line Height:</strong> 1.5+ for body text, tighter for headings</p>
              <p><strong>Contrast:</strong> WCAG AA compliant color combinations</p>
              <p><strong>Scaling:</strong> Relative units (rem) for user zoom support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
