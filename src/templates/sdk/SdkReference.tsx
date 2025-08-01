import React from 'react'
import Layout from '../../components/Layout'
import SEO from '../../components/seo'
import PostLayout from '../../components/PostLayout'
import CommunityQuestions from '../../components/CommunityQuestions'
import { docsMenu } from '../../navs'
import ReactMarkdown from 'react-markdown'
import Accordion from '../../components/SdkReferences/Accordion'
import Parameters from '../../components/SdkReferences/Parameters'
import FunctionReturn from '../../components/SdkReferences/Return'
import FunctionExamples from '../../components/SdkReferences/Examples'
import CopyMarkdownActionsDropdown from '../../components/MarkdownActionsDropdown'
import { useLocation } from '@reach/router'
import Link from '../../components/Link'
import { getLanguageFromSdkId } from '../../components/SdkReferences/utils'
import { Heading } from '../../components/Heading'

interface Parameter {
    name: string
    type: string
    description: string
    isOptional: boolean
}

interface Example {
    id: string
    name: string
    code: string
}

interface SdkFunction {
    id: string
    title: string
    description: string
    category: string
    showDocs: boolean
    examples: Example[]
    params: Parameter[]
    returnType: {
        id: string
        name: string
    }
    returnDescription?: string
    details: string
    releaseTag?: string
}

interface Class {
    id: string
    title: string
    description: string
    functions: SdkFunction[]
}

interface SdkReferenceData {
    id: string
    hogRef: string
    noDocsTypes: string[]
    info: {
        description: string
        id: string
        slugPrefix: string
        specUrl: string
        title: string
        version: string
    }
    classes: Class[]
}

interface PageContext {
    fullReference: SdkReferenceData
    types: string[]
}

const padDescription = (description: string): string => {
    return description.replace(/\n/g, '\n\n')
}

// Group functions by category, but Initialization always first, and "Other methods" for uncategorized
function groupFunctionsByCategory(functions: SdkFunction[]): { label: string | null; functions: SdkFunction[] }[] {
    // Filter out null/undefined functions and those with showDocs === false
    const validFunctions = functions.filter((func): func is SdkFunction => func != null && func.showDocs !== false)

    // Initialization always first
    const initialization = validFunctions.filter((func) => func.category === 'Initialization')

    // Group others by category (excluding Initialization and empty/undefined category)
    const categoryMap: Record<string, SdkFunction[]> = {}
    validFunctions.forEach((func) => {
        if (func.category && func.category !== 'Initialization') {
            if (!categoryMap[func.category]) {
                categoryMap[func.category] = []
            }
            categoryMap[func.category].push(func)
        }
    })

    // Find functions with no category or empty category (excluding Initialization)
    const noCategory = validFunctions.filter((func) => !func.category || func.category.trim() === '')

    // Build ordered list: Initialization, then each category (alphabetical), then "Other methods"
    const ordered: { label: string | null; functions: SdkFunction[] }[] = []

    if (initialization.length > 0) {
        ordered.push({ label: 'Initialization', functions: initialization })
    }

    // Sort categories alphabetically, but "Other methods" is not a category
    const sortedCategories = Object.keys(categoryMap).sort()
    for (const cat of sortedCategories) {
        ordered.push({ label: cat, functions: categoryMap[cat] })
    }

    if (noCategory.length > 0) {
        ordered.push({ label: null, functions: noCategory })
    }

    return ordered
}

export default function SdkReference({ pageContext }: { pageContext: PageContext }) {
    const { fullReference } = pageContext

    const activeInternalMenu = docsMenu.children.find(({ name }): boolean => name === 'Product OS')
    const location = useLocation()

    // Get the language for this SDK reference
    const sdkLanguage = getLanguageFromSdkId(fullReference.info.id)
    const validTypes = pageContext.types
    // Badge styling based on release tag
    const getBadgeClasses = (releaseTag: string): string => {
        switch (releaseTag.toLowerCase()) {
            case 'public':
                return `bg-blue/10 text-blue dark:text-blue font-medium text-xs m-[-2px] rounded-sm px-1 py-0.5 inline-block`
            case 'deprecated':
                return `bg-orange/10 text-orange dark:text-orange font-medium text-xs m-[-2px] rounded-sm px-1 py-0.5 inline-block`
            default:
                return `bg-red/10 text-red dark:text-red font-medium text-xs m-[-2px] rounded-sm px-1 py-0.5 inline-block`
        }
    }

    return (
        <Layout parent={docsMenu} activeInternalMenu={activeInternalMenu}>
            <SEO title={`${fullReference.info.title} - PostHog`} />
            <PostLayout
                title={fullReference.info.title}
                questions={<CommunityQuestions />}
                menu={activeInternalMenu?.children || []}
                fullWidthContent={true}
                hideSidebar
            >
                <section>
                    <div className="mb-8 relative">
                        <div className="flex items-center mt-0 flex-wrap justify-between">
                            <div className="flex flex-col-reverse md:flex-row md:items-center space-x-2 mb-1 w-full">
                                <div className="flex-1">
                                    <h1 className="dark:text-white text-3xl sm:text-4xl m-0">
                                        {fullReference.info.title}
                                    </h1>
                                    <div className="flex space-x-2 items-center mb-4 md:mt-1 md:mb-0 text-black dark:text-white">
                                        <p className="m-0 font-semibold text-primary/30 dark:text-primary-dark/30">
                                            SDK Version: {fullReference.info.version}
                                        </p>

                                        <span className="text-primary/30 dark:text-primary-dark/30">|</span>
                                        <Link
                                            className="text-primary/30 dark:text-primary-dark/30 hover:text-red dark:hover:text-yellow"
                                            to={fullReference.info.specUrl}
                                        >
                                            Edit this page
                                        </Link>
                                        <span className="text-primary/30 dark:text-primary-dark/30">|</span>
                                        <CopyMarkdownActionsDropdown
                                            markdownContent={JSON.stringify(fullReference, null, 2)}
                                            pageUrl={location.href}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        {fullReference.classes.map((classData) => (
                            <div key={classData.id} className="mb-12">
                                <h2 className="text-3xl font-bold mb-4">{classData.title}</h2>
                                <ReactMarkdown>{padDescription(classData.description)}</ReactMarkdown>

                                {groupFunctionsByCategory(classData.functions).map(({ label, functions }) => (
                                    <div key={label || 'other-methods'}>
                                        {/* Only show a heading if label is not null and not "Other methods" */}
                                        {label && <h3 className="text-xl font-semibold mb-2 mt-8">{label} methods</h3>}
                                        {/* If label is null, show "Other methods" heading */}
                                        {!label && <h3 className="text-xl font-semibold mb-2 mt-8">Other methods</h3>}
                                        {functions.map((func) => (
                                            <div
                                                key={func.id}
                                                className="border-gray-accent-light dark:border-gray-accent-dark border-solid border-b first:border-t-0 last:border-b-0 py-8"
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                                    <div className="space-y-6">
                                                        <Heading
                                                            as="h4"
                                                            id={func.id}
                                                            className="text-lg my-0 font-bold"
                                                        >
                                                            <code>{func.title}</code>
                                                            {func.releaseTag && (
                                                                <span
                                                                    className={`${getBadgeClasses(
                                                                        func.releaseTag
                                                                    )} ml-2`}
                                                                >
                                                                    {func.releaseTag}
                                                                </span>
                                                            )}
                                                        </Heading>
                                                        {func.description && (
                                                            <ReactMarkdown>
                                                                {padDescription(func.description)}
                                                            </ReactMarkdown>
                                                        )}
                                                        {func.details && (
                                                            <Accordion title="Notes:">
                                                                <ReactMarkdown>{func.details}</ReactMarkdown>
                                                            </Accordion>
                                                        )}
                                                        <Parameters
                                                            slugPrefix={fullReference.info.slugPrefix}
                                                            params={func.params}
                                                            validTypes={validTypes}
                                                        />
                                                    </div>

                                                    <div className="lg:sticky top-[108px] space-y-6">
                                                        <FunctionExamples
                                                            examples={func.examples}
                                                            language={sdkLanguage}
                                                        />
                                                        <FunctionReturn
                                                            slugPrefix={fullReference.info.slugPrefix}
                                                            returnType={func.returnType}
                                                            validTypes={validTypes}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </PostLayout>
        </Layout>
    )
}
