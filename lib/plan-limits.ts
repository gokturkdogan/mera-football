import { prisma } from './prisma'
import { OrganizationPlan } from '@prisma/client'

export interface PlanLimits {
  maxPlayers: number
  maxMatchesPerWeek: number
}

export const PLAN_LIMITS: Record<OrganizationPlan, PlanLimits> = {
  FREE: {
    maxPlayers: 10,
    maxMatchesPerWeek: 1,
  },
  PREMIUM: {
    maxPlayers: 999999,
    maxMatchesPerWeek: 999999,
  },
}

export async function checkOrganizationLimits(
  organizationId: string,
  action: 'ADD_PLAYER' | 'CREATE_MATCH'
): Promise<{ allowed: boolean; reason?: string }> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      _count: {
        select: {
          members: {
            where: {
              status: 'APPROVED',
            },
          },
        },
      },
    },
  })

  if (!organization) {
    return { allowed: false, reason: 'Organization not found' }
  }

  const limits = PLAN_LIMITS[organization.plan]

  if (action === 'ADD_PLAYER') {
    if (organization._count.members >= limits.maxPlayers) {
      return {
        allowed: false,
        reason: `Maximum ${limits.maxPlayers} players allowed for ${organization.plan} plan`,
      }
    }
  }

  if (action === 'CREATE_MATCH') {
    if (limits.maxMatchesPerWeek < 999999) {
      const matchDate = new Date()
      const weekStart = new Date(matchDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const matchesThisWeek = await prisma.match.count({
        where: {
          organizationId,
          date: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
      })

      if (matchesThisWeek >= limits.maxMatchesPerWeek) {
        return {
          allowed: false,
          reason: `Maximum ${limits.maxMatchesPerWeek} match per week allowed for ${organization.plan} plan`,
        }
      }
    }
  }

  return { allowed: true }
}

