import { useEffect, useState } from 'react'
import { ArrowLeft, ImagePlus, LogOut, Plus, Save, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  getAdminContent,
  getAdminOverview,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
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
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'status', label: 'Status' },
      { key: 'features', label: 'Key features', type: 'list' },
      { key: 'challenges', label: 'Development challenges', type: 'textarea' },
      { key: 'solutions', label: 'Solutions implemented', type: 'textarea' },
      { key: 'technologies', label: 'Technologies', type: 'list' },
      { key: 'live_url', label: 'Live URL' },
      { key: 'github_url', label: 'GitHub URL' },
      { key: 'cover_image', label: 'Cover image URL' },
      { key: 'screenshots', label: 'Screenshot URLs', type: 'list' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ],
    initial: { name: '', category: 'Website Development', description: '', status: '', features: '', challenges: '', solutions: '', technologies: '', live_url: '', github_url: '', cover_image: '', screenshots: '', published: false },
  },
  services: {
    title: 'Services',
    endpoint: '/admin/services',
    fields: [
      { key: 'title', label: 'Service title', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'capabilities', label: 'Capabilities', type: 'list' },
      { key: 'position', label: 'Display order', type: 'number' },
      { key: 'active', label: 'Active', type: 'checkbox' },
    ],
    initial: { title: '', description: '', capabilities: '', position: 0, active: true },
  },
  journey: {
    title: 'Journey',
    endpoint: '/admin/journey',
    fields: [
      { key: 'title', label: 'Milestone title', required: true },
      { key: 'period', label: 'Period or label' },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'position', label: 'Display order', type: 'number' },
      { key: 'published', label: 'Published', type: 'checkbox' },
    ],
    initial: { title: '', period: '', description: '', position: 0, published: true },
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
  ['overview', 'Overview'],
  ['profile', 'Profile & Hero'],
  ['projects', 'Projects'],
  ['services', 'Services'],
  ['journey', 'Journey'],
  ['social_links', 'Socials'],
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
        <h1>Welcome back.</h1>
        <p>Access to site administration is limited to authorized administrators.</p>
        <form className="portal-form" onSubmit={handleLogin}>
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'SIGNING IN...' : 'SIGN IN'}</button>
          <p className="admin-feedback" role="status">{error}</p>
        </form>
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
      .catch(() => navigate('/account', { replace: true }))
      .finally(() => setChecking(false))
  }, [navigate])

  if (checking) {
    return <PortalFrame><p className="admin-feedback">Checking access...</p></PortalFrame>
  }
  if (!admin) return null

  return <AdminWorkspace admin={admin} onLogout={async () => { try { await logoutAdmin() } finally { navigate('/account', { replace: true }) } }} />
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
    } catch (actionError) {
      setError(actionError.message)
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
            {activeTab === 'profile' && <ProfileEditor profile={content.profile} onSave={(data) => runAction(() => saveAdminResource('/admin/profile', 'PUT', data), 'Profile updated.')} />}
            {COLLECTIONS[activeTab] && (
              <CollectionEditor
                key={activeTab}
                config={COLLECTIONS[activeTab]}
                items={content[activeTab] || []}
                onSave={(path, method, data) => runAction(() => saveAdminResource(path, method, data), `${COLLECTIONS[activeTab].title} saved.`)}
                onDelete={(path) => runAction(() => saveAdminResource(path, 'DELETE'), `${COLLECTIONS[activeTab].title} item deleted.`)}
              />
            )}
            {activeTab === 'inquiries' && <InquiriesPanel inquiries={content.inquiries || []} onUpdate={(id, status) => runAction(() => saveAdminResource(`/admin/inquiries/${id}`, 'PATCH', { status }), 'Inquiry updated.')} onDelete={(id) => runAction(() => saveAdminResource(`/admin/inquiries/${id}`, 'DELETE'), 'Inquiry deleted.')} />}
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
    ['Active services', overview.total_services],
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
  const [form, setForm] = useState(profile || { name: 'Ian Mabruk', introduction: '', hero_description: '', location: 'Kenya', email: '', phone: '', photo_url: '' })
  const [uploading, setUploading] = useState(false)

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function uploadPhoto(file) {
    setUploading(true)
    try {
      const body = new FormData()
      body.append('image', file)
      const result = await saveAdminResource('/admin/uploads', 'POST', body)
      update('photo_url', resolveApiUrl(result.url))
    } finally {
      setUploading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={(event) => { event.preventDefault(); onSave(form) }}>
      <div className="admin-panel-heading"><div><h2>Profile and hero content</h2><p>Content is editable; typography and hero composition remain fixed.</p></div><button className="admin-primary" type="submit"><Save aria-hidden="true" /> SAVE PROFILE</button></div>
      <div className="admin-form-grid">
        <label>Name<input value={form.name || ''} onChange={(event) => update('name', event.target.value)} required maxLength="160" /></label>
        <label>Location<input value={form.location || ''} onChange={(event) => update('location', event.target.value)} maxLength="160" /></label>
        <label>Email<input type="email" value={form.email || ''} onChange={(event) => update('email', event.target.value)} maxLength="254" /></label>
        <label>Phone<input value={form.phone || ''} onChange={(event) => update('phone', event.target.value)} maxLength="48" /></label>
        <label className="admin-field-wide">Hero description<textarea value={form.hero_description || ''} onChange={(event) => update('hero_description', event.target.value)} rows="3" maxLength="1000" /></label>
        <label className="admin-field-wide">Profile introduction<textarea value={form.introduction || ''} onChange={(event) => update('introduction', event.target.value)} rows="6" maxLength="5000" /></label>
        <label className="admin-field-wide">Profile photo URL<input value={form.photo_url || ''} onChange={(event) => update('photo_url', event.target.value)} maxLength="500" /></label>
        <label className="admin-upload"><ImagePlus aria-hidden="true" /> {uploading ? 'UPLOADING...' : 'UPLOAD PROFILE PHOTO'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => event.target.files?.[0] && uploadPhoto(event.target.files[0])} /></label>
      </div>
    </form>
  )
}

function CollectionEditor({ config, items, onSave, onDelete }) {
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(config.initial)
  const [uploading, setUploading] = useState(false)
  const selected = items.find((item) => item.id === selectedId)

  function beginEdit(item) {
    setSelectedId(item.id)
    setForm(Object.fromEntries(config.fields.map((field) => {
      const value = item[field.key]
      return [field.key, field.type === 'list' ? (value || []).join('\n') : value ?? (field.type === 'checkbox' ? false : '')]
    })))
  }

  function beginNew() {
    setSelectedId(null)
    setForm({ ...config.initial })
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function preparePayload() {
    const payload = { ...form }
    for (const field of config.fields) {
      if (field.type === 'list') payload[field.key] = String(form[field.key] || '').split('\n').map((item) => item.trim()).filter(Boolean)
      if (field.type === 'number') payload[field.key] = Number(form[field.key] || 0)
    }
    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const id = selected?.id
    await onSave(`${config.endpoint}${id ? `/${id}` : ''}`, id ? 'PUT' : 'POST', preparePayload())
    beginNew()
  }

  async function uploadScreenshots(files) {
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(async (file) => {
        const body = new FormData()
        body.append('image', file)
        return resolveApiUrl((await saveAdminResource('/admin/uploads', 'POST', body)).url)
      }))
      setForm((current) => {
        const screenshots = `${current.screenshots || ''}${current.screenshots ? '\n' : ''}${urls.join('\n')}`
        return { ...current, screenshots, cover_image: current.cover_image || urls[0] }
      })
    } finally {
      setUploading(false)
    }
  }

  function renderField(field) {
    if (field.type === 'checkbox') {
      return <label className="admin-checkbox" key={field.key}><input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => update(field.key, event.target.checked)} />{field.label}</label>
    }
    const common = { id: field.key, value: form[field.key] ?? '', required: field.required, onChange: (event) => update(field.key, event.target.value) }
    if (field.type === 'textarea' || field.type === 'list') {
      return <label className={field.type === 'textarea' ? 'admin-field-wide' : ''} key={field.key}>{field.label}{field.type === 'textarea' ? <textarea {...common} rows="4" /> : <textarea {...common} rows="3" placeholder="One item per line" />}</label>
    }
    if (field.type === 'select') {
      return <label key={field.key}>{field.label}<select {...common}>{field.options.map((option) => <option key={option}>{option}</option>)}</select></label>
    }
    return <label key={field.key}>{field.label}<input {...common} type={field.type === 'number' ? 'number' : 'text'} min={field.type === 'number' ? 0 : undefined} /></label>
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
          {config === COLLECTIONS.projects && <label className="admin-upload"><ImagePlus aria-hidden="true" /> {uploading ? 'UPLOADING...' : 'UPLOAD PROJECT IMAGES'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={(event) => event.target.files?.length && uploadScreenshots(event.target.files)} /></label>}
          <button className="admin-primary" type="submit"><Save aria-hidden="true" /> {selected ? 'SAVE CHANGES' : 'CREATE ENTRY'}</button>
        </form>
      </div>
    </div>
  )
}

function InquiriesPanel({ inquiries, onUpdate, onDelete }) {
  return (
    <div className="admin-panel admin-table-section">
      <div className="admin-panel-heading"><div><h2>Customer inquiries</h2><p>{inquiries.length} recent inquiries</p></div></div>
      {inquiries.length ? inquiries.map((inquiry) => (
        <article className="inquiry-card" key={inquiry.id}>
          <div className="inquiry-card-header"><div><strong>{inquiry.name}</strong><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></div><span>{new Date(inquiry.created_at).toLocaleString()}</span></div>
          <p>{inquiry.message}</p>
          <div className="inquiry-card-footer"><span>{inquiry.service}{inquiry.budget ? ` · ${inquiry.budget}` : ''}{inquiry.phone ? ` · ${inquiry.phone}` : ''}</span><select aria-label={`Status for ${inquiry.name}`} value={inquiry.status} onChange={(event) => onUpdate(inquiry.id, event.target.value)}><option value="pending">Pending</option><option value="contacted">Contacted</option><option value="completed">Completed</option></select><button type="button" className="admin-icon-button is-danger" aria-label={`Delete inquiry from ${inquiry.name}`} onClick={() => onDelete(inquiry.id)}><Trash2 aria-hidden="true" /></button></div>
        </article>
      )) : <p className="admin-empty">No inquiries have been received.</p>}
    </div>
  )
}

function SettingsPanel() {
  return (
    <section className="admin-panel settings-panel">
      <p className="section-kicker">DESIGN SYSTEM</p>
      <h2>Site settings</h2>
      <p>The public site uses the existing Inter typography, ink and paper colors, and animated CODE aperture. Content updates cannot change those presentation rules.</p>
      <p>To change administrator access, create another administrator using the backend CLI. Public account registration is disabled.</p>
    </section>
  )
}