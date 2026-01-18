'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { useToast } from '@/components/ui/toast'
import Navbar from '@/components/Navbar'
import { Target, Calendar, Clock, MapPin, CheckCircle2, XCircle, FileText, Users, Star, Pencil, X, Plus, Lightbulb, Trophy, ExternalLink, DollarSign, TreePine, Home, Loader2, ChevronLeft, ChevronRight, CheckCircle, ChevronDown, StarHalf, CalendarDays } from 'lucide-react'

interface Match {
  id: string
  date: string
  time: string
  venue: string | null
  capacity: number | null
  status: string
  organization: {
    id: string
    name: string
    ownerId: string
  }
  roster: Array<{
    id: string
    userId: string
    position: string | null
    user: {
      id: string
      name: string
      email: string
      avatarUrl: string | null
    }
  }>
  scores: {
    teamAScore: number
    teamBScore: number
  } | null
  goals: Array<{
    id: string
    userId: string
    team: string
    minute: number | null
    user: {
      id: string
      name: string
      avatarUrl: string | null
    }
  }>
  ratings: Array<{
    id: string
    raterId: string
    ratedUserId: string
    rating: number
    comment: string | null
    rater: { name: string }
    ratedUser: { name: string }
  }>
  playerAverages: Array<{
    id: string
    userId: string
    averageRating: number
    ratingCount: number
    user: {
      id: string
      name: string
    }
  }>
}

export default function MatchPage() {
  const router = useRouter()
  const params = useParams()
  const { showToast } = useToast()
  const [match, setMatch] = useState<Match | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showScoreForm, setShowScoreForm] = useState(false)
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [showVenueEdit, setShowVenueEdit] = useState(false)
  const [venueValue, setVenueValue] = useState('')
  const [savingVenue, setSavingVenue] = useState(false)
  const [showDateEdit, setShowDateEdit] = useState(false)
  const [showTimeEdit, setShowTimeEdit] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [timeValue, setTimeValue] = useState('')
  const [savingDate, setSavingDate] = useState(false)
  const [savingTime, setSavingTime] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [currentVenueFacilityIndex, setCurrentVenueFacilityIndex] = useState(0)
  const venueFacilityCarouselRef = useRef<HTMLDivElement>(null)
  const venueTouchStartX = useRef<number | null>(null)
  const venueTouchEndX = useRef<number | null>(null)
  const [scoreData, setScoreData] = useState({
    teamAScore: 0,
    teamBScore: 0,
  })
  const [goals, setGoals] = useState<Array<{ userId: string; goals: number; team: 'A' | 'B' }>>([])
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [goalCount, setGoalCount] = useState(1)
  const [isPlayerSelectOpen, setIsPlayerSelectOpen] = useState(false)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [submittingRating, setSubmittingRating] = useState(false)
  const [organizationMembers, setOrganizationMembers] = useState<Array<{
    id: string
    userId: string
    status: string
    attendanceStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED'
    user: {
      id: string
      name: string
      email: string
      avatarUrl?: string | null
      averageRating?: number | null
    }
  }>>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null)
  const [facilities, setFacilities] = useState<Array<{
    id: string
    name: string
    location: string
    matchPrice: number | null
    isIndoor: boolean | null
    fieldType: string | null
  }>>([])
  const [selectedFacility, setSelectedFacility] = useState<{
    id: string
    name: string
    location: string
    matchPrice: number | null
    isIndoor: boolean | null
    fieldType: string | null
  } | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<'PENDING' | 'ACCEPTED' | 'DECLINED'>('PENDING')
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [isOrganizationMember, setIsOrganizationMember] = useState(false)
  const [showRemovePlayerModal, setShowRemovePlayerModal] = useState(false)
  const [playerToRemove, setPlayerToRemove] = useState<{ id: string; userId: string; name: string } | null>(null)
  const [removingPlayer, setRemovingPlayer] = useState(false)
  const [showClearRosterModal, setShowClearRosterModal] = useState(false)
  const [showNoGoalsModal, setShowNoGoalsModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<'FINISHED' | 'PUBLISHED' | null>(null)
  const [clearingRoster, setClearingRoster] = useState(false)
  
  // Free formation: players can be placed anywhere on the field
  const [formation, setFormation] = useState<{
    teamA: Array<{ userId: string; x: number; y: number }>
    teamB: Array<{ userId: string; x: number; y: number }>
  }>({
    teamA: [],
    teamB: [],
  })

  useEffect(() => {
    fetchUser()
    fetchMatch()
  }, [])

  useEffect(() => {
    if (match && user) {
      fetchOrganizationMembers()
      loadFormationFromRoster()
      fetchFacilities()
      fetchAttendanceStatus()
      checkOrganizationMembership()
    }
  }, [match, user])

  const checkOrganizationMembership = async () => {
    if (!match || !user) return
    try {
      const res = await fetch(`/api/organizations/${match.organization.id}/members`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        const isMember = data.members.some((m: any) => m.userId === user.id && m.status === 'APPROVED')
        setIsOrganizationMember(isMember)
      }
    } catch (error) {
      console.error('Error checking membership:', error)
    }
  }

  useEffect(() => {
    if (match?.venue && facilities.length > 0) {
      const facility = facilities.find(f => f.name === match.venue)
      if (facility) {
        setSelectedFacility(facility)
      } else {
        setSelectedFacility(null)
      }
    } else {
      setSelectedFacility(null)
    }
  }, [match?.venue, facilities])

  const fetchAttendanceStatus = async () => {
    if (!match || !user) return
    // Owner is always ACCEPTED, no need to fetch
    if (user.id === match.organization.ownerId) {
      setAttendanceStatus('ACCEPTED')
      return
    }
    try {
      const res = await fetch(`/api/matches/${match.id}/attendance`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setAttendanceStatus(data.attendance.status || 'PENDING')
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error)
    }
  }

  const handleAttendanceUpdate = async (status: 'ACCEPTED' | 'DECLINED') => {
    if (!match) return
    setLoadingAttendance(true)
    try {
      const res = await fetch(`/api/matches/${match.id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setAttendanceStatus(status)
        showToast(status === 'ACCEPTED' ? 'Maça katılacağınızı belirttiniz!' : 'Maça katılmayacağınızı belirttiniz.', 'success')
        // Refresh organization members list to update disabled status
        await fetchOrganizationMembers()
        // If declined, refresh match to update roster (player removed from roster)
        if (status === 'DECLINED') {
          await fetchMatch()
        }
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setLoadingAttendance(false)
    }
  }

  useEffect(() => {
    if (match?.venue && facilities.length > 0) {
      const facility = facilities.find(f => f.name === match.venue)
      if (facility) {
        setSelectedFacility(facility)
      } else {
        setSelectedFacility(null)
      }
    } else {
      setSelectedFacility(null)
    }
  }, [match?.venue, facilities])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${params.id}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Maç bulunamadı veya erişim izniniz yok' }))
        if (res.status === 404) {
          showToast('Maç bulunamadı', 'error')
        } else if (res.status === 403) {
          showToast('Bu maça erişim izniniz yok. Organizasyonun üyesi olmanız gerekiyor.', 'error')
        } else if (res.status === 401) {
          showToast('Giriş yapmanız gerekiyor', 'error')
          router.push('/login')
          return
        } else {
          showToast(errorData.error || 'Maç yüklenirken bir hata oluştu', 'error')
        }
        router.push('/dashboard')
        return
      }
      const data = await res.json()
      setMatch(data.match)
      setVenueValue(data.match.venue || '')
      if (data.match.date) {
        setSelectedDate(new Date(data.match.date))
      }
      setTimeValue(data.match.time || '')
      if (data.match.scores) {
        setScoreData({
          teamAScore: data.match.scores.teamAScore,
          teamBScore: data.match.scores.teamBScore,
        })
      }
    } catch (error) {
      console.error('Error fetching match:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganizationMembers = async () => {
    if (!match || !user) return
    setLoadingMembers(true)
    try {
      const isOwnerCheck = user.id === match.organization.ownerId
      // If user is owner and match is not finished, get all members with attendance status
      if (isOwnerCheck && match.status !== 'FINISHED' && match.status !== 'PUBLISHED') {
        const res = await fetch(`/api/matches/${match.id}/attendance/list`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          // Show all members with attendance status (owner is always ACCEPTED)
          const allMembers = data.allMembers.map((m: any) => ({
            id: m.id,
            userId: m.userId,
            status: m.status,
            attendanceStatus: m.attendanceStatus || 'PENDING',
            user: m.user,
          }))
          
          setOrganizationMembers(allMembers)
        } else {
          // Fallback to regular members API
          const res2 = await fetch(`/api/organizations/${match.organization.id}/members`, {
            credentials: 'include',
          })
          if (res2.ok) {
            const data = await res2.json()
            const approved = data.members.filter((m: any) => m.status === 'APPROVED')
            setOrganizationMembers(approved)
          }
        }
      } else {
        // For non-owners or finished matches, show all approved members with attendance status
        const res = await fetch(`/api/organizations/${match.organization.id}/members`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          // Filter only approved members
          const approved = data.members.filter((m: any) => m.status === 'APPROVED')
          
          // Get all match attendances in one query
          const attendancesRes = await fetch(`/api/matches/${match.id}/attendance/all`, {
            credentials: 'include',
          })
          
          let attendanceMap = new Map<string, 'PENDING' | 'ACCEPTED' | 'DECLINED'>()
          
          if (attendancesRes.ok) {
            const attendanceData = await attendancesRes.json()
            attendanceData.attendances?.forEach((att: any) => {
              attendanceMap.set(att.userId, att.status)
            })
          }
          
          // Add owner to attendance map as ACCEPTED
          if (match.organization.ownerId) {
            attendanceMap.set(match.organization.ownerId, 'ACCEPTED')
          }
          
          // Map members with attendance status
          const membersWithAttendance = approved.map((m: any) => ({
            id: m.id,
            userId: m.userId,
            status: m.status,
            attendanceStatus: attendanceMap.get(m.userId) || 'PENDING',
            user: m.user,
          }))
          
          setOrganizationMembers(membersWithAttendance)
        }
      }
    } catch (error) {
      console.error('Error fetching organization members:', error)
    } finally {
      setLoadingMembers(false)
    }
  }

  const fetchFacilities = async () => {
    if (!match) return
    try {
      const res = await fetch(`/api/organizations/${match.organization.id}/facilities`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setFacilities(data.facilities || [])
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
    }
  }

  // Extract map embed URL from iframe HTML or use directly if it's already a URL
  const getMapEmbedUrl = (locationData: string | null | undefined): string => {
    if (!locationData) {
      return ''
    }
    
    // If it's a full iframe HTML, extract the src URL
    if (locationData.includes('<iframe')) {
      const srcMatch = locationData.match(/src=["']([^"']+)["']/i)
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1]
      }
    }
    
    // If it's already a Google Maps embed URL (contains pb= parameter), use it directly
    if (locationData.includes('google.com/maps/embed') && locationData.includes('pb=')) {
      return locationData
    }
    
    // If it's a plain URL, try to convert to embed format
    try {
      if (locationData.includes('google.com/maps')) {
        const url = new URL(locationData)
        
        // Check if ftid (feature ID) exists
        if (url.searchParams.has('ftid')) {
          const ftid = url.searchParams.get('ftid')
          return `https://www.google.com/maps?ftid=${ftid}&output=embed&hl=tr`
        }
        
        // If q parameter exists
        if (url.searchParams.has('q')) {
          const query = url.searchParams.get('q')
          if (query) {
            if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(query)) {
              const [lat, lng] = query.split(',')
              return `https://www.google.com/maps?q=${lat},${lng}&output=embed&hl=tr&z=15`
            }
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=tr&z=15`
          }
        }
        
        // Add output=embed to existing URL
        const separator = locationData.includes('?') ? '&' : '?'
        return `${locationData}${separator}output=embed`
      }
      
      // Return as is if we can't parse it
      return locationData
    } catch (error) {
      // If parsing fails, return the original data
      return locationData
    }
  }

  const loadFormationFromRoster = () => {
    if (!match || !match.roster) return
    
    const newFormation = {
      teamA: [] as Array<{ userId: string; x: number; y: number }>,
      teamB: [] as Array<{ userId: string; x: number; y: number }>,
    }
    
    match.roster?.forEach((player) => {
      if (player.position) {
        const parts = player.position.split('_')
        const team = parts[0]
        
        // Try to parse x, y coordinates (new format: "A_x_y")
        if (parts.length === 3) {
          const x = parseFloat(parts[1])
          const y = parseFloat(parts[2])
          if (!isNaN(x) && !isNaN(y)) {
            if (team === 'A') {
              newFormation.teamA.push({ userId: player.userId, x, y })
            } else if (team === 'B') {
              newFormation.teamB.push({ userId: player.userId, x, y })
            }
            return
          }
        }
        
        // Fallback: old format with position names (for backward compatibility)
        const pos = parts[1]
        if (team === 'A') {
          // Default positions for Team A (bottom half)
          const defaultPositions: { [key: string]: { x: number; y: number } } = {
            gk: { x: 50, y: 10 },
            df1: { x: 25, y: 25 },
            df2: { x: 50, y: 25 },
            df3: { x: 75, y: 25 },
            mf1: { x: 35, y: 40 },
            mf2: { x: 65, y: 40 },
            fw1: { x: 50, y: 60 },
          }
          const position = defaultPositions[pos] || { x: 50, y: 30 }
          newFormation.teamA.push({ userId: player.userId, x: position.x, y: position.y })
        } else if (team === 'B') {
          // Default positions for Team B (top half)
          const defaultPositions: { [key: string]: { x: number; y: number } } = {
            gk: { x: 50, y: 90 },
            df1: { x: 25, y: 75 },
            df2: { x: 50, y: 75 },
            df3: { x: 75, y: 75 },
            mf1: { x: 35, y: 60 },
            mf2: { x: 65, y: 60 },
            fw1: { x: 50, y: 40 },
          }
          const position = defaultPositions[pos] || { x: 50, y: 70 }
          newFormation.teamB.push({ userId: player.userId, x: position.x, y: position.y })
        }
      }
    })
    
    setFormation(newFormation)
  }

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, userId: string) => {
    if (!match || match.status === 'FINISHED' || match.status === 'PUBLISHED' || !isOwner) return
    setDraggedPlayer(userId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!match || !draggedPlayer || match.status !== 'DRAFT' || !isOwner) return
    
    const fieldElement = e.currentTarget
    const rect = fieldElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Determine team based on y position: top half = Team B, bottom half = Team A
    const team: 'A' | 'B' = y < 50 ? 'B' : 'A'
    
    await handlePositionSelect(team, x, y, draggedPlayer)
    setDraggedPlayer(null)
  }

  const handlePositionSelect = async (team: 'A' | 'B', x: number, y: number, userId: string | null) => {
    if (!match || !user) return
    const isOwnerCheck = user.id === match.organization.ownerId
    if (!isOwnerCheck) return
    
    // Check if player has accepted the match
    if (userId && userId !== match.organization.ownerId) {
      const member = organizationMembers.find(m => m.userId === userId)
      if (member && member.attendanceStatus !== 'ACCEPTED') {
        showToast('Bu oyuncu maçı henüz kabul etmedi', 'error')
        return
      }
    }
    
    // Update formation state
    setFormation((prev) => {
      const newFormation = { ...prev }
      
      // Remove player from both teams if exists
      newFormation.teamA = newFormation.teamA.filter(p => p.userId !== userId)
      newFormation.teamB = newFormation.teamB.filter(p => p.userId !== userId)
      
      // Add player to the correct team
      if (userId) {
        newFormation[team === 'A' ? 'teamA' : 'teamB'].push({ userId, x, y })
      }
      
      return newFormation
    })
    
    if (!userId) return // If clearing position, don't add to roster
    
    // Check if player is already in roster
    const isAlreadyInRoster = match.roster?.some(p => p.userId === userId) || false
    
    // Save position as "team_x_y" format
    const positionKey = `${team}_${x.toFixed(1)}_${y.toFixed(1)}`
    
    try {
      // If player is already in roster, delete first then add with new position
      if (isAlreadyInRoster) {
        // Delete existing roster entry
        const deleteRes = await fetch(`/api/matches/${params.id}/roster?userId=${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        
        if (!deleteRes.ok) {
          const deleteData = await deleteRes.json()
          showToast(deleteData.error || 'Oyuncu pozisyonu güncellenirken hata oluştu', 'error')
          loadFormationFromRoster()
          return
        }
      }
      
      // Add player with new position
      const res = await fetch(`/api/matches/${params.id}/roster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          userId,
          position: positionKey,
        }),
      })
      
      if (res.ok) {
        fetchMatch()
      } else {
        const data = await res.json()
        showToast(data.error || 'Oyuncu eklenirken hata oluştu', 'error')
        // Revert formation state
        loadFormationFromRoster()
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
      loadFormationFromRoster()
    }
  }

  const handleRemoveFromFormation = async (userId: string) => {
    if (!match || !user) return
    const isOwnerCheck = user.id === match.organization.ownerId
    if (!isOwnerCheck || match.status !== 'DRAFT') return

    // Remove from formation state
    setFormation((prev) => ({
      teamA: prev.teamA.filter(p => p.userId !== userId),
      teamB: prev.teamB.filter(p => p.userId !== userId),
    }))

    // Remove from roster
    try {
      const res = await fetch(`/api/matches/${params.id}/roster?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      
      if (res.ok) {
        fetchMatch()
      }
    } catch (error) {
      console.error('Error removing player:', error)
    }
  }

  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleClearRoster = async () => {
    if (!match || !isOwner || match.status === 'FINISHED' || match.status === 'PUBLISHED') return
    
    setClearingRoster(true)
    try {
      // Remove all players from roster
      const deletePromises = (match.roster || []).map((player) =>
        fetch(`/api/matches/${params.id}/roster?userId=${player.userId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      )

      await Promise.all(deletePromises)
      
      // Clear formation
      setFormation({
        teamA: [],
        teamB: [],
      })
      
      // Refresh match data
      await fetchMatch()
      showToast('Tüm kadro temizlendi', 'success')
      setShowClearRosterModal(false)
    } catch (error) {
      console.error('Error clearing roster:', error)
      showToast('Kadro temizlenirken bir hata oluştu', 'error')
    } finally {
      setClearingRoster(false)
    }
  }

  const handleUpdateMatchStatus = async (newStatus: 'DRAFT' | 'UPCOMING' | 'FINISHED' | 'PUBLISHED', skipModal = false) => {
    if (!match || !isOwner) return

    // FINISHED veya PUBLISHED statüsüne geçerken skor kontrolü
    if ((newStatus === 'FINISHED' || newStatus === 'PUBLISHED') && !skipModal) {
      if (!match.scores || !match.goals || match.goals.length === 0) {
        // Skor yoksa modal göster
        setPendingStatus(newStatus)
        setShowNoGoalsModal(true)
        return
      }
    }

    // UPCOMING statüsüne geçerken validasyonlar
    if (newStatus === 'UPCOMING') {
      if (!match.roster || match.roster.length < 10) {
        showToast('Maçı hazır hale getirmek için kadroda en az 10 oyuncu olmalıdır', 'error')
        return
      }

      if (!match.venue) {
        showToast('Maçı hazır hale getirmek için tesis bilgisi girilmelidir', 'error')
        return
      }
    }

    setUpdatingStatus(true)
    try {
      // Eğer skor yoksa ve 0-0 olarak kaydedilecekse, önce skoru oluştur
      if ((newStatus === 'FINISHED' || newStatus === 'PUBLISHED') && (!match.scores || !match.goals || match.goals.length === 0)) {
        const scoreRes = await fetch(`/api/matches/${match.id}/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            teamAScore: 0,
            teamBScore: 0,
            teamAGoals: [],
            teamBGoals: [],
          }),
        })
        
        if (!scoreRes.ok) {
          showToast('Skor oluşturulurken bir hata oluştu', 'error')
          setUpdatingStatus(false)
          return
        }
      }

      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const data = await res.json()
        setMatch(data.match)
        showToast('Maç statüsü başarıyla güncellendi', 'success')
      } else {
        const errorData = await res.json()
        showToast(errorData.error || 'Statü güncellenirken bir hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setUpdatingStatus(false)
      setShowNoGoalsModal(false)
      setPendingStatus(null)
    }
  }

  const handleConfirmNoGoals = () => {
    if (pendingStatus) {
      handleUpdateMatchStatus(pendingStatus, true)
    }
  }

  const handleUpdateVenue = async () => {
    if (!match) return
    setSavingVenue(true)
    try {
      const res = await fetch(`/api/matches/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ venue: venueValue || null }),
      })
      if (res.ok) {
        const data = await res.json()
        setMatch(data.match)
        setShowVenueEdit(false)
        showToast('Saha adı güncellendi', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setSavingVenue(false)
    }
  }

  const handleUpdateDate = async () => {
    if (!match || !selectedDate) return
    setSavingDate(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const res = await fetch(`/api/matches/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date: dateStr }),
      })
      if (res.ok) {
        const data = await res.json()
        setMatch(data.match)
        setShowDateEdit(false)
        setDatePickerOpen(false)
        showToast('Tarih güncellendi', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setSavingDate(false)
    }
  }

  const handleUpdateTime = async () => {
    if (!match || !timeValue) return
    setSavingTime(true)
    try {
      const res = await fetch(`/api/matches/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ time: timeValue }),
      })
      if (res.ok) {
        const data = await res.json()
        setMatch(data.match)
        setShowTimeEdit(false)
        setTimePickerOpen(false)
        showToast('Saat güncellendi', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setSavingTime(false)
    }
  }

  // Generate time options (every 15 minutes from 00:00 to 23:45)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeOptions.push(timeStr)
    }
  }


  const addGoal = () => {
    if (!selectedPlayerId || goalCount < 1) return
    
    const isInTeamA = formation.teamA.some(p => p.userId === selectedPlayerId)
    const isInTeamB = formation.teamB.some(p => p.userId === selectedPlayerId)
    
    if (!isInTeamA && !isInTeamB) {
      showToast('Oyuncu dizilişte değil', 'error')
      return
    }
    
    const team: 'A' | 'B' = isInTeamA ? 'A' : 'B'
    
    // Aynı oyuncunun mevcut gollerini bul
    const existingGoalIndex = goals.findIndex(g => g.userId === selectedPlayerId && g.team === team)
    
    if (existingGoalIndex >= 0) {
      // Mevcut golü güncelle
      const updatedGoals = [...goals]
      updatedGoals[existingGoalIndex] = { userId: selectedPlayerId, goals: goalCount, team }
      setGoals(updatedGoals)
      
      // Skoru hesapla
      const teamAScore = updatedGoals.filter(g => g.team === 'A').reduce((sum, g) => sum + g.goals, 0)
      const teamBScore = updatedGoals.filter(g => g.team === 'B').reduce((sum, g) => sum + g.goals, 0)
      setScoreData({ teamAScore, teamBScore })
    } else {
      // Yeni gol ekle
      const updatedGoals = [...goals, { userId: selectedPlayerId, goals: goalCount, team }]
      setGoals(updatedGoals)
      
      // Skoru hesapla
      const teamAScore = updatedGoals.filter(g => g.team === 'A').reduce((sum, g) => sum + g.goals, 0)
      const teamBScore = updatedGoals.filter(g => g.team === 'B').reduce((sum, g) => sum + g.goals, 0)
      setScoreData({ teamAScore, teamBScore })
    }
    
    setSelectedPlayerId('')
    setGoalCount(1)
  }

  const removeGoal = (userId: string, team: 'A' | 'B') => {
    const updatedGoals = goals.filter(g => !(g.userId === userId && g.team === team))
    setGoals(updatedGoals)
    
    // Skoru yeniden hesapla
    const teamAScore = updatedGoals.filter(g => g.team === 'A').reduce((sum, g) => sum + g.goals, 0)
    const teamBScore = updatedGoals.filter(g => g.team === 'B').reduce((sum, g) => sum + g.goals, 0)
    setScoreData({ teamAScore, teamBScore })
  }

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Golleri API formatına çevir (her gol için minute ekle - şimdilik 0)
      // Eğer gol yoksa boş array gönder (0-0 skor)
      const teamAGoals = goals.length > 0
        ? goals
            .filter(g => g.team === 'A')
            .flatMap(g => Array(g.goals).fill(null).map(() => ({ userId: g.userId, minute: 0 })))
        : []
      const teamBGoals = goals.length > 0
        ? goals
            .filter(g => g.team === 'B')
            .flatMap(g => Array(g.goals).fill(null).map(() => ({ userId: g.userId, minute: 0 })))
        : []
      
      const res = await fetch(`/api/matches/${params.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          teamAScore: scoreData.teamAScore,
          teamBScore: scoreData.teamBScore,
          teamAGoals,
          teamBGoals,
        }),
      })
      if (res.ok) {
        fetchMatch()
        setShowScoreForm(false)
        setGoals([])
        setScoreData({ teamAScore: 0, teamBScore: 0 })
        showToast('Skor kaydedildi', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    }
  }

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingRating) return
    
    try {
      setSubmittingRating(true)
      const ratingsToSubmit = Object.entries(ratings).filter(([_, rating]) => rating > 0)
      
      if (ratingsToSubmit.length === 0) {
        showToast('En az bir oyuncuya puan vermelisiniz', 'error')
        setSubmittingRating(false)
        return
      }

      // Batch rating gönder
      const res = await fetch(`/api/matches/${params.id}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratings: ratingsToSubmit.map(([userId, rating]) => ({
            ratedUserId: userId,
            rating: rating,
          })),
        }),
      })

      if (res.ok) {
        fetchMatch()
        setShowRatingForm(false)
        setRatings({})
        showToast('Puanlamalar kaydedildi', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Puanlamalar kaydedilemedi', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setSubmittingRating(false)
    }
  }

  const handleRatingChange = (userId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [userId]: rating,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  if (!match) {
    return null
  }

  const isOwner = user?.id === match.organization.ownerId
  const isInRoster = match.roster?.some((r) => r.userId === user?.id) || false
  const canRate = match.status === 'FINISHED'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-6 md:py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 truncate">
                {match.organization.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-90 break-words">
                {new Date(match.date).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} - {match.time}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-md whitespace-nowrap ${
                  match.status === 'FINISHED' 
                    ? 'bg-green-500 text-white' 
                    : match.status === 'UPCOMING' 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {match.status === 'FINISHED' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                      Oynandı
                    </>
                  ) : match.status === 'UPCOMING' ? (
                    <>
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                      Kadrolar Hazır
                    </>
                  ) : match.status === 'DRAFT' ? (
                    <>
                      <FileText className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                      Kadro kuruluyor
                    </>
                  ) : match.status === 'PUBLISHED' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                      Tamamlandı
                    </>
                  ) : match.status}
                </span>
                {isOwner && (
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    {match.status !== 'DRAFT' && (
                      <Button
                        onClick={() => handleUpdateMatchStatus('DRAFT')}
                        disabled={updatingStatus}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-auto"
                        size="sm"
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-2.5 h-2.5 md:w-3 md:h-3 animate-spin" />
                        ) : (
                          'Kadro kuruluyor'
                        )}
                      </Button>
                    )}
                    {match.status !== 'UPCOMING' && (
                      <Button
                        onClick={() => handleUpdateMatchStatus('UPCOMING')}
                        disabled={updatingStatus}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-auto"
                        size="sm"
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-2.5 h-2.5 md:w-3 md:h-3 animate-spin" />
                        ) : (
                          'Kadrolar Hazır'
                        )}
                      </Button>
                    )}
                    {match.status !== 'FINISHED' && (
                      <Button
                        onClick={() => handleUpdateMatchStatus('FINISHED')}
                        disabled={updatingStatus}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-auto"
                        size="sm"
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-2.5 h-2.5 md:w-3 md:h-3 animate-spin" />
                        ) : (
                          'Oynandı'
                        )}
                      </Button>
                    )}
                    {match.status !== 'PUBLISHED' && (
                      <Button
                        onClick={() => handleUpdateMatchStatus('PUBLISHED')}
                        disabled={updatingStatus}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 h-auto"
                        size="sm"
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-2.5 h-2.5 md:w-3 md:h-3 animate-spin" />
                        ) : (
                          'Tamamlandı'
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {match.scores && (
                <div className="bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-xl border-2 border-white/30">
                  <p className="text-2xl md:text-3xl font-black text-center whitespace-nowrap">
                    {match.scores.teamAScore} - {match.scores.teamBScore}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Katılım Butonları - Sadece organizasyon üyesi oyuncular için */}
      {match && user && !isOwner && isOrganizationMember && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' && (
        <div className="container mx-auto px-4 pt-4">
          <Card className="border-4 border-yellow-400 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 shadow-2xl animate-pulse">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    {attendanceStatus === 'PENDING' ? (
                      <>
                        <Target className="w-6 h-6" />
                        Maça Katılacak mısınız?
                      </>
                    ) : attendanceStatus === 'ACCEPTED' ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        Maça katılacağınızı belirttiniz
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-600" />
                        Maça katılmayacağınızı belirttiniz
                      </>
                    )}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {attendanceStatus === 'PENDING' 
                      ? 'Lütfen maça katılıp katılmayacağınızı belirtin. Katılacağınızı belirtirseniz yönetici sizi kadroya ekleyebilir.'
                      : attendanceStatus === 'ACCEPTED'
                      ? 'Yönetici sizi kadroya ekleyebilir. Durumu değiştirmek isterseniz aşağıdaki butonları kullanabilirsiniz.'
                      : 'Maça katılmayacağınızı belirttiniz. Fikriniz değişirse aşağıdaki butonları kullanabilirsiniz.'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAttendanceUpdate('ACCEPTED')}
                    disabled={loadingAttendance || attendanceStatus === 'ACCEPTED'}
                    className={`px-6 py-3 text-lg font-bold shadow-lg ${
                      attendanceStatus === 'ACCEPTED'
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    }`}
                    size="lg"
                  >
                    {loadingAttendance ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Yükleniyor...
                      </div>
                    ) : attendanceStatus === 'ACCEPTED' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Katılacağım
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Katılacağım
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleAttendanceUpdate('DECLINED')}
                    disabled={loadingAttendance || attendanceStatus === 'DECLINED'}
                    variant="destructive"
                    className={`px-6 py-3 text-lg font-bold shadow-lg ${
                      attendanceStatus === 'DECLINED' ? 'opacity-75 cursor-default' : ''
                    }`}
                    size="lg"
                  >
                    {loadingAttendance ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Yükleniyor...
                      </div>
                    ) : attendanceStatus === 'DECLINED' ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Katılmayacağım
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Katılmayacağım
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Üst Kısım: Saha Krokisi + Oyuncu Listesi ve Maç Bilgileri */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sol Kolon: Saha Krokisi ve Oyuncu Listesi */}
          {/* Yönetici için: Düzenlenebilir, Oyuncular için: Sadece görüntüleme */}
          {(isOwner || match.status === 'FINISHED' || match.status === 'PUBLISHED' || isOrganizationMember) && (
            <Card className="shadow-xl border-2 border-emerald-300 bg-gradient-to-br from-white to-emerald-50 h-full">
              <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-100 border-b-2 border-emerald-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">Diziliş Ön İzlemesi</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      {match.status === 'FINISHED' || match.status === 'PUBLISHED' 
                        ? 'Maç dizilişi'
                        : isOwner
                        ? 'Oyuncuları pozisyonlarına göre yerleştirin'
                        : 'Maç dizilişi önizlemesi'}
                    </CardDescription>
                  </div>
                  {isOwner && match.status === 'DRAFT' && (match.roster || []).length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowClearRosterModal(true)}
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap flex-shrink-0"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Tüm Kadroyu Temizle</span>
                      <span className="sm:hidden">Temizle</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Halısaha Krokisi - Responsive */}
                  <div className="w-full lg:w-[60%]">
                    <div 
                      className="relative bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl border-4 border-green-600 shadow-2xl overflow-hidden" 
                      style={{ aspectRatio: '16/9', minHeight: '500px', padding: '0.75rem', width: '100%' }}
                      onDragOver={isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' ? handleDragOver : undefined}
                      onDrop={isOwner && match.status === 'DRAFT' ? handleDrop : undefined}
                    >
                    {/* Saha Çizgileri */}
                    <div className="absolute inset-0 border-4 border-green-700 rounded-xl"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-700 opacity-80"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 border-green-700 rounded-full"></div>
                    
                    {/* Oyuncular - Team A (Alt Yarı) */}
                    {formation.teamA.map((player) => {
                      const member = organizationMembers.find(m => m.userId === player.userId)
                      if (!member) return null
                      return (
                        <div
                          key={player.userId}
                          draggable={isOwner && match.status === 'DRAFT'}
                          onDragStart={(e) => handleDragStart(e, player.userId)}
                          className={`absolute flex flex-col items-center z-10 ${
                            isOwner && match.status === 'DRAFT' 
                              ? 'cursor-grab active:cursor-grabbing' 
                              : 'cursor-default'
                          }`}
                          style={{
                            left: `${player.x}%`,
                            bottom: `${100 - player.y}%`,
                            transform: 'translate(-50%, 50%)',
                          }}
                        >
                          {member.user.avatarUrl ? (
                            <img
                              src={member.user.avatarUrl}
                              alt={member.user.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-700 object-cover shadow-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700 shadow-lg">
                              <span className="text-white font-bold text-sm sm:text-base">
                                {member.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="mt-0.5 bg-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold text-blue-700 shadow-md max-w-[80px] truncate">
                            {member.user.name}
                          </div>
                          {(() => {
                            // DRAFT: Genel ortalama puanlar
                            if (match.status === 'DRAFT' && member.user.averageRating !== null && member.user.averageRating !== undefined) {
                              const rating = member.user.averageRating
                              return (
                                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= Math.floor(rating)
                                    const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && !isFilled
                                    return isHalfFilled ? (
                                      <StarHalf
                                        key={star}
                                        className="w-2 h-2 text-yellow-500 fill-yellow-500"
                                      />
                                    ) : (
                                      <Star
                                        key={star}
                                        className={`w-2 h-2 ${
                                          isFilled
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    )
                                  })}
                                </div>
                              )
                            }
                            // UPCOMING: Yıldızlar görünmesin
                            if (match.status === 'UPCOMING') {
                              return null
                            }
                            // FINISHED/PUBLISHED: Maç özelindeki puanlar
                            if ((match.status === 'FINISHED' || match.status === 'PUBLISHED') && match.playerAverages) {
                              const playerAverage = match.playerAverages.find(pa => pa.userId === player.userId)
                              if (!playerAverage) return null
                              const rating = playerAverage.averageRating
                              return (
                                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= Math.floor(rating)
                                    const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && !isFilled
                                    return isHalfFilled ? (
                                      <StarHalf
                                        key={star}
                                        className="w-2 h-2 text-yellow-500 fill-yellow-500"
                                      />
                                    ) : (
                                      <Star
                                        key={star}
                                        className={`w-2 h-2 ${
                                          isFilled
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    )
                                  })}
                                </div>
                              )
                            }
                            return null
                          })()}
                        </div>
                      )
                    })}
                    
                    {/* Oyuncular - Team B (Üst Yarı) */}
                    {formation.teamB.map((player) => {
                      const member = organizationMembers.find(m => m.userId === player.userId)
                      if (!member) return null
                      return (
                        <div
                          key={player.userId}
                          draggable={isOwner && match.status === 'DRAFT'}
                          onDragStart={(e) => handleDragStart(e, player.userId)}
                          className={`absolute flex flex-col items-center z-10 ${
                            isOwner && match.status === 'DRAFT' 
                              ? 'cursor-grab active:cursor-grabbing' 
                              : 'cursor-default'
                          }`}
                          style={{
                            left: `${player.x}%`,
                            top: `${player.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {member.user.avatarUrl ? (
                            <img
                              src={member.user.avatarUrl}
                              alt={member.user.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-red-700 object-cover shadow-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 border-red-700 shadow-lg">
                              <span className="text-white font-bold text-sm sm:text-base">
                                {member.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="mt-0.5 bg-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold text-red-700 shadow-md max-w-[80px] truncate">
                            {member.user.name}
                          </div>
                          {(() => {
                            // DRAFT: Genel ortalama puanlar
                            if (match.status === 'DRAFT' && member.user.averageRating !== null && member.user.averageRating !== undefined) {
                              const rating = member.user.averageRating
                              return (
                                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= Math.floor(rating)
                                    const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && !isFilled
                                    return isHalfFilled ? (
                                      <StarHalf
                                        key={star}
                                        className="w-2 h-2 text-yellow-500 fill-yellow-500"
                                      />
                                    ) : (
                                      <Star
                                        key={star}
                                        className={`w-2 h-2 ${
                                          isFilled
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    )
                                  })}
                                </div>
                              )
                            }
                            // UPCOMING: Yıldızlar görünmesin
                            if (match.status === 'UPCOMING') {
                              return null
                            }
                            // FINISHED/PUBLISHED: Maç özelindeki puanlar
                            if ((match.status === 'FINISHED' || match.status === 'PUBLISHED') && match.playerAverages) {
                              const playerAverage = match.playerAverages.find(pa => pa.userId === player.userId)
                              if (!playerAverage) return null
                              const rating = playerAverage.averageRating
                              return (
                                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= Math.floor(rating)
                                    const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && !isFilled
                                    return isHalfFilled ? (
                                      <StarHalf
                                        key={star}
                                        className="w-2 h-2 text-yellow-500 fill-yellow-500"
                                      />
                                    ) : (
                                      <Star
                                        key={star}
                                        className={`w-2 h-2 ${
                                          isFilled
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    )
                                  })}
                                </div>
                              )
                            }
                            return null
                          })()}
                        </div>
                      )
                    })}
                    
                    {/* Takım Etiketleri */}
                    <div className="absolute bottom-0.5 left-2 sm:left-3 text-[9px] sm:text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded shadow-md z-20">Takım A</div>
                    <div className="absolute top-0.5 right-2 sm:right-3 text-[9px] sm:text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded shadow-md z-20">Takım B</div>
                    </div>
                  </div>

                  {/* Oyuncu Listesi - Kompakt */}
                  <div className="w-full lg:w-[40%]">
                    <Card className="shadow-xl border-2 border-purple-300 bg-gradient-to-br from-white to-purple-50 max-h-[500px] lg:h-full flex flex-col">
                      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300 p-1.5 flex-shrink-0">
                        <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
                          <Users className="w-4 h-4" />
                          Oyuncular
                        </CardTitle>
                        <CardDescription className="text-[9px] mt-0.5">
                          {isOwner && match.status === 'DRAFT'
                            ? 'Sürükleyip bırakın' 
                            : 'Organizasyon Oyuncuları'}
                          {isOwner && match.status === 'DRAFT' && (
                            <span className="block mt-0.5 text-[8px] text-gray-500 italic">
                              * Puanlar tüm zamanların ortalamasıdır
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-1.5 flex-1 overflow-hidden flex flex-col">
                        <div className="space-y-0.5 flex-1 overflow-y-auto">
                          {loadingMembers ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                              <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">Oyuncular yükleniyor...</p>
                            </div>
                          ) : organizationMembers.length === 0 ? (
                            <div className="text-center py-4">
                              <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-gray-600 text-xs">Henüz oyuncu yok</p>
                            </div>
                          ) : (
                            organizationMembers.map((member) => {
                              const isInTeamA = formation.teamA.some(p => p.userId === member.userId)
                              const isInTeamB = formation.teamB.some(p => p.userId === member.userId)
                              const isInFormation = isInTeamA || isInTeamB
                              const isAccepted = member.attendanceStatus === 'ACCEPTED' || member.userId === match.organization.ownerId
                              const canDrag = !isInFormation && isAccepted && isOwner && match.status === 'DRAFT'
                              const isDisabled = !isAccepted && match.status === 'DRAFT'
                              return (
                                <div
                                  key={member.userId}
                                  draggable={canDrag}
                                  onDragStart={(e) => {
                                    if (!isInFormation && isAccepted) {
                                      handleDragStart(e, member.userId)
                                    } else {
                                      e.preventDefault()
                                    }
                                  }}
                                  className={`p-1 border rounded-md flex items-center gap-1.5 transition-all ${
                                    isInTeamA
                                      ? 'bg-blue-100 border-blue-300 opacity-90' 
                                      : isInTeamB
                                      ? 'bg-red-100 border-red-300 opacity-90'
                                      : isDisabled
                                      ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                                      : 'bg-white border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 hover:shadow-sm'
                                  } ${match.status === 'DRAFT' ? (isInFormation ? 'cursor-default' : canDrag ? 'cursor-grab active:cursor-grabbing' : isDisabled ? 'cursor-not-allowed' : 'cursor-default') : 'cursor-default'}`}
                                >
                                  {member.user.avatarUrl ? (
                                    <img
                                      src={member.user.avatarUrl}
                                      alt={member.user.name}
                                      className="w-6 h-6 rounded-full object-cover shadow-sm flex-shrink-0 border border-gray-200"
                                    />
                                  ) : (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm flex-shrink-0 ${
                                      isInTeamA
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                        : isInTeamB
                                        ? 'bg-gradient-to-br from-red-500 to-red-600'
                                        : isDisabled
                                        ? 'bg-gray-400'
                                        : 'bg-gradient-to-br from-purple-500 to-pink-600'
                                    }`}>
                                      {member.user.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <Link 
                                      href={`/players/${member.userId}`}
                                      onClick={(e) => {
                                        // If draggable, prevent default and check if it's a click or drag
                                        if (!isInFormation && canDrag) {
                                          // Check if mouse moved (drag) or stayed (click)
                                          const startX = e.clientX
                                          const startY = e.clientY
                                          
                                          const handleMouseUp = (upEvent: MouseEvent) => {
                                            const moved = Math.abs(upEvent.clientX - startX) > 5 || Math.abs(upEvent.clientY - startY) > 5
                                            if (!moved && !draggedPlayer) {
                                              router.push(`/players/${member.userId}`)
                                            }
                                            document.removeEventListener('mouseup', handleMouseUp)
                                          }
                                          
                                          document.addEventListener('mouseup', handleMouseUp)
                                          e.preventDefault()
                                        }
                                      }}
                                      className="block"
                                    >
                                      <p className={`font-semibold text-xs truncate ${
                                        isInTeamA
                                          ? 'text-blue-700' 
                                          : isInTeamB
                                          ? 'text-red-700'
                                          : isDisabled
                                          ? 'text-gray-400'
                                          : 'text-gray-900'
                                      } ${isDisabled ? '' : 'hover:text-purple-600 transition-colors cursor-pointer'}`}>
                                        {member.user.name}
                                      </p>
                                      {isOwner && match.status === 'DRAFT' && member.user.averageRating !== null && member.user.averageRating !== undefined && (
                                        <div className="flex items-center gap-0.5 mt-0.5">
                                          {[1, 2, 3, 4, 5].map((star) => {
                                            const rating = member.user.averageRating!
                                            const isFilled = star <= Math.floor(rating)
                                            const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && !isFilled
                                            return isHalfFilled ? (
                                              <StarHalf
                                                key={star}
                                                className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500"
                                              />
                                            ) : (
                                              <Star
                                                key={star}
                                                className={`w-2.5 h-2.5 ${
                                                  isFilled
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-gray-300'
                                                }`}
                                              />
                                            )
                                          })}
                                        </div>
                                      )}
                                      {isInFormation && (
                                        <p className={`text-[9px] font-medium ${
                                          isInTeamA ? 'text-blue-600' : 'text-red-600'
                                        }`}>
                                          {isInTeamA ? 'Takım A' : 'Takım B'}
                                        </p>
                                      )}
                                      {isDisabled && !isInFormation && (
                                        <p className="text-[9px] text-gray-400 font-medium">
                                          Henüz kabul etmedi
                                        </p>
                                      )}
                                    </Link>
                                  </div>
                                  {isInFormation && isOwner && match.status === 'DRAFT' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemoveFromFormation(member.userId)
                                      }}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-0.5 flex-shrink-0 transition-colors"
                                      title="Kadrodan çıkar"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                      </svg>
                                    </button>
                                  )}
                                  {isInFormation && (match.status !== 'DRAFT' || !isOwner) && (
                                    <div className="text-gray-400 flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sağ Kolon: Maç Bilgileri */}
          <Card className="shadow-xl border-2 border-green-200 bg-white h-full flex flex-col">
          <CardContent className="p-6 flex flex-col flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Maç bilgileri yükleniyor...</p>
              </div>
            ) : (
            <div className="space-y-4 flex flex-col flex-1">
              {/* Üst Satır: Tarih ve Saat - 50-50 */}
              <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                {/* Tarih */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Tarih
                    </Label>
                    {isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (showDateEdit) {
                            setShowDateEdit(false)
                            setSelectedDate(match.date ? new Date(match.date) : undefined)
                          } else {
                            setShowDateEdit(true)
                          }
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {showDateEdit ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  {showDateEdit ? (
                    <div className="space-y-3">
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 text-base border-2 hover:border-blue-500 focus:border-blue-500 transition-all"
                          >
                            <CalendarDays className="mr-3 h-5 w-5" />
                            {selectedDate ? (
                              format(selectedDate, 'dd MMMM yyyy', { locale: tr })
                            ) : (
                              <span className="text-gray-500">Tarih seçiniz</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 shadow-2xl border border-gray-200 rounded-xl bg-white z-50" align="start" sideOffset={4}>
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date)
                              setDatePickerOpen(false)
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            locale={tr}
                            className="rounded-lg"
                            formatters={{
                              formatCaption: (date) => format(date, 'MMMM yyyy', { locale: tr }),
                              formatWeekdayName: (date) => format(date, 'EEEEEE', { locale: tr }),
                            }}
                            classNames={{
                              months: "flex flex-col space-y-4",
                              month: "space-y-4",
                              caption: "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-semibold text-gray-900 capitalize",
                              nav: "space-x-1 flex items-center",
                              button_previous: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md",
                              button_next: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md",
                              month_grid: "mt-4",
                              weekdays: "flex",
                              weekday: "text-gray-500 text-xs font-medium w-10 h-10 flex items-center justify-center capitalize",
                              week: "flex w-full mt-2",
                              day: "h-10 w-10 p-0 text-sm font-normal hover:bg-blue-50 rounded-md transition-colors",
                              day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white rounded-md",
                              day_today: "bg-blue-50 text-blue-700 font-semibold rounded-md",
                              day_disabled: "text-gray-300 cursor-not-allowed opacity-50",
                              day_outside: "text-gray-400 opacity-50",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex gap-2">
                        <Button
                          size="lg"
                          onClick={handleUpdateDate}
                          disabled={savingDate || !selectedDate}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingDate ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Kaydediliyor...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Kaydet
                            </>
                          )}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            setShowDateEdit(false)
                            setSelectedDate(match.date ? new Date(match.date) : undefined)
                          }}
                          className="font-semibold"
                          disabled={savingDate}
                        >
                          İptal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(match.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                
                {/* Saat */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Saat
                    </Label>
                    {isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (showTimeEdit) {
                            setShowTimeEdit(false)
                            setTimeValue(match.time || '')
                          } else {
                            setShowTimeEdit(true)
                          }
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {showTimeEdit ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  {showTimeEdit ? (
                    <div className="space-y-3">
                      <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-12 text-base border-2 hover:border-purple-500 focus:border-purple-500 transition-all"
                          >
                            <Clock className="mr-3 h-5 w-5" />
                            {timeValue || <span className="text-gray-500">Saat seçiniz</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 shadow-2xl border border-gray-200 rounded-xl bg-white z-50" align="start" sideOffset={4}>
                          <div className="p-2">
                            <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                              {timeOptions.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => {
                                    setTimeValue(time)
                                    setTimePickerOpen(false)
                                  }}
                                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    timeValue === time
                                      ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 hover:shadow-sm'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <div className="flex gap-2">
                        <Button
                          size="lg"
                          onClick={handleUpdateTime}
                          disabled={savingTime || !timeValue}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingTime ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Kaydediliyor...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Kaydet
                            </>
                          )}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            setShowTimeEdit(false)
                            setTimeValue(match.time || '')
                          }}
                          className="font-semibold"
                          disabled={savingTime}
                        >
                          İptal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-gray-900">{match.time}</p>
                  )}
                </div>
              </div>
              
              {/* Alt Satır: Tesis Bilgileri - Tam Genişlik */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Tesis
                  </Label>
                  {isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (showVenueEdit) {
                          setShowVenueEdit(false)
                          setVenueValue(match.venue || '')
                        } else {
                          setShowVenueEdit(true)
                        }
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {showVenueEdit ? <X className="w-4 h-4" /> : match.venue ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                {showVenueEdit ? (
                  <div className="space-y-3">
                    {facilities.length > 0 ? (
                      <div className="relative">
                        <div 
                          ref={venueFacilityCarouselRef}
                          className="relative overflow-hidden rounded-xl"
                          onTouchStart={(e) => {
                            venueTouchStartX.current = e.touches[0].clientX
                          }}
                          onTouchMove={(e) => {
                            venueTouchEndX.current = e.touches[0].clientX
                          }}
                          onTouchEnd={() => {
                            if (!venueTouchStartX.current || !venueTouchEndX.current) return
                            const distance = venueTouchStartX.current - venueTouchEndX.current
                            const minSwipeDistance = 50
                            
                            if (distance > minSwipeDistance && currentVenueFacilityIndex < facilities.length - 1) {
                              setCurrentVenueFacilityIndex(currentVenueFacilityIndex + 1)
                            } else if (distance < -minSwipeDistance && currentVenueFacilityIndex > 0) {
                              setCurrentVenueFacilityIndex(currentVenueFacilityIndex - 1)
                            }
                            
                            venueTouchStartX.current = null
                            venueTouchEndX.current = null
                          }}
                        >
                          <div 
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentVenueFacilityIndex * 100}%)` }}
                          >
                            {facilities.map((facility, index) => (
                              <div
                                key={facility.id}
                                className="min-w-full px-2"
                              >
                                <div
                                  onClick={() => {
                                    const newVenue = venueValue === facility.name ? '' : facility.name
                                    setVenueValue(newVenue)
                                  }}
                                  className={`
                                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                    ${venueValue === facility.name
                                      ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200'
                                      : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                                    }
                                  `}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`
                                      w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                                      ${venueValue === facility.name
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                      }
                                    `}>
                                      <Home className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 mb-2 truncate">
                                        {facility.name}
                                      </h4>
                                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                                        {facility.isIndoor !== null && (
                                          <span className={`
                                            px-2 py-1 rounded-full
                                            ${facility.isIndoor ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}
                                          `}>
                                            {facility.isIndoor ? 'Kapalı' : 'Açık'}
                                          </span>
                                        )}
                                        {facility.matchPrice && (
                                          <span className="font-medium text-gray-700">
                                            {facility.matchPrice.toFixed(2)} TL
                                          </span>
                                        )}
                                        {facility.fieldType && (
                                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                                            {facility.fieldType === 'REAL_GRASS' ? 'Gerçek Çim' : 'Sentetik Çim'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {venueValue === facility.name && (
                                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Navigation Arrows */}
                        {facilities.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setCurrentVenueFacilityIndex(Math.max(0, currentVenueFacilityIndex - 1))}
                              disabled={currentVenueFacilityIndex === 0}
                              className={`
                                absolute -left-4 top-1/2 -translate-y-1/2 z-10
                                w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                                flex items-center justify-center
                                transition-all duration-200
                                ${currentVenueFacilityIndex === 0
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-gray-50 hover:scale-110'
                                }
                              `}
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrentVenueFacilityIndex(Math.min(facilities.length - 1, currentVenueFacilityIndex + 1))}
                              disabled={currentVenueFacilityIndex === facilities.length - 1}
                              className={`
                                absolute -right-4 top-1/2 -translate-y-1/2 z-10
                                w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                                flex items-center justify-center
                                transition-all duration-200
                                ${currentVenueFacilityIndex === facilities.length - 1
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-gray-50 hover:scale-110'
                                }
                              `}
                            >
                              <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                          </>
                        )}
                        
                        {/* Dots Indicator */}
                        {facilities.length > 1 && (
                          <div className="flex justify-center gap-2 mt-4">
                            {facilities.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentVenueFacilityIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentVenueFacilityIndex
                                    ? 'bg-green-600 w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Henüz tesis eklenmemiş
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleUpdateVenue}
                        disabled={savingVenue || !venueValue}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {savingVenue ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Kaydediliyor...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Kaydet
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowVenueEdit(false)
                          setVenueValue(match.venue || '')
                        }}
                        disabled={savingVenue}
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {match.venue ? (
                      selectedFacility ? (
                        <div className="flex flex-col h-full">
                          <Link 
                            href={`/facilities/${selectedFacility.id}`}
                            className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 mb-3"
                          >
                            {match.venue}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                            {selectedFacility.matchPrice !== null && (
                              <div className="bg-white/60 p-2 rounded-lg border border-yellow-300">
                                <p className="text-[10px] text-gray-600 mb-0.5 flex items-center gap-1">
                                  <DollarSign className="w-2.5 h-2.5" />
                                  Ücret
                                </p>
                                <p className="text-xs font-bold text-gray-900">
                                  {selectedFacility.matchPrice.toFixed(2)} TL
                                </p>
                              </div>
                            )}
                            {selectedFacility.isIndoor !== null && (
                              <div className="bg-white/60 p-2 rounded-lg border border-yellow-300">
                                <p className="text-[10px] text-gray-600 mb-0.5 flex items-center gap-1">
                                  <Home className="w-2.5 h-2.5" />
                                  Saha Tipi
                                </p>
                                <p className="text-xs font-bold text-gray-900">
                                  {selectedFacility.isIndoor ? 'Kapalı' : 'Açık'}
                                </p>
                              </div>
                            )}
                            {selectedFacility.fieldType && (
                              <div className="bg-white/60 p-2 rounded-lg border border-yellow-300">
                                <p className="text-[10px] text-gray-600 mb-0.5 flex items-center gap-1">
                                  <TreePine className="w-2.5 h-2.5" />
                                  Çim Tipi
                                </p>
                                <p className="text-xs font-bold text-gray-900">
                                  {selectedFacility.fieldType === 'REAL_GRASS' ? 'Gerçek Çim' : 'Sentetik Çim'}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                            {selectedFacility?.location ? (
                              <iframe
                                src={getMapEmbedUrl(selectedFacility.location)}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                                onError={(e) => {
                                  console.error('Iframe load error:', e)
                                }}
                              ></iframe>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Harita yükleniyor...
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-gray-900">{match.venue}</p>
                      )
                    ) : (
                      <p className="text-sm font-bold text-gray-400 italic">Tesis belirtilmemiş</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Alt Kısım: Skor Girişi ve Kadro Listesi */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skor Girişi - Skorboard şeklinde her zaman görünür */}
          <Card className="shadow-xl border-2 border-blue-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Maç Skoru
                </div>
                {isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' && match.status !== 'DRAFT' && (match.roster || []).length >= 10 && match.venue && !showScoreForm && (
                  <Button 
                    onClick={() => {
                      if (match.scores && match.goals) {
                        // Mevcut golleri yükle
                        const existingGoals: Array<{ userId: string; goals: number; team: 'A' | 'B' }> = []
                        const goalCounts: Record<string, { team: 'A' | 'B'; count: number }> = {}
                        
                        match.goals.forEach((goal) => {
                          const key = `${goal.userId}-${goal.team}`
                          if (!goalCounts[key]) {
                            goalCounts[key] = { team: goal.team as 'A' | 'B', count: 0 }
                          }
                          goalCounts[key].count++
                        })
                        
                        Object.entries(goalCounts).forEach(([key, data]) => {
                          const [userId] = key.split('-')
                          existingGoals.push({ userId, goals: data.count, team: data.team })
                        })
                        
                        setGoals(existingGoals)
                        setScoreData({
                          teamAScore: match.scores.teamAScore,
                          teamBScore: match.scores.teamBScore,
                        })
                      } else {
                        setGoals([])
                        setScoreData({ teamAScore: 0, teamBScore: 0 })
                      }
                      setShowScoreForm(true)
                    }} 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-xs py-1.5 px-3 h-auto"
                    size="sm"
                  >
                    {match.scores ? 'Skoru Düzenle' : 'Skor Gir'}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border-2 border-blue-200 text-center">
                  <Label className="font-semibold text-sm">Takım A</Label>
                  <p className="text-4xl font-black text-blue-700">
                    {showScoreForm ? scoreData.teamAScore : (match.scores?.teamAScore ?? 0)}
                  </p>
                </div>
                <div className="space-y-1 bg-gradient-to-br from-red-50 to-pink-50 p-3 rounded-lg border-2 border-red-200 text-center">
                  <Label className="font-semibold text-sm">Takım B</Label>
                  <p className="text-4xl font-black text-red-700">
                    {showScoreForm ? scoreData.teamBScore : (match.scores?.teamBScore ?? 0)}
                  </p>
                </div>
              </div>
              
              {/* Goller Listesi - Skor girildikten sonra gösterilir */}
              {match.goals && match.goals.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-gray-200">
                  <Label className="font-semibold text-sm text-gray-700 mb-2 block">Goller</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-[255px] overflow-y-auto">
                    {/* Takım A Golleri */}
                    <div className="space-y-1.5">
                      {(() => {
                        const teamAGoals = match.goals.filter(g => g.team === 'A')
                        const goalCounts: Record<string, { count: number; user: typeof match.goals[0]['user'] }> = {}
                        teamAGoals.forEach(goal => {
                          if (!goalCounts[goal.userId]) {
                            goalCounts[goal.userId] = { count: 0, user: goal.user }
                          }
                          goalCounts[goal.userId].count++
                        })
                        return Object.entries(goalCounts).map(([userId, data]) => (
                          <div key={userId} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            {data.user.avatarUrl ? (
                              <img
                                src={data.user.avatarUrl}
                                alt={data.user.name}
                                className="w-6 h-6 rounded-full border border-blue-500"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-blue-500 bg-blue-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {data.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-xs md:text-sm font-semibold text-blue-700 flex-1 min-w-0 truncate">{data.user.name}</span>
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                              {data.count}
                            </span>
                          </div>
                        ))
                      })()}
                      {match.goals.filter(g => g.team === 'A').length === 0 && (
                        <div className="text-xs text-gray-400 italic text-center py-2">Gol yok</div>
                      )}
                    </div>
                    
                    {/* Takım B Golleri */}
                    <div className="space-y-1.5">
                      {(() => {
                        const teamBGoals = match.goals.filter(g => g.team === 'B')
                        const goalCounts: Record<string, { count: number; user: typeof match.goals[0]['user'] }> = {}
                        teamBGoals.forEach(goal => {
                          if (!goalCounts[goal.userId]) {
                            goalCounts[goal.userId] = { count: 0, user: goal.user }
                          }
                          goalCounts[goal.userId].count++
                        })
                        return Object.entries(goalCounts).map(([userId, data]) => (
                          <div key={userId} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                            {data.user.avatarUrl ? (
                              <img
                                src={data.user.avatarUrl}
                                alt={data.user.name}
                                className="w-6 h-6 rounded-full border border-red-500"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-red-500 bg-red-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {data.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-xs md:text-sm font-semibold text-red-700 flex-1 min-w-0 truncate">{data.user.name}</span>
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              {data.count}
                            </span>
                          </div>
                        ))
                      })()}
                      {match.goals.filter(g => g.team === 'B').length === 0 && (
                        <div className="text-xs text-gray-400 italic text-center py-2">Gol yok</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' && (
                <>
                  {match.status === 'DRAFT' || (match.roster || []).length < 10 || !match.venue ? (
                    <div className="mt-3 p-2.5 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                      <p className="text-xs text-yellow-800 text-center font-semibold">
                        {match.status === 'DRAFT' 
                          ? 'Maçı hazır hale getirmeden skor girilemez'
                          : (match.roster || []).length < 10
                          ? 'Kadrolar tamamlanmadan skor girilemez (En az 10 oyuncu gerekli)'
                          : 'Tesis bilgisi girilmeden skor girilemez'}
                      </p>
                    </div>
                  ) : showScoreForm && (
                    <form onSubmit={handleSubmitScore} className="space-y-3 mt-3">
                      {/* Gol Ekleme Formu */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border-2 border-gray-300 shadow-md">
                        <Label className="font-semibold text-sm mb-2 block text-gray-800">Gol Atan Oyuncu</Label>
                        
                        {/* Custom Select */}
                        <div className="relative mb-3">
                          <button
                            type="button"
                            onClick={() => setIsPlayerSelectOpen(!isPlayerSelectOpen)}
                            className="w-full flex items-center justify-between p-2.5 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              {selectedPlayerId ? (
                                (() => {
                                  const player = [...formation.teamA, ...formation.teamB].find(p => p.userId === selectedPlayerId)
                                  const member = player ? organizationMembers.find(m => m.userId === player.userId) : null
                                  const isInTeamA = player ? formation.teamA.some(p => p.userId === player.userId) : false
                                  return member ? (
                                    <>
                                      {member.user.avatarUrl ? (
                                        <img
                                          src={member.user.avatarUrl}
                                          alt={member.user.name}
                                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                                        />
                                      ) : (
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                          isInTeamA ? 'bg-blue-500 border-blue-600' : 'bg-red-500 border-red-600'
                                        }`}>
                                          <span className="text-white font-bold text-sm">
                                            {member.user.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                      )}
                                      <div className="text-left">
                                        <span className="font-semibold text-gray-800 block">{member.user.name}</span>
                                        <span className="text-xs text-gray-500">
                                          {isInTeamA ? 'Takım A' : 'Takım B'}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <span className="text-gray-500">Oyuncu seçin</span>
                                  )
                                })()
                              ) : (
                                <span className="text-gray-500">Oyuncu seçin</span>
                              )}
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isPlayerSelectOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {isPlayerSelectOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsPlayerSelectOpen(false)}
                              />
                              <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-56 overflow-y-auto">
                                <div className="p-1.5">
                                  <div className="mb-1 px-2 py-0.5 text-xs font-semibold text-gray-500 uppercase">Takım A</div>
                                  {formation.teamA.map((player) => {
                                    const member = organizationMembers.find(m => m.userId === player.userId)
                                    if (!member) return null
                                    return (
                                      <button
                                        key={player.userId}
                                        type="button"
                                        onClick={() => {
                                          setSelectedPlayerId(player.userId)
                                          setIsPlayerSelectOpen(false)
                                        }}
                                        className={`w-full flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                                          selectedPlayerId === player.userId ? 'bg-blue-100 border border-blue-400' : ''
                                        }`}
                                      >
                                        {member.user.avatarUrl ? (
                                          <img
                                            src={member.user.avatarUrl}
                                            alt={member.user.name}
                                            className="w-8 h-8 rounded-full border-2 border-blue-500"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">
                                              {member.user.name.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        <span className="font-semibold text-sm text-gray-800">{member.user.name}</span>
                                        {selectedPlayerId === player.userId && (
                                          <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                                        )}
                                      </button>
                                    )
                                  })}
                                  
                                  <div className="mb-1 mt-2 px-2 py-0.5 text-xs font-semibold text-gray-500 uppercase">Takım B</div>
                                  {formation.teamB.map((player) => {
                                    const member = organizationMembers.find(m => m.userId === player.userId)
                                    if (!member) return null
                                    return (
                                      <button
                                        key={player.userId}
                                        type="button"
                                        onClick={() => {
                                          setSelectedPlayerId(player.userId)
                                          setIsPlayerSelectOpen(false)
                                        }}
                                        className={`w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition-colors ${
                                          selectedPlayerId === player.userId ? 'bg-red-100 border border-red-400' : ''
                                        }`}
                                      >
                                        {member.user.avatarUrl ? (
                                          <img
                                            src={member.user.avatarUrl}
                                            alt={member.user.name}
                                            className="w-8 h-8 rounded-full border-2 border-red-500"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-red-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">
                                              {member.user.name.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        <span className="font-semibold text-sm text-gray-800">{member.user.name}</span>
                                        {selectedPlayerId === player.userId && (
                                          <CheckCircle className="w-4 h-4 text-red-600 ml-auto" />
                                        )}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label className="font-semibold mb-1.5 block text-sm text-gray-800">Gol Sayısı</Label>
                            <Input
                              type="number"
                              min="1"
                              value={goalCount}
                              onChange={(e) => setGoalCount(parseInt(e.target.value) || 1)}
                              className="text-center font-bold h-9 border-2 border-gray-300 focus:border-blue-500"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={addGoal}
                            disabled={!selectedPlayerId || goalCount < 1}
                            className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-9 px-4 font-semibold shadow-md"
                          >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Gol Ekle
                          </Button>
                        </div>
                      </div>

                      {/* Girilen Goller Listesi */}
                      {goals.length > 0 && (
                        <div className="space-y-1.5">
                          <Label className="font-semibold text-sm text-gray-800">Girilen Goller</Label>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {goals.map((goal, index) => {
                              const member = organizationMembers.find(m => m.userId === goal.userId)
                              return (
                                <div
                                  key={`${goal.userId}-${goal.team}-${index}`}
                                  className={`flex items-center justify-between p-2.5 rounded-lg border-2 shadow-sm ${
                                    goal.team === 'A' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {member?.user.avatarUrl ? (
                                      <img
                                        src={member.user.avatarUrl}
                                        alt={member.user.name}
                                        className={`w-8 h-8 rounded-full border-2 ${
                                          goal.team === 'A' ? 'border-blue-500' : 'border-red-500'
                                        }`}
                                      />
                                    ) : (
                                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                        goal.team === 'A' ? 'bg-blue-500 border-blue-600' : 'bg-red-500 border-red-600'
                                      }`}>
                                        <span className="text-white font-bold text-xs">
                                          {member?.user.name.charAt(0).toUpperCase() || '?'}
                                        </span>
                                      </div>
                                    )}
                                    <div>
                                      <span className={`font-semibold text-sm block ${goal.team === 'A' ? 'text-blue-700' : 'text-red-700'}`}>
                                        {member?.user.name || 'Bilinmeyen'}
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        {goal.team === 'A' ? 'Takım A' : 'Takım B'} • {goal.goals}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeGoal(goal.userId, goal.team)}
                                    className="text-red-600 hover:bg-red-50 border-red-300 hover:border-red-400 h-7 w-7 p-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-2">
                          Kaydet
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                          setShowScoreForm(false)
                          setGoals([])
                          setScoreData({ teamAScore: 0, teamBScore: 0 })
                        }} className="py-2">
                          İptal
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Kadro Listesi */}
          <Card className="shadow-xl border-2 border-purple-200 bg-white h-fit">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Kadro Listesi
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({(match.roster || []).length} oyuncu)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {(match.roster || []).length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 font-medium">Henüz kadro oluşturulmamış</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  {/* Takım A */}
                  <div className="space-y-2">
                    <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-cyan-50 p-2 rounded-lg border-2 border-blue-200 mb-2 z-10">
                      <h3 className="font-bold text-blue-700 text-center">Takım A</h3>
                    </div>
                    {(match.roster || [])
                      .filter((player) => {
                        const isInTeamA = formation.teamA.some(p => p.userId === player.userId)
                        return isInTeamA
                      })
                      .sort((a, b) => {
                        const aIndex = formation.teamA.findIndex(p => p.userId === a.userId)
                        const bIndex = formation.teamA.findIndex(p => p.userId === b.userId)
                        return aIndex - bIndex
                      })
                      .map((player) => {
                        const playerAverage = match.playerAverages?.find(pa => pa.userId === player.userId)
                        return (
                          <div key={player.id} className="p-3 border-2 rounded-lg flex justify-between items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all hover:shadow-md border-blue-200 bg-blue-50/30">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {player.user.avatarUrl ? (
                                <img
                                  src={player.user.avatarUrl}
                                  alt={player.user.name}
                                  className="w-8 h-8 rounded-full object-cover shadow-md border-2 border-blue-300 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                                  {player.user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{player.user.name}</p>
                                {playerAverage && (
                                  <div className="flex items-center gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                      const rating = playerAverage.averageRating
                                      const isFilled = star <= Math.floor(rating)
                                      const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && rating % 1 < 1
                                      
                                      if (isFilled) {
                                        return (
                                          <Star
                                            key={star}
                                            className="w-3 h-3 text-yellow-500 fill-yellow-500"
                                          />
                                        )
                                      } else if (isHalfFilled) {
                                        return (
                                          <div key={star} className="relative w-3 h-3">
                                            <Star className="w-3 h-3 text-gray-300 absolute" />
                                            <div className="absolute overflow-hidden" style={{ width: '50%' }}>
                                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            </div>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <Star
                                            key={star}
                                            className="w-3 h-3 text-gray-300"
                                          />
                                        )
                                      }
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                            {isOwner && match.status === 'DRAFT' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setPlayerToRemove({
                                    id: player.id,
                                    userId: player.userId,
                                    name: player.user.name,
                                  })
                                  setShowRemovePlayerModal(true)
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 p-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )
                      })}
                  </div>

                  {/* Takım B */}
                  <div className="space-y-2">
                    <div className="sticky top-0 bg-gradient-to-r from-red-50 to-pink-50 p-2 rounded-lg border-2 border-red-200 mb-2 z-10">
                      <h3 className="font-bold text-red-700 text-center">Takım B</h3>
                    </div>
                    {(match.roster || [])
                      .filter((player) => {
                        const isInTeamB = formation.teamB.some(p => p.userId === player.userId)
                        return isInTeamB
                      })
                      .sort((a, b) => {
                        const aIndex = formation.teamB.findIndex(p => p.userId === a.userId)
                        const bIndex = formation.teamB.findIndex(p => p.userId === b.userId)
                        return aIndex - bIndex
                      })
                      .map((player) => {
                        const playerAverage = match.playerAverages?.find(pa => pa.userId === player.userId)
                        return (
                          <div key={player.id} className="p-3 border-2 rounded-lg flex justify-between items-center hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all hover:shadow-md border-red-200 bg-red-50/30">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {player.user.avatarUrl ? (
                                <img
                                  src={player.user.avatarUrl}
                                  alt={player.user.name}
                                  className="w-8 h-8 rounded-full object-cover shadow-md border-2 border-red-300 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                                  {player.user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{player.user.name}</p>
                                {playerAverage && (
                                  <div className="flex items-center gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                      const rating = playerAverage.averageRating
                                      const isFilled = star <= Math.floor(rating)
                                      const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && rating % 1 < 1
                                      
                                      if (isFilled) {
                                        return (
                                          <Star
                                            key={star}
                                            className="w-3 h-3 text-yellow-500 fill-yellow-500"
                                          />
                                        )
                                      } else if (isHalfFilled) {
                                        return (
                                          <div key={star} className="relative w-3 h-3">
                                            <Star className="w-3 h-3 text-gray-300 absolute" />
                                            <div className="absolute overflow-hidden" style={{ width: '50%' }}>
                                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            </div>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <Star
                                            key={star}
                                            className="w-3 h-3 text-gray-300"
                                          />
                                        )
                                      }
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                            {isOwner && match.status === 'DRAFT' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setPlayerToRemove({
                                    id: player.id,
                                    userId: player.userId,
                                    name: player.user.name,
                                  })
                                  setShowRemovePlayerModal(true)
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 p-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {canRate && isInRoster && (
          <Card id="rating-card" className="mt-8 mb-6 shadow-xl border-2 border-yellow-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6" />
                Oyuncu Puanlama
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!showRatingForm ? (
                <Button 
                  onClick={() => {
                    // Önceden verilen puanları yükle
                    const existingRatings: Record<string, number> = {}
                    if (match.ratings && user) {
                      match.ratings.forEach((rating) => {
                        if (rating.raterId === user.id) {
                          existingRatings[rating.ratedUserId] = rating.rating
                        }
                      })
                    }
                    setRatings(existingRatings)
                    setShowRatingForm(true)
                    // Smooth scroll to rating card (accounting for sticky navbar)
                    setTimeout(() => {
                      const ratingCard = document.getElementById('rating-card')
                      const navbar = document.querySelector('nav')
                      if (ratingCard && navbar) {
                        const navbarHeight = navbar.offsetHeight || 70
                        const cardPosition = ratingCard.getBoundingClientRect().top + window.pageYOffset
                        window.scrollTo({
                          top: cardPosition - navbarHeight - 20,
                          behavior: 'smooth'
                        })
                      }
                    }, 150)
                  }} 
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-lg py-6"
                  size="lg"
                >
                  <Star className="w-5 h-5 mr-1" />
                  {match.ratings && user && match.ratings.some(r => r.raterId === user.id) 
                    ? 'Puanları Görüntüle' 
                    : 'Puanla'}
                </Button>
              ) : (
                <form onSubmit={handleSubmitRating} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Takım A */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                      <h3 className="font-bold text-blue-700 text-center mb-4 text-lg">Takım A</h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {(match.roster || [])
                          .filter((r) => {
                            const isInTeamA = formation.teamA.some(p => p.userId === r.userId)
                            return isInTeamA
                          })
                          .map((player) => (
                            <div key={player.id} className="bg-white p-3 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {player.user.avatarUrl ? (
                                    <img
                                      src={player.user.avatarUrl}
                                      alt={player.user.name}
                                      className="w-8 h-8 rounded-full border-2 border-blue-300 flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                      {player.user.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span className="font-semibold text-sm text-gray-900 truncate">{player.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      type="button"
                                      key={star}
                                      onClick={() => handleRatingChange(player.userId, star)}
                                      className={`transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                                        star <= (ratings[player.userId] || 0)
                                          ? 'text-yellow-500'
                                          : 'text-gray-300 hover:text-yellow-300'
                                      }`}
                                    >
                                      <Star
                                        className={`w-5 h-5 ${
                                          star <= (ratings[player.userId] || 0)
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Takım B */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-200">
                      <h3 className="font-bold text-red-700 text-center mb-4 text-lg">Takım B</h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {(match.roster || [])
                          .filter((r) => {
                            const isInTeamB = formation.teamB.some(p => p.userId === r.userId)
                            return isInTeamB
                          })
                          .map((player) => (
                            <div key={player.id} className="bg-white p-3 rounded-lg border border-red-200">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {player.user.avatarUrl ? (
                                    <img
                                      src={player.user.avatarUrl}
                                      alt={player.user.name}
                                      className="w-8 h-8 rounded-full border-2 border-red-300 flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                      {player.user.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span className="font-semibold text-sm text-gray-900 truncate">{player.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      type="button"
                                      key={star}
                                      onClick={() => handleRatingChange(player.userId, star)}
                                      className={`transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                                        star <= (ratings[player.userId] || 0)
                                          ? 'text-yellow-500'
                                          : 'text-gray-300 hover:text-yellow-300'
                                      }`}
                                    >
                                      <Star
                                        className={`w-5 h-5 ${
                                          star <= (ratings[player.userId] || 0)
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                      size="lg"
                      disabled={submittingRating}
                    >
                      {submittingRating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        'Gönder'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        if (submittingRating) return
                        setShowRatingForm(false)
                        setRatings({})
                        // Smooth scroll to rating card (accounting for sticky navbar)
                        setTimeout(() => {
                          const ratingCard = document.getElementById('rating-card')
                          const navbar = document.querySelector('nav')
                          if (ratingCard && navbar) {
                            const navbarHeight = navbar.offsetHeight || 70
                            const cardPosition = ratingCard.getBoundingClientRect().top + window.pageYOffset
                            window.scrollTo({
                              top: cardPosition - navbarHeight - 20,
                              behavior: 'smooth'
                            })
                          }
                        }, 150)
                      }} 
                      size="lg"
                      disabled={submittingRating}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}


        {/* Remove Player Modal */}
        <Dialog open={showRemovePlayerModal} onOpenChange={setShowRemovePlayerModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Oyuncuyu Kadrodan Çıkar
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                <span className="font-bold text-gray-900">{playerToRemove?.name}</span> adlı oyuncuyu kadrodan çıkarmak istediğinize emin misiniz?
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  <strong>Bilgi:</strong> Bu oyuncu kadrodan çıkarılacak ancak daha sonra tekrar kadroya ekleyebilirsiniz.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-3 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRemovePlayerModal(false)
                  setPlayerToRemove(null)
                }}
                disabled={removingPlayer}
                className="flex-1 sm:flex-none"
              >
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!playerToRemove) return
                  setRemovingPlayer(true)
                  try {
                    const res = await fetch(`/api/matches/${params.id}/roster?userId=${playerToRemove.userId}`, {
                      method: 'DELETE',
                    })
                    if (res.ok) {
                      showToast(`${playerToRemove.name} kadrodan çıkarıldı`, 'success')
                      setShowRemovePlayerModal(false)
                      setPlayerToRemove(null)
                      fetchMatch()
                    } else {
                      const data = await res.json()
                      showToast(data.error || 'Hata oluştu', 'error')
                    }
                  } catch (error) {
                    showToast('Bir hata oluştu', 'error')
                  } finally {
                    setRemovingPlayer(false)
                  }
                }}
                disabled={removingPlayer}
                className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
              >
                {removingPlayer ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Çıkarılıyor...
                  </div>
                ) : (
                  'Kadrodan Çıkar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Clear Roster Modal */}
        <Dialog open={showClearRosterModal} onOpenChange={setShowClearRosterModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Tüm Kadroyu Temizle
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Tüm kadroyu temizlemek istediğinize emin misiniz? Bu işlem tüm oyuncuları kadrodan çıkaracaktır.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  <strong>Bilgi:</strong> Tüm oyuncular kadrodan çıkarılacak ancak daha sonra tekrar kadroya ekleyebilirsiniz.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-3 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowClearRosterModal(false)}
                disabled={clearingRoster}
                className="flex-1 sm:flex-none"
              >
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearRoster}
                disabled={clearingRoster}
                className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
              >
                {clearingRoster ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Temizleniyor...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Tüm Kadroyu Temizle
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Golsüz Maç Onay Modal */}
        <Dialog open={showNoGoalsModal} onOpenChange={setShowNoGoalsModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Golsüz Maç Onayı
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Maç için herhangi bir gol verisi girilmedi. Maç 0-0 bitti olarak kaydedilecektir. Devam etmek istediğinize emin misiniz?
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  <strong>Bilgi:</strong> Maç 0-0 skorla {pendingStatus === 'PUBLISHED' ? 'yayınlanacak' : 'oynandı olarak işaretlenecek'}. Daha sonra skor girişi yapabilirsiniz.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-3 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoGoalsModal(false)
                  setPendingStatus(null)
                }}
                disabled={updatingStatus}
                className="flex-1 sm:flex-none"
              >
                İptal
              </Button>
              <Button
                onClick={handleConfirmNoGoals}
                disabled={updatingStatus}
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {updatingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Onayla ve Devam Et
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

