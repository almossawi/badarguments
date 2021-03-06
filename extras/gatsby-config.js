module.exports = {
  pathPrefix: `/extras`,
  siteMetadata: {
    title: `Work in Progress`,
    name: `Work in Progress`,
    siteUrl: `https://bookofbadarguments.com`,
    description: `In your hands is an illustrated guide to the subtle ways in which language influences our thinking. In ten sections, and accompanied by charming illustrations (all of me), you'll learn plenty of examples of how the language we consume in our news, in our politics, and in our everyday lives shapes how we perceive the world around us. Examples include language that prevaricates, language that conceals with vagueness, and language that feigns objectivity with neutrality.`,
    hero: {
      heading: `Work in progress.`,
      maxWidth: 652,
    },
    social: [
      {
        name: `instagram`,
        url: `https://instagram.com/almossawi`,
      },
      {
        name: `twitter`,
        url: `https://twitter.com/alialmossawi`,
      },
      {
        name: `website`,
        url: `https://almossawi.com`,
      },
      {
        name: `github`,
        url: `https://github.com/almossawi/badarguments`
      }
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        mailchimp: true,
        sources: {
          local: true,
          // contentful: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: 'https://almossawi.us7.list-manage.com/subscribe/post?u=9c4dbd8f3e2d9a588cfe43dae&amp;id=3c89277de1',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-42350635-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Defers execution of google analytics script after page load
        defer: false,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: `100`,
              icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
              className: `custom-class`,
              maintainCase: true,
              removeAccents: true,
              isIconAfterHeader: true,
              elements: [`h1`, `h4`],
            },
          },
        ],
      },
    },
  ],
};
