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
  venue: string
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
  const [scoreData, setScoreData] = useState({
    teamAScore: 0,
    teamBScore: 0,
  })
  const [ratingData, setRatingData] = useState({
    ratedUserId: '',
    rating: 5,
    comment: '',
  })

  useEffect(() => {
    fetchUser()
    fetchMatch()
  }, [])

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
      const res = await fetch(`/api/matches/${params.id}`)
      if (!res.ok) {
        router.push('/dashboard')
        return
      }
      const data = await res.json()
      setMatch(data.match)
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

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/matches/${params.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Maç Detayları</CardTitle>
            <CardDescription>
              {new Date(match.date).toLocaleDateString('tr-TR')} - {match.time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-semibold">Saha:</span> {match.venue}</p>
              <p><span className="font-semibold">Kapasite:</span> {match.capacity}</p>
              <p>
                <span className="font-semibold">Durum:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs ${
                  match.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                  match.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {match.status}
                </span>
              </p>
              {match.scores && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <p className="text-2xl font-bold text-center">
                    {match.scores.teamAScore} - {match.scores.teamBScore}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {isOwner && match.status !== 'FINISHED' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skor Girişi</CardTitle>
            </CardHeader>
            <CardContent>
              {!showScoreForm ? (
                <Button onClick={() => setShowScoreForm(true)}>Skor Gir</Button>
              ) : (
                <form onSubmit={handleSubmitScore} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Takım A Skoru</Label>
                      <Input
                        type="number"
                        min="0"
                        value={scoreData.teamAScore}
                        onChange={(e) => setScoreData({ ...scoreData, teamAScore: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Takım B Skoru</Label>
                      <Input
                        type="number"
                        min="0"
                        value={scoreData.teamBScore}
                        onChange={(e) => setScoreData({ ...scoreData, teamBScore: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Kaydet</Button>
                    <Button type="button" variant="outline" onClick={() => setShowScoreForm(false)}>
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Kadro</CardTitle>
              {isOwner && match.status !== 'FINISHED' && !isInRoster && (
                <Button 
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/matches/${params.id}/roster`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user?.id }),
                      })
                      if (res.ok) {
                        fetchMatch()
                        alert('Kadroya eklendiniz')
                      } else {
                        const data = await res.json()
                        alert(data.error || 'Hata oluştu')
                      }
                    } catch (error) {
                      alert('Bir hata oluştu')
                    }
                  }}
                  size="sm"
                  variant="outline"
                >
                  Kendimi Ekle
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.roster.length === 0 ? (
                <p className="text-gray-600">Henüz kadro oluşturulmamış</p>
              ) : (
                match.roster.map((player) => (
                  <div key={player.id} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{player.user.name}</p>
                      {player.position && (
                        <p className="text-sm text-gray-600">Pozisyon: {player.position}</p>
                      )}
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
                      >
                        Çıkar
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
            {isOwner && match.status !== 'FINISHED' && (
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    const memberId = prompt('Eklemek istediğiniz oyuncunun ID\'sini girin (veya email ile arayın):')
                    if (!memberId) return
                    
                    // Try to find user by email or use as ID
                    try {
                      const res = await fetch(`/api/matches/${params.id}/roster`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: memberId }),
                      })
                      if (res.ok) {
                        fetchMatch()
                        alert('Oyuncu kadroya eklendi')
                      } else {
                        const data = await res.json()
                        alert(data.error || 'Hata oluştu')
                      }
                    } catch (error) {
                      alert('Bir hata oluştu')
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Oyuncu Ekle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {canRate && isInRoster && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Oyuncu Puanlama</CardTitle>
            </CardHeader>
            <CardContent>
              {!showRatingForm ? (
                <Button onClick={() => setShowRatingForm(true)}>Oyuncu Puanla</Button>
              ) : (
                <form onSubmit={handleSubmitRating} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Oyuncu Seç</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  <div className="space-y-2">
                    <Label>Puan (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={ratingData.rating}
                      onChange={(e) => setRatingData({ ...ratingData, rating: parseInt(e.target.value) || 5 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Yorum (Opsiyonel)</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={ratingData.comment}
                      onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Kaydet</Button>
                    <Button type="button" variant="outline" onClick={() => setShowRatingForm(false)}>
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {match.ratings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Puanlamalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {match.ratings.map((rating) => (
                  <div key={rating.id} className="p-2 border rounded">
                    <p className="font-semibold">{rating.rater.name} → {rating.ratedUser.name}</p>
                    <p className="text-sm">Puan: {'⭐'.repeat(rating.rating)}</p>
                    {rating.comment && (
                      <p className="text-sm text-gray-600">{rating.comment}</p>
                    )}
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

