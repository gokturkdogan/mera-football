import { prisma } from './prisma'
import { AdminPlan } from '@prisma/client'

export interface PlanLimits {
  maxPlayers: number
  maxMatchesLifetime: number
  maxOrganizations: number
}

export const PLAN_LIMITS: Record<AdminPlan, PlanLimits> = {
  FREE: {
    maxPlayers: 14,
    maxMatchesLifetime: 2,
    maxOrganizations: 1,
  },
  PREMIUM: {
    maxPlayers: 999999,
    maxMatchesLifetime: 999999,
    maxOrganizations: 3,
  },
  PREMIUM_PLUS: {
    maxPlayers: 999999,
    maxMatchesLifetime: 999999,
    maxOrganizations: 5,
  },
}

// Get admin's plan (check if they have active premium payment)
export async function getAdminPlan(adminId: string): Promise<AdminPlan> {
  const user = await prisma.user.findUnique({
    where: { id: adminId },
    select: { plan: true },
  })

  if (!user) {
    return 'FREE'
  }

  return user.plan || 'FREE'
}

// Check if admin has premium plan
export async function isAdminPremium(adminId: string): Promise<boolean> {
  const plan = await getAdminPlan(adminId)
  return plan === 'PREMIUM'
}

export async function checkOrganizationLimits(
  organizationId: string,
  action: 'ADD_PLAYER' | 'CREATE_MATCH'
): Promise<{ allowed: boolean; reason?: string }> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      owner: {
        select: {
          id: true,
          plan: true,
        },
      },
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

  // Get admin's plan (not organization's plan)
  const adminPlan = organization.owner.plan || 'FREE'
  const limits = PLAN_LIMITS[adminPlan]

  if (action === 'ADD_PLAYER') {
    if (organization._count.members >= limits.maxPlayers) {
      const planName = adminPlan === 'FREE' ? 'Ücretsiz' : adminPlan === 'PREMIUM' ? 'Premium' : 'Premium Plus'
      return {
        allowed: false,
        reason: `${planName} plan için maksimum ${limits.maxPlayers} oyuncu izni verilir`,
      }
    }
  }

  if (action === 'CREATE_MATCH') {
    if (limits.maxMatchesLifetime < 999999) {
      const totalMatches = await prisma.match.count({
        where: {
          organizationId,
        },
      })

      if (totalMatches >= limits.maxMatchesLifetime) {
        const planName = adminPlan === 'FREE' ? 'Ücretsiz' : adminPlan === 'PREMIUM' ? 'Premium' : 'Premium Plus'
        return {
          allowed: false,
          reason: `${planName} plan için maksimum ${limits.maxMatchesLifetime} maç izni verilir`,
        }
      }
    }
  }

  return { allowed: true }
}
