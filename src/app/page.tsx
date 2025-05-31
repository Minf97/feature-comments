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
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  A modern comment display system, featuring a design style similar to e-commerce platforms. It supports intelligent sorting, real-time filtering, search functionality, image upload, nested replies, and reporting. Built with real product comment data, it showcases the full functionality of comment management and multi-scenario applications.
                </p>
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
