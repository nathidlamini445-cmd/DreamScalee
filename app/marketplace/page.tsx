"use client"

import { useState, useMemo } from "react"
import { HorizontalNav } from "@/components/horizontal-nav"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { HolographicPlanet } from "@/components/ui/holographic-planet"
import { OpportunityCard } from "@/components/marketplace/opportunity-card"
import { FilterBar, FilterState } from "@/components/marketplace/filter-bar"
import { ProgressTracker } from "@/components/marketplace/progress-tracker"
import { mockOpportunities } from "@/lib/marketplace-data"
import { motion } from "framer-motion"

export default function MarketplacePage() {
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    deadline: "All",
    remote: "All",
    paid: "All",
    mood: "All",
    search: ""
  })
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([])

  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter(opportunity => {
      // Search filter
      if (filters.search && !opportunity.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !opportunity.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !opportunity.company.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.category !== "All" && opportunity.category !== filters.category) {
        return false
      }

      // Remote filter
      if (filters.remote === "Remote" && !opportunity.isRemote) {
        return false
      }
      if (filters.remote === "Local" && opportunity.isRemote) {
        return false
      }

      // Paid filter
      if (filters.paid === "Paid" && !opportunity.isPaid) {
        return false
      }
      if (filters.paid === "Unpaid" && opportunity.isPaid) {
        return false
      }
      if (filters.paid === "Prize" && !opportunity.payout.includes("Prize")) {
        return false
      }

      // Mood filter
      if (filters.mood !== "All" && !opportunity.mood.includes(filters.mood.toLowerCase())) {
        return false
      }

      // Deadline filter (simplified)
      if (filters.deadline === "Today") {
        const today = new Date()
        const deadline = new Date(opportunity.deadline)
        if (deadline.toDateString() !== today.toDateString()) {
          return false
        }
      }

      return true
    })
  }, [filters])

  const handleApply = (id: string) => {
    console.log(`Applied to opportunity ${id}`)
    // Here you would typically handle the application logic
  }

  const handleSave = (id: string) => {
    setSavedOpportunities(prev => 
      prev.includes(id) 
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="background-beams-container">
        <BackgroundBeams className="background-beams" />
      </div>
      <HolographicPlanet />
      
      <div className="relative z-10 main-container">
        <HorizontalNav />
        
        <main className="pt-24">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Pitch Point
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect to offers, projects, and clients that help your business grow.
              </p>
            </motion.div>

            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <FilterBar onFiltersChange={setFilters} />
            </motion.div>

            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {filteredOpportunities.length} Opportunities Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {savedOpportunities.length} saved • Sorted by match percentage
                </p>
              </div>
            </motion.div>

            {/* Opportunities Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <OpportunityCard
                    opportunity={opportunity}
                    onApply={handleApply}
                    onSave={handleSave}
                    isSaved={savedOpportunities.includes(opportunity.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredOpportunities.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No opportunities found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters to see more opportunities
                </p>
              </motion.div>
            )}

            {/* Saved Opportunities Section */}
            {savedOpportunities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your Saved Opportunities
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {savedOpportunities.length} opportunity{savedOpportunities.length !== 1 ? 'ies' : ''} saved
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities
                    .filter(opportunity => savedOpportunities.includes(opportunity.id))
                    .map((opportunity, index) => (
                      <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <OpportunityCard
                          opportunity={opportunity}
                          onApply={handleApply}
                          onSave={handleSave}
                          isSaved={true}
                        />
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Progress Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <ProgressTracker
                appliedCount={0}
                savedCount={savedOpportunities.length}
                completedCount={0}
                monthlyGoal={0}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
