import Head from "next/head";
import { useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import { GraphQLClient, gql } from 'graphql-request'

import { About, Contact, Footer, Header, DevPortfolio, TopNav, DesignPortfolio } from "../layouts";
import { ChatBot, ContactDialog, LightBox } from "../components";

export default function Home({ devProjectData, designProjectData }) {

  const [logoLoaded, setLogoLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [images, setImages] = useState([])
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false)

  useEffect(() => {
    const currPos = window.scrollY
    if (currPos !== 0)
      animateScroll.scrollToTop()

    const timer = setTimeout(() => {
      animateScroll.scrollTo(currPos)
    }, 4250)

    const timer2 = setTimeout(() => {
      document.querySelector("body").classList.remove("overflow-y-hidden");
      document.querySelector("body").classList.add("md:overflow-y-auto");
      setLogoLoaded(true);

    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, []);
  

  return (
    <>
      <Head>
        <title>JRLND - Portfolio</title>
        <meta name="description" content="My personal full-stack developer portfolio"/>
      </Head>

      <TopNav />

      {!logoLoaded && (
        <div id="logo-bg" className="fixed inset-0 bg-theme-gray-900 z-40"></div>
      )}

      <div id="content" className="static transition duration-300 md:blur-none">
        
          <>
          
            <Header setDialogOpen={setDialogOpen} />

            <main>
              
              <About />

              <DevPortfolio projectData={devProjectData} setImages={setImages} setIsLightBoxOpen={setIsLightBoxOpen} />

              <DesignPortfolio projectData={designProjectData} setImages={setImages} setIsLightBoxOpen={setIsLightBoxOpen} />

              <Contact setDialogOpen={setDialogOpen} />

            </main>

            <Footer />

          </>

      </div>

      <ChatBot setDialogOpen={setDialogOpen} />

      <ContactDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />

      <LightBox images={images} isLightBoxOpen={isLightBoxOpen} setIsLightBoxOpen={setIsLightBoxOpen} /> 
    </>
  );
}

export const getStaticProps = async () => {

  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const cdaToken = process.env.CONTENTFUL_CDA_TOKEN

  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${spaceId}`

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${cdaToken}`,
    },
  })

  const devProjectsQuery = gql`
    {
      portfolioProjectsCollection{
        items{
          title
          description
          techStack
          previewUrl
          githubUrl
          hasDemo
          demoEmail
          demoPassword
          screenshotsCollection{
            items{
              url
              title
            }
          }
        }
      }
    }
  `

  const designProjectsQuery = gql`
    {
      portfolioDesignProjectCollection{
        items{
          title
          type
          screenshotsCollection{
            items{
              url
              title
            }
          }
        }
      }
    }
  `

  const devProjectsData = await graphQLClient.request(devProjectsQuery)
  const designProjectsData = await graphQLClient.request(designProjectsQuery)

  return { 
    props: {
      devProjectData: devProjectsData.portfolioProjectsCollection.items,
      designProjectData: designProjectsData.portfolioDesignProjectCollection.items
    }
  }

}
