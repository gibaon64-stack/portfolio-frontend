import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { submitInquiry } from './api'
import './HomeSections.css'

function safeUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
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
            {projects.map((project) => {
              const liveUrl = safeUrl(project.live_url)
              return (
                <article className="project-row" key={project.id}>
                  <div className="project-image-wrap">
                    {project.cover_image ? (
                      <img src={project.cover_image} alt="" loading="lazy" />
                    ) : <span className="project-image-empty">{project.category}</span>}
                  </div>
                  <div className="project-copy">
                    <p className="section-kicker">{project.category} {project.status && `· ${project.status}`}</p>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <ul className="technology-list" aria-label="Technologies used">
                      {(project.technologies || []).map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                    {(project.features?.length || project.challenges || project.solutions || project.screenshots?.length) ? (
                      <details className="project-details">
                        <summary>PROJECT DETAILS</summary>
                        {project.features?.length > 0 && <div><h4>Key features</h4><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>}
                        {project.challenges && <div><h4>Development challenges</h4><p>{project.challenges}</p></div>}
                        {project.solutions && <div><h4>Solutions implemented</h4><p>{project.solutions}</p></div>}
                        {project.screenshots?.length > 0 && <div className="project-gallery">{project.screenshots.filter(safeUrl).map((src) => <img src={src} alt={`${project.name} screenshot`} loading="lazy" key={src} />)}</div>}
                      </details>
                    ) : null}
                  </div>
                    <div className="project-links">
                      {liveUrl && <a className="project-link" href={liveUrl} target="_blank" rel="noreferrer">VIEW PROJECT <ArrowUpRight aria-hidden="true" /></a>}
                      {safeUrl(project.github_url) && <a className="project-link" href={safeUrl(project.github_url)} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight aria-hidden="true" /></a>}
                    </div>
                </article>
              )
            })}
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
          <label>Service required
            <select name="service" required value={requestedService} onChange={(event) => setRequestedService(event.target.value)}>
              <option value="" disabled>Select a service</option>
              {services.map((service) => <option key={service.id || service.title} value={service.title}>{service.title}</option>)}
              <option value="Other">Other</option>
            </select>
          </label>
          <label>Project budget <span>(optional)</span><input name="budget" maxLength="80" /></label>
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