import { ArrowUpRight } from 'lucide-react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
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

export function SiteNavigation() {
  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`

  return (
    <nav className="navigation" aria-label="Main navigation">
      <div className="navigation-links">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/projects" className={navLinkClass}>Coding</NavLink>
        <NavLink to="/services" className={navLinkClass}>Let&apos;s Code</NavLink>
        <NavLink to="/contact" className={navLinkClass}>Inquiry</NavLink>
        <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
      </div>
    </nav>
  )
}

export function ProfilePage({ portfolio, loadError }) {
  const profile = portfolio?.profile || {}
  const journey = portfolio?.journey || []
  const socials = (portfolio?.social_links || []).filter((item) => safeUrl(item.url))

  return (
    <div className="page-shell">
      <SiteNavigation />
      <main className="page-layout profile-page">
        <header className="page-header">
          <p className="section-kicker">PROFILE</p>
          <h1>A little about the person behind the work.</h1>
        </header>
        {loadError && <p className="site-alert" role="status">{loadError}</p>}

        <section className="profile-hero-card">
          <div className="profile-page-image">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={profile.name || 'Professional profile'} />
            ) : <span aria-hidden="true">IM</span>}
          </div>
          <div className="profile-page-intro">
            <p className="section-kicker">{profile.location || 'KENYA'}</p>
            <h2>{profile.name || 'Ian Mabruk'}</h2>
            <p className="profile-title">{profile.professional_title || 'Software Engineer · Founder'}</p>
            <p>{profile.introduction || profile.about_intro || 'Professional profile information will be added soon.'}</p>
            <div className="profile-contact-links">
              {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
              {profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}</a>}
              {socials.map((social) => (
                <a key={social.id || social.platform} href={safeUrl(social.url)} target="_blank" rel="noreferrer">
                  {social.platform} <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {profile.skills?.length > 0 && (
          <section className="profile-detail-section">
            <div className="section-heading">
              <p className="section-kicker">SKILLS & TECHNOLOGIES</p>
              <h2>Tools for thoughtful solutions.</h2>
            </div>
            <ul className="profile-skill-list">{profile.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </section>
        )}

        <div className="profile-record-grid">
          {[
            ['PROFESSIONAL EXPERIENCE', profile.experience],
            ['EDUCATION', profile.education],
            ['CERTIFICATIONS', profile.certifications],
          ].map(([title, entries]) => (
            <section className="profile-record-section" key={title}>
              <p className="section-kicker">{title}</p>
              {entries?.length ? (
                <ul>{entries.map((entry) => <li key={entry}>{entry}</li>)}</ul>
              ) : <p className="empty-note">Details will be added here.</p>}
            </section>
          ))}
        </div>

        <section className="profile-detail-section">
          <div className="section-heading">
            <p className="section-kicker">THE JOURNEY</p>
            <h2>Learning, building, and growing.</h2>
          </div>
          {journey.length ? (
            <ol className="journey-list">
              {journey.map((entry, index) => (
                <li className="journey-entry" key={entry.id || entry.title}>
                  <span className="journey-index">{String(index + 1).padStart(2, '0')}</span>
                  <div><p className="section-kicker">{entry.period || 'MILESTONE'}</p><h3>{entry.title}</h3><p>{entry.description}</p></div>
                  <ArrowUpRight aria-hidden="true" />
                </li>
              ))}
            </ol>
          ) : <p className="empty-note">Journey milestones will appear here when published.</p>}
        </section>
      </main>
    </div>
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
    <article className={`project-row${project.featured ? ' is-featured' : ''}`} key={project.id}>
      <div className="project-image-wrap">
        {project.cover_image ? (
          <img src={project.cover_image} alt={project.name} loading="lazy" />
        ) : (
          <span className="project-image-empty">{project.category}</span>
        )}
      </div>
      <div className="project-copy">
        <p className="section-kicker">{project.category}{project.featured ? ' · FEATURED' : ''}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ul className="technology-list" aria-label="Technologies used">
          {(project.technologies || []).map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        {(project.detailed_description || project.features?.length || project.challenges || project.solutions || project.screenshots?.length) && (
          <details className="project-details">
            <summary>PROJECT DETAILS</summary>
            {project.detailed_description && <p>{project.detailed_description}</p>}
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
  const projects = [...(portfolio?.projects || [])].sort((first, second) => Number(second.featured) - Number(first.featured))

  return (
    <div className="page-shell">
      <SiteNavigation />
      <main className="page-layout">
        <header className="page-header">
          <p className="section-kicker">PROJECTS</p>
          <h1>Selected work and digital products.</h1>
          <p className="page-header-intro">Each project is presented with its own live destination, tools, and story.</p>
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

const WEBSITE_OPTIONS = [
  {
    name: 'Informative / Business Websites',
    description: 'A clear online home for a business, company, professional, or service.',
    audience: 'Businesses, organisations, service providers, and professionals who need a credible web presence.',
    features: ['Business landing pages', 'Corporate websites', 'Personal portfolio websites', 'Company profile websites', 'Service-based websites'],
    functional: 'Agree the pages, information structure, contact actions, and any content editing needs before development.',
    design: 'Responsive layouts, clear brand presentation, readable content, and navigation suited to the audience.',
    backend: 'A backend or CMS is scoped only when content management, forms, or other server-side features are required.',
    addOns: ['Content management', 'Additional integrations', 'Maintenance and support'],
    scope: 'A focused website with agreed pages and responsive layouts.',
    price: 'Starting from KES 15,000',
  },
  {
    name: 'E-commerce Websites',
    description: 'Online storefronts for presenting products and managing customer orders.',
    audience: 'Businesses that need to display products and receive orders online.',
    features: ['Product catalogues', 'Shopping carts', 'Customer accounts', 'Online payments', 'Order management', 'Product management'],
    functional: 'Product and inventory workflows, checkout, payment-provider requirements, customer accounts, and order handling.',
    design: 'Product discovery, clear product details, accessible checkout, and mobile-friendly purchasing.',
    backend: 'Product, account, and order data storage plus payment and notification integrations as scoped.',
    addOns: ['Additional payment methods', 'Inventory integrations', 'Reporting and automation'],
    scope: 'Custom scope based on catalogue size, payment flow, integrations, and operational needs.',
    price: 'Custom quotation based on requirements',
  },
  {
    name: 'Web Applications',
    description: 'Interactive browser-based systems for customers, teams, and business operations.',
    audience: 'Teams and businesses with workflows that need more than a content-focused website.',
    features: ['Business management systems', 'SaaS platforms', 'Customer portals', 'Booking platforms', 'Custom web-based systems'],
    functional: 'User roles, core workflows, reporting needs, external integrations, and operational rules are defined during discovery.',
    design: 'Task-focused interfaces, accessible forms, clear system feedback, and responsive dashboards.',
    backend: 'Application APIs, authentication, and database requirements depend on the agreed workflows.',
    addOns: ['Third-party integrations', 'Reporting dashboards', 'Role-based access'],
    scope: 'Custom quotation based on complexity',
    price: 'Custom quotation based on complexity',
  },
  {
    name: 'Portfolio and Personal Websites',
    description: 'A focused personal brand and work showcase tailored to a professional or creator.',
    audience: 'Developers, creatives, consultants, and professionals who want a dedicated portfolio.',
    features: ['Professional portfolios', 'Personal branding websites', 'Developer portfolios', 'Creative portfolios'],
    functional: 'Agree profile content, project details, contact methods, and any portfolio filtering or editing needs.',
    design: 'A visual system that presents work clearly and adapts to phones, tablets, and desktops.',
    backend: 'A CMS or backend is optional and depends on whether the owner needs to update content independently.',
    addOns: ['Project case studies', 'Content management', 'Contact integrations'],
    scope: 'Custom quotation based on requirements',
    price: 'Custom quotation based on requirements',
  },
]

const APPLICATION_OPTIONS = [
  {
    name: 'Business Applications',
    description: 'Operational software for the daily processes that keep a business moving.',
    features: ['Inventory management', 'POS systems', 'Business management applications', 'Customer management systems'],
    requirements: 'Define users and roles, the required technology constraints, business workflows, backend services, database records, reporting needs, integrations, and deployment environment.',
    pricing: 'Request a custom quote',
  },
  {
    name: 'Mobile Applications',
    description: 'Mobile products designed for customers, staff, or field teams.',
    features: ['Android applications', 'iOS applications', 'Cross-platform applications'],
    requirements: 'Confirm target platforms, device capabilities, account and data flows, backend APIs, database needs, notifications, and required integrations.',
    pricing: 'Request a custom quote',
  },
  {
    name: 'Custom Applications',
    description: 'Bespoke digital products for unique or evolving requirements.',
    features: ['SaaS applications', 'Enterprise applications', 'Custom software solutions', 'API-integrated applications'],
    requirements: 'Scope product roles, key workflows, security and access, technology constraints, database design, APIs, integrations, and operational requirements.',
    pricing: 'Request a custom quote',
  },
]

const DIGITAL_MARKETING_PACKAGES = [
  { name: 'BRONZE', price: 12000 },
  { name: 'SILVER', price: 16000 },
  { name: 'GOLD', price: 22000 },
]

function RequirementList({ title, items }) {
  return <div className="requirement-list"><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
}

export function ServicesPage({ portfolio, loadError }) {
  const marketingService = portfolio?.services?.find((service) => service.title.toLowerCase() === 'digital marketing')
  const configuredPackages = marketingService?.pricing?.packages || []
  const marketingCapabilities = marketingService?.capabilities || []

  return (
    <div className="page-shell">
      <SiteNavigation />
      <main className="page-layout services-page">
        <header className="page-header">
          <p className="section-kicker">SERVICES</p>
          <h1>Choose a direction. We&apos;ll shape the right solution.</h1>
          <p className="page-header-intro">Explore website development, application development, and digital marketing. Requirements and estimates are made clear before work begins.</p>
        </header>
        {loadError && <p className="site-alert" role="status">{loadError}</p>}

        <nav className="service-category-nav" aria-label="Service categories">
          <a href="#website-development">Website Development</a>
          <a href="#application-development">Application Development</a>
          <a href="#digital-marketing">Digital Marketing</a>
        </nav>

        <section className="services-category" id="website-development">
          <header className="category-heading">
            <p className="section-kicker">01 · BUILD FOR THE WEB</p>
            <h2>Website Development</h2>
            <p>From business websites to custom online stores, start with the website type that fits your needs.</p>
          </header>
          <div className="service-option-grid">
            {WEBSITE_OPTIONS.map((option) => (
              <article className="service-option-card" key={option.name}>
                <p className="section-kicker">WEBSITE TYPE</p>
                <h3>{option.name}</h3>
                <p>{option.description}</p>
                <strong className="service-option-price">{option.price}</strong>
                <details className="requirements-details">
                  <summary>View Website Requirements</summary>
                  <div className="requirements-content">
                    <p><strong>Who needs it</strong>{option.audience}</p>
                    <RequirementList title="Features" items={option.features} />
                    <p><strong>Functional requirements</strong>{option.functional}</p>
                    <p><strong>Design requirements</strong>{option.design}</p>
                    <p><strong>Backend requirements</strong>{option.backend}</p>
                    <RequirementList title="Optional additions" items={option.addOns} />
                    <p><strong>Estimated scope</strong>{option.scope}</p>
                    <Link className="service-cta" to={`/contact?service=${encodeURIComponent(option.name)}&budget=${encodeURIComponent(option.price)}`}>Discuss this website <ArrowUpRight aria-hidden="true" /></Link>
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section className="services-category" id="application-development">
          <header className="category-heading">
            <p className="section-kicker">02 · BUILD A PRODUCT</p>
            <h2>Application Development</h2>
            <p>Custom application pricing is based on the product requirements, technical scope, and delivery complexity.</p>
          </header>
          <div className="service-option-grid">
            {APPLICATION_OPTIONS.map((option) => (
              <article className="service-option-card" key={option.name}>
                <p className="section-kicker">APPLICATION TYPE</p>
                <h3>{option.name}</h3>
                <p>{option.description}</p>
                <RequirementList title="What we can build" items={option.features} />
                <details className="requirements-details">
                  <summary>View Requirements</summary>
                  <div className="requirements-content">
                    <p>{option.requirements}</p>
                    <p><strong>Pricing</strong>{option.pricing} after requirements and complexity are understood.</p>
                  </div>
                </details>
                <Link className="service-cta" to={`/contact?service=${encodeURIComponent(option.name)}&budget=${encodeURIComponent('Custom quote')}`}>Request a custom quote <ArrowUpRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="services-category marketing-category" id="digital-marketing">
          <header className="category-heading">
            <p className="section-kicker">03 · GROW YOUR DIGITAL PRESENCE</p>
            <h2>Digital Marketing</h2>
            <p>{marketingService?.description || 'Choose a package to start a conversation about the right scope for your marketing goals.'}</p>
          </header>
          <div className="marketing-package-grid">
            {DIGITAL_MARKETING_PACKAGES.map((basePackage) => {
              const configured = configuredPackages.find((item) => item.name === basePackage.name)
              const packageName = basePackage.name.charAt(0) + basePackage.name.slice(1).toLowerCase()
              return (
                <article className={`marketing-package-card package-${packageName.toLowerCase()}`} key={basePackage.name}>
                  <p className="section-kicker">DIGITAL MARKETING</p>
                  <h3>{packageName}</h3>
                  <p>{configured?.description || 'Package scope and campaign fit are confirmed with you before booking.'}</p>
                  <p className="marketing-price"><span>KES</span> {basePackage.price.toLocaleString('en-KE')}</p>
                  <ul className="package-facts">
                    <li><strong>Platforms</strong><span>{configured?.platform_count ? `${configured.platform_count} platforms` : 'To be confirmed'}</span></li>
                    <li><strong>Content creation</strong><span>{configured?.content_details || 'Details to be confirmed'}</span></li>
                    <li><strong>Marketing management</strong><span>{configured?.management_details || 'Details to be confirmed'}</span></li>
                  </ul>
                  <div className="package-inclusions">
                    <strong>Included services</strong>
                    {configured?.included_services?.length ? (
                      <ul>{configured.included_services.map((service) => <li key={service}>{service}</li>)}</ul>
                    ) : <p>Confirm package inclusions during your inquiry.</p>}
                  </div>
                  <Link className="service-cta" to={`/contact?service=${encodeURIComponent(`Digital Marketing — ${packageName} Package`)}&budget=${encodeURIComponent(`KES ${basePackage.price.toLocaleString('en-KE')}`)}`}>Request package <ArrowUpRight aria-hidden="true" /></Link>
                </article>
              )
            })}
          </div>
          {marketingCapabilities.length > 0 && (
            <div className="marketing-capabilities">
              <p className="section-kicker">AVAILABLE SERVICE AREAS</p>
              <ul>{marketingCapabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
            </div>
          )}
        </section>
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
  const serviceOptions = Array.from(new Set([...services.map((service) => service.title), selectedService].filter(Boolean)))
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
