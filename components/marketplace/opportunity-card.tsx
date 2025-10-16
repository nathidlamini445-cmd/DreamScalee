"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ExternalLink, MapPin, Clock, DollarSign, Palette, PenTool, Camera, Megaphone, Mic, GraduationCap, Video, Code, Lightbulb, Grid3X3, Users, Target } from "lucide-react"
import { Opportunity } from "@/lib/marketplace-data"
import { motion } from "framer-motion"

interface OpportunityCardProps {
  opportunity: Opportunity
  onApply?: (id: string) => void
  onSave?: (id: string) => void
  isSaved?: boolean
}

export function OpportunityCard({ opportunity, onApply, onSave, isSaved = false }: OpportunityCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCategoryColor = (category: string) => {
    const colors = {
      Design: "bg-purple-700 text-purple-700 border-purple-700",
      Writing: "bg-blue-700 text-blue-700 border-blue-700",
      Photography: "bg-green-700 text-green-700 border-green-700",
      Marketing: "bg-orange-700 text-orange-700 border-orange-700",
      Audio: "bg-pink-700 text-pink-700 border-pink-700",
      Education: "bg-indigo-700 text-indigo-700 border-indigo-700",
      Video: "bg-red-100 text-red-700 border-red-200",
      Development: "bg-gray-100 text-gray-700 border-gray-200",
      Consulting: "bg-yellow-700 text-yellow-700 border-yellow-700"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      Design: Palette,
      Writing: PenTool,
      Photography: Camera,
      Marketing: Megaphone,
      Audio: Mic,
      Education: GraduationCap,
      Video: Video,
      Development: Code,
      Consulting: Lightbulb
    }
    const IconComponent = icons[category as keyof typeof icons] || Target
    return IconComponent
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`p-6 transition-all duration-300 cursor-pointer group ${
        isHovered 
          ? "shadow-xl shadow-blue-500/10 border-blue-200" 
          : "shadow-md hover:shadow-lg border-gray-200"
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              {React.createElement(getCategoryIcon(opportunity.category), {
                className: "h-5 w-5 text-blue-600 dark:text-blue-400"
              })}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors text-lg">
                {opportunity.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{opportunity.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getCategoryColor(opportunity.category)}`}>
              {opportunity.category}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave?.(opportunity.id)}
              className={`p-2 transition-colors ${
                isSaved 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-800 dark:text-gray-200 text-sm mb-4 line-clamp-2 font-medium">
          {opportunity.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">{opportunity.payout}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{opportunity.timeLeft}</span>
            </div>
            {!opportunity.isRemote && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{opportunity.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Match Percentage */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Match:</span>
            <span className={`font-semibold ${getMatchColor(opportunity.matchPercentage)}`}>
              {opportunity.matchPercentage}%
            </span>
          </div>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${opportunity.matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onApply?.(opportunity.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

      </Card>
    </motion.div>
  )
}
