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
        title: 'Portfolio | Web Developer',
        metaTags: [
          {
            rel: 'canonical',
            href: ''
          },
          {
            name: 'title',
            content: 'Portfolio | Web Developer'
          },
          {
            name: 'description',
            content:
              'Discover the portfolio of a passionate full stack web developer. Creating websites and web/mobile applications with JS, PHP, SQL and their frameworks, as well as DevOps.'
          },
          {
            name: 'keywords',
            content: 'portfolio, web developer, full stack, websites, web applications, mobile applications, JS, PHP, SQL, ORM, frameworks, DevOps'
          },
          {
            name: 'author',
            content: 'Portfolio'
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
            content: 'Portfolio | Web Developer'
          },
          {
            name: 'application-name',
            content: 'Portfolio | Web Developer'
          },
          {
            name: 'twitter:card',
            content: 'summary'
          },
          {
            name: 'twitter:title',
            content: 'Portfolio | Web Developer'
          },
          {
            name: 'twitter:description',
            content:
              'Discover the portfolio of a passionate full stack web developer. Creating websites and web/mobile applications with JS, PHP, SQL and their frameworks, as well as DevOps.'
          },
          {
            name: 'twitter:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            name: 'twitter:image:alt',
            content: 'Logo Portfolio'
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:title',
            content: 'Portfolio | Web Developer'
          },
          {
            property: 'og:description',
            content:
              'Discover the portfolio of a passionate full stack web developer. Creating websites and web/mobile applications with JS, PHP, SQL and their frameworks, as well as DevOps.'
          },
          {
            property: 'og:site_name',
            content: 'Portfolio | Web Developer'
          },
          {
            property: 'og:url',
            content: ''
          },
          {
            property: 'og:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            property: 'og:image:alt',
            content: 'Logo Portfolio'
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
        title: 'Desktop | Web Developer',
        metaTags: [
          {
            rel: 'canonical',
            href: '/office'
          },
          {
            name: 'title',
            content: 'Desktop | Web Developer'
          },
          {
            name: 'description',
            content:
              'Discover the desktop of a passionate full stack web developer. Creating websites and web/mobile applications with JS, PHP, SQL and their frameworks, as well as DevOps.'
          },
          {
            name: 'keywords',
            content: 'desktop, web developer, full stack, websites, web applications, mobile applications, JS, PHP, SQL, ORM, frameworks, DevOps'
          },
          {
            name: 'author',
            content: 'Portfolio'
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
            content: 'Desktop | Web Developer'
          },
          {
            name: 'application-name',
            content: 'Desktop | Web Developer'
          },
          {
            name: 'twitter:card',
            content: 'summary'
          },
          {
            name: 'twitter:title',
            content: 'Desktop | Web Developer'
          },
          {
            name: 'twitter:description',
            content:
              'Discover the desktop of a passionate full stack web developer. Creating websites and web/mobile applications with JS, PHP, SQL and their frameworks, as well as DevOps.'
          },
          {
            name: 'twitter:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            name: 'twitter:image:alt',
            content: 'Logo Portfolio'
          },
          {
            name: 'og:type',
            content: 'website'
          },
          {
            name: 'og:title',
            content: 'Desktop | Web Developer'
          },
          {
            name: 'og:description',
            content:
              'Discover the desktop of a passionate full stack web developer. Creating websites and web/mobile applications with JS, PHP, SQL and their frameworks, as well as DevOps.'
          },
          {
            name: 'og:site_name',
            content: 'Desktop | Web Developer'
          },
          {
            name: 'og:url',
            content: '/office'
          },
          {
            name: 'og:image',
            content: '/img/logo-portfolio-black.webp'
          },
          {
            name: 'og:image:alt',
            content: 'Logo Portfolio'
          },
          {
            name: 'og:locale',
            content: 'en_US'
          }
        ]
      }
    }
  ]
})

export default router
