import { GatsbyNode } from 'gatsby'
import fetch from 'node-fetch'
import parseLinkHeader from 'parse-link-header'
import qs from 'qs'
import { ApiInfoModel, MenuBuilder, OpenAPIParser } from 'redoc'
import type {
    MetaobjectsCollection,
    MetaobjectsReferencesEdge,
    MetaobjectsResponseData,
} from '../src/templates/merch/types'
import dayjs from 'dayjs'

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({ actions, createContentDigest, createNodeId }) => {
    const { createNode } = actions

    const openApiSpecUrl = process.env.POSTHOG_OPEN_API_SPEC_URL || 'https://app.posthog.com/api/schema/'
    const spec = await fetch(openApiSpecUrl, {
        headers: {
            Accept: 'application/json',
        },
    }).then((res) => res.json())

    const parser = new OpenAPIParser(spec)
    const menu = MenuBuilder.buildStructure(parser, {} as any)

    let all_endpoints = menu[menu.length - 1]['items'] // all grouped endpoints
    const maxEndpointItems = 20
    all_endpoints = all_endpoints.flatMap((endpoint) => {
        if (endpoint.items.length > maxEndpointItems) {
            const chunks = []
            for (let i = 0; i < endpoint.items.length; i += maxEndpointItems) {
                const next =
                    i + maxEndpointItems < endpoint.items.length &&
                    `${endpoint.name}-${Math.floor(i / maxEndpointItems) + 2}`
                const name = i === 0 ? endpoint.name : `${endpoint.name}-${Math.floor(i / maxEndpointItems) + 1}`
                const chunk = {
                    ...endpoint,
                    name,
                    items: endpoint.items.slice(i, i + maxEndpointItems),
                    next,
                }
                chunks.push(chunk)
            }
            return chunks
        }
        return endpoint
    })
    all_endpoints.forEach((endpoint) => {
        const node = {
            id: createNodeId(`api_endpoint-${endpoint.name}`),
            internal: {
                type: `api_endpoint`,
                contentDigest: createContentDigest({
                    items: endpoint.items,
                }),
            },
            items: JSON.stringify(
                endpoint.items.map((item) => ({ ...item, operationSpec: item.operationSpec, parent: null }))
            ),
            schema: endpoint.items.map((item) => ({ ...item, operationSpec: item.operationSpec, parent: null })),
            url: '/docs/api/' + endpoint.name.replace(/_/g, '-'),
            name: endpoint.name,
            nextURL: endpoint.next ? '/docs/api/' + endpoint.next.replace(/_/g, '-') : null,
        }
        createNode(node)
    })
    createNode({
        id: createNodeId(`api_endpoint-components`),
        internal: {
            type: `ApiComponents`,
            contentDigest: createContentDigest({
                components: spec.components,
            }),
        },
        components: JSON.stringify(spec.components),
    })

    const postHogIssues = await fetch(
        'https://api.github.com/repos/posthog/posthog/issues?sort=comments&per_page=5'
    ).then((res) => res.json())
    postHogIssues.forEach((issue) => {
        const { html_url, title, number, user, comments, reactions, labels, body, updated_at } = issue
        const data = {
            url: html_url,
            title,
            number,
            comments,
            user: {
                username: user?.login,
                avatar: user?.avatar_url,
                url: user?.html_url,
            },
            reactions,
            labels,
            body,
            updated_at,
        }
        if (data.reactions) {
            data.reactions.plus1 = data.reactions['+1']
            data.reactions.minus1 = data.reactions['-1']
        }
        const node = {
            id: createNodeId(`posthog-issue-${title}`),
            parent: null,
            children: [],
            internal: {
                type: `PostHogIssue`,
                contentDigest: createContentDigest(data),
            },
            ...data,
        }
        createNode(node)
    })

    const postHogPulls = await fetch(
        'https://api.github.com/repos/posthog/posthog/pulls?sort=popularity&per_page=5'
    ).then((res) => res.json())
    postHogPulls.forEach((issue) => {
        const { html_url, title, number, user, labels, body, updated_at } = issue
        const data = {
            url: html_url,
            title,
            number,
            user: {
                username: user?.login,
                avatar: user?.avatar_url,
                url: user?.html_url,
            },
            labels,
            body,
            updated_at,
        }

        const node = {
            id: createNodeId(`posthog-pull-${title}`),
            parent: null,
            children: [],
            internal: {
                type: `PostHogPull`,
                contentDigest: createContentDigest(data),
            },
            ...data,
        }
        createNode(node)
    })

    const createGitHubStatsNode = async (owner, repo) => {
        const repoStats = await fetch(`https://api.github.com/repos/${owner}/${repo}`).then((res) => res.json())
        const contributors = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1`).then(
            (res) => {
                const link = parseLinkHeader(res.headers.get('link'))
                const number = link?.last?.page
                return number && Number(number)
            }
        )
        const commits = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`).then((res) => {
            const link = parseLinkHeader(res.headers.get('link'))
            const number = link?.last?.page
            return number && Number(number)
        })
        const { stargazers_count, forks_count } = repoStats

        const data = {
            owner,
            repo,
            stars: stargazers_count,
            forks: forks_count,
            commits,
            contributors,
        }

        const node = {
            id: createNodeId(`github-stats-${repo}`),
            parent: null,
            children: [],
            internal: {
                type: `GitHubStats`,
                contentDigest: createContentDigest(data),
            },
            ...data,
        }
        createNode(node)
    }

    await createGitHubStatsNode('posthog', 'posthog')
    await createGitHubStatsNode('posthog', 'posthog.com')

    const createProductDataNode = async () => {
        const url = `${process.env.BILLING_SERVICE_URL + '/api/products-v2'}`
        const headers = {
            'Content-Type': 'application/json',
        }
        const productData = await fetch(url, {
            method: 'GET',
            headers: headers,
        }).then((res) => res.json())
        const { products } = productData

        const data = {
            products,
        }

        const node = {
            id: createNodeId(`posting-product-data`),
            parent: null,
            children: [],
            internal: {
                type: `ProductData`,
                contentDigest: createContentDigest(data),
            },
            ...data,
        }
        createNode(node)
    }
    await createProductDataNode()

    const integrations = await fetch(
        'https://raw.githubusercontent.com/PostHog/integrations-repository/main/integrations.json'
    ).then((res) => res.json())
    integrations.forEach((integration) => {
        const { name, url, ...other } = integration
        const node = {
            id: createNodeId(`integration-${name}`),
            parent: null,
            children: [],
            internal: {
                type: `Integration`,
                contentDigest: createContentDigest(integration),
            },
            url: url.replace('https://posthog.com', ''),
            name,
            ...other,
        }
        createNode(node)
    })

    const createRoadmapItems = async (page = 1) => {
        const roadmapQuery = qs.stringify(
            {
                pagination: {
                    page,
                    pageSize: 100,
                },
                populate: ['image', 'teams', 'topic', 'cta'],
            },
            {
                encodeValuesOnly: true,
            }
        )
        const roadmapsURL = `${process.env.GATSBY_SQUEAK_API_HOST}/api/roadmaps?${roadmapQuery}`
        const { data: roadmaps, meta } = await fetch(roadmapsURL).then((res) => res.json())
        roadmaps.forEach((roadmap) => {
            const {
                id,
                attributes: { image, projectedCompletion, dateCompleted, category, ...other },
            } = roadmap

            const date = dateCompleted || projectedCompletion
            const year = date && Number(dayjs(date).format('YYYY'))

            const cloudinaryMedia = {
                ...image,
                cloudName: process.env.GATSBY_CLOUDINARY_CLOUD_NAME,
                publicId: image?.data?.attributes?.provider_metadata?.public_id,
                originalHeight: image?.data?.attributes?.height,
                originalWidth: image?.data?.attributes?.width,
                originalFormat: (image?.data?.attributes?.ext || '').replace('.', ''),
            }

            const data = {
                strapiID: id,
                date,
                media: cloudinaryMedia,
                type: category,
                year,
                ...other,
            }
            const roadmapNode = {
                id: createNodeId(`roadmap-${id}`),
                parent: null,
                children: [],
                internal: {
                    type: `Roadmap`,
                    contentDigest: createContentDigest(data),
                },
                ...data,
            }
            createNode(roadmapNode)
        })
        if (meta?.pagination?.pageCount > meta?.pagination?.page) await createRoadmapItems(page + 1)
    }
    await createRoadmapItems()

    const postCategories = await fetch(`${process.env.GATSBY_SQUEAK_API_HOST}/api/post-categories?populate=*`).then(
        (res) => res.json()
    )

    postCategories.data.forEach(({ id, ...other }) => {
        const node = {
            id: createNodeId(`post-category-${id}`),
            internal: {
                type: `PostCategory`,
                contentDigest: createContentDigest(other),
            },
            ...other,
        }
        createNode(node)
    })

    /**
     * Source a list of metaobjects from shopify representing the nav list of collections
     * and create new Gatsby nodes
     */
    const shopifyURL = process.env.GATSBY_MYSHOPIFY_URL
    const shopifyAdminAPIVersion = process.env.GATSBY_SHOPIFY_ADMIN_API_VERSION
    const shopifyAdminAPIAPIPassword = process.env.SHOPIFY_APP_PASSWORD

    if (shopifyURL && shopifyAdminAPIVersion && shopifyAdminAPIAPIPassword) {
        let responseData: MetaobjectsResponseData | undefined

        try {
            const response = await fetch(`https://${shopifyURL}/admin/api/${shopifyAdminAPIVersion}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': shopifyAdminAPIAPIPassword!,
                },
                body: JSON.stringify({
                    query: `
                    {
                        metaobjects(type: "merch_navigation", first: 100) {
                            edges {
                              node {
                                fields {
                                  references(first: 5) {
                                    edges {
                                        node {
                                            __typename
                                            ...on Collection {
                                              title
                                              handle
                                              id
                                            }    
                                        }
                                    }
                                  }
                                }
                              }
                            }
                          }
                      }
                      
                  `,
                }),
            })

            responseData = (await response.json()) as MetaobjectsResponseData
        } catch (error) {
            throw new Error(error)
        }

        // we want the collection "All Products" to always be at the top of the list
        const collections: MetaobjectsCollection[] =
            responseData.data.metaobjects.edges[0].node.fields[0].references.edges
                .map((item: MetaobjectsReferencesEdge) => ({
                    title: item.node.title,
                    handle: item.node.handle,
                }))
                .sort((a: MetaobjectsCollection, b: MetaobjectsCollection) =>
                    a.handle === 'frontpage' ? -1 : b.handle === 'frontpage' ? 1 : 0
                )

        collections.forEach((collection, i) => {
            const node = {
                url: `/merch/${collection.handle}`,
                title: collection.title,
                handle: collection.handle,
                id: createNodeId(`MerchNavigation-${i}`),
                parent: null,
                children: [],
                internal: {
                    type: `MerchNavigation`,
                    contentDigest: createContentDigest(collection),
                },
            }

            createNode(node)
        })

        const getCollectionByHandle = async (handle: string) => {
            const collection = await fetch(`https://${shopifyURL}/admin/api/${shopifyAdminAPIVersion}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': shopifyAdminAPIAPIPassword!,
                },
                body: JSON.stringify({
                    query: ` {
                collectionByHandle(handle: "${handle}") {
                  handle
                  products(first: 250) {
                    nodes {
                      description
                      descriptionHtml
                      featuredMedia {
                        preview {
                          image {
                            width
                            height
                            originalSrc
                          }
                        }
                      }
                      handle
                      id
                      media(first: 250) {
                        nodes {
                          mediaContentType
                          preview {
                            image {
                              width
                              height
                              originalSrc
                            }
                          }
                        }
                      }
                      metafields(first: 250) {
                        nodes {
                          value
                          key
                        }
                      }
                      options {
                        shopifyId: id
                        name
                        values
                      }
                      priceRangeV2 {
                        maxVariantPrice {
                          amount
                        }
                        minVariantPrice {
                          amount
                        }
                      }
                      shopifyId: id
                      status
                      title
                      tags
                      totalInventory
                    }
                  }
                }
              } 
                  `,
                }),
            }).then((res) => res.json())
            return collection
        }

        const getAllVariants = async () => {
            let allVariants = []
            let hasNextPage = true
            let cursor = null

            while (hasNextPage) {
                const response = await fetch(`https://${shopifyURL}/admin/api/${shopifyAdminAPIVersion}/graphql.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': shopifyAdminAPIAPIPassword!,
                    },
                    body: JSON.stringify({
                        query: `{
                            productVariants(first: 250${cursor ? `, after: "${cursor}"` : ''}) {
                                pageInfo {
                                    hasNextPage
                                    endCursor
                                }
                                nodes {
                                    inventoryPolicy
                                    availableForSale
                                    media(first: 250) {
                                        nodes {
                                            preview {
                                                image {
                                                    width
                                                    height
                                                    originalSrc
                                                }
                                            }
                                        }
                                    }
                                    price
                                    product {
                                        shopifyId: id
                                        title
                                        featuredMedia {
                                            preview {
                                                image {
                                                    width
                                                    height
                                                    originalSrc
                                                }
                                            }
                                        }
                                    }
                                    selectedOptions {
                                        name
                                        value
                                    }
                                    shopifyId: id
                                    sku
                                    title
                                }
                            }
                        }`,
                    }),
                }).then((res) => res.json())

                const { nodes, pageInfo } = response.data.productVariants
                allVariants = [...allVariants, ...nodes]
                hasNextPage = pageInfo.hasNextPage
                cursor = pageInfo.endCursor
            }

            return { data: { productVariants: { nodes: allVariants } } }
        }

        const variants = await getAllVariants()

        const createShopifyNodesByCollectionHandle = async (handle: string) => {
            const collection = await getCollectionByHandle(handle)

            const moveNodesToParent = (obj) => {
                if (Array.isArray(obj)) {
                    return obj.map(moveNodesToParent)
                } else if (obj && typeof obj === 'object') {
                    if (obj.nodes) {
                        return moveNodesToParent(obj.nodes)
                    }
                    return Object.fromEntries(
                        Object.entries(obj).map(([key, value]) => [key, moveNodesToParent(value)])
                    )
                }
                return obj
            }

            const products = moveNodesToParent(collection.data.collectionByHandle.products.nodes).filter(
                (product) => product.status === 'ACTIVE'
            )
            products.forEach((product) => {
                product.variants = moveNodesToParent(
                    variants.data.productVariants.nodes.filter(
                        (variant) => variant.product.shopifyId === product.shopifyId
                    )
                )
                const node = {
                    id: createNodeId(`shopify-product-${product.shopifyId}`),
                    internal: {
                        type: 'ShopifyProduct',
                        contentDigest: createContentDigest(product),
                    },
                    ...product,
                }
                createNode(node)
            })
            const data = {
                handle: collection.data.collectionByHandle.handle,
                products: products.map((product) => ({ shopifyId: product.shopifyId })),
            }
            const node = {
                id: createNodeId(`shopify-collection-${handle}`),
                internal: {
                    type: 'ShopifyCollection',
                    contentDigest: createContentDigest(data),
                },
                ...data,
            }
            createNode(node)
        }

        await createShopifyNodesByCollectionHandle('frontpage')
        await createShopifyNodesByCollectionHandle('kits')
    }

    const fetchSlackEmojis = async () => {
        const slackToken = process.env.SLACK_API_KEY
        const { emoji } = await fetch('https://slack.com/api/emoji.list', {
            headers: {
                Authorization: `Bearer ${slackToken}`,
            },
        }).then((res) => res.json())
        Object.entries(emoji).forEach(([name, url]) => {
            const node = {
                id: createNodeId(`slack-emoji-${name}`),
                internal: {
                    type: 'SlackEmoji',
                    contentDigest: createContentDigest(url),
                },
                name,
                url,
            }
            createNode(node)
        })
    }
    if (process.env.SLACK_API_KEY) {
        await fetchSlackEmojis()
    }
    const fetchG2Reviews = async (url) => {
        const g2Token = process.env.G2_API_KEY
        const { data, links } = await fetch(url, {
            headers: {
                Authorization: `Token ${g2Token}`,
            },
        }).then((res) => res.json())
        if (data?.length > 0) {
            data.forEach((review) => {
                const node = {
                    id: createNodeId(`g2-review-${review.id}`),
                    internal: {
                        type: 'G2Review',
                        contentDigest: createContentDigest(review),
                    },
                    ...review,
                }
                createNode(node)
            })
        }
        if (links?.next) {
            await fetchG2Reviews(links.next)
        }
    }
    if (process.env.G2_API_KEY) {
        await fetchG2Reviews('https://data.g2.com/api/v1/survey-responses?page[size]=100')
    }
    if (
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.GATSBY_CLOUDINARY_CLOUD_NAME
    ) {
        const { resources } = await fetch(
            `https://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${process.env.GATSBY_CLOUDINARY_CLOUD_NAME}/resources/image?prefix=hogs&type=upload&max_results=500`
        ).then((res) => res.json())
        resources.forEach((resource) => {
            const node = {
                id: createNodeId(`cloudinary-image-${resource.public_id}`),
                internal: {
                    type: 'CloudinaryImage',
                    contentDigest: createContentDigest(resource),
                },
                ...resource,
            }
            createNode(node)
        })
    }

    const extractIntroSection = (markdown: string): string => {
        const headingMatch = markdown.match(/^#{1,2}\s+/m)

        if (headingMatch) {
            const headingIndex = markdown.indexOf(headingMatch[0])
            return markdown.substring(0, headingIndex).trim()
        }

        return markdown
    }

    const extractGettingStartedSection = (markdown: string): string => {
        const gettingStartedMatch = markdown.match(/^#{1,2}\s+Getting started\s*$/im)

        if (gettingStartedMatch) {
            const startIndex = markdown.indexOf(gettingStartedMatch[0])
            const afterHeading = markdown.substring(startIndex + gettingStartedMatch[0].length)

            const nextHeadingMatch = afterHeading.match(/^#+\s+/m)

            if (nextHeadingMatch) {
                const endIndex = afterHeading.indexOf(nextHeadingMatch[0])
                return '## Installation\n\n' + afterHeading.substring(0, endIndex).trim()
            }

            return '## Installation\n\n' + afterHeading.trim()
        }

        return ''
    }

    const fetchPostHogPipelines = async (
        type: 'transformation' | 'destination',
        generateSlug: (pipeline: any) => string
    ) => {
        const { results } = await fetch(
            `https://us.posthog.com/api/public_hog_function_templates?type=${type}&limit=350`
        ).then((res) => res.json())
        await Promise.all(
            results.map(async (pipeline) => {
                let additionalData = {}

                if (pipeline.id.startsWith('segment-')) {
                    const cleanMarkdown = (markdown: string) => {
                        return markdown
                            .replaceAll(/^---[\s\S]*?---/g, '') // Remove frontmatter
                            .replaceAll(/{%\s*.*?\s*%}/g, '') // Remove {% ... %}
                            .replaceAll(/{:.*?}/g, '') // Remove {: ... }
                            .replaceAll(/{{.*?}}/g, '') // Remove {{ ... }}
                            .replaceAll('Segment', 'PostHog')
                            .replaceAll('Connections > Catalog', 'Data pipelines')
                            .replaceAll('Catalog', 'Data pipelines')
                            .replaceAll(' (Actions)', '')
                            .replaceAll('segmentio', 'posthog')
                            .replaceAll(/\[([^\]]+)\]\(https?:\/\/[^\/]*segment\.com[^)]*\)(\s*\{:.*?\})?/g, '$1') // Remove segment.com links completely, keeping only the link text
                            .replaceAll(/> \w+ ""/g, '')
                            .replaceAll(
                                /> \*\*Good to know\*\*: This page is about the \[Actions-framework\].*?Both of these destinations receive data from PostHog\./g,
                                ''
                            ) // Remove banner regarding the Actions-framework
                            .replaceAll(
                                /^.*(?:maintains this destination|maintained by|contact.*support|support.*team).*$/gm,
                                ''
                            ) // Remove lines about other companies maintaining destinations or contact support
                            .trim()
                    }

                    const response = await fetch(
                        `https://raw.githubusercontent.com/posthog/segment-docs/refs/heads/develop/src/connections/destinations/catalog/${pipeline.id.replace(
                            'segment-',
                            ''
                        )}/index.md`
                    )
                    let markdown = await response.text()
                    if (response.status !== 200) markdown = ''
                    markdown = cleanMarkdown(markdown)

                    additionalData = {
                        introSnippet: extractIntroSection(markdown),
                        installationSnippet: extractGettingStartedSection(markdown),
                    }
                }

                const slug = generateSlug(pipeline)
                const node = {
                    id: createNodeId(`posthog-pipeline-${pipeline.id}`),
                    internal: {
                        type: 'PostHogPipeline',
                        contentDigest: createContentDigest({ pipeline }),
                    },
                    pipelineId: pipeline.id,
                    slug,
                    type,
                    ...pipeline,
                    ...additionalData,
                }
                createNode(node)
            })
        )
    }

    await fetchPostHogPipelines('transformation', (pipeline) => pipeline.id.replace('plugin-', ''))
    await fetchPostHogPipelines('destination', (pipeline) => pipeline.id.replace('template-', ''))
}
