import { Link } from 'react-scroll'
import Scrollspy from 'react-scrollspy'
import '@fontsource/source-code-pro'
import { CodeBlock, SingleCodeBlock } from 'components/CodeBlock'
import Layout from 'components/Layout'
import { SEO } from 'components/seo'
import 'core-js/features/array/at'
import { graphql } from 'gatsby'
import { getCookie, setCookie } from 'lib/utils'
import * as OpenAPISampler from 'openapi-sampler'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import PostLayout from 'components/PostLayout'
import CommunityQuestions from 'components/CommunityQuestions'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { shortcodes } from '../mdxGlobalComponents'
import { MdxCodeBlock } from 'components/CodeBlock'
import { InlineCode } from 'components/InlineCode'
import { docsMenu } from '../navs'
import { CallToAction } from 'components/CallToAction'

const mapVerbsColor = {
    get: 'blue',
    post: 'green',
    patch: 'orange',
    put: 'green',
    delete: 'red',
}

function Endpoints({ paths }) {
    const urlItems = []
    Object.entries(paths).map(([path, value]) => Object.keys(value).map((verb) => urlItems.push(pathID(verb, path))))

    return (
        <div>
            <h3>Endpoints</h3>
            <table className="table-auto">
                <Scrollspy
                    offset={-50}
                    className="list-none m-0 p-0 flex flex-col space-y-2"
                    items={urlItems}
                    currentClassName="active-link"
                >
                    {Object.entries(paths).map(([path, value]) => (
                        <React.Fragment key={value}>
                            {Object.keys(value).map((verb) => (
                                <tr
                                    key={verb}
                                    className="border-gray-accent-light dark:border-gray-accent-dark border-solid border-b first:border-t-0 last:border-b-0"
                                >
                                    <td>
                                        <code className={`method text-${mapVerbsColor[verb]}`}>
                                            {verb.toUpperCase()}
                                        </code>
                                    </td>
                                    <td>
                                        <Link
                                            offset={-50}
                                            className="cursor-pointer"
                                            smooth
                                            duration={300}
                                            to={pathID(verb, path)}
                                            hashSpy
                                            spy
                                        >
                                            <code>{path.replaceAll('{', ':').replaceAll('}', '')}</code>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </Scrollspy>
            </table>
        </div>
    )
}

function humanReadableName(name) {
    name = name.replace('_partial', '').split('_')
    if (name.length > 1) {
        name = name.slice(0, name.length - 1) // Remove _list, _retrieve etc
    }
    return name.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
}

const titleMap: Record<string, string> = {
    actions: 'Actions',
    activity_log: 'Activity log',
    annotations: 'Annotations',
    batch_exports: 'Batch exports',
    cohorts: 'Cohorts',
    dashboards: 'Dashboards',
    dashboard_templates: 'Dashboard templates',
    early_access_feature: 'Early access features',
    environments: 'Environments',
    event_definitions: 'Event definitions',
    events: 'Events',
    experiments: 'Experiments',
    feature_flags: 'Feature flags',
    groups: 'Groups',
    groups_types: 'Groups types',
    hog_functions: 'Hog functions',
    insights: 'Insights',
    invites: 'Invites',
    members: 'Members',
    notebooks: 'Notebooks',
    organizations: 'Organizations',
    persons: 'Persons',
    projects: 'Projects',
    property_definitions: 'Property definitions',
    query: 'Query',
    roles: 'Roles',
    session_recordings: 'Session recordings',
    session_recording_playlists: 'Session recording playlists',
    sessions: 'Sessions',
    subscriptions: 'Subscriptions',
    surveys: 'Survey',
    users: 'Users',
    web_analytics: 'Web analytics',
    data_model: 'Data model',
}

const verbMap = {
    get: 'Retrieve',
    post: 'Create',
    patch: 'Update',
    delete: 'Delete',
}
function generateName(item) {
    let name = item.operationId.split('_')
    name = name.slice(0, name.length - 1).join(' ')
    name = name.replace(' partial', '')
    if (item.operationId.includes('_list')) {
        return 'List all ' + name.toLowerCase()
    }

    return verbMap[item.httpVerb] + ' ' + name.toLowerCase()
}

function pathID(verb, path) {
    return verb + path.replaceAll('/', '-').replaceAll('{', '').replaceAll('}', '').slice(0, -1)
}

function Params({ params, objects, object, depth = 0 }) {
    if (depth > 4) return null
    if (object) {
        params = Object.entries(object.properties).map(([key, value]) => {
            return {
                name: key,
                schema: value,
            }
        })
    }
    const [openSubParams, setOpenSubParams] = useState([])

    return (
        <>
            <ul className="list-none pl-0">
                {params.map((param, index) => (
                    <li key={index} className="py-1  first:border-0">
                        <div className="grid" style={{ gridTemplateColumns: '40% 60%' }}>
                            <div className="flex flex-col">
                                <span className="font-code font-semibold text-[13px] leading-7">{param.name}</span>
                                {param.schema.items?.$ref && (
                                    <>
                                        {openSubParams.indexOf(param.schema.items.$ref) > -1 ? (
                                            <div
                                                type="link"
                                                className="group cursor-pointer h-[18px] w-[26px] rounded inline-flex justify-center items-center mb-2 bg-gray-accent hover:bg-gray-accent-light-hover dark:bg-gray-accent-dark dark:hover:bg-gray-accent-dark-hover leading-[8px] text-black dark:text-white"
                                                onClick={() => {
                                                    setOpenSubParams(
                                                        openSubParams.filter((item) => item !== param.schema.items.$ref)
                                                    )
                                                }}
                                            >
                                                <svg
                                                    className="fill-current opacity-90 group-hover:opacity-100"
                                                    width="16"
                                                    height="5"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <title>Click to close</title>
                                                    <path d="M2.336 4.192c1.08 0 1.872-.792 1.872-1.848S3.416.496 2.336.496C1.28.496.464 1.288.464 2.344s.816 1.848 1.872 1.848ZM7.84 4.192c1.08 0 1.871-.792 1.871-1.848S8.92.496 7.84.496c-1.056 0-1.872.792-1.872 1.848s.816 1.848 1.872 1.848ZM13.342 4.192c1.08 0 1.872-.792 1.872-1.848S14.422.496 13.342.496c-1.056 0-1.872.792-1.872 1.848s.816 1.848 1.872 1.848Z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    type="link"
                                                    className="group cursor-pointer h-[18px] w-[26px] rounded inline-flex justify-center items-center mb-2 bg-tan border-gray-accent-light dark:border-gray-accent-dark border-solid border hover:bg-gray-accent-light-hover dark:bg-gray-accent-dark dark:hover:bg-gray-accent-dark-hover leading-[8px] text-black dark:text-white"
                                                    onClick={() =>
                                                        setOpenSubParams([...openSubParams, param.schema.items.$ref])
                                                    }
                                                >
                                                    <svg
                                                        className="fill-current opacity-50 group-hover:opacity-75"
                                                        width="16"
                                                        height="5"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <title>Click to open</title>
                                                        <path d="M2.336 4.192c1.08 0 1.872-.792 1.872-1.848S3.416.496 2.336.496C1.28.496.464 1.288.464 2.344s.816 1.848 1.872 1.848ZM7.84 4.192c1.08 0 1.871-.792 1.871-1.848S8.92.496 7.84.496c-1.056 0-1.872.792-1.872 1.848s.816 1.848 1.872 1.848ZM13.342 4.192c1.08 0 1.872-.792 1.872-1.848S14.422.496 13.342.496c-1.056 0-1.872.792-1.872 1.848s.816 1.848 1.872 1.848Z" />
                                                    </svg>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="">
                                <div>
                                    <span className="type bg-gray-accent-light dark:bg-gray-accent-dark inline-block px-[4px] py-[2px] text-sm rounded-sm">
                                        {param.schema.type}
                                    </span>
                                </div>
                                {param.schema.default !== undefined && param.schema.default !== null && (
                                    <>
                                        <div>
                                            <span className="text-sm">
                                                Default: <code>{String(param.schema.default)}</code>
                                            </span>
                                        </div>
                                    </>
                                )}
                                {param.schema.enum && (
                                    <>
                                        <div className="text-sm">
                                            One of:{' '}
                                            {param.schema.enum
                                                .filter((item) => item && item !== '')
                                                .map((item) => (
                                                    <code className="mr-1" key={item}>
                                                        "{item}"
                                                    </code>
                                                ))}{' '}
                                        </div>
                                    </>
                                )}
                                <div className="text-sm pt-2">
                                    <ReactMarkdown>{param.schema.description || param.description}</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {param.schema.items?.$ref && (
                            <>
                                {openSubParams.indexOf(param.schema.items.$ref) > -1 ? (
                                    <div>
                                        <div className="params-wrapper bg-gray-accent-light dark:bg-gray-accent-dark rounded px-4 mr-2 my-1">
                                            <Params
                                                objects={objects}
                                                object={objects.schemas[param.schema.items?.$ref.split('/').at(-1)]}
                                                depth={depth + 1}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </>
    )
}
function Parameters({ item, objects }) {
    const pathParams = item.parameters?.filter((param) => param.in === 'path')
    const queryParams = item.parameters?.filter((param) => param.in === 'query')

    return (
        <>
            {pathParams?.length > 0 && (
                <div>
                    <h4>Path parameters</h4>
                    <Params params={pathParams} objects={objects} />
                </div>
            )}
            {queryParams?.length > 0 && (
                <div>
                    <h4>Query parameters</h4>
                    <Params params={queryParams} objects={objects} />
                </div>
            )}
        </>
    )
}

function Security({ item }) {
    const personaApiKeyScopes = item.security?.[0]?.['PersonalAPIKeyAuth']

    return (
        <>
            {personaApiKeyScopes?.length && (
                <div>
                    <h4>Required API key scopes</h4>
                    <div className="flex items-center gap-2">
                        {personaApiKeyScopes.map((x) => (
                            <code key={x}>{x}</code>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

function RequestBody({ item, objects }) {
    const objectKey =
        item.requestBody?.content?.['application/json']?.schema['$ref'].split('/').at(-1) ||
        item.requestBody?.content?.['application/json']?.schema.items['$ref'].split('/').at(-1)
    if (!objectKey) return null
    const object = objects.schemas[objectKey]

    return (
        <div>
            <h4>Request parameters</h4>
            <Params
                params={Object.entries(object.properties)
                    .map(([name, schema]) => {
                        return {
                            name,
                            schema,
                        }
                    })
                    .filter((item) => !item.schema.readOnly)}
                objects={objects}
            />
        </div>
    )
}

function ResponseBody({ item, objects }) {
    const objectKey = item.responses[Object.keys(item.responses)[0]]?.content?.['application/json']?.schema['$ref']
        ?.split('/')
        .at(-1)
    if (!objectKey) return null
    const object = objects.schemas[objectKey]
    const [showResponse, setShowResponse] = useState(false)

    return (
        <>
            <h4>Response</h4>
            <div className="response-wrapper">
                <button className="mt-2 text-sm text-red font-semibold" onClick={() => setShowResponse(!showResponse)}>
                    {showResponse ? 'Hide' : 'Show'} response
                </button>
                <br />
                {showResponse && (
                    <Params
                        params={Object.entries(object.properties)
                            .map(([name, schema]) => {
                                return {
                                    name,
                                    schema,
                                }
                            })
                            .filter((item) => !item.schema.readOnly)}
                        objects={objects}
                    />
                )}
            </div>
        </>
    )
}

function RequestExample({ name, item, objects, exampleLanguage, setExampleLanguage }) {
    let params = []

    if (item.requestBody) {
        const objectKey = item.requestBody.content?.['application/json']?.schema['$ref']?.split('/').at(-1)
        if (!objectKey) return null
        const object = objects.schemas[objectKey]
        params = Object.entries(object.properties).filter(
            ([name, schema]) => object.required?.indexOf(name) > -1 && !schema.readOnly
        )
        // If no params are required, just grab the first relevant one as an example
        if (params.length === 0) {
            params = [Object.entries(object.properties).filter(([name]) => ['id', 'short_id'].indexOf(name) === -1)[0]]
        }
        params = params.map(([name, schema]) => {
            return [
                name,
                schema.items?.$ref === '#/components/schemas/FilterEvent'
                    ? [{ id: '$pageview' }]
                    : schema.example || schema.type,
            ]
        })
    }

    const path: string = item.pathName.replaceAll('{', ':').replaceAll('}', '')

    // If the object name ends with 's', remove the 's'
    const object: string = name.charAt(name.length - 1) === 's' ? name.slice(0, -1) : name
    const object_noun: string = object.replaceAll('_', ' ')

    const additionalPathParams =
        item.parameters
            ?.filter((param) => param.in === 'path')
            .filter((param) => !['project_id', 'id'].includes(param.name)) || []

    const languages = [
        {
            label: 'cURL',
            language: 'bash',
            code: `
            export POSTHOG_PERSONAL_API_KEY=[your personal api key]
curl ${item.httpVerb === 'delete' ? ' -X DELETE ' : item.httpVerb == 'patch' ? '-X PATCH ' : ''}${
                item.httpVerb === 'post' ? "\n    -H 'Content-Type: application/json'" : ''
            }\\
    -H "Authorization: Bearer $POSTHOG_PERSONAL_API_KEY" \\
    <ph_app_host>${path}${params.map((item) => `\\\n\t-d ${item[0]}=${JSON.stringify(item[1])}`)}
            `,
        },
        {
            label: 'Python',
            language: 'python',
            code: `
api_key = "[your personal api key]"
project_id = "[your project id]"
response = requests.${item.httpVerb}(
    "<ph_app_host>${item.pathName.replace('{id}', `{${object}_id}`)}".format(
        project_id=project_id${item.pathName.includes('{id}') ? `,\n\t\t${object}_id="<the ${object_noun} id>"` : ''}${
                additionalPathParams.length > 0
                    ? additionalPathParams.map(
                          (param) => `,\n\t\t${param.name}="<the ${param.name.replaceAll('_', ' ')}>"`
                      )
                    : ''
            }
    ),
    headers={"Authorization": "Bearer {}".format(api_key)},${
        params.length > 0
            ? `\n\tdata=${JSON.stringify(Object.fromEntries(params), null, '\t')
                  .replaceAll('\n', '\n\t')
                  .replace('\n}', '\n\t}')}`
            : ''
    }
)${item.httpVerb !== 'delete' ? '.json()' : ''}
            `,
        },
    ]

    const currentLanguage = languages.find((l) => l.language === exampleLanguage) || languages[0]

    return (
        <CodeBlock
            selector="dropdown"
            currentLanguage={currentLanguage}
            onChange={({ language }) => setExampleLanguage(language)}
            label={
                <div className="code-example flex text-xs space-x-1.5 my-1">
                    <code className={`shrink-0 text-${mapVerbsColor[item.httpVerb]}`}>
                        {item.httpVerb.toUpperCase()}{' '}
                    </code>
                    <code className="min-w-0 break-words">
                        {path.split('/').map((token) => {
                            if (token === '') {
                                return <wbr key={token} />
                            } else {
                                return (
                                    <>
                                        <wbr />/{token}
                                    </>
                                )
                            }
                        })}
                    </code>
                </div>
            }
        >
            {languages}
        </CodeBlock>
    )
}

function ResponseExample({ item, objects, objectKey }) {
    if (!objectKey) {
        return null
    }

    let response

    try {
        // Check if there are examples in the API spec
        const firstResponseKey = Object.keys(item.responses || {})[0]
        const responseSpec = item.responses?.[firstResponseKey]
        const examples = responseSpec?.content?.['application/json']?.examples

        if (examples) {
            const firstExampleKey = Object.keys(examples)[0]
            const exampleValue = examples[firstExampleKey]?.value

            if (exampleValue !== undefined) {
                response = JSON.stringify(exampleValue, null, 2)
            }
        }
    } catch (error) {
        // Continue to fallback
    }

    // Fallback to generated example if no real example exists
    if (!response) {
        try {
            response = JSON.stringify(
                OpenAPISampler.sample(objects.schemas[objectKey], {}, { components: objects }),
                null,
                2
            )
        } catch (error) {
            response = JSON.stringify({ message: 'No example available' }, null, 2)
        }
    }

    return (
        <SingleCodeBlock
            showCopy={false}
            label={<span className="text-xs font-semibold">RESPONSE</span>}
            language="javascript"
        >
            {response}
        </SingleCodeBlock>
    )
}

const pathDescription = (item) => {
    const name = humanReadableName(item.operationId).toLowerCase()
    if (item.operationId.includes('_list')) {
        return (
            <>
                Returns a list of {name}. The {name} are returned in sorted order, with the most recent charges
                appearing first.
            </>
        )
    }
    if (item.httpVerb === 'get') {
        return <>Returns a single {name.slice(0, -1)}, which you can request by passing through an id in the url. </>
    }
    if (item.httpVerb === 'post') {
        return (
            <>
                Create {name}. You need to pass through any required fields, and you can optionally pass through other
                fields.
            </>
        )
    }
    if (item.httpVerb === 'patch') {
        return (
            <>Update {name} by setting the values of the parameters passed. Any parameters not set will be unchanged.</>
        )
    }
}

export default function ApiEndpoint({ data, pageContext: { menu, breadcrumb, breadcrumbBase, tableOfContents } }) {
    const {
        apiComponents: { components: apiComponents },
        allMdx,
    } = data
    const name = data.data.name
    const title = titleMap[name] || humanReadableName(name)
    const nextURL = data.data.nextURL
    const paths = {}
    const components = {
        inlineCode: InlineCode,
        pre: MdxCodeBlock,
        MultiLanguage: MdxCodeBlock,
        ...shortcodes,
    }
    // Filter PUT as it's basically the same as PATCH
    const items = JSON.parse(data.data.items).filter((item) => item.httpVerb !== 'put')
    items.map((item) => {
        if (!paths[item.path]) {
            paths[item.path] = {}
        }
        paths[item.path][item.httpVerb] = item.operationSpec
    })
    const objects = JSON.parse(apiComponents)

    const [exampleLanguage, setExampleLanguageState] = useState()

    const setExampleLanguage = (language) => {
        setCookie('api_docs_example_language', language)
        setExampleLanguageState(language)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setExampleLanguageState(getCookie('api_docs_example_language') || 'curl')
        }
    }, [])

    // Find overview.mdx node for this API entity
    const overviewNode = allMdx.nodes?.find((node) => node.slug === `docs/api/${name}/overview`)

    return (
        <Layout parent={docsMenu} activeInternalMenu={docsMenu.children.find(({ name }) => name === 'Product OS')}>
            <SEO title={`${title} API Reference - PostHog`} />
            <PostLayout
                title={title}
                questions={<CommunityQuestions />}
                menu={menu}
                tableOfContents={tableOfContents}
                fullWidthContent={true}
                hideSidebar
                breadcrumb={[breadcrumbBase, ...(breadcrumb || [])]}
            >
                <h2 className="!mt-0">{title}</h2>
                <blockquote className="p-6 mb-4 rounded bg-gray-accent-light dark:bg-gray-accent-dark">
                    <p>
                        For instructions on how to authenticate to use this endpoint, see{' '}
                        <a className="text-red hover:text-red font-semibold" href="/docs/api/overview">
                            API overview
                        </a>
                        .
                    </p>
                </blockquote>

                {overviewNode?.body && (
                    <div className="article-content mt-6">
                        <MDXProvider components={components}>
                            <MDXRenderer>{overviewNode.body}</MDXRenderer>
                        </MDXProvider>
                    </div>
                )}

                <ReactMarkdown>{items[0].operationSpec?.description}</ReactMarkdown>

                <Endpoints paths={paths} />

                {items.map((item) => {
                    item = item.operationSpec
                    const mdxNode = allMdx.nodes?.find((node) => node.slug.split('/').pop() === item.operationId)

                    return (
                        <div className="mt-8" key={item.operationId}>
                            <div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                                id={pathID(item.httpVerb, item.pathName)}
                            >
                                <div className="space-y-6">
                                    <h2>{generateName(item)}</h2>
                                    {mdxNode?.body && (
                                        <div className="article-content">
                                            <MDXProvider components={components}>
                                                <MDXRenderer>{mdxNode.body}</MDXRenderer>
                                            </MDXProvider>
                                        </div>
                                    )}
                                    <ReactMarkdown>
                                        {!item.description || item.description === items[0].operationSpec?.description
                                            ? pathDescription(item)
                                            : item.description}
                                    </ReactMarkdown>
                                    <Security item={item} objects={objects} />
                                    <Parameters item={item} objects={objects} />

                                    <RequestBody item={item} objects={objects} />

                                    <ResponseBody item={item} objects={objects} />
                                </div>
                                <div className="lg:sticky top-[108px]">
                                    <h4>Request</h4>
                                    <RequestExample
                                        name={name}
                                        item={item}
                                        objects={objects}
                                        exampleLanguage={exampleLanguage}
                                        setExampleLanguage={setExampleLanguage}
                                    />

                                    <h4>Response</h4>
                                    {Object.keys(item.responses).map((statusCode) => {
                                        const response = item.responses[statusCode]
                                        return (
                                            <div key={statusCode}>
                                                <h5 className="text-sm font-semibold">
                                                    <span className="bg-gray-accent-light dark:bg-gray-accent-dark inline-block px-[4px] py-[2px] text-sm rounded-sm">
                                                        Status {statusCode}
                                                    </span>{' '}
                                                    {response.description}
                                                </h5>
                                                <ResponseExample
                                                    item={item}
                                                    objects={objects}
                                                    objectKey={
                                                        response.content?.['application/json']?.schema['$ref']
                                                            ?.split('/')
                                                            .at(-1) ||
                                                        response.content?.['application/json']?.schema.items['$ref']
                                                            ?.split('/')
                                                            .at(-1)
                                                    }
                                                    exampleLanguage={exampleLanguage}
                                                    setExampleLanguage={setExampleLanguage}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {nextURL && (
                    <CallToAction className="mt-8" to={nextURL}>
                        Next page →
                    </CallToAction>
                )}
            </PostLayout>
        </Layout>
    )
}

export const query = graphql`
    query ApiEndpoint($id: String!, $regex: String!) {
        allMdx(filter: { fields: { slug: { regex: $regex } } }) {
            nodes {
                slug
                body
            }
        }
        data: apiEndpoint(id: { eq: $id }) {
            id
            internal {
                content
                description
                ignoreType
                mediaType
            }
            items
            name
            url
            nextURL
        }
        apiComponents: apiComponents {
            components
        }
    }
`
