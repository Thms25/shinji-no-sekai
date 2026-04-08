import type {
  HomePageContent,
  WorkPageContent,
  WorkArtist,
  BioPageContent,
  ContactPageContent,
} from '@/utils/db/content'

export type TabId = 'home' | 'bio'

export const DEFAULT_HOME_CONTENT: HomePageContent = {
  headline: 'SHINJI NO SEKAI',
  subheadline:
    'Audio Engineer & Sound Designer based in Brussels. Crafting immersive sonic experiences.',
  keyValues: [
    { title: 'Human connection', description: 'The prerequisite to everything else.' },
    { title: 'Vision first', description: 'Understand the story before touching the sound.' },
    { title: 'Full commitment', description: 'Every project is the only one that counts.' },
    { title: 'Earned trust', description: 'Built slowly, session by session.' },
  ],
}

export const EMPTY_WORK_ARTIST: WorkArtist = {
  name: '',
  description: '',
  roles: [],
  image: '',
  spotify_id: '',
  spotify_url: '',
}

export const DEFAULT_WORK_CONTENT: WorkPageContent = {
  artists: [],
}

export const DEFAULT_BIO_CONTENT: BioPageContent = {
  title: 'Shinji No Sekai',
  image: '/images/shinji_home_studio.jpg',
  paragraph1:
    'I am an audio engineer dedicated to finding the perfect sound. My journey began in the analog era and has evolved into the digital realm, blending classic techniques with modern innovation.',
  paragraph2:
    'Based in Tokyo, I work with artists from around the globe to bring their sonic visions to life. From mixing and mastering to full-scale production, I treat every project with the precision and passion it deserves.',
}

export const DEFAULT_CONTACT_CONTENT: ContactPageContent = {
  heading: 'Get in Touch',
  subtext: 'Ready to start your next project? Send me a message.',
}

export const TAB_LABELS: [TabId, string][] = [
  ['home', 'Home Page'],
  ['bio', 'Bio'],
]
