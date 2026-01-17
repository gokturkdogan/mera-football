'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import Navbar from '@/components/Navbar'
import { Target, Calendar, Clock, MapPin, CheckCircle2, XCircle, FileText, Users, Star, Pencil, X, Plus, Lightbulb, Trophy } from 'lucide-react'

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
    }
  }>
  scores: {
    teamAScore: number
    teamBScore: number
    teamAGoals: any[]
    teamBGoals: any[]
  } | null
  ratings: Array<{
    id: string
    raterId: string
    ratedUserId: string
    rating: number
    comment: string | null
    rater: { name: string }
    ratedUser: { name: string }
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
  const [scoreData, setScoreData] = useState({
    teamAScore: 0,
    teamBScore: 0,
  })
  const [ratingData, setRatingData] = useState({
    ratedUserId: '',
    rating: 5,
    comment: '',
  })
  const [organizationMembers, setOrganizationMembers] = useState<Array<{
    id: string
    userId: string
    status: string
    attendanceStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED'
    user: {
      id: string
      name: string
      email: string
    }
  }>>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null)
  const [facilities, setFacilities] = useState<Array<{
    id: string
    name: string
    location: string
  }>>([])
  const [selectedFacility, setSelectedFacility] = useState<{
    name: string
    location: string
  } | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<'PENDING' | 'ACCEPTED' | 'DECLINED'>('PENDING')
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [isOrganizationMember, setIsOrganizationMember] = useState(false)
  const [showRemovePlayerModal, setShowRemovePlayerModal] = useState(false)
  const [playerToRemove, setPlayerToRemove] = useState<{ id: string; userId: string; name: string } | null>(null)
  const [removingPlayer, setRemovingPlayer] = useState(false)
  
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
        router.push('/dashboard')
        return
      }
      const data = await res.json()
      setMatch(data.match)
      setVenueValue(data.match.venue || '')
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
    
    match.roster.forEach((player) => {
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
    if (!match || !draggedPlayer || match.status === 'FINISHED' || match.status === 'PUBLISHED' || !isOwner) return
    
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
    const isAlreadyInRoster = match.roster.some(p => p.userId === userId)
    
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
    if (!isOwnerCheck || match.status === 'FINISHED' || match.status === 'PUBLISHED') return

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


  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/matches/${params.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(scoreData),
      })
      if (res.ok) {
        fetchMatch()
        setShowScoreForm(false)
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
    try {
      const res = await fetch(`/api/matches/${params.id}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingData),
      })
      if (res.ok) {
        fetchMatch()
        setShowRatingForm(false)
        setRatingData({ ratedUserId: '', rating: 5, comment: '' })
        showToast('Puanlama kaydedildi', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    }
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
  const isInRoster = match.roster.some((r) => r.userId === user?.id)
  const canRate = match.status === 'FINISHED' || match.status === 'PUBLISHED'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">
                {match.organization.name}
              </h1>
              <p className="text-lg sm:text-xl opacity-90">
                {new Date(match.date).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} - {match.time}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                match.status === 'FINISHED' 
                  ? 'bg-green-500 text-white' 
                  : match.status === 'UPCOMING' 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {match.status === 'FINISHED' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Tamamlandı
                  </>
                ) : match.status === 'UPCOMING' ? (
                  <>
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Yaklaşan
                  </>
                ) : match.status === 'DRAFT' ? (
                  <>
                    <FileText className="w-4 h-4 inline mr-1" />
                    Taslak
                  </>
                ) : match.status}
              </span>
              {match.scores && (
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-white/30">
                  <p className="text-3xl font-black text-center">
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
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Diziliş Ön İzlemesi
                </CardTitle>
                <CardDescription>
                  {match.status === 'FINISHED' || match.status === 'PUBLISHED' 
                    ? 'Maç dizilişi'
                    : isOwner
                    ? 'Oyuncuları pozisyonlarına göre yerleştirin'
                    : 'Maç dizilişi önizlemesi'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Halısaha Krokisi - Responsive */}
                  <div className="w-full lg:w-[60%]">
                    <div 
                      className="relative bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl border-4 border-green-600 shadow-2xl overflow-hidden" 
                      style={{ aspectRatio: '16/9', minHeight: '500px', padding: '0.75rem', width: '100%' }}
                      onDragOver={isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' ? handleDragOver : undefined}
                      onDrop={isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' ? handleDrop : undefined}
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
                          draggable={isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED'}
                          onDragStart={(e) => handleDragStart(e, player.userId)}
                          className={`absolute flex flex-col items-center z-10 ${
                            isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' 
                              ? 'cursor-grab active:cursor-grabbing' 
                              : 'cursor-default'
                          }`}
                          style={{
                            left: `${player.x}%`,
                            bottom: `${100 - player.y}%`,
                            transform: 'translate(-50%, 50%)',
                          }}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700 shadow-lg">
                            <span className="text-white font-bold text-sm sm:text-base">
                              {member.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="mt-0.5 bg-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold text-blue-700 shadow-md max-w-[80px] truncate">
                            {member.user.name}
                          </div>
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
                          draggable={isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED'}
                          onDragStart={(e) => handleDragStart(e, player.userId)}
                          className={`absolute flex flex-col items-center z-10 ${
                            isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' 
                              ? 'cursor-grab active:cursor-grabbing' 
                              : 'cursor-default'
                          }`}
                          style={{
                            left: `${player.x}%`,
                            top: `${player.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 border-red-700 shadow-lg">
                            <span className="text-white font-bold text-sm sm:text-base">
                              {member.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="mt-0.5 bg-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold text-red-700 shadow-md max-w-[80px] truncate">
                            {member.user.name}
                          </div>
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
                          {isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' 
                            ? 'Sürükleyip bırakın' 
                            : 'Kadro listesi'}
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
                              const canDrag = !isInFormation && isAccepted && isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED'
                              const isDisabled = !isAccepted && match.status !== 'FINISHED' && match.status !== 'PUBLISHED'
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
                                  } ${match.status === 'FINISHED' || match.status === 'PUBLISHED' ? '' : isInFormation ? 'cursor-default' : canDrag ? 'cursor-grab active:cursor-grabbing' : isDisabled ? 'cursor-not-allowed' : ''}`}
                                >
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
                                  {isInFormation && isOwner && match.status !== 'FINISHED' && match.status !== 'PUBLISHED' && (
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
                                  {isInFormation && (!isOwner || match.status === 'FINISHED' || match.status === 'PUBLISHED') && (
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
          <Card className="shadow-xl border-2 border-green-200 bg-white h-full">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Maç bilgileri yükleniyor...</p>
              </div>
            ) : (
            <div className="space-y-4">
              {/* Üst Satır: Tarih, Saat, Kapasite */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tarih */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Tarih
                  </Label>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(match.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                {/* Saat */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Saat
                  </Label>
                  <p className="text-sm font-bold text-gray-900">{match.time}</p>
                </div>

              </div>
              
              {/* Alt Satır: Saha Adı - Tam Genişlik */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Saha Adı
                  </Label>
                  {isOwner && match.status !== 'FINISHED' && (
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
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Saha adı girin..."
                      value={venueValue}
                      onChange={(e) => setVenueValue(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateVenue}
                      disabled={savingVenue}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {savingVenue ? '...' : '✓'}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className={`text-sm font-bold mb-2 ${match.venue ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {match.venue || 'Saha adı belirtilmemiş'}
                    </p>
                    {selectedFacility && (
                      <div className="mt-3">
                        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2 mb-2">
                          <p className="text-xs font-semibold text-yellow-900 text-center">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {selectedFacility.name}
                          </p>
                        </div>
                        <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
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
          {/* Skor Girişi - Yönetici için düzenlenebilir, oyuncular için sadece görüntüleme */}
          {match.scores ? (
            <Card className="shadow-xl border-2 border-blue-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Maç Skoru
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 text-center">
                    <Label className="font-semibold text-lg">Takım A</Label>
                    <p className="text-5xl font-black text-blue-700 mt-2">
                      {match.scores?.teamAScore ?? 0}
                    </p>
                  </div>
                  <div className="space-y-2 bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border-2 border-red-200 text-center">
                    <Label className="font-semibold text-lg">Takım B</Label>
                    <p className="text-5xl font-black text-red-700 mt-2">
                      {match.scores?.teamBScore ?? 0}
                    </p>
                  </div>
                </div>
                {isOwner && match.status !== 'FINISHED' && match.scores && (
                  <Button 
                    onClick={() => {
                      setScoreData({
                        teamAScore: match.scores!.teamAScore,
                        teamBScore: match.scores!.teamBScore,
                      })
                      setShowScoreForm(true)
                    }} 
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    size="lg"
                  >
                    Skoru Düzenle
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : isOwner && match.status !== 'FINISHED' ? (
            <Card className="shadow-xl border-2 border-blue-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Skor Girişi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!showScoreForm ? (
                  <Button 
                    onClick={() => setShowScoreForm(true)} 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg py-6"
                    size="lg"
                  >
                    Skor Gir
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitScore} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                        <Label className="font-semibold">Takım A</Label>
                        <Input
                          type="number"
                          min="0"
                          value={scoreData.teamAScore}
                          onChange={(e) => setScoreData({ ...scoreData, teamAScore: parseInt(e.target.value) || 0 })}
                          className="text-2xl font-bold text-center"
                          required
                        />
                      </div>
                      <div className="space-y-2 bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                        <Label className="font-semibold">Takım B</Label>
                        <Input
                          type="number"
                          min="0"
                          value={scoreData.teamBScore}
                          onChange={(e) => setScoreData({ ...scoreData, teamBScore: parseInt(e.target.value) || 0 })}
                          className="text-2xl font-bold text-center"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" size="lg">
                        Kaydet
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowScoreForm(false)} size="lg">
                        İptal
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Kadro Listesi */}
          <Card className="shadow-xl border-2 border-purple-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Kadro Listesi
                <span className="ml-auto text-sm font-normal text-gray-600">
                  ({match.roster.length} oyuncu)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {match.roster.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 font-medium">Henüz kadro oluşturulmamış</p>
                  </div>
                ) : (
                  match.roster.map((player) => (
                    <div key={player.id} className="p-4 border-2 rounded-xl flex justify-between items-center hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all hover:shadow-md border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {player.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{player.user.name}</p>
                          {player.position && (
                            <p className="text-xs text-gray-600 font-medium">
                              {player.position.replace('_', ' ').toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                      {isOwner && match.status !== 'FINISHED' && (
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
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Çıkar
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {canRate && isInRoster && (
          <Card className="mb-6 shadow-xl border-2 border-yellow-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6" />
                Oyuncu Puanlama
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!showRatingForm ? (
                <Button 
                  onClick={() => setShowRatingForm(true)} 
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-lg py-6"
                  size="lg"
                >
                  <Star className="w-5 h-5 mr-1" />
                  Oyuncu Puanla
                </Button>
              ) : (
                <form onSubmit={handleSubmitRating} className="space-y-4">
                  <div className="space-y-2 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                    <Label className="font-semibold">Oyuncu Seç</Label>
                    <select
                      className="flex h-12 w-full rounded-lg border-2 border-blue-300 bg-white px-4 py-2 text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      value={ratingData.ratedUserId}
                      onChange={(e) => setRatingData({ ...ratingData, ratedUserId: e.target.value })}
                      required
                    >
                      <option value="">Seçiniz</option>
                      {match.roster
                        .filter((r) => r.userId !== user?.id)
                        .map((player) => (
                          <option key={player.id} value={player.userId}>
                            {player.user.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="space-y-2 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                    <Label className="font-semibold">Puan (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={ratingData.rating}
                      onChange={(e) => setRatingData({ ...ratingData, rating: parseInt(e.target.value) || 5 })}
                      className="text-2xl font-bold text-center"
                      required
                    />
                    <div className="flex justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl cursor-pointer ${star <= ratingData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          onClick={() => setRatingData({ ...ratingData, rating: star })}
                        >
                          <Star className={`w-6 h-6 cursor-pointer ${star <= ratingData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                    <Label className="font-semibold">Yorum (Opsiyonel)</Label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      value={ratingData.comment}
                      onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                      placeholder="Oyuncu hakkında yorumunuz..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" size="lg">
                      Kaydet
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowRatingForm(false)} size="lg">
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {match.ratings.length > 0 && (
          <Card className="shadow-xl border-2 border-indigo-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6" />
                Puanlamalar ({match.ratings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-yellow-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-yellow-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Puanlamalar yükleniyor...</p>
                  </div>
                ) : match.ratings.length === 0 ? null : (
                  match.ratings.map((rating) => (
                  <div key={rating.id} className="p-4 border-2 rounded-xl bg-gradient-to-r from-white to-indigo-50 hover:shadow-md transition-all border-indigo-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {rating.rater.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-bold text-gray-900">{rating.rater.name}</p>
                          <span className="text-gray-400">→</span>
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {rating.ratedUser.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-bold text-gray-900">{rating.ratedUser.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${star <= rating.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({rating.rating}/5)</span>
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 mt-2">
                            "{rating.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
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
      </div>
    </div>
  )
}

