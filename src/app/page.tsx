import { Headers } from "@/components/headers";
import { ViewportContainer, ViewportBody } from "@/components/viewport-container";
import { ScenarioShowcase } from "@/components/comments/scenario-showcase"

export default function Home() {
  return (
    <ViewportContainer>
      <Headers />
      
      <ViewportBody>
        <main className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-16">
              {/* 产品介绍区域 */}
              <section className="text-center space-y-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Interactive Comment Section Module
                </h1>
                <div className="max-w-4xl mx-auto leading-relaxed">
                  <p className="text-lg text-gray-600 mb-4">
                    A modern comment display system featuring e-commerce platform design style with comprehensive functionality and multi-scenario applications.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>🎨</span>
                      <span>shadcn/ui for modern component styling</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>🎯</span>
                      <span>lucide-react for unified SVG icon style</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>🌓</span>
                      <span>next-themes for light/dark mode switching</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>📱</span>
                      <span>Custom responsive design for perfect mobile adaptation</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>🖼️</span>
                      <span>yet-another-react-lightbox for image preview</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>🔍</span>
                      <span>code-inspector-plugin for debugging support</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 md:col-span-2 justify-center md:justify-start">
                      <span>🚀</span>
                      <span>CI/CD automation for deployment and release</span>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* 场景展示区域 */}
              <section>
                <ScenarioShowcase />
              </section>
            </div>
          </div>
        </main>
      </ViewportBody>
    </ViewportContainer>
  );
}
