'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'

interface Match {
  id: string
  date: string
  time: string
  venue: string | null
  capacity: number
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
  const [match, setMatch] = useState<Match | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showScoreForm, setShowScoreForm] = useState(false)
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [showVenueEdit, setShowVenueEdit] = useState(false)
  const [venueValue, setVenueValue] = useState('')
  const [savingVenue, setSavingVenue] = useState(false)
  const [showCapacityEdit, setShowCapacityEdit] = useState(false)
  const [capacityValue, setCapacityValue] = useState(10)
  const [savingCapacity, setSavingCapacity] = useState(false)
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
    user: {
      id: string
      name: string
      email: string
    }
  }>>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  
  // Formation positions: 1 GK, 3 DF, 2 MF, 1 FW per team
  const [formation, setFormation] = useState<{
    teamA: {
      gk: string | null
      df1: string | null
      df2: string | null
      df3: string | null
      mf1: string | null
      mf2: string | null
      fw1: string | null
    }
    teamB: {
      gk: string | null
      df1: string | null
      df2: string | null
      df3: string | null
      mf1: string | null
      mf2: string | null
      fw1: string | null
    }
  }>({
    teamA: { gk: null, df1: null, df2: null, df3: null, mf1: null, mf2: null, fw1: null },
    teamB: { gk: null, df1: null, df2: null, df3: null, mf1: null, mf2: null, fw1: null },
  })

  useEffect(() => {
    fetchUser()
    fetchMatch()
  }, [])

  useEffect(() => {
    if (match) {
      fetchOrganizationMembers()
      loadFormationFromRoster()
    }
  }, [match])

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
      setCapacityValue(data.match.capacity || 10)
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
    if (!match) return
    setLoadingMembers(true)
    try {
      const res = await fetch(`/api/organizations/${match.organization.id}/members`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        // Filter only approved members
        const approved = data.members.filter((m: any) => m.status === 'APPROVED')
        setOrganizationMembers(approved)
      }
    } catch (error) {
      console.error('Error fetching organization members:', error)
    } finally {
      setLoadingMembers(false)
    }
  }

  const loadFormationFromRoster = () => {
    if (!match || !match.roster) return
    
    const newFormation = {
      teamA: { gk: null, df1: null, df2: null, df3: null, mf1: null, mf2: null, fw1: null },
      teamB: { gk: null, df1: null, df2: null, df3: null, mf1: null, mf2: null, fw1: null },
    }
    
    // Load existing positions from roster
    match.roster.forEach((player) => {
      if (player.position) {
        const [team, pos] = player.position.split('_')
        if (team === 'A' && pos in newFormation.teamA) {
          ;(newFormation.teamA as any)[pos] = player.userId
        } else if (team === 'B' && pos in newFormation.teamB) {
          ;(newFormation.teamB as any)[pos] = player.userId
        }
      }
    })
    
    setFormation(newFormation)
  }

  const handlePositionSelect = async (team: 'A' | 'B', position: string, userId: string | null) => {
    if (!match || !user) return
    const isOwnerCheck = user.id === match.organization.ownerId
    if (!isOwnerCheck) return
    
    const positionKey = `${team}_${position}` as any
    
    // Update formation state
    setFormation((prev) => ({
      ...prev,
      [team === 'A' ? 'teamA' : 'teamB']: {
        ...prev[team === 'A' ? 'teamA' : 'teamB'],
        [position]: userId,
      },
    }))
    
    if (!userId) return // If clearing position, don't add to roster
    
    try {
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
        alert(data.error || 'Oyuncu eklenirken hata oluştu')
        // Revert formation state
        loadFormationFromRoster()
      }
    } catch (error) {
      alert('Bir hata oluştu')
      loadFormationFromRoster()
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
        alert('Saha adı güncellendi')
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setSavingVenue(false)
    }
  }

  const handleUpdateCapacity = async () => {
    if (!match) return
    if (capacityValue < 2) {
      alert('Kapasite en az 2 olmalıdır')
      return
    }
    if (capacityValue < match.roster.length) {
      alert(`Kapasite, mevcut kadro sayısından (${match.roster.length}) küçük olamaz`)
      return
    }
    setSavingCapacity(true)
    try {
      const res = await fetch(`/api/matches/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ capacity: capacityValue }),
      })
      if (res.ok) {
        const data = await res.json()
        setMatch(data.match)
        setShowCapacityEdit(false)
        alert('Kapasite güncellendi')
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setSavingCapacity(false)
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
        alert('Skor kaydedildi')
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
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
        alert('Puanlama kaydedildi')
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
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
                {match.status === 'FINISHED' ? '✅ Tamamlandı' : 
                 match.status === 'UPCOMING' ? '📅 Yaklaşan' : 
                 match.status === 'DRAFT' ? '📝 Taslak' : match.status}
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

      <div className="container mx-auto px-4 py-8">
        {/* Üst Kısım: Saha Krokisi (Sol) ve Maç Detayları (Sağ) */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Saha Krokisi - Sol (Büyük) */}
          {(isOwner || match.status === 'FINISHED' || match.status === 'PUBLISHED') && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>⚽</span>
                    Diziliş Ön İzlemesi
                  </CardTitle>
                  <CardDescription>
                    {match.status === 'FINISHED' || match.status === 'PUBLISHED' 
                      ? 'Maç dizilişi (3-2-1 Dizilişi)'
                      : 'Oyuncuları pozisyonlarına göre yerleştirin (3-2-1 Dizilişi)'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {/* Halısaha Krokisi - Responsive */}
                  <div className="relative bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-2xl p-4 sm:p-6 md:p-8 border-4 border-green-600 shadow-2xl overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
                    {/* Saha Çizgileri */}
                    <div className="absolute inset-0 border-4 border-green-700 rounded-xl"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-700 opacity-80"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 border-green-700 rounded-full"></div>
                    
                    {/* Takım A (Alt Taraf) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2">
                      {/* Kaleci */}
                      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                          <div className="bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] shadow-md">
                            {formation.teamA.gk ? organizationMembers.find(m => m.userId === formation.teamA.gk)?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                          </div>
                        ) : (
                          <select
                            value={formation.teamA.gk || ''}
                            onChange={(e) => handlePositionSelect('A', 'gk', e.target.value || null)}
                            disabled={!isOwner || match.status === 'FINISHED'}
                            className="bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] cursor-pointer hover:bg-blue-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">Oyuncu seçiniz</option>
                            {organizationMembers.map((member) => (
                              <option key={member.userId} value={member.userId}>
                                {member.user.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="text-[10px] sm:text-xs text-center mt-1 font-bold text-blue-700">GK</div>
                      </div>
                      
                      {/* Defanslar */}
                      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 z-10">
                        {['df1', 'df2', 'df3'].map((pos, idx) => (
                          <div key={pos} className="flex flex-col items-center">
                            {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                              <div className="bg-white border-2 border-green-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] shadow-md">
                                {(formation.teamA as any)[pos] ? organizationMembers.find(m => m.userId === (formation.teamA as any)[pos])?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                              </div>
                            ) : (
                              <select
                                value={(formation.teamA as any)[pos] || ''}
                                onChange={(e) => handlePositionSelect('A', pos, e.target.value || null)}
                                disabled={!isOwner || match.status === 'FINISHED'}
                                className="bg-white border-2 border-green-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] cursor-pointer hover:bg-green-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="">Oyuncu seçiniz</option>
                                {organizationMembers.map((member) => (
                                  <option key={member.userId} value={member.userId}>
                                    {member.user.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="text-[10px] sm:text-xs text-center mt-0.5 sm:mt-1 font-bold text-green-700">DF{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Ortasaha */}
                      <div className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 z-10">
                        {['mf1', 'mf2'].map((pos, idx) => (
                          <div key={pos} className="flex flex-col items-center">
                            {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                              <div className="bg-white border-2 border-yellow-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] shadow-md">
                                {(formation.teamA as any)[pos] ? organizationMembers.find(m => m.userId === (formation.teamA as any)[pos])?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                              </div>
                            ) : (
                              <select
                                value={(formation.teamA as any)[pos] || ''}
                                onChange={(e) => handlePositionSelect('A', pos, e.target.value || null)}
                                disabled={!isOwner || match.status === 'FINISHED'}
                                className="bg-white border-2 border-yellow-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] cursor-pointer hover:bg-yellow-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="">Oyuncu seçiniz</option>
                                {organizationMembers.map((member) => (
                                  <option key={member.userId} value={member.userId}>
                                    {member.user.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="text-[10px] sm:text-xs text-center mt-0.5 sm:mt-1 font-bold text-yellow-700">MF{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Forvet */}
                      <div className="absolute bottom-36 sm:bottom-40 md:bottom-44 left-1/2 transform -translate-x-1/2 z-10">
                        {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                          <div className="bg-white border-2 border-red-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] shadow-md">
                            {formation.teamA.fw1 ? organizationMembers.find(m => m.userId === formation.teamA.fw1)?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                          </div>
                        ) : (
                          <select
                            value={formation.teamA.fw1 || ''}
                            onChange={(e) => handlePositionSelect('A', 'fw1', e.target.value || null)}
                            disabled={!isOwner || match.status === 'FINISHED'}
                            className="bg-white border-2 border-red-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] cursor-pointer hover:bg-red-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">Oyuncu seçiniz</option>
                            {organizationMembers.map((member) => (
                              <option key={member.userId} value={member.userId}>
                                {member.user.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="text-[10px] sm:text-xs text-center mt-1 font-bold text-red-700">FW</div>
                      </div>
                    </div>
                    
                    {/* Takım B (Üst Taraf) */}
                    <div className="absolute top-0 left-0 right-0 h-1/2">
                      {/* Kaleci */}
                      <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-10">
                        {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                          <div className="bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] shadow-md">
                            {formation.teamB.gk ? organizationMembers.find(m => m.userId === formation.teamB.gk)?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                          </div>
                        ) : (
                          <select
                            value={formation.teamB.gk || ''}
                            onChange={(e) => handlePositionSelect('B', 'gk', e.target.value || null)}
                            disabled={!isOwner || match.status === 'FINISHED'}
                            className="bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] cursor-pointer hover:bg-blue-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">Oyuncu seçiniz</option>
                            {organizationMembers.map((member) => (
                              <option key={member.userId} value={member.userId}>
                                {member.user.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="text-[10px] sm:text-xs text-center mt-1 font-bold text-blue-700">GK</div>
                      </div>
                      
                      {/* Defanslar */}
                      <div className="absolute top-12 sm:top-16 md:top-20 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 z-10">
                        {['df1', 'df2', 'df3'].map((pos, idx) => (
                          <div key={pos} className="flex flex-col items-center">
                            {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                              <div className="bg-white border-2 border-green-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] shadow-md">
                                {(formation.teamB as any)[pos] ? organizationMembers.find(m => m.userId === (formation.teamB as any)[pos])?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                              </div>
                            ) : (
                              <select
                                value={(formation.teamB as any)[pos] || ''}
                                onChange={(e) => handlePositionSelect('B', pos, e.target.value || null)}
                                disabled={!isOwner || match.status === 'FINISHED'}
                                className="bg-white border-2 border-green-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] cursor-pointer hover:bg-green-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="">Oyuncu seçiniz</option>
                                {organizationMembers.map((member) => (
                                  <option key={member.userId} value={member.userId}>
                                    {member.user.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="text-[10px] sm:text-xs text-center mt-0.5 sm:mt-1 font-bold text-green-700">DF{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Ortasaha */}
                      <div className="absolute top-24 sm:top-28 md:top-32 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 z-10">
                        {['mf1', 'mf2'].map((pos, idx) => (
                          <div key={pos} className="flex flex-col items-center">
                            {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                              <div className="bg-white border-2 border-yellow-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] shadow-md">
                                {(formation.teamB as any)[pos] ? organizationMembers.find(m => m.userId === (formation.teamB as any)[pos])?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                              </div>
                            ) : (
                              <select
                                value={(formation.teamB as any)[pos] || ''}
                                onChange={(e) => handlePositionSelect('B', pos, e.target.value || null)}
                                disabled={!isOwner || match.status === 'FINISHED'}
                                className="bg-white border-2 border-yellow-600 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-center min-w-[80px] sm:min-w-[100px] cursor-pointer hover:bg-yellow-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="">Oyuncu seçiniz</option>
                                {organizationMembers.map((member) => (
                                  <option key={member.userId} value={member.userId}>
                                    {member.user.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="text-[10px] sm:text-xs text-center mt-0.5 sm:mt-1 font-bold text-yellow-700">MF{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Forvet */}
                      <div className="absolute top-36 sm:top-40 md:top-44 left-1/2 transform -translate-x-1/2 z-10">
                        {match.status === 'FINISHED' || match.status === 'PUBLISHED' ? (
                          <div className="bg-white border-2 border-red-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] shadow-md">
                            {formation.teamB.fw1 ? organizationMembers.find(m => m.userId === formation.teamB.fw1)?.user.name || 'Oyuncu seçiniz' : 'Oyuncu seçiniz'}
                          </div>
                        ) : (
                          <select
                            value={formation.teamB.fw1 || ''}
                            onChange={(e) => handlePositionSelect('B', 'fw1', e.target.value || null)}
                            disabled={!isOwner || match.status === 'FINISHED'}
                            className="bg-white border-2 border-red-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-center min-w-[100px] sm:min-w-[120px] cursor-pointer hover:bg-red-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">Oyuncu seçiniz</option>
                            {organizationMembers.map((member) => (
                              <option key={member.userId} value={member.userId}>
                                {member.user.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="text-[10px] sm:text-xs text-center mt-1 font-bold text-red-700">FW</div>
                      </div>
                    </div>
                    
                    {/* Takım Etiketleri */}
                    <div className="absolute bottom-1 left-2 sm:left-4 text-[10px] sm:text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded shadow-md z-20">Takım A</div>
                    <div className="absolute top-1 right-2 sm:right-4 text-[10px] sm:text-xs font-bold text-white bg-red-600 px-2 py-1 rounded shadow-md z-20">Takım B</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Maç Detayları - Sağ */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-2 border-green-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Maç Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Tarih ve Saat */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                      <Label className="text-xs text-gray-600 mb-1 block">📅 Tarih</Label>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(match.date).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                      <Label className="text-xs text-gray-600 mb-1 block">🕐 Saat</Label>
                      <p className="text-sm font-bold text-gray-900">{match.time}</p>
                    </div>
                  </div>
                  
                  {/* Venue Section - Editable */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-600">🏟️ Saha Adı</Label>
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
                          {showVenueEdit ? '✕' : match.venue ? '✏️' : '➕'}
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
                      <p className={`text-sm font-bold ${match.venue ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {match.venue || 'Saha adı belirtilmemiş'}
                      </p>
                    )}
                  </div>

                  {/* Capacity Section - Editable */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-gray-600">👥 Kapasite</Label>
                      {isOwner && match.status !== 'FINISHED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (showCapacityEdit) {
                              setShowCapacityEdit(false)
                              setCapacityValue(match.capacity)
                            } else {
                              setShowCapacityEdit(true)
                            }
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {showCapacityEdit ? '✕' : '✏️'}
                        </Button>
                      )}
                    </div>
                    {showCapacityEdit ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          min="2"
                          max="22"
                          value={capacityValue}
                          onChange={(e) => setCapacityValue(parseInt(e.target.value) || 2)}
                          className="flex-1 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={handleUpdateCapacity}
                          disabled={savingCapacity}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {savingCapacity ? '...' : '✓'}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl font-black text-green-700">
                          {match.capacity}
                        </p>
                        {match.roster.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            {match.roster.length} oyuncu kayıtlı
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alt Kısım: Skor Girişi (Sol) ve Kadro Listesi (Sağ) */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skor Girişi */}
          {isOwner && match.status !== 'FINISHED' && (
            <Card className="shadow-xl border-2 border-blue-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚽</span>
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
          )}

          {/* Kadro Listesi */}
          <Card className="shadow-xl border-2 border-purple-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Kadro Listesi
                <span className="ml-auto text-sm font-normal text-gray-600">
                  ({match.roster.length}/{match.capacity})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {match.roster.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">⚽</div>
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
                          onClick={async () => {
                            if (!confirm('Bu oyuncuyu kadrodan çıkarmak istediğinize emin misiniz?')) {
                              return
                            }
                            try {
                              const res = await fetch(`/api/matches/${params.id}/roster?userId=${player.userId}`, {
                                method: 'DELETE',
                              })
                              if (res.ok) {
                                fetchMatch()
                              } else {
                                const data = await res.json()
                                alert(data.error || 'Hata oluştu')
                              }
                            } catch (error) {
                              alert('Bir hata oluştu')
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          ✕ Çıkar
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
                <span className="text-2xl">⭐</span>
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
                  ⭐ Oyuncu Puanla
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
                          ⭐
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
                <span className="text-2xl">⭐</span>
                Puanlamalar ({match.ratings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {match.ratings.map((rating) => (
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
                          <span className="text-lg">{'⭐'.repeat(rating.rating)}</span>
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
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

