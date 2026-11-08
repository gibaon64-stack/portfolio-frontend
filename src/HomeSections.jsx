import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { submitInquiry } from './api'
import { formatCurrencyKES, SERVICE_PRICING } from './pricingData'
import './HomeSections.css'

function safeUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

export function SiteNavigation() {
  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`

  return (
    <nav className="navigation" aria-label="Main navigation">
      <div className="navigation-links">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/projects" className={navLinkClass}>Projects</NavLink>
        <NavLink to="/services" className={navLinkClass}>Services</NavLink>
        <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
        <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
      </div>
      <NavLink to="/login" className="account-link" aria-label="Sign in" title="Sign in">
        <span aria-hidden="true">◌</span>
      </NavLink>
    </nav>
  )
}

export function AboutPage({ portfolio, loadError }) {
  const profile = portfolio?.profile || {}
  const intro = profile.about_intro || 'Welcome to Mabrixel Technologies, a world where dreams evolve into reality. Come, let\'s build together the software of your dreams: technology designed to solve your everyday problems and transform your ideas into reality.'

  return (
    <div className="page-shell">
      <SiteNavigation />
      <main className="page-layout page-layout-narrow">
        <header className="page-header">
          <p className="section-kicker">ABOUT US</p>
          <h1>Technology shaped around real-world needs.</h1>
        </header>

        {loadError && <p className="site-alert" role="status">{loadError}</p>}

        <section className="about-intro-card">
          <p>{intro}</p>
          {profile.photo_url && <img className="contact-image" src={profile.photo_url} alt={profile.name || 'Mabrixel Technologies'} loading="lazy" />}
        </section>

        <div className="story-grid">
          <article className="info-card">
            <p className="section-kicker">WHO WE ARE</p>
            <h2>Mabrixel Technologies</h2>
            <p>{profile.about_who_we_are || 'We are a technology company focused on building meaningful software, digital experiences, and practical solutions for businesses, founders, and organisations that need to move with confidence.'}</p>
          </article>

          <article className="info-card">
            <p className="section-kicker">OUR MISSION</p>
            <h2>Problem-solving through technology.</h2>
            <p>{profile.about_mission || 'Our mission is to create technology that solves real-world challenges, supports growth, and helps people operate more efficiently in a digital-first world.'}</p>
          </article>

          <article className="info-card info-card-wide">
            <p className="section-kicker">WHAT WE DO</p>
            <h2>Core capabilities</h2>
            {profile.about_what_we_do && <p>{profile.about_what_we_do}</p>}
            <ul className="tag-list">
              <li>Website Development</li>
              <li>Mobile Application Development</li>
              <li>Software Development</li>
              <li>POS Systems</li>
              <li>Digital Marketing</li>
              <li>Data Analysis</li>
              <li>Cybersecurity</li>
              <li>Video Editing and Creative Services</li>
            </ul>
          </article>

          <article className="info-card">
            <p className="section-kicker">OUR APPROACH</p>
            <h2>From requirements to delivery.</h2>
            <p>{profile.about_approach || 'We begin by understanding client requirements, planning strategic solutions, designing thoughtful experiences, developing and testing carefully, and delivering projects with clear communication and dependable support.'}</p>
          </article>

          <article className="info-card">
            <p className="section-kicker">WHY CHOOSE US</p>
            <h2>Practical, professional delivery.</h2>
            <p>{profile.about_why_choose_us || 'Innovative solutions, professional development standards, customer-focused project delivery, scalable technology, and reliable support continue to define how we work.'}</p>
          </article>
        </div>

        <section className="profile-strip">
          <div>
            <p className="section-kicker">FOUNDER</p>
            <h3>{profile.name || 'Ian Mabruk'}</h3>
          </div>
          <div>
            <p className="section-kicker">LOCATION</p>
            <p className="meta-copy">{profile.location || 'Kenya'}</p>
          </div>
        </section>
      </main>
    </div>
  )
}

function ProjectCard({ project }) {
  const liveUrl = safeUrl(project.live_url)
  return (
    <article className="project-row" key={project.id}>
      <div className="project-image-wrap">
        {project.cover_image ? (
          <img src={project.cover_image} alt={project.name} loading="lazy" />
        ) : (
          <span className="project-image-empty">{project.category}</span>
        )}
      </div>
      <div className="project-copy">
        <p className="section-kicker">{project.category}{project.status ? ` · ${project.status}` : ''}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ul className="technology-list" aria-label="Technologies used">
          {(project.technologies || []).map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        {(project.features?.length || project.challenges || project.solutions || project.screenshots?.length) && (
          <details className="project-details">
            <summary>PROJECT DETAILS</summary>
            {project.features?.length > 0 && (
              <div>
                <h4>Key features</h4>
                <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              </div>
            )}
            {project.challenges && (
              <div>
                <h4>Development challenges</h4>
                <p>{project.challenges}</p>
              </div>
            )}
            {project.solutions && (
              <div>
                <h4>Solutions implemented</h4>
                <p>{project.solutions}</p>
              </div>
            )}
            {project.screenshots?.length > 0 && (
              <div className="project-gallery">
                {project.screenshots.filter(safeUrl).map((src) => (
                  <img src={src} alt={`${project.name} screenshot`} loading="lazy" key={src} />
                ))}
              </div>
            )}
          </details>
        )}
      </div>
      <div className="project-links">
        {liveUrl && (
          <a className="project-link" href={liveUrl} target="_blank" rel="noreferrer">
            VIEW PROJECT <ArrowUpRight aria-hidden="true" />
          </a>
        )}
        {safeUrl(project.github_url) && (
          <a className="project-link" href={safeUrl(project.github_url)} target="_blank" rel="noreferrer">
            GITHUB <ArrowUpRight aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}

export function ProjectsPage({ portfolio, loadError }) {
  const projects = portfolio?.projects || []

  return (
    <div className="page-shell">
      <SiteNavigation />
      <main className="page-layout">
        <header className="page-header">
          <p className="section-kicker">PROJECTS</p>
          <h1>Selected work and digital products.</h1>
        </header>

        {loadError && <p className="site-alert" role="status">{loadError}</p>}

        {projects.length ? (
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard key={project.id || project.name} project={project} />
            ))}
          </div>
        ) : (
          <p className="empty-note">Projects will be listed here once they are ready to share.</p>
        )}
      </main>
    </div>
  )
}

export function ServicesPage({ portfolio, loadError }) {
  const [selectedStages, setSelectedStages] = useState({})

  const toggleStage = (serviceId, stageName) => {
    setSelectedStages((current) => {
      const next = { ...current }
      const selected = new Set(next[serviceId] || [])
      if (selected.has(stageName)) {
        selected.delete(stageName)
      } else {
        selected.add(stageName)
      }
      next[serviceId] = Array.from(selected)
      return next
    })
  }

  const serviceCards = useMemo(() => SERVICE_PRICING.map((card) => {
    const storedService = portfolio?.services?.find((service) => service.title === card.title)
    return storedService?.pricing ? { ...card, ...storedService.pricing, image_url: storedService.image_url } : card
  }), [portfolio?.services])

  return (
    <div className="page-shell">
      <SiteNavigation />
      <main className="page-layout page-layout-narrow">
        <header className="page-header">
          <p className="section-kicker">SERVICES</p>
          <h1>Transparent pricing for development and growth services.</h1>
        </header>

        {loadError && <p className="site-alert" role="status">{loadError}</p>}

        <div className="pricing-grid">
          {serviceCards.map((service) => {
            const chosenStages = selectedStages[service.id] || []
            const serviceTotal = service.stages.reduce((total, stage) => {
              return chosenStages.includes(stage.name) ? total + stage.cost : total
            }, service.startingPrice)

            return (
              <article className="service-card" key={service.id}>
                {service.image_url && <img className="service-image" src={service.image_url} alt="" loading="lazy" />}
                <div className="service-card-head">
                  <div>
                    <p className="section-kicker">{service.pricingModel}</p>
                    <h2>{service.title}</h2>
                  </div>
                  <span className="price-pill">{service.estimatedRange}</span>
                </div>

                <p className="service-description">{service.description}</p>

                <div className="pricing-meta">
                  <div>
                    <span className="meta-label">Starting from</span>
                    <strong>{formatCurrencyKES(service.startingPrice)}</strong>
                  </div>
                  <div>
                    <span className="meta-label">Timeline</span>
                    <strong>{service.timeline}</strong>
                  </div>
                </div>

                <div className="stage-list">
                  {service.stages.map((stage) => (
                    <label className="stage-item" key={stage.name}>
                      <input
                        type="checkbox"
                        checked={chosenStages.includes(stage.name)}
                        onChange={() => toggleStage(service.id, stage.name)}
                      />
                      <span>{stage.name}</span>
                      <strong>{formatCurrencyKES(stage.cost)}</strong>
                    </label>
                  ))}
                </div>

                <div className="estimate-box">
                  <span>Indicative estimate</span>
                  <strong>{formatCurrencyKES(serviceTotal)}</strong>
                </div>

                <div className="service-blocks">
                  <div>
                    <h3>Deliverables</h3>
                    <ul>
                      {service.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3>Optional add-ons</h3>
                    <ul>
                      {service.optionalAddOns.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="service-actions">
                  <Link className="primary-action" to={`/contact?service=${encodeURIComponent(service.title)}&budget=${encodeURIComponent(serviceTotal)}`}>
                    REQUEST A QUOTE
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {portfolio?.services?.length ? (
          <section className="service-compare-panel">
            <p className="section-kicker">EXISTING SERVICE DATA</p>
            <h2>Current catalogue</h2>
            <div className="service-matrix">
              {portfolio.services.map((service) => (
                <div key={service.id || service.title} className="service-row-compact">
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <ul>
                    {(service.capabilities || []).map((capability) => <li key={capability}>{capability}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

export function ContactPage({ portfolio, loadError }) {
  const [formState, setFormState] = useState('idle')
  const [formError, setFormError] = useState('')
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '')
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get('budget') || '')

  const services = portfolio?.services || []
  const serviceOptions = Array.from(new Set([
    ...services.map((service) => service.title),
    ...SERVICE_PRICING.map((service) => service.title),
  ]))
  const profile = portfolio?.profile || {}

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormState('submitting')
    setFormError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const inquiry = Object.fromEntries(formData.entries())
    inquiry.phone = inquiry.phone || null
    inquiry.budget = inquiry.budget || selectedBudget || null

    try {
      await submitInquiry(inquiry)
      form.reset()
      setSelectedService('')
      setSelectedBudget('')
      setFormState('success')
    } catch (error) {
      setFormState('error')
      setFormError(error.message)
    }
  }

  return (
    <div className="page-shell">
      <SiteNavigation />
      <main className="page-layout contact-page-layout">
        <header className="page-header">
          <p className="section-kicker">CONTACT US</p>
          <h1>Tell us about your next project.</h1>
        </header>

        {loadError && <p className="site-alert" role="status">{loadError}</p>}

        <section className="contact-page-grid">
          <div className="contact-panel">
            <p className="section-kicker">REACH OUT</p>
            <h2>Let&apos;s build what matters.</h2>
            {profile.contact_image_url && <img className="contact-image" src={profile.contact_image_url} alt="Mabrixel Technologies contact" loading="lazy" />}
            <div className="contact-details">
              {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
              {profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}</a>}
              {profile.location && <span>{profile.location}</span>}
            </div>
          </div>

          <form className="inquiry-form" onSubmit={handleSubmit}>
            <label>Full name<input name="name" autoComplete="name" required maxLength="120" /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" required maxLength="254" /></label>
            <label>Phone number<span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength="40" /></label>
            <label>Business name<span>(optional)</span><input name="business_name" maxLength="160" /></label>
            <label>Service required
              <select name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required>
                <option value="" disabled>Select a service</option>
                {serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
                <option value="Other">Other</option>
              </select>
            </label>
            <label>Estimated budget<input name="budget" value={selectedBudget} onChange={(event) => setSelectedBudget(event.target.value)} maxLength="80" /></label>
            <label>Preferred delivery timeline<input name="timeline" maxLength="120" /></label>
            <label className="form-wide">Project description<textarea name="message" required rows="5" maxLength="5000" /></label>
            <button className="submit-button" type="submit" disabled={formState === 'submitting'}>
              {formState === 'submitting' ? 'SENDING...' : 'SUBMIT INQUIRY'}
            </button>
            <p className="form-feedback" role="status">
              {formState === 'success' ? 'Thanks. Your inquiry has been received.' : formError}
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default function HomeSections({ portfolio, loadError }) {
  const [formState, setFormState] = useState('idle')
  const [formError, setFormError] = useState('')
  const [requestedService, setRequestedService] = useState('')

  const profile = portfolio?.profile
  const contact = portfolio?.contact || {}
  const services = portfolio?.services || []
  const journey = portfolio?.journey || []
  const projects = portfolio?.projects || []
  const socials = (portfolio?.social_links || []).filter((item) => safeUrl(item.url))

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setFormState('submitting')
    setFormError('')

    const formData = new FormData(form)
    const inquiry = Object.fromEntries(formData.entries())
    inquiry.phone = inquiry.phone || null
    inquiry.budget = inquiry.budget || null

    try {
      await submitInquiry(inquiry)
      form.reset()
      setRequestedService('')
      setFormState('success')
    } catch (error) {
      setFormState('error')
      setFormError(error.message)
    }
  }

  return (
    <div className="site-content">
      {loadError && <p className="site-alert" role="status">{loadError}</p>}

      <section className="content-section profile-section" id="home">
        <div className="section-heading">
          <p className="section-kicker">MABRIXEL TECHNOLOGIES</p>
          <h2>Ideas into useful software.</h2>
        </div>
        <div className="profile-layout">
          <div className="profile-photo-wrap">
            {profile?.photo_url ? (
              <img className="profile-photo" src={profile.photo_url} alt={profile.name || 'Ian Mabruk'} />
            ) : (
              <div className="profile-photo-empty" role="img" aria-label="Profile photograph not uploaded">
                <span>IM</span>
              </div>
            )}
          </div>
          <div className="profile-copy">
            <p className="section-kicker">SOFTWARE ENGINEER · FOUNDER</p>
            <h3>{profile?.name || 'Ian Mabruk'}</h3>
            <p>{profile?.introduction || 'Profile introduction has not been published yet.'}</p>
            {profile?.location && <p className="profile-location">{profile.location}</p>}
            <a className="text-link" href="#contact">
              LET&apos;S WORK TOGETHER <ArrowDownRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="content-section journey-section" id="journey">
        <div className="section-heading section-heading-row">
          <div>
            <p className="section-kicker">THE WORK BEHIND THE WORK</p>
            <h2>My Journey Into Technology</h2>
          </div>
          <p className="section-intro">A continuing practice of learning, building, and solving real problems with software.</p>
        </div>
        {journey.length ? (
          <ol className="journey-list">
            {journey.map((entry, index) => (
              <li className="journey-entry" key={entry.id || entry.title}>
                <span className="journey-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="section-kicker">{entry.period || 'MILESTONE'}</p>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-note">Journey milestones will appear here when published.</p>
        )}
      </section>

      <section className="content-section projects-section" id="projects">
        <div className="section-heading section-heading-row">
          <div>
            <p className="section-kicker">SELECTED WORK</p>
            <h2>Projects</h2>
          </div>
          <p className="section-intro">A selection of digital products and software solutions.</p>
        </div>
        {projects.length ? (
          <div className="project-list">
            {projects.map((project) => <ProjectCard key={project.id || project.name} project={project} />)}
          </div>
        ) : (
          <p className="empty-note">Projects will be listed here once they are ready to share.</p>
        )}
      </section>

      <section className="content-section services-section" id="services">
        <div className="section-heading section-heading-row">
          <div>
            <p className="section-kicker">WHAT WE CAN BUILD</p>
            <h2>Services</h2>
          </div>
          <p className="section-intro">Practical digital solutions, shaped around the people and businesses using them.</p>
        </div>
        {services.length ? (
          <div className="service-list">
            {services.map((service, index) => (
              <article className="service-row" key={service.id || service.title}>
                <span className="service-index">0{index + 1}</span>
                <div>
                  {service.image_url && <img className="service-image" src={service.image_url} alt="" loading="lazy" />}
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <ul>
                  {(service.capabilities || []).map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
                <a className="service-link" href="#contact" aria-label={`Get started with ${service.title}`} onClick={() => setRequestedService(service.title)}>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-note">Services will be listed here once they are published.</p>
        )}
      </section>

      <section className="content-section socials-section" id="socials">
        <div>
          <p className="section-kicker">FOLLOW THE WORK</p>
          <h2>Our Socials</h2>
        </div>
        <div className="social-list">
          {socials.map((social) => (
            <a key={social.id || social.platform} href={safeUrl(social.url)} target="_blank" rel="noreferrer">
              {social.platform} <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
          {!socials.length && <p className="empty-note">No social profiles are configured yet.</p>}
        </div>
      </section>

      <section className="content-section contact-section" id="contact">
        <div className="contact-heading">
          <p className="section-kicker">HAVE A PROJECT IN MIND?</p>
          <h2>Let&apos;s make it real.</h2>
          <p>Tell us what you are working on and we&apos;ll get back to you.</p>
          <div className="contact-details">
            {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            {contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
            {contact.location && <span>{contact.location}</span>}
          </div>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <label>Full name<input name="name" autoComplete="name" required maxLength="120" /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required maxLength="254" /></label>
          <label>Phone number <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength="40" /></label>
          <label>Business name <span>(optional)</span><input name="business_name" maxLength="160" /></label>
          <label>Service required
            <select name="service" required value={requestedService} onChange={(event) => setRequestedService(event.target.value)}>
              <option value="" disabled>Select a service</option>
              {services.map((service) => <option key={service.id || service.title} value={service.title}>{service.title}</option>)}
              <option value="Other">Other</option>
            </select>
          </label>
          <label>Project budget <span>(optional)</span><input name="budget" maxLength="80" /></label>
          <label>Preferred timeline <span>(optional)</span><input name="timeline" maxLength="120" /></label>
          <label className="form-wide">Project description<textarea name="message" required rows="4" maxLength="5000" /></label>
          <button className="submit-button" type="submit" disabled={formState === 'submitting'}>
            {formState === 'submitting' ? 'SENDING...' : 'SUBMIT INQUIRY'}
          </button>
          <p className="form-feedback" role="status">
            {formState === 'success' ? 'Thanks. Your inquiry has been received.' : formError}
          </p>
        </form>
      </section>
    </div>
  )
}
