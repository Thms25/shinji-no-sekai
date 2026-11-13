import { getPageContent } from '@/utils/db/content'
import { creditLines, creditText, normalizeHomeContent } from '@/utils/content/home-defaults'
import { localePath, orderedProjects, SITE_URL } from '@/lib/seo'

// Written from the same document as the pages, so it never drifts from them.
export const dynamic = 'force-dynamic'

/**
 * /llms.txt (llmstxt.org): the site in plain Markdown for AI assistants and
 * answer engines, who Shinji is, what he does, and who he has worked with.
 */
export async function GET() {
  const doc = await getPageContent('home').catch(() => null)
  const content = normalizeHomeContent(doc?.content)
  const { hero, about, live, cta } = content
  const name = `${hero.nameLead} ${hero.nameAccent}`.trim()
  const line = (parts: (string | undefined)[]) => parts.filter(Boolean).join(' — ')

  const projects = orderedProjects(content.projects).map(project => {
    const story = project.story.en || project.story.fr
    return `- ${line([project.title, creditLines(project.credits, 'en').map(creditText).join('; '), project.year])}${
      project.url ? ` (${project.url})` : ''
    }${story ? `\n  ${story.replace(/\s+/g, ' ')}` : ''}`
  })
  const liveWork = live.items.map(item => `- ${line([item.artist, creditLines(item.credits, 'en').map(creditText).join('; '), item.year])}`)

  const body = `# ${name} — Sekai Studios

> ${name} is a sound engineer based in Brussels, Belgium, working in the studio and on stage: recording, mixing, Dolby Atmos mixing and front-of-house (FOH) live sound. He works in French and English through his company Sekai Studios SRL.

${about.lead.en}

${about.paragraph1.en}

${about.paragraph2.en}

## Services

- Recording
- Mixing, including Dolby Atmos
- Front-of-house (FOH) engineering for tours and concerts

## Studio projects

${projects.join('\n')}

## Live work

${liveWork.join('\n')}

## Contact

- Email: ${cta.email}${cta.instagram ? `\n- Instagram: ${cta.instagram}` : ''}
- Based in Brussels, Belgium; works across Europe

## Pages

- [Home (French)](${SITE_URL}${localePath('fr', '/')}): about, selected studio and live work, contact
- [Home (English)](${SITE_URL}${localePath('en', '/')})
- [Projects (French)](${SITE_URL}${localePath('fr', '/projects')}): every studio project
- [Projects (English)](${SITE_URL}${localePath('en', '/projects')})
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
