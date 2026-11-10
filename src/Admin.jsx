import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Eye, EyeOff, ImagePlus, LogOut, Plus, Save, Trash2, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAdminContent,
  getAdminOverview,
  getCurrentAdmin,
  loginAdmin,
  loginUser,
  logoutAdmin,
  registerUser,
  resolveApiUrl,
  saveAdminResource,
} from './api'
import './Admin.css'

const COLLECTIONS = {
  projects: {
    title: 'Projects',
    endpoint: '/admin/projects',
    fields: [
      { key: 'name', label: 'Project name', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Website Development', 'Web Applications', 'Mobile Applications', 'Business Software', 'Custom Software Solutions'], required: true },
      { key: 'description', label: 'Short description', type: 'textarea', required: true },
      { key: 'detailed_description', label: 'Detailed description', type: 'textarea' },
      { key: 'status', label: 'Status' },
      { key: 'features', label: 'Key features', type: 'list' },
      { key: 'challenges', label: 'Development challenges', type: 'textarea' },
      { key: 'solutions', label: 'Solutions implemented', type: 'textarea' },
      { key: 'technologies', label: 'Technologies', type: 'list' },
      { key: 'position', label: 'Display order', type: 'number' },
      { key: 'live_url', label: 'Live URL', type: 'url' },
      { key: 'github_url', label: 'GitHub URL', type: 'url' },
      { key: 'cover_image', label: 'Thumbnail image URL', type: 'url' },
      { key: 'screenshots', label: 'Screenshot URLs', type: 'list' },
      { key: 'featured', label: 'Featured project', type: 'checkbox' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ],
    initial: { name: '', category: 'Website Development', description: '', detailed_description: '', status: '', features: '', challenges: '', solutions: '', technologies: '', position: 0, live_url: '', github_url: '', cover_image: '', screenshots: '', featured: false, published: false },
  },
  services: {
    title: 'Services',
    endpoint: '/admin/services',
    fields: [
      { key: 'title', label: 'Service title', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'image_url', label: 'Service image URL' },
      { key: 'capabilities', label: 'Capabilities', type: 'list' },
      { key: 'pricing', label: 'Pricing JSON (startingPrice, stages, timeline, etc.)', type: 'json' },
      { key: 'position', label: 'Display order', type: 'number' },
      { key: 'active', label: 'Active', type: 'checkbox' },
    ],
    initial: { title: '', description: '', image_url: '', capabilities: '', pricing: '{}', position: 0, active: true },
  },
  journey: {
    title: 'Journey',
    endpoint: '/admin/journey',
    fields: [
      { key: 'title', label: 'Milestone title', required: true },
      { key: 'period', label: 'Period or label' },
      { key: 'organization', label: 'Organization or project' },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'image_urls', label: 'Photograph URLs', type: 'list' },
      { key: 'position', label: 'Display order', type: 'number' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ],
    initial: { title: '', period: '', organization: '', description: '', image_urls: '', position: 0, published: true },
  },
  social_links: {
    title: 'Social Links',
    endpoint: '/admin/social-links',
    fields: [
      { key: 'platform', label: 'Platform', required: true },
      { key: 'url', label: 'Profile URL', required: true },
      { key: 'position', label: 'Display order', type: 'number' },
      { key: 'active', label: 'Visible publicly', type: 'checkbox' },
    ],
    initial: { platform: '', url: '', position: 0, active: true },
  },
}

const ADMIN_TABS = [
  ['overview', 'Admin Home'],
  ['about', 'Profile'],
  ['contact', 'Contact Us'],
  ['projects', 'Projects'],
  ['services', 'Services'],
  ['pricing', 'Marketing packages'],
  ['journey', 'Journey'],
  ['social_links', 'Socials'],
  ['media', 'Media'],
  ['inquiries', 'Inquiries'],
  ['settings', 'Settings'],
]

function PortalFrame({ children, eyebrow = 'MABRIXEL TECHNOLOGIES' }) {
  return (
    <main className="portal-page">
      <a href="/" className="portal-home-link"><ArrowLeft aria-hidden="true" /> {eyebrow}</a>
      {children}
    </main>
  )
}

export function AccountPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await loginAdmin({ email, password })
      navigate('/admin', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PortalFrame eyebrow="ACCOUNT ACCESS">
      <section className="portal-auth">
        <p className="section-kicker">ADMINISTRATOR SIGN IN</p>
        <h1>Welcome Back</h1>
        <p>Access the site administration workspace.</p>
        <form className="portal-form" onSubmit={handleLogin}>
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password
            <span className="portal-password-field">
              <input type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button type="button" className="password-visibility-toggle" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? 'Hide password' : 'Show password'} aria-pressed={passwordVisible}>
                {passwordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </label>
          <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'SIGNING IN...' : 'SIGN IN'}</button>
          {error && <p className="admin-feedback" role="alert">{error}</p>}
        </form>
      </section>
    </PortalFrame>
  )
}

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setRegistered(false)
    try {
      await registerUser({ name, email, password })
      setRegistered(true)
      setPassword('')
    } catch (registrationError) {
      setError(registrationError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PortalFrame eyebrow="CREATE ACCOUNT">
      <section className="portal-auth">
        <p className="section-kicker">PUBLIC REGISTRATION</p>
        <h1>Create your account.</h1>
        <p>Your account is separate from administrator access.</p>
        <form className="portal-form" onSubmit={handleSubmit}>
          <label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} /></label>
          <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} /></label>
          <label>Password<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} maxLength={128} /></label>
          <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</button>
          {error && <p className="admin-feedback" role="alert">{error}</p>}
          {registered && <p className="admin-feedback" role="status">Account created. You can now sign in.</p>}
        </form>
        <p className="admin-feedback"><Link to="/login">Already registered? Sign in</Link></p>
      </section>
    </PortalFrame>
  )
}

export function UserLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [signedInAs, setSignedInAs] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSignedInAs('')
    try {
      const user = await loginUser({ email, password })
      setSignedInAs(user.email)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PortalFrame eyebrow="ACCOUNT SIGN IN">
      <section className="portal-auth">
        <p className="section-kicker">USER SIGN IN</p>
        <h1>Welcome back.</h1>
        <form className="portal-form" onSubmit={handleSubmit}>
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'SIGNING IN...' : 'SIGN IN'}</button>
          {error && <p className="admin-feedback" role="alert">{error}</p>}
          {signedInAs && <p className="admin-feedback" role="status">Signed in as {signedInAs}.</p>}
        </form>
        <p className="admin-feedback"><Link to="/register">Create an account</Link></p>
      </section>
    </PortalFrame>
  )
}

export function AdminPage() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    getCurrentAdmin()
      .then((result) => setAdmin(result.user))
      .catch(() => navigate('/admin/login', { replace: true }))
      .finally(() => setChecking(false))
  }, [navigate])

  if (checking) {
    return <PortalFrame><p className="admin-feedback">Checking access...</p></PortalFrame>
  }
  if (!admin) return null

  return <AdminWorkspace admin={admin} onLogout={async () => { try { await logoutAdmin() } finally { navigate('/admin/login', { replace: true }) } }} />
}

function AdminWorkspace({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [content, setContent] = useState(null)
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function refresh() {
    const [nextContent, nextOverview] = await Promise.all([getAdminContent(), getAdminOverview()])
    setContent(nextContent)
    setOverview(nextOverview)
  }

  useEffect(() => {
    refresh().catch((loadError) => setError(loadError.message))
  }, [])

  async function runAction(action, successMessage) {
    setError('')
    setNotice('')
    try {
      await action()
      await refresh()
      setNotice(successMessage)
      return true
    } catch (actionError) {
      setError(actionError.message)
      return false
    }
  }

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand">MABRIXEL <span>ADMIN</span></a>
        <nav aria-label="Administration sections">
          {ADMIN_TABS.map(([key, label]) => (
            <button key={key} type="button" className={activeTab === key ? 'is-active' : ''} onClick={() => setActiveTab(key)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <span>{admin.email}</span>
          <button type="button" onClick={onLogout} aria-label="Sign out" title="Sign out"><LogOut aria-hidden="true" /></button>
        </div>
      </aside>
      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p className="section-kicker">WEBSITE MANAGEMENT</p>
            <h1>{ADMIN_TABS.find(([key]) => key === activeTab)?.[1]}</h1>
          </div>
          <div className="admin-header-actions">
            <a href="/" className="admin-view-site">VIEW SITE <ArrowLeft aria-hidden="true" /></a>
            <button type="button" className="admin-sign-out" onClick={onLogout}><LogOut aria-hidden="true" /> SIGN OUT</button>
          </div>
        </header>
        {(error || notice) && <p className={`admin-notice ${error ? 'has-error' : ''}`} role="status">{error || notice}</p>}
        {!content ? <p className="admin-feedback">Loading content...</p> : (
          <>
            {activeTab === 'overview' && <OverviewPanel overview={overview} />}
            {activeTab === 'about' && <ProfileEditor profile={content.profile} onSave={(data) => runAction(() => saveAdminResource('/admin/profile', 'PUT', data), 'Profile content updated.')} />}
            {activeTab === 'contact' && <ContactEditor profile={content.profile} onSave={(data) => runAction(() => saveAdminResource('/admin/profile', 'PUT', data), 'Contact information updated.')} />}
            {activeTab === 'media' && <MediaPanel assets={content.media_assets || []} onDelete={(id) => runAction(() => saveAdminResource(`/admin/uploads/${id}`, 'DELETE'), 'Image deleted from Cloudinary.')} />}
            {activeTab === 'pricing' && (
              <PricingPackagesEditor
                service={content.services?.find((item) => item.title.toLowerCase() === 'digital marketing')}
                onSave={(service, pricing) => runAction(
                  () => saveAdminResource(`/admin/services/${service.id}`, 'PUT', {
                    title: service.title,
                    description: service.description,
                    pricing,
                  }),
                  'Digital marketing packages saved.',
                )}
              />
            )}
            {COLLECTIONS[activeTab] && (
              <CollectionEditor
                key={activeTab}
                config={COLLECTIONS[activeTab]}
                items={content[activeTab] || []}
                onSave={(path, method, data) => runAction(() => saveAdminResource(path, method, data), `${COLLECTIONS[activeTab].title} saved.`)}
                onDelete={(path) => runAction(() => saveAdminResource(path, 'DELETE'), `${COLLECTIONS[activeTab].title} item deleted.`)}
              />
            )}
            {activeTab === 'inquiries' && <InquiriesPanel inquiries={content.inquiries || []} onUpdate={(id, changes) => runAction(() => saveAdminResource(`/admin/inquiries/${id}`, 'PATCH', changes), 'Inquiry updated.')} onDelete={(id) => runAction(() => saveAdminResource(`/admin/inquiries/${id}`, 'DELETE'), 'Inquiry deleted.')} />}
            {activeTab === 'settings' && <SettingsPanel />}
          </>
        )}
      </section>
    </main>
  )
}

function OverviewPanel({ overview }) {
  if (!overview) return <p className="admin-feedback">Loading overview...</p>
  const stats = [
    ['Total projects', overview.total_projects],
    ['Published projects', overview.published_projects],
    ['Active services', overview.active_services ?? overview.total_services],
    ['Inquiries', overview.total_inquiries],
  ]
  return (
    <div className="admin-panel">
      <div className="admin-stat-grid">
        {stats.map(([label, value]) => <div className="admin-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <section className="admin-table-section">
        <div className="admin-panel-heading"><h2>Recent inquiries</h2><span>Latest five</span></div>
        {overview.recent_inquiries.length ? (
          <div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Service</th><th>Status</th><th>Received</th></tr></thead><tbody>
            {overview.recent_inquiries.map((inquiry) => <tr key={inquiry.id}><td>{inquiry.name}</td><td>{inquiry.service}</td><td>{inquiry.status}</td><td>{new Date(inquiry.created_at).toLocaleDateString()}</td></tr>)}
          </tbody></table></div>
        ) : <p className="admin-empty">No inquiries yet.</p>}
      </section>
    </div>
  )
}

function ProfileEditor({ profile, onSave }) {
  const [form, setForm] = useState(profile || { name: 'Ian Mabruk', professional_title: '', introduction: '', skills: [], technologies: [], experience: [], education: [], certifications: [], hero_description: '', hero_image_url: '', about_intro: '', about_who_we_are: '', about_mission: '', about_what_we_do: '', about_approach: '', about_why_choose_us: '', location: 'Kenya', email: '', phone: '', photo_url: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [pendingPhoto, setPendingPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(profile?.photo_url || '')

  useEffect(() => {
    if (photoPreview.startsWith('blob:')) return () => URL.revokeObjectURL(photoPreview)
    return undefined
  }, [photoPreview])

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateList(key, value) {
    update(key, value.split('\n').map((item) => item.trim()).filter(Boolean))
  }

  async function uploadPhoto(file) {
    setUploading(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.append('image', file)
      body.append('context', 'about')
      const result = await saveAdminResource('/admin/uploads', 'POST', body)
      const photoUrl = resolveApiUrl(result.url)
      const updatedProfile = { ...form, photo_url: photoUrl }
      update('photo_url', photoUrl)
      setPhotoPreview(photoUrl)
      setPendingPhoto(null)
      await onSave({ name: profile?.name || 'Ian Mabruk', ...updatedProfile })
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  async function uploadHeroPoster(file) {
    setUploading(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.append('image', file)
      body.append('context', 'homepage')
      const result = await saveAdminResource('/admin/uploads', 'POST', body)
      const updatedProfile = { ...form, hero_image_url: resolveApiUrl(result.url) }
      update('hero_image_url', updatedProfile.hero_image_url)
      await onSave({ name: profile?.name || 'Ian Mabruk', ...updatedProfile })
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={(event) => { event.preventDefault(); onSave({ name: profile?.name || 'Ian Mabruk', ...form }) }}>
      <div className="admin-panel-heading"><div><h2>Professional profile</h2><p>Manage the public profile page, hero copy, and biography.</p></div><button className="admin-primary" type="submit"><Save aria-hidden="true" /> SAVE PROFILE</button></div>
      <div className="admin-form-grid">
        <label>Name<input value={form.name || ''} onChange={(event) => update('name', event.target.value)} required maxLength="160" /></label>
        <label>Professional title<input value={form.professional_title || ''} onChange={(event) => update('professional_title', event.target.value)} maxLength="180" /></label>
        <label>Location<input value={form.location || ''} onChange={(event) => update('location', event.target.value)} maxLength="160" /></label>
        <label>Email<input type="email" value={form.email || ''} onChange={(event) => update('email', event.target.value)} maxLength="254" /></label>
        <label>Phone<input value={form.phone || ''} onChange={(event) => update('phone', event.target.value)} maxLength="48" /></label>
        <label className="admin-field-wide">Hero description<textarea value={form.hero_description || ''} onChange={(event) => update('hero_description', event.target.value)} rows="3" maxLength="1000" /></label>
        <label className="admin-field-wide">Homepage media poster URL<input value={form.hero_image_url || ''} onChange={(event) => update('hero_image_url', event.target.value)} maxLength="500" /></label>
        <label className="admin-field-wide">Profile introduction<textarea value={form.introduction || ''} onChange={(event) => update('introduction', event.target.value)} rows="6" maxLength="5000" /></label>
        <label>Skills<textarea value={(form.skills || []).join('\n')} onChange={(event) => updateList('skills', event.target.value)} rows="5" placeholder="One skill per line" /></label>
        <label>Technologies and programming languages<textarea value={(form.technologies || []).join('\n')} onChange={(event) => updateList('technologies', event.target.value)} rows="5" placeholder="One technology or language per line" /></label>
        <label>Professional experience<textarea value={(form.experience || []).join('\n')} onChange={(event) => updateList('experience', event.target.value)} rows="5" placeholder="One experience entry per line" /></label>
        <label>Education<textarea value={(form.education || []).join('\n')} onChange={(event) => updateList('education', event.target.value)} rows="4" placeholder="One education entry per line" /></label>
        <label>Certifications<textarea value={(form.certifications || []).join('\n')} onChange={(event) => updateList('certifications', event.target.value)} rows="4" placeholder="One certification per line" /></label>
        <label className="admin-field-wide">About Us introduction<textarea value={form.about_intro || ''} onChange={(event) => update('about_intro', event.target.value)} rows="4" maxLength="3000" /></label>
        <label className="admin-field-wide">Who We Are<textarea value={form.about_who_we_are || ''} onChange={(event) => update('about_who_we_are', event.target.value)} rows="3" maxLength="3000" /></label>
        <label className="admin-field-wide">Mission<textarea value={form.about_mission || ''} onChange={(event) => update('about_mission', event.target.value)} rows="3" maxLength="3000" /></label>
        <label className="admin-field-wide">What We Do<textarea value={form.about_what_we_do || ''} onChange={(event) => update('about_what_we_do', event.target.value)} rows="3" maxLength="3000" /></label>
        <label className="admin-field-wide">Our Approach<textarea value={form.about_approach || ''} onChange={(event) => update('about_approach', event.target.value)} rows="3" maxLength="3000" /></label>
        <label className="admin-field-wide">Why Choose Us<textarea value={form.about_why_choose_us || ''} onChange={(event) => update('about_why_choose_us', event.target.value)} rows="3" maxLength="3000" /></label>
        <label className="admin-field-wide">Profile photo URL<input value={form.photo_url || ''} onChange={(event) => update('photo_url', event.target.value)} maxLength="500" /></label>
        {photoPreview && <img className="admin-image-preview admin-field-wide" src={photoPreview} alt="Profile image preview" />}
        <label className="admin-upload"><ImagePlus aria-hidden="true" /> CHOOSE PROFILE PHOTO<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPendingPhoto(file); setPhotoPreview(URL.createObjectURL(file)) } }} /></label>
        {pendingPhoto && <button className="admin-secondary" type="button" disabled={uploading} onClick={() => uploadPhoto(pendingPhoto)}>{uploading ? 'UPLOADING...' : 'UPLOAD SELECTED PHOTO'}</button>}
        <label className="admin-upload"><ImagePlus aria-hidden="true" /> {uploading ? 'UPLOADING...' : 'UPLOAD HOMEPAGE POSTER'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => event.target.files?.[0] && uploadHeroPoster(event.target.files[0])} /></label>
        {uploadError && <p className="admin-notice has-error" role="alert">{uploadError}</p>}
      </div>
    </form>
  )
}

function ContactEditor({ profile, onSave }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [form, setForm] = useState({
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    contact_image_url: profile?.contact_image_url || '',
  })

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function uploadContactImage(file) {
    setUploading(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.append('image', file)
      body.append('context', 'contact')
      const result = await saveAdminResource('/admin/uploads', 'POST', body)
      update('contact_image_url', resolveApiUrl(result.url))
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={(event) => { event.preventDefault(); onSave({ name: profile?.name || 'Ian Mabruk', ...form }) }}>
      <div className="admin-panel-heading"><div><h2>Public contact information</h2><p>These details appear on the Contact Us page.</p></div><button className="admin-primary" type="submit"><Save aria-hidden="true" /> SAVE CONTACT</button></div>
      <div className="admin-form-grid">
        <label>Email address<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} maxLength={254} /></label>
        <label>Phone number<input value={form.phone} onChange={(event) => update('phone', event.target.value)} maxLength={48} /></label>
        <label>Location<input value={form.location} onChange={(event) => update('location', event.target.value)} maxLength={160} /></label>
        <label className="admin-field-wide">Contact image URL<input value={form.contact_image_url} onChange={(event) => update('contact_image_url', event.target.value)} maxLength={500} /></label>
        <label className="admin-upload"><ImagePlus aria-hidden="true" /> {uploading ? 'UPLOADING...' : 'UPLOAD CONTACT IMAGE'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => event.target.files?.[0] && uploadContactImage(event.target.files[0])} /></label>
        {uploadError && <p className="admin-notice has-error" role="alert">{uploadError}</p>}
      </div>
    </form>
  )
}

function PricingPackagesEditor({ service, onSave }) {
  const packageDefaults = [
    { name: 'BRONZE', price: 12000, description: '', included_services: [], platform_count: null, content_details: '', management_details: '' },
    { name: 'SILVER', price: 16000, description: '', included_services: [], platform_count: null, content_details: '', management_details: '' },
    { name: 'GOLD', price: 22000, description: '', included_services: [], platform_count: null, content_details: '', management_details: '' },
  ]
  const [packages, setPackages] = useState(() => packageDefaults.map((defaults) => ({
    ...defaults,
    ...(service?.pricing?.packages?.find((item) => item.name === defaults.name) || {}),
  })))

  function updatePackage(index, key, value) {
    setPackages((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item
      if (key === 'included_services') {
        return { ...item, [key]: value.split('\n').map((entry) => entry.trim()).filter(Boolean) }
      }
      if (key === 'platform_count') {
        return { ...item, [key]: value === '' ? null : Number(value) }
      }
      return { ...item, [key]: value }
    }))
  }

  if (!service) {
    return <p className="admin-notice has-error" role="alert">Digital Marketing service content is unavailable. Run the existing content seed command after deployment, then reload this section.</p>
  }

  return (
    <form className="admin-panel admin-form" onSubmit={(event) => {
      event.preventDefault()
      onSave(service, { ...(service.pricing || {}), packages })
    }}>
      <div className="admin-panel-heading">
        <div><h2>Digital marketing packages</h2><p>Package names and prices are fixed to the requested Bronze, Silver, and Gold tiers. Add only confirmed service inclusions and quantities.</p></div>
        <button className="admin-primary" type="submit"><Save aria-hidden="true" /> SAVE PACKAGES</button>
      </div>
      <div className="marketing-admin-grid">
        {packages.map((item, index) => (
          <section className="marketing-admin-card" key={item.name}>
            <p className="section-kicker">PACKAGE</p>
            <h3>{item.name}</h3>
            <strong className="marketing-admin-price">KES {item.price.toLocaleString('en-KE')}</strong>
            <div className="admin-form-grid">
              <label className="admin-field-wide">Short description<textarea value={item.description} onChange={(event) => updatePackage(index, 'description', event.target.value)} rows="3" maxLength="500" /></label>
              <label className="admin-field-wide">Included services<textarea value={(item.included_services || []).join('\n')} onChange={(event) => updatePackage(index, 'included_services', event.target.value)} rows="4" placeholder="One confirmed service per line" /></label>
              <label>Number of platforms<input type="number" min="1" max="100" value={item.platform_count ?? ''} onChange={(event) => updatePackage(index, 'platform_count', event.target.value)} /></label>
              <label>Content creation details<textarea value={item.content_details || ''} onChange={(event) => updatePackage(index, 'content_details', event.target.value)} rows="3" maxLength="1000" /></label>
              <label className="admin-field-wide">Marketing management details<textarea value={item.management_details || ''} onChange={(event) => updatePackage(index, 'management_details', event.target.value)} rows="3" maxLength="1000" /></label>
            </div>
          </section>
        ))}
      </div>
    </form>
  )
}

function CollectionEditor({ config, items, onSave, onDelete }) {
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(config.initial)
  const [uploading, setUploading] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const selected = items.find((item) => item.id === selectedId)

  function beginEdit(item) {
    setSelectedId(item.id)
    setForm(Object.fromEntries(config.fields.map((field) => {
      const value = item[field.key]
      return [field.key, field.type === 'list' ? (value || []).join('\n') : field.type === 'json' ? JSON.stringify(value || {}, null, 2) : value ?? (field.type === 'checkbox' ? false : '')]
    })))
  }

  function beginNew() {
    setSelectedId(null)
    const hasPosition = config.fields.some((field) => field.key === 'position')
    const nextPosition = items.reduce((position, item) => Math.max(position, Number(item.position) || 0), -1) + 1
    setForm({ ...config.initial, ...(hasPosition ? { position: nextPosition } : {}) })
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function preparePayload() {
    const payload = { ...form }
    for (const field of config.fields) {
      if (field.type === 'list') payload[field.key] = String(form[field.key] || '').split('\n').map((item) => item.trim()).filter(Boolean)
      if (field.type === 'number') payload[field.key] = Number(form[field.key] || 0)
      if (field.type === 'json') payload[field.key] = JSON.parse(String(form[field.key] || '{}'))
    }
    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const id = selected?.id
    setValidationError('')
    try {
      const saved = await onSave(`${config.endpoint}${id ? `/${id}` : ''}`, id ? 'PUT' : 'POST', preparePayload())
      if (saved) beginNew()
    } catch (error) {
      setValidationError(error.message)
    }
  }

  async function uploadScreenshots(files) {
    setUploading(true)
    setUploadError('')
    try {
      const urls = await Promise.all(Array.from(files).map(async (file) => {
        const body = new FormData()
        body.append('image', file)
        body.append('context', config === COLLECTIONS.services ? 'services' : config === COLLECTIONS.journey ? 'journey' : 'projects')
        return resolveApiUrl((await saveAdminResource('/admin/uploads', 'POST', body)).url)
      }))
      if (config === COLLECTIONS.services) {
        setForm((current) => ({ ...current, image_url: urls[0] }))
        return
      }
      if (config === COLLECTIONS.journey) {
        setForm((current) => ({
          ...current,
          image_urls: `${current.image_urls || ''}${current.image_urls ? '\n' : ''}${urls.join('\n')}`,
        }))
        return
      }
      setForm((current) => {
        const screenshots = `${current.screenshots || ''}${current.screenshots ? '\n' : ''}${urls.join('\n')}`
        return { ...current, screenshots, cover_image: current.cover_image || urls[0] }
      })
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  async function uploadCoverImage(file) {
    setUploading(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.append('image', file)
      body.append('context', 'projects')
      const result = await saveAdminResource('/admin/uploads', 'POST', body)
      setForm((current) => ({ ...current, cover_image: resolveApiUrl(result.url) }))
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  function renderField(field) {
    if (field.type === 'checkbox') {
      return <label className="admin-checkbox" key={field.key}><input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => update(field.key, event.target.checked)} />{field.label}</label>
    }
    const common = { id: field.key, value: form[field.key] ?? '', required: field.required, onChange: (event) => update(field.key, event.target.value) }
    if (field.type === 'textarea' || field.type === 'list' || field.type === 'json') {
      return <label className={field.type !== 'list' ? 'admin-field-wide' : ''} key={field.key}>{field.label}{field.type === 'textarea' ? <textarea {...common} rows="4" /> : field.type === 'json' ? <textarea {...common} rows="8" spellCheck="false" /> : <textarea {...common} rows="3" placeholder="One item per line" />}</label>
    }
    if (field.type === 'select') {
      return <label key={field.key}>{field.label}<select {...common}>{field.options.map((option) => <option key={option}>{option}</option>)}</select></label>
    }
    return <label key={field.key}>{field.label}<input {...common} type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'} min={field.type === 'number' ? 0 : undefined} /></label>
  }

  return (
    <div className="admin-panel admin-collection">
      <div className="admin-panel-heading"><div><h2>{config.title} management</h2><p>{items.length} {items.length === 1 ? 'entry' : 'entries'}</p></div><button type="button" className="admin-secondary" onClick={beginNew}><Plus aria-hidden="true" /> ADD NEW</button></div>
      <div className="admin-collection-layout">
        <div className="admin-item-list">
          {items.map((item) => (
            <article className={`admin-item ${item.id === selectedId ? 'is-selected' : ''}`} key={item.id}>
              <button type="button" className="admin-item-select" onClick={() => beginEdit(item)}>
                <strong>{item.name || item.title || item.platform}</strong>
                <span>{item.category || item.period || item.url || (item.published || item.active ? 'Published' : 'Draft')}</span>
              </button>
              <button type="button" className="admin-icon-button is-danger" aria-label={`Delete ${item.name || item.title || item.platform}`} onClick={() => onDelete(`${config.endpoint}/${item.id}`)}><Trash2 aria-hidden="true" /></button>
            </article>
          ))}
          {!items.length && <p className="admin-empty">No {config.title.toLowerCase()} have been added.</p>}
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-panel-heading"><h3>{selected ? 'Edit entry' : 'New entry'}</h3>{selected && <button type="button" className="admin-icon-button" onClick={beginNew} aria-label="Clear selection"><X aria-hidden="true" /></button>}</div>
          <div className="admin-form-grid">{config.fields.map(renderField)}</div>
          {validationError && <p className="admin-notice has-error" role="alert">{validationError}</p>}
          {config === COLLECTIONS.projects && <label className="admin-upload"><ImagePlus aria-hidden="true" /> {uploading ? 'UPLOADING...' : 'UPLOAD PROJECT THUMBNAIL'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => event.target.files?.[0] && uploadCoverImage(event.target.files[0])} /></label>}
          {config === COLLECTIONS.projects && form.cover_image && <img className="admin-image-preview admin-field-wide" src={form.cover_image} alt="Project thumbnail preview" />}
          {(config === COLLECTIONS.projects || config === COLLECTIONS.services || config === COLLECTIONS.journey) && <label className="admin-upload"><ImagePlus aria-hidden="true" /> {uploading ? 'UPLOADING...' : config === COLLECTIONS.projects ? 'ADD PROJECT SCREENSHOTS' : config === COLLECTIONS.journey ? 'ADD MILESTONE PHOTOGRAPHS' : 'UPLOAD SERVICE IMAGE'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple={config === COLLECTIONS.projects || config === COLLECTIONS.journey} disabled={uploading} onChange={(event) => event.target.files?.length && uploadScreenshots(event.target.files)} /></label>}
          {config === COLLECTIONS.journey && (
            <div className="admin-image-gallery admin-field-wide">
              {(String(form.image_urls || '').split('\n').map((url) => url.trim()).filter(Boolean)).map((url) => (
                <figure className="admin-image-item" key={url}>
                  <img className="admin-image-preview" src={url} alt="Milestone photograph preview" />
                  <button
                    className="admin-secondary"
                    type="button"
                    onClick={() => update('image_urls', String(form.image_urls || '').split('\n').filter((imageUrl) => imageUrl.trim() !== url).join('\n'))}
                  >
                    REMOVE PHOTO
                  </button>
                </figure>
              ))}
            </div>
          )}
          {uploadError && <p className="admin-notice has-error" role="alert">{uploadError}</p>}
          <button className="admin-primary" type="submit"><Save aria-hidden="true" /> {selected ? 'SAVE CHANGES' : 'CREATE ENTRY'}</button>
        </form>
      </div>
    </div>
  )
}

function InquiriesPanel({ inquiries, onUpdate, onDelete }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [notes, setNotes] = useState({})
  const filteredInquiries = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return inquiries.filter((inquiry) => {
      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
      const searchable = [inquiry.name, inquiry.email, inquiry.business_name, inquiry.service, inquiry.message]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesStatus && (!needle || searchable.includes(needle))
    })
  }, [inquiries, query, statusFilter])

  return (
    <div className="admin-panel admin-table-section">
      <div className="admin-panel-heading"><div><h2>Customer inquiries</h2><p>{filteredInquiries.length} of {inquiries.length} recent inquiries</p></div></div>
      <div className="admin-form-grid">
        <label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, service, or message" /></label>
        <label>Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      {filteredInquiries.length ? filteredInquiries.map((inquiry) => (
        <article className="inquiry-card" key={inquiry.id}>
          <div className="inquiry-card-header"><div><strong>{inquiry.name}</strong><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></div><span>{new Date(inquiry.created_at).toLocaleString()}</span></div>
          <p>{inquiry.message}</p>
          <div className="inquiry-card-footer"><span>{[inquiry.business_name, inquiry.service, inquiry.budget, inquiry.timeline, inquiry.phone].filter(Boolean).join(' · ')}</span><select aria-label={`Status for ${inquiry.name}`} value={inquiry.status} onChange={(event) => onUpdate(inquiry.id, { status: event.target.value })}><option value="pending">Pending</option><option value="contacted">Contacted</option><option value="completed">Completed</option></select><button type="button" className="admin-icon-button is-danger" aria-label={`Delete inquiry from ${inquiry.name}`} onClick={() => onDelete(inquiry.id)}><Trash2 aria-hidden="true" /></button></div>
          <label>Internal notes<textarea rows="2" value={notes[inquiry.id] ?? inquiry.internal_notes ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [inquiry.id]: event.target.value }))} maxLength={5000} /></label>
          <button type="button" className="admin-secondary" onClick={() => onUpdate(inquiry.id, { internal_notes: notes[inquiry.id] ?? inquiry.internal_notes ?? '' })}>SAVE NOTES</button>
        </article>
      )) : <p className="admin-empty">No inquiries match this search.</p>}
    </div>
  )
}

function MediaPanel({ assets, onDelete }) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading"><div><h2>Cloudinary image library</h2><p>{assets.length} stored image assets</p></div></div>
      {assets.length ? (
        <div className="admin-media-grid">
          {assets.map((asset) => (
            <article className="admin-media-card" key={asset.id}>
              <img src={asset.secure_url} alt="" loading="lazy" />
              <strong>{asset.folder}</strong>
              <code>{asset.public_id}</code>
              <a href={asset.secure_url} target="_blank" rel="noreferrer">OPEN IMAGE</a>
              <button type="button" className="admin-secondary" onClick={() => {
                if (window.confirm('Delete this image permanently from Cloudinary? Existing content using it may no longer display.')) onDelete(asset.id)
              }}>DELETE IMAGE</button>
            </article>
          ))}
        </div>
      ) : <p className="admin-empty">No Cloudinary images have been uploaded.</p>}
    </section>
  )
}

function SettingsPanel() {
  return (
    <section className="admin-panel settings-panel">
      <p className="section-kicker">DESIGN SYSTEM</p>
      <h2>Site settings</h2>
      <p>The public site uses the existing Inter typography, ink and paper colors, and animated CODE aperture. Content updates cannot change those presentation rules.</p>
      <p>To change administrator access, create another administrator using the backend CLI. Public user accounts are separate and do not receive administrator access.</p>
    </section>
  )
}