import { createRouter, createWebHistory } from 'vue-router'
import Loader from '../views/Loader.vue'
import Office from '../views/Office.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Loader,
      meta: {
        title: 'Matěj Klíma | Hovado',
        metaTags: [
          {
            rel: 'canonical',
            href: 'https://matejklima.com/'
          },
          {
            name: 'title',
            content: 'Matěj Klíma | Hovado'
          },
          {
            name: 'description',
            content: 'Personal portfolio and website of Matěj Klíma — developer, alcoholic, and creative.'
          },
          {
            name: 'keywords',
            content: 'Matěj Klíma, portfolio, web developer, full stack, mobile applications, Flutter, Go, Alcohol'
          },
          {
            name: 'author',
            content: 'Matěj Klíma'
          },
          {
            name: 'robots',
            content: 'index, follow'
          },
          {
            name: 'theme-color',
            content: '#000000'
          },
          {
            name: 'mobile-web-app-capable',
            content: 'yes'
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
          },
          {
            name: 'apple-mobile-web-app-title',
            content: 'Matěj Klíma | Hovado'
          },
          {
            name: 'application-name',
            content: 'Matěj Klíma | Hovado'
          },
          {
            name: 'twitter:card',
            content: 'summary_large_image'
          },
          {
            name: 'twitter:title',
            content: 'Matěj Klíma | Hovado'
          },
          {
            name: 'twitter:description',
            content: 'Personal portfolio and website of Matěj Klíma — developer, alcoholic, and creative.'
          },
          {
            name: 'twitter:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            name: 'twitter:image:alt',
            content: 'Matěj Klíma'
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:title',
            content: 'Matěj Klíma | Hovado'
          },
          {
            property: 'og:description',
            content: 'Personal portfolio and website of Matěj Klíma — developer, alcoholic, and creative.'
          },
          {
            property: 'og:site_name',
            content: 'Matěj Klíma | Hovado'
          },
          {
            property: 'og:url',
            content: 'https://matejklima.com/'
          },
          {
            property: 'og:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            property: 'og:image:alt',
            content: 'Matěj Klíma'
          },
          {
            property: 'og:locale',
            content: 'en_US'
          }
        ]
      }
    },
    {
      path: '/office',
      name: 'Office',
      component: Office,
      meta: {
        title: 'Desktop | Matěj Klíma',
        metaTags: [
          {
            rel: 'canonical',
            href: 'https://matejklima.com/office'
          },
          {
            name: 'title',
            content: 'Desktop | Matěj Klíma'
          },
          {
            name: 'description',
            content: 'Personal portfolio and website of Matěj Klíma — developer, alcoholic, and creative.'
          },
          {
            name: 'keywords',
            content: 'Matěj Klíma, portfolio, web developer, full stack, mobile applications, Flutter, Go, Alcohol'
          },
          {
            name: 'author',
            content: 'Matěj Klíma'
          },
          {
            name: 'robots',
            content: 'index, follow'
          },
          {
            name: 'theme-color',
            content: '#000000'
          },
          {
            name: 'mobile-web-app-capable',
            content: 'yes'
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
          },
          {
            name: 'apple-mobile-web-app-title',
            content: 'Desktop | Matěj Klíma'
          },
          {
            name: 'application-name',
            content: 'Matěj Klíma | Hovado'
          },
          {
            name: 'twitter:card',
            content: 'summary_large_image'
          },
          {
            name: 'twitter:title',
            content: 'Desktop | Matěj Klíma'
          },
          {
            name: 'twitter:description',
            content: 'Personal portfolio and website of Matěj Klíma — developer, alcoholic, and creative.'
          },
          {
            name: 'twitter:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            name: 'twitter:image:alt',
            content: 'Matěj Klíma'
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:title',
            content: 'Desktop | Matěj Klíma'
          },
          {
            property: 'og:description',
            content: 'Personal portfolio and website of Matěj Klíma — developer, alcoholic, and creative.'
          },
          {
            property: 'og:site_name',
            content: 'Matěj Klíma | Hovado'
          },
          {
            property: 'og:url',
            content: 'https://matejklima.com/office'
          },
          {
            property: 'og:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            property: 'og:image:alt',
            content: 'Matěj Klíma'
          },
          {
            property: 'og:locale',
            content: 'en_US'
          }
        ]
      }
    }
  ]
})

export default router
