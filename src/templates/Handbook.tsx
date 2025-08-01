import { MDXProvider } from '@mdx-js/react'
import { useLocation } from '@reach/router'
import { Blockquote } from 'components/BlockQuote'
import { MdxCodeBlock } from 'components/CodeBlock'
import { Heading } from 'components/Heading'
import { InlineCode } from 'components/InlineCode'
import Layout from 'components/Layout'
import Link from 'components/Link'
import PostLayout from 'components/PostLayout'
import SidebarSection from 'components/PostLayout/SidebarSection'
import { SEO } from 'components/seo'
import Team from 'components/People'
import TestimonialsTable from 'components/TestimonialsTable'
import { ZoomImage } from 'components/ZoomImage'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React, { useState } from 'react'
import { shortcodes } from '../mdxGlobalComponents'
import MobileSidebar from 'components/Docs/MobileSidebar'
import LibraryFeatures from 'components/LibraryFeatures'
import { GitHub } from 'components/Icons/Icons'
import { getCookie } from 'lib/utils'
import { CallToAction } from 'components/CallToAction'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Tooltip from 'components/Tooltip'
import CommunityQuestions from 'components/CommunityQuestions'
import { formatNode } from 'components/GlossaryElement'
import Markdown from 'markdown-to-jsx'
import CheckIcon from '../images/check.svg'
import XIcon from '../images/x.svg'
import WarningIcon from '../images/warning.svg'
import TeamRoadmap from 'components/TeamRoadmap'
import TeamMembers from 'components/TeamMembers'
import { CategoryData } from 'components/Blog/constants/categories'
import { TutorialTags } from 'components/Tutorials/constants/tags'
import { Emoji } from 'components/Emoji'
import TeamUpdate from 'components/TeamUpdate'
import CopyCode from 'components/CopyCode'
import TeamMember from 'components/TeamMember'
import { Contributor, ContributorImageSmall } from 'components/PostLayout/Contributors'
import { OverflowXSection } from 'components/OverflowXSection'
import APIExamples from 'components/Product/Pipelines/APIExamples'
import Configuration from 'components/Product/Pipelines/Configuration'
import { IconCheck } from '@posthog/icons'
import { CopyMarkdownActionsDropdown } from 'components/MarkdownActionsDropdown'
import IsEU from 'components/IsEU'
import IsUS from 'components/IsUS'

const DestinationsLibraryCallout = () => {
    return (
        <div className="p-4 mb-4 rounded-md border bg-accent dark:bg-accent-dark border-border dark:border-dark">
            <h2 className="font-bold text-lg leading-tight !m-0">Did somebody say destinations?</h2>
            <p className="m-0 !mb-3 !mt-1.5">
                We're building new destinations and want your input on what to build next.
            </p>
            <CallToAction to="/cdp#library" size="sm">
                Browse the library
            </CallToAction>
        </div>
    )
}

const renderAvailabilityIcon = (availability: 'full' | 'partial' | 'none') => {
    switch (availability) {
        case 'full':
            return (
                <Tooltip content="This plan has full access to this feature">
                    <img src={CheckIcon} alt="Available" className="w-4 h-4" aria-hidden="true" />
                </Tooltip>
            )
        case 'partial':
            return (
                <Tooltip content="Some parts of this feature are not available on this plan">
                    <img src={WarningIcon} alt="Partially available" className="w-4 h-4" aria-hidden="true" />
                </Tooltip>
            )
        case 'none':
            return (
                <Tooltip content="This feature is not available on this plan">
                    <img src={XIcon} alt="Not available" className="w-4 h-4" aria-hidden="true" />
                </Tooltip>
            )
    }
}

const MDX = ({ body }) => (
    <MDXProvider components={{}}>
        <MDXRenderer>{body}</MDXRenderer>
    </MDXProvider>
)

const Contributors = (props) => {
    const [expanded, setExpanded] = useState(false)
    const contributors = expanded ? props.contributors : props.contributors.slice(0, 3)
    const more = props.contributors.length - 3
    return (
        <div className={`flex flex-col gap-2 -mx-4 mb-4`}>
            {contributors.map(({ avatar, username, profile, url }) => {
                return (
                    <Contributor
                        url={profile?.squeakId ? `/community/profiles/${profile.squeakId}` : url}
                        image={profile?.avatar?.url || avatar}
                        name={profile ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') : username}
                        key={username}
                        role={profile?.companyRole || 'Contributor'}
                        text
                        compact
                        roundedImage={!profile}
                    />
                )
            })}
            {more > 0 && !expanded && (
                <button onClick={() => setExpanded(true)} className="flex items-center mx-4 space-x-2">
                    <span className="flex-shrink-0 text-sm font-bold text-left text-red">+{more} more</span>
                </button>
            )}
        </div>
    )
}

export const HandbookSidebar = ({ contributors, title, location, availability, related }) => {
    return (
        <>
            {location.pathname.startsWith('/docs/cdp/destinations') &&
                location.pathname !== '/docs/cdp/destinations' && (
                    <div className="p-4 mb-8 rounded-md border bg-accent dark:bg-accent-dark border-border dark:border-dark">
                        <h5 className="m-0 text-lg font-bold leading-tight">Did somebody say destinations?</h5>
                        <p className="text-sm m-0 mb-3 mt-1.5">
                            We're building more destinations and prioritzing them based on your feedback.
                        </p>
                        <CallToAction size="sm" to="/cdp#library">
                            Browse the library
                        </CallToAction>
                    </div>
                )}
            {contributors && (
                <SidebarSection title="Contributors">
                    <Contributors contributors={contributors} />
                </SidebarSection>
            )}

            {availability && (
                <SidebarSection title="Feature availability" className="space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                        <span>Free / Open-source</span>
                        {renderAvailabilityIcon(availability.free)}
                    </div>
                    <div className="flex justify-between items-center font-bold">
                        <span>Self-serve</span>
                        {renderAvailabilityIcon(availability.selfServe)}
                    </div>
                    {availability.teams && (
                        <div className="flex justify-between items-center font-bold">
                            <span>Teams</span>
                            {renderAvailabilityIcon(availability.teams)}
                        </div>
                    )}
                    <div className="flex justify-between items-center font-bold">
                        <span>Enterprise</span>
                        {renderAvailabilityIcon(availability.enterprise)}
                    </div>
                </SidebarSection>
            )}

            {related && (
                <SidebarSection title="Related articles">
                    <ul className="p-0 space-y-1.5">
                        {related.map(({ childMdx }) => (
                            <li key={childMdx.fields.slug} className="list-none">
                                <Link to={childMdx.fields.slug} className="block text-sm">
                                    {childMdx.frontmatter.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </SidebarSection>
            )}
        </>
    )
}

type AppParametersProps = {
    config:
        | {
              key: string
              name: string | null
              required: boolean | null
              type: string | null
              hint: string | null
              description: string | null
          }[]
        | null
}

type TemplateParametersProps =
    | {
          templateId: string
          name: string
          type: string
          inputs_schema:
              | {
                    key: string
                    type: string | null
                    label: string | null
                    description: string | null
                    default?: string | null
                    secret?: boolean | null
                    required?: boolean | null
                }[]
              | null
      }[]
    | null

export const AppParametersFactory: (params: AppParametersProps) => React.FC = ({ config }) => {
    const AppParameters = () => {
        if (!config) {
            return null
        }

        return (
            <table>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {config.map((option) => {
                        if (!option.name) {
                            return null
                        }

                        return (
                            <tr key={option.key}>
                                <td>
                                    <div className="mb-6">
                                        <code className="p-1 rounded dark:bg-gray-accent-dark dark:text-white bg-gray-accent-light text-inherit">
                                            {option.name}
                                        </code>
                                    </div>

                                    {option.type && (
                                        <div>
                                            <strong>Type: </strong>
                                            <span>{option.type}</span>
                                        </div>
                                    )}

                                    <div>
                                        <strong>Required: </strong>
                                        <span>{option.required ? 'True' : 'False'}</span>
                                    </div>
                                </td>

                                <td>
                                    {option.description || option.hint ? (
                                        <Markdown>{option.description || option.hint || ''}</Markdown>
                                    ) : null}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    return AppParameters
}

export const TemplateParametersFactory: (params: TemplateParametersProps) => React.FC<{ templateId?: string }> = (
    templateConfigs
) => {
    const TemplateParameters = ({ templateId }: { templateId?: string }) => {
        const template = templateConfigs?.find((t) => t.templateId === templateId) || templateConfigs?.[0]
        const inputs_schema = template?.inputs_schema
        if (!inputs_schema) {
            return null
        }

        return (
            <div>
                <Configuration inputs_schema={inputs_schema} />
                <APIExamples
                    name={template?.name}
                    inputs_schema={inputs_schema}
                    id={template?.templateId}
                    type={template?.type}
                />
            </div>
        )
    }

    return TemplateParameters
}

export default function Handbook({
    data: { post, nextPost, glossary },
    pageContext: { menu, breadcrumb = [], breadcrumbBase, tableOfContents, searchFilter },
    location,
}) {
    const {
        body,
        frontmatter,
        fields: { slug, contributors, appConfig, templateConfigs, contentWithSnippets },
    } = post
    const {
        title,
        description,
        showTitle,
        hideAnchor,
        hideLastUpdated,
        features,
        github,
        availability,
        thumbnail,
        related,
        seo,
    } = frontmatter
    const { parent, excerpt } = post
    const lastUpdated = parent?.fields?.gitLogLatestDate
    const showToc = !hideAnchor && tableOfContents?.length > 0
    const filePath = post?.parent?.relativePath

    const isArticle = frontmatter.isArticle !== false

    const A = (props) => (
        <Link
            {...props}
            glossary={glossary?.nodes?.map(formatNode)}
            className="font-semibold text-red hover:text-red"
        />
    )

    const components = {
        Team,
        inlineCode: InlineCode,
        blockquote: Blockquote,
        pre: MdxCodeBlock,
        MultiLanguage: MdxCodeBlock,
        h1: (props) => Heading({ as: 'h1', ...props }),
        h2: (props) => Heading({ as: 'h2', ...props }),
        h3: (props) => Heading({ as: 'h3', ...props }),
        h4: (props) => Heading({ as: 'h4', ...props }),
        h5: (props) => Heading({ as: 'h5', ...props }),
        h6: (props) => Heading({ as: 'h6', ...props }),
        img: ZoomImage,
        a: A,
        TestimonialsTable,
        AppParameters: AppParametersFactory({ config: appConfig }),
        TemplateParameters: TemplateParametersFactory(templateConfigs),
        TeamRoadmap: (props) => TeamRoadmap({ team: title?.replace(/team/gi, '').trim(), ...props }),
        TeamMembers: (props) => TeamMembers({ team: title?.replace(/team/gi, '').trim(), ...props }),
        CategoryData,
        TutorialTags,
        Emoji,
        TeamUpdate: (props) => TeamUpdate({ teamName: title?.replace(/team/gi, '').trim(), ...props }),
        CopyCode,
        TeamMember,
        DestinationsLibraryCallout,
        IsEU,
        IsUS,
        table: (props) => (
            <OverflowXSection>
                <table {...props} />
            </OverflowXSection>
        ),
        ...shortcodes,
    }

    return (
        <>
            <SEO
                title={seo?.metaTitle || `${title} - ${breadcrumbBase.name} - PostHog`}
                description={seo?.metaDescription || excerpt}
                article
                image={`${process.env.GATSBY_CLOUDFRONT_OG_URL}/${slug.replace(/\//g, '')}.jpeg`}
                imageType="absolute"
            />
            <Layout>
                <PostLayout
                    searchFilter={searchFilter}
                    title={title}
                    filePath={filePath}
                    questions={
                        <div id="squeak-questions" className="pb-8">
                            <CommunityQuestions />
                        </div>
                    }
                    menu={menu}
                    menuWidth={{ left: 400 }}
                    sidebar={
                        <HandbookSidebar
                            contributors={contributors}
                            availability={availability}
                            related={related}
                            location={location}
                            title={title}
                        />
                    }
                    tableOfContents={[...tableOfContents, { depth: 0, value: 'Questions?', url: 'squeak-questions' }]}
                    breadcrumb={[breadcrumbBase, ...(breadcrumb?.slice(0, breadcrumb.length - 1) || [])]}
                    hideSidebar={hideAnchor}
                    nextPost={nextPost}
                    askMax
                >
                    <section>
                        <div className="relative mb-8">
                            <div className="flex flex-wrap justify-between items-center mt-0">
                                <div className="flex flex-col-reverse mb-1 space-x-2 w-full md:flex-row md:items-center">
                                    {thumbnail && <GatsbyImage image={getImage(thumbnail)} />}
                                    {showTitle !== false && (
                                        <div className="flex-1">
                                            <h1 className="m-0 text-3xl dark:text-white sm:text-4xl">{title}</h1>
                                            {description && (
                                                <p className="mt-1 mb-0 italic leading-tight opacity-75">
                                                    {description}
                                                </p>
                                            )}
                                            {(!hideLastUpdated || filePath || contentWithSnippets) && (
                                                <div className="flex items-center mb-4 space-x-2 text-black md:mt-1 md:mb-0 dark:text-white">
                                                    {!hideLastUpdated && (
                                                        <p className="m-0 font-semibold text-primary/30 dark:text-primary-dark/30">
                                                            Last updated: <time>{lastUpdated}</time>
                                                        </p>
                                                    )}
                                                    {!hideLastUpdated && filePath && (
                                                        <span className="text-primary/30 dark:text-primary-dark/30">
                                                            |
                                                        </span>
                                                    )}
                                                    {filePath && (
                                                        <Link
                                                            className="text-primary/30 dark:text-primary-dark/30 hover:text-red dark:hover:text-yellow"
                                                            to={`https://github.com/PostHog/posthog.com/tree/master/contents/${filePath}`}
                                                        >
                                                            Edit this page
                                                        </Link>
                                                    )}
                                                    {contentWithSnippets && (!hideLastUpdated || filePath) && (
                                                        <span className="text-primary/30 dark:text-primary-dark/30">
                                                            |
                                                        </span>
                                                    )}
                                                    {contentWithSnippets && (
                                                        <CopyMarkdownActionsDropdown
                                                            markdownContent={contentWithSnippets}
                                                            pageUrl={
                                                                typeof window !== 'undefined'
                                                                    ? window.location.href
                                                                    : undefined
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {github && (
                                        <Link to={github}>
                                            <GitHub className="w-8 h-8 transition-colors text-black/80 hover:text-black/60 dark:text-white/80 hover:dark:text-white/60" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="lg:hidden">
                            {showToc && <MobileSidebar tableOfContents={tableOfContents} />}
                        </div>
                        {features && <LibraryFeatures availability={features} />}
                        <div className={isArticle && 'article-content'}>
                            <MDXProvider components={components}>
                                <MDXRenderer>{body}</MDXRenderer>
                            </MDXProvider>
                        </div>
                    </section>
                </PostLayout>
            </Layout>
        </>
    )
}

export const query = graphql`
    query HandbookQuery($id: String!, $nextURL: String!, $links: [String!]!) {
        glossary: allMdx(filter: { fields: { slug: { in: $links } } }) {
            nodes {
                fields {
                    slug
                }
                frontmatter {
                    title
                    featuredVideo
                }
                excerpt(pruneLength: 300)
            }
        }
        nextPost: mdx(fields: { slug: { eq: $nextURL } }) {
            excerpt(pruneLength: 500)
            frontmatter {
                title
            }
            fields {
                slug
            }
        }
        post: mdx(id: { eq: $id }) {
            id
            body
            excerpt(pruneLength: 150)
            fields {
                slug
                appConfig {
                    key
                    name
                    required
                    type
                    hint
                    description
                }
                contributors {
                    url
                    username
                    teamData {
                        name
                    }
                    avatar
                    profile {
                        squeakId
                        firstName
                        lastName
                        companyRole
                        avatar {
                            url
                        }
                    }
                }
                templateConfigs {
                    templateId
                    name
                    type
                    inputs_schema {
                        key
                        type
                        label
                        secret
                        required
                        description
                    }
                }
                contentWithSnippets
            }
            frontmatter {
                title
                description
                showTitle
                hideAnchor
                hideLastUpdated
                github
                isArticle
                features {
                    eventCapture
                    userIdentification
                    autoCapture
                    sessionRecording
                    featureFlags
                    groupAnalytics
                    surveys
                    llmObservability
                    errorTracking
                }
                availability {
                    free
                    selfServe
                    teams
                    enterprise
                }
                thumbnail {
                    childImageSharp {
                        gatsbyImageData(placeholder: NONE, width: 36)
                    }
                }
                related {
                    childMdx {
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                        }
                    }
                }
                featuredImage {
                    publicURL
                }
                seo {
                    ...SEOFragment
                }
            }
            parent {
                ... on File {
                    relativePath
                    fields {
                        gitLogLatestDate(formatString: "MMM DD, YYYY")
                    }
                }
            }
        }
    }
`
