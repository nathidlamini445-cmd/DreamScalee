"use client"

import { useState } from "react"
import { HorizontalNav } from "@/components/horizontal-nav"
import { Header } from "@/components/header"
import { QuickActions } from "@/components/quick-actions"
import { TasksPanel } from "@/components/tasks-panel"
import { EventsTimeline } from "@/components/events-timeline"
import { MotivationalQuotes } from "@/components/motivational-quotes"
import { MarketplaceWidget } from "@/components/marketplace/marketplace-widget"
import { SettingsModal } from "@/components/settings-modal"

export default function DashboardPage() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings)
    // Here you would typically save to localStorage, database, etc.
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="relative z-10 main-container">
        <HorizontalNav />
        <main className="pt-20">
          <Header onSettingsClick={() => setIsSettingsModalOpen(true)} />
          <div className="p-8 space-y-8">
            <QuickActions />
            <TasksPanel />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <EventsTimeline />
                <div className="mt-8">
                  <MotivationalQuotes />
                </div>
              </div>
              <div>
                <MarketplaceWidget />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  )
}
