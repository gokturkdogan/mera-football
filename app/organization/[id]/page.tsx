'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogBody,
  DialogFooter
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import Navbar from '@/components/Navbar'
import {
  Trophy,
  Star,
  Users,
  Circle,
  Crown,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Phone,
  Plus,
  Gem,
  XCircle,
  Loader2,
  Check,
  Camera,
  FileText,
  User,
  Image as ImageIcon,
  Upload,
  Edit,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Home,
  Target,
  Footprints,
  Ruler,
  Weight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  description: string | null
  avatarUrl: string | null
  owner: {
    id: string
    name: string
    email: string
    plan: string
    avatarUrl: string | null
  }
  members: Array<{
    id: string
    userId: string
    status: string
    createdAt: string
    user: {
      id: string
      name: string
      email: string
      phone: string | null
      avatarUrl: string | null
      showPhone: boolean
      position: string | null
      strongFoot: string | null
      height: number | null
      weight: number | null
      age: number | null
      showPosition: boolean
      showStrongFoot: boolean
      showHeight: boolean
      showWeight: boolean
      showAge: boolean
    }
  }>
  matches: Array<{
    id: string
    date: string
    time: string
    venue: string
    status: string
    hasPendingAttendance?: boolean
  }>
  _count: {
    members: number
  }
}

export default function OrganizationPage() {
  const router = useRouter()
  const params = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [facilities, setFacilities] = useState<any[]>([])
  const [showFacilityForm, setShowFacilityForm] = useState(false)
  const [facilityForm, setFacilityForm] = useState({
    name: '',
    location: '',
    matchPrice: '',
    isIndoor: null as boolean | null,
    fieldType: null as 'REAL_GRASS' | 'SYNTHETIC_GRASS' | null,
  })
  const [facilityLoading, setFacilityLoading] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deletingAvatar, setDeletingAvatar] = useState(false)
  const [updatingDefaultAvatar, setUpdatingDefaultAvatar] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentFacilityIndex, setCurrentFacilityIndex] = useState(0)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0)
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set())
  const [pendingRequestsExpanded, setPendingRequestsExpanded] = useState(false)
  const [showCancelRequestModal, setShowCancelRequestModal] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [cancelingRequest, setCancelingRequest] = useState(false)
  const [joiningRequest, setJoiningRequest] = useState(false)
  const [processingMemberId, setProcessingMemberId] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState<'approve' | 'reject' | null>(null)
  const { showToast } = useToast()
  const facilityFormRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const matchCarouselRef = useRef<HTMLDivElement>(null)
  const memberCarouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const memberTouchStartX = useRef<number | null>(null)
  const memberTouchEndX = useRef<number | null>(null)

  const toggleMemberExpanded = (memberId: string) => {
    setExpandedMembers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(memberId)) {
        newSet.delete(memberId)
      } else {
        newSet.add(memberId)
      }
      return newSet
    })
  }

  // Default avatar URLs - Futbol/Halısaha organizasyonları için uygun logolar
  const DEFAULT_AVATARS = [
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618324/black_katlhj.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618373/red_ltriuy.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/green_ngessp.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/black-1_h6jfsv.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618372/red-1_p6itck.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/green-1_ibxene.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/black-2_jp5mrk.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618373/red-2_bpi3gn.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/green-2_vo08rx.png',
    'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618373/stadium_idi4ba.png',
  ]

  useEffect(() => {
    fetchUser()
    fetchOrganization()
    fetchFacilities()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchOrganization = async () => {
    try {
      const res = await fetch(`/api/organizations/${params.id}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 404) {
          showToast('Organizasyon bulunamadı', 'error')
          router.push('/organizations')
        } else {
          router.push('/login')
        }
        return
      }
      const data = await res.json()
      setOrganization(data.organization)
    } catch (error) {
      console.error('Error fetching organization:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (joiningRequest) return
    setJoiningRequest(true)
    try {
      const res = await fetch(`/api/organizations/${params.id}/join`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Katılım isteğiniz gönderildi! Organizasyon yöneticisi onayladığında organizasyona katılacaksınız.', 'success')
        fetchOrganization()
      } else {
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setJoiningRequest(false)
    }
  }

  const handleCancelRequest = async () => {
    if (cancelingRequest) return
    setCancelingRequest(true)
    try {
      const res = await fetch(`/api/organizations/${params.id}/leave`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        showToast('Katılım isteği iptal edildi', 'success')
        setShowCancelRequestModal(false)
        fetchOrganization()
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setCancelingRequest(false)
    }
  }

  const handleLeave = async () => {
    try {
      const res = await fetch(`/api/organizations/${params.id}/leave`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        showToast('Organizasyondan ayrıldınız', 'success')
        setShowLeaveModal(false)
        router.push('/dashboard')
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    }
  }

  const handleApproveMember = async (memberId: string) => {
    if (processingMemberId) return
    setProcessingMemberId(memberId)
    setProcessingAction('approve')
    try {
      const res = await fetch(`/api/organizations/${params.id}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ memberId, status: 'APPROVED' }),
      })
      if (res.ok) {
        showToast('Katılım isteği onaylandı! Oyuncu organizasyona eklendi.', 'success')
        fetchOrganization()
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setProcessingMemberId(null)
      setProcessingAction(null)
    }
  }

  const handleRejectMember = async (memberId: string) => {
    if (processingMemberId) return
    if (!confirm('Bu katılım isteğini reddetmek istediğinize emin misiniz?')) {
      return
    }
    setProcessingMemberId(memberId)
    setProcessingAction('reject')
    try {
      const res = await fetch(`/api/organizations/${params.id}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ memberId, status: 'REJECTED' }),
      })
      if (res.ok) {
        showToast('Katılım isteği reddedildi', 'success')
        fetchOrganization()
      } else {
        const data = await res.json()
        showToast(data.error || 'Hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setProcessingMemberId(null)
      setProcessingAction(null)
    }
  }

  const fetchFacilities = async () => {
    try {
      const res = await fetch(`/api/organizations/${params.id}/facilities`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setFacilities(data.facilities || [])
        setCurrentFacilityIndex(0)
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
    }
  }

  const handlePrevFacility = () => {
    if (currentFacilityIndex > 0) {
      setCurrentFacilityIndex(currentFacilityIndex - 1)
    } else {
      setCurrentFacilityIndex(facilities.length - 1)
    }
  }

  const handleNextFacility = () => {
    if (currentFacilityIndex < facilities.length - 1) {
      setCurrentFacilityIndex(currentFacilityIndex + 1)
    } else {
      setCurrentFacilityIndex(0)
    }
  }

  const handlePrevMatch = () => {
    if (currentMatchIndex > 0) {
      setCurrentMatchIndex(currentMatchIndex - 1)
    } else {
      setCurrentMatchIndex((organization?.matches?.length || 0) - 1)
    }
  }

  const handleNextMatch = () => {
    const matchesLength = organization?.matches?.length || 0
    if (currentMatchIndex < matchesLength - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1)
    } else {
      setCurrentMatchIndex(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) {
      handleNextFacility()
    }
    if (isRightSwipe) {
      handlePrevFacility()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const handleMatchTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleMatchTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleMatchTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) {
      handleNextMatch()
    }
    if (isRightSwipe) {
      handlePrevMatch()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const size = 400
    canvas.width = size
    canvas.height = size

    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.clip()

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      size,
      size
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas to blob conversion failed'))
        }
      }, 'image/jpeg', 0.95)
    })
  }

  const handleCropComplete = async () => {
    if (!imageSrc || !croppedAreaPixels || !selectedFile || uploadingAvatar) return

    setUploadingAvatar(true)
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      const file = new File([croppedImage], selectedFile.name, { type: 'image/jpeg' })

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'organization-logos')
      uploadFormData.append('publicId', `org-${Date.now()}`)

      const uploadRes = await fetch('/api/upload/organization-logo', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        showToast(errorData.error || 'Görsel yüklenirken bir hata oluştu', 'error')
        setUploadingAvatar(false)
        return
      }

      const { url } = await uploadRes.json()

      const res = await fetch(`/api/organizations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatarUrl: url }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setOrganization(data.organization)
        showToast('Organizasyon logosu güncellendi', 'success')
        setShowCropModal(false)
        setImageSrc(null)
        setSelectedFile(null)
        setAvatarModalOpen(false)
      } else {
        const errorData = await res.json()
        showToast(errorData.error || 'Logo güncellenirken bir hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleDefaultAvatarSelect = async (avatarUrl: string) => {
    if (updatingDefaultAvatar || uploadingAvatar || deletingAvatar) return
    if (user?.id !== organization?.owner.id) return
    
    setUpdatingDefaultAvatar(true)
    try {
      const res = await fetch(`/api/organizations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatarUrl }),
      })

      if (!res.ok) {
        const data = await res.json()
        showToast(data.error || 'Avatar güncellenemedi', 'error')
        return
      }

      const data = await res.json()
      setOrganization(data.organization)
      setAvatarModalOpen(false)
      showToast('Organizasyon logosu güncellendi', 'success')
    } catch (error) {
      console.error('Error updating avatar:', error)
      showToast('Bir hata oluştu', 'error')
    } finally {
      setUpdatingDefaultAvatar(false)
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Lütfen geçerli bir görsel dosyası seçin', 'error')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('Dosya boyutu 5MB\'dan küçük olmalıdır', 'error')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageSrc(reader.result as string)
      setShowCropModal(true)
    })
    reader.readAsDataURL(file)
  }

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault()
    setFacilityLoading(true)
    try {
      const res = await fetch(`/api/organizations/${params.id}/facilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: facilityForm.name,
          location: facilityForm.location,
          matchPrice: facilityForm.matchPrice && facilityForm.matchPrice.trim() !== '' ? parseFloat(facilityForm.matchPrice) : null,
          isIndoor: facilityForm.isIndoor,
          fieldType: facilityForm.fieldType,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Tesis başarıyla eklendi!', 'success')
        setFacilityForm({ 
          name: '', 
          location: '', 
          matchPrice: '',
          isIndoor: null,
          fieldType: null,
        })
        setShowFacilityForm(false)
        fetchFacilities()
      } else {
        showToast(data.error || 'Tesis eklenirken bir hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setFacilityLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return null
  }

  const isOwner = user?.id === organization?.owner.id
  const isMember = organization?.members?.some((m) => m.userId === user?.id && m.status === 'APPROVED') || false
  const hasPendingRequest = organization?.members?.some((m) => m.userId === user?.id && m.status === 'PENDING') || false
  const approvedMembers = organization?.members?.filter((m) => m.status === 'APPROVED') || []
  const pendingMembers = organization?.members?.filter((m) => m.status === 'PENDING') || []

  // Member carousel functions
  const itemsPerPageDesktop = 3
  const itemsPerPageMobile = 1
  const totalPagesDesktop = Math.ceil(approvedMembers.length / itemsPerPageDesktop)
  const totalPagesMobile = Math.ceil(approvedMembers.length / itemsPerPageMobile)

  const handleMemberPrev = () => {
    if (window.innerWidth >= 768) {
      setCurrentMemberIndex((prev) => (prev > 0 ? prev - 1 : totalPagesDesktop - 1))
    } else {
      setCurrentMemberIndex((prev) => (prev > 0 ? prev - 1 : totalPagesMobile - 1))
    }
  }

  const handleMemberNext = () => {
    if (window.innerWidth >= 768) {
      setCurrentMemberIndex((prev) => (prev < totalPagesDesktop - 1 ? prev + 1 : 0))
    } else {
      setCurrentMemberIndex((prev) => (prev < totalPagesMobile - 1 ? prev + 1 : 0))
    }
  }

  const handleMemberTouchStart = (e: React.TouchEvent) => {
    memberTouchStartX.current = e.touches[0].clientX
  }

  const handleMemberTouchMove = (e: React.TouchEvent) => {
    memberTouchEndX.current = e.touches[0].clientX
  }

  const handleMemberTouchEnd = () => {
    if (!memberTouchStartX.current || !memberTouchEndX.current) return
    const distance = memberTouchStartX.current - memberTouchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) {
      handleMemberNext()
    }
    if (isRightSwipe) {
      handleMemberPrev()
    }
    memberTouchStartX.current = null
    memberTouchEndX.current = null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-col md:flex-row gap-6">
            <div className="flex-1 w-full min-w-0">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                {isOwner ? (
                  <div className="relative group flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 overflow-hidden">
                      {organization.avatarUrl ? (
                        <img 
                          src={organization.avatarUrl} 
                          alt={organization.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                      )}
                    </div>
                    {/* Hover Overlay */}
                    <div 
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => {
                        if (!uploadingAvatar && !deletingAvatar && !updatingDefaultAvatar) {
                          setAvatarModalOpen(true)
                        }
                      }}
                    >
                      <Edit className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 overflow-hidden flex-shrink-0">
                    {organization.avatarUrl ? (
                      <img 
                        src={organization.avatarUrl} 
                        alt={organization.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 sm:mb-2 truncate">{organization.name}</h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 line-clamp-2">{organization.description || 'Açıklama yok'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  organization.owner.plan === 'PREMIUM'
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-white/20 text-white backdrop-blur-sm'
                }`}>
                  {organization.owner.plan === 'PREMIUM' ? (
                    <>
                      <Star className="w-4 h-4 fill-yellow-900" />
                      Premium Plan
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Free Plan
                    </>
                  )}
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {organization?._count?.members || 0} üye
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  {organization?.matches?.length || 0} maç
                </span>
              </div>
            </div>
            {/* Action Buttons - Hero Section */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              {/* Premium Upgrade Button - Owner Only */}
              {isOwner && organization.owner.plan === 'FREE' && (
                <Link href="/payment">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-xl text-white border-2 border-white/30 backdrop-blur-sm flex items-center gap-2 px-6 py-6 text-lg font-bold w-full"
                  >
                    <Gem className="w-6 h-6" />
                    Premium'a Geç
                  </Button>
                </Link>
              )}
              {isOwner && organization.owner.plan === 'PREMIUM' && (
                <Link href="/payment">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-xl text-yellow-900 border-2 border-white/30 backdrop-blur-sm flex items-center gap-2 px-6 py-6 text-lg font-bold w-full"
                  >
                    <Star className="w-6 h-6 fill-yellow-900" />
                    Premium Aktif
                  </Button>
                </Link>
              )}
              {/* Pending Request Button */}
              {hasPendingRequest && !isMember && !isOwner && (
                <Button 
                  onClick={() => setShowCancelRequestModal(true)} 
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-xl text-white border-2 border-white/30 backdrop-blur-sm flex items-center gap-2 px-6 py-6 text-lg font-bold w-full"
                >
                  <Loader2 className="w-6 h-6 animate-spin" />
                  İstek Gönderildi - Yanıt Bekleniyor
                </Button>
              )}
              {/* Join Button - Player Only (No pending request) */}
              {!hasPendingRequest && !isMember && !isOwner && (
                <Button 
                  onClick={handleJoin} 
                  size="lg"
                  disabled={joiningRequest}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl text-white border-2 border-white/30 backdrop-blur-sm flex items-center gap-2 px-6 py-6 text-lg font-bold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joiningRequest ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      İstek Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Circle className="w-6 h-6" />
                      Organizasyona Katıl
                    </>
                  )}
                </Button>
              )}
              {/* Leave Button - Member Only */}
              {isMember && !isOwner && (
                <Button 
                  onClick={() => setShowLeaveModal(true)} 
                  variant="destructive" 
                  size="lg"
                  className="shadow-xl border-2 border-white/30 backdrop-blur-sm w-full"
                >
                  Organizasyondan Ayrıl
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Tesis Ekleme Formu */}
        {isOwner && showFacilityForm && (
          <Card ref={facilityFormRef} className="mb-6 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Yeni Tesis Ekle
              </CardTitle>
              <CardDescription>
                Organizasyonunuz için yeni bir futbol tesisi ekleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFacility} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName" className="text-base font-semibold">
                    Tesis Adı <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="facilityName"
                    type="text"
                    placeholder="Örn: Merkez Futbol Sahası"
                    value={facilityForm.name}
                    onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                    required
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityLocation" className="text-base font-semibold">
                    Konum (Google Maps Embed HTML) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="facilityLocation"
                    type="text"
                    placeholder='<iframe src="https://www.google.com/maps/embed?pb'
                    value={facilityForm.location}
                    onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })}
                    required
                    className="text-base"
                  />
                  
                  {/* Maç Ücreti */}
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="facilityMatchPrice" className="text-base font-semibold">
                      Maç Ücreti (TL)
                    </Label>
                    <Input
                      id="facilityMatchPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Örn: 500"
                      value={facilityForm.matchPrice}
                      onChange={(e) => setFacilityForm({ ...facilityForm, matchPrice: e.target.value })}
                      className="text-base"
                    />
                  </div>

                  {/* Açık/Kapalı Saha */}
                  <div className="space-y-2 mt-4">
                    <Label className="text-base font-semibold">
                      Saha Tipi
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFacilityForm({ ...facilityForm, isIndoor: false })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          facilityForm.isIndoor === false
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            facilityForm.isIndoor === false
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {facilityForm.isIndoor === false && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className={`font-medium ${
                            facilityForm.isIndoor === false ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            Açık Saha
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFacilityForm({ ...facilityForm, isIndoor: true })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          facilityForm.isIndoor === true
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            facilityForm.isIndoor === true
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {facilityForm.isIndoor === true && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className={`font-medium ${
                            facilityForm.isIndoor === true ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            Kapalı Saha
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Çim Tipi */}
                  <div className="space-y-2 mt-4">
                    <Label className="text-base font-semibold">
                      Çim Tipi
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFacilityForm({ ...facilityForm, fieldType: 'REAL_GRASS' })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          facilityForm.fieldType === 'REAL_GRASS'
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            facilityForm.fieldType === 'REAL_GRASS'
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}>
                            {facilityForm.fieldType === 'REAL_GRASS' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className={`font-medium ${
                            facilityForm.fieldType === 'REAL_GRASS' ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            Gerçek Çim
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFacilityForm({ ...facilityForm, fieldType: 'SYNTHETIC_GRASS' })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          facilityForm.fieldType === 'SYNTHETIC_GRASS'
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            facilityForm.fieldType === 'SYNTHETIC_GRASS'
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}>
                            {facilityForm.fieldType === 'SYNTHETIC_GRASS' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className={`font-medium ${
                            facilityForm.fieldType === 'SYNTHETIC_GRASS' ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            Sentetik Çim
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Görsel Talimatlar */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Konum Nasıl Eklenir</h3>
                    <div className="grid grid-cols-2 gap-4">
                    {/* İlk Adım */}
                    <div className="space-y-2">
                      <div 
                        className="relative cursor-pointer group"
                        onClick={() => setExpandedImage('step1')}
                      >
                        <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-all group-hover:scale-105 flex items-center justify-center relative overflow-hidden">
                          <img 
                            src="/images/google-maps-share-step1.png" 
                            alt="Google Maps Paylaş Adımı"
                            className="absolute inset-0 w-full h-full object-cover brightness-75"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 z-[5]"></div>
                          <div className="text-center z-10 relative">
                            <div className="mb-1 flex justify-center">
                              <Phone className="w-8 h-8 text-white drop-shadow-lg" />
                            </div>
                            <p className="text-xs font-semibold text-white drop-shadow-lg">Adım 1</p>
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all flex items-center justify-center z-20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 font-medium text-center">
                        1. Google Maps üzerinde tesis konumunu açın, <strong>"Paylaş"</strong> butonuna tıklayın
                      </p>
                    </div>
                    
                    {/* İkinci Adım */}
                    <div className="space-y-2">
                      <div 
                        className="relative cursor-pointer group"
                        onClick={() => setExpandedImage('step2')}
                      >
                        <div className="w-full h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border-2 border-gray-300 hover:border-green-500 transition-all group-hover:scale-105 flex items-center justify-center relative overflow-hidden">
                          <img 
                            src="/images/google-maps-share-step2.png" 
                            alt="Google Maps Embed Adımı"
                            className="absolute inset-0 w-full h-full object-cover brightness-75"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 z-[5]"></div>
                          <div className="text-center z-10 relative">
                            <div className="mb-1 flex justify-center">
                              <FileText className="w-8 h-8 text-white drop-shadow-lg" />
                            </div>
                            <p className="text-xs font-semibold text-white drop-shadow-lg">Adım 2</p>
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all flex items-center justify-center z-20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 font-medium text-center">
                        2. Açılan modalda <strong>"Harita yerleştirme"</strong> seçeneğini seçip <strong>"HTML'Yİ KOPYALA"</strong> butonuna tıklayın ve kopyalanan değeri inputa yapıştırın
                      </p>
                    </div>
                    </div>
                  </div>
                </div>
                
                {/* Tam Ekran Görsel Modal */}
                {expandedImage && (
                  <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setExpandedImage(null)}
                  >
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                      <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                      <div className="bg-white rounded-lg p-4">
                        <img 
                          src={expandedImage === 'step1' ? '/images/google-maps-share-step1.png' : '/images/google-maps-share-step2.png'}
                          alt={expandedImage === 'step1' ? 'Google Maps Paylaş Adımı' : 'Google Maps Embed Adımı'}
                          className="w-full h-auto rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const errorDiv = document.createElement('div')
                            errorDiv.className = 'w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center'
                            errorDiv.innerHTML = '<div class="text-center"><div class="mb-2 flex justify-center"><svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div><p class="text-gray-600">Görsel yüklenemedi</p><p class="text-sm text-gray-500 mt-2">Görseli public/images/ klasörüne ekleyin</p></div>'
                            e.currentTarget.parentElement?.appendChild(errorDiv)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={facilityLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2"
                  >
                    {facilityLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Ekleniyor...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Tesis Ekle
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowFacilityForm(false)
                      setFacilityForm({ 
                        name: '', 
                        location: '', 
                        matchPrice: '',
                        isIndoor: null,
                        fieldType: null,
                      })
                    }}
                  >
                    İptal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Aktif Üyeler</p>
                  <p className="text-4xl font-black text-green-600">
                    {organization?.owner?.plan === 'PREMIUM' 
                      ? approvedMembers.length
                      : `${approvedMembers.length}/14`}
                  </p>
                </div>
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Toplam Maç</p>
                  <p className="text-4xl font-black text-blue-600">{organization?.matches?.length || 0}</p>
                </div>
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                  <Circle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {isOwner && (
            <Card className={`border-2 ${pendingMembers.length > 0 ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'} hover:shadow-lg transition-shadow`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Bekleyen İstekler</p>
                    <p className={`text-4xl font-black ${pendingMembers.length > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {pendingMembers.length}
                    </p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${pendingMembers.length > 0 ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                    <Loader2 className={`w-8 h-8 ${pendingMembers.length > 0 ? 'text-yellow-600 animate-spin' : 'text-gray-600'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isOwner && (
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Yönetici</p>
                    <p className="text-lg font-black text-purple-600 truncate">{organization.owner.name}</p>
                  </div>
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {organization.owner.avatarUrl ? (
                      <img 
                        src={organization.owner.avatarUrl} 
                        alt={organization.owner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Crown className="w-8 h-8 text-purple-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bekleyen Katılım İstekleri - Sadece yönetici görür */}
        {isOwner && pendingMembers.length > 0 && (
          <Card className="mb-6 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-yellow-100/50 transition-colors"
              onClick={() => setPendingRequestsExpanded(!pendingRequestsExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" />
                  <CardTitle className="text-2xl">
                    Bekleyen Katılım İstekleri ({pendingMembers.length})
                  </CardTitle>
                </div>
                <button
                  className="p-2 hover:bg-yellow-200/50 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPendingRequestsExpanded(!pendingRequestsExpanded)
                  }}
                >
                  {pendingRequestsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-yellow-700" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-yellow-700" />
                  )}
                </button>
              </div>
              <CardDescription className="text-base">
                Organizasyonunuza katılmak isteyen oyuncuların isteklerini onaylayın veya reddedin
              </CardDescription>
            </CardHeader>
            {pendingRequestsExpanded && (
              <CardContent className="animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-3">
                {pendingMembers.map((member) => {
                  const isExpanded = expandedMembers.has(member.id)
                  return (
                    <div
                      key={member.id}
                      className="border-2 border-yellow-200 rounded-lg bg-white hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Collapse Header - Always Visible */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleMemberExpanded(member.id)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0">
                            {member.user.avatarUrl ? (
                              <img 
                                src={member.user.avatarUrl} 
                                alt={member.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              member.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-lg">{member.user.name}</p>
                            <p className="text-sm text-gray-600 truncate">{member.user.email}</p>
                            <p className="text-xs text-yellow-600 mt-1 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(member.createdAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })} tarihinde istek gönderdi
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApproveMember(member.id)
                            }}
                            disabled={processingMemberId !== null}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingMemberId === member.id && processingAction === 'approve' ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Onaylanıyor...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Onayla
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRejectMember(member.id)
                            }}
                            disabled={processingMemberId !== null}
                            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingMemberId === member.id && processingAction === 'reject' ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Reddediliyor...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                Reddet
                              </>
                            )}
                          </Button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleMemberExpanded(member.id)
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Collapse Content - Expandable */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-yellow-100 animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {/* Telefon */}
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                {member.user.showPhone && member.user.phone 
                                  ? member.user.phone 
                                  : 'Belirtilmedi'}
                              </span>
                            </div>
                            
                            {/* Mevki */}
                            <div className="flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                {member.user.showPosition && member.user.position
                                  ? member.user.position
                                  : 'Belirtilmedi'}
                              </span>
                            </div>
                            
                            {/* Güçlü Ayak */}
                            <div className="flex items-center gap-1.5">
                              <Footprints className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                {member.user.showStrongFoot && member.user.strongFoot
                                  ? member.user.strongFoot
                                  : 'Belirtilmedi'}
                              </span>
                            </div>
                            
                            {/* Boy */}
                            <div className="flex items-center gap-1.5">
                              <Ruler className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                {member.user.showHeight && member.user.height
                                  ? `${member.user.height} cm`
                                  : 'Belirtilmedi'}
                              </span>
                            </div>
                            
                            {/* Kilo */}
                            <div className="flex items-center gap-1.5">
                              <Weight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                {member.user.showWeight && member.user.weight
                                  ? `${member.user.weight} kg`
                                  : 'Belirtilmedi'}
                              </span>
                            </div>
                            
                            {/* Yaş */}
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">
                                {member.user.showAge && member.user.age
                                  ? `${member.user.age} yaş`
                                  : 'Belirtilmedi'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
            )}
          </Card>
        )}

        {/* Onaylanmış Üyeler */}
        {approvedMembers.length > 0 && (
          <Card className="mb-6 border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-6 h-6 text-green-600" />
                Organizasyon Üyeleri ({approvedMembers.length})
              </CardTitle>
              <CardDescription className="text-base">
                {isOwner 
                  ? 'Organizasyonunuzun aktif üyeleri'
                  : 'Bu organizasyonun aktif üyeleri'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Carousel */}
              <div className="hidden md:block relative">
                {approvedMembers.length > itemsPerPageDesktop && (
                  <>
                    <button
                      onClick={handleMemberPrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={handleMemberNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ 
                      width: `${totalPagesDesktop * 100}%`,
                      transform: `translateX(-${currentMemberIndex * (100 / totalPagesDesktop)}%)`
                    }}
                  >
                    {Array.from({ length: totalPagesDesktop }).map((_, pageIndex) => (
                      <div key={pageIndex} className="flex-shrink-0 flex" style={{ width: `${100 / totalPagesDesktop}%` }}>
                        {approvedMembers.slice(pageIndex * itemsPerPageDesktop, (pageIndex + 1) * itemsPerPageDesktop).map((member) => (
                          <div key={member.id} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsPerPageDesktop}%` }}>
                            <Link
                              href={`/players/${member.user.id}`}
                              className="flex items-center gap-3 p-4 border-2 rounded-lg hover:border-green-400 hover:shadow-md transition-all bg-white cursor-pointer"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                                {member.user.avatarUrl ? (
                                  <img 
                                    src={member.user.avatarUrl} 
                                    alt={member.user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  member.user.name.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{member.user.name}</p>
                                <p className="text-xs text-gray-600 truncate">{member.user.email}</p>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Carousel */}
              <div 
                className="md:hidden relative"
                ref={memberCarouselRef}
                onTouchStart={handleMemberTouchStart}
                onTouchMove={handleMemberTouchMove}
                onTouchEnd={handleMemberTouchEnd}
              >
                {approvedMembers.length > 1 && (
                  <>
                    <button
                      onClick={handleMemberPrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={handleMemberNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ 
                      transform: `translateX(-${currentMemberIndex * (approvedMembers.length === 1 ? 0 : 66.666)}%)` 
                    }}
                  >
                    {approvedMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className={`flex-shrink-0 ${approvedMembers.length === 1 ? 'w-full' : 'w-2/3'} px-2`}
                      >
                        <Link
                          href={`/players/${member.user.id}`}
                          className="flex items-center gap-3 p-4 border-2 rounded-lg hover:border-green-400 hover:shadow-md transition-all bg-white cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                            {member.user.avatarUrl ? (
                              <img 
                                src={member.user.avatarUrl} 
                                alt={member.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              member.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{member.user.name}</p>
                            <p className="text-xs text-gray-600 truncate">{member.user.email}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Maçlar ve Tesisler - Desktop'ta yan yana */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
          {/* Maçlar */}
          <Card className="border-2 hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Circle className="w-6 h-6 text-green-600" />
                    Maçlar ({organization?.matches?.length || 0})
                  </CardTitle>
                  <CardDescription className="text-base">
                    Organizasyonun maç geçmişi ve yaklaşan maçlar
                  </CardDescription>
                </div>
                {isOwner && (
                  <Link href={`/match/new?organizationId=${organization.id}`}>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      + Yeni Maç
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {(organization?.matches?.length || 0) === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4 flex justify-center">
                    <Circle className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz maç oluşturulmamış</h3>
                  <p className="text-gray-600 mb-6">
                    {isOwner 
                      ? 'İlk maçınızı oluşturarak başlayın'
                      : 'Bu organizasyonda henüz maç bulunmuyor'}
                  </p>
                  {isOwner && (
                    <Link href={`/match/new?organizationId=${organization.id}`}>
                      <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        İlk Maçı Oluştur
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="relative">
                  {/* 3D Carousel Container */}
                  <div 
                    ref={matchCarouselRef}
                    className="relative h-[500px] overflow-hidden"
                    onTouchStart={handleMatchTouchStart}
                    onTouchMove={handleMatchTouchMove}
                    onTouchEnd={handleMatchTouchEnd}
                    style={{ perspective: '1000px' }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      {(organization?.matches || []).map((match, index) => {
                        // Circular offset calculation
                        let offset = index - currentMatchIndex
                        
                        // Normalize offset for circular carousel (wrap around)
                        const total = organization?.matches?.length || 0
                        if (offset > total / 2) {
                          offset = offset - total
                        } else if (offset < -total / 2) {
                          offset = offset + total
                        }
                        
                        const isActive = offset === 0
                        const absOffset = Math.abs(offset)
                        
                        // Calculate position and scale based on circular offset
                        let translateX = 0
                        let translateZ = 0
                        let scale = 0.6
                        let opacity = 0.3
                        
                        if (isActive) {
                          translateX = 0
                          translateZ = 0
                          scale = 1
                          opacity = 1
                        } else if (offset < 0) {
                          // Left side
                          translateX = -200
                          translateZ = -100
                          scale = 0.6
                          opacity = 0.3
                        } else if (offset > 0) {
                          // Right side
                          translateX = 200
                          translateZ = -100
                          scale = 0.6
                          opacity = 0.3
                        }
                        
                        // Special handling for circular edges
                        if (total > 1) {
                          if (currentMatchIndex === 0 && index === total - 1) {
                            translateX = -200
                            translateZ = -100
                            scale = 0.6
                            opacity = 0.3
                          }
                          if (currentMatchIndex === total - 1 && index === 0) {
                            translateX = 200
                            translateZ = -100
                            scale = 0.6
                            opacity = 0.3
                          }
                        }
                        
                        return (
                          <div
                            key={match.id}
                            className="absolute transition-all duration-500 ease-in-out cursor-pointer"
                            style={{
                              transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                              opacity: opacity,
                              zIndex: isActive ? 10 : 5 - Math.abs(offset),
                              pointerEvents: isActive ? 'auto' : 'none',
                            }}
                            onClick={() => isActive && router.push(`/match/${match.id}`)}
                          >
                            <Link href={`/match/${match.id}`}>
                              <Card className="w-[350px] border-2 border-green-200 bg-white hover:border-green-400 hover:shadow-xl transition-all">
                                <CardContent className="p-0">
                                  {/* Match Image */}
                                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                    <img 
                                      src="/images/facility.png" 
                                      alt="Maç"
                                      className="w-full h-full object-cover"
                                    />
                                    {/* Pending Attendance Badge */}
                                    {match.hasPendingAttendance && (
                                      <div className="absolute top-2 left-2 z-20">
                                        <div className="relative">
                                          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                                          <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border-2 border-white animate-pulse">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">Cevap Bekleniyor</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                        match.status === 'FINISHED' 
                                          ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                                          : match.status === 'UPCOMING' 
                                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                          : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                      }`}>
                                        {match.status === 'FINISHED' ? (
                                          <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            Oynandı
                                          </>
                                        ) : match.status === 'UPCOMING' ? (
                                          <>
                                            <Calendar className="w-3 h-3" />
                                            Kadrolar hazır
                                          </>
                                        ) : match.status === 'DRAFT' ? (
                                          <>
                                            <FileText className="w-3 h-3" />
                                            Kadro kuruluyor
                                          </>
                                        ) : match.status === 'PUBLISHED' ? (
                                          <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            Tamamlandı
                                          </>
                                        ) : (
                                          match.status
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Match Info */}
                                  <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                      <h3 className="font-bold text-xl text-gray-900">
                                        {new Date(match.date).toLocaleDateString('tr-TR', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                        })}
                                      </h3>
                                      <Circle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {match.time}
                                      </p>
                                      {match.venue && (
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                          <MapPin className="w-4 h-4" />
                                          {match.venue}
                                        </p>
                                      )}
                                      <div className="pt-2">
                                        <Button 
                                          variant="outline" 
                                          className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold"
                                        >
                                          Detayı Gör
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Navigation Arrows */}
                  {(organization?.matches?.length || 0) > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevMatch}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:bg-gray-50 hover:scale-110 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextMatch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:bg-gray-50 hover:scale-110 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                  
                  {/* Dots Indicator */}
                  {(organization?.matches?.length || 0) > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {(organization?.matches || []).map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentMatchIndex
                              ? 'bg-green-600 w-8'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          onClick={() => setCurrentMatchIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tesisler Listesi */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg h-full flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  Futbol Tesisleri ({facilities.length})
                </CardTitle>
                <CardDescription className="text-base">
                  Organizasyonunuzun kayıtlı futbol tesisleri
                </CardDescription>
              </div>
              {isOwner && (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => {
                    setShowFacilityForm(true)
                    setTimeout(() => {
                      if (facilityFormRef.current) {
                        const headerOffset = 150 // Navbar + padding için offset
                        const elementPosition = facilityFormRef.current.getBoundingClientRect().top
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        })
                      }
                    }, 100)
                  }}
                >
                  + Yeni Tesis
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {facilities.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4 flex justify-center">
                  <Building2 className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz tesis eklenmemiş</h3>
                <p className="text-gray-600 mb-6">
                  {isOwner 
                    ? 'İlk tesisinizi ekleyerek başlayın'
                    : 'Bu organizasyonda henüz tesis bulunmuyor'}
                </p>
                {isOwner && (
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => {
                      setShowFacilityForm(true)
                      setTimeout(() => {
                        if (facilityFormRef.current) {
                          const headerOffset = 100 // Navbar + padding için offset
                          const elementPosition = facilityFormRef.current.getBoundingClientRect().top
                          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          })
                        }
                      }, 100)
                    }}
                  >
                    İlk Tesisini Ekle
                  </Button>
                )}
              </div>
            ) : (
              <div className="relative">
                {/* 3D Carousel Container */}
                <div 
                  ref={carouselRef}
                  className="relative h-[500px] overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{ perspective: '1000px' }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {facilities.length > 0 && facilities.map((facility, index) => {
                      // Circular offset calculation
                      let offset = index - currentFacilityIndex
                      
                      // Normalize offset for circular carousel (wrap around)
                      const total = facilities.length
                      if (offset > total / 2) {
                        offset = offset - total
                      } else if (offset < -total / 2) {
                        offset = offset + total
                      }
                      
                      const isActive = offset === 0
                      const absOffset = Math.abs(offset)
                      
                      // Calculate position and scale based on circular offset
                      let translateX = 0
                      let translateZ = 0
                      let scale = 0.6
                      let opacity = 0.3
                      
                      if (isActive) {
                        translateX = 0
                        translateZ = 0
                        scale = 1
                        opacity = 1
                      } else if (offset < 0) {
                        // Left side - previous facilities (circular: last facility appears on left of first)
                        translateX = -200
                        translateZ = -100
                        scale = 0.6
                        opacity = 0.3
                      } else if (offset > 0) {
                        // Right side - next facilities (circular: first facility appears on right of last)
                        translateX = 200
                        translateZ = -100
                        scale = 0.6
                        opacity = 0.3
                      }
                      
                      // Special handling for circular edges
                      if (total > 1) {
                        // When on first item, show last item on the left
                        if (currentFacilityIndex === 0 && index === total - 1) {
                          translateX = -200
                          translateZ = -100
                          scale = 0.6
                          opacity = 0.3
                        }
                        // When on last item, show first item on the right
                        if (currentFacilityIndex === total - 1 && index === 0) {
                          translateX = 200
                          translateZ = -100
                          scale = 0.6
                          opacity = 0.3
                        }
                      }
                      
                      return (
                        <div
                          key={facility.id}
                          className="absolute transition-all duration-500 ease-in-out cursor-pointer"
                          style={{
                            transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                            opacity: opacity,
                            zIndex: isActive ? 10 : 5 - Math.abs(offset),
                            pointerEvents: isActive ? 'auto' : 'none',
                          }}
                          onClick={() => isActive && router.push(`/facilities/${facility.id}`)}
                        >
                          <Link href={`/facilities/${facility.id}`}>
                            <Card className="w-[350px] border-2 border-blue-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all">
                              <CardContent className="p-0">
                                {/* Facility Image */}
                                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                  <img 
                                    src="/images/facility.png" 
                                    alt={facility.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Indoor/Outdoor Badge */}
                                  <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                      facility.isIndoor === true
                                        ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                                        : facility.isIndoor === false
                                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                        : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                    }`}>
                                      <Home className="w-3 h-3" />
                                      {facility.isIndoor === true 
                                        ? 'Kapalı Saha' 
                                        : facility.isIndoor === false 
                                        ? 'Açık Saha' 
                                        : 'Belirtilmedi'}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Facility Info */}
                                <div className="p-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-xl text-gray-900">{facility.name}</h3>
                                    <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(facility.createdAt).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <Home className="w-4 h-4" />
                                      Saha Tipi: {facility.isIndoor === true 
                                        ? 'Kapalı Saha' 
                                        : facility.isIndoor === false 
                                        ? 'Açık Saha' 
                                        : 'Belirtilmedi'}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <DollarSign className="w-4 h-4" />
                                      Maç Ücreti: {facility.matchPrice 
                                        ? `${facility.matchPrice.toFixed(2)} TL` 
                                        : 'Belirtilmedi'}
                                    </p>
                                    <div className="pt-2">
                                      <Button 
                                        variant="outline" 
                                        className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
                                      >
                                        Detayı Gör
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                {facilities.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border-2 shadow-lg"
                      onClick={handlePrevFacility}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border-2 shadow-lg"
                      onClick={handleNextFacility}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
                
                {/* Dots Indicator */}
                {facilities.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {facilities.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentFacilityIndex
                            ? 'bg-blue-600 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => setCurrentFacilityIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Yönetici Bilgileri */}
        <Card className="mt-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Yönetici Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                {organization.owner.avatarUrl ? (
                  <img 
                    src={organization.owner.avatarUrl} 
                    alt={organization.owner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  organization.owner.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{organization.owner.name}</p>
                <p className="text-sm text-gray-600">{organization.owner.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Plan: <span className={`font-semibold ${organization.owner.plan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {organization.owner.plan}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Selection Modal */}
      {/* Cancel Request Modal */}
      <Dialog 
        open={showCancelRequestModal} 
        onOpenChange={(open) => {
          if (!open && !cancelingRequest) {
            setShowCancelRequestModal(false)
          }
        }}
      >
        <DialogContent className="relative">
          {cancelingRequest && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-yellow-600 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-medium">
                  İstek iptal ediliyor...
                </p>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>İsteği İptal Et</DialogTitle>
            <DialogDescription>
              Bu organizasyona gönderdiğiniz katılım isteğini geri çekmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelRequestModal(false)}
              disabled={cancelingRequest}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              İptal
            </Button>
            <Button
              onClick={handleCancelRequest}
              disabled={cancelingRequest}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelingRequest ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  İptal Ediliyor...
                </>
              ) : (
                'İsteği İptal Et'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Organization Modal */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Organizasyondan Ayrıl</DialogTitle>
            <DialogDescription>
              Bu organizasyondan ayrılmak istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveModal(false)}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              İptal
            </Button>
            <Button
              onClick={handleLeave}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              Ayrıl
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isOwner && (
        <>
          <Dialog 
            open={avatarModalOpen} 
            onOpenChange={(open) => {
              if (!open && (deletingAvatar || uploadingAvatar || updatingDefaultAvatar)) return
              setAvatarModalOpen(open)
            }}
            disabled={deletingAvatar || uploadingAvatar || updatingDefaultAvatar}
          >
            <DialogContent className="max-w-md relative">
              {(deletingAvatar || uploadingAvatar || updatingDefaultAvatar) && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-700 font-medium">
                      {updatingDefaultAvatar ? 'Logo güncelleniyor...' : deletingAvatar ? 'Logo kaldırılıyor...' : 'Logo yükleniyor...'}
                    </p>
                  </div>
                </div>
              )}
              <DialogHeader>
                <DialogTitle>Organizasyon Logosu Düzenle</DialogTitle>
                <DialogDescription>
                  Organizasyon logosunu değiştirebilir veya kaldırabilirsiniz
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-4">
                {/* Mevcut Görsel */}
                {organization?.avatarUrl && (
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      <img 
                        src={organization.avatarUrl} 
                        alt={organization.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {/* Hazır Logolar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Hazır Logolar</h3>
                  <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                    {DEFAULT_AVATARS.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDefaultAvatarSelect(url)}
                        disabled={deletingAvatar || uploadingAvatar || updatingDefaultAvatar}
                        className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                          deletingAvatar || uploadingAvatar || updatingDefaultAvatar
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-105 cursor-pointer'
                        } ${
                          organization?.avatarUrl === url
                            ? 'border-green-500 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={`Default avatar ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Seçenekler */}
                <div className="space-y-3">
                  {organization?.avatarUrl ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                        onClick={async () => {
                          if (deletingAvatar) return // Prevent double click
                          setDeletingAvatar(true)
                          try {
                            const res = await fetch(`/api/organizations/${params.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({ avatarUrl: '' }),
                            })
                            
                            if (res.ok) {
                              const data = await res.json()
                              if (data.organization) {
                                setOrganization(data.organization)
                                showToast('Organizasyon logosu kaldırıldı', 'success')
                                setAvatarModalOpen(false)
                              } else {
                                // API başarılı ama data format beklenen gibi değil, yeniden fetch et
                                await fetchOrganization()
                                showToast('Organizasyon logosu kaldırıldı', 'success')
                                setAvatarModalOpen(false)
                              }
                            } else {
                              let errorMessage = 'Logo kaldırılırken bir hata oluştu'
                              try {
                                const errorData = await res.json()
                                errorMessage = errorData.error || errorMessage
                              } catch (e) {
                                // JSON parse hatası, default mesaj kullan
                              }
                              showToast(errorMessage, 'error')
                            }
                          } catch (error) {
                            console.error('Error deleting avatar:', error)
                            // Hata olsa bile organizasyonu yeniden fetch et
                            await fetchOrganization()
                            showToast('Organizasyon logosu kaldırıldı', 'success')
                            setAvatarModalOpen(false)
                          } finally {
                            setDeletingAvatar(false)
                          }
                        }}
                        disabled={deletingAvatar || uploadingAvatar || updatingDefaultAvatar}
                      >
                        {deletingAvatar ? (
                          <>
                            <Circle className="w-4 h-4 animate-spin mr-2" />
                            Kaldırılıyor...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Logoyu Kaldır
                          </>
                        )}
                      </Button>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => {
                            document.getElementById('avatar-upload-modal')?.click()
                          }}
                          disabled={deletingAvatar || uploadingAvatar || updatingDefaultAvatar || organization?.owner.plan !== 'PREMIUM'}
                        >
                          {organization?.owner.plan === 'PREMIUM' ? (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Yeni Logo Ekle
                            </>
                          ) : (
                            <>
                              <Gem className="w-4 h-4 mr-2" />
                              Premium Gerekli
                            </>
                          )}
                        </Button>
                        {organization?.owner.plan !== 'PREMIUM' && (
                          <p className="text-xs text-gray-500 text-center">
                            Kendi logonu yükle
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          document.getElementById('avatar-upload-modal')?.click()
                        }}
                        disabled={deletingAvatar || uploadingAvatar || updatingDefaultAvatar || organization?.owner.plan !== 'PREMIUM'}
                      >
                        {organization?.owner.plan === 'PREMIUM' ? (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Logo Ekle
                          </>
                        ) : (
                          <>
                            <Gem className="w-4 h-4 mr-2" />
                            Premium Gerekli
                          </>
                        )}
                      </Button>
                      {organization?.owner.plan !== 'PREMIUM' && (
                        <p className="text-xs text-gray-500 text-center">
                          Kendi logonu yükle
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload-modal"
                  className="hidden"
                  disabled={deletingAvatar || uploadingAvatar || updatingDefaultAvatar || organization?.owner.plan !== 'PREMIUM'}
                  onChange={(e) => {
                    if (deletingAvatar || uploadingAvatar || updatingDefaultAvatar) return
                    const file = e.target.files?.[0]
                    if (file) {
                      setAvatarModalOpen(false)
                      handleFileSelect(file)
                    }
                    e.target.value = ''
                  }}
                />
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setAvatarModalOpen(false)}
                  disabled={deletingAvatar || uploadingAvatar || updatingDefaultAvatar}
                >
                  İptal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Crop Modal */}
          <Dialog 
            open={showCropModal} 
            onOpenChange={(open) => {
              if (!open && uploadingAvatar) return
              setShowCropModal(open)
            }}
            disabled={uploadingAvatar}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Organizasyon Logosunu Kırp</DialogTitle>
                <DialogDescription>
                  Görseli istediğiniz şekilde kırpın ve onaylayın
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-4">
                {imageSrc && (
                  <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={uploadingAvatar ? undefined : setCrop}
                      onZoomChange={uploadingAvatar ? undefined : setZoom}
                      onCropComplete={onCropComplete}
                      cropShape="round"
                      showGrid={false}
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                          <p className="text-white text-sm">Yükleniyor...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Zoom Control */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Yakınlaştır</Label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    disabled={uploadingAvatar}
                    className="w-full"
                  />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (uploadingAvatar) return
                    setShowCropModal(false)
                    setImageSrc(null)
                    setSelectedFile(null)
                  }}
                  disabled={uploadingAvatar}
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </Button>
                <Button
                  onClick={handleCropComplete}
                  disabled={uploadingAvatar || !croppedAreaPixels}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Onayla
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
