import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { RotateCw, Volume2, VolumeX, Wind } from 'lucide-react'
import { AccountPage, AdminPage, RegisterPage, UserLoginPage } from './Admin'
import { AboutPage, ContactPage, ProfilePage, ProjectsPage, ServicesPage, SiteNavigation } from './HomeSections'
import { getPortfolio } from './api'
import './App.css'

const VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/175fbbcd-e50a-480c-bab2-ca16d4678322.mp4'
const POSTER_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/726b168c-da47-4682-a255-cc3e02f89bae.jpg'
const REVEAL_DURATION = 2100
const EASE_PILL_WIDE = 'cubic-bezier(.5,0,.3,1)'
const EASE_PILL_CIRCLE = 'cubic-bezier(.45,0,.3,1)'
const EASE_PILL_FINAL = 'cubic-bezier(.4,0,.2,1)'
const EASE_UI = 'cubic-bezier(.2,.8,.2,1)'

function makeRevealKeyframes(isMobile) {
  const startingWidth = isMobile ? '1.81em' : '0.012em'
  const startingHeight = isMobile ? '1.5px' : '1.81em'
  const finalHeight = '1.81em'

  return [
    {
      offset: 0,
      '--pill-width': startingWidth,
      '--pill-height': startingHeight,
      '--pill-clip-y': isMobile ? '0%' : '50%',
      '--pill-clip-x': isMobile ? '50%' : '0%',
      '--hairline-opacity': '1',
      '--word-gap': isMobile ? '0.03em' : '0.026em',
      '--paper-opacity': '0',
      '--nav-offset': '-140%',
      '--footer-offset': '160%',
      '--rule-scale': '0',
      '--icon-opacity': '0',
    },
    {
      offset: 0.14,
      '--pill-width': startingWidth,
      '--pill-height': startingHeight,
      '--pill-clip-y': '0%',
      '--pill-clip-x': '0%',
      '--hairline-opacity': '1',
      '--word-gap': isMobile ? '0.03em' : '0.026em',
      easing: EASE_PILL_WIDE,
    },
    {
      offset: 0.3,
      '--pill-width': isMobile ? '1.81em' : '0.16em',
      '--pill-height': isMobile ? 'calc(1.81em * 0.1)' : '1.81em',
      '--hairline-opacity': '0',
      easing: EASE_PILL_CIRCLE,
    },
    { offset: 0.4, '--rule-scale': '0' },
    { offset: 0.45, '--paper-opacity': '0' },
    { offset: 0.5, '--nav-offset': '-140%' },
    { offset: 0.52, '--footer-offset': '160%' },
    {
      offset: 0.58,
      '--pill-width': '1.81em',
      '--pill-height': isMobile ? 'calc(1.81em * 0.55)' : '1.81em',
      '--word-gap': isMobile ? '0.06em' : '0.05em',
      easing: EASE_PILL_FINAL,
    },
    { offset: 0.78, '--paper-opacity': '1' },
    { offset: 0.8, '--icon-opacity': '0' },
    { offset: 0.86, '--nav-offset': '0%', easing: EASE_UI },
    { offset: 0.9, '--footer-offset': '0%', easing: EASE_UI },
    { offset: 0.95, '--rule-scale': '1' },
    {
      offset: 1,
      '--pill-width': '1.81em',
      '--pill-height': finalHeight,
      '--pill-clip-y': '0%',
      '--pill-clip-x': '0%',
      '--hairline-opacity': '0',
      '--word-gap': isMobile ? '0.1em' : '0.085em',
      '--paper-opacity': '1',
      '--nav-offset': '0%',
      '--footer-offset': '0%',
      '--rule-scale': '1',
      '--icon-opacity': '1',
    },
  ]
}

function applyFinalState(scene, isMobile) {
  const finalValues = {
    '--pill-width': '1.81em',
    '--pill-height': '1.81em',
    '--pill-clip-y': '0%',
    '--pill-clip-x': '0%',
    '--hairline-opacity': '0',
    '--word-gap': isMobile ? '0.1em' : '0.085em',
    '--paper-opacity': '1',
    '--nav-offset': '0%',
    '--footer-offset': '0%',
    '--rule-scale': '1',
    '--icon-opacity': '1',
  }

  Object.entries(finalValues).forEach(([property, value]) => {
    scene.style.setProperty(property, value)
  })
}

function PaperLines() {
  return (
    <svg className="paper-lines" viewBox="0 0 1440 960" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-90 880C170 790 120 580 390 580S680 900 930 730 1190 330 1540 190" />
      <path d="M-80 820C180 730 150 530 410 540S690 850 950 680 1210 290 1530 140" />
      <path d="M-70 760C200 680 180 480 430 500S710 790 970 630 1230 250 1520 90" />
      <path d="M-50 700C220 620 200 440 450 460S730 730 990 580 1250 210 1510 40" />
      <path d="M-30 640C240 560 220 390 470 420S750 670 1010 530 1270 170 1500-10" />
      <path d="M-20 580C260 510 240 340 490 380S770 610 1030 480 1290 130 1490-60" />
      <path d="M0 520C280 450 260 290 510 340S790 550 1050 430 1310 90 1480-110" />
      <path d="M20 460C300 400 280 250 530 300S810 490 1070 380 1330 50 1470-160" />
      <path d="M40 400C320 340 300 210 550 260S830 430 1090 330 1350 10 1460-210" />
      <path d="M60 340C340 290 320 170 570 220S850 370 1110 280 1370-30 1450-260" />
      <path d="M80 280C360 230 340 130 590 180S870 310 1130 230 1390-70 1440-310" />
      <path d="M100 220C380 180 360 90 610 140S890 250 1150 180 1410-110 1430-360" />
      <path d="M120 160C400 130 380 50 630 100S910 190 1170 130 1430-150 1420-410" />
      <path d="M140 100C420 80 400 10 650 60S930 130 1190 80 1450-190 1410-460" />
      <path d="M160 40C440 30 420-30 670 20S950 70 1210 30 1470-230 1400-510" />
    </svg>
  )
}

function Hero({ heroDescription, heroPoster }) {
  const sceneRef = useRef(null)
  const videoRef = useRef(null)
  const animationRef = useRef(null)
  const [wavesVisible, setWavesVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const isRecording = new URLSearchParams(window.location.search).get('rec') === '1'

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (event) => {
      setReducedMotion(event.matches)
      setIsAnimating(!event.matches)
    }
    motionPreference.addEventListener('change', updateMotionPreference)

    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    const video = videoRef.current
    if (!scene || !video) return undefined

    let disposed = false
    let reverseTimer

    const getMobileState = () => window.matchMedia('(max-width: 720px)').matches
    const finishReveal = (animation) => {
      if (animationRef.current === animation) setIsAnimating(false)
    }
    const playReveal = () => {
      const animation = scene.animate(makeRevealKeyframes(getMobileState()), {
        duration: REVEAL_DURATION,
        fill: 'forwards',
        easing: 'linear',
      })
      animationRef.current = animation
      animation.onfinish = () => finishReveal(animation)
      setIsAnimating(true)
      return animation
    }

    window.__recVideo = (time) => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 4.25
      const frameTime = (time % duration) + 1 / 120
      const safeTime = Math.min(frameTime, Math.max(0, duration - 1 / 120))

      try {
        video.currentTime = safeTime
      } catch {
      }

      return frameTime
    }

    const handleResize = () => {
      const animation = animationRef.current
      applyFinalState(scene, getMobileState())
      animation?.cancel()
      animationRef.current = null
      setIsAnimating(false)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    if (reducedMotion) {
      applyFinalState(scene, getMobileState())
      video.pause()
      video.currentTime = 0
    } else {
      document.fonts.ready.then(() => {
        if (disposed) return

        const animation = playReveal()
        video.play().catch(() => {})

        if (isRecording) {
          reverseTimer = window.setTimeout(() => {
            if (animationRef.current === animation) animation.reverse()
          }, 4900)
        }
      })
    }

    return () => {
      disposed = true
      window.clearTimeout(reverseTimer)
      window.removeEventListener('resize', handleResize)
      animationRef.current?.cancel()
      animationRef.current = null
      if (window.__recVideo) delete window.__recVideo
    }
  }, [isRecording, reducedMotion])

  const replayReveal = () => {
    if (reducedMotion || isAnimating) return

    const scene = sceneRef.current
    if (!scene) return

    const animation = animationRef.current ?? scene.animate(
      makeRevealKeyframes(window.matchMedia('(max-width: 720px)').matches),
      { duration: REVEAL_DURATION, fill: 'forwards', easing: 'linear' },
    )

    if (!animationRef.current) {
      animation.pause()
      animation.currentTime = REVEAL_DURATION
      animationRef.current = animation
    }

    setIsAnimating(true)
    animation.onfinish = () => {
      animation.cancel()
      const openingAnimation = scene.animate(
        makeRevealKeyframes(window.matchMedia('(max-width: 720px)').matches),
        { duration: REVEAL_DURATION, fill: 'forwards', easing: 'linear' },
      )
      animationRef.current = openingAnimation
      openingAnimation.onfinish = () => {
        if (animationRef.current === openingAnimation) setIsAnimating(false)
      }
    }
    animation.reverse()
  }

  const SpeakerIcon = wavesVisible ? Volume2 : VolumeX

  return (
    <main className="scene" id="hero" ref={sceneRef}>
      <div className="paper" aria-hidden="true">
        <PaperLines />
      </div>

      <SiteNavigation />

      <div className="hero-visual">
        <h1 className="wordmark" aria-label="Coding">
          <span className="word-half">C</span>
          <span className="pill">
            <video
              ref={videoRef}
              className="island-video"
              src={VIDEO_URL}
              poster={heroPoster || POSTER_URL}
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <span className="hairline" />
            <span className="pill-icon pill-icon-left">
              <Wind aria-hidden="true" />
            </span>
            <button
              className="pill-icon pill-icon-right sound-toggle"
              type="button"
              aria-label={`Toggle speaker waves; video remains silent (${wavesVisible ? 'on' : 'off'})`}
              aria-pressed={wavesVisible}
              title="Toggle speaker waves; video remains silent"
              onClick={() => setWavesVisible((visible) => !visible)}
            >
              <SpeakerIcon aria-hidden="true" />
            </button>
          </span>
          <span className="word-half">D</span>
          <span className="word-half">I</span>
          <span className="word-half">N</span>
          <span className="word-half">G</span>
        </h1>

        <div className="hero-actions">
          <Link className="primary-action" to="/services">
            LET&apos;S CODE
          </Link>
          <Link className="secondary-action" to="/contact">DO INQUIRY</Link>
        </div>
      </div>

      <div className="hero-footer-bar" aria-hidden="true">
        <button
          className="replay-control"
          type="button"
          onClick={replayReveal}
          disabled={reducedMotion || isAnimating}
          aria-label="Replay hero reveal"
          title="Replay hero reveal"
        >
          <RotateCw aria-hidden="true" />
        </button>
        <span className="hero-attribute">{heroDescription || 'Technology built to solve everyday problems.'}</span>
      </div>
    </main>
  )
}

function HomePage({ portfolio, loadError }) {
  return (
    <>
      <Hero heroDescription={portfolio?.profile?.hero_description} heroPoster={portfolio?.profile?.hero_image_url} />
      {loadError && <p className="site-alert" role="status">{loadError}</p>}
    </>
  )
}

export default function App() {
  const [portfolio, setPortfolio] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    getPortfolio()
      .then(setPortfolio)
      .catch(() => setLoadError('Portfolio content is temporarily unavailable.'))
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage portfolio={portfolio} loadError={loadError} />} />
        <Route path="/projects" element={<ProjectsPage portfolio={portfolio} loadError={loadError} />} />
        <Route path="/services" element={<ServicesPage portfolio={portfolio} loadError={loadError} />} />
        <Route path="/profile" element={<ProfilePage portfolio={portfolio} loadError={loadError} />} />
        <Route path="/about" element={<AboutPage portfolio={portfolio} loadError={loadError} />} />
        <Route path="/contact" element={<ContactPage portfolio={portfolio} loadError={loadError} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/admin/login" element={<AccountPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
